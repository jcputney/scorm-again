#!/usr/bin/env bash
# Patch hermes-engine.podspec to work with CocoaPods < 1.15
# The visionos platform method was added in CocoaPods 1.15

FILE="node_modules/react-native/sdks/hermes-engine/hermes-engine.podspec"

if [ -f "$FILE" ]; then
  # Check if visionos line exists and is not already commented out
  if grep -q "^[[:space:]]*spec\.visionos" "$FILE"; then
    echo "Patching hermes-engine.podspec for CocoaPods < 1.15 compatibility..."

    # Comment out all visionos lines
    sed -i '' 's/^[[:space:]]*spec\.visionos/  # spec.visionos/' "$FILE"

    echo "Patch applied successfully."
  else
    echo "hermes-engine.podspec already patched or doesn't need patching."
  fi
else
  echo "hermes-engine.podspec not found, skipping patch."
fi
