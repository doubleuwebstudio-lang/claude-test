// 2027 디지털 다이어리(굿노트·노타빌리티용 PDF) 생성기
// 사용법: node diary-2027/build.js ENFP   → diary-2027/out/2027-diary-ENFP.pdf 와 미리보기 PNG
// HTML로 페이지를 그리고 크로미움으로 PDF를 뽑는다. 페이지 안의 <a href="#id"> 는 PDF 안에서 눌러 이동하는 링크가 된다.
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");
const TYPES = require("./types.js");

const TYPE = (process.argv[2] || "ENFP").toUpperCase();
const T = TYPES[TYPE];
if (!T) { console.error(`아직 내용이 없는 유형이에요: ${TYPE}. types.js 에 추가해 주세요.`); process.exit(1); }

const YEAR = 2027;
const W = 768, H = 1024;           // 아이패드 세로 비율(3:4)
const WEEK0 = new Date(YEAR - 1, 11, 28); // 2027년 첫 주의 월요일 (12월 28일)
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

// 오른쪽 탭: 모든 속지에서 바로 이동
function tabs(active) {
  const items = [["year", "연간"], ["goals", "목표"]];
  for (let m = 1; m <= 12; m++) items.push([`m${m}`, `${m}월`]);
  items.push(["h1", "습관"], ["i1", "아이디어"], ["n1", "메모"]);
  return `<nav class="tabs">${items.map(([id, label]) => `<a href="#${id}" class="${active === id ? "on" : ""}">${label}</a>`).join("")}</nav>`;
}
const page = (id, active, body, cls = "") => `<section class="page ${cls}" id="${id}">${body}${active === null ? "" : tabs(active)}</section>`;

// ---------- 페이지들 ----------
function cover() {
  return page("cover", null, `
    <div class="cover">
      <div class="c-top"><span>DIGITAL DIARY</span><span>${T.group}</span></div>
      <div class="c-year">${YEAR}</div>
      <div class="c-sub">정미년 · 붉은 양의 해</div>
      <div class="c-type">${TYPE}<small>EDITION</small></div>
      <div class="c-tag">${T.nickname}</div>
      <div class="c-name">이 다이어리의 주인<span></span></div>
      <a class="c-go" href="#guide">시작하기 →</a>
    </div>`, "cover-page");
}

function guide() {
  return page("guide", "", `
    <header class="ph"><span class="kicker">${TYPE} 다이어리 사용법</span><h1>${T.tagline}</h1></header>
    <ol class="guide">${T.guide.map(([h, p]) => `<li><b>${h}</b><p>${p}</p></li>`).join("")}</ol>
    <div class="parts">
      <h2>이 다이어리에 들어 있는 것</h2>
      <div class="pg">${[["연간 달력", 1, "year"], ["올해 목표", 1, "goals"], ["월간", 12, "m1"], ["주간", WEEKS, "w0"], ["습관 트래커", 12, "h1"], [T.ideaName, 4, "i1"], ["메모", 5, "n1"]]
        .map(([n, c, id]) => `<a href="#${id}"><b>${c}</b><span>${n}</span></a>`).join("")}</div>
    </div>
    <div class="map">
      <h2>이렇게 이동해요</h2>
      <ul>
        <li>오른쪽 <b>탭</b>을 누르면 연간 · 목표 · 월 · 습관 · 아이디어 · 메모로 바로 가요.</li>
        <li>월간 달력에서 <b>날짜</b>를 누르면 그 주의 주간 페이지로 가요.</li>
        <li>주간 페이지 위쪽 <b>월 이름</b>을 누르면 다시 월간으로 돌아가요.</li>
      </ul>
    </div>`);
}

function miniMonth(m) {
  const first = d(YEAR, m, 1), lead = (first.getDay() + 6) % 7, days = new Date(YEAR, m + 1, 0).getDate();
  let cells = "";
  for (let i = 0; i < lead; i++) cells += "<span></span>";
  for (let k = 1; k <= days; k++) { const dt = d(YEAR, m, k); cells += `<a href="#w${weekOf(dt)}" class="${dayClass(dt)}">${k}</a>`; }
  return `<div class="mini"><a class="mt" href="#m${m + 1}">${m + 1}월</a><div class="mh">${WD.map((w, i) => `<span class="${i === 6 ? "sun" : i === 5 ? "sat" : ""}">${w}</span>`).join("")}</div><div class="mg">${cells}</div></div>`;
}
function year() {
  return page("year", "year", `
    <header class="ph"><span class="kicker">${YEAR} 한눈에 보기</span><h1>올해의 지도</h1></header>
    <div class="year">${Array.from({ length: 12 }, (_, m) => miniMonth(m)).join("")}</div>`);
}

