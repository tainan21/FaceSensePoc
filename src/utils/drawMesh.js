import { TRIANGULATION } from "./triangulation";

const PART_COLORS = {
  eyes: "red",
  nose: "black",
  mouth: "pink",
  ears: "green",
  hair: "brown",
};

const getPartName = (triangleIndex) => {
  if (triangleIndex < 100) {
    return "eyes";
  } else if (triangleIndex < 200) {
    return "nose";
  } else {
    return "mouth";
  }
};

const calculateDistance = (point1, point2) => {
  return Math.sqrt((point2.x - point1.x) ** 2 + (point2.y - point1.y) ** 2);
};

const displayDistance = (ctx, point1, point2, distance) => {
  ctx.beginPath();
  ctx.moveTo(point1.x, point1.y);
  ctx.lineTo(point2.x, point2.y);
  ctx.strokeStyle = "blue";
  ctx.stroke();

  ctx.fillStyle = "blue";
  ctx.font = "10px Arial";
  ctx.fillText(
    `${distance.toFixed(2)} px (${pixelsToCentimeters(distance).toFixed(2)} cm)`,
    (point1.x + point2.x) / 2,
    (point1.y + point2.y) / 2
  );
};

const pixelsToCentimeters = (pixels) => {
  const dpi = 96;
  const inchesPerCentimeter = 2.54;
  return pixels / dpi / inchesPerCentimeter;
};

export const drawMeshWithDistances = (prediction, ctx, drawLines) => {
  if (!prediction) return;
  const keyPoints = prediction.keypoints;
  if (!keyPoints) return;

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  for (let i = 0; i < TRIANGULATION.length / 3; i++) {
    const points = [
      TRIANGULATION[i * 3],
      TRIANGULATION[i * 3 + 1],
      TRIANGULATION[i * 3 + 2],
    ].map((index) => keyPoints[index]);

    const part = getPartName(i);
    const color = PART_COLORS[part] || "aqua";
    drawPath(ctx, points, true, color);
  }

  if (drawLines) {
    for (let i = 0; i < TRIANGULATION.length / 3; i++) {
      const points = [
        TRIANGULATION[i * 3],
        TRIANGULATION[i * 3 + 1],
        TRIANGULATION[i * 3 + 2],
      ].map((index) => keyPoints[index]);

      const part = getPartName(i);
      const color = PART_COLORS[part] || "aqua";
      drawPath(ctx, points, true, color);
    }
  }

  for (let keyPoint of keyPoints) {
    ctx.beginPath();
    ctx.arc(keyPoint.x, keyPoint.y, 1, 0, 3 * Math.PI);
    ctx.fillStyle = "aqua";
    ctx.fill();
  }

  calculateAndDisplayDistances(ctx, keyPoints);
};

const drawPath = (ctx, points, closePath, color) => {
  const region = new Path2D();
  region.moveTo(points[0].x, points[0].y);

  for (let i = 1; i < points.length; i++) {
    const point = points[i];
    region.lineTo(point.x, point.y);
  }

  if (closePath) region.closePath();

  ctx.strokeStyle = color;
  ctx.stroke(region);
};

const calculateAndDisplayDistances = (ctx, keyPoints) => {
  const lines = [
    { name: "Chin to Forehead", points: [152, 10], letter: "C-S", color: "blue" },
    { name: "olho a olho                                                                           ", points: [33, 263], letter: "E-E", color: "green" },
    { name: "Ear to Ear", points: [234, 454], letter: "E-E", color: "red" },
    { name: "testa a boca", points: [152, 11], letter: "Q-Q", color: "orange" },
    { name: "Iris a Iris", points: [263, 466], letter: "O-O", color: "purple" },
    { name: "Mouth to Mouth", points: [61, 291], letter: "A-A", color: "pink" },
    { name: "Hairline to Center Brow", points: [0, 151], letter: "C-S", color: "brown" },
  ];

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  for (let i = 0; i < TRIANGULATION.length / 3; i++) {
    const points = [
      TRIANGULATION[i * 3],
      TRIANGULATION[i * 3 + 1],
      TRIANGULATION[i * 3 + 2],
    ].map((index) => keyPoints[index]);

    const part = getPartName(i);
    const color = PART_COLORS[part] || "aqua";
    drawPath(ctx, points, true, color);
  }

  for (let keyPoint of keyPoints) {
    ctx.beginPath();
    ctx.arc(keyPoint.x, keyPoint.y, 1, 0, 3 * Math.PI);
    ctx.fillStyle = "aqua";
    ctx.fill();
  }

  lines.forEach((line) => {
    const [pointA, pointB] = line.points.map((index) => keyPoints[index]);
    const distance = calculateDistance(pointA, pointB);
    displayDistance(ctx, pointA, pointB, distance);
    ctx.fillStyle = "white";
    ctx.font = "12px Arial";
    ctx.fillText(`${line.name}: ${distance.toFixed(2)} px (${pixelsToCentimeters(distance).toFixed(2)} cm)`, pointA.x, pointA.y - 5);
  });
};
