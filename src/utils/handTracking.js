export function getPalmCenter(landmarks) {
  return {
    x: (landmarks[5].x + landmarks[9].x + landmarks[13].x + landmarks[17].x) / 4,
    y: (landmarks[5].y + landmarks[9].y + landmarks[13].y + landmarks[17].y) / 4,
  };
}

export function getPalmSize(landmarks, aspectRatio = 1) {
  const pinkyMCP = landmarks[17];
  const indexMCP = landmarks[5];
  return Math.hypot(
    (pinkyMCP.x - indexMCP.x) * aspectRatio,
    pinkyMCP.y - indexMCP.y
  );
}

export function detectOpenPalm(landmarks, aspectRatio = 1) {
  if (!landmarks || landmarks.length < 21) return false;

  const distance = (a, b) => Math.hypot(
    (a.x - b.x) * aspectRatio,
    a.y - b.y
  );
  const palmCenter = getPalmCenter(landmarks);
  const palmSize = getPalmSize(landmarks, aspectRatio);
  const extensionMargin = palmSize * 0.12;
  const fingers = [
    { tip: 8, pip: 6, mcp: 5 },
    { tip: 12, pip: 10, mcp: 9 },
    { tip: 16, pip: 14, mcp: 13 },
    { tip: 20, pip: 18, mcp: 17 },
  ];

  let extendedCount = 0;
  for (const { tip, pip, mcp } of fingers) {
    const tipDistance = distance(landmarks[tip], palmCenter);
    const mcpDistance = distance(landmarks[mcp], palmCenter);
    const tipToMcp = distance(landmarks[tip], landmarks[mcp]);
    const pipToMcp = distance(landmarks[pip], landmarks[mcp]);

    if (
      tipDistance > mcpDistance + extensionMargin &&
      tipToMcp > pipToMcp * 1.15
    ) {
      extendedCount++;
    }
  }

  return extendedCount >= 3;
}

export function getHandGuidanceText(isTracking, handData, messages) {
  if (!isTracking) return messages.instruction;
  if (!handData) return messages.noHandText;
  return handData.isOpen ? messages.palmDetectedText : messages.closedPalmText;
}
