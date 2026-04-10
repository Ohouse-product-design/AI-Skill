---
name: log-query
description: >
  오늘의집 로그 명세 기반으로 정확한 Athena 쿼리를 생성하고 실행하는 팀 공용 스킬.
  "athena 쿼리 만들어줘", "이 로그 쿼리 짜줘", "log-query", "쿼리 실행해줘",
  "로그 데이터 뽑아줘" 같은 표현에 반응. log.analyst_log_table 기준 표준 쿼리 패턴
  (date 파티션 필수, user_id > 0, platform IN ('IOS','ANDROID') 필터, enum 대문자)을
  강제하며 사용자 승인 후 execute_athena_query로 실행. funnel-check 스킬의 쿼리
  작성 규칙 의존 소스. 의존: athena mcp + log center mcp.
---

# 로그 기반 Athena 쿼리 생성 및 실행

로그센터 명세를 기반으로 정확한 Athena 쿼리를 생성하고 실행하는 skill입니다.

## 입력
$ARGUMENTS (spec_id, page_id, 또는 자연어 질문)

## 워크플로우

### Step 1: 로그 명세 확보
- spec_id가 주어지면 → `get_log_spec_by_id`로 명세 조회
- page_id가 주어지면 → `get_page_spec`으로 해당 페이지의 모든 로그 명세 조회
- 자연어 질문이면 → 질문에서 page_id를 추정하고, `get_page_spec`으로 조회 후 관련 명세 필터링

### Step 2: 명세 분석
조회된 명세에서 다음을 추출:
1. **테이블명**: 로그 스키마 버전에 따라 적절한 테이블 선택
2. **필수 필터 조건**: constraint_dsl에서 WHERE 절 조건 추출
3. **주요 필드**: json_preview에서 SELECT할 컬럼 확인
4. **파티션 키**: dt (날짜) 파티션은 반드시 포함

### Step 3: Athena 쿼리 생성

**기본 테이블**: `log.analyst_log_table`

**기본 필드 구조:**
| 구분 | 필드 | 설명 |
|------|------|------|
| 시간 | `date` | 이벤트 발생일 (파티션 키) |
| 시간 | `server_access_time` | 이벤트 발생 시각 |
| 유저 | `user_id` | 회원ID |
| 유저 | `platform` | IOS, ANDROID |
| 이벤트 | `page_id` | 화면 식별자 (대문자) |
| 이벤트 | `page_params` | 화면 부가 정보 |
| 이벤트 | `category` | 이벤트 유형 (PAGEVIEW, IMPRESSION, CLICK, SCRAP, LIKE 등) |
| 이벤트 | `object_section_id` | 모듈/컴포넌트 ID |
| 이벤트 | `object_type` | 객체 타입 (PRODUCTION, PROJECT 등) |
| 이벤트 | `object_id` | 객체 식별자 (DB ID값) |

**샘플 쿼리 (raw 조회):**
```sql
-- [로그 설명] 조회 쿼리 (spec_id: {spec_id})
SELECT date, server_access_time, user_id, platform,
       page_id, category, object_section_id, object_type, object_id
  FROM log.analyst_log_table
 WHERE date >= '{시작일}' AND date <= '{종료일}'
   AND page_id = '{페이지}'
   AND category IN ({로그명세_조건})
   AND user_id > 0
   AND platform IN ('IOS', 'ANDROID')
 LIMIT 100
;
```

**집계 쿼리 패턴:**
```sql
SELECT date
     , COUNT(DISTINCT CASE WHEN category = 'PAGEVIEW' THEN user_id END) AS uv_pageview
     , COUNT(DISTINCT CASE WHEN category = 'CLICK' AND object_section_id = '{모듈}' THEN user_id END) AS uv_click_{모듈}
  FROM log.analyst_log_table
 WHERE date BETWEEN '{시작일}' AND '{종료일}'
   AND page_id = '{페이지}'
   AND user_id > 0
   AND platform IN ('IOS', 'ANDROID')
 GROUP BY 1
 ORDER BY 1
;
```

**쿼리 작성 규칙:**
- `date` 파티션 필터는 **반드시** 포함 (비용 절감)
- 기본 조회 기간: 최근 7일 (사용자가 지정하지 않은 경우)
- 비회원 제외: `user_id > 0`
- 앱 한정: `platform IN ('IOS', 'ANDROID')`
- 첫 조회는 LIMIT 100으로 데이터 형태 확인
- 집계 쿼리가 필요하면 사용자에게 확인 후 실행
- category, page_id, object_type 등 enum 값은 **대문자**로 작성

### Step 4: 쿼리 실행 및 결과 설명
- `execute_athena_query`로 실행
- 결과를 사용자가 이해하기 쉽게 요약
- 스캔 데이터량, 비용 예측도 함께 안내

### Step 5: 후속 질문 유도
- "기간을 변경하시겠어요?"
- "특정 조건을 추가하시겠어요? (예: 특정 user_id, platform 등)"
- "집계(일별 추이, 유저수 등)가 필요하시면 말씀해주세요"

## 주의사항
- 로그 명세에 없는 필드를 임의로 추가하지 않기
- constraint_dsl의 조건을 빠뜨리지 않기 (이것이 정확한 데이터의 핵심)
- 대량 스캔이 예상되면 사용자에게 먼저 확인