function goals() {
  const n = 20;
  return page("goals", "goals", `
    <header class="ph"><span class="kicker">${YEAR} 정미년</span><h1>${T.goalsTitle}</h1></header>
    <div class="goals">
      <div class="list">${Array.from({ length: n }, (_, i) => `<div class="ln"><span>${i + 1}</span></div>`).join("")}</div>
      <div class="side">
        <h2>${T.goalsPick}</h2>
        ${[1, 2, 3].map((i) => `<div class="pick"><span>${i}</span></div>`).join("")}
        <h2>올해 나의 키워드</h2>
        <div class="kw"></div>
        <p class="hint">붉은 양의 해. 따뜻하게, 그러나 내 속도로.</p>
      </div>
    </div>`);
}

function month(m) {
  const first = d(YEAR, m, 1), lead = (first.getDay() + 6) % 7, days = new Date(YEAR, m + 1, 0).getDate();
  const rows = Math.ceil((lead + days) / 7);
  let grid = "";
  for (let r = 0; r < rows; r++) {
    const mon = add(first, r * 7 - lead);
    grid += `<a class="wk" href="#w${weekOf(mon)}">W${String(weekOf(mon) + 1).padStart(2, "0")}</a>`;
    for (let c = 0; c < 7; c++) {
      const dt = add(mon, c), inMonth = dt.getMonth() === m;
      grid += inMonth
        ? `<a class="cell ${dayClass(dt)}" href="#w${weekOf(dt)}"><span class="n">${dt.getDate()}</span>${hol(dt) ? `<span class="hd">${hol(dt)}</span>` : ""}</a>`
        : `<span class="cell out"></span>`;
    }
  }
  return page(`m${m + 1}`, `m${m + 1}`, `
    <header class="ph row"><div><span class="kicker">${YEAR}</span><h1 class="big">${m + 1}월</h1></div><p class="word">${T.monthly[m]}</p></header>
    <div class="cal" style="grid-template-rows: 22px repeat(${rows}, 1fr)">
      <span></span>${WD.map((w, i) => `<span class="dh ${i === 6 ? "sun" : i === 5 ? "sat" : ""}">${w}</span>`).join("")}
      ${grid}
    </div>
    <div class="mfoot">
      <div class="box"><h2>${T.monthBox}</h2>${[1, 2, 3].map((i) => `<div class="ln"><span>${i}</span></div>`).join("")}</div>
      <div class="box"><h2>메모</h2><div class="dots"></div></div>
      <a class="jump" href="#h${m + 1}">${m + 1}월 습관 트래커 →</a>
    </div>`);
}

function week(w) {
  const mon = add(WEEK0, w * 7), sun = add(mon, 6), thu = add(mon, 3);
  const days = Array.from({ length: 7 }, (_, i) => add(mon, i));
  const dayBox = (dt, i) => `<div class="day ${dayClass(dt)}${dt.getFullYear() !== YEAR ? " dim" : ""}">
      <div class="dt"><b>${dt.getDate()}</b><span>${WD[i]}</span>${hol(dt) ? `<em>${hol(dt)}</em>` : ""}<i class="mood">${T.moodLabels.map(() => "<u></u>").join("")}</i></div>
    </div>`;
  return page(`w${w}`, `m${thu.getMonth() + 1}`, `
    <header class="ph row"><div><a class="kicker" href="#m${thu.getMonth() + 1}">${thu.getFullYear()} · ${thu.getMonth() + 1}월 ←</a><h1>W${String(w + 1).padStart(2, "0")} <small>${md(mon)} – ${md(sun)}</small></h1></div>
      <div class="three"><h2>${T.weekTop}</h2>${[1, 2, 3].map((i) => `<div class="ck"><u></u></div>`).join("")}</div></header>
    <div class="week">
      ${days.map(dayBox).join("")}
      <div class="day extra"><div class="dt"><b>${T.weekExtra}</b></div><p class="hint">${T.weekExtraHint}</p><a class="jump" href="#i1">${T.ideaName} 가기 →</a></div>
    </div>
    <p class="moodkey">기분 날씨 ${T.moodLabels.map((l) => `<span><u></u>${l}</span>`).join("")}</p>`);
}

