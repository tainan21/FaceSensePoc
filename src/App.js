import React, { useRef, useState, useEffect } from "react";
import "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";
import "@mediapipe/face_mesh";
import Webcam from "react-webcam";
import { runDetector } from "./utils/detector";
import { drawMeshWithDistances } from "./utils/drawMesh"; // Importe a função drawMeshWithDistances
import "./App.css";

const inputResolution = {
  width: 1080,
  height: 900,
};

const videoConstraints = {
  width: inputResolution.width,
  height: inputResolution.height,
  facingMode: "user",
};

function App() {
  const videoCanvasRef = useRef(null);
  const drawLinesCanvasRef = useRef(null);
  const markLinesCanvasRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [drawLines, setDrawLines] = useState(true);
  const [markLines, setMarkLines] = useState(false);
  const [buttonMessage, setButtonMessage] = useState("Clique para fazer algo");
  const [backgroundColor, setBackgroundColor] = useState("#000"); // Defina a cor inicial
  const [isColor1, setIsColor1] = useState(true);
  const [showNoseLine, setShowNoseLine] = useState(true);
  
  const [lines, setLines] = useState({
    chinToForehead: true,
    eyeToEye: true,
    earToEar: false,
    chinTopToBottom: false,
    chinLeftToRight: false,
    irisToIris: false,
    browToLeftToRight: false,
    mouthToLeftToRight: false,
    hairlineToCenterBrow: false,
    noseToMouth: false,
  });

  const toggleNoseLine = () => {
    setShowNoseLine(!showNoseLine);
  };

  const toggleMarkLines = () => {
    setMarkLines(!markLines);
  };

  const handleVideoLoad = (videoNode) => {
    const video = videoNode.target;

    if (video.readyState !== 4) return;

    if (!loaded) {
      runDetector(video, videoCanvasRef.current);
      setLoaded(true);
    }
  };

  const toggleDrawLines = () => {
    setDrawLines(!drawLines);
  };

  const measureDistances = () => {
    drawMeshWithDistances(null, drawLinesCanvasRef.current, drawLines, lines);
  };

  const handleClick = () => {
    setButtonMessage("Algo foi feito!");
    console.log("Botão clicado!");
  };

  const toggleBackgroundColor = () => {
    setBackgroundColor(isColor1 ? "#00f" : "#000"); // Altera entre cor1 e cor2
    setIsColor1(!isColor1);
  };

  useEffect(() => {
    console.log("Canvas Renderizado:", videoCanvasRef.current);
  }, [videoCanvasRef]);

  useEffect(() => {
    console.log("Câmera Carregada:", loaded);
  }, [loaded]);

  return (
    <div>
      <div className="teste2">
        <button onClick={toggleDrawLines}>
          {drawLines ? "Desativar linhas" : "Ativar linhas"}
        </button>
        <button onClick={toggleMarkLines}>
          {markLines ? "Desativar marcação" : "Ativar marcação"}
        </button>
        <button onClick={measureDistances}>Medir distâncias</button>
        <button onClick={handleClick}>{buttonMessage}</button>
        <button onClick={toggleNoseLine}>
          {showNoseLine ? "Esconder Linha do Nariz" : "Mostrar Linha do Nariz"}
        </button>
        <button onClick={() => setLoaded((prevLoaded) => !prevLoaded)}>
          Toggle Câmera
        </button>
        <button onClick={toggleBackgroundColor}>Alternar Cor de Fundo</button>
      </div>
      <div className="teste">
        <Webcam
          width={inputResolution.width}
          height={inputResolution.height}
          style={{ visibility: "hidden", position: "absolute" }}
          videoConstraints={videoConstraints}
          onLoadedData={handleVideoLoad}
        />

        <canvas
          ref={videoCanvasRef}
          width={inputResolution.width}
          height={inputResolution.height}
          style={{ position: "absolute", background: backgroundColor }}
        />

        {loaded ? (
          <></>
        ) : (
          <header>Loading...</header>
        )}
        {drawLines && (
          <canvas
            ref={drawLinesCanvasRef}
            width={inputResolution.width}
            height={inputResolution.height}
            style={{ position: "absolute" }}
          />
        )}
        {markLines && (
          <canvas
            ref={markLinesCanvasRef}
            width={inputResolution.width}
            height={inputResolution.height}
            style={{ position: "absolute" }}
          />
        )}
      </div>
    </div>
  );
}

export default App;
