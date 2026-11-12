/* ATELIER ON — 시공 사례 상세 페이지 (공통 템플릿). 페이지의 body data-project 값으로 프로젝트를 고릅니다. */
(function () {
  var A = window.ATELIER, list = A.projects;
  var id = document.body.getAttribute("data-project");
  var p = list.filter(function (x) { return x.id === id; })[0] || list[0];
  document.title = p.title + " | 아틀리에 온";

  function spaceBlock(s, k) {
    var n = s.photos.length;
    return '<section class="space-block n' + n + '" aria-labelledby="sp-' + k + '">' +
      '<div class="space-head"><h3 id="sp-' + k + '">' + s.name + '</h3><p>' + s.line + '</p></div>' +
      '<div class="space-photos">' + s.photos.map(function (ph) {
        return '<figure>' + A.photo(ph[0], s.name + ": " + ph[1] + (ph[3] ? " (다른 집 참고 사진)" : ""), { pos: ph[2] || undefined }) + '<figcaption>' + ph[1] + (ph[3] ? '<span class="ref-mark">참고 사진 (다른 집)</span>' : "") + '</figcaption></figure>';
      }).join("") + '</div></section>';
  }
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
    '<div class="wrap crumb-row"><nav class="crumb" aria-label="현재 위치"><a href="projects.html">시공 사례</a><span aria-hidden="true">/</span><span aria-current="page">' + (p.crumb || p.size) + '</span></nav></div>' +
    '<section class="section"><div class="wrap story">' +
      '<dl class="facts">' +
        '<div><dt>공간</dt><dd>아파트</dd></div><div><dt>평형</dt><dd>' + p.size + '</dd></div>' +
        '<div><dt>공사 범위</dt><dd>' + p.scope + '</dd></div><div><dt>스타일</dt><dd>' + p.style + '</dd></div>' +
        '<div class="todo"><dt>공사 기간</dt><dd>실제 업체 입력<small>예: ' + (p.id === "p04" ? "3주" : "6~8주") + '</small></dd></div>' +
        '<div class="todo"><dt>예산 범위</dt><dd>실제 업체 입력<small>예: 상담 후 안내</small></dd></div>' +
      '</dl>' +
      '<div class="story-text"><h2 class="t-h2">' + p.oneLine + '</h2>' +
        '<div class="story-part"><h3>이 집의 고민</h3><p>' + p.concern + '</p></div>' +
        '<div class="story-part"><h3>이렇게 풀었습니다</h3>' + p.intro.map(function (t) { return "<p>" + t + "</p>"; }).join("") + '</div>' +
        '<div class="story-part"><h3>핵심 결정</h3><ol class="decisions">' + p.decisions.map(function (t) { return "<li>" + t + "</li>"; }).join("") + '</ol></div>' +
      '</div>' +
    '</div></section>' +
    '<section class="wrap materials" aria-labelledby="mat-title">' +
      '<div class="materials-head"><h2 class="sec-title" id="mat-title">공간별 자재</h2><p>이 사례에 쓴 마감재 조합입니다. 같은 자재가 궁금하시면 상담 때 샘플을 보여 드립니다.</p></div>' +
      '<div class="mat-wrap"><table class="mat-table"><thead><tr><th scope="col">공간</th><th scope="col">바닥</th><th scope="col">벽</th><th scope="col">가구·조명</th></tr></thead><tbody>' +
        p.materials.map(function (r) { return '<tr><th scope="row">' + r[0] + '</th><td data-k="바닥">' + r[1] + '</td><td data-k="벽">' + r[2] + '</td><td data-k="가구·조명">' + r[3] + '</td></tr>'; }).join("") +
      '</tbody></table></div>' +
      '<p class="mat-note">가상 사례라 브랜드와 품번은 적지 않았습니다. 실제 업체 납품 시 자재명을 채웁니다.</p>' +
    '</section>' +
    '<section class="wrap spaces" aria-label="공간별 사진">' +
      p.spaces.map(spaceBlock).join("") +
      '<p class="credit">' + A.credit + '</p>' +
    '</section>' +
    '<nav class="wrap pn" aria-label="다른 시공 사례">' +
      '<a class="pn-prev" href="' + prev.page + '"><span>이전 사례</span><b>' + prev.title + '</b></a>' +
      '<a class="pn-all link" href="projects.html">전체 시공 사례</a>' +
      '<a class="pn-next" href="' + next.page + '"><span>다음 사례</span><b>' + next.title + '</b></a>' +
    '</nav>' +
    '<section class="section band"><div class="wrap cta">' +
      '<h2 class="sec-title">상담 문의</h2>' +
      '<p>비슷한 인테리어를 계획 중이시라면 ' + p.size + ' 아파트의 ' + p.scope + '에 대해 궁금한 점을 남겨 주세요.</p>' +
      '<ol class="cta-steps"><li>상담 신청</li><li>현장 확인·실측</li><li>디자인 제안·견적</li></ol>' +
      '<a class="btn" href="contact.html">상담 문의하기</a>' +
    '</div></section>';

})();
