/* ATELIER ON — 시공 사례 상세 페이지 (공통 템플릿). 페이지의 body data-project 값으로 프로젝트를 고릅니다. */
(function () {
  var A = window.ATELIER, list = A.projects;
  var id = document.body.getAttribute("data-project");
  var p = list.filter(function (x) { return x.id === id; })[0] || list[0];
  document.title = p.title + " | 아틀리에 온";

  var seen = {};
  function fig(g, cls) {
    var fid = seen[g.room] ? "" : ' id="photo-' + g.room + '"';
    seen[g.room] = true;
    return '<figure class="' + cls + '"' + fid + ' data-room="' + g.room + '">' + A.photo(g.img, g.name + ": " + g.note, { pos: g.pos }) +
      '<figcaption><b>' + g.name + '</b>' + g.note + '</figcaption></figure>';
  }
  var G = p.gallery;
  var i = list.indexOf(p);
  var prev = list[(i + list.length - 1) % list.length], next = list[(i + 1) % list.length];

  document.getElementById("detail").innerHTML =
    '<div class="wrap page-head">' +
      '<nav class="crumb" aria-label="현재 위치"><a href="projects.html">시공 사례</a><span aria-hidden="true">/</span><span aria-current="page">' + p.size + '</span></nav>' +
      '<div class="detail-title"><h1 class="t-h1">' + p.title + '</h1><span class="tag">가상 프로젝트</span></div>' +
      '<p class="lead">' + p.oneLine + '</p>' +
    '</div>' +
    '<div class="wrap detail-hero">' + A.photo(p.cover, p.title + " 대표 사진", { eager: true }) + '</div>' +
    '<section class="section"><div class="wrap story">' +
      '<dl class="facts">' +
        '<div><dt>공간</dt><dd>아파트</dd></div><div><dt>평형</dt><dd>' + p.size + '</dd></div>' +
        '<div><dt>공사 범위</dt><dd>' + p.scope + '</dd></div><div><dt>스타일</dt><dd>' + p.style + '</dd></div>' +
      '</dl>' +
      '<div class="story-text"><h2 class="t-h2">공간 소개</h2>' + p.intro.map(function (t) { return "<p>" + t + "</p>"; }).join("") + '</div>' +
      '<figure class="plan-box">' + A.planSVG(p, { links: true, cls: "draw" }) +
        '<figcaption>평면 개념도입니다. 밑줄 친 공간을 누르면 그 공간 사진으로 이동합니다.</figcaption></figure>' +
    '</div></section>' +
    '<section class="wrap flow" aria-label="공간별 사진">' +
      fig(G[0], "wide") +
      '<p class="flow-text">' + p.more + '</p>' +
      '<div class="pair">' + fig(G[1], "half") + fig(G[2], "half") + '</div>' +
      fig(G[3], "wide") +
      '<p class="credit">' + A.credit + '</p>' +
    '</section>' +
    '<nav class="wrap pn" aria-label="다른 시공 사례">' +
      '<a class="pn-prev" href="' + prev.page + '"><span>이전 사례</span><b>' + prev.title + '</b></a>' +
      '<a class="pn-all link" href="projects.html">전체 시공 사례</a>' +
      '<a class="pn-next" href="' + next.page + '"><span>다음 사례</span><b>' + next.title + '</b></a>' +
    '</nav>' +
    '<section class="section"><div class="wrap cta">' +
      '<h2 class="t-h2">비슷한 인테리어를 계획 중이신가요?</h2>' +
      '<p>' + p.size + ' 아파트의 ' + p.scope + '에 대해 궁금한 점을 남겨 주세요.</p>' +
      '<a class="btn" href="contact.html">상담 문의하기</a>' +
    '</div></section>';

  // 평면도 ↔ 사진 연결: 사진 위에 올리면 평면도의 방이, 방 위에 올리면 사진이 표시됩니다.
  var rooms = document.querySelectorAll(".plan a.room"), figs = document.querySelectorAll(".flow figure");
  function hl(room, on) {
    rooms.forEach(function (r) { r.classList.toggle("hl", on && r.dataset.room === room); });
    figs.forEach(function (f) { f.classList.toggle("hl", on && f.dataset.room === room); });
  }
  rooms.forEach(function (r) {
    r.addEventListener("mouseenter", function () { hl(r.dataset.room, true); });
    r.addEventListener("mouseleave", function () { hl(r.dataset.room, false); });
    r.addEventListener("focus", function () { hl(r.dataset.room, true); });
    r.addEventListener("blur", function () { hl(r.dataset.room, false); });
  });
  figs.forEach(function (f) {
    f.addEventListener("mouseenter", function () { hl(f.dataset.room, true); });
    f.addEventListener("mouseleave", function () { hl(f.dataset.room, false); });
  });
})();