function habit(m) {
  const days = new Date(YEAR, m + 1, 0).getDate();
  const head = Array.from({ length: days }, (_, i) => `<span class="${dayClass(d(YEAR, m, i + 1))}">${i + 1}</span>`).join("");
  const rows = Array.from({ length: 8 }, () => `<div class="hr"><span class="hn"></span>${Array.from({ length: days }, () => "<u></u>").join("")}</div>`).join("");
  return page(`h${m + 1}`, "h1", `
    <header class="ph row"><div><a class="kicker" href="#m${m + 1}">${m + 1}월 ←</a><h1>습관 트래커</h1></div><p class="word">${T.habitHint}</p></header>
    <div class="habit" style="--n:${days}"><div class="hr head"><span class="hn">습관</span>${head}</div>${rows}</div>
    <nav class="hnav">${Array.from({ length: 12 }, (_, i) => `<a href="#h${i + 1}" class="${i === m ? "on" : ""}">${i + 1}</a>`).join("")}</nav>`);
}

function ideas(i) {
  const card = () => `<div class="idea"><div class="il"><b>아이디어</b><span></span></div><div class="il"><b>${T.ideaScore}</b><span class="stars">${"<u></u>".repeat(5)}</span></div><div class="il"><b>다음 행동 하나</b><span></span></div><div class="il"><b>출차 날짜</b><span></span></div></div>`;
  return page(`i${i}`, "i1", `
    <header class="ph row"><div><span class="kicker">${i} / 4</span><h1>${T.ideaName}</h1></div><p class="word">${T.ideaHint}</p></header>
    <div class="ideas">${Array.from({ length: 6 }, card).join("")}</div>
    ${i < 4 ? `<a class="jump next" href="#i${i + 1}">다음 장 →</a>` : ""}`);
}

function notes(i) {
  return page(`n${i}`, "n1", `
    <header class="ph row"><div><span class="kicker">${i} / 5</span><h1>메모</h1></div></header>
    <div class="dots full"></div>
    ${i < 5 ? `<a class="jump next" href="#n${i + 1}">다음 장 →</a>` : ""}`);
}

