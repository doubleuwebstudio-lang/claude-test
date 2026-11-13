// 2027 디지털 다이어리(굿노트·노타빌리티용 PDF) 생성기
// 사용법: node diary-2027/build.js ENFP   → diary-2027/out/2027-diary-ENFP.pdf 와 미리보기 PNG
// MBTI 글자 4개가 각각 속지 모듈을 정한다:
//   E/I  하루 칸 표시(기분 날씨+만난 사람 / 에너지 배터리) · 부록(사람 기록 / 충전 노트)
//   N/S  부록(아이디어 주차장 / 월별 가계부)
//   T/F  주간·월간 회고 칸(숫자 회고 / 감사·감정 기록)
//   J/P  주간 형식(시간 블록 / 딱 3개) · 목표 페이지 · 부록(프로젝트 역산 / 언젠가 할 일)
// HTML로 페이지를 그리고 크로미움으로 PDF를 뽑는다. <a href="#id"> 는 PDF 안에서 눌러 이동하는 링크가 된다.
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");
const TYPES = require("./types.js");

const TYPE = (process.argv[2] || "ENFP").toUpperCase();
if (!/^[EI][NS][TF][JP]$/.test(TYPE)) { console.error(`MBTI 네 글자를 넣어 주세요. 예: node diary-2027/build.js ISTJ`); process.exit(1); }
const T = TYPES[TYPE];
if (!T) { console.error(`아직 내용이 없는 유형이에요: ${TYPE}. types.js 에 추가해 주세요.`); process.exit(1); }
const [E, N, TT, J] = [TYPE[0] === "E", TYPE[1] === "N", TYPE[2] === "T", TYPE[3] === "J"];
const PAL = { NF: ["#2e9a6b", "#e6f4ec", "NF · 초록"], NT: ["#7a4fd6", "#efe9fb", "NT · 보라"], SJ: ["#3567c9", "#e8effb", "SJ · 파랑"], SP: ["#c48700", "#fbf2dc", "SP · 노랑"] };
const [ACC, TINT, GROUP] = PAL[N ? "N" + TYPE[2] : "S" + TYPE[3]];

// 글자별 모듈 설명 (사용법·표지에 그대로 쓴다)
const MOD = {
  E: ["사람 기록", "하루 칸마다 기분 날씨와 '만난 사람' 한 줄. 부록 '사람 기록'에 약속과 선물 메모를 남겨요."],
  I: ["에너지 배터리", "하루 칸마다 배터리 5칸을 남은 만큼 칠해요. 부록 '충전 노트'에 나를 채우는 것을 모아 둬요."],
  N: ["아이디어 주차장", "떠오른 아이디어를 주차장에 세워 두고 설렘 지수와 다음 행동 하나만 적어요."],
  S: ["월별 가계부", "매달 가계부 한 장. 날짜·항목·금액만 적으면 한 달 합계가 보여요."],
  T: ["숫자 회고", "주간·월간 회고를 숫자로 해요. 계획 몇 개 중 몇 개, 운동 몇 번, 지출 얼마."],
  F: ["감사·감정 기록", "매주 감사 3줄, 매달 가장 행복했던 순간과 고마운 사람을 적어요."],
  J: ["시간 블록 주간", "주간 페이지를 시간 칸으로 계획해요. 큰 일은 부록 '프로젝트 역산'에서 마감부터 거꾸로 쪼개요."],
  P: ["딱 3개 주간", "주간엔 할 일을 3개만 정해요. 날짜를 못 정한 일은 부록 '언젠가 할 일'에 세워 둬요."],
};
const SECTIONS = [
  E ? { id: "e", label: "사람", n: 2, title: "사람 기록" } : { id: "r", label: "충전", n: 2, title: "충전 노트" },
  N ? { id: "i", label: "아이디어", n: 4, title: "아이디어 주차장" } : { id: "l", label: "가계부", n: 12, title: "가계부" },
  J ? { id: "j", label: "프로젝트", n: 4, title: "프로젝트 역산" } : { id: "s", label: "언젠가", n: 2, title: "언젠가 할 일" },
];

const YEAR = 2027;
const W = 768, H = 1024;                     // 아이패드 세로 비율(3:4)
const WEEK0 = new Date(YEAR - 1, 11, 28);    // 2027년 첫 주의 월요일 (12월 28일)
const DAY = 864e5;
const HOLIDAYS = { "1-1": "신정", "3-1": "삼일절", "5-5": "어린이날", "6-6": "현충일", "8-15": "광복절", "10-3": "개천절", "10-9": "한글날", "12-25": "성탄절" };
const WD = ["월", "화", "수", "목", "금", "토", "일"];
const d = (y, m, dd) => new Date(y, m, dd);
const add = (dt, n) => new Date(dt.getFullYear(), dt.getMonth(), dt.getDate() + n);
const weekOf = (dt) => Math.floor((Date.UTC(dt.getFullYear(), dt.getMonth(), dt.getDate()) - Date.UTC(WEEK0.getFullYear(), WEEK0.getMonth(), WEEK0.getDate())) / DAY / 7);
const WEEKS = weekOf(d(YEAR, 11, 31)) + 1;
const hol = (dt) => HOLIDAYS[`${dt.getMonth() + 1}-${dt.getDate()}`];
const dayClass = (dt) => (hol(dt) || dt.getDay() === 0 ? "sun" : dt.getDay() === 6 ? "sat" : "");
const md = (dt) => `${dt.getMonth() + 1}.${dt.getDate()}`;
const lines = (n, cls = "ln") => Array.from({ length: n }, () => `<div class="${cls}"></div>`).join("");
const indicator = () => (E ? `<i class="mood"><u></u><u></u><u></u></i>` : `<i class="bat">${"<u></u>".repeat(5)}</i>`);

