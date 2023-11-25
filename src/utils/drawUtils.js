// drawUtils.js
import { PART_COLORS, getPartName } from "./partUtils";
import { calculateDistance, pixelsToCentimeters } from "./distanceUtils";

export const drawPath = (ctx, points, closePath, color) => {
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
