// 상세페이지용 비교 이미지: 두 유형의 같은 속지를 나란히 (글자가 속지를 바꾼다는 걸 보여 주는 컷)
// 사용법: node diary-2027/compare.js ENFP ISTJ   (먼저 두 유형 모두 build.js 로 미리보기를 만들어 둘 것)
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");
const [A, B] = [process.argv[2] || "ENFP", process.argv[3] || "ISTJ"].map((s) => s.toUpperCase());
const out = path.join(__dirname, "out");
const img = (t, key) => {
  const f = fs.readdirSync(path.join(out, `preview-${t}`)).find((n) => n.endsWith(`-${key}.png`));
  return "data:image/png;base64," + fs.readFileSync(path.join(out, `preview-${t}`, f)).toString("base64");
};
const rows = [["w1", "주간", "J는 시간 블록, P는 딱 3개"], ["m1", "월간", "T는 이달의 숫자, F는 이달의 감정"], ["guide", "사용법", "글자 4개가 정한 모듈"]];
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1200, height: 100 }, deviceScaleFactor: 1 });
  await p.setContent(`<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Gowun+Dodum&family=IBM+Plex+Mono:wght@600&family=Gothic+A1:wght@600;800&display=swap"><style>
    body{margin:0;width:1200px;background:#f4f5f7;font-family:"Gothic A1",sans-serif;color:#23262d}
    header{padding:70px 60px 30px;text-align:center} h1{font-family:"Gowun Dodum",sans-serif;font-weight:400;font-size:48px;margin:0}
    header p{font-size:20px;color:#6a6f7c;margin:12px 0 0}
    .types{display:grid;grid-template-columns:1fr 1fr;gap:40px;padding:10px 60px 0;text-align:center;font-family:"IBM Plex Mono",monospace;font-size:44px}
    .row{padding:30px 60px 10px} .row h2{font-size:22px;margin:0 0 4px} .row p{margin:0 0 16px;color:#6a6f7c;font-size:17px}
    .pair{display:grid;grid-template-columns:1fr 1fr;gap:40px} .pair img{width:100%;border-radius:14px;box-shadow:0 14px 34px -14px rgba(0,0,0,.35)}
    footer{height:70px}
  </style></head><body>
    <header><h1>표지만 바꾼 다이어리가 아니에요</h1><p>MBTI 글자 4개가 속지 구성을 하나씩 바꿔요</p></header>
    <div class="types"><span style="color:#2e9a6b">${A}</span><span style="color:#3567c9">${B}</span></div>
    ${rows.map(([k, t, d]) => `<section class="row"><h2>${t}</h2><p>${d}</p><div class="pair"><img src="${img(A, k)}"><img src="${img(B, k)}"></div></section>`).join("")}
    <footer></footer></body></html>`, { waitUntil: "networkidle" });
  await p.evaluate(() => document.fonts.ready);
  const f = path.join(out, `compare-${A}-${B}.png`);
  await p.screenshot({ path: f, fullPage: true });
  await b.close();
  console.log(f);
})();
