// 사용 예시 이미지: 빈 속지 위에 손글씨로 채운 모습을 얹어 찍는다 (상세페이지 '사용 예시' 컷)
// 사용법: node diary-2027/example.js ENFP
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");
const { html, W, H, TYPE } = require("./build.js");

// 가상의 사용자가 1월을 쓴 모습
const FILL = {
  goals: {
    list: ["제주도 한 달 살기", "기타로 노래 3곡", "10km 마라톤 완주", "책 24권 읽기", "도자기 공방 다니기", "혼자 해외여행", "엄마랑 사진관 가기", "블로그 시작하기", "수영 배우기", "친구들이랑 캠핑"],
    picks: ["책 24권 (한 달에 2권)", "10km 완주 → 10월 대회", "기타 3곡 (첫 곡은 '봄날')"],
    keyword: "끝까지, 가볍게!",
  },
  month: {
    id: "m1",
    cells: { 1: "해돋이 보기", 9: "지은 생일", 13: "기타 첫 레슨", 16: "러닝 시작", 23: "독서모임", 30: "본가 가기" },
    box: ["책 2권 끝내기", "기타 학원 등록", "방 정리 (진짜로)"],
    memo: "1월엔 하나만 시작하기!\n→ 러닝부터",
    feel: ["해돋이 본 날", "지은", "2월엔 기타 1곡 완성!"],
  },
  week: {
    id: "w2",
    top: [["기타 학원 등록", true], ["책 반 권 읽기", true], ["러닝 3번", false]],
    days: [
      ["팀 회의 2시", "저녁 러닝 3km"],
      ["기타 학원 상담", "→ 바로 등록함!"],
      ["야근 ㅠㅠ", "치킨으로 위로"],
      ["지은이랑 저녁", "선물 미리 사기"],
      ["책 100쪽 돌파", "러닝 (건너뜀)"],
      ["러닝 5km!", "카페에서 책"],
      ["푹 쉬기", "다음 주 3개 정하기"],
    ],
    mood: [0, 0, 2, 0, 1, 0, 0],
    thanks: ["지은이가 생일 선물 미리 챙겨 줌", "기타 선생님이 첫날부터 칭찬", "토요일 날씨 최고"],
    word: "설렘",
    who: ["팀장님", "기타 선생님", "", "지은", "", "러닝 크루", "엄마"],
  },
  ideas: {
    id: "i1",
    cards: [
      ["동네 카페 리뷰 블로그", 4, "블로그 이름 정하기", "2월 첫 주"],
      ["단톡방 보드게임 모임", 5, "날짜 투표 올리기", "1월 마지막 주"],
      ["출근길 브이로그", 3, "편집 앱 깔아 보기", "보류"],
      ["엄마 생신 깜짝 영상", 5, "옛날 사진 모으기", "3월"],
    ],
  },
  habit: {
    id: "h1",
    names: ["러닝", "책 20쪽", "물 2L", "기타 15분", "12시 전 취침"],
    // 1월 동안 체크한 날 (빠진 날도 있게)
    done: [[13, 16, 18, 20, 23, 25, 27, 30], [1, 2, 3, 5, 6, 8, 9, 10, 12, 13, 14, 15, 17, 19, 20, 21, 22, 24, 26, 27, 28, 29, 31], [3, 4, 5, 6, 7, 10, 11, 12, 18, 19, 20, 25, 26], [13, 14, 15, 17, 18, 20, 21, 22, 24, 27, 28, 29], [1, 4, 5, 9, 12, 19, 26]],
  },
};

