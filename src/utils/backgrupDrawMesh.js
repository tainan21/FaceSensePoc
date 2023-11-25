import { TRIANGULATION } from "./triangulation";

// Função para desenhar a malha do rosto
export const drawMesh = (prediction, ctx) => {
  if (!prediction) return;
  const keyPoints = prediction.keypoints;
  if (!keyPoints) return;

  // Limpa o canvas
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // Desenha os triângulos da malha
  for (let i = 0; i < TRIANGULATION.length / 3; i++) {
    const points = [
      TRIANGULATION[i * 3],
      TRIANGULATION[i * 3 + 1],
      TRIANGULATION[i * 3 + 2],
    ].map((index) => keyPoints[index]);

    drawPath(ctx, points, true);
  }

  // Desenha os pontos da malha
  for (let keyPoint of keyPoints) {
    ctx.beginPath();
    ctx.arc(keyPoint.x, keyPoint.y, 1, 0, 3 * Math.PI);
    ctx.fillStyle = "aqua";
    ctx.fill();
  }
};

// Função auxiliar para desenhar um caminho
const drawPath = (ctx, points, closePath) => {
  const region = new Path2D();
  region.moveTo(points[0].x, points[0].y);

  for (let i = 1; i < points.length; i++) {
    const point = points[i];
    region.lineTo(point.x, point.y);
  }

  if (closePath) region.closePath();

  ctx.strokeStyle = "black";
  ctx.stroke(region);
};

///
import { TRIANGULATION } from "./triangulation";
const PART_COLORS = {
  eyes: "red",
  nose: "black",
  mouth: "pink",
  // Adicione outras partes conforme necessário
};

/*
// Função para obter o nome da parte com base no índice do triângulo
const getPartName = (triangleIndex) => {
  // Lógica para mapear o índice do triângulo para uma parte específica
  // Este é apenas um exemplo, você pode personalizar conforme necessário
  if (triangleIndex < 100) {
    return "eyes";
  } else if (triangleIndex < 200) {
    return "nose";
  } else {
    return "mouth";
  }
};

// Função para calcular a distância entre dois pontos
const calculateDistance = (point1, point2) => {
  return Math.sqrt((point2.x - point1.x) ** 2 + (point2.y - point1.y) ** 2);
};

// Função para exibir a distância no canvas
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
  console.log("distancia aqui>", distance)
};

// Função para converter pixels para centímetros
const pixelsToCentimeters = (pixels) => {
  // Suponha que 1 cm seja igual a 10 pixels (por exemplo)
  const pixelsPerCentimeter = 10;
  return pixels / pixelsPerCentimeter;
};

// Função para desenhar a malha
export const drawMesh = (prediction, ctx) => {
  if (!prediction) return;
  const keyPoints = prediction.keypoints;
  if (!keyPoints) return;

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // Desenha os triângulos da malha
  for (let i = 0; i < TRIANGULATION.length / 3; i++) {
    const points = [
      TRIANGULATION[i * 3],
      TRIANGULATION[i * 3 + 1],
      TRIANGULATION[i * 3 + 2],
    ].map((index) => keyPoints[index]);

    const part = getPartName(i); // Obtem o nome da parte
    const color = PART_COLORS[part] || "aqua"; // Usa a cor padrão "aqua" se não definida

    drawPath(ctx, points, true, color);
  }

  // Desenha os pontos da malha
  for (let keyPoint of keyPoints) {
    ctx.beginPath();
    ctx.arc(keyPoint.x, keyPoint.y, 1, 0, 3 * Math.PI);
    ctx.fillStyle = "aqua";
    ctx.fill();
  }

  // Calcula e exibe a distância entre pontos consecutivos
  for (let i = 0; i < keyPoints.length - 1; i++) {
    const point1 = keyPoints[i];
    const point2 = keyPoints[i + 1];
    const distance = calculateDistance(point1, point2);
    displayDistance(ctx, point1, point2, distance);
  }
};

// Função para desenhar um caminho com uma cor específica
const drawPath = (ctx, points, closePath, color) => {
  const region = new Path2D();
  region.moveTo(points[0].x, points[0].y);

  for (let i = 1; i < points.length; i++) {
    const point = points[i];
    region.lineTo(point.x, point.y);
  }

  if (closePath) region.closePath();

  ctx.strokeStyle = color; // Usa a cor fornecida
  ctx.stroke(region);
};
*/