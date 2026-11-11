/* ATELIER ON — 공통 헤더·푸터, 프로젝트 데이터, 평면도 렌더링 */
(function () {
  "use strict";

  /* ---- 프로젝트 데이터 (기획서 v2.0 표 기준; 모두 가상 프로젝트) ---- */
  var PROJECTS = [
    {
      id: "p01", cover: "living", size: "30평대", scope: "전체 리모델링", style: "모던 내추럴",
      title: "30평대 아파트 전체 리모델링",
      oneLine: "화이트와 우드로 마감한 모던 내추럴 스타일",
      intro: [
        "밝은 화이트 톤을 기본으로 따뜻한 우드 소재를 더해 편안한 분위기의 집을 구성했습니다.",
        "거실과 주방이 자연스럽게 이어지도록 공간을 정리했습니다."
      ],
      tone: { wall: "#F3F0EA", floor: "#C9A67E", obj: "#E2D9CC" },
      outer: [10, 10, 300, 200],
      rooms: [
        { id: "bed1", label: "안방", r: [10, 10, 100, 110] },
        { id: "bed2", label: "침실", r: [10, 120, 100, 90] },
        { id: "living", label: "거실", r: [110, 10, 130, 120] },
        { id: "kitchen", label: "주방", r: [110, 130, 130, 80] },
        { id: "bath", label: "욕실", r: [240, 10, 70, 60] },
        { id: "bed3", label: "침실", r: [240, 70, 70, 80] },
        { id: "entry", label: "현관", r: [240, 150, 70, 60] }
      ],
      gallery: [
        { room: "living", scene: "living", name: "거실", note: "거실 전경과 창가 쪽 소파 배치" },
        { room: "kitchen", scene: "kitchen", name: "주방", note: "거실과 이어지는 일자형 주방" },
        { room: "bed1", scene: "bed", name: "안방", note: "침대 뒤 벽면과 조명" },
        { room: "entry", scene: "detail", name: "현관 수납", note: "우드 루버로 마감한 현관 수납장" }
      ]
    },
    {
      id: "p02", cover: "kitchen", size: "20평대", scope: "전체 인테리어", style: "화이트 우드",
      title: "20평대 아파트 전체 인테리어",
      oneLine: "화이트 벽과 밝은 우드 바닥으로 넓어 보이게 한 집",
      intro: [
        "화이트 벽과 밝은 우드 바닥으로 공간이 넓어 보이도록 구성했습니다.",
        "방마다 붙박이 수납을 더해 생활용품이 눈에 덜 띄게 정리했습니다."
      ],
      tone: { wall: "#F6F5F1", floor: "#DCC3A0", obj: "#ECE6DC" },
      outer: [10, 10, 260, 200],
      rooms: [
        { id: "bed1", label: "안방", r: [10, 10, 100, 110] },
        { id: "bed2", label: "침실", r: [10, 120, 100, 90] },
        { id: "living", label: "거실", r: [110, 10, 160, 110] },
        { id: "kitchen", label: "주방", r: [110, 120, 100, 90] },
        { id: "bath", label: "욕실", r: [210, 120, 60, 50] },
        { id: "entry", label: "현관", r: [210, 170, 60, 40] }
      ],
      gallery: [
        { room: "living", scene: "living", name: "거실", note: "거실 전경" },
        { room: "kitchen", scene: "kitchen", name: "주방", note: "화이트 하부장과 우드 상판" },
        { room: "bed1", scene: "bed", name: "안방", note: "침대 옆 붙박이장" },
        { room: "bath", scene: "bath", name: "욕실", note: "밝은 타일과 매립 수납장" }
      ]
    },
    {
      id: "p03", cover: "detail", size: "40평대", scope: "전체 리모델링", style: "웜 모던",
      title: "40평대 아파트 전체 리모델링",
      oneLine: "베이지와 짙은 우드로 맞춘 웜 모던 스타일",
      intro: [
        "베이지와 짙은 우드를 사용해 차분하고 따뜻한 분위기를 만들었습니다.",
        "거실은 넓게 열어 두고, 안방에는 드레스룸을 붙여 수납을 모았습니다."
      ],
      tone: { wall: "#EAE2D6", floor: "#8F6B4C", obj: "#D6C9B6" },
      outer: [10, 10, 300, 200],
      rooms: [
        { id: "bed1", label: "안방", r: [10, 10, 110, 120] },
        { id: "dress", label: "드레스룸", r: [10, 130, 110, 80] },
        { id: "living", label: "거실", r: [120, 10, 120, 130] },
        { id: "kitchen", label: "주방", r: [120, 140, 120, 70] },
        { id: "bed2", label: "침실", r: [240, 10, 70, 80] },
        { id: "bed3", label: "침실", r: [240, 90, 70, 60] },
        { id: "bath", label: "욕실", r: [240, 150, 70, 60] }
      ],
      gallery: [
        { room: "living", scene: "living", name: "거실", note: "거실 전경" },
        { room: "kitchen", scene: "kitchen", name: "주방", note: "짙은 우드 하부장과 베이지 벽" },
        { room: "bed1", scene: "bed", name: "안방", note: "간접 조명을 넣은 안방" },
        { room: "dress", scene: "detail", name: "드레스룸", note: "안방과 이어지는 드레스룸" }
      ]
    }
  ];
  window.ATELIER = { projects: PROJECTS };

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  /* ---- 평면도 SVG ---- */
  var planSeq = 0;
  function planSVG(p, opt) {
    opt = opt || {};
    var hatch = "hatch-" + (++planSeq);
    var o = p.outer, vbW = o[0] + o[2] + 10, vbH = o[1] + o[3] + 10;
    var rooms = p.rooms.map(function (rm, i) {
      var r = rm.r, on = opt.fill && opt.fill.indexOf(rm.id) > -1 ? " on" : "";
      var fill = on ? "fill:url(#" + hatch + ");" : "";
      var len = 2 * (r[2] + r[3]);
      var inner = '<rect x="' + r[0] + '" y="' + r[1] + '" width="' + r[2] + '" height="' + r[3] + '" style="' + fill + '--len:' + len + '"/>' +
        '<text x="' + (r[0] + r[2] / 2) + '" y="' + (r[1] + r[3] / 2) + '">' + esc(rm.label) + "</text>";
      var linked = opt.links && p.gallery.some(function (g) { return g.room === rm.id; });
      if (linked) return '<a class="room' + on + '" href="#photo-' + rm.id + '" data-room="' + rm.id + '" style="--i:' + i + '" aria-label="' + esc(rm.label) + ' 사진 보기">' + inner + "</a>";
      return '<g class="room' + on + '" style="--i:' + i + '">' + inner + "</g>";
    }).join("");
    var len = 2 * (o[2] + o[3]);
    return '<svg class="plan ' + (opt.cls || "") + '" viewBox="0 0 ' + vbW + " " + vbH + '" role="img" aria-label="' + esc(opt.label || p.size + " 평면 개념도") + '">' +
      (opt.fill ? '<defs><pattern id="' + hatch + '" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="8" height="8" fill="#C9B08C"/><path d="M0 0v8" stroke="#8C7050" stroke-width="2"/></pattern></defs>' : "") +
      rooms + '<rect class="wall" x="' + o[0] + '" y="' + o[1] + '" width="' + o[2] + '" height="' + o[3] + '" style="--len:' + len + '"/></svg>';
  }
  window.ATELIER.planSVG = planSVG;

  function photo(tone, scene, note, extra) {
    return '<div class="ph" data-scene="' + scene + '" style="--wall:' + tone.wall + ";--floor:" + tone.floor + ";--obj:" + tone.obj + (extra || "") + '">' +
      '<span class="ph-light"></span><span class="ph-obj"></span><span class="ph-note">' + esc(note) + "</span></div>";
  }
  window.ATELIER.photo = photo;

  function card(p) {
    return '<a class="card" href="detail.html?p=' + p.id + '">' +
      photo(p.tone, p.cover, p.size + " 대표 사진 자리") +
      '<div class="card-body"><h3 class="card-title">' + esc(p.title) + "</h3>" +
      planSVG(p, { cls: "card-plan", label: p.size + " 평면" }) +
      '<dl class="card-meta"><dt>평형</dt><dd>' + p.size + "</dd><dt>공사 범위</dt><dd>" + p.scope + "</dd><dt>스타일</dt><dd>" + p.style + "</dd></dl>" +
      '<span class="tag">가상 프로젝트</span></div></a>';
  }

  /* ---- 공통 헤더·푸터 ---- */
  var NAV = [["index.html", "홈", "home"], ["projects.html", "시공 사례", "projects"], ["about.html", "업체 소개", "about"], ["contact.html", "상담 문의", "contact"]];
  var LOGO = '<svg viewBox="0 0 28 28" aria-hidden="true"><path d="M3 25V3h22" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M3 25h9" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M12 25a13 13 0 0 1 13-13" fill="none" stroke="currentColor" stroke-width="1.2"/><path d="M25 12v13" stroke="currentColor" stroke-width="1.2"/></svg>';
  function navLinks(page) {
    return NAV.map(function (n) { return '<a href="' + n[0] + '"' + (n[2] === page ? ' aria-current="page"' : "") + ">" + n[1] + "</a>"; }).join("");
  }

  var page = document.body.getAttribute("data-page");
  var header = document.createElement("header");
  header.className = "site-header";
  header.innerHTML = '<div class="wrap header-inner"><a class="logo" href="index.html" aria-label="아틀리에 온 홈">' + LOGO +
    '<span class="logo-word">ATELIER ON</span><span class="logo-ko">아틀리에 온</span></a>' +
    '<nav class="nav" aria-label="주 메뉴">' + navLinks(page) + "</nav>" +
    '<button class="menu-btn" type="button" aria-expanded="false" aria-controls="mobile-menu" aria-label="메뉴 열기">' +
    '<svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true"><path class="m1" d="M2 6h18M2 16h18" stroke="currentColor" stroke-width="1.6"/></svg></button></div>' +
    '<nav id="mobile-menu" class="mobile-menu" aria-label="모바일 메뉴">' + navLinks(page) + "</nav>";
  document.body.prepend(header);

  var btn = header.querySelector(".menu-btn"), menu = header.querySelector(".mobile-menu");
  function setMenu(open) {
    btn.setAttribute("aria-expanded", open);
    btn.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
    btn.querySelector("path").setAttribute("d", open ? "M4 4l14 14M18 4L4 18" : "M2 6h18M2 16h18");
    menu.classList.toggle("open", open);
    document.body.style.overflow = open ? "hidden" : "";
    document.querySelectorAll("body > main, body > footer").forEach(function (el) { el.inert = open; });
    if (open) menu.querySelector("a").focus();
  }
  btn.addEventListener("click", function () { setMenu(btn.getAttribute("aria-expanded") !== "true"); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && menu.classList.contains("open")) { setMenu(false); btn.focus(); } });
  window.addEventListener("resize", function () { if (window.innerWidth > 768 && menu.classList.contains("open")) setMenu(false); });

  var footer = document.createElement("footer");
  footer.className = "site-footer";
  footer.innerHTML = '<div class="wrap foot"><div><a class="logo" href="index.html">' + LOGO + '<span class="logo-word">ATELIER ON</span></a>' +
    "<p>아파트와 주거 공간을 중심으로 인테리어를 제안하는 스튜디오입니다.</p></div>" +
    '<nav aria-label="하단 메뉴">' + navLinks("") + "</nav>" +
    '<div class="foot-note"><p>이 사이트는 홈페이지 제작 포트폴리오용 데모입니다. 소개된 시공 사례는 모두 가상 프로젝트이며, 사업자 정보는 표시하지 않습니다.</p><p>© ATELIER ON 데모</p></div></div>';
  document.body.append(footer);

  /* ---- 프로젝트 목록 ---- */
  document.querySelectorAll("[data-cards]").forEach(function (el) { el.innerHTML = PROJECTS.map(card).join(""); });

  /* ---- 서비스 범위 평면도 ---- */
  var base = PROJECTS[0];
  document.querySelectorAll("[data-scope]").forEach(function (el) {
    var full = el.getAttribute("data-scope") === "full";
    el.innerHTML = planSVG(base, {
      fill: full ? base.rooms.map(function (r) { return r.id; }) : ["kitchen", "bath"],
      label: full ? "모든 공간이 공사 범위인 평면 예시" : "주방과 욕실만 공사 범위인 평면 예시"
    });
  });

  /* ---- 사진 자리 (정적 마크업용) ---- */
  document.querySelectorAll("[data-photo]").forEach(function (el) {
    var t = PROJECTS[+el.getAttribute("data-tone") || 0].tone;
    el.outerHTML = photo(t, el.getAttribute("data-photo"), el.getAttribute("data-note"), el.getAttribute("data-extra") || "");
  });
})();