function tabs(active) {
  const items = [["year", "연간"], ["goals", "목표"]];
  for (let m = 1; m <= 12; m++) items.push([`m${m}`, `${m}월`]);
  items.push(["h1", "습관"], ...SECTIONS.map((s) => [`${s.id}1`, s.label]), ["n1", "메모"]);
  return `<nav class="tabs">${items.map(([id, label]) => `<a href="#${id}" class="${active === id ? "on" : ""}">${label}</a>`).join("")}</nav>`;
}
const page = (id, active, body, cls = "") => `<section class="page ${cls}" id="${id}">${body}${active === null ? "" : tabs(active)}</section>`;
const head = (kicker, title, word, kickerHref) => `<header class="ph row"><div>${kickerHref ? `<a class="kicker" href="#${kickerHref}">${kicker} ←</a>` : `<span class="kicker">${kicker}</span>`}<h1>${title}</h1></div>${word ? `<p class="word">${word}</p>` : ""}</header>`;

// ---------- 앞부분 ----------
function cover() {
  return page("cover", null, `
    <div class="cover">
      <div class="c-top"><span>DIGITAL DIARY</span><span>${GROUP}</span></div>
      <div class="c-year">${YEAR}</div>
      <div class="c-sub">정미년 · 붉은 양의 해</div>
      <div class="c-type">${TYPE}<small>EDITION</small></div>
      <div class="c-tag">${T.nickname}</div>
      <div class="c-mods">${[...TYPE].map((ch) => `<span><b>${ch}</b>${MOD[ch][0]}</span>`).join("")}</div>
      <div class="c-name">이 다이어리의 주인<span></span></div>
      <a class="c-go" href="#guide">시작하기 →</a>
    </div>`, "cover-page");
}

function guide() {
  const parts = [["연간 달력", 1, "year"], ["올해 목표", 1, "goals"], ["월간", 12, "m1"], ["주간", WEEKS, "w0"], ["습관 트래커", 12, "h1"], ...SECTIONS.map((s) => [s.title, s.n, `${s.id}1`]), ["메모", 5, "n1"]];
  return page("guide", "", `
    <header class="ph"><span class="kicker">${TYPE} 다이어리 사용법</span><h1>${T.tagline}</h1></header>
    <p class="lead">표지만 바꾼 다이어리가 아니에요. <b>${TYPE}의 글자 4개가 속지 구성을 하나씩 바꿨어요.</b></p>
    <ol class="guide">${[...TYPE].map((ch) => `<li><span class="lt">${ch}</span><b>${MOD[ch][0]}</b><p>${MOD[ch][1]}</p></li>`).join("")}</ol>
    <div class="parts"><h2>이 다이어리에 들어 있는 것</h2>
      <div class="pg">${parts.map(([n, c, id]) => `<a href="#${id}"><b>${c}</b><span>${n}</span></a>`).join("")}</div></div>
    <div class="map"><h2>이렇게 이동해요</h2><ul>
      <li>오른쪽 <b>탭</b>을 누르면 연간 · 목표 · 월 · 습관 · 부록 · 메모로 바로 가요.</li>
      <li>월간 달력에서 <b>날짜</b>를 누르면 그 주의 주간 페이지로 가요.</li>
      <li>주간 페이지 위쪽 <b>월 이름</b>을 누르면 다시 월간으로 돌아가요.</li></ul></div>`);
}

function miniMonth(m) {
  const first = d(YEAR, m, 1), lead = (first.getDay() + 6) % 7, days = new Date(YEAR, m + 1, 0).getDate();
  let cells = "";
  for (let i = 0; i < lead; i++) cells += "<span></span>";
  for (let k = 1; k <= days; k++) { const dt = d(YEAR, m, k); cells += `<a href="#w${weekOf(dt)}" class="${dayClass(dt)}">${k}</a>`; }
  return `<div class="mini"><a class="mt" href="#m${m + 1}">${m + 1}월</a><div class="mh">${WD.map((w, i) => `<span class="${i === 6 ? "sun" : i === 5 ? "sat" : ""}">${w}</span>`).join("")}</div><div class="mg">${cells}</div></div>`;
}
const year = () => page("year", "year", `<header class="ph"><span class="kicker">${YEAR} 한눈에 보기</span><h1>올해의 지도</h1></header><div class="year">${Array.from({ length: 12 }, (_, m) => miniMonth(m)).join("")}</div>`);

// J: 목표 3개 + 분기 계획 / P: 해보고 싶은 것 20 → 끝까지 할 3개
function goals() {
  if (J) return page("goals", "goals", `
    ${head(`${YEAR} 정미년`, "올해 목표와 분기 계획")}
    <div class="gj">${[1, 2, 3].map((i) => `<div class="gbox"><span class="no">${i}</span><div class="gl"><b>목표</b>${lines(1)}</div><div class="gl"><b>왜</b>${lines(1)}</div><div class="gl"><b>숫자로 재면</b>${lines(1)}</div></div>`).join("")}</div>
    <div class="quarters">${["1분기 1–3월", "2분기 4–6월", "3분기 7–9월", "4분기 10–12월"].map((q) => `<div class="q"><h2>${q}</h2>${lines(4)}</div>`).join("")}</div>`);
  return page("goals", "goals", `
    ${head(`${YEAR} 정미년`, "2027 해보고 싶은 것 20")}
    <div class="goals">
      <div class="list">${Array.from({ length: 20 }, (_, i) => `<div class="ln"><span>${i + 1}</span></div>`).join("")}</div>
      <div class="side"><h2>그중 끝까지 할 3개</h2>${[1, 2, 3].map((i) => `<div class="pick"><span>${i}</span></div>`).join("")}
        <h2>올해 나의 키워드</h2><div class="kw"></div><p class="hint">붉은 양의 해. 따뜻하게, 그러나 내 속도로.</p></div>
    </div>`);
}

// ---------- 월간 ----------
function monthBoxes(m) {
  const b1 = `<div class="box"><h2>${J ? "이달 목표 3" : "이달 딱 3개"}</h2>${[1, 2, 3].map((i) => `<div class="ln"><span>${i}</span></div>`).join("")}</div>`;
  const b2 = TT
    ? `<div class="box"><h2>이달의 숫자</h2>${["목표 달성 __ / 3", "운동 __ 회", "독서 __ 권", "지출 ______ 원"].map((t) => `<div class="ln"><em>${t}</em></div>`).join("")}</div>`
    : `<div class="box"><h2>이달의 감정</h2>${["가장 행복했던 순간", "고마운 사람", "다음 달의 나에게"].map((t) => `<div class="ln"><em>${t}</em></div>`).join("")}</div>`;
  const b3 = J
    ? `<div class="box"><h2>이달 마감</h2>${Array.from({ length: 4 }, () => `<div class="ln dl"><span>${m + 1}/</span></div>`).join("")}</div>`
    : `<div class="box"><h2>메모</h2><div class="dots"></div></div>`;
  return b1 + b2 + b3;
}
function month(m) {
  const first = d(YEAR, m, 1), lead = (first.getDay() + 6) % 7, days = new Date(YEAR, m + 1, 0).getDate();
  const rows = Math.ceil((lead + days) / 7);
  let grid = "";
  for (let r = 0; r < rows; r++) {
    const mon = add(first, r * 7 - lead);
    grid += `<a class="wk" href="#w${weekOf(mon)}">W${String(weekOf(mon) + 1).padStart(2, "0")}</a>`;
    for (let c = 0; c < 7; c++) {
      const dt = add(mon, c);
      grid += dt.getMonth() === m
        ? `<a class="cell ${dayClass(dt)}" href="#w${weekOf(dt)}"><span class="n">${dt.getDate()}</span>${hol(dt) ? `<span class="hd">${hol(dt)}</span>` : ""}</a>`
        : `<span class="cell out"></span>`;
    }
  }
  const s = SECTIONS[1];
  return page(`m${m + 1}`, `m${m + 1}`, `
    <header class="ph row"><div><span class="kicker">${YEAR}</span><h1 class="big">${m + 1}월</h1></div><p class="word">${T.monthly[m]}</p></header>
    <div class="cal" style="grid-template-rows: 22px repeat(${rows}, 1fr)">
      <span></span>${WD.map((w, i) => `<span class="dh ${i === 6 ? "sun" : i === 5 ? "sat" : ""}">${w}</span>`).join("")}${grid}
    </div>
    <div class="mfoot">${monthBoxes(m)}</div>
    <div class="links"><a class="jump" href="#h${m + 1}">${m + 1}월 습관 트래커 →</a>${s.id === "l" ? `<a class="jump" href="#l${m + 1}">${m + 1}월 가계부 →</a>` : ""}</div>`);
}

// ---------- 주간 ----------
function weekExtra(cls = "") {
  const s = SECTIONS[1];
  const body = TT
    ? `<div class="dt"><b>이번 주 숫자</b></div>${["계획 __ 개 중 __ 개 완료", "운동 __ 회 · 독서 __ 쪽", "지출 ______ 원", "잘한 점 하나"].map((t) => `<div class="ln"><em>${t}</em></div>`).join("")}`
    : `<div class="dt"><b>이번 주 감사 3줄</b></div>${[1, 2, 3].map((i) => `<div class="ln"><span>${i}</span></div>`).join("")}<div class="ln"><em>이번 주 기분 한 단어</em></div>`;
  return `<div class="day extra ${cls}">${body}<a class="jump" href="#${s.id}1">${s.title} →</a></div>`;
}
function weekP(w, mon, days) {
  const dayBox = (dt, i) => `<div class="day ${dayClass(dt)}${dt.getFullYear() !== YEAR ? " dim" : ""}">
      <div class="dt"><b>${dt.getDate()}</b><span>${WD[i]}</span>${hol(dt) ? `<em>${hol(dt)}</em>` : ""}${indicator()}</div>
      ${E ? `<div class="who">만난 사람</div>` : ""}</div>`;
  return `<div class="week">${days.map(dayBox).join("")}${weekExtra()}</div>`;
}
function weekJ(w, mon, days) {
  const hours = Array.from({ length: 17 }, (_, i) => 7 + i);
  const col = (dt, i) => `<div class="tcol ${dayClass(dt)}${dt.getFullYear() !== YEAR ? " dim" : ""}"><div class="th"><div><b>${dt.getDate()}</b><span>${WD[i]}</span>${hol(dt) ? `<em>${hol(dt)}</em>` : ""}</div>${indicator()}</div>${hours.map(() => "<div class=\"slot\"></div>").join("")}${E ? `<div class="who">만난 사람</div>` : ""}</div>`;
  return `<div class="tgrid"><div class="tlab"><div class="th"></div>${hours.map((h) => `<div class="slot">${h}</div>`).join("")}${E ? `<div class="who"></div>` : ""}</div>${days.map(col).join("")}</div>
    <div class="tfoot">${weekExtra("wide")}<div class="day extra plain"><div class="dt"><b>이번 주 마감</b></div>${lines(4)}</div></div>`;
}
function week(w) {
  const mon = add(WEEK0, w * 7), sun = add(mon, 6), thu = add(mon, 3);
  const days = Array.from({ length: 7 }, (_, i) => add(mon, i));
  return page(`w${w}`, `m${thu.getMonth() + 1}`, `
    <header class="ph row"><div><a class="kicker" href="#m${thu.getMonth() + 1}">${thu.getFullYear()} · ${thu.getMonth() + 1}월 ←</a><h1>W${String(w + 1).padStart(2, "0")} <small>${md(mon)} – ${md(sun)}</small></h1></div>
      <div class="three"><h2>${J ? "이번 주 목표" : "이번 주 딱 3개"}</h2>${[1, 2, 3].map(() => `<div class="ck"><u></u></div>`).join("")}</div></header>
    ${J ? weekJ(w, mon, days) : weekP(w, mon, days)}
    <p class="moodkey">${E ? `기분 날씨 ${["맑음", "구름", "비"].map((l) => `<span><u></u>${l}</span>`).join("")}` : `에너지 배터리 <span class="bat"><u class="f"></u><u class="f"></u><u class="f"></u><u></u><u></u></span> 남은 만큼 칠하기`}</p>`);
}

// ---------- 습관, 부록, 메모 ----------
function habit(m) {
  const days = new Date(YEAR, m + 1, 0).getDate();
  const hd = Array.from({ length: days }, (_, i) => `<span class="${dayClass(d(YEAR, m, i + 1))}">${i + 1}</span>`).join("");
  const rows = Array.from({ length: 8 }, () => `<div class="hr"><span class="hn"></span>${Array.from({ length: days }, () => "<u></u>").join("")}</div>`).join("");
  return page(`h${m + 1}`, "h1", `
    ${head(`${m + 1}월`, "습관 트래커", J ? "빈칸 없이 채운 줄은 굵게 표시해 두세요." : "8칸만 채워도 충분해요. 빠진 날은 그냥 넘어가기.", `m${m + 1}`)}
    <div class="habit" style="--n:${days}"><div class="hr head"><span class="hn">습관</span>${hd}</div>${rows}</div>
    <nav class="hnav">${Array.from({ length: 12 }, (_, i) => `<a href="#h${i + 1}" class="${i === m ? "on" : ""}">${i + 1}</a>`).join("")}</nav>`);
}
const nextLink = (id, i, n) => (i < n ? `<a class="jump next" href="#${id}${i + 1}">다음 장 →</a>` : "");

const SECTION_PAGE = {
  e: (i) => page(`e${i}`, "e1", `
    ${head(`${i} / 2`, "사람 기록", "누구와 무엇을 했는지 한 줄씩. 다음에 만날 때 꺼내 보기 좋아요.")}
    <div class="table t4"><div class="tr th"><span>날짜</span><span>누구</span><span>무엇을</span><span>기억할 것</span></div>${Array.from({ length: 16 }, () => `<div class="tr"><span></span><span></span><span></span><span></span></div>`).join("")}</div>
    <div class="box2"><h2>생일·선물 메모</h2><div class="dots"></div></div>${nextLink("e", i, 2)}`),
  r: (i) => page(`r${i}`, "r1", i === 1 ? `
    ${head("1 / 2", "충전 노트", "혼자서 에너지가 차는 일을 모아 두세요. 배터리가 바닥인 날 여기서 하나 고르기.")}
    <div class="charge">${Array.from({ length: 14 }, () => `<div class="cl"><span></span><i class="bat">${"<u></u>".repeat(5)}</i></div>`).join("")}</div>
    <p class="hint">오른쪽 배터리는 그 일로 얼마나 충전되는지 칠해요.</p>${nextLink("r", i, 2)}` : `
    ${head("2 / 2", "월별 에너지", "한 달을 돌아보며 평균 배터리를 칠하고 한 줄 남기기.")}
    <div class="emonth">${Array.from({ length: 12 }, (_, m) => `<div class="em"><b>${m + 1}월</b><i class="bat">${"<u></u>".repeat(5)}</i><span></span></div>`).join("")}</div>`),
  i: (i) => page(`i${i}`, "i1", `
    ${head(`${i} / 4`, "아이디어 주차장", "지금 당장 안 해도 돼요. 설렘 지수와 다음 행동 하나만 적어 두기.")}
    <div class="ideas">${Array.from({ length: 6 }, () => `<div class="idea"><div class="il"><b>아이디어</b><span></span></div><div class="il"><b>설렘 지수</b><span class="stars">${"<u></u>".repeat(5)}</span></div><div class="il"><b>다음 행동 하나</b><span></span></div><div class="il"><b>출차 날짜</b><span></span></div></div>`).join("")}</div>${nextLink("i", i, 4)}`),
  l: (i) => page(`l${i}`, "l1", `
    ${head(`${i}월`, "가계부", "날짜, 항목, 금액만. 월말에 합계 칸만 채우면 끝.", `m${i}`)}
    <div class="ledger"><div class="table t3"><div class="tr th"><span>날짜</span><span>항목</span><span>금액</span></div>${Array.from({ length: 22 }, () => `<div class="tr"><span></span><span></span><span></span></div>`).join("")}</div>
      <div class="lsum"><h2>${i}월 합계</h2>${["수입", "고정 지출", "생활비", "남은 돈"].map((t) => `<div class="ln"><em>${t}</em></div>`).join("")}<h2 style="margin-top:14px">다음 달 예산</h2><div class="kw small"></div></div></div>
    <nav class="hnav">${Array.from({ length: 12 }, (_, k) => `<a href="#l${k + 1}" class="${k + 1 === i ? "on" : ""}">${k + 1}</a>`).join("")}</nav>`),
  j: (i) => page(`j${i}`, "j1", `
    ${head(`${i} / 4`, "프로젝트 역산", "마감부터 거꾸로. 마지막 단계부터 적고 날짜를 앞으로 당겨요.")}
    <div class="proj"><div class="gl"><b>프로젝트</b>${lines(1)}</div><div class="gl"><b>마감일</b>${lines(1)}</div><div class="gl"><b>끝났다는 기준</b>${lines(1)}</div></div>
    <div class="table t3 steps"><div class="tr th"><span>단계 (마지막부터)</span><span>끝낼 날짜</span><span>완료</span></div>${Array.from({ length: 10 }, (_, k) => `<div class="tr"><span>${10 - k}.</span><span></span><span><u></u></span></div>`).join("")}</div>
    <div class="box2"><h2>걸림돌과 대비책</h2><div class="dots"></div></div>${nextLink("j", i, 4)}`),
  s: (i) => page(`s${i}`, "s1", `
    ${head(`${i} / 2`, "언젠가 할 일", "날짜를 못 정한 일은 여기에. 하고 싶은 마음이 생기면 이번 주 딱 3개로 데려가요.")}
    <div class="someday">${Array.from({ length: 36 }, () => `<div class="sd"><u></u><span></span><i class="lv"><u></u><u></u><u></u></i></div>`).join("")}</div>
    <p class="hint">오른쪽 점 세 개는 지금 하고 싶은 정도예요.</p>${nextLink("s", i, 2)}`),
};
const notes = (i) => page(`n${i}`, "n1", `${head(`${i} / 5`, "메모")}<div class="dots full"></div>${nextLink("n", i, 5)}`);

// ---------- 스타일 ----------
const CSS = `
@page { size: ${W}px ${H}px; margin: 0; }
:root { --ink:#23262d; --muted:#8a909c; --line:#dcdfe5; --soft:#f3f4f6; --acc:${ACC}; --tint:${TINT}; --sun:#d9465b; --sat:#3b6fd4; }
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: "Gothic A1", sans-serif; color: var(--ink); -webkit-print-color-adjust: exact; print-color-adjust: exact; }
a { color: inherit; text-decoration: none; }
u { text-decoration: none; display: inline-block; }
em { font-style: normal; }
.page { width:${W}px; height:${H}px; position: relative; overflow: hidden; break-after: page; background: #fff; padding: 46px 98px 44px 48px; display: flex; flex-direction: column; gap: 16px; }
.tabs { position: absolute; top: 30px; right: 0; width: 62px; display: flex; flex-direction: column; gap: 3px; }
.tabs a { font-size: 11px; font-weight: 600; padding: 6.5px 0 6.5px 11px; border-radius: 10px 0 0 10px; background: var(--soft); color: var(--muted); letter-spacing: -.03em; }
.tabs a.on { background: var(--acc); color: #fff; }
.ph { display: flex; flex-direction: column; gap: 4px; }
.ph.row { flex-direction: row; justify-content: space-between; align-items: flex-end; gap: 20px; }
.kicker { font-size: 12px; font-weight: 600; color: var(--acc); letter-spacing: .04em; }
h1 { font-family: "Gowun Dodum", sans-serif; font-weight: 400; font-size: 32px; line-height: 1.2; }
h1.big { font-size: 64px; line-height: 1; font-family: "IBM Plex Mono", monospace; font-weight: 600; letter-spacing: -.04em; }
h1 small { font-size: 16px; color: var(--muted); font-family: "IBM Plex Mono", monospace; margin-left: 6px; }
h2 { font-size: 12.5px; font-weight: 800; color: var(--acc); letter-spacing: .02em; }
.word { font-family: "Gowun Dodum", sans-serif; font-size: 14px; max-width: 330px; text-align: right; line-height: 1.5; background: var(--tint); padding: 8px 12px; border-radius: 10px; }
.hint { font-size: 12px; color: var(--muted); line-height: 1.5; }
.lead { font-size: 14.5px; line-height: 1.6; }
.ln { height: 30px; border-bottom: 1px solid var(--line); display: flex; align-items: flex-end; padding-bottom: 4px; gap: 6px; }
.ln span { font-family: "IBM Plex Mono", monospace; font-size: 11px; color: var(--muted); width: 22px; flex: none; }
.ln em { font-size: 11px; color: var(--muted); font-weight: 600; }
.ln.dl span { width: 34px; }
.dots { flex: 1; background-image: radial-gradient(circle, #c9ced6 1px, transparent 1.2px); background-size: 20px 20px; border-radius: 6px; min-height: 60px; }
.jump { font-size: 12px; font-weight: 700; color: var(--acc); }
.jump.next { align-self: flex-end; }
.links { display: flex; gap: 18px; justify-content: flex-end; margin-top: -6px; }
.sun { color: var(--sun) !important; } .sat { color: var(--sat) !important; }
.mood { display: flex; gap: 4px; margin-left: auto; } .mood u { width: 11px; height: 11px; border-radius: 50%; border: 1.3px solid #b9bfc9; }
.bat { display: inline-flex; gap: 2px; margin-left: auto; padding: 2px; border: 1.3px solid #b9bfc9; border-radius: 3px; position: relative; }
.bat::after { content: ""; position: absolute; right: -4px; top: 3px; width: 2px; height: 5px; background: #b9bfc9; border-radius: 1px; }
.bat u { width: 6px; height: 7px; border-radius: 1px; background: #eef0f3; }
.bat u.f { background: var(--acc); }

/* 표지 */
.cover-page { padding: 0; background: var(--tint); }
.cover { position: absolute; inset: 56px; border: 2px solid var(--ink); border-radius: 28px; background: #fff; padding: 46px; display: flex; flex-direction: column; }
.c-top { display: flex; justify-content: space-between; font-size: 12px; font-weight: 800; letter-spacing: .14em; color: var(--muted); }
.c-year { font-family: "IBM Plex Mono", monospace; font-weight: 600; font-size: 168px; line-height: 1; letter-spacing: -.06em; margin-top: 90px; }
.c-sub { font-family: "Gowun Dodum", sans-serif; font-size: 22px; margin-top: 8px; }
.c-type { margin-top: auto; font-family: "IBM Plex Mono", monospace; font-weight: 600; font-size: 72px; color: var(--acc); line-height: 1; letter-spacing: .02em; }
.c-type small { font-size: 16px; letter-spacing: .2em; color: var(--ink); margin-left: 12px; vertical-align: middle; }
.c-tag { font-family: "Gowun Dodum", sans-serif; font-size: 20px; margin-top: 10px; }
.c-mods { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 22px; }
.c-mods span { font-size: 12.5px; font-weight: 600; background: var(--tint); border-radius: 999px; padding: 6px 12px 6px 6px; display: inline-flex; gap: 6px; align-items: center; }
.c-mods b { width: 22px; height: 22px; border-radius: 50%; background: var(--acc); color: #fff; display: grid; place-items: center; font-family: "IBM Plex Mono", monospace; font-size: 12px; }
.c-name { margin-top: 40px; font-size: 12px; color: var(--muted); display: flex; gap: 12px; align-items: flex-end; }
.c-name span { flex: 1; border-bottom: 1.5px solid var(--ink); height: 28px; }
.c-go { position: absolute; right: 46px; bottom: -42px; font-size: 13px; font-weight: 800; color: var(--ink); }

/* 사용법 */
.guide { list-style: none; display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.guide li { display: grid; grid-template-columns: 40px 1fr; gap: 2px 10px; padding: 14px 16px; border-radius: 16px; background: var(--soft); align-content: start; }
.guide .lt { grid-row: span 2; width: 36px; height: 36px; border-radius: 50%; background: var(--acc); color: #fff; display: grid; place-items: center; font-family: "IBM Plex Mono", monospace; font-weight: 600; font-size: 17px; }
.guide b { font-size: 15.5px; } .guide p { font-size: 12.5px; line-height: 1.6; color: #4a4f59; }
.parts { display: grid; gap: 10px; }
.pg { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
.pg a { border: 1.5px solid var(--line); border-radius: 14px; padding: 11px 13px; display: grid; gap: 2px; }
.pg b { font-family: "IBM Plex Mono", monospace; font-size: 24px; color: var(--acc); line-height: 1; }
.pg span { font-size: 12px; font-weight: 600; }
.map { margin-top: auto; border: 1.5px solid var(--ink); border-radius: 16px; padding: 14px 18px; display: grid; gap: 8px; }
.map ul { padding-left: 18px; display: grid; gap: 4px; font-size: 13px; line-height: 1.5; }

/* 연간 */
.year { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px 22px; flex: 1; }
.mini { display: flex; flex-direction: column; gap: 6px; }
.mt { font-family: "Gowun Dodum", sans-serif; font-size: 18px; color: var(--acc); }
.mh, .mg { display: grid; grid-template-columns: repeat(7, 1fr); text-align: center; font-size: 10.5px; }
.mh { color: var(--muted); font-weight: 600; }
.mg a, .mg span { padding: 3.5px 0; font-family: "IBM Plex Mono", monospace; }

/* 목표 */
.goals { display: grid; grid-template-columns: 1.25fr 1fr; gap: 28px; flex: 1; }
.goals .list { display: flex; flex-direction: column; justify-content: space-between; }
.goals .side { display: flex; flex-direction: column; gap: 10px; }
.pick { height: 64px; border: 1.5px solid var(--ink); border-radius: 14px; padding: 8px 12px; font-family: "IBM Plex Mono", monospace; font-size: 12px; color: var(--acc); font-weight: 600; }
.kw { height: 150px; border-radius: 14px; background: var(--tint); } .kw.small { height: 80px; }
.side h2 { margin-top: 8px; }
.gj { display: grid; gap: 12px; }
.gbox { border: 1.5px solid var(--ink); border-radius: 16px; padding: 12px 16px 14px 56px; position: relative; display: grid; gap: 2px; }
.gbox .no { position: absolute; left: 16px; top: 14px; width: 28px; height: 28px; border-radius: 50%; background: var(--acc); color: #fff; display: grid; place-items: center; font-family: "IBM Plex Mono", monospace; font-weight: 600; }
.gl { display: grid; grid-template-columns: 92px 1fr; align-items: end; font-size: 12px; } .gl b { color: var(--acc); padding-bottom: 6px; }
.quarters { display: grid; grid-template-columns: 1fr 1fr; gap: 14px 18px; flex: 1; align-content: start; }
.q { background: var(--soft); border-radius: 14px; padding: 12px 14px; }

/* 월간 */
.cal { display: grid; grid-template-columns: 34px repeat(7, 1fr); flex: 1; border-top: 2px solid var(--ink); }
.cal .dh { font-size: 11px; font-weight: 800; padding: 4px 6px; color: var(--muted); }
.cal .wk { font-family: "IBM Plex Mono", monospace; font-size: 9.5px; color: var(--muted); padding-top: 8px; border-top: 1px solid var(--line); }
.cal .cell { border-top: 1px solid var(--line); border-left: 1px solid var(--line); padding: 6px; display: flex; flex-direction: column; gap: 2px; }
.cal .cell .n { font-family: "IBM Plex Mono", monospace; font-size: 14px; font-weight: 600; }
.cal .cell .hd { font-size: 9.5px; font-weight: 600; }
.cal .cell.out { background: var(--soft); }
.mfoot { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; height: 160px; flex: none; }
.mfoot .box { display: flex; flex-direction: column; gap: 0; }

/* 주간 공통 */
.three { width: 270px; display: grid; gap: 4px; background: var(--tint); border-radius: 14px; padding: 10px 14px; }
.ck { height: 24px; border-bottom: 1px solid #fff; display: flex; align-items: center; }
.ck u { width: 13px; height: 13px; border: 1.5px solid var(--acc); border-radius: 4px; }
.day { border: 1px solid var(--line); border-radius: 14px; padding: 10px 12px; display: flex; flex-direction: column; gap: 6px; position: relative; background-image: linear-gradient(transparent 31px, var(--soft) 31px, var(--soft) 32px); background-size: 100% 32px; background-position: 0 6px; }
.day.dim, .tcol.dim { opacity: .45; }
.day .dt { display: flex; align-items: center; gap: 6px; background: #fff; }
.day .dt b { font-family: "IBM Plex Mono", monospace; font-size: 20px; }
.day .dt span { font-size: 12px; font-weight: 700; }
.day .dt em { font-size: 10.5px; font-weight: 700; }
.day .who { position: absolute; left: 12px; right: 12px; bottom: 8px; font-size: 10px; font-weight: 700; color: var(--acc); border-top: 1px dashed var(--line); padding-top: 4px; background: #fff; }
.day.extra { background: var(--tint); border-color: transparent; }
.day.extra .dt { background: transparent; } .day.extra .dt b { font-family: "Gowun Dodum", sans-serif; font-size: 16px; }
.day.extra .ln { border-color: #fff; height: 26px; }
.day.extra .jump { margin-top: auto; }
.day.extra.plain { background: var(--soft); }
.moodkey { display: flex; gap: 12px; font-size: 11px; color: var(--muted); align-items: center; }
.moodkey span { display: inline-flex; gap: 4px; align-items: center; } .moodkey .bat { margin-left: 0; }
.moodkey > span:not(.bat) > u { width: 10px; height: 10px; border-radius: 50%; border: 1.3px solid #b9bfc9; }

/* P 주간: 딱 3개 + 하루 칸 */
.week { display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: repeat(4, 1fr); gap: 12px; flex: 1; }

/* J 주간: 시간 블록 */
.tgrid { display: grid; grid-template-columns: 30px repeat(7, 1fr); flex: 1; border-top: 2px solid var(--ink); }
.tcol, .tlab { display: flex; flex-direction: column; border-left: 1px solid var(--line); }
.tlab { border-left: 0; }
.th { height: 50px; padding: 4px 6px; display: flex; flex-direction: column; justify-content: center; align-items: flex-start; gap: 4px; border-bottom: 1px solid var(--ink); flex: none; }
.th > div { display: flex; align-items: baseline; gap: 3px; white-space: nowrap; }
.th b { font-family: "IBM Plex Mono", monospace; font-size: 16px; } .th span { font-size: 11px; font-weight: 700; } .th em { font-size: 8.5px; font-weight: 700; }
.th .bat, .th .mood { margin-left: 0; }
.slot { flex: 1; border-bottom: 1px solid var(--soft); font-family: "IBM Plex Mono", monospace; font-size: 9.5px; color: var(--muted); padding-top: 2px; }
.tcol .slot:nth-child(odd) { border-bottom-color: var(--line); }
.tcol .who, .tlab .who { height: 30px; font-size: 9px; font-weight: 700; color: var(--acc); padding: 3px 4px; border-top: 1px dashed var(--line); }
.tfoot { display: grid; grid-template-columns: 1.3fr 1fr; gap: 12px; flex: none; }
.tgrid, .week, .cal { min-height: 0; }

/* 습관 */
.habit { display: grid; flex: 1; align-content: start; }
.hr { display: grid; grid-template-columns: 120px repeat(var(--n), 1fr); align-items: center; height: 56px; border-bottom: 1px solid var(--line); }
.hr.head { height: 30px; font-family: "IBM Plex Mono", monospace; font-size: 9px; color: var(--muted); text-align: center; border-bottom: 2px solid var(--ink); }
.hr.head .hn { font-family: "Gothic A1", sans-serif; font-size: 11px; font-weight: 800; text-align: left; color: var(--acc); }
.hr u { width: 13px; height: 13px; border-radius: 50%; border: 1.3px solid #c3c8d0; justify-self: center; }
.hnav { display: flex; gap: 6px; justify-content: center; }
.hnav a { width: 30px; height: 30px; border-radius: 50%; background: var(--soft); display: grid; place-items: center; font-family: "IBM Plex Mono", monospace; font-size: 12px; }
.hnav a.on { background: var(--acc); color: #fff; }

/* 부록 공통 표 */
.table { display: grid; border-top: 2px solid var(--ink); }
.tr { display: grid; height: 34px; border-bottom: 1px solid var(--line); align-items: center; font-size: 12px; }
.tr.th { height: 28px; font-weight: 800; color: var(--acc); font-size: 11.5px; }
.tr span { padding: 0 6px; height: 100%; display: flex; align-items: center; border-left: 1px solid var(--soft); } .tr span:first-child { border-left: 0; }
.t4 .tr { grid-template-columns: 70px 110px 1fr 1fr; }
.t3 .tr { grid-template-columns: 70px 1fr 120px; }
.steps .tr { grid-template-columns: 1fr 120px 60px; }
.steps .tr span:first-child { font-family: "IBM Plex Mono", monospace; color: var(--muted); }
.steps u { width: 14px; height: 14px; border: 1.5px solid var(--acc); border-radius: 4px; margin: auto; }
.box2 { flex: 1; display: flex; flex-direction: column; gap: 8px; }
.charge { display: grid; gap: 0; }
.cl { height: 42px; border-bottom: 1px solid var(--line); display: flex; align-items: center; gap: 12px; } .cl span { flex: 1; } .cl .bat { transform: scale(1.4); transform-origin: right center; margin-right: 6px; }
.emonth { display: grid; grid-template-columns: 1fr 1fr; gap: 10px 24px; flex: 1; align-content: start; }
.em { display: grid; grid-template-columns: 44px auto 1fr; gap: 12px; align-items: center; height: 56px; border-bottom: 1px solid var(--line); }
.em b { font-family: "IBM Plex Mono", monospace; color: var(--acc); } .em .bat { transform: scale(1.3); transform-origin: left center; margin: 0 14px 0 0; }
.ideas { display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: repeat(3, 1fr); gap: 14px; flex: 1; }
.idea { border: 1.5px dashed var(--acc); border-radius: 16px; padding: 12px 14px; display: flex; flex-direction: column; justify-content: space-between; }
.il { display: grid; grid-template-columns: 82px 1fr; align-items: end; gap: 8px; font-size: 11.5px; } .il b { color: var(--acc); }
.il span { border-bottom: 1px solid var(--line); height: 26px; }
.il .stars { border: 0; display: flex; gap: 5px; align-items: center; }
.stars u { width: 15px; height: 15px; border: 1.3px solid var(--acc); border-radius: 50%; }
.ledger { display: grid; grid-template-columns: 1fr 190px; gap: 20px; flex: 1; align-content: start; }
.ledger .tr { height: 30px; }
.lsum { display: flex; flex-direction: column; gap: 2px; }
.proj { display: grid; gap: 4px; border: 1.5px solid var(--ink); border-radius: 16px; padding: 10px 16px 14px; }
.someday { display: grid; grid-template-columns: 1fr 1fr; gap: 0 26px; flex: 1; align-content: start; }
.sd { height: 38px; border-bottom: 1px solid var(--line); display: flex; align-items: center; gap: 10px; } .sd span { flex: 1; }
.sd > u { width: 14px; height: 14px; border: 1.5px solid var(--acc); border-radius: 4px; }
.lv { display: flex; gap: 3px; } .lv u { width: 8px; height: 8px; border-radius: 50%; border: 1.2px solid var(--acc); }
`;

