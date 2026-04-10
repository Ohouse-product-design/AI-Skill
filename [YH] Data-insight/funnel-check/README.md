# [YH] funnel-check (WIP)

> Yohan이 active development 중인 funnel-check 스킬의 작업 사본. 안정화 후 [`../../skills/funnel-check/`](../../skills/funnel-check/)로 promotion 됨.

## 이 폴더의 역할

이 폴더는 yohan의 개인 작업 namespace야. 새로운 mode 추가, 워크플로우 개선, 실험적 변경 같은 것들이 여기서 먼저 일어나고, 검증되면 `skills/funnel-check/`로 옮겨져.

**동료에게 권장하는 설치 위치:** [`skills/funnel-check/`](../../skills/funnel-check/) — 안정화된 버전.
이 [YH] 폴더는 동료가 직접 설치하지 않는 게 좋아 (변경이 잦고 검증 안 됨).

## 현재 작업 중

**v1.2** — audit mode 추가. 화면 단면 element 사용도 분석 + ANDROID/IOS 분리 + page health metric + 인터랙티브 Figma mapper.

## 다음 작업 후보

- v1.3 — 실제 화면(HOME, PDP) end-to-end 테스트 후 막힌 지점 보완
- v2 — 세그먼트 지원 (BA팀 표준 마트 협의 필요)
- v2 — Figma MCP 자동 좌표 매핑

## 연관 문서

- 설계 의도/결정 로그/로드맵: [funnel-check-spec.md](https://github.com/Ohouse-product-design/AI-Workflow/blob/main/%5BYH%5D%20Data-insight/funnel-check-spec.md) (AI-Workflow 레포)
- 스킬군 큰 그림: [data-insight-roadmap.md](https://github.com/Ohouse-product-design/AI-Workflow/blob/main/%5BYH%5D%20Data-insight/data-insight-roadmap.md) (AI-Workflow 레포)
- 안정 버전: [skills/funnel-check/README.md](../../skills/funnel-check/README.md)

## promotion 절차 (yohan 본인용 메모)

1. 이 폴더의 SKILL.md를 충분히 검증
2. `cp [YH]\ Data-insight/funnel-check/SKILL.md skills/funnel-check/SKILL.md`
3. 변경 슬립을 funnel-check-spec.md 변경 이력에 추가
4. `git commit -m "promote: funnel-check vX.X to skills/"`
5. push
