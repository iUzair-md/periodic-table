import React, { useRef, useEffect, useState } from "react";
import "./cnvas.scss";
import GameEngine from "./GameEngine";

const GameContext = () => {
  const canvasRef = useRef(null);
  const [context, setContext] = useState(null);
  const [image, setImage] = useState(null);
  const [imageBack, setImageBack] = useState(null);
  const [imageLogo, setImageLogo] = useState(null);

  const [gameStatus, setGameStatus] = useState(null);
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas) {
      const ctx = canvas.getContext("2d");
      setContext(ctx);

      canvas.width = 1000;
      canvas.height = 600;

      const img = new Image();
      img.src = "/sprites/images.png";
      img.onload = () => {
        setImage(img);
      };

      img.onerror = () => {
        console.error("Failed to load image");
      };

      const imgBack = new Image();
      imgBack.src = "/sprites/downlod.png";
      imgBack.onload = () => {
        setImageBack(imgBack);
      };

      imgBack.onerror = () => {
        console.error("Failed to load image");
      };

      const imgLogo = new Image();
      imgLogo.src = "/sprites/downloadd.png";
      imgLogo.onload = () => {
        setImageLogo(imgLogo);
      };

      imgLogo.onerror = () => {
        console.error("Failed to load image");
      };

      const Status = { start: 0, playing: 1 }; // Define your statuses here
      setGameStatus(Status.start);

      // Your drawing or context operations here
    } else {
      console.error("Canvas reference is null");
    }
  }, []);

  return (
    <div className="game-container">
      <canvas ref={canvasRef} />
      {context && image !== null && gameStatus !== null && (
        <GameEngine
          canvas={canvasRef.current}
          context={context}
          image={image}
          imageBack={imageBack}
          imageLogo={imageLogo}
          dimensions={dimensions}
          gameStatus={gameStatus}
        />
      )}
    </div>
  );
};

export default GameContext;
