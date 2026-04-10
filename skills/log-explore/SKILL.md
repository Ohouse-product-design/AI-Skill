---
name: log-explore
description: >
  오늘의집 로그 체계를 탐색하고 이해하는 팀 공용 스킬. "어떤 로그가 있는지 모르겠을 때"
  사용. "로그 어떻게 봐", "이 화면 로그 뭐 있어", "page_id 뭐야", "enum 값 알려줘",
  "log-explore", "이 기능 관련 로그 찾아줘" 같은 표현에 반응. 페이지 로그 전체 탐색,
  enum 탐색, 기능 키워드로 연관 로그 찾기, 로그센터 URL 분석을 처리. 도메인별 page_id
  매핑(커머스/콘텐츠/o2o/공통) 가이드를 내장. funnel-check 스킬의 page_id 매핑 의존
  소스. 의존: log center mcp.
---

# 로그 탐색기

오늘의집 로그 체계를 탐색하고 이해하는 skill입니다. "어떤 로그가 있는지 모르겠을 때" 사용합니다.

## 입력
$ARGUMENTS (탐색하고 싶은 주제, 화면명, 기능, 또는 enum명)

## 워크플로우

### Case 1: "이 화면에 어떤 로그가 있어?" → 페이지 로그 전체 탐색
1. 사용자 입력에서 page_id 추정
2. `get_page_spec`으로 해당 페이지의 모든 로그 명세 조회
3. action/category 기준으로 그룹핑하여 요약:

```
## [page_id] 로그 전체 목록

### PAGEVIEW (페이지 진입)
- spec #{id}: {설명}

### CLICK (클릭 이벤트)
- spec #{id}: {설명} — 주요 object: {object_type}
- spec #{id}: {설명}

### IMPRESSION (노출)
- spec #{id}: {설명}

### 기타
- spec #{id}: {category} - {설명}
```

### Case 2: "이 enum 값이 뭐야?" → enum 탐색
1. `get_enum`으로 해당 enum 조회
2. 값 목록을 표로 정리

### Case 3: "이 기능 관련 로그를 찾고 싶어" → 연관 페이지 탐색
1. 기능 키워드로 관련 page_id 후보 목록 제시 (아래 도메인 매핑 참고)
2. 사용자가 선택하면 해당 page_id의 로그 명세 조회
3. 여러 페이지에 걸친 기능이면 관련 page_id들을 모두 안내

### Case 4: "로그센터 URL 보고 설명해줘" → URL 기반 탐색
1. `get_log_spec_from_url`로 조회
2. 명세 + 커뮤니케이션 이력(`get_log_spec_communications`)도 함께 조회하여 맥락 제공

## 도메인별 주요 page_id 가이드

### 커머스 (쇼핑)
- 쇼핑홈: SHOPPINGHOME
- 상품 상세: PDP (+ PDP_STYLINGSHOT, PDP_INQUIRY 등 하위)
- 장바구니: CART
- 주문 플로우: ORDER_CHECKOUT → ORDER_PAYMENT → ORDER_RESULT
- 주문 상세: ORDER_DETAIL
- 클레임: ORDER_CANCEL*, ORDER_RETURN*, ORDER_EXCHANGE*
- 검색: SRP_PRE_STORE, SRP_STORE
- 카테고리: CATEGORY
- 브랜드: BRAND_DETAIL, BRANDPAGE_DETAIL, BRANDHOME_DETAIL
- 베스트: BEST
- 리뷰: REVIEW_PDP, REVIEW_WRITE, REVIEW_DETAIL

### 콘텐츠 (커뮤니티)
- 집들이: CDP_PROJECT, CLP_PROJECT
- 노하우: CDP_ADVICE, CLP_ADVICE
- 사진(카드): CDP_CARD, CDP_CARD_COLLECTION
- 질문/상담: CDP_QUESTION, CLP_QUESTION
- 꿀템발견: CDP_POST, CLP_PRODUCT
- 업로드: UPLOAD_PROJECT, UPLOAD_ADVICE, UPLOAD_CARD_COLLECTION

### 시공 (O2O)
- 시공 메인: O2O_MAIN
- 업체 찾기: RMD_DISCOVERY_HOME, RMD_DISCOVERY_BIZ
- 간편상담: RMD_EASYAPPLY_*
- 시공 리뷰: RMD_REVIEW_*
- 사장님센터: RMD_PARTNER_CENTER_*
- 이사: MOV_*
- 설치: FIX_*

### 공통
- 공통홈: HOME
- 마이페이지: MYPAGE
- 검색(통합): SRP_PRE_INTEGRATED, SRP_INTEGRATED
- 로그인/가입: SIGN_IN, SIGN_UP_*
- 알림: NOTIFICATIONS
- 설정: SETTINGS
- 푸시: PUSH
- 딥링크: DEEPLINK

## enum 종류 참고
- `page_id`: 화면 식별자
- `action`: 사용자 행동 유형 (v2) — CLICK, IMPRESSION, PAGEVIEW 등
- `category`: 사용자 행동 유형 (v1) — CLICK, IMPRESSION, PAGEVIEW 등
- `intent`: 사용자 행동 의도 (v2)
- `object_section_id`: 모듈 ID
- `object_type`: 객체 타입
- `object_id`: 객체 ID