(async () => {
  const { doc } = html();
  const out = path.join(__dirname, "out", `example-${TYPE}`);
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 2 });
  await p.setContent(doc.replace("</head>", `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Nanum+Pen+Script&display=swap">
<style>
.hw { font-family: "Nanum Pen Script", cursive; color: #2c3e91; font-size: 25px; line-height: 1; white-space: pre-line; }
.hw.sm { font-size: 21px; } .hw.red { color: #d9465b; }
.ln .hw { font-family: "Nanum Pen Script", cursive; width: auto; font-size: 25px; color: #2c3e91; margin-left: 4px; }
.hl { background: linear-gradient(transparent 55%, rgba(255, 214, 64, .55) 55%); }
.filled { background: currentColor !important; border-color: currentColor !important; }
</style></head>`), { waitUntil: "networkidle" });

  await p.evaluate((F) => {
    const hw = (text, cls = "") => { const s = document.createElement("span"); s.className = "hw " + cls; s.textContent = text; return s; };
    const MOOD = ["#2e9a6b", "#8a909c", "#3b6fd4"];

    // 목표
    const G = document.getElementById("goals");
    G.querySelectorAll(".list .ln").forEach((ln, i) => { if (F.goals.list[i]) ln.append(hw(F.goals.list[i])); });
    G.querySelectorAll(".pick").forEach((pk, i) => { const t = hw(F.goals.picks[i], "hl"); t.style.display = "block"; t.style.marginTop = "6px"; pk.append(t); });
    const kw = G.querySelector(".kw"); kw.style.display = "grid"; kw.style.placeItems = "center"; kw.append(hw(F.goals.keyword)); kw.lastChild.style.fontSize = "40px";

    // 월간
    const M = document.getElementById(F.month.id);
    M.querySelectorAll(".cell").forEach((c) => { const n = c.querySelector(".n"); if (n && F.month.cells[n.textContent]) c.append(hw(F.month.cells[n.textContent], "sm")); });
    M.querySelectorAll(".mfoot .box")[0].querySelectorAll(".ln").forEach((ln, i) => ln.append(hw(F.month.box[i])));
    const memo = M.querySelectorAll(".mfoot .box")[2].querySelector(".dots"); memo.style.padding = "10px 12px"; memo.append(hw(F.month.memo, "red"));
    M.querySelectorAll(".mfoot .box")[1].querySelectorAll(".ln").forEach((ln, i) => { const s = hw(F.month.feel[i]); s.style.marginLeft = "auto"; ln.append(s); });

    // 주간
    const Wk = document.getElementById(F.week.id);
    Wk.querySelectorAll(".three .ck").forEach((ck, i) => {
      const [t, done] = F.week.top[i];
      if (done) { ck.querySelector("u").classList.add("filled"); ck.querySelector("u").style.color = "#2e9a6b"; }
      const s = hw(t); s.style.marginLeft = "8px"; if (done) s.style.textDecoration = "line-through"; ck.append(s);
    });
    Wk.querySelectorAll(".day:not(.extra)").forEach((day, i) => {
      F.week.days[i].forEach((t, k) => { const s = hw(t, k === 1 && t.startsWith("→") ? "red" : ""); s.style.display = "block"; s.style.marginTop = k ? "4px" : "8px"; day.append(s); });
      const dots = day.querySelectorAll(".mood u"); const m = F.week.mood[i]; dots[m].classList.add("filled"); dots[m].style.color = MOOD[m];
    });
    const ex = Wk.querySelector(".day.extra"), exl = ex.querySelectorAll(".ln");
    F.week.thanks.forEach((t, k) => exl[k].append(hw(t)));
    const wd = hw(F.week.word, "red"); wd.style.marginLeft = "auto"; exl[3].append(wd);
    Wk.querySelectorAll(".day:not(.extra) .who").forEach((w, i) => { if (F.week.who[i]) { const s = hw(F.week.who[i], "sm"); s.style.marginLeft = "8px"; w.append(s); } });

    // 아이디어 주차장
    const I = document.getElementById(F.ideas.id);
    I.querySelectorAll(".idea").forEach((card, i) => {
      const c = F.ideas.cards[i]; if (!c) return;
      const ls = card.querySelectorAll(".il");
      [0, 2, 3].forEach((k, j) => { const sp = ls[k].querySelector("span"); sp.style.display = "flex"; sp.style.alignItems = "flex-end"; sp.append(hw([c[0], c[2], c[3]][j], j === 2 && c[3] === "보류" ? "red" : "")); });
      ls[1].querySelectorAll("u").forEach((u, k) => { if (k < c[1]) { u.classList.add("filled"); u.style.color = "#2e9a6b"; } });
    });

    // 습관
    const Hb = document.getElementById(F.habit.id);
    Hb.querySelectorAll(".hr:not(.head)").forEach((row, i) => {
      if (!F.habit.names[i]) return;
      row.querySelector(".hn").append(hw(F.habit.names[i]));
      const us = row.querySelectorAll("u"); F.habit.done[i].forEach((day) => { us[day - 1].classList.add("filled"); us[day - 1].style.color = "#2e9a6b"; });
    });
  }, FILL);
  await p.evaluate(() => document.fonts.ready);
  const shots = [["goals", "1-올해목표"], [FILL.month.id, "2-월간"], [FILL.week.id, "3-주간"], [FILL.ideas.id, "4-아이디어주차장"], [FILL.habit.id, "5-습관트래커"]];
  for (const [id, name] of shots) await (await p.$(`#${id}`)).screenshot({ path: path.join(out, `${name}.png`) });
  await b.close();
  console.log(`${out} 에 ${shots.length}장`);
})();
