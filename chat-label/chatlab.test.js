// node --test chat-label/
const test = require("node:test");
const assert = require("node:assert");
const L = require("./chatlab.js");

test("안드로이드 형식과 여러 줄 메시지", () => {
  const r = L.parse("﻿홍길동 님과 카카오톡 대화\n저장한 날짜 : 2024-01-15 14:30:22\n\n2024년 1월 1일 월요일\n2024년 1월 1일 오후 3:15, 홍길동 : 안녕\n둘째 줄\n2024년 1월 1일 오전 12:05, 김철수 : 사진\n2024년 1월 1일 오후 3:20, 김철수님이 들어왔습니다.");
  assert.equal(r.format, "mobile");
  assert.equal(r.title, "홍길동");
  assert.equal(r.messages.length, 2);
  assert.equal(r.messages[0].kind, "photo");
  assert.equal(new Date(r.messages[0].t).getHours(), 0);
  assert.equal(r.messages[1].text, "안녕\n둘째 줄");
  assert.equal(new Date(r.messages[1].t).getHours(), 15);
});

test("iOS 형식", () => {
  const r = L.parse("2024. 3. 9. 오후 12:01, A : 점심 뭐 먹지?\n2024. 3. 9. 오후 12:03, B : 이모티콘");
  assert.equal(r.messages.length, 2);
  assert.equal(new Date(r.messages[0].t).getHours(), 12);
  assert.equal(r.messages[1].kind, "emoticon");
});

test("PC 형식", () => {
  const r = L.parse("A 님과 카카오톡 대화\n저장한 날짜 : 2024-01-15 14:30:22\n\n--------------- 2024년 1월 2일 화요일 ---------------\n[A] [오후 11:50] 잘 자\n[B] [오후 11:58] 굿모닝\n이어지는 줄");
  assert.equal(r.format, "pc");
  assert.equal(r.messages.length, 2);
  assert.equal(r.messages[1].text, "굿모닝\n이어지는 줄");
});

test("맥 CSV 형식", () => {
  const r = L.parse('Date,User,Message\n2024-01-01 15:15:00,"A","안녕, 반가워"\n2024-01-01 15:16:00,"B","줄\n바꿈"');
  assert.equal(r.format, "mac-csv");
  assert.equal(r.messages[0].text, "안녕, 반가워");
  assert.equal(r.messages[1].text, "줄\n바꿈");
});

test("예시 대화 분석", () => {
  const r = L.parse(L.makeSample());
  const sp = L.speakers(r.messages);
  assert.deepEqual(sp.map((s) => s.name).sort(), ["도윤", "지민"]);
  const a = L.analyze(r.messages, sp[0].name, sp[1].name);
  assert.ok(a.compat.score >= 52 && a.compat.score <= 99);
  assert.match(a.people[0].type.letters, /^[EI][NS][FT][JP]$/);
  const ji = a.people.find((p) => p.name === "지민"), do_ = a.people.find((p) => p.name === "도윤");
  assert.ok(ji.replyMedian < do_.replyMedian, "지민이 더 빨리 답한다");
  console.log(a.total, a.compat, ji.type.letters, do_.type.letters, ji.replyMedian, do_.replyMedian, ji.initShare.toFixed(2));
});

test("명장면: 랠리, 냉전, 첫 순간", () => {
  const r = L.parse(L.makeSample());
  const m = L.moments(r.messages, "지민", "도윤");
  assert.ok(m.rally.turns >= 20, "무지개 랠리를 찾는다");
  assert.equal(m.cold.length >= 1, true);
  const c = m.cold.find((x) => x.ms >= 4 * 864e5);
  assert.ok(c, "나흘 넘는 냉전");
  assert.equal(m.msgs[c.to].name, "도윤");
  assert.ok(m.laugh.len >= 27);
  assert.deepEqual(m.firsts.map((f) => f.key).slice(0, 1), ["first"]);
  assert.ok(m.firsts.some((f) => f.key === "miss"));
  assert.equal(m.days.reduce((s, d) => s + d.n, 0), m.msgs.length);
  console.log(m.rally.turns, m.cold.map((x) => Math.round(x.ms / 36e5)), m.hottest.n, m.firsts.map((f) => f.label).join(","), Math.round(m.waited["지민"] / 6e4), Math.round(m.waited["도윤"] / 6e4));
});

const S = require("./saju.js");
test("사주: 일주와 띠", () => {
  assert.equal(S.chart("2000-01-01").day.name, "무오");       // 2000-01-01은 무오일
  assert.equal(S.chart("2000-01-01").animal, "토끼");          // 입춘 전이라 1999년 기묘
  assert.equal(S.chart("2000-02-10").animal, "용");
  assert.equal(S.chart("2027-03-01").year.name, "정미");
  assert.equal(S.chart("2023-02-30"), null);
  const m = S.match(S.chart("1998-05-12"), S.chart("1997-11-03"), "지민", "도윤");
  assert.ok(m.score >= 40 && m.score <= 98 && m.parts.length >= 2);
  console.log(S.chart("1998-05-12").day.name, S.chart("1997-11-03").day.name, m.score, m.parts.map((p) => p.label));
});

test("웃음 포인트: 독백, 읽씹, 단답", () => {
  const r = L.parse(L.makeSample());
  const f = L.funStats(r.messages, "지민", "도윤");
  const ji = f.people["지민"], dy = f.people["도윤"];
  assert.ok(ji.mono.n >= 13, "지민의 13연속 독백");
  assert.ok(dy.ignored.ms >= 5 * 3600e3, "도윤이 '뭐 먹을까?'에 5시간 넘게");
  assert.match(dy.ignored.q.text, /\?/);
  assert.ok(ji.kk > 50 && ji.short && ji.short.w);
  assert.ok(f.foodShare > 0);
  console.log(ji.mono.n, Math.round(dy.ignored.ms / 6e4), ji.short, dy.phrase, ji.late, f.foodShare.toFixed(2));
});
