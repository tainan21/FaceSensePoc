import { TRIANGULATION } from "./triangulation";

const PART_COLORS = {
  eyes: "red",
  nose: "black",
  mouth: "pink",
  // Adicione outras partes conforme necessário
};

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
};

// Função para converter pixels para centímetros
const pixelsToCentimeters = (pixels) => {
  const dpi = 96; // Pode ajustar se souber o DPI real da sua câmera
  const inchesPerCentimeter = 2.54; // Polegadas por centímetro

  return pixels / dpi / inchesPerCentimeter;
};

// Função para desenhar a malha e exibir distâncias específicas
export const drawMeshWithDistances = (prediction, ctx, drawLines) => {
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

  // Desenha os pontos da malha
  for (let keyPoint of keyPoints) {
    ctx.beginPath();
    ctx.arc(keyPoint.x, keyPoint.y, 1, 0, 3 * Math.PI);
    ctx.fillStyle = "aqua";
    ctx.fill();
  }

  // Calcula e exibe as distâncias específicas
  calculateAndDisplayDistances(ctx, keyPoints);
};

// Função para calcular e exibir distâncias específicas
const calculateAndDisplayDistances = (ctx, keyPoints) => {
  // Queixo a testa
  const chin = keyPoints[152]; // Ponto do queixo
  const forehead = keyPoints[10]; // Ponto da testa
  const chinToForehead = calculateDistance(chin, forehead);
  displayDistance(ctx, chin, forehead, chinToForehead);

  // Olho a olho
  const leftEye = keyPoints[33]; // Ponto do olho esquerdo
  const rightEye = keyPoints[263]; // Ponto do olho direito
  const eyeToEye = calculateDistance(leftEye, rightEye);
  displayDistance(ctx, leftEye, rightEye, eyeToEye);

  // Orelha a orelha
  const leftEar = keyPoints[234]; // Ponto da orelha esquerda
  const rightEar = keyPoints[454]; // Ponto da orelha direita
  const earToEar = calculateDistance(leftEar, rightEar);
  displayDistance(ctx, leftEar, rightEar, earToEar);

  // Queixo superior até inferior ( Q Q )
  const chinTop = keyPoints[152]; // Ponto superior do queixo
  const chinBottom = keyPoints[11]; // Ponto inferior do queixo
  const chinTopToBottom = calculateDistance(chinTop, chinBottom);
  displayDistance(ctx, chinTop, chinBottom, chinTopToBottom);

  // Queixo esquerda até direita ( Q Q )
  const chinLeft = keyPoints[152]; // Ponto esquerdo do queixo
  const chinRight = keyPoints[345]; // Ponto direito do queixo
  const chinLeftToRight = calculateDistance(chinLeft, chinRight);
  displayDistance(ctx, chinLeft, chinRight, chinLeftToRight);

  // Íris de um olho até íris do outro olho (O O)
  const leftIris = keyPoints[263]; // Ponto da íris do olho esquerdo
  const rightIris = keyPoints[466]; // Ponto da íris do olho direito
  const irisToIris = calculateDistance(leftIris, rightIris);
  displayDistance(ctx, leftIris, rightIris, irisToIris);

  // Na linha da sobrancelha, da ponta esquerda do rosto até a direita (T T )
  const leftBrow = keyPoints[103]; // Ponto da sobrancelha esquerda
  const rightBrow = keyPoints[334]; // Ponto da sobrancelha direita
  const browToLeftToRight = calculateDistance(leftBrow, rightBrow);
  displayDistance(ctx, leftBrow, rightBrow, browToLeftToRight);

  // Na linha da boca, de uma ponta do rosto até a outra ( A A )
  const leftMouth = keyPoints[61]; // Ponto da boca esquerda
  const rightMouth = keyPoints[291]; // Ponto da boca direita
  const mouthToLeftToRight = calculateDistance(leftMouth, rightMouth);
  displayDistance(ctx, leftMouth, rightMouth, mouthToLeftToRight);

  // Do começo da testa perto do cabelo até o centro da sobrancelha ( linha reta pra baixo ) (C S )
  const hairline = keyPoints[0]; // Ponto do início do cabelo
  const centerBrow = keyPoints[151]; // Ponto do centro da sobrancelha
  const hairlineToCenterBrow = calculateDistance(hairline, centerBrow);
  displayDistance(ctx, hairline, centerBrow, hairlineToCenterBrow);

  // Da ponta do nariz até a ponta da boca (N L)
  const noseTip = keyPoints[5]; // Ponto da ponta do nariz
  const mouthTip = keyPoints[58]; // Ponto da ponta da boca
  const noseToMouth = calculateDistance(noseTip, mouthTip);
  displayDistance(ctx, noseTip, mouthTip, noseToMouth);

  // Dentro da função calculateAndDisplayDistances
  //console.log("Chin:", chin);
  //console.log("Forehead:", forehead);
  //console.log("Chin to Forehead:", chinToForehead);

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


//cs = 9cm
//do = 7.5
//q3 = 6
//nl = 3