// Importa o modelo de detecção de malha facial
import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";

// Para isso
import { drawMeshWithDistances } from "./drawMesh";

// Função para executar o detector de malha facial
export const runDetector = async (video, canvas) => {
  // Configurações do detector
  const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
  const detectorConfig = {
    runtime: "tfjs",
  };

  // Cria o detector
  const detector = await faceLandmarksDetection.createDetector(
    model,
    detectorConfig
  );

  // Função para estimar e desenhar a malha facial
  const detect = async (net) => {
    const estimationConfig = { flipHorizontal: false };
    const faces = await net.estimateFaces(video, estimationConfig);
    const ctx = canvas.getContext("2d");

    // Atualiza o canvas com a malha desenhada
    requestAnimationFrame(() => drawMeshWithDistances(faces[0], ctx));

    // Chama recursivamente a função de detecção
    detect(detector);
  };

  // Inicia a detecção
  detect(detector);
};