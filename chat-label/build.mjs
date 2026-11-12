// 배포용 빌드: index.html 앞뒤에 문서 뼈대(<!doctype html>, <head>)와 공유 미리보기 태그를 붙여 dist/ 로 내보낸다.
// 사용법: node build.mjs   (Vercel·Cloudflare Pages 빌드 명령도 같음, 출력 폴더는 dist)
import { readFileSync, writeFileSync, mkdirSync, copyFileSync, rmSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, "dist");
const src = readFileSync(join(here, "index.html"), "utf8");

// config.js 에서 siteUrl 읽기
const ctx = { window: {} };
vm.runInNewContext(readFileSync(join(here, "config.js"), "utf8"), ctx);
const cfg = ctx.window.CHAT_LABEL_CONFIG || {};
const site = (cfg.siteUrl || "").replace(/\/$/, "");

const cut = src.indexOf("</style>") + "</style>".length;
const head = src.slice(0, cut), body = src.slice(cut);
const title = (/<title>(.*?)<\/title>/.exec(src) || [])[1] || "우리 대화 성분표";
const desc = (/<meta name="description" content="(.*?)">/.exec(src) || [])[1] || "";
const og = site ? `${site}/og.png` : "og.png";
const esc = (s) => s.replace(/"/g, "&quot;");
const favicon = "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect x="2" y="2" width="28" height="28" fill="#fff" stroke="#14161b" stroke-width="3"/><rect x="6" y="9" width="20" height="3" fill="#14161b"/><rect x="6" y="16" width="12" height="2" fill="#2d58e6"/><rect x="6" y="21" width="16" height="2" fill="#e2405f"/></svg>');

const html = `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${og}">
${site ? `<meta property="og:url" content="${site}/">\n<link rel="canonical" href="${site}/">\n` : ""}<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="${favicon}">
<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>
${head}
</head>
<body>
${body.trim()}
</body>
</html>
`;

if (existsSync(out)) rmSync(out, { recursive: true });
mkdirSync(out);
writeFileSync(join(out, "index.html"), html);
for (const f of ["config.js", "chatlab.js", "saju.js", "privacy.html", "og.png"]) copyFileSync(join(here, f), join(out, f));

const warn = [];
if (!site) warn.push("config.js 의 siteUrl 이 비어 있어요. 카톡·인스타 링크 미리보기 이미지가 안 뜰 수 있어요.");
if (!cfg.goatcounter) warn.push("config.js 의 goatcounter 가 비어 있어요. 방문 통계가 꺼진 채로 나갑니다.");
if (!cfg.preorderUrl) warn.push("config.js 의 preorderUrl 이 비어 있어요. 사전 예약 버튼은 클릭만 기록하고 '준비 중'을 보여줍니다.");
if (readFileSync(join(here, "privacy.html"), "utf8").includes("배포 전에 적어 주세요")) warn.push("privacy.html 의 운영자·연락처를 채워 주세요.");
console.log("dist/ 를 만들었어요.");
for (const w of warn) console.log("  ! " + w);
