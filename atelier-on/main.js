/* ATELIER ON — 공통 헤더·푸터, 프로젝트 데이터, 평면도 렌더링 */
(function () {
  "use strict";

  /* ---- 프로젝트 데이터 (기획서 v2.0 표 기준; 모두 가상 프로젝트) ---- */
  var PROJECTS = [
    {
      id: "p01", cover: "6933852", size: "30평대", scope: "전체 리모델링", style: "모던 내추럴",
      title: "30평대 아파트 전체 리모델링",
      oneLine: "거실과 주방을 하나로 이은 밝은 집",
      intro: [
        "밝은 화이트 톤을 기본으로 따뜻한 우드 소재를 더해 편안한 분위기의 집을 구성했습니다.",
        "거실과 주방이 자연스럽게 이어지도록 공간을 정리했습니다."
      ],
      more: "식탁은 주방 아일랜드 바로 옆에 두어 요리하는 사람과 앉은 사람이 마주 볼 수 있게 했습니다. 거실 한쪽 벽은 우드 슬랫으로 마감해 흰 벽이 많은 집에 따뜻한 결을 더했습니다.",
      outer: [10, 10, 300, 200],
      rooms: [
        { id: "bed1", label: "안방", r: [10, 10, 100, 110] },
        { id: "bed2", label: "침실", r: [10, 120, 100, 90] },
        { id: "living", label: "거실", r: [110, 10, 130, 120] },
        { id: "kitchen", label: "주방", r: [110, 130, 70, 80] },
        { id: "dining", label: "식탁", r: [180, 130, 60, 80] },
        { id: "bath", label: "욕실", r: [240, 10, 70, 60] },
        { id: "bed3", label: "침실", r: [240, 70, 70, 80] },
        { id: "entry", label: "현관", r: [240, 150, 70, 60] }
      ],
      gallery: [
        { room: "living", img: "6933855", name: "거실", note: "창 쪽에 소파, 맞은편 벽에 TV 수납장" },
        { room: "dining", img: "6933854", name: "식탁", note: "주방 바로 옆 자리", pos: "45% 50%" },
        { room: "living", img: "6933860", name: "거실 벽", note: "우드 슬랫 마감", pos: "40% 50%" },
        { room: "kitchen", img: "6933853", name: "주방", note: "거실 쪽으로 열린 아일랜드" }
      ]
    },
    {
      id: "p02", cover: "6890394", size: "20평대", scope: "전체 인테리어", style: "화이트 우드",
      title: "20평대 아파트 전체 인테리어",
      oneLine: "흰 벽과 밝은 우드 가구로 넓어 보이게 한 집",
      intro: [
        "흰 벽과 밝은 우드 가구로 공간이 넓어 보이도록 구성했습니다.",
        "창가와 벽면에 붙박이 수납을 더해 생활용품이 눈에 덜 띄게 정리했습니다."
      ],
      more: "주방은 상부장까지 흰색으로 맞춰 벽처럼 보이게 했습니다. 욕실은 세면대 상판을 우드로 골라 거실·침실과 같은 재료로 이어지게 했습니다.",
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
        { room: "living", img: "6890403", name: "거실", note: "창가에 짜 넣은 붙박이 선반" },
        { room: "kitchen", img: "6890396", name: "주방", note: "흰 상하부장과 타일 벽", pos: "45% 50%" },
        { room: "bath", img: "6890401", name: "욕실", note: "우드 상판 세면대와 조명 거울", pos: "35% 50%" },
        { room: "bed1", img: "6890398", name: "안방", note: "흰 침구와 우드 가구" }
      ]
    },
    {
      id: "p03", cover: "7005297", size: "40평대", scope: "전체 리모델링", style: "웜 모던",
      title: "40평대 아파트 전체 리모델링",
      oneLine: "수납을 넉넉히 둔 베이지 톤의 넓은 집",
      intro: [
        "베이지와 그레이 톤을 사용해 차분하고 따뜻한 분위기를 만들었습니다.",
        "현관과 드레스룸에 붙박이 수납을 넉넉히 두어 넓은 집을 정돈해 쓸 수 있게 했습니다."
      ],
      more: "현관에는 낮은 수납장과 천장까지 닿는 붙박이장을 함께 두어 신발과 겉옷을 나눠 넣을 수 있게 했습니다. 드레스룸은 선반과 서랍으로 칸을 나눠 계절마다 옷을 바꿔 넣기 쉽게 했습니다.",
      outer: [10, 10, 300, 200],
      rooms: [
        { id: "bed1", label: "안방", r: [10, 10, 110, 120] },
        { id: "dress", label: "드레스룸", r: [10, 130, 110, 80] },
        { id: "living", label: "거실", r: [120, 10, 120, 130] },
        { id: "kitchen", label: "주방", r: [120, 140, 120, 70] },
        { id: "bed2", label: "침실", r: [240, 10, 70, 80] },
        { id: "entry", label: "현관", r: [240, 90, 70, 60] },
        { id: "bath", label: "욕실", r: [240, 150, 70, 60] }
      ],
      gallery: [
        { room: "kitchen", img: "7005291", name: "주방", note: "그레이 유리 상부장과 베이지 하부장" },
        { room: "entry", img: "7005286", name: "현관", note: "낮은 수납장과 둥근 거울", pos: "35% 50%" },
        { room: "dress", img: "7005285", name: "드레스룸", note: "선반과 서랍으로 나눈 수납" },
        { room: "kitchen", img: "7005300", name: "식탁", note: "아일랜드와 나란히 둔 긴 테이블" }
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
    var a11y = opt.hidden ? ' aria-hidden="true" focusable="false"' :
      ' role="' + (opt.links ? "group" : "img") + '" aria-label="' + esc(opt.label || p.size + " 평면 개념도") + '"';
    return '<svg class="plan ' + (opt.cls || "") + '" viewBox="0 0 ' + vbW + " " + vbH + '"' + a11y + '>' +
      (opt.fill ? '<defs><pattern id="' + hatch + '" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="8" height="8" fill="#C9B08C"/><path d="M0 0v8" stroke="#8C7050" stroke-width="2"/></pattern></defs>' : "") +
      rooms + '<rect class="wall" x="' + o[0] + '" y="' + o[1] + '" width="' + o[2] + '" height="' + o[3] + '" style="--len:' + len + '"/></svg>';
  }
  window.ATELIER.planSVG = planSVG;

  var CREDIT = "사진: Pexels, Max Vakhtbovych";
  function photo(id, alt, opt) {
    opt = opt || {};
    return '<div class="ph"' + (opt.pos ? ' style="--pos:' + opt.pos + '"' : "") + '><img src="images/' + id + '.jpg" alt="' + esc(alt) + '"' +
      (opt.eager ? ' fetchpriority="high"' : ' loading="lazy"') + ' decoding="async"></div>';
  }
  window.ATELIER.photo = photo;
  window.ATELIER.credit = CREDIT;

  function card(p, level) {
    var h = "h" + (level || 3);
    return '<a class="card" href="detail.html?p=' + p.id + '">' +
      photo(p.cover, "") +
      '<div class="card-body"><' + h + ' class="card-title">' + esc(p.title) + "</" + h + ">" +
      '<p class="card-desc">' + esc(p.oneLine) + "</p>" +
      planSVG(p, { cls: "card-plan", hidden: true }) +
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
  var main = document.querySelector("main");
  if (main) {
    main.id = main.id || "main";
    main.setAttribute("tabindex", "-1");
    var skip = document.createElement("a");
    skip.className = "skip"; skip.href = "#" + main.id; skip.textContent = "본문 바로가기";
    document.body.prepend(skip);
  }

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
    '<div class="foot-note"><p>이 사이트는 홈페이지 제작 포트폴리오용 데모입니다. 소개된 시공 사례는 모두 가상 프로젝트이며, 사업자 정보는 표시하지 않습니다. 사진은 Pexels(Max Vakhtbovych)의 무료 이미지입니다.</p><p>© ATELIER ON 데모</p></div></div>';
  document.body.append(footer);

  /* ---- 프로젝트 목록 ---- */
  document.querySelectorAll("[data-cards]").forEach(function (el) {
    var level = +el.getAttribute("data-cards") || 3;
    el.innerHTML = PROJECTS.map(function (p) { return card(p, level); }).join("");
  });

  /* ---- 서비스 범위 평면도 ---- */
  var base = PROJECTS[0];
  document.querySelectorAll("[data-scope]").forEach(function (el) {
    var full = el.getAttribute("data-scope") === "full";
    el.innerHTML = planSVG(base, {
      fill: full ? base.rooms.map(function (r) { return r.id; }) : ["kitchen", "bath"],
      label: full ? "모든 공간이 공사 범위인 평면 예시" : "주방과 욕실만 공사 범위인 평면 예시"
    });
  });

  /* ---- 정적 마크업의 사진 ---- */
  document.querySelectorAll("[data-img]").forEach(function (el) {
    el.outerHTML = photo(el.getAttribute("data-img"), el.getAttribute("data-alt"), { pos: el.getAttribute("data-pos"), eager: el.hasAttribute("data-eager") });
  });
})();
