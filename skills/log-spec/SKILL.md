---
name: log-spec
description: >
  사용자가 특정 화면이나 기능의 로그 명세를 알고 싶을 때, 로그센터 MCP를 활용하여
  정확한 명세를 찾아주는 팀 공용 스킬. "이 로그 spec 찾아줘", "page spec 알려줘",
  "log-spec", "로그 명세 보여줘", "constraint_dsl 뭐야" 같은 표현에 반응.
  로그센터 URL, spec_id, page_id, 한글 화면명 모두 입력 가능. constraint_dsl과
  json_preview를 자연어로 요약. funnel-check 스킬의 명세 교차검증 의존 소스.
  의존: log center mcp.
---

# 로그 명세 조회

사용자가 특정 화면이나 기능의 로그를 알고 싶을 때, 로그센터 MCP를 활용하여 정확한 로그 명세를 찾아주는 skill입니다.

## 입력
$ARGUMENTS (page_id, 로그센터 URL, 또는 화면/기능 설명)

## 워크플로우

### Step 1: 입력 유형 판별
- **로그센터 URL**이면 → `get_log_spec_from_url`로 바로 조회
- **spec_id 숫자**이면 → `get_log_spec_by_id`로 바로 조회
- **page_id** (예: PDP, HOME, CART)이면 → `get_page_spec`으로 조회
- **한글 설명** (예: "상품 상세", "장바구니")이면 → 아래 매핑표를 참고하여 적절한 page_id를 추정한 뒤 `get_page_spec`으로 조회. 확실하지 않으면 후보 2~3개를 사용자에게 제시

### Step 2: 로그 명세 요약
조회된 로그 명세를 아래 포맷으로 정리:

```
## [page_id] 로그 명세 요약

| spec_id | action/category | 설명 | 주요 필드 |
|---------|----------------|------|----------|
| 123     | CLICK          | 상품 클릭 | object_id, object_type |
```

- constraint_dsl이 있으면 핵심 조건을 자연어로 요약
- json_preview가 있으면 Athena 쿼리에 필요한 필드명을 명시

### Step 3: 후속 안내
- "이 로그를 Athena로 조회하려면 `/log-query [spec_id]`를 사용하세요" 안내
- 관련 enum 값이 궁금하면 `get_enum`으로 추가 조회 가능함을 안내

## 자주 쓰는 page_id 매핑 (참고용)
- 상품 상세 → PDP
- 쇼핑홈 → SHOPPINGHOME
- 공통홈 → HOME
- 장바구니 → CART
- 주문서 → ORDER_CHECKOUT
- 주문완료 → ORDER_RESULT
- 검색 결과(쇼핑) → SRP_STORE
- 검색 대기(쇼핑) → SRP_PRE_STORE
- 집들이 상세 → CDP_PROJECT
- 노하우 상세 → CDP_ADVICE
- 리뷰 → REVIEW_PDP
- 마이페이지 → MYPAGE
- 카테고리 → CATEGORY
- 브랜드홈 → BRAND_DETAIL
- 시공 업체 → RMD_DISCOVERY_HOME
- 이벤트 → CDP_COMPETITION
