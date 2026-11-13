/* 대화 성분표 — 카톡 대화 파서와 통계 엔진.
   브라우저(window.ChatLab)와 Node(require) 양쪽에서 동작한다. 원문은 어디로도 보내지 않는다. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.ChatLab = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  const SESSION_GAP = 6 * 3600e3; // 6시간 넘게 조용하면 새 대화로 본다

  function to24(ampm, h) {
    h = +h;
    if (ampm === "오후" || ampm === "PM") return h < 12 ? h + 12 : h;
    if (ampm === "오전" || ampm === "AM") return h === 12 ? 0 : h;
    return h;
  }

  // 모바일(안드로이드/iOS): 2024년 1월 1일 오후 3:15, 이름 : 내용  /  2024. 1. 1. 오후 3:15, 이름 : 내용
  const RE_MOBILE = /^(\d{4})[년.]\s*(\d{1,2})[월.]\s*(\d{1,2})[일.]?\s*(오전|오후|AM|PM)?\s*(\d{1,2}):(\d{2})(?::\d{2})?,\s(.*)$/;
  // PC(윈도우): --------------- 2024년 1월 1일 월요일 ---------------
  const RE_PC_DATE = /^-{3,}\s*(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일.*?-{3,}\s*$/;
  // PC(윈도우): [이름] [오후 3:15] 내용
  const RE_PC_MSG = /^\[(.+?)\]\s\[(오전|오후|AM|PM)\s?(\d{1,2}):(\d{2})\]\s?(.*)$/;
  const RE_TITLE = /^(.+?)\s*님과 카카오톡 대화/;
  const RE_DATE_ONLY = /^\d{4}년\s*\d{1,2}월\s*\d{1,2}일\s*[월화수목금토일]요일\s*$/;

  function kindOf(text) {
    const t = text.trim();
    if (t === "사진" || /^사진 \d+장$/.test(t)) return "photo";
    if (t === "이모티콘") return "emoticon";
    if (t === "동영상") return "video";
    if (t === "삭제된 메시지입니다.") return "deleted";
    if (/^(보이스톡|페이스톡)|^통화시간 \d/.test(t)) return "call";
    if (/^파일:/.test(t)) return "file";
    if (/^https?:\/\/\S+$/.test(t)) return "link";
    return "text";
  }

  function parseCSV(text) {
    const rows = [];
    let row = [], cell = "", q = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (q) {
        if (c === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; }
        else cell += c;
      } else if (c === '"') q = true;
      else if (c === ",") { row.push(cell); cell = ""; }
      else if (c === "\n") { row.push(cell); rows.push(row); row = []; cell = ""; }
      else if (c !== "\r") cell += c;
    }
    if (cell || row.length) { row.push(cell); rows.push(row); }
    return rows;
  }

  function parse(raw) {
    const text = String(raw || "").replace(/^﻿/, "").replace(/\r\n?/g, "\n");
    const messages = [];
    let title = "", format = "unknown";

    const firstLine = text.split("\n", 1)[0].trim();
    if (/^Date,User,Message/i.test(firstLine)) {
      format = "mac-csv";
      for (const r of parseCSV(text).slice(1)) {
        if (r.length < 3) continue;
        const m = /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})/.exec(r[0]);
        if (!m) continue;
        const body = r.slice(2).join(",");
        messages.push({ t: new Date(+m[1], m[2] - 1, +m[3], +m[4], +m[5]).getTime(), name: r[1].trim(), text: body, kind: kindOf(body) });
      }
      return { format, title, messages };
    }

    let pcDate = null, last = null;
    for (const line of text.split("\n")) {
      if (!title) { const tm = RE_TITLE.exec(line); if (tm) { title = tm[1].trim(); continue; } }
      let m;
      if ((m = RE_PC_DATE.exec(line))) {
        pcDate = [+m[1], +m[2] - 1, +m[3]]; format = "pc"; last = null; continue;
      }
      if (pcDate && (m = RE_PC_MSG.exec(line))) {
        const t = new Date(pcDate[0], pcDate[1], pcDate[2], to24(m[2], m[3]), +m[4]).getTime();
        last = { t, name: m[1].trim(), text: m[5], kind: "text" };
        messages.push(last); continue;
      }
      if ((m = RE_MOBILE.exec(line))) {
        format = "mobile";
        const rest = m[7];
        const sep = rest.indexOf(" : ");
        if (sep < 1) { last = null; continue; } // 입장·퇴장 같은 시스템 메시지
        const t = new Date(+m[1], m[2] - 1, +m[3], to24(m[4], m[5]), +m[6]).getTime();
        last = { t, name: rest.slice(0, sep).trim(), text: rest.slice(sep + 3), kind: "text" };
        messages.push(last); continue;
      }
      if (RE_DATE_ONLY.test(line.trim()) || /^저장한 날짜\s*:/.test(line)) { last = null; continue; }
      if (last && line !== "") last.text += "\n" + line; // 여러 줄 메시지
    }
    for (const msg of messages) msg.kind = kindOf(msg.text);
    messages.sort((a, b) => a.t - b.t);
    return { format, title, messages };
  }

  // ---------- 통계 ----------
  const W = {
    affection: /보고\s?싶|사랑|좋아해|고마워|귀여|예쁘|이쁘|잘\s?자|♥|❤|💕|😘|🥰/g,
    laugh: /[ㅋㅎ]{2,}/,
    cry: /[ㅠㅜ]{2,}/,
    N: /만약|상상|느낌|의미|미래|꿈|혹시|왠지|우주|영화|생각해\s?보면|어떤 기분/g,
    S: /몇\s?시|어디|얼마|언제|먹었|먹을|가격|오늘|내일|시간|주소|메뉴/g,
    F: /[ㅠㅜ]{2,}|미안|고마|사랑|슬퍼|속상|기뻐|감동|헐|대박|귀여|힘들|괜찮아\?|♥|❤/g,
    T: /근데|그래서|왜냐|이유|정확|효율|논리|사실|결론|그니까|해결/g,
    J: /계획|예약|약속|미리|정리|일정|준비|확인|마감|몇\s?시에|순서/g,
    P: /갑자기|그냥|아무거나|나중에|대충|몰라|즉흥|일단|글쎄|어쩌다/g,
  };
  const STOP = new Set(["그냥","근데","진짜","너무","나도","그래","그럼","이제","아니","오늘","내일","우리","지금","그거","이거","저거","나는","너는","했어","하는","있어","없어","그래서","사진","이모티콘","동영상","정말","완전","약간","혹시","그리고","하고","같아","거야","했는데","ㅇㅇ","응응"]);

  const count = (s, re) => (s.match(re) || []).length;
  const median = (a) => { if (!a.length) return null; const s = [...a].sort((x, y) => x - y); const h = s.length >> 1; return s.length % 2 ? s[h] : (s[h - 1] + s[h]) / 2; };
  const clamp01 = (x) => Math.max(0, Math.min(1, x));

  function speakers(messages) {
    const c = new Map();
    for (const m of messages) c.set(m.name, (c.get(m.name) || 0) + 1);
    return [...c.entries()].sort((a, b) => b[1] - a[1]).map(([name, n]) => ({ name, n }));
  }

  function analyze(allMessages, a, b) {
    const msgs = allMessages.filter((m) => m.name === a || m.name === b);
    const P = {};
    for (const n of [a, b]) P[n] = { name: n, count: 0, textCount: 0, chars: 0, laugh: 0, cry: 0, question: 0, emoticon: 0, photo: 0, late: 0, hours: new Array(24).fill(0), inits: 0, ends: 0, replies: [], turns: 0, affection: 0, N: 0, S: 0, F: 0, T: 0, J: 0, P: 0, words: new Map() };

    const days = new Set();
    let prev = null;
    for (let i = 0; i < msgs.length; i++) {
      const m = msgs[i], p = P[m.name];
      const d = new Date(m.t);
      days.add(d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate());
      p.count++; p.hours[d.getHours()]++;
      if (d.getHours() < 5) p.late++;
      if (m.kind === "emoticon") p.emoticon++;
      if (m.kind === "photo") p.photo++;
      if (m.kind === "text") {
        const s = m.text;
        p.textCount++; p.chars += s.length;
        if (W.laugh.test(s)) p.laugh++;
        if (W.cry.test(s)) p.cry++;
        if (/\?/.test(s)) p.question++;
        p.affection += count(s, W.affection);
        for (const k of ["N", "S", "F", "T", "J", "P"]) p[k] += count(s, W[k]);
        for (let w of s.split(/\s+/)) {
          w = w.replace(/[^\p{L}\p{N}]/gu, "");
          if (w.length < 2 || /^[ㄱ-ㅎㅏ-ㅣ]+$/.test(w) || STOP.has(w) || /^\d+$/.test(w)) continue;
          p.words.set(w, (p.words.get(w) || 0) + 1);
        }
      }
      const newSession = !prev || m.t - prev.t >= SESSION_GAP;
      if (newSession) {
        p.inits++; p.turns++;
        if (prev) P[prev.name].ends++;
      } else if (prev.name !== m.name) {
        p.turns++;
        p.replies.push((m.t - prev.t) / 60000);
      }
      prev = m;
    }
    if (prev) P[prev.name].ends++;

    const total = msgs.length;
    const activeDays = days.size || 1;
    const span = total ? Math.max(1, Math.round((msgs[total - 1].t - msgs[0].t) / 864e5) + 1) : 0;

    const people = [a, b].map((n) => {
      const p = P[n];
      const sessions = P[a].inits + P[b].inits || 1;
      const topWords = [...p.words.entries()].sort((x, y) => y[1] - x[1]).slice(0, 5).map(([w, c]) => ({ w, c }));
      return {
        name: n,
        count: p.count,
        share: total ? p.count / total : 0,
        avgLen: p.textCount ? p.chars / p.textCount : 0,
        laughRate: p.textCount ? p.laugh / p.textCount : 0,
        cryRate: p.textCount ? p.cry / p.textCount : 0,
        questionRate: p.textCount ? p.question / p.textCount : 0,
        emoticon: p.emoticon,
        photo: p.photo,
        lateRate: p.count ? p.late / p.count : 0,
        hours: p.hours,
        inits: p.inits,
        initShare: p.inits / sessions,
        ends: p.ends,
        replyMedian: median(p.replies),
        replyFast: p.replies.length ? p.replies.filter((x) => x <= 1).length / p.replies.length : 0,
        perTurn: p.turns ? p.count / p.turns : 0,
        perDay: p.count / activeDays,
        affection: p.affection,
        lex: { N: p.N, S: p.S, F: p.F, T: p.T, J: p.J, P: p.P },
        topWords,
      };
    });
    people.forEach((p) => (p.type = estimateType(p)));

    const allHours = new Array(24).fill(0);
    people.forEach((p) => p.hours.forEach((v, h) => (allHours[h] += v)));
    const peakHour = allHours.indexOf(Math.max(...allHours));

    return { a, b, total, activeDays, span, sessions: P[a].inits + P[b].inits, peakHour, allHours, people, compat: compat(people) };
  }

  function lean(x, y) { return (x + 1) / (x + y + 2); } // 표본이 적으면 0.5 쪽으로 당긴다

  function estimateType(p) {
    const ent = (() => {
      const s = p.hours.reduce((x, y) => x + y, 0) || 1;
      let e = 0; for (const v of p.hours) if (v) { const q = v / s; e -= q * Math.log2(q); }
      return e / Math.log2(24);
    })();
    const axes = [
      ["E", "I", 0.35 * p.initShare + 0.35 * clamp01(p.perDay / 30) + 0.3 * clamp01((p.perTurn - 1) / 1.2)],
      ["N", "S", 0.75 * lean(p.lex.N, p.lex.S) + 0.25 * clamp01(p.avgLen / 30)],
      ["F", "T", 0.6 * lean(p.lex.F, p.lex.T) + 0.25 * clamp01(p.laughRate * 2) + 0.15 * clamp01(p.emoticon / Math.max(1, p.count) * 10)],
      ["J", "P", 0.7 * lean(p.lex.J, p.lex.P) + 0.3 * (1 - ent)],
    ];
    const letters = axes.map(([x, y, s]) => (s >= 0.5 ? x : y)).join("");
    const strength = axes.map(([x, y, s]) => ({ pos: x, neg: y, score: s }));
    return { letters, strength };
  }

  function compat(people) {
    const [x, y] = people;
    const bal = 1 - Math.abs(x.share - 0.5) * 2;
    const initBal = 1 - Math.abs(x.initShare - 0.5) * 2;
    const speed = [x, y].map((p) => (p.replyMedian == null ? 0.4 : 1 / (1 + p.replyMedian / 8))).reduce((s, v) => s + v) / 2;
    const laugh = Math.max(x.laughRate, y.laughRate) ? Math.min(x.laughRate, y.laughRate) / Math.max(x.laughRate, y.laughRate) : 0.5;
    const hx = x.hours.reduce((s, v) => s + v, 0) || 1, hy = y.hours.reduce((s, v) => s + v, 0) || 1;
    let overlap = 0; for (let h = 0; h < 24; h++) overlap += Math.min(x.hours[h] / hx, y.hours[h] / hy);
    const warm = clamp01((x.affection + y.affection) / Math.max(1, x.count + y.count) * 25);
    const parts = { bal, initBal, speed, laugh, overlap, warm };
    const w = { bal: 0.2, initBal: 0.2, speed: 0.2, laugh: 0.15, overlap: 0.15, warm: 0.1 };
    const raw = Object.keys(w).reduce((s, k) => s + w[k] * parts[k], 0);
    return { score: Math.round(52 + 47 * raw), parts };
  }


  // ---------- 명장면과 심전도 ----------
  const RALLY_GAP = 2 * 60e3;   // 카톡 시간은 분 단위라 2분 안이면 즉답으로 본다
  const COLD_GAP = 48 * 3600e3; // 이틀 넘게 조용하면 냉전
  const FIRSTS = [
    { key: "first", label: "첫 메시지", test: () => true },
    { key: "laugh", label: "첫 'ㅋㅋ'", test: (m) => /ㅋㅋ/.test(m.text) },
    { key: "photo", label: "첫 사진", test: (m) => m.kind === "photo" },
    { key: "plan", label: "첫 약속", test: (m) => /약속|만나자|볼까\?|보자|시간\s?돼\?/.test(m.text) },
    { key: "thanks", label: "첫 '고마워'", test: (m) => /고마워|고맙/.test(m.text) },
    { key: "night", label: "첫 '잘 자'", test: (m) => /잘\s?자(?![료가])/.test(m.text) },
    { key: "miss", label: "첫 '보고 싶다'", test: (m) => /보고\s?싶/.test(m.text) },
    { key: "love", label: "첫 '사랑해'", test: (m) => /사랑해/.test(m.text) },
  ];

  function dayKey(t) { const d = new Date(t); return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime(); }

  function moments(allMessages, a, b) {
    const msgs = allMessages.filter((m) => m.name === a || m.name === b);
    if (msgs.length < 2) return null;

    const days = [], idx = new Map();
    const end = dayKey(msgs[msgs.length - 1].t);
    for (let d = new Date(dayKey(msgs[0].t)); d.getTime() <= end; d.setDate(d.getDate() + 1)) {
      idx.set(d.getTime(), days.length);
      days.push({ t: d.getTime(), n: 0, a: 0, b: 0 });
    }
    const dayOf = (t) => idx.get(dayKey(t));

    let rally = null, cur = null, laugh = null, longest = null;
    const waited = { [a]: 0, [b]: 0 }; // waited[x] = x가 상대 답장을 기다린 시간
    const cold = [];
    const firsts = [];
    const seen = new Set();

    for (let i = 0; i < msgs.length; i++) {
      const m = msgs[i], prev = msgs[i - 1];
      const day = days[dayOf(m.t)];
      day.n++; day[m.name === a ? "a" : "b"]++;

      if (m.kind === "text") {
        const run = Math.max(0, ...(m.text.match(/ㅋ+/g) || []).map((x) => x.length));
        if (run >= 3 && (!laugh || run > laugh.len)) laugh = { len: run, i };
        if (!longest || m.text.length > longest.len) longest = { len: m.text.length, i };
      }
      for (const f of FIRSTS) if (!seen.has(f.key) && f.test(m)) { seen.add(f.key); firsts.push({ key: f.key, label: f.label, i }); }

      if (!prev) { cur = { from: 0, to: 0, turns: 1 }; continue; }
      const gap = m.t - prev.t;
      if (prev.name !== m.name && gap < SESSION_GAP) waited[prev.name] += gap;
      if (gap >= COLD_GAP) cold.push({ from: i - 1, to: i, ms: gap });
      if (gap <= RALLY_GAP) {
        cur.to = i;
        if (prev.name !== m.name) cur.turns++;
      } else {
        cur = { from: i, to: i, turns: 1 };
      }
      if (!rally || cur.turns > rally.turns) rally = { ...cur };
    }

    let hottest = 0;
    days.forEach((d, k) => { if (d.n > days[hottest].n) hottest = k; });
    const colds = cold.sort((x, y) => y.ms - x.ms).slice(0, 3).sort((x, y) => x.from - y.from);

    return {
      a, b, msgs, days,
      hottest: { day: hottest, ...days[hottest] },
      rally: rally && rally.turns >= 4 ? { ...rally, day: dayOf(msgs[rally.from].t), ms: msgs[rally.to].t - msgs[rally.from].t } : null,
      laugh: laugh && { ...laugh, day: dayOf(msgs[laugh.i].t) },
      longest: longest && longest.len >= 20 ? { ...longest, day: dayOf(msgs[longest.i].t) } : null,
      waited,
      cold: colds.map((c) => ({ ...c, fromDay: dayOf(msgs[c.from].t), toDay: dayOf(msgs[c.to].t) })),
      firsts: firsts.map((f) => ({ ...f, day: dayOf(msgs[f.i].t) })).sort((x, y) => x.i - y.i),
      avg: msgs.length / days.length,
    };
  }


  // ---------- 웃음 포인트: 시상식과 판결문 재료 ----------
  const SHORT = new Set(["ㅇㅇ", "ㅇㅇㅇ", "ㅇ", "ㅇㅋ", "ㅇㅋㅇㅋ", "응", "응응", "웅", "웅웅", "엉", "어", "네", "넹", "넵", "오키", "오케이", "ㄱㄱ", "ㄴㄴ", "그래", "알겠어", "ㅇㅈ", "ㅎㅇ"]);
  const FOOD = /먹|배고|배불|맛있|맛집|치킨|떡볶이|피자|라면|마라|국밥|삼겹|고기|초밥|햄버거|커피|카페|디저트|빵|술|맥주|소주|배달|메뉴|야식|점심|저녁|아침밥/;
  const SORRY = /미안|죄송|ㅈㅅ|쏘리/;
  const NIGHT = /잘\s?자(?![료가])|굿밤|굿나잇|잘\s?자요/;

  function funStats(allMessages, a, b) {
    const msgs = allMessages.filter((m) => m.name === a || m.name === b);
    const P = {};
    for (const n of [a, b]) P[n] = { name: n, kk: 0, hh: 0, short: new Map(), phrases: new Map(), food: 0, sorry: 0, night: 0, late: 0, lateQuote: null, questions: 0, emoticon: 0, photo: 0, text: 0, count: 0, mono: null, ignored: null };
    let run = null;
    for (let i = 0; i < msgs.length; i++) {
      const m = msgs[i], p = P[m.name], prev = msgs[i - 1];
      p.count++;
      if (m.kind === "emoticon") p.emoticon++;
      if (m.kind === "photo") p.photo++;
      const h = new Date(m.t).getHours();
      if (m.kind === "text") {
        const t = m.text.trim(), norm = t.replace(/\s+/g, " ");
        p.text++;
        p.kk += (t.match(/ㅋ/g) || []).length;
        p.hh += (t.match(/ㅎ/g) || []).length;
        if (SHORT.has(norm)) p.short.set(norm, (p.short.get(norm) || 0) + 1);
        else if (norm.length >= 2 && norm.length <= 20 && !/^[ㅋㅎㅠㅜ\s.!?~]+$/.test(norm)) p.phrases.set(norm, (p.phrases.get(norm) || 0) + 1);
        if (FOOD.test(t)) p.food++;
        if (SORRY.test(t)) p.sorry++;
        if (NIGHT.test(t)) p.night++;
        if (/\?/.test(t)) p.questions++;
        if (h >= 2 && h < 5) { p.late++; if (!p.lateQuote || t.length > p.lateQuote.text.length) p.lateQuote = m; }
      } else if (h >= 2 && h < 5) p.late++;

      // 독백: 상대 답 없이 혼자 연달아 보낸 최장 기록 (하루 넘게 끊기면 새로 센다)
      if (run && run.name === m.name && m.t - prev.t < 864e5) { run.n++; run.to = i; }
      else run = { name: m.name, n: 1, from: i, to: i };
      if (!P[m.name].mono || run.n > P[m.name].mono.n) P[m.name].mono = { ...run };

      // 읽씹: 상대의 질문에 답하기까지 걸린 최장 시간 (이틀 넘으면 냉전이라 뺀다)
      if (prev && prev.name !== m.name && prev.kind === "text" && /\?/.test(prev.text)) {
        const gap = m.t - prev.t;
        if (gap < 2 * 864e5 && (!p.ignored || gap > p.ignored.ms)) p.ignored = { ms: gap, q: prev, reply: m };
      }
    }
    const out = {};
    for (const n of [a, b]) {
      const p = P[n];
      const top = (map) => { let best = null; for (const [w, c] of map) if (!best || c > best.c) best = { w, c }; return best; };
      out[n] = {
        name: n, count: p.count, text: p.text, kk: p.kk, hh: p.hh,
        short: top(p.short), shortTotal: [...p.short.values()].reduce((s, v) => s + v, 0),
        phrase: top(p.phrases), food: p.food, sorry: p.sorry, night: p.night, late: p.late, lateQuote: p.lateQuote,
        questions: p.questions, emoticon: p.emoticon, photo: p.photo,
        mono: p.mono && { ...p.mono, msgs: msgs.slice(p.mono.from, p.mono.to + 1) },
        ignored: p.ignored,
      };
    }
    const foodAll = out[a].food + out[b].food, textAll = out[a].text + out[b].text;
    return { a, b, people: out, foodShare: textAll ? foodAll / textAll : 0 };
  }


  // ---------- 단톡방 모드: 전원 대상 통계 ----------
  const REPLY_GAP = 10 * 60e3;      // 10분 안에 다른 사람이 말하면 '받아 준' 것으로 본다
  const KILL_GAP = 3 * 3600e3;      // 이 사람 말 뒤로 3시간 넘게 조용하면 '대화 종결'
  function groupStats(all) {
    const msgs = all;
    const sp = speakers(msgs);
    const P = {};
    for (const { name } of sp) P[name] = { name, chars: 0, laugh: 0, turns: 0, lex: { N: 0, S: 0, F: 0, T: 0, J: 0, P: 0 }, days: new Set(), count: 0, text: 0, kk: 0, short: new Map(), shortTotal: 0, phrases: new Map(), questions: 0, unanswered: 0, unansweredQ: null, late: 0, lateQuote: null, emoticon: 0, photo: 0, inits: 0, kills: 0, killQuote: null, repliesGot: 0, mono: null, away: null, lastMsg: null, hours: new Array(24).fill(0) };
    const pairs = new Map();
    const days = new Set(), allHours = new Array(24).fill(0);
    let run = null;
    for (let i = 0; i < msgs.length; i++) {
      const m = msgs[i], p = P[m.name], prev = msgs[i - 1], next = msgs[i + 1];
      const d = new Date(m.t), h = d.getHours();
      days.add(dayKey(m.t)); allHours[h]++; p.hours[h]++; p.days.add(dayKey(m.t));
      if (!prev || prev.name !== m.name || m.t - prev.t >= SESSION_GAP) p.turns++;
      p.count++;
      if (m.kind === "emoticon") p.emoticon++;
      if (m.kind === "photo") p.photo++;
      if (h >= 2 && h < 5) { p.late++; if (m.kind === "text" && (!p.lateQuote || m.text.length > p.lateQuote.text.length)) p.lateQuote = m; }
      if (m.kind === "text") {
        const t = m.text.trim(), norm = t.replace(/\s+/g, " ");
        p.text++; p.chars += t.length;
        if (W.laugh.test(t)) p.laugh++;
        for (const k of ["N", "S", "F", "T", "J", "P"]) p.lex[k] += count(t, W[k]);
        p.kk += (t.match(/ㅋ/g) || []).length;
        if (SHORT.has(norm)) { p.short.set(norm, (p.short.get(norm) || 0) + 1); p.shortTotal++; }
        else if (norm.length >= 2 && norm.length <= 20 && !/^[ㅋㅎㅠㅜ\s.!?~]+$/.test(norm)) p.phrases.set(norm, (p.phrases.get(norm) || 0) + 1);
        if (/\?/.test(t)) {
          p.questions++;
          let answered = false;
          for (let j = i + 1; j < msgs.length && msgs[j].t - m.t <= 3600e3; j++) if (msgs[j].name !== m.name) { answered = true; break; }
          if (!answered) { p.unanswered++; if (!p.unansweredQ || t.length > p.unansweredQ.text.length) p.unansweredQ = m; }
        }
      }
      if (!prev || m.t - prev.t >= SESSION_GAP) p.inits++;
      if (next && next.t - m.t >= KILL_GAP && h >= 9 && h <= 22 && m.kind === "text" && !NIGHT.test(m.text)) {
        p.kills++;
        if (!p.killQuote || (next.t - m.t) > p.killQuote.ms) p.killQuote = { m, ms: next.t - m.t };
      }
      if (prev && prev.name !== m.name && m.t - prev.t <= REPLY_GAP) {
        P[prev.name].repliesGot++;
        const key = [prev.name, m.name].sort().join("\u0000");
        pairs.set(key, (pairs.get(key) || 0) + 1);
      }
      if (run && run.name === m.name && m.t - prev.t < 864e5) { run.n++; run.to = i; }
      else run = { name: m.name, n: 1, from: i, to: i };
      if (!p.mono || run.n > p.mono.n) p.mono = { ...run };
      if (p.lastMsg) {
        const gap = m.t - p.lastMsg.t;
        if (!p.away || gap > p.away.ms) p.away = { ms: gap, before: p.lastMsg, back: m };
      }
      p.lastMsg = m;
    }
    const total = msgs.length;
    const spanDays = total ? Math.max(1, Math.round((dayKey(msgs[total - 1].t) - dayKey(msgs[0].t)) / 864e5) + 1) : 0;
    const months = Math.max(1, spanDays / 30.4);
    const top = (map) => { let best = null; for (const [w, c] of map) if (!best || c > best.c) best = { w, c }; return best; };
    const sessions = Object.values(P).reduce((s2, p) => s2 + p.inits, 0) || 1;
    const members = sp.map(({ name }) => {
      const p = P[name];
      // 1:1과 같은 기준으로 말투 유형을 추정한다. 단톡방은 선톡이 n명에게 나뉘니 2인 기준으로 맞춘다.
      const type = p.count >= 30 ? estimateType({
        initShare: Math.min(1, (p.inits / sessions) * sp.length / 2), perDay: p.count / Math.max(1, p.days.size), perTurn: p.turns ? p.count / p.turns : 1,
        lex: p.lex, avgLen: p.text ? p.chars / p.text : 0, laughRate: p.text ? p.laugh / p.text : 0, emoticon: p.emoticon, count: p.count, hours: p.hours,
      }) : null;
      return {
        type,
        name, count: p.count, share: p.count / total, perMonth: p.count / months, text: p.text, kk: p.kk,
        kkRate: p.text ? p.kk / p.text : 0, short: top(p.short), shortTotal: p.shortTotal, phrase: top(p.phrases),
        questions: p.questions, unanswered: p.unanswered, unansweredQ: p.unansweredQ, late: p.late, lateQuote: p.lateQuote,
        emoticon: p.emoticon, photo: p.photo, inits: p.inits, kills: p.kills, killQuote: p.killQuote,
        replyRate: p.count ? p.repliesGot / p.count : 0, hours: p.hours,
        mono: p.mono && { n: p.mono.n, msgs: msgs.slice(p.mono.from, p.mono.to + 1) },
        away: p.away,
      };
    });
    const pairList = [...pairs.entries()].map(([k, c]) => ({ names: k.split("\u0000"), c })).sort((x, y) => y.c - x.c);
    return { members, pairs: pairList, total, spanDays, activeDays: days.size, peakHour: allHours.indexOf(Math.max(...allHours)), allHours, from: msgs[0] && msgs[0].t, to: msgs[total - 1] && msgs[total - 1].t };
  }

  // ---------- MBTI 궁합 (흔히 알려진 궁합표 + 글자별 규칙, 재미용) ----------
  const MBTI_TYPES = ["INTJ", "INTP", "ENTJ", "ENTP", "INFJ", "INFP", "ENFJ", "ENFP", "ISTJ", "ISFJ", "ESTJ", "ESFJ", "ISTP", "ISFP", "ESTP", "ESFP"];
  const MBTI_BEST = { INFP: ["ENFJ", "ENTJ"], ENFP: ["INFJ", "INTJ"], INFJ: ["ENFP", "ENTP"], ENFJ: ["INFP", "ISFP"], INTJ: ["ENFP", "ENTP"], ENTJ: ["INFP", "INTP"], INTP: ["ENTJ", "ESTJ"], ENTP: ["INFJ", "INTJ"], ISFP: ["ENFJ", "ESFJ", "ESTJ"], ESFP: ["ISFJ", "ISTJ"], ISTP: ["ESFJ", "ESTJ"], ESTP: ["ISFJ", "ISTJ"], ISFJ: ["ESFP", "ESTP"], ESFJ: ["ISFP", "ISTP"], ISTJ: ["ESFP", "ESTP"], ESTJ: ["INTP", "ISFP", "ISTP"] };
  function mbtiScore(x, y) {
    if (!x || !y) return null;
    if ((MBTI_BEST[x] || []).includes(y) || (MBTI_BEST[y] || []).includes(x)) return 96;
    let s = 62;
    s += x[1] === y[1] ? 12 : -10;          // N/S: 대화 주제가 통하는지
    s += x[0] !== y[0] ? 5 : 2;             // E/I: 서로 다르면 균형
    s += x[2] === y[2] ? 4 : -2;            // T/F: 말투 온도
    s += x[3] !== y[3] ? 3 : 1;             // J/P
    if (x === y) s = 74;                    // 같은 유형: 편하지만 새로움은 적다
    return Math.max(35, Math.min(92, s));
  }
  // 방 전체 유형: 글자마다 다수결, 동점이면 X
  function roomType(types) {
    const ts = types.filter(Boolean);
    if (!ts.length) return null;
    return [["E", "I"], ["N", "S"], ["T", "F"], ["J", "P"]].map(([a, b], i) => {
      const na = ts.filter((t) => t[i] === a).length, nb = ts.length - na;
      return na > nb ? a : nb > na ? b : "X";
    }).join("");
  }

  // ---------- 예시 단톡방 (가상의 다섯 친구) ----------
  function makeGroupSample() {
    let seed = 11;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const pick = (a) => a[Math.floor(rnd() * a.length)];
    const W = { 민수: 0.42, 지은: 0.2, 현우: 0.18, 소라: 0.18, 태오: 0.02 };
    const say = {
      민수: ["ㅋㅋㅋㅋㅋㅋㅋㅋㅋ 미쳤다", "아 개웃기네 ㅋㅋㅋㅋ", "이거 봐봐 ㅋㅋㅋㅋㅋㅋ", "사진", "ㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋ", "나 오늘 진짜 레전드 있었음", "이모티콘", "아니 근데 ㅋㅋㅋㅋ"],
      지은: ["ㅋㅋㅋㅋ 민수 또 시작", "헐 진짜?", "아 그거 나도 봤어 ㅋㅋ", "사진", "이모티콘", "맞아 맞아", "그래서 어떻게 됐는데"],
      현우: ["ㅇㅇ", "ㅇㅇ", "ㅇㅋ", "웅", "근데 다들 노후 준비는 하고 있어?", "요즘 금리 생각하면 좀 무섭더라", "ㅇㅇ 그래"],
      소라: ["이번 주말 시간 되는 사람?", "다들 몇 시에 끝나?", "어디서 볼까?", "그 집 예약 돼?", "누가 회비 정리 좀 해줄 수 있어?", "이모티콘", "좋아 그럼 7시?"],
      태오: ["ㅋㅋ"],
    };
    const names = Object.keys(W);
    const who = () => { let r = rnd(), acc = 0; for (const n of names) { acc += W[n]; if (r < acc) return n; } return "민수"; };
    const lines = ["대학 동기방 5 님과 카카오톡 대화", "저장한 날짜 : 2026-11-12 23:10:44", ""];
    const fmt = (d) => { const h = d.getHours(); return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 ${h < 12 ? "오전" : "오후"} ${h % 12 || 12}:${String(d.getMinutes()).padStart(2, "0")}`; };
    const push = (d, n, t) => lines.push(`${fmt(d)}, ${n} : ${t}`);
    for (let day = 0; day < 40; day++) {
      if (rnd() < 0.15) continue;
      const base = new Date(2026, 9, 3 + day);
      const sessions = 1 + Math.floor(rnd() * 2);
      let t = new Date(base.getTime() + (11 + rnd() * 4) * 3600e3);
      for (let s = 0; s < sessions; s++) {
        const n = 8 + Math.floor(rnd() * 25);
        let last = null;
        for (let i = 0; i < n; i++) {
          let w = who(); if (w === "태오") w = "민수";
          if (last === "민수" && rnd() < 0.4) w = "지은"; // 민수 말엔 지은이 바로 받는다
          push(t, w, pick(say[w]));
          t = new Date(t.getTime() + (0.3 + rnd() * 4) * 60e3); last = w;
        }
        if (rnd() < 0.35) { push(t, "현우", "근데 다들 노후 준비는 하고 있어?"); t = new Date(t.getTime() + (4 + rnd() * 2) * 3600e3); }
        else t = new Date(t.getTime() + (6.5 + rnd() * 2) * 3600e3);
        if (t.getDate() !== base.getDate()) break;
      }
      if (rnd() < 0.25) push(new Date(base.getTime() + (26 + rnd() * 2) * 3600e3), "현우", "자니… 나만 안 자나");
      if (day === 2) push(new Date(base.getTime() + 21 * 3600e3), "태오", "ㅋㅋㅋ 나도 갈래");
      if (day === 6) { const q = new Date(base.getTime() + 16 * 3600e3); push(q, "소라", "회비 3만 원씩 보낸 사람 손?"); }
      if (day === 33) push(new Date(base.getTime() + 20.5 * 3600e3), "태오", "헐 다들 잘 지냄? 나 폰 바꿨어");
      if (day === 18) {
        let mt = new Date(base.getTime() + 22.5 * 3600e3);
        ["아니", "얘들아", "나 방금", "편의점에서", "전 여친 만남", "근데", "걔가 먼저 인사함", "ㅋㅋㅋㅋㅋㅋㅋ", "나 어떡해"].forEach((x) => { push(mt, "민수", x); mt = new Date(mt.getTime() + 25e3); });
      }
    }
    return lines.join("\n");
  }

  // ---------- 예시 대화 (가상의 두 사람) ----------
  function makeSample() {
    let seed = 7;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const pick = (a) => a[Math.floor(rnd() * a.length)];
    const A = "지민", B = "도윤";
    const openA = ["뭐해?", "점심 뭐 먹었어?", "오늘 날씨 미쳤다 ㅋㅋㅋ", "퇴근했어?", "이거 봐봐 ㅋㅋㅋㅋ", "갑자기 떡볶이 땡겨"];
    const openB = ["일어났어?", "오늘 몇 시에 끝나?", "주말에 시간 돼?", "아까 말한 카페 예약했어"];
    const replyA = ["ㅋㅋㅋㅋㅋ 진짜?", "헐 대박", "나도 그 생각했는데 ㅋㅋ", "고마워 ㅠㅠ", "아 너무 귀엽다", "그냥 아무거나 좋아", "이모티콘", "만약에 우리 여행 가면 어디 갈래?", "왠지 오늘 좋은 일 생길 느낌", "사진", "웅웅", "보고싶다 ㅎㅎ"];
    const replyB = ["ㅋㅋ 그러게", "그래서 몇 시에 볼까?", "근데 거기 주차 돼?", "7시 어때", "정리해서 보내줄게", "ㅎㅎ 좋아", "맞아", "오늘 일정 끝나고 연락할게", "사진", "잘 자", "내일 확인해볼게", "이모티콘"];
    const lines = ["지민 님과 카카오톡 대화", "저장한 날짜 : 2026-11-10 23:41:02", ""];
    const fmt = (d) => {
      const h = d.getHours(), ap = h < 12 ? "오전" : "오후", hh = h % 12 || 12;
      return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 ${ap} ${hh}:${String(d.getMinutes()).padStart(2, "0")}`;
    };
    const rally = ["아 잠깐 지금 하늘 봐", "왜왜", "무지개 떴어!!", "헐 어디?", "창문 열어봐 동쪽", "오 진짜다", "사진", "와 대박", "소원 빌어 빨리", "빌었어 ㅋㅋ", "뭐 빌었는데", "비밀인데", "말해줘", "나중에 만나서", "ㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋ 궁금하게 만드네", "그게 포인트지", "치사해", "토요일에 알려줄게", "토요일 몇 시?", "2시 어때", "좋아 그럼 성수에서 보자", "콜", "기대된다 ㅎㅎ", "나도"];
    for (let day = 0; day < 34; day++) {
      if (day >= 17 && day <= 20) continue; // 나흘 동안 조용했던 때
      if (rnd() < 0.12) continue;
      const base = new Date(2026, 9, 7 + day);
      lines.push(`${base.getFullYear()}년 ${base.getMonth() + 1}월 ${base.getDate()}일 ${"일월화수목금토"[base.getDay()]}요일`);
      const sessions = 1 + Math.floor(rnd() * 3);
      let t = new Date(base.getTime() + (9 + rnd() * 3) * 3600e3);
      for (let s = 0; s < sessions; s++) {
        let who = rnd() < 0.64 ? A : B;
        const n = 6 + Math.floor(rnd() * 22);
        for (let i = 0; i < n; i++) {
          const first = i === 0;
          const txt = first ? pick(who === A ? openA : openB) : pick(who === A ? replyA : replyB);
          lines.push(`${fmt(t)}, ${who} : ${txt}`);
          const burst = who === A ? 0.45 : 0.2;
          if (rnd() > burst) {
            who = who === A ? B : A;
            t = new Date(t.getTime() + (who === A ? 0.5 + rnd() * 3 : 1 + rnd() * 14) * 60e3);
          } else t = new Date(t.getTime() + 20e3);
        }
        t = new Date(t.getTime() + (6.2 + rnd() * 3) * 3600e3);
        if (t.getDate() !== base.getDate()) break;
      }
      if (day === 21) lines.push(`${fmt(new Date(base.getTime() + 8.5 * 3600e3))}, ${B} : 미안 요즘 회사 일 때문에 정신이 하나도 없었어 ㅠㅠ 연락 못 한 거 계속 마음에 걸렸는데 막상 하려니까 너무 늦은 것 같아서 더 못 했어. 주말에 맛있는 거 사줄게 진짜로`);
      if (day === 13) {
        let mt = new Date(base.getTime() + 13.1 * 3600e3);
        ["야", "야야", "도윤아", "뭐해", "나 지금 엄청 웃긴 거 봤는데", "아 말해주고 싶다", "언제 봐", "자니?", "설마 자?", "점심시간인데 자는 거 아니지", "ㅋㅋㅋㅋ 혼잣말 중", "답장 기다리는 중", "이모티콘"].forEach((txt) => { lines.push(`${fmt(mt)}, ${A} : ${txt}`); mt = new Date(mt.getTime() + 50e3); });
        mt = new Date(mt.getTime() + 3.4 * 3600e3);
        lines.push(`${fmt(mt)}, ${B} : 아 미안 회의였어 ㅠㅠ 뭔데`);
      }
      if (day === 24) {
        lines.push(`${fmt(new Date(base.getTime() + 15 * 3600e3))}, ${A} : 오늘 저녁 뭐 먹을까?`);
        lines.push(`${fmt(new Date(base.getTime() + 20.6 * 3600e3))}, ${B} : 치킨 ㄱㄱ`);
        lines.push(`${fmt(new Date(base.getTime() + 20.7 * 3600e3))}, ${A} : 이미 먹었어 ㅋㅋㅋㅋㅋ 5시간 반 걸렸네`);
        lines.push(`${fmt(new Date(base.getTime() + 27.2 * 3600e3))}, ${A} : 새벽에 갑자기 드는 생각인데 우리 처음 만났을 때 너 진짜 말 없었던 거 알아?`);
      }
      if (day === 9) {
        let rt = new Date(base.getTime() + 21.2 * 3600e3);
        rally.forEach((txt, k) => { lines.push(`${fmt(rt)}, ${k % 2 ? B : A} : ${txt}`); rt = new Date(rt.getTime() + 35e3); });
      }
      if (day !== 16 && rnd() < 0.3) lines.push(`${fmt(new Date(base.getTime() + (24 + 1 + rnd() * 1.5) * 3600e3))}, ${A} : 아직 안 자? ㅎㅎ`);
    }
    return lines.join("\n");
  }

  return { parse, analyze, moments, funStats, groupStats, makeGroupSample, MBTI_TYPES, mbtiScore, roomType, speakers, estimateType, compat, makeSample, kindOf };
});
