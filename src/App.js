import React, { useRef, useState } from "react";
import "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";
import "@mediapipe/face_mesh";
import Webcam from "react-webcam";
import { runDetector } from "./utils/detector";
import "./App.css";

// Resolução de entrada e restrições de vídeo
const inputResolution = {
  width: 1080,
  height: 900,
};
const videoConstraints = {
  width: inputResolution.width,
  height: inputResolution.height,
  facingMode: "user",
};

// Componente principal da aplicação
function App() {
  const canvasRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  // Callback para lidar com o carregamento do vídeo
  const handleVideoLoad = (videoNode) => {
    const video = videoNode.target;

    // Verifica se o vídeo está pronto
    if (video.readyState !== 4) return;

    // Evita a execução duplicada
    if (loaded) return;

    // Executa o detector de malha facial
    runDetector(video, canvasRef.current);
    setLoaded(true);
  };

  // Renderização do componente
  return (
    <div class="teste">
      {/* Componente de webcam */}
      <Webcam
        width={inputResolution.width}
        height={inputResolution.height}
        style={{ visibility: "hidden", position: "absolute" }}
        videoConstraints={videoConstraints}
        onLoadedData={handleVideoLoad}
      />

      {/* Canvas para desenhar a malha facial */}
      <canvas
        ref={canvasRef}
        width={inputResolution.width}
        height={inputResolution.height}
        style={{ position: "absolute" }}
      />

      {/* Mensagem de carregamento */}
      {loaded ? <></> : <header>Loading...</header>}

    </div>
  );
}

export default App;
