#!/bin/bash
# Cursor 룰 심볼릭 링크 설정 스크립트
# 사용법: ./scripts/setup-cursor.sh /path/to/your/project
# 먼저 ./scripts/build-cursor.sh 를 실행하여 .mdc 파일을 생성해야 합니다.

set -e

if [ -z "$1" ]; then
  echo "사용법: ./setup-cursor.sh <프로젝트 경로>"
  echo "예시:  ./setup-cursor.sh ~/my-project"
  exit 1
fi

PROJECT_DIR="$1"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
CURSOR_RULES_DIR="$PROJECT_DIR/.cursor/rules"

mkdir -p "$CURSOR_RULES_DIR"

ROOT_DIR="$(dirname "$SCRIPT_DIR")"
DIST_CURSOR_DIR="$ROOT_DIR/dist/cursor"

if [ ! -d "$DIST_CURSOR_DIR" ]; then
  echo "dist/cursor/ 가 없습니다. 먼저 ./scripts/build-cursor.sh 를 실행하세요."
  exit 1
fi

for mdc_file in "$DIST_CURSOR_DIR"/*.mdc; do
  filename=$(basename "$mdc_file")
  target="$CURSOR_RULES_DIR/$filename"

  if [ -L "$target" ]; then
    echo "  이미 링크됨: $filename"
  elif [ -f "$target" ]; then
    echo "  건너뜀 (파일 존재): $filename"
  else
    ln -s "$mdc_file" "$target"
    echo "  링크 생성: $filename"
  fi
done

echo ""
echo "완료! $CURSOR_RULES_DIR 에 스킬 룰이 연결되었습니다."