// ---------- 스타일 ----------
const CSS = `
@page { size: ${W}px ${H}px; margin: 0; }
:root { --ink:#23262d; --muted:#8a909c; --line:#dcdfe5; --soft:#f3f4f6; --acc:${T.color}; --tint:${T.tint}; --sun:#d9465b; --sat:#3b6fd4; }
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: "Gothic A1", sans-serif; color: var(--ink); -webkit-print-color-adjust: exact; print-color-adjust: exact; }
a { color: inherit; text-decoration: none; }
.page { width:${W}px; height:${H}px; position: relative; overflow: hidden; break-after: page; background: #fff; padding: 46px 98px 44px 48px; display: flex; flex-direction: column; gap: 18px; }
.tabs { position: absolute; top: 36px; right: 0; width: 62px; display: flex; flex-direction: column; gap: 3px; }
.tabs a { font-size: 11.5px; font-weight: 600; padding: 7px 0 7px 12px; border-radius: 10px 0 0 10px; background: var(--soft); color: var(--muted); letter-spacing: -.02em; }
.tabs a.on { background: var(--acc); color: #fff; }
.ph { display: flex; flex-direction: column; gap: 4px; }
.ph.row { flex-direction: row; justify-content: space-between; align-items: flex-end; gap: 20px; }
.kicker { font-size: 12px; font-weight: 600; color: var(--acc); letter-spacing: .04em; }
h1 { font-family: "Gowun Dodum", sans-serif; font-weight: 400; font-size: 32px; line-height: 1.2; }
h1.big { font-size: 64px; line-height: 1; font-family: "IBM Plex Mono", monospace; font-weight: 600; letter-spacing: -.04em; }
h1 small { font-size: 16px; color: var(--muted); font-family: "IBM Plex Mono", monospace; margin-left: 6px; }
h2 { font-size: 12.5px; font-weight: 800; color: var(--acc); letter-spacing: .02em; }
.word { font-family: "Gowun Dodum", sans-serif; font-size: 14px; color: var(--ink); max-width: 330px; text-align: right; line-height: 1.5; background: var(--tint); padding: 8px 12px; border-radius: 10px; }
.hint { font-size: 12px; color: var(--muted); line-height: 1.5; }
.ln { height: 30px; border-bottom: 1px solid var(--line); display: flex; align-items: flex-end; padding-bottom: 4px; }
.ln span { font-family: "IBM Plex Mono", monospace; font-size: 11px; color: var(--muted); width: 22px; }
.dots { flex: 1; background-image: radial-gradient(circle, #c9ced6 1px, transparent 1.2px); background-size: 20px 20px; border-radius: 6px; min-height: 80px; }
.dots.full { flex: 1; }
.jump { font-size: 12px; font-weight: 700; color: var(--acc); }
.jump.next { align-self: flex-end; }
.sun { color: var(--sun) !important; } .sat { color: var(--sat) !important; }

/* 표지 */
.cover-page { padding: 0; background: var(--tint); }
.cover { position: absolute; inset: 56px; border: 2px solid var(--ink); border-radius: 28px; background: #fff; padding: 46px; display: flex; flex-direction: column; }
.c-top { display: flex; justify-content: space-between; font-size: 12px; font-weight: 800; letter-spacing: .14em; color: var(--muted); }
.c-year { font-family: "IBM Plex Mono", monospace; font-weight: 600; font-size: 168px; line-height: 1; letter-spacing: -.06em; margin-top: 110px; }
.c-sub { font-family: "Gowun Dodum", sans-serif; font-size: 22px; margin-top: 8px; }
.c-type { margin-top: auto; font-family: "IBM Plex Mono", monospace; font-weight: 600; font-size: 72px; color: var(--acc); line-height: 1; letter-spacing: .02em; }
.c-type small { font-size: 16px; letter-spacing: .2em; color: var(--ink); margin-left: 12px; vertical-align: middle; }
.c-tag { font-family: "Gowun Dodum", sans-serif; font-size: 20px; margin-top: 10px; }
.c-name { margin-top: 56px; font-size: 12px; color: var(--muted); display: flex; gap: 12px; align-items: flex-end; }
.c-name span { flex: 1; border-bottom: 1.5px solid var(--ink); height: 28px; }
.c-go { position: absolute; right: 46px; bottom: -42px; font-size: 13px; font-weight: 800; color: var(--ink); }

/* 사용법 */
.guide { list-style: none; counter-reset: g; display: grid; gap: 14px; margin-top: 8px; }
.guide li { counter-increment: g; display: grid; grid-template-columns: 44px 1fr; gap: 4px 12px; padding: 16px 18px; border-radius: 16px; background: var(--soft); }
.guide li::before { content: counter(g); grid-row: span 2; width: 36px; height: 36px; border-radius: 50%; background: var(--acc); color: #fff; display: grid; place-items: center; font-family: "IBM Plex Mono", monospace; font-weight: 600; }
.guide b { font-size: 16px; } .guide p { font-size: 13.5px; line-height: 1.6; color: #4a4f59; }
.parts { display: grid; gap: 10px; margin-top: 6px; }
.pg { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
.pg a { border: 1.5px solid var(--line); border-radius: 14px; padding: 12px 14px; display: grid; gap: 2px; }
.pg b { font-family: "IBM Plex Mono", monospace; font-size: 26px; color: var(--acc); line-height: 1; }
.pg span { font-size: 12.5px; font-weight: 600; }
.map { margin-top: auto; border: 1.5px solid var(--ink); border-radius: 16px; padding: 16px 18px; display: grid; gap: 8px; }
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
.kw { height: 150px; border-radius: 14px; background: var(--tint); }
.side h2 { margin-top: 8px; }

/* 월간 */
.cal { display: grid; grid-template-columns: 34px repeat(7, 1fr); gap: 0; flex: 1; border-top: 2px solid var(--ink); }
.cal .dh { font-size: 11px; font-weight: 800; text-align: left; padding: 4px 6px; color: var(--muted); }
.cal .wk { font-family: "IBM Plex Mono", monospace; font-size: 9.5px; color: var(--muted); padding-top: 8px; border-top: 1px solid var(--line); }
.cal .cell { border-top: 1px solid var(--line); border-left: 1px solid var(--line); padding: 6px; display: flex; flex-direction: column; gap: 2px; }
.cal .cell .n { font-family: "IBM Plex Mono", monospace; font-size: 14px; font-weight: 600; }
.cal .cell .hd { font-size: 9.5px; font-weight: 600; }
.cal .cell.out { background: var(--soft); }
.mfoot { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; height: 170px; position: relative; }
.mfoot .box { display: flex; flex-direction: column; gap: 2px; }
.mfoot .jump { position: absolute; right: 0; bottom: -22px; }

/* 주간 */
.three { width: 270px; display: grid; gap: 4px; background: var(--tint); border-radius: 14px; padding: 10px 14px; }
.ck { height: 24px; border-bottom: 1px solid #fff; display: flex; align-items: center; }
.ck u, .mood u, .moodkey u, .habit u, .stars u { display: inline-block; text-decoration: none; }
.ck u { width: 13px; height: 13px; border: 1.5px solid var(--acc); border-radius: 4px; }
.week { display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: repeat(4, 1fr); gap: 12px; flex: 1; }
.day { border: 1px solid var(--line); border-radius: 14px; padding: 10px 12px; display: flex; flex-direction: column; gap: 6px; background-image: linear-gradient(transparent 31px, var(--soft) 31px, var(--soft) 32px); background-size: 100% 32px; background-position: 0 6px; }
.day.dim { opacity: .45; }
.day .dt { display: flex; align-items: baseline; gap: 6px; background: #fff; }
.day .dt b { font-family: "IBM Plex Mono", monospace; font-size: 20px; }
.day .dt span { font-size: 12px; font-weight: 700; }
.day .dt em { font-style: normal; font-size: 10.5px; font-weight: 700; }
.mood { margin-left: auto; display: flex; gap: 4px; }
.mood u { width: 11px; height: 11px; border-radius: 50%; border: 1.3px solid #b9bfc9; }
.day.extra { background: var(--tint); border-color: transparent; }
.day.extra .dt { background: transparent; } .day.extra .dt b { font-family: "Gowun Dodum", sans-serif; font-size: 16px; }
.day.extra .jump { margin-top: auto; }
.moodkey { display: flex; gap: 12px; font-size: 11px; color: var(--muted); align-items: center; }
.moodkey span { display: inline-flex; gap: 4px; align-items: center; }
.moodkey u { width: 10px; height: 10px; border-radius: 50%; border: 1.3px solid #b9bfc9; }

/* 습관 */
.habit { display: grid; gap: 0; flex: 1; align-content: start; }
.hr { display: grid; grid-template-columns: 120px repeat(var(--n), 1fr); align-items: center; height: 56px; border-bottom: 1px solid var(--line); }
.hr.head { height: 30px; font-family: "IBM Plex Mono", monospace; font-size: 9px; color: var(--muted); text-align: center; border-bottom: 2px solid var(--ink); }
.hr.head .hn { font-family: "Gothic A1", sans-serif; font-size: 11px; font-weight: 800; text-align: left; color: var(--acc); }
.hr u { width: 13px; height: 13px; border-radius: 50%; border: 1.3px solid #c3c8d0; justify-self: center; }
.hnav { display: flex; gap: 6px; justify-content: center; }
.hnav a { width: 30px; height: 30px; border-radius: 50%; background: var(--soft); display: grid; place-items: center; font-family: "IBM Plex Mono", monospace; font-size: 12px; }
.hnav a.on { background: var(--acc); color: #fff; }

/* 아이디어 */
.ideas { display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: repeat(3, 1fr); gap: 14px; flex: 1; }
.idea { border: 1.5px dashed var(--acc); border-radius: 16px; padding: 12px 14px; display: flex; flex-direction: column; justify-content: space-between; }
.il { display: grid; grid-template-columns: 82px 1fr; align-items: end; gap: 8px; font-size: 11.5px; }
.il b { color: var(--acc); }
.il span { border-bottom: 1px solid var(--line); height: 26px; }
.il .stars { border: 0; display: flex; gap: 5px; align-items: center; }
.stars u { width: 15px; height: 15px; border: 1.3px solid var(--acc); border-radius: 50%; }
`;

