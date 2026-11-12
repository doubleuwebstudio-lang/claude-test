# 우리 대화 성분표: 배포와 검증 안내

정적 사이트입니다. 서버도, 데이터베이스도 없습니다. 아래 순서대로 하면 30분 안에 공개 주소가 생깁니다.

## 1. 미리 만들 계정 2개 (무료)

| 용도 | 서비스 | 할 일 |
|---|---|---|
| 방문·버튼 통계 | [GoatCounter](https://www.goatcounter.com) | 가입하고 사이트 코드를 정하면 `https://코드.goatcounter.com/count` 주소가 생깁니다. 상업적 이용 조건은 가입할 때 확인하세요. |
| 사전 예약 폼 | [Tally](https://tally.so) 또는 구글 폼 | 질문은 "알림 받을 연락처(이메일)" 하나면 충분합니다. Tally라면 숨은 필드(hidden field) `product`를 추가하세요. 어떤 상품 버튼으로 들어왔는지 자동으로 채워집니다. |

## 2. 설정 채우기

`chat-label/config.js`
```js
goatcounter: "https://코드.goatcounter.com/count",
preorderUrl: "https://tally.so/r/폼주소",
siteUrl: "https://배포주소",   // 3번에서 주소가 생긴 뒤 채우고 다시 배포
```

`chat-label/privacy.html` 맨 아래의 **운영자와 연락처**를 채웁니다.

`node chat-label/build.mjs`를 돌리면 빠진 설정을 경고로 알려 줍니다.

## 3. Vercel 배포

1. [vercel.com](https://vercel.com)에 GitHub로 로그인합니다.
2. **Add New → Project**에서 이 저장소를 가져옵니다(Import).
3. **Root Directory**를 `chat-label`로 바꿉니다. 빌드 설정은 `vercel.json`에 들어 있어서 건드릴 필요가 없습니다.
4. **Deploy**를 누릅니다.

> 지금 작업은 `claude/charming-lamport-j1ni95` 브랜치에 있습니다. Vercel은 기본(main) 브랜치를 정식 주소로 씁니다. PR을 만들어 main에 합치거나, Vercel 프로젝트 설정에서 Production Branch를 이 브랜치로 바꾸세요.

배포 주소가 나오면 `siteUrl`에 넣고 한 번 더 배포합니다. 그래야 카톡·인스타에서 링크 미리보기 이미지(`og.png`)가 뜹니다.

## 4. 출시 전 확인

- [ ] 휴대폰으로 실제 카톡 대화 파일 올려 보기 (안드로이드·아이폰 각각)
- [ ] 공유 카드 저장 버튼이 휴대폰에서 공유 창을 여는지
- [ ] 카톡으로 주소를 보냈을 때 미리보기 이미지가 뜨는지
- [ ] 사전 예약 버튼이 폼을 열고, 폼에 product 값이 들어오는지
- [ ] GoatCounter 대시보드에 `event/...` 기록이 쌓이는지

## 5. 숫자 보는 법 (GoatCounter)

통계에는 대화 내용, 이름, 생일이 들어가지 않습니다. 이벤트 이름만 기록됩니다.

| 지표 | 계산 | 계속 | 방향 전환 |
|---|---|---|---|
| 업로드율 | `event/upload/*` ÷ 방문자 | 20% 이상 | 10% 미만 |
| 공유율 | `event/card-save/*` ÷ 업로드 | 10% 이상 | 3% 미만 |
| 유료 관심 | `event/preorder/*` ÷ 업로드 | 5% 이상 | 2% 미만 |
| 사전 예약 | 폼 제출 수 ÷ 업로드 | 1% 이상 | 0.3% 미만 |

그 밖의 이벤트:
- `event/upload-fail/형식`: 파일을 못 읽은 경우. 이 숫자가 높으면 카톡 형식이 바뀐 것입니다.
- `event/card-view/종류`: 어떤 카드를 눌러 봤는지 알 수 있습니다. 많이 보는 카드를 키우세요.
- `event/sample`, `event/saju`, `event/quote-on`: 예시 보기, 사주 입력, 메시지 넣기를 켠 횟수입니다.

## 6. 돈을 받기 전에

사전 예약은 돈을 받지 않으니 바로 시작할 수 있습니다. 실제 결제를 붙이려면 아래 세 가지가 필요합니다.
1. 사업자등록 (홈택스, 간이과세자 가능)
2. 통신판매업 신고 (정부24)
3. 결제대행 가입 (토스페이먼츠 등)

결제가 붙으면 사이트 아래에 사업자 정보와 환불 정책도 표시해야 합니다.
