#!/bin/bash
# SVG → PNG 一括変換スクリプト
# 必要: Inkscape または Chrome/Chromium（いずれか）

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
OUTPUT_DIR="$SCRIPT_DIR/png"
mkdir -p "$OUTPUT_DIR"

SVG_FILES=(
  "line_header_report.svg"
  "line_header_event.svg"
  "line_header_experience.svg"
  "line_header_notice.svg"
  "line_header_cancel.svg"
  "line_header_camp.svg"
)

echo "=== SVG → PNG 変換開始 ==="

# Inkscape がある場合
if command -v inkscape &> /dev/null; then
  echo "Inkscape を使用します"
  for svg in "${SVG_FILES[@]}"; do
    name="${svg%.svg}"
    inkscape "$SCRIPT_DIR/$svg" --export-type=png --export-filename="$OUTPUT_DIR/$name.png" --export-width=1040 2>/dev/null
    echo "✓ $name.png"
  done

# Chrome/Chromium がある場合
elif command -v google-chrome &> /dev/null || command -v chromium-browser &> /dev/null || command -v chromium &> /dev/null; then
  CHROME=$(command -v google-chrome || command -v chromium-browser || command -v chromium)
  echo "Chrome を使用します: $CHROME"
  for svg in "${SVG_FILES[@]}"; do
    name="${svg%.svg}"
    "$CHROME" --headless --disable-gpu \
      --screenshot="$OUTPUT_DIR/$name.png" \
      --window-size=1040,520 \
      "file://$SCRIPT_DIR/$svg" 2>/dev/null
    echo "✓ $name.png"
  done

else
  echo "❌ Inkscape または Chrome が見つかりません"
  echo ""
  echo "手動変換の方法："
  echo "  ブラウザで各SVGファイルを開き、右クリック→「名前を付けて保存」で PNG として保存"
  echo "  または https://cloudconvert.com/svg-to-png で変換できます"
  echo ""
  echo "SVGファイル一覧："
  for svg in "${SVG_FILES[@]}"; do
    echo "  $SCRIPT_DIR/$svg"
  done
  exit 1
fi

echo ""
echo "=== 変換完了 ==="
echo "出力先: $OUTPUT_DIR/"
ls -la "$OUTPUT_DIR/"