function html() {
  const pages = [cover(), guide(), year(), goals()];
  for (let m = 0; m < 12; m++) pages.push(month(m));
  for (let w = 0; w < WEEKS; w++) pages.push(week(w));
  for (let m = 0; m < 12; m++) pages.push(habit(m));
  for (let i = 1; i <= 4; i++) pages.push(ideas(i));
  for (let i = 1; i <= 5; i++) pages.push(notes(i));
  return { count: pages.length, doc: `<!doctype html><html lang="ko"><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Gothic+A1:wght@400;600;800&family=Gowun+Dodum&family=IBM+Plex+Mono:wght@500;600&display=swap">
<style>${CSS}</style></head><body>${pages.join("\n")}</body></html>` };
}

module.exports = { html, W, H, TYPE };

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
  // 상세페이지용 미리보기: 표지, 사용법, 연간, 목표, 1월, 첫 주, 습관, 아이디어
  const shots = ["cover", "guide", "year", "goals", "m1", "w1", "h1", "i1"];
  const dir = path.join(out, `preview-${TYPE}`);
  fs.mkdirSync(dir, { recursive: true });
  const p2 = await b.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 2 });
  await p2.setContent(doc, { waitUntil: "networkidle" });
  await p2.evaluate(() => document.fonts.ready);
  for (const [i, id] of shots.entries()) await (await p2.$(`#${id}`)).screenshot({ path: path.join(dir, `${String(i + 1).padStart(2, "0")}-${id}.png`) });
  // 판매용 썸네일(1000×1000): 표지 앞에 속지가 겹쳐 보이게
  const imgs = shots.map((_, i) => "data:image/png;base64," + fs.readFileSync(path.join(dir, `${String(i + 1).padStart(2, "0")}-${shots[i]}.png`)).toString("base64"));
  const p3 = await b.newPage({ viewport: { width: 1000, height: 1000 }, deviceScaleFactor: 1.5 });
  await p3.setContent(`<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Gowun+Dodum&family=IBM+Plex+Mono:wght@600&family=Gothic+A1:wght@800&display=swap"><style>
    body{margin:0;width:1000px;height:1000px;background:${T.tint};position:relative;overflow:hidden;font-family:"Gothic A1",sans-serif}
    img{position:absolute;width:330px;border-radius:14px;box-shadow:0 18px 40px -10px rgba(0,0,0,.35)}
    .t{position:absolute;left:60px;top:56px;color:#23262d}
    .t b{display:block;font-family:"IBM Plex Mono",monospace;font-size:92px;letter-spacing:-.05em;line-height:1}
    .t span{font-family:"Gowun Dodum",sans-serif;font-size:30px}
    .badge{position:absolute;left:60px;bottom:60px;display:flex;gap:10px}
    .badge i{font-style:normal;background:#fff;border-radius:999px;padding:10px 18px;font-size:20px;font-weight:800;color:${T.color}}
  </style></head><body>
    <div class="t"><b>2027</b><span>${TYPE} 디지털 다이어리</span></div>
    <img src="${imgs[5]}" style="right:40px;top:300px;transform:rotate(7deg)">
    <img src="${imgs[4]}" style="right:250px;top:250px;transform:rotate(-2deg)">
    <img src="${imgs[0]}" style="left:110px;top:330px;transform:rotate(-8deg)">
    <div class="badge"><i>${count}쪽</i><i>탭·날짜 링크</i><i>굿노트 호환</i></div>
  </body></html>`, { waitUntil: "networkidle" });
  await p3.evaluate(() => document.fonts.ready);
  await p3.screenshot({ path: path.join(out, `thumbnail-${TYPE}.png`) });
  await b.close();
  console.log(`${pdf} (${count}쪽, ${WEEKS}주) / 미리보기 ${shots.length}장`);
})();