function html() {
  const pages = [cover(), guide(), year(), goals()];
  for (let m = 0; m < 12; m++) pages.push(month(m));
  for (let w = 0; w < WEEKS; w++) pages.push(week(w));
  for (let m = 0; m < 12; m++) pages.push(habit(m));
  for (const s of SECTIONS) for (let i = 1; i <= s.n; i++) pages.push(SECTION_PAGE[s.id](i));
  for (let i = 1; i <= 5; i++) pages.push(notes(i));
  return { count: pages.length, doc: `<!doctype html><html lang="ko"><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Gothic+A1:wght@400;600;800&family=Gowun+Dodum&family=IBM+Plex+Mono:wght@500;600&display=swap">
<style>${CSS}</style></head><body>${pages.join("\n")}</body></html>` };
}

module.exports = { html, W, H, TYPE, SECTIONS };

// 직접 실행할 때만 PDF를 만든다 (example.js 가 html() 만 빌려 쓸 수 있게)
if (require.main === module) (async () => {
  const out = path.join(__dirname, "out");
  fs.mkdirSync(out, { recursive: true });
  const { doc, count } = html();
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: W, height: H } });
  await p.setContent(doc, { waitUntil: "networkidle" });
  await p.evaluate(() => document.fonts.ready);
  const pdf = path.join(out, `2027-diary-${TYPE}.pdf`);
  await p.pdf({ path: pdf, width: `${W}px`, height: `${H}px`, printBackground: true, preferCSSPageSize: true });
  // 상세페이지용 미리보기
  const shots = ["cover", "guide", "year", "goals", "m1", "w1", "h1", ...SECTIONS.map((s) => `${s.id}1`)];
  const dir = path.join(out, `preview-${TYPE}`);
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  const p2 = await b.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 2 });
  await p2.setContent(doc, { waitUntil: "networkidle" });
  await p2.evaluate(() => document.fonts.ready);
  for (const [i, id] of shots.entries()) await (await p2.$(`#${id}`)).screenshot({ path: path.join(dir, `${String(i + 1).padStart(2, "0")}-${id}.png`) });
  await b.close();
  console.log(`${pdf} (${count}쪽, ${WEEKS}주) / 미리보기 ${shots.length}장`);
})();
