/* ATELIER ON — 공통 헤더·푸터, 프로젝트 데이터, 평면도 렌더링 */
(function () {
  "use strict";

  /* ---- 프로젝트 데이터 (기획서 v2.0 표 기준; 모두 가상 프로젝트) ---- */
  /* ---- 실제 업체 연락처: 값을 넣으면 플로팅 버튼이 바로 연결됩니다. 비워 두면 데모 안내만 나옵니다. ---- */
  var CONTACT = {
    kakao: "",   // 예: "https://pf.kakao.com/_xxxxx" (카카오톡 채널 채팅 주소)
    tel: ""      // 예: "010-0000-0000"
  };

  var PROJECTS = [
    {
      id: "p01", ctaImg: "6933855", page: "project-30.html", thumb: "6933853", cover: "6933852", size: "30평대", scope: "전체 리모델링", style: "모던 내추럴",
      title: "30평대 아파트 전체 리모델링",
      oneLine: "거실과 주방을 하나로 이은 밝은 집",
      intro: [
        "밝은 화이트 톤을 기본으로 따뜻한 우드 소재를 더해 편안한 분위기의 집을 구성했습니다.",
        "거실과 주방이 자연스럽게 이어지도록 공간을 정리했습니다."
      ],
      concern: "거실과 주방이 벽으로 나뉘어 있어 식사를 준비하면서 가족과 이야기하기 어려웠고, 오래된 바닥과 몰딩 때문에 집이 어둡게 느껴졌습니다.",
      decisions: [
        "거실과 주방 사이를 열어 아일랜드 주방으로 이어지게",
        "거실 한쪽 벽은 우드 슬랫으로 마감해 흰 벽이 많은 집에 따뜻한 면을 하나",
        "바닥은 밝은 오크 톤 마루로 집 전체를 통일",
        "천장 가장자리에 간접조명을 넣어 낮과 밤의 분위기를 비슷하게"
      ],
      materials: [
        ["현관", "타일", "화이트 도장", "신발장, 거울"],
        ["거실", "오크 톤 마루", "화이트 도장, 우드 슬랫", "천장 간접조명, 벽걸이 TV 수납장"],
        ["주방·식탁", "오크 톤 마루", "우드 벽판", "아일랜드 상판, 펜던트 조명"],
        ["욕실", "타일", "화이트 타일", "우드 상판 세면대, 조명 거울"]
      ],
      spaces: [
        { name: "현관", line: "신발장과 벽을 밝은 톤으로 맞추고 거울을 둔 현관", photos: [["7005284", "현관에서 바라본 복도와 거울", "", true]] },
        { name: "거실", line: "창 쪽에 소파를 두고, 맞은편 벽에 TV 수납장과 우드 슬랫을 둔 거실", photos: [["6933855", "창 쪽 소파와 TV 수납장", "35% 50%"], ["6933860", "우드 슬랫으로 마감한 벽", "40% 50%"]] },
        { name: "주방·식탁", line: "아일랜드 바로 옆에 식탁을 붙여 요리하는 사람과 앉은 사람이 마주 보는 자리", photos: [["6933853", "거실 쪽으로 열린 아일랜드"], ["6933854", "주방 옆 식탁과 펜던트 조명", "45% 50%"]] },
        { name: "욕실", line: "거실과 같은 우드 톤을 세면대 상판에 쓴 욕실", photos: [["6890406", "우드 상판 세면대와 둥근 조명 거울", "15% 60%", true]] }
      ]
    },
    {
      id: "p02", ctaImg: "6890414", page: "project-20.html", cover: "6890394", size: "20평대", scope: "전체 인테리어", style: "화이트 우드",
      title: "20평대 아파트 전체 인테리어",
      oneLine: "흰 벽과 밝은 우드 가구로 넓어 보이게 한 집",
      intro: [
        "흰 벽과 밝은 우드 가구로 공간이 넓어 보이도록 구성했습니다.",
        "창가와 벽면에 붙박이 수납을 더해 생활용품이 눈에 덜 띄게 정리했습니다."
      ],
      concern: "작은 평형이라 짐을 둘 곳이 부족했고, 가구를 하나씩 들일수록 집이 더 좁아 보였습니다.",
      decisions: [
        "창가와 벽면에 붙박이 선반·수납장을 짜 넣어 바닥에 놓는 가구를 줄임",
        "벽과 주방 상부장을 모두 흰색으로 맞춰 수납장이 벽처럼 보이게",
        "가구와 세면대 상판을 같은 밝은 우드로 통일",
        "욕실은 샤워 공간을 커튼으로만 나눠 좁은 면적을 그대로 사용"
      ],
      materials: [
        ["현관", "타일", "화이트 도배, 우드 포인트 벽", "벽면 수납"],
        ["거실", "밝은 우드 마루", "화이트 도배", "창가 붙박이 선반, 낮은 우드 수납장"],
        ["주방", "밝은 우드 마루", "화이트 타일", "흰 상하부장, 우드 선반"],
        ["침실", "밝은 우드 마루", "화이트 도배", "벽 선반, 침대 양옆 벽 조명"],
        ["욕실", "타일", "화이트 타일", "우드 상판 세면대, 조명 거울"]
      ],
      spaces: [
        { name: "현관", line: "좁은 현관에 벽면 수납과 우드 포인트를 둔 현관", photos: [["7045998", "현관문과 벽면 우드 포인트", "", true]] },
        { name: "거실", line: "창가에 붙박이 선반을 짜 넣어 바닥을 비운 거실", photos: [["6890403", "창가 붙박이 선반"], ["6890414", "창 아래 낮은 우드 수납장"]] },
        { name: "주방", line: "상부장까지 흰색으로 맞춰 벽처럼 보이게 한 주방", photos: [["6890396", "흰 상하부장과 타일 벽", "45% 50%"]] },
        { name: "침실", line: "벽 선반과 침대 양옆 조명으로 협탁 없이 정리한 침실", photos: [["6890412", "벽 선반과 침대 양옆 조명"], ["6890398", "흰 침구와 우드 가구"]] },
        { name: "욕실", line: "세면대 상판을 우드로 골라 다른 공간과 재료를 맞춘 욕실", photos: [["6890407", "샤워 공간과 우드 상판 세면대", "40% 50%"], ["6890401", "조명 거울과 세면대", "35% 50%"], ["6890402", "벽걸이 수납과 조명 거울"]] }
      ]
    },
    {
      id: "p03", ctaImg: "7005291", page: "project-40.html", cover: "7005297", size: "40평대", scope: "전체 리모델링", style: "웜 모던",
      title: "40평대 아파트 전체 리모델링",
      oneLine: "수납을 넉넉히 둔 베이지 톤의 넓은 집",
      intro: [
        "베이지와 그레이 톤을 사용해 차분하고 따뜻한 분위기를 만들었습니다.",
        "현관과 드레스룸에 붙박이 수납을 넉넉히 두어 넓은 집을 정돈해 쓸 수 있게 했습니다."
      ],
      concern: "아이 둘을 키우는 집이라 현관과 방마다 짐이 넘쳤고, 넓은 평형인데도 정리가 안 돼 보였습니다.",
      decisions: [
        "현관에 낮은 수납장과 천장까지 닿는 붙박이장을 함께 두어 신발과 겉옷을 나눠 수납",
        "안방 옆 드레스룸은 선반과 서랍으로 칸을 나눠 계절 옷을 바꿔 넣기 쉽게",
        "주방은 그레이 유리 상부장과 베이지 하부장으로 위는 가볍게, 아래는 단단하게",
        "벽과 문틀을 베이지·그레이 톤으로 맞춰 넓은 집을 차분하게"
      ],
      materials: [
        ["현관", "우드 톤 마루", "베이지 도장", "낮은 수납장, 천장 높이 붙박이장, 둥근 거울"],
        ["주방", "우드 톤 마루", "베이지 도장", "그레이 유리 상부장, 베이지 하부장"],
        ["드레스룸", "우드 톤 마루", "—", "선반·서랍 붙박이 수납"],
        ["욕실", "대리석 무늬 타일", "대리석 무늬 타일", "세면대 하부장, 유리 선반"]
      ],
      spaces: [
        { name: "현관", line: "낮은 수납장과 천장까지 닿는 붙박이장을 함께 둔 현관", photos: [["7005286", "낮은 수납장과 둥근 거울", "35% 50%"], ["7005294", "천장까지 올린 붙박이장과 전신 거울"]] },
        { name: "주방", line: "그레이 유리 상부장과 베이지 하부장의 주방", photos: [["7005291", "그레이 유리 상부장과 베이지 하부장"]] },
        { name: "드레스룸", line: "선반과 서랍으로 칸을 나눈 드레스룸", photos: [["7005285", "선반과 서랍으로 나눈 수납"]] },
        { name: "욕실", line: "베이지·그레이 톤에 맞춰 대리석 무늬 타일로 마감한 욕실", photos: [["7046006", "대리석 무늬 타일과 세면대 하부장", "", true]] }
      ]
    },
    {
      id: "p04", ctaImg: "7046005", page: "project-partial.html", crumb: "30평대 부분 인테리어", kind: "part", thumb: "7046000", cover: "7045995", size: "30평대", scope: "주방·욕실 부분 인테리어", style: "화이트 클래식",
      title: "30평대 아파트 부분 인테리어",
      oneLine: "거실과 방은 그대로 두고 주방과 욕실만 바꾼 집",
      intro: [
        "공사 범위를 주방과 욕실 두 곳으로 좁혀, 나머지 공간은 그대로 쓰면서 진행했습니다.",
        "주방은 흰 도어와 우드 상판으로 ㄱ자 상하부장을 새로 짜고, 빌트인 오븐과 키 큰 수납장을 한 줄에 넣었습니다."
      ],
      concern: "거실과 방은 아직 쓸 만했지만 주방 수납이 부족하고 욕실 타일과 방수가 오래돼, 이 두 곳만 바꾸기로 했습니다.",
      decisions: [
        "공사 범위를 주방과 욕실로 좁혀 나머지 공간은 그대로 사용",
        "주방은 ㄱ자 상하부장에 빌트인 오븐과 키 큰 수납장을 한 줄로",
        "주방 벽은 흰 벽돌 모양 타일, 상판은 우드로",
        "욕실은 방수를 새로 하고 바닥과 벽을 대리석 무늬 타일로 교체",
        "샤워부스 안쪽 벽만 우드 패턴 타일로 마감"
      ],
      materials: [
        ["주방", "기존 바닥 유지", "흰 벽돌 모양 타일", "흰 도어 상하부장, 우드 상판, 빌트인 오븐"],
        ["욕실", "대리석 무늬 타일", "대리석 무늬 타일, 우드 패턴 타일", "샤워부스, 세면대 하부장, 유리 선반"]
      ],
      spaces: [
        { name: "주방", line: "키 큰 수납장과 ㄱ자 상하부장을 새로 짠 주방", photos: [["7045992", "키 큰 수납장과 ㄱ자 상하부장"]] },
        { name: "욕실", line: "방수를 새로 하고 샤워부스 안쪽에만 우드 패턴 타일을 쓴 욕실", photos: [["7046000", "샤워부스와 우드 패턴 타일 벽"], ["7046005", "넓은 세면대와 샤워부스 문"]] }
      ]
    }
  ];
  window.ATELIER = { projects: PROJECTS };

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  var planSeq = 0;

  /* ---- 건축 도면식 평면도 (30평대 예시) ----
     벽 두께, 문 열림 호, 창, 발코니, 열린 공간(점선)을 그립니다. 공간 고르기·업체 소개·첫 화면이 같이 씁니다. */
  var ARCH = {
    rooms: [
      { id: "bed1", label: "안방", r: [10, 10, 100, 110] },
      { id: "bed2", label: "침실", r: [10, 120, 100, 90] },
      { id: "living", label: "거실", r: [110, 10, 130, 120] },
      { id: "kitchen", label: "주방·식탁", r: [110, 130, 130, 80] },
      { id: "bath", label: "욕실", r: [240, 10, 70, 60] },
      { id: "bed3", label: "침실", r: [240, 70, 70, 80] },
      { id: "entry", label: "현관", r: [240, 150, 70, 60] }
    ],
    walls: [[110, 10, 110, 210], [10, 120, 110, 120], [240, 10, 240, 210], [240, 70, 310, 70], [240, 150, 310, 150]],
    open: [[110, 130, 240, 130]],
    windows: [["h", 10, 25, 95], ["h", 10, 125, 225], ["v", 10, 140, 190], ["v", 310, 85, 135], ["h", 210, 120, 170]],
    doors: [["v", 110, 100, 114, -1], ["v", 110, 126, 140, -1], ["v", 240, 44, 58, 1], ["v", 240, 80, 94, 1], ["v", 310, 172, 190, -1]],
    gaps: [["v", 240, 160, 200]],
    balcony: [10, -14, 230, 22]
  };
  function archPlan(opt) {
    opt = opt || {};
    var id = "ap" + (++planSeq), fill = opt.fill || [], hid = opt.hatchId || id + "-h";
    var out = [];
    out.push('<defs><pattern id="' + hid + '" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="7" height="7" fill="#D3BE9C"/><path d="M0 0v7" stroke="#8C7050" stroke-width="1.6"/></pattern></defs>');
    var b = ARCH.balcony;
    out.push('<g class="ap-balcony"><rect x="' + b[0] + '" y="' + b[1] + '" width="' + b[2] + '" height="' + (b[3] - 4) + '"/>' +
      '<text x="' + (b[0] + b[2] / 2) + '" y="' + (b[1] + 9) + '">발코니</text></g>');
    out.push(ARCH.rooms.map(function (rm) {
      var r = rm.r, on = fill.indexOf(rm.id) > -1;
      var attrs = opt.roomAttrs ? opt.roomAttrs(rm) : "";
      return '<g class="room' + (on ? " on" : "") + '"' + attrs + '><rect class="ap-fill" x="' + r[0] + '" y="' + r[1] + '" width="' + r[2] + '" height="' + r[3] + '"' +
        (on ? ' style="fill:url(#' + hid + ')"' : "") + '/><text x="' + (r[0] + r[2] / 2) + '" y="' + (r[1] + r[3] / 2 + 3) + '">' + esc(rm.label) + "</text></g>";
    }).join(""));
    var L = function (x1, y1, x2, y2, cls) { return '<line class="' + cls + '" x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" pathLength="1"/>'; };
    out.push('<g class="ap-open">' + ARCH.open.map(function (w) { return L(w[0], w[1], w[2], w[3], ""); }).join("") + "</g>");
    out.push('<g class="ap-walls">' + ARCH.walls.map(function (w) { return L(w[0], w[1], w[2], w[3], "in"); }).join("") +
      '<rect class="out" x="10" y="10" width="300" height="200" pathLength="1"/></g>');
    // 벽을 끊는 자리 (창·문·통로)
    var cut = function (o, at, a, z, t) {
      return o === "h" ? '<rect class="ap-cut" x="' + a + '" y="' + (at - t) + '" width="' + (z - a) + '" height="' + (2 * t) + '"/>'
                       : '<rect class="ap-cut" x="' + (at - t) + '" y="' + a + '" width="' + (2 * t) + '" height="' + (z - a) + '"/>';
    };
    var g = [];
    ARCH.windows.forEach(function (w) {
      g.push(cut(w[0], w[1], w[2], w[3], 3.6));
      [-2.2, 0, 2.2].forEach(function (d) {
        g.push(w[0] === "h" ? L(w[2], w[1] + d, w[3], w[1] + d, "win") : L(w[1] + d, w[2], w[1] + d, w[3], "win"));
      });
    });
    ARCH.gaps.forEach(function (w) { g.push(cut(w[0], w[1], w[2], w[3], 2.4)); });
    ARCH.doors.forEach(function (d) {
      var X = d[1], a = d[2], z = d[3], s = d[4], wd = z - a, t = d[1] === 10 || d[1] === 310 ? 3.6 : 2.4;
      g.push(cut(d[0], X, a, z, t));
      g.push(L(X, a, X + s * wd, a, "leaf"));
      g.push('<path class="swing" pathLength="1" d="M' + (X + s * wd) + " " + a + " A" + wd + " " + wd + " 0 0 " + (s > 0 ? 1 : 0) + " " + X + " " + z + '"/>');
    });
    out.push('<g class="ap-marks">' + g.join("") + "</g>");
    var a11y = opt.interactive ? ' role="group"' : ' role="img"';
    return '<svg class="plan arch' + (opt.draw ? " draw" : "") + '" viewBox="0 -20 320 240"' + a11y + ' aria-label="' + esc(opt.label || "30평대 평면 예시") + '">' + out.join("") + "</svg>";
  }
  window.ATELIER.archPlan = archPlan;


  var CREDIT = "사진: Pexels, Max Vakhtbovych";
  function photo(id, alt, opt) {
    opt = opt || {};
    return '<div class="ph"' + (opt.pos ? ' style="--pos:' + opt.pos + '"' : "") + '><img src="images/' + id + '.jpg" alt="' + esc(alt) + '"' +
      (opt.eager ? ' fetchpriority="high"' : ' loading="lazy"') + ' decoding="async"></div>';
  }
  window.ATELIER.photo = photo;
  /* 페이지 끝 상담 영역 (모든 페이지 공통): 사진 + 큰 제목 */
  function finalCta(img, alt, text) {
    return '<section class="cta-final" aria-labelledby="final-title">' +
      '<div class="cta-final-photo">' + photo(img || "6890403", alt || "창가에 붙박이 선반을 짜 넣은 밝은 거실") + "</div>" +
      '<div class="wrap cta-final-inner"><div class="cta-card">' +
        '<p class="cta-label"><span>상담 안내</span></p>' +
        '<h2 class="cta-final-title" id="final-title">우리 집 이야기,<br>평면도부터 같이 봐요.</h2>' +
        '<p class="cta-text">' + esc(text || "원하시는 공간과 공사 계획을 알려주시면 상담을 통해 필요한 내용을 안내해 드립니다.") + "</p>" +
        '<div class="cta-actions"><a class="cta-go" href="contact.html">상담 신청하기<svg viewBox="0 0 32 12" aria-hidden="true"><path d="M0 6h30M25 1l5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.2"/></svg></a>' +
        '<span class="cta-aside">평면도가 없어도 괜찮습니다</span></div>' +
      "</div></div></section>";
  }
  window.ATELIER.finalCta = finalCta;
  window.ATELIER.esc = esc;
  window.ATELIER.credit = CREDIT;

  function card(p, level) {
    var h = "h" + (level || 3);
    return '<a class="card" href="' + p.page + '" data-kind="' + (p.kind || "full") + '">' +
      photo(p.thumb || p.cover, "") +
      '<div class="card-body"><' + h + ' class="card-title">' + esc(p.title) + "</" + h + ">" +
      '<p class="card-desc">' + esc(p.oneLine) + "</p>" +
      '<dl class="card-meta"><dt>평형</dt><dd>' + p.size + "</dd><dt>공사 범위</dt><dd>" + p.scope + "</dd><dt>스타일</dt><dd>" + p.style + "</dd></dl>" +
      "</div></a>";
  }

  /* ---- 공통 헤더·푸터 ---- */
  var NAV = [["index.html", "홈", "home"], ["projects.html", "시공 사례", "projects"], ["about.html", "업체 소개", "about"], ["contact.html", "상담 문의", "contact"]];
  var LOGO = '<svg viewBox="0 0 28 28" aria-hidden="true"><path d="M3 25V3h22" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M3 25h9" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M12 25a13 13 0 0 1 13-13" fill="none" stroke="currentColor" stroke-width="1.2"/><path d="M25 12v13" stroke="currentColor" stroke-width="1.2"/></svg>';
  function navLinks(page) {
    return NAV.map(function (n) { return '<a href="' + n[0] + '"' + (n[2] === page ? ' aria-current="page"' : "") + ">" + n[1] + "</a>"; }).join("");
  }

  var marker = document.body.hasAttribute("data-page") ? document.body : document.querySelector("[data-page]");
  var page = marker ? marker.getAttribute("data-page") : "";
  if (!document.documentElement.lang) document.documentElement.lang = "ko";
  var header = document.createElement("header");
  header.className = "site-header";
  header.innerHTML = '<div class="wrap header-inner"><a class="logo" href="index.html" aria-label="아틀리에 온 홈">' + LOGO +
    '<span class="logo-word">ATELIER ON</span><span class="logo-ko">아틀리에 온</span></a>' +
    '<nav class="nav" aria-label="주 메뉴">' + navLinks(page) + "</nav>" +
    '<div class="header-end">' + (page === "contact" ? "" : '<a class="head-cta" href="contact.html">상담 신청</a>') +
    '<button class="menu-btn" type="button" aria-expanded="false" aria-controls="mobile-menu" aria-label="메뉴 열기">' +
    '<svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true"><path class="m1" d="M2 6h18M2 16h18" stroke="currentColor" stroke-width="1.6"/></svg></button></div></div>' +
    '<nav id="mobile-menu" class="mobile-menu" aria-label="모바일 메뉴">' + navLinks(page) + "</nav>";
  document.body.prepend(header);
  if (marker && marker.hasAttribute("data-hero")) {
    header.classList.add("over");
    var mm = header.querySelector(".mobile-menu");
    var onScroll = function () { header.classList.toggle("solid", window.scrollY > 24 || mm.classList.contains("open")); };
    window.addEventListener("scroll", onScroll, { passive: true });
    header.querySelector(".menu-btn").addEventListener("click", function () { setTimeout(onScroll, 0); });
    onScroll();
  }
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
    '<nav aria-label="하단 메뉴">' + navLinks("") + '<a href="contact.html#faq">자주 묻는 질문</a></nav>' +
    '<div class="foot-note"><p>이 사이트는 홈페이지 제작 포트폴리오용 데모입니다. 소개된 시공 사례는 모두 가상 프로젝트이며, 사업자 정보는 표시하지 않습니다. 사진은 Pexels(Max Vakhtbovych)의 무료 이미지입니다.</p><p>© ATELIER ON 데모</p></div></div>';
  document.body.append(footer);

  function project(id) { return PROJECTS.filter(function (p) { return p.id === id; })[0]; }
  /* ---- 프로젝트 목록 ---- */
  document.querySelectorAll("[data-cards]").forEach(function (el) {
    var level = +el.getAttribute("data-cards") || 3, ids = el.getAttribute("data-ids");
    var list = ids ? ids.split(",").map(project) : PROJECTS;
    el.innerHTML = list.map(function (p) { return card(p, level); }).join("");
  });

  /* ---- 서비스 범위 평면도 ---- */
  var base = PROJECTS[0];
  document.querySelectorAll("[data-scope]").forEach(function (el) {
    var full = el.getAttribute("data-scope") === "full";
    el.innerHTML = archPlan({
      fill: full ? ARCH.rooms.map(function (r) { return r.id; }) : ["kitchen", "bath"],
      label: full ? "모든 공간이 공사 범위인 평면 예시" : "주방과 욕실만 공사 범위인 평면 예시"
    });
  });

  /* ---- 첫 화면: 사진을 찍은 위치를 표시한 도면 ---- */
  /* 첫 화면: 도면의 공간에 마우스를 올리면 그 공간 사진과 촬영 위치로 바뀝니다 (같은 집 사진이 있는 공간만) */
  var HERO_VIEWS = {
    all:     { img: "6933852", name: "거실과 주방", alt: "거실과 주방 전경", pos: "58% 50%" },
    living:  { img: "6933855", name: "거실", alt: "창 쪽에 소파를 둔 거실" },
    kitchen: { img: "6933853", name: "주방·식탁", alt: "거실 쪽으로 열린 아일랜드 주방과 식탁" },
    bed1:    { img: "6890398", name: "안방", from: "20평대 사례", alt: "흰 침구와 우드 가구의 침실" },
    bed2:    { img: "6890412", name: "침실", from: "20평대 사례", alt: "벽 선반과 침대 양옆 조명" },
    bed3:    { img: "7005285", name: "침실 수납", from: "40평대 사례", alt: "선반과 서랍으로 나눈 붙박이 수납" },
    bath:    { img: "7046000", name: "욕실", from: "부분 인테리어 사례", alt: "샤워부스와 우드 패턴 타일 벽" },
    entry:   { img: "7005286", name: "현관", from: "40평대 사례", alt: "낮은 수납장과 둥근 거울을 둔 현관", pos: "35% 50%" }
  };
  document.querySelectorAll("[data-hero-plan]").forEach(function (el) {
    el.innerHTML = archPlan({ draw: true, interactive: true, fill: [],
      label: "30평대 평면 예시. 공간에 마우스를 올리면 그 공간 사진으로 바뀝니다",
      roomAttrs: function (rm) {
        return HERO_VIEWS[rm.id] ? ' tabindex="0" role="button" data-view="' + rm.id + '" aria-label="' + esc(rm.label) + ' 사진 보기"' : "";
      } });
    var box = document.querySelector(".home-hero-photo");
    if (!box) return;
    box.innerHTML = Object.keys(HERO_VIEWS).map(function (k) {
      var h = HERO_VIEWS[k];
      return '<div class="hero-shot' + (k === "all" ? " on" : "") + '" data-shot="' + k + '">' + photo(h.img, h.alt, { pos: h.pos, eager: k === "all" }) + "</div>";
    }).join("") + '<div class="hero-slats" aria-hidden="true">' + "<i></i><i></i><i></i><i></i><i></i><i></i>" + "</div>" +
      '<p class="hero-shot-name" aria-live="polite">' + HERO_VIEWS.all.name + "</p>";
    var label = box.querySelector(".hero-shot-name");
    var current = "all";
    function show(k) {
      if (k === current) return;
      current = k;
      var h = HERO_VIEWS[k];
      box.querySelectorAll(".hero-shot").forEach(function (s) { s.classList.toggle("on", s.dataset.shot === k); });
      el.querySelectorAll("[data-view]").forEach(function (g) { g.classList.toggle("cur", g.dataset.view === k); });
      label.innerHTML = esc(h.name) + (h.from ? '<span>' + esc(h.from) + " 사진</span>" : "");
    }
    el.querySelectorAll("[data-view]").forEach(function (g) {
      var k = g.dataset.view;
      g.addEventListener("mouseenter", function () { show(k); });
      g.addEventListener("focus", function () { show(k); });
      g.addEventListener("click", function () { show(k); });
      g.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); show(k); } });
    });
    /* 자동 넘김: 공간을 차례로 보여 줌. 마우스·키보드가 도면이나 사진 위에 있으면 잠시 멈춤 */
    var ORDER = ["living", "kitchen", "bed1", "bath", "entry", "bed2", "bed3", "all"];
    var STEP = 3200, timer = null, hold = false, visible = true;
    var playing = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var cap = el.parentNode.querySelector("figcaption");
    cap.insertAdjacentHTML("beforeend", '<span class="hero-progress" aria-hidden="true"><i></i></span>' +
      '<button type="button" class="hero-auto"></button>');
    var btn = cap.querySelector(".hero-auto"), bar = cap.querySelector(".hero-progress i");
    function shown() { return el.offsetParent !== null; }
    function restartBar() { bar.classList.remove("run"); void bar.offsetWidth; if (timer) bar.classList.add("run"); }
    function stop() { clearTimeout(timer); timer = null; bar.classList.remove("run"); }
    function schedule(delay) {
      stop();
      if (!playing || hold || !visible || document.hidden || !shown()) return;
      timer = setTimeout(function () {
        var n = ORDER[(ORDER.indexOf(current) + 1) % ORDER.length];
        show(n); schedule(STEP);
      }, delay);
      bar.style.animationDuration = delay + "ms";
      restartBar();
    }
    function setBtn() {
      btn.textContent = playing ? "자동 넘김 멈춤" : "자동 넘김 재생";
      btn.setAttribute("aria-pressed", playing ? "false" : "true");
    }
    btn.addEventListener("click", function () { playing = !playing; setBtn(); if (playing) schedule(1200); else stop(); });
    setBtn();
    [el.querySelector("svg"), box].forEach(function (n) {
      n.addEventListener("mouseenter", function () { hold = true; stop(); });
      n.addEventListener("mouseleave", function () { hold = false; if (!playing) show("all"); schedule(1800); });
    });
    el.addEventListener("focusin", function () { hold = true; stop(); });
    el.addEventListener("focusout", function (e) {
      if (el.contains(e.relatedTarget)) return;
      hold = false; if (!playing) show("all"); schedule(1800);
    });
    document.addEventListener("visibilitychange", function () { schedule(STEP); });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (en) { visible = en[0].isIntersecting; schedule(STEP); }, { threshold: 0.3 }).observe(box);
    }
    schedule(3600);   // 첫 화면 효과가 끝난 뒤 시작
  });

  document.querySelectorAll("[data-final]").forEach(function (el) {
    el.outerHTML = finalCta(el.getAttribute("data-final"), el.getAttribute("data-alt"), el.getAttribute("data-text"));
  });
  /* 상담 영역 사진: 화면에 들어오면 천천히 제자리로 (한 번만) */
  window.ATELIER.ctaReveal = function () {
    var els = document.querySelectorAll(".cta-final:not(.seen)");
    if (!("IntersectionObserver" in window)) { els.forEach(function (e) { e.classList.add("seen"); }); return; }
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("seen"); io.unobserve(e.target); } });
    }, { threshold: 0.25 });
    els.forEach(function (e) { io.observe(e); });
  };
  window.ATELIER.ctaReveal();

  /* ---- 시공 사례 목록: 공사 방식으로 거르기 ---- */
  document.querySelectorAll("[data-filter]").forEach(function (bar) {
    var list = document.querySelector(bar.getAttribute("data-filter"));
    if (!list) return;
    var cards = list.querySelectorAll(".card");
    var count = function (k) { return [].filter.call(cards, function (c) { return k === "all" || c.dataset.kind === k; }).length; };
    bar.querySelectorAll("button").forEach(function (b) {
      b.insertAdjacentHTML("beforeend", "<small>" + count(b.dataset.kind) + "</small>");
      b.addEventListener("click", function () {
        bar.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", x === b); });
        cards.forEach(function (c) { c.hidden = !(b.dataset.kind === "all" || c.dataset.kind === b.dataset.kind); });
      });
    });
  });

  /* ---- 약속 섹션: 도면 → 현장 (화면에 들어오면 도면이 그려짐) ---- */
  document.querySelectorAll("[data-proof-plan]").forEach(function (el) {
    el.innerHTML = archPlan({ fill: ["kitchen"], label: "30평대 평면 예시. 주방·식탁 자리에 A 표시" });
    var svg = el.querySelector("svg");
    svg.insertAdjacentHTML("beforeend",
      '<g class="ap-callout"><circle cx="225" cy="145" r="8.5"/><text x="225" y="148.5">A</text></g>' +
      '<g class="ap-dim"><line x1="10" y1="226" x2="310" y2="226"/><line x1="10" y1="222" x2="10" y2="230"/><line x1="110" y1="222" x2="110" y2="230"/><line x1="240" y1="222" x2="240" y2="230"/><line x1="310" y1="222" x2="310" y2="230"/></g>');
    svg.setAttribute("viewBox", "0 -20 320 254");
    var go = function () { svg.classList.add("draw"); el.closest(".proof").classList.add("seen"); };
    if (!("IntersectionObserver" in window)) return go();
    var io = new IntersectionObserver(function (en) { if (en[0].isIntersecting) { go(); io.disconnect(); } }, { threshold: 0.35 });
    io.observe(el);
  });

  /* ---- 정적 마크업의 사진 ---- */
  document.querySelectorAll("[data-img]").forEach(function (el) {
    el.outerHTML = photo(el.getAttribute("data-img"), el.getAttribute("data-alt"), { pos: el.getAttribute("data-pos"), eager: el.hasAttribute("data-eager") });
  });

  /* ---- 자주 묻는 질문 (메인·상담 문의가 같은 데이터를 씀) ---- */
  var FAQ = [
    ["인테리어 비용은 얼마나 드나요?", "평형, 공사 범위, 마감재에 따라 달라집니다. 상담 때 원하는 범위를 듣고, 현장 확인과 평면도를 바탕으로 항목별 견적을 드립니다."],
    ["공사 기간은 얼마나 걸리나요?", "주방·욕실 같은 부분 인테리어는 보통 2~4주, 집 전체 리모델링은 6~8주 정도입니다. 공사 범위와 관리사무실의 공사 가능 시간에 따라 일정을 정합니다."],
    ["견적은 무엇을 기준으로 내나요?", "관리사무실에서 받을 수 있는 세대 평면도(건축도면)와 현장 실측을 기준으로 냅니다. 사진만으로는 벽과 배관 위치를 알 수 없어 정확한 견적을 드리기 어렵습니다."],
    ["입주 전에 공사를 끝낼 수 있나요?", "입주 날짜와 관리사무실의 공사 가능 기간을 먼저 확인하고, 그 안에 끝나도록 일정을 잡습니다."],
    ["살면서 공사할 수 있나요?", "부분 인테리어는 공간을 나눠 진행할 수 있습니다. 전체 리모델링은 짐을 옮기고 집을 비운 상태에서 하는 것이 안전합니다."],
    ["상담은 어떻게 시작하나요?", "상담 문의 페이지에 공사 지역, 평형, 원하는 공사 범위를 남겨 주세요. 연락드려 통화로 내용을 확인한 뒤 현장 확인 날짜를 정합니다."]
  ];
  document.querySelectorAll("[data-faq]").forEach(function (el) {
    var n = +el.getAttribute("data-faq") || FAQ.length;
    el.innerHTML = FAQ.slice(0, n).map(function (q) {
      return '<details class="qa"><summary>' + esc(q[0]) + "</summary><p>" + esc(q[1]) + "</p></details>";
    }).join("");
  });

  /* ---- 평면도로 공간 고르기 (메인) ---- */
  var SPACES = {
    living:  { name: "거실", prep: ["관리사무실에서 받은 세대 평면도", "지금 거실 사진 (창 쪽, TV 벽 쪽)", "원하는 분위기의 사진 2~3장"], rooms: ["living"], photos: [["6933855", "30평대 거실"], ["6890403", "20평대 거실"]], projects: ["p01", "p02", "p03"],
               works: ["바닥재", "벽 마감", "간접조명", "TV 벽", "발코니 확장"],
               desc: "가족이 가장 오래 머무는 곳이라 바닥과 조명을 바꾸는 것만으로도 집의 인상이 크게 달라집니다." },
    kitchen: { name: "주방·식탁", prep: ["관리사무실에서 받은 세대 평면도", "지금 주방 사진 (상하부장, 싱크대 쪽)", "새로 넣고 싶은 가전 목록 (식기세척기, 오븐 등)"], rooms: ["kitchen"], photos: [["7005291", "40평대 주방"], ["6890396", "20평대 주방"]], projects: ["p04", "p01", "p02", "p03"],
               works: ["상하부장", "상판", "싱크·후드", "아일랜드", "식탁 조명", "동선"],
               desc: "자주 쓰는 물건의 위치와 요리하는 순서에 맞춰 수납과 동선을 다시 짜고, 식탁 위 조명과 옆 수납까지 함께 정합니다." },
    bed:     { name: "안방·침실", prep: ["관리사무실에서 받은 세대 평면도", "지금 방 사진", "넣어야 할 짐의 양 (옷, 이불, 책 등)"], rooms: ["bed1", "bed2", "bed3"], photos: [["6890398", "20평대 침실"], ["6890412", "20평대 침실 벽면"]], projects: ["p02"],
               works: ["붙박이장", "조명", "도배", "바닥"],
               desc: "붙박이장으로 수납을 벽 안에 넣으면 방이 넓어 보이고 정리가 쉬워집니다." },
    bath:    { name: "욕실", prep: ["관리사무실에서 받은 세대 평면도", "지금 욕실 사진 (바닥·벽 타일이 보이게)", "욕조와 샤워부스 중 원하는 방식"], rooms: ["bath"], photos: [["7046000", "주방·욕실 부분 인테리어 사례의 욕실"], ["6890407", "20평대 욕실 샤워 공간"]], projects: ["p04", "p02"],
               works: ["타일", "방수", "세면대·수납장", "욕조 또는 샤워부스"],
               desc: "타일을 바꿀 때 방수를 새로 하는지 꼭 확인해야 합니다. 욕조와 샤워부스 중 무엇을 쓸지도 함께 정합니다." },
    entry:   { name: "현관", prep: ["관리사무실에서 받은 세대 평면도", "지금 현관 사진", "신발·겉옷을 얼마나 수납해야 하는지"], rooms: ["entry"], photos: [["7005286", "40평대 현관"], ["7005294", "40평대 현관 붙박이장"]], projects: ["p03"],
               works: ["중문", "신발장", "바닥 타일"],
               desc: "중문을 달면 소음과 찬바람이 줄고, 신발장을 천장까지 올리면 수납이 크게 늘어납니다." }
  };
  var FULL = { name: "전체 리모델링", photos: [["6933855", "30평대 거실"], ["6890394", "20평대 거실"]], projects: ["p01", "p02", "p03"],
               works: ["바닥", "벽", "주방", "욕실", "조명", "수납", "창호", "배관"],
               period: "6~8주",
               phases: [["철거·설비", 2], ["목공·전기·타일", 3], ["도배·바닥·가구", 2]],
               prep: ["관리사무실에서 받은 세대 평면도", "입주 날짜 또는 이사 일정", "공사 중 머물 곳 (전체 공사는 집을 비우고 진행)"],
               desc: "집 전체를 하나의 계획으로 진행합니다. 지은 지 오래된 아파트처럼 배관·창호·욕실까지 손봐야 할 때 알맞습니다." };
  var ROOM_SPACE = {};
  Object.keys(SPACES).forEach(function (k) { SPACES[k].rooms.forEach(function (r) { ROOM_SPACE[r] = k; }); });

  document.querySelectorAll("[data-picker]").forEach(function (root) {
    var state = { mode: "part", sel: ["kitchen"], cur: "kitchen" };
    root.innerHTML =
      '<div class="picker-modes" role="radiogroup" aria-label="공사 방식">' +
        '<button type="button" role="radio" data-mode="part">부분 인테리어</button>' +
        '<button type="button" role="radio" data-mode="full">전체 리모델링</button>' +
      "</div>" +
      '<div class="picker-body">' +
        '<div class="picker-plan">' +
          '<div class="picker-cards" role="group" aria-label="공간 목록">' +
            Object.keys(SPACES).map(function (k) {
              return '<button type="button" class="space-card" data-space="' + k + '" aria-pressed="false">' + photo(SPACES[k].photos[0][0], "") + "<span>" + SPACES[k].name + "</span></button>";
            }).join("") +
          "</div>" +
          '<p class="picker-sel sr-only" aria-live="polite"></p>' +
        "</div>" +
        '<div class="picker-info"></div>' +
      "</div>";

    var info = root.querySelector(".picker-info"), selLine = root.querySelector(".picker-sel");
    var planBox = root.querySelector(".picker-plan");
    function names(list) { return list.map(function (k) { return SPACES[k].name; }); }
    function render() {
      var full = state.mode === "full";
      planBox.hidden = full;
      root.classList.toggle("is-full", full);
      root.querySelectorAll(".picker-modes button").forEach(function (b) { b.setAttribute("aria-checked", b.dataset.mode === state.mode); });
      root.querySelectorAll(".space-card").forEach(function (b) {
        b.setAttribute("aria-pressed", state.sel.indexOf(b.dataset.space) > -1);
      });
      selLine.textContent = full ? "집 전체가 공사 범위입니다." :
        "선택한 공간: " + names(state.sel).join(", ");
      var d = full ? FULL : SPACES[state.cur];
      var links = d.projects.map(function (id) {
        var p = project(id);
        return '<a class="case-mini" href="' + p.page + '">' + photo(p.thumb || p.cover, "") + "<span>" + (p.id === "p04" ? "30평대 주방·욕실" : p.size + " " + p.scope) + "</span></a>";
      }).join("");
      var total = full ? d.phases.reduce(function (a, x) { return a + x[1]; }, 0) : 0;
      info.innerHTML =
        '<div class="picker-photo">' + (full ? photo(d.photos[0][0], d.photos[0][1]) : photo(d.photos[1][0], d.photos[1][1])) + "</div>" +
        '<div class="picker-text">' +
          '<h3 class="picker-name">' + d.name + "</h3>" +
          '<p class="picker-desc">' + d.desc + "</p>" +
          (full ?
            '<div class="period"><p class="period-head"><span>공사 기간 예시</span><b>' + d.period + "</b></p>" +
              '<ol class="period-bar">' + d.phases.map(function (x) { return '<li style="flex:' + x[1] + '"><i aria-hidden="true"></i>' + x[0] + "<small>약 " + x[1] + "주</small></li>"; }).join("") + "</ol>" +
              '<p class="period-note">평형과 현장 상태에 따라 달라집니다. 전체 ' + total + "주 안팎 예시입니다.</p></div>"
            : '<p class="picker-meta"><span>많이 하는 공사</span>' + d.works.join(", ") + "</p>") +
          '<div class="prep"><h4 class="prep-title">상담 전에 준비하면 좋은 것</h4><ul class="prep-list">' +
            d.prep.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + '</ul>' +
            '<p class="prep-note">준비가 어려우시면 그대로 문의하셔도 됩니다. 통화하면서 함께 정리해 드립니다.</p></div>' +
          '<div class="cases"><p class="cases-title">' + (full ? "전체 리모델링 사례" : "관련 사례") + '</p><div class="cases-list">' + links + "</div></div>" +
        "</div>";
    }
    function remember() {
      try { sessionStorage.setItem("atelier-scope", JSON.stringify({ mode: state.mode, spaces: names(state.sel) })); } catch (e) { /* 저장소를 못 쓰면 넘어갑니다 */ }
    }
    function pick(space) {
      state.sel = [space];
      state.cur = space;
      render(); remember();
    }
    root.querySelectorAll(".space-card").forEach(function (b) { b.addEventListener("click", function () { pick(b.dataset.space); }); });
    root.querySelectorAll(".picker-modes button").forEach(function (b) {
      b.addEventListener("click", function () {
        state.mode = b.dataset.mode;
        if (!state.sel.length) state.sel = ["kitchen"];
        if (state.sel.indexOf(state.cur) < 0) state.cur = state.sel[0];
        render(); remember();
      });
    });
    render();
  });

  /* ---- 섹션 제목: 화면에 들어오면 선이 그려지고 글자가 올라옴 (한 번만) ---- */
  (function () {
    var calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (calm || !("IntersectionObserver" in window)) return;
    var titles = document.querySelectorAll(".sec-title, .t-h2");
    if (!titles.length) return;
    document.documentElement.classList.add("title-motion");
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.4 });
    titles.forEach(function (t) {
      if (t.closest(".hero, .home-hero")) return;
      t.innerHTML = '<span class="tt"><span>' + t.innerHTML + "</span></span>";
      io.observe(t);
    });
  })();

  /* ---- 메뉴로 페이지를 옮기면 항상 맨 위부터 (같은 페이지면 맨 위로 이동) ----
     미리보기처럼 페이지가 다른 화면 안(프레임)에 들어가 있으면 바깥 화면이 스크롤되므로,
     창 스크롤과 함께 맨 위 요소를 화면에 맞추는 방식(scrollIntoView)도 같이 씁니다. */
  function toTop(smooth) {
    var how = smooth && !window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "smooth" : "instant";
    try { window.scrollTo({ top: 0, left: 0, behavior: how }); } catch (e) { window.scrollTo(0, 0); }
    document.documentElement.scrollTop = 0; document.body.scrollTop = 0;
    var first = document.documentElement;
    try { first.scrollIntoView({ block: "start", behavior: how }); } catch (e) { /* 지원하지 않으면 창 스크롤만 */ }
  }
  try { if ("scrollRestoration" in history) history.scrollRestoration = "manual"; } catch (e) {}
  if (!location.hash) {
    toTop(false);
    window.addEventListener("load", function () { if (window.scrollY < 2) toTop(false); });
    window.addEventListener("pageshow", function (e) { if (e.persisted) toTop(false); });
    setTimeout(function () { toTop(false); }, 60);
  }
  document.querySelectorAll(".nav a, .mobile-menu a, .foot nav a, .logo, .head-cta").forEach(function (a) {
    a.addEventListener("click", function (e) {
      var url = new URL(a.href, location.href);
      if (url.pathname === location.pathname && !url.hash) {
        e.preventDefault();
        var mm = document.querySelector(".mobile-menu.open"); if (mm) document.querySelector(".menu-btn").click();
        toTop(true);
      }
    });
  });

  /* ---- 홈: 시공 사례 가로 스크롤 ---- */
  document.querySelectorAll("[data-hs]").forEach(function (track) {
    track.innerHTML = PROJECTS.map(function (p, k) {
      return '<a class="hs-card" href="' + p.page + '">' + photo(p.thumb || p.cover, "") +
        '<div class="hs-info"><span class="hs-no" aria-hidden="true">' + String(k + 1).padStart(2, "0") + "</span>" +
        '<h3 class="hs-title">' + esc(p.title) + "</h3>" +
        '<p class="hs-desc">' + esc(p.oneLine) + "</p>" +
        '<p class="hs-meta">' + [p.size, p.scope, p.style].join("  |  ") + "</p></div></a>";
    }).join("");
    var sec = track.closest(".hscroll"), sticky = sec.querySelector(".hs-sticky"), bar = sec.querySelector(".hs-bar i");
    var mq = window.matchMedia("(min-width: 901px) and (min-height: 640px) and (prefers-reduced-motion: no-preference)");
    var dist = 0;
    function measure() {
      if (!mq.matches) {
        sec.classList.remove("hs-on"); sec.style.height = ""; track.style.transform = ""; return;
      }
      sec.classList.add("hs-on");
      dist = Math.max(0, track.scrollWidth - document.documentElement.clientWidth);
      sec.style.height = (sticky.offsetHeight + dist) + "px";
      update();
    }
    function update() {
      var prog;
      if (sec.classList.contains("hs-on")) {
        var top = sec.getBoundingClientRect().top - (document.querySelector(".site-header") || {offsetHeight: 0}).offsetHeight;
        prog = Math.min(1, Math.max(0, -top / (dist || 1)));
        track.style.transform = "translate3d(" + (-prog * dist).toFixed(1) + "px,0,0)";
      } else {
        var max = track.scrollWidth - track.clientWidth;
        prog = max > 0 ? track.scrollLeft / max : 0;
      }
      bar.style.transform = "scaleX(" + (0.15 + prog * 0.85).toFixed(3) + ")";
    }
    window.addEventListener("scroll", update, { passive: true });
    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", measure);
    window.addEventListener("load", measure);
    if (mq.addEventListener) mq.addEventListener("change", measure);
    measure();
    /* 키보드로 카드에 초점이 가면 그 카드가 보이는 위치까지 세로 스크롤 */
    track.addEventListener("focusin", function (e) {
      if (!sec.classList.contains("hs-on")) return;
      var card = e.target.closest(".hs-card"); if (!card) return;
      var x = Math.min(dist, Math.max(0, card.offsetLeft - 40));
      var hh = (document.querySelector(".site-header") || {offsetHeight: 0}).offsetHeight;
      window.scrollTo({ top: sec.getBoundingClientRect().top + window.scrollY - hh + x, behavior: "instant" });
    });
  });

  /* ---- 홈: 서비스 섹션이 멈춘 채 약속·견적(월넛 판)이 위로 덮으며 올라옴 ---- */
  (function () {
    var under = document.querySelector(".stack-under"), zone = document.querySelector(".dark-zone");
    if (!under || !zone) return;
    var calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    function hh() { var h = document.querySelector(".site-header"); return h ? h.offsetHeight : 0; }
    function place() {
      /* 섹션이 화면보다 길면 아래 끝이 화면 아래에 닿았을 때 멈추게 */
      var top = Math.min(hh(), window.innerHeight - under.offsetHeight);
      under.style.top = top + "px";
      tick();
    }
    function tick() {
      if (calm) return;
      var r = zone.getBoundingClientRect(), vh = window.innerHeight;
      var p = Math.min(1, Math.max(0, (vh - r.top) / (vh - hh())));
      under.style.setProperty("--cover", p.toFixed(3));
    }
    window.addEventListener("scroll", tick, { passive: true });
    window.addEventListener("resize", place);
    window.addEventListener("load", place);
    if ("ResizeObserver" in window) new ResizeObserver(place).observe(under);
    place();
  })();

  /* ---- 플로팅 버튼: 카카오톡 상담, 전화, 맨 위로 ---- */
  (function () {
    var box = document.createElement("aside");
    box.className = "fab";
    box.setAttribute("aria-label", "빠른 상담");
    var telHref = CONTACT.tel ? "tel:" + CONTACT.tel.replace(/[^0-9+]/g, "") : "#";
    box.innerHTML =
      '<a class="fab-btn fab-kakao" href="' + (CONTACT.kakao || "#") + '"' + (CONTACT.kakao ? ' target="_blank" rel="noopener"' : ' data-demo="kakao"') + ' aria-label="카카오톡으로 상담하기">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4C7 4 3 7.1 3 11c0 2.5 1.7 4.7 4.2 5.9l-.9 3.4c-.1.3.3.6.6.4l4-2.6h1.1c5 0 9-3.1 9-7s-4-7.1-9-7.1z" fill="currentColor"/></svg>' +
        '<span class="fab-label">카카오톡 상담</span></a>' +
      '<a class="fab-btn fab-tel" href="' + telHref + '"' + (CONTACT.tel ? "" : ' data-demo="tel"') + ' aria-label="전화로 상담하기">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 3.5l2.6.4c.4.1.7.4.8.8l.6 3c.1.4-.1.8-.4 1l-1.6 1.1a11 11 0 0 0 5.6 5.6l1.1-1.6c.2-.3.6-.5 1-.4l3 .6c.4.1.7.4.8.8l.4 2.6c.1.6-.4 1.1-1 1.1C10.9 20.5 3.5 13.1 3.5 4.5c0-.6.5-1.1 1.1-1z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>' +
        '<span class="fab-label">' + (CONTACT.tel || "전화 상담") + "</span></a>" +
      '<button type="button" class="fab-btn fab-top" aria-label="맨 위로">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M5.5 11.5L12 5l6.5 6.5" fill="none" stroke="currentColor" stroke-width="1.6"/></svg></button>' +
      '<p class="fab-toast" role="status" aria-live="polite"></p>';
    document.body.appendChild(box);
    var top = box.querySelector(".fab-top"), toast = box.querySelector(".fab-toast"), t;
    function onScroll() { box.classList.toggle("show-top", window.scrollY > window.innerHeight * 0.8); }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    top.addEventListener("click", function () { toTop(true); var f = document.querySelector(".skip"); if (f) f.focus({ preventScroll: true }); });
    // 자주 묻는 질문 옆 '바로 물어보기'는 플로팅 버튼과 같은 곳으로 연결
    document.querySelectorAll("[data-quick]").forEach(function (q) {
      var src = box.querySelector(q.dataset.quick === "kakao" ? ".fab-kakao" : ".fab-tel");
      q.href = src.getAttribute("href");
      if (src.target) { q.target = src.target; q.rel = "noopener"; }
      q.addEventListener("click", function (e) { if (src.dataset.demo) { e.preventDefault(); src.click(); } });
    });
    box.querySelectorAll("[data-demo]").forEach(function (a) {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        toast.textContent = a.dataset.demo === "kakao" ?
          "데모 사이트입니다. 실제 업체의 카카오톡 채널 상담으로 연결됩니다." :
          "데모 사이트입니다. 실제 업체의 상담 전화로 연결됩니다.";
        box.classList.add("toast-on");
        clearTimeout(t); t = setTimeout(function () { box.classList.remove("toast-on"); }, 3200);
      });
    });
  })();
})();
