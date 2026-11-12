/* ATELIER ON — 인테리어 제안 상세 페이지 (공통 템플릿). 페이지의 body data-project 값으로 프로젝트를 고릅니다. */
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
    '<section class="hero phero">' + A.photo(p.cover, p.title + " 대표 사진", { eager: true }) +
      '<div class="hero-copy">' +
        '<h1 class="hero-title">' + p.title + '</h1>' +
        '<p class="meta-line"><span>' + p.size + '</span><span>' + p.scope + '</span><span>' + p.style + '</span></p>' +
        '<p class="meta-tag">가상 프로젝트</p>' +
      '</div>' +
    '</section>' +
    '<div class="wrap crumb-row"><nav class="crumb" aria-label="현재 위치"><a href="projects.html">인테리어 제안</a><span aria-hidden="true">/</span><span aria-current="page">' + (p.crumb || p.size) + '</span></nav></div>' +
    '<section class="section"><div class="wrap story">' +
      '<dl class="facts">' +
        '<div><dt>공간</dt><dd>아파트</dd></div><div><dt>평형</dt><dd>' + p.size + '</dd></div>' +
        '<div><dt>공사 범위</dt><dd>' + p.scope + '</dd></div><div><dt>스타일</dt><dd>' + p.style + '</dd></div>' +
        '<div class="todo"><dt>공사 기간</dt><dd>실제 업체 입력<small>예: ' + (p.id === "p04" ? "3주" : "6~8주") + '</small></dd></div>' +
        '<div class="todo"><dt>예산 범위</dt><dd>실제 업체 입력<small>예: 상담 후 안내</small></dd></div>' +
      '</dl>' +
      '<div class="story-text"><h2 class="t-h2">' + p.oneLine + '</h2>' + p.intro.map(function (t) { return "<p>" + t + "</p>"; }).join("") + '</div>' +
    '</div></section>' +
    '<section class="wrap flow" aria-label="공간별 사진">' +
      fig(G[0], "wide") +
      '<p class="flow-text">' + p.more + '</p>' +
      '<div class="pair">' + fig(G[1], "half") + fig(G[2], "half") + '</div>' +
      (G[3] ? fig(G[3], "wide") : "") +
      '<p class="credit">' + A.credit + '</p>' +
    '</section>' +
    '<nav class="wrap pn" aria-label="다른 인테리어 제안">' +
      '<a class="pn-prev" href="' + prev.page + '"><span>이전 제안</span><b>' + prev.title + '</b></a>' +
      '<a class="pn-all link" href="projects.html">전체 제안</a>' +
      '<a class="pn-next" href="' + next.page + '"><span>다음 제안</span><b>' + next.title + '</b></a>' +
    '</nav>' +
    '<section class="section band"><div class="wrap cta">' +
      '<h2 class="sec-title">상담 문의</h2>' +
      '<p>비슷한 인테리어를 계획 중이시라면 ' + p.size + ' 아파트의 ' + p.scope + '에 대해 궁금한 점을 남겨 주세요.</p>' +
      '<ol class="cta-steps"><li>상담 신청</li><li>현장 확인·실측</li><li>디자인 제안·견적</li></ol>' +
      '<a class="btn" href="contact.html">상담 문의하기</a>' +
    '</div></section>';

})();
