#!/bin/bash
# 스펙 파일 편집 후 자동 체크

FILE=$1

if [[ "$FILE" == *.md ]]; then
  echo ""
  echo "📋 스펙 자동 체크"
  echo "---"

  if ! grep -qiE "왜|이유|목적|because|reason" "$FILE"; then
    echo "⚠️  Why가 없을 수 있어요 — 이유/목적이 명시됐는지 확인해 주세요"
  fi

  VAGUE=$(grep -nE "적절히|필요시|경우에 따라|어느 정도|가능하면" "$FILE")
  if [ -n "$VAGUE" ]; then
    echo "⚠️  모호한 표현 발견:"
    echo "$VAGUE"
  fi

  echo "---"
  echo "전체 검토가 필요하면 /spec-review 를 실행해 주세요."
  echo ""
fi
