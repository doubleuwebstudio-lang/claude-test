/* 대화 성분표 — 사주 궁합. 양력 생일로 일주(태어난 날의 간지)와 띠를 계산해 궁합을 본다.
   태어난 시간과 월주(절기)는 쓰지 않는다. 재미용. 브라우저(window.Saju)와 Node 양쪽에서 동작. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.Saju = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";
  const STEMS = "갑을병정무기경신임계", STEMS_H = "甲乙丙丁戊己庚辛壬癸";
  const BRANCHES = "자축인묘진사오미신유술해", BRANCHES_H = "子丑寅卯辰巳午未申酉戌亥";
  const ANIMALS = ["쥐", "소", "호랑이", "토끼", "용", "뱀", "말", "양", "원숭이", "닭", "개", "돼지"];
  const EL = ["목", "화", "토", "금", "수"];
  const EL_H = ["木", "火", "土", "金", "水"];
  const BRANCH_EL = [4, 2, 0, 0, 2, 1, 1, 2, 3, 3, 2, 4];
  const DAYMASTER = [
    ["큰 나무", "곧게 뻗는 사람. 방향이 정해지면 흔들리지 않아요."],
    ["꽃과 덩굴", "유연하고 사람을 잘 엮어요. 분위기를 잘 읽어요."],
    ["한낮의 태양", "밝고 솔직해요. 감정이 얼굴에 바로 드러나요."],
    ["촛불", "따뜻하고 섬세해요. 한 사람에게 오래 집중해요."],
    ["큰 산", "듬직하고 말보다 행동이에요. 쉽게 안 변해요."],
    ["논밭", "잘 품어 주고 챙겨 줘요. 실속을 따져요."],
    ["바위와 쇠", "결단이 빠르고 의리가 있어요. 말이 직설적이에요."],
    ["보석", "예민하고 완벽주의예요. 아끼는 사람에게 다정해요."],
    ["바다", "자유롭고 스케일이 커요. 얽매이면 답답해해요."],
    ["비와 이슬", "감성적이고 직관이 좋아요. 속마음을 늦게 꺼내요."],
  ];

  // 양력 날짜의 율리우스 일수
  function jdn(y, m, d) { return Math.round(Date.UTC(y, m - 1, d) / 864e5) + 2440588; }
  function dayPillar(y, m, d) { return ((jdn(y, m, d) - 11) % 60 + 60) % 60; } // 0 = 갑자
  // 띠는 입춘(대략 2월 4일) 기준
  function yearPillar(y, m, d) { const yy = (m < 2 || (m === 2 && d < 4)) ? y - 1 : y; return ((yy - 4) % 60 + 60) % 60; }

  function chart(dateStr) {
    const mt = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr || "");
    if (!mt) return null;
    const y = +mt[1], m = +mt[2], d = +mt[3];
    const dt = new Date(Date.UTC(y, m - 1, d));
    if (dt.getUTCMonth() !== m - 1 || y < 1900 || y > 2100) return null;
    const dp = dayPillar(y, m, d), yp = yearPillar(y, m, d);
    const stem = dp % 10, dBranch = dp % 12, yBranch = yp % 12;
    return {
      date: dateStr,
      day: { idx: dp, name: STEMS[stem] + BRANCHES[dBranch], hanja: STEMS_H[stem] + BRANCHES_H[dBranch] },
      year: { idx: yp, name: STEMS[yp % 10] + BRANCHES[yBranch], hanja: STEMS_H[yp % 10] + BRANCHES_H[yBranch] },
      stem, el: Math.floor(stem / 2), dBranch, yBranch,
      animal: ANIMALS[yBranch],
      master: { name: STEMS[stem] + EL[Math.floor(stem / 2)], hanja: STEMS_H[stem] + EL_H[Math.floor(stem / 2)], image: DAYMASTER[stem][0], text: DAYMASTER[stem][1] },
    };
  }

  // 받침에 따라 조사 고르기
  function j(w, withB, noB) {
    const c = String(w).charCodeAt(String(w).length - 1);
    if (c < 0xac00 || c > 0xd7a3) return w + withB + "(" + noB + ")";
    return w + ((c - 0xac00) % 28 ? withB : noB);
  }
  const gen = (a, b) => (a + 1) % 5 === b;      // a가 b를 낳는다 (목→화→토→금→수→목)
  const ctl = (a, b) => (a + 2) % 5 === b;      // a가 b를 누른다 (목→토→수→화→금→목)
  const stemHap = (a, b) => (a % 5) === (b % 5) && a !== b; // 갑기·을경·병신·정임·무계
  const SAMHAP = [[8, 0, 4], [11, 3, 7], [2, 6, 10], [5, 9, 1]];
  const branchSamhap = (a, b) => a !== b && SAMHAP.some((g) => g.includes(a) && g.includes(b));
  const branchYukhap = (a, b) => (a + b) % 12 === 1;   // 자축·인해·묘술·진유·사신·오미
  const branchChung = (a, b) => (a + 6) % 12 === b;

  function match(A, B, nameA = "A", nameB = "B") {
    let score = 62;
    const parts = [];
    const add = (label, text, delta) => { score += delta; parts.push({ label, text, delta }); };

    // 일간: 나 자신을 뜻하는 글자끼리
    if (stemHap(A.stem, B.stem)) add("일간 천간합", `${j(A.master.name, "과", "와")} ${j(B.master.name, "은", "는")} 서로 끌어당기는 합이에요. 만나면 서로 성격이 조금씩 닮아가요.`, 20);
    else if (A.el === B.el) add("일간 비화", `둘 다 ${EL[A.el]}의 기운이에요. 말이 잘 통하지만 고집이 부딪히면 둘 다 안 물러나요.`, 6);
    else if (gen(A.el, B.el)) add("일간 상생", `${j(nameA, "이", "가")} ${j(nameB, "을", "를")} 키워 주는 사이예요(${EL[A.el]}→${EL[B.el]}). ${j(nameA, "이", "가")} 주는 쪽, ${j(nameB, "이", "가")} 받는 쪽.`, 12);
    else if (gen(B.el, A.el)) add("일간 상생", `${j(nameB, "이", "가")} ${j(nameA, "을", "를")} 키워 주는 사이예요(${EL[B.el]}→${EL[A.el]}). ${j(nameB, "이", "가")} 주는 쪽, ${j(nameA, "이", "가")} 받는 쪽.`, 12);
    else if (ctl(A.el, B.el)) add("일간 상극", `${j(nameA, "이", "가")} ${j(nameB, "을", "를")} 다듬는 관계예요(${EL[A.el]}극${EL[B.el]}). 조언이 잔소리로 들리지 않게 조심.`, -6);
    else add("일간 상극", `${j(nameB, "이", "가")} ${j(nameA, "을", "를")} 다듬는 관계예요(${EL[B.el]}극${EL[A.el]}). 조언이 잔소리로 들리지 않게 조심.`, -6);

    // 띠
    const ab = `${A.animal}띠와 ${B.animal}띠`;
    if (branchSamhap(A.yBranch, B.yBranch)) add("띠 삼합", `${ab}는 같은 목표를 보면 힘이 세지는 삼합이에요.`, 12);
    else if (branchYukhap(A.yBranch, B.yBranch)) add("띠 육합", `${ab}는 서로 빈 곳을 채워 주는 육합이에요.`, 10);
    else if (branchChung(A.yBranch, B.yBranch)) add("띠 충", `${ab}는 정반대 기질이에요. 싸워도 화해가 빠르면 오히려 오래가요.`, -10);
    else if (A.yBranch === B.yBranch) add("같은 띠", `둘 다 ${A.animal}띠라 생활 리듬이 비슷해요.`, 4);
    else add("띠", `${ab}는 무난한 조합이에요. 띠보다 대화가 더 중요해요.`, 0);

    // 일지: 태어난 날의 땅 글자, 가까운 사이의 속궁합
    if (branchYukhap(A.dBranch, B.dBranch) || branchSamhap(A.dBranch, B.dBranch)) add("일지 합", "가까워질수록 편해지는 조합이에요.", 6);
    else if (branchChung(A.dBranch, B.dBranch)) add("일지 충", "같이 있는 시간이 길면 부딪히기 쉬워요. 혼자만의 시간을 존중해 주세요.", -6);

    return { score: Math.max(40, Math.min(98, Math.round(score))), parts };
  }

  // 2027 정미년: 천간 정(丁, 화) + 지지 미(未, 토, 양띠)
  const Y27 = { stem: 3, el: 1, branch: 7, name: "정미년", hanja: "丁未年" };
  function yearLuck(C) {
    const e = C.el;
    let key, text;
    if (e === Y27.el) { key = "존재감"; text = "같은 불의 해라 자기 표현이 세져요. 하고 싶은 말을 미루지 마세요."; }
    else if (gen(e, Y27.el)) { key = "베풂"; text = "내 기운을 나눠 주는 해예요. 챙겨 주는 만큼 고마움을 말로 받아 두세요."; }
    else if (gen(Y27.el, e)) { key = "충전"; text = "해가 나를 밀어 주는 해예요. 받은 도움을 당연하게 여기지만 않으면 좋아요."; }
    else if (ctl(e, Y27.el)) { key = "주도권"; text = "흐름을 내가 잡는 해예요. 관계에서도 먼저 계획을 내미는 쪽이 돼요."; }
    else { key = "단련"; text = "부딪히며 단단해지는 해예요. 서운함은 쌓기 전에 짧게 말하세요."; }
    let animal = "";
    if (branchSamhap(C.yBranch, Y27.branch) || branchYukhap(C.yBranch, Y27.branch)) animal = `${C.animal}띠는 양의 해와 합이 맞아 사람운이 좋아요.`;
    else if (branchChung(C.yBranch, Y27.branch)) animal = `${C.animal}띠는 양의 해와 충이라 이동·변화가 많아요. 약속은 미리 잡아 두세요.`;
    else if (C.yBranch === Y27.branch) animal = "양띠의 해, 내 해예요. 주목받는 일이 늘어요.";
    return { key, text, animal };
  }

  return { josa: j, chart, match, yearLuck, Y27, EL, EL_H, dayPillar, yearPillar };
});
