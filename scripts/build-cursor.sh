#!/bin/bash
# SKILL.md + cursor.yaml → .mdc 변환 스크립트
# 사용법: ./scripts/build-cursor.sh
#
# 각 스킬의 SKILL.md에서 <!-- claude-only --> 블록을 제거하고
# cursor.yaml의 프론트매터를 붙여서 dist/cursor/*.mdc 파일을 생성합니다.

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
SKILLS_DIR="$ROOT_DIR/skills"
DIST_DIR="$ROOT_DIR/dist/cursor"

mkdir -p "$DIST_DIR"

for skill_dir in "$SKILLS_DIR"/*/; do
  skill_name=$(basename "$skill_dir")
  skill_md="$skill_dir/SKILL.md"
  cursor_yaml="$skill_dir/cursor.yaml"

  if [ ! -f "$skill_md" ] || [ ! -f "$cursor_yaml" ]; then
    echo "  건너뜀: $skill_name (SKILL.md 또는 cursor.yaml 없음)"
    continue
  fi

  output="$DIST_DIR/$skill_name.mdc"

  # 1. cursor.yaml → .mdc 프론트매터
  echo "---" > "$output"
  cat "$cursor_yaml" >> "$output"
  echo "---" >> "$output"
  echo "" >> "$output"

  # 2. SKILL.md에서 YAML 프론트매터 제거 + claude-only 블록 제거
  # macOS/GNU sed 호환 문법 사용
  sed -e '/^---$/,/^---$/d' "$skill_md" | \
    sed -e '/<!-- claude-only -->/,/<!-- \/claude-only -->/d' \
    >> "$output"

  echo "  생성: $output"
done

echo ""
echo "완료! $DIST_DIR 에 .mdc 파일이 생성되었습니다."
