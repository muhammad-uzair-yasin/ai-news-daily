#!/usr/bin/env bash
# One-time setup for the Kokoro text-to-speech voices used by autopilot episodes (Anna = af_heart, Uzair = am_adam).
# Safe to re-run: skips what is already installed.
set -euo pipefail
D="$(cd "$(dirname "$0")" && pwd)/models"
mkdir -p "$D"
python3 -c "import kokoro_onnx, soundfile" 2>/dev/null || pip install -q --break-system-packages kokoro-onnx soundfile
B=https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0
[ -s "$D/kokoro-v1.0.onnx" ] || curl -sSL -o "$D/kokoro-v1.0.onnx" "$B/kokoro-v1.0.onnx"
[ -s "$D/voices-v1.0.bin" ]  || curl -sSL -o "$D/voices-v1.0.bin"  "$B/voices-v1.0.bin"
ls -la "$D"
