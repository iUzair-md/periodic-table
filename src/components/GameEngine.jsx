import React, { useEffect, useRef } from "react";
import { Sprite } from "./Spritee";
import PeriodTable from "./PeriodTable";
import soundBackground from "/sounds/minecraft_just_jump.mp3";
import soundExplosion from "/sounds/boom.mp3";
import soundUp from "/sounds/up.mp3";
import soundLose from "/sounds/lose.mp3";


const GameEngine = ({
  canvas,
  context,
  image,
  imageBack,
  imageLogo,
  dimensions,
  gameStatus: initialGameStatus
}) => {
  const yRef = useRef(50); // Starting y position

  const background = new Sprite(0, 0, 1000, 600);
  const element = new Sprite(1057, 141, 130, 130);
  const playButton = new Sprite(0, 0, 961, 522);
  const lifeHeart = [
    new Sprite(1075, 106, 94, 26),
    new Sprite(1075, 81, 94, 26),
    new Sprite(1075, 56, 94, 26),
    new Sprite(1075, 31, 94, 26),
  ];


  const framesRef = useRef(0);
  const gameStatusRef = useRef(initialGameStatus);
  const recordRef = useRef(null);
  const lifeRef = useRef(3);
  const scoreRef = useRef(0);
  const auxRef = useRef(0);
  const gravityRef = useRef(1);
  const obsRef = useRef([]);
  const baseLevelRef = useRef(100);
  const elementDelayRef = useRef(0);

  const soundBackgroundRef = useRef(new Audio(soundBackground));
  const soundExplosionRef = useRef(new Audio(soundExplosion));
  const soundUpRef = useRef(new Audio(soundUp));
  const soundLoseRef = useRef(new Audio(soundLose));

  const isSoundBackgroundPlaying = useRef(false);
  const isSoundExplosionPlaying = useRef(false);
  const isSoundUpPlaying = useRef(false);
  const isSoundLosePlaying = useRef(false);

  const quizRef = useRef({
    name: "",
    symbol: null,
  });

  const status = {
    start: 0,
    playing: 1,
  };

  useEffect(() => {
    play();
  }, []);

  const playSoundBackground = () => {
    soundBackgroundRef.current.play();
    isSoundBackgroundPlaying.current = true;
  };

  const stopSoundBackground = () => {
    soundBackgroundRef.current.pause();
    soundBackgroundRef.current.currentTime = 0;
    isSoundBackgroundPlaying.current = false;
  };

  const playSoundExplosion = () => {
    soundExplosionRef.current.play();
    isSoundExplosionPlaying.current = true;
  };

  const stopSoundExplosion = () => {
    soundExplosionRef.current.pause();
    soundExplosionRef.current.currentTime = 0;
    isSoundExplosionPlaying.current = false;
  };

  const playSoundUp = () => {
    soundUpRef.current.play();
    isSoundUpPlaying.current = true;
  };

  const stopSoundUp = () => {
    soundUpRef.current.pause();
    soundUpRef.current.currentTime = 0;
    isSoundUpPlaying.current = false;
  };

  const playSoundLose = () => {
    soundLoseRef.current.play();
    isSoundLosePlaying.current = true;
  };

  const stopSoundLose = () => {
    soundLoseRef.current.pause();
    soundLoseRef.current.currentTime = 0;
    isSoundLosePlaying.current = false;
  };

  const insert = () => {
    if (
      auxRef.current == 0 &&
      obsRef.current.length > Math.floor(3 * Math.random())
    ) {
      obsRef.current.push({
        width: 150,
        height: 150,
        gravity: gravityRef.current,
        velocity: 0,
        x: 300 + Math.floor(571 * Math.random()),
        y: Math.floor(50 * Math.random()),
        name: quizRef.current.name,
        simbol: quizRef.current.symbol,
      });
      auxRef.current = 1;
    } else {
      obsRef.current.push({
        width: 150,
        height: 150,
        gravity: gravityRef.current,
        velocity: 0,
        x: 300 + Math.floor(571 * Math.random()),
        y: 0,
        name: PeriodTable[Math.floor(PeriodTable.length * Math.random())].name,
        simbol: PeriodTable[Math.floor(PeriodTable.length * Math.random())].id,
      });
    }
    elementDelayRef.current =
      baseLevelRef.current + Math.floor(51 * Math.random());
    // console.log('Element delay:', elementDelay);
  };

  const update = () => {
    if (elementDelayRef.current == 0) {
      insert();
      if (baseLevelRef.current >= 30) {
        baseLevelRef.current--;
      }
    } else {
      elementDelayRef.current--;
    }
    obsRef.current.forEach((obs, index) => {
      obs.velocity += obs.gravity;
      obs.y = obs.velocity;
      const limit = dimensions.height - obs.height / 2 - 110;
      if (obs.y >= limit) {
        obsRef.current.splice(index, 1);

        if (lifeRef.current > 0 && obs.simbol === quizRef.current.symbol) {
          elementSort();
          lifeRef.current--;
          playSoundExplosion();
          auxRef.current = 0;
        }
        if (lifeRef.current === 0) {
          playSoundLose();
        }
      }
    });
  };

  const draw = () => {
    obsRef.current.forEach((obs) => {
      element.print(context, image, obs.x, obs.y);
      context.fillStyle = "#890305";
      context.textAlign = "center";
      context.font = "25px Passion One, Arial";
      context.fillText(
        obs.simbol,
        obs.x + obs.width / 2 - 10,
        obs.y + obs.height / 2 - 5
      );
    });
  };

  const gameClick = (event) => {
    const pos = {
      x: event.clientX - canvas.getBoundingClientRect().left,
      y: event.clientY - canvas.getBoundingClientRect().top,
    };
    obsRef.current.forEach((obs, index) => {
      if (
        pos.x >= obs.x &&
        pos.x <= obs.x + obs.width &&
        pos.y >= obs.y &&
        pos.y <= obs.y + obs.height
      ) {
        obsRef.current.splice(index, 1);
        if (lifeRef.current > 0 && obs.simbol == quizRef.current.symbol) {
          scoreRef.current++;
          obsRef.current = [];
          gravityRef.current += 0.1;
          elementSort();
          playSoundUp();
          auxRef.current = 0;
        } else {
          if (lifeRef.current > 0) {
            lifeRef.current--;
          }
          playSoundExplosion();
        }
        if (lifeRef.current == 0) {
          playSoundLose();
        }
      }
    });
  };

  const elementSort = () => {
    const randomIndex = Math.floor(PeriodTable.length * Math.random());
    console.log("randomIndex1: ", randomIndex);
    quizRef.current.name = PeriodTable[randomIndex].name;
    console.log("randomIndex2: ", randomIndex);
    quizRef.current.symbol = PeriodTable[randomIndex].id;
    console.log("randomIndex3: ", randomIndex);
  };

  const quizElement = () => {
    context.fillStyle = "black";
    context.textAlign = "center";
    context.font = "25px Sigmar One, Arial";
    context.fillText(quizRef.current.name, 127, 286);
  };

  const pointsBoard = () => {
    // pointBoard.print(context, image, 41, 0);
    context.fillStyle = "#fff";
    context.textAlign = "center";
    context.font = "20px Arial";
    context.fillStyle='black';
    context.fillText("Record: " + recordRef.current, 110, 67);
    context.font = "40px Arial";
    context.fillText(scoreRef.current, 133, 115);
    lifeHeart[lifeRef.current].print(context, image, 123, 130);
  };

  const splashScreen = () => {
    // playButton.print(context, image, 56, -50);
    playButton.print(context, imageLogo, 0, 0);
  };

  const panelDraw = () => {
    quizElement();
    pointsBoard();
  };

  const play = () => {
    framesRef.current += 1;
    context.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    // background.print(context, image, 0, 0);   
    background.print(context, imageBack, 0, 0);   

    panelDraw();

   
    if (lifeRef.current === 0) {
      gameStatusRef.current = status.start;
    }
    if (gameStatusRef.current === status.start) {
      let storedRecord = localStorage.getItem("record") || 0;
      recordRef.current = storedRecord;

      if (scoreRef.current > storedRecord) {
        localStorage.setItem("record", scoreRef.current);
      }
      splashScreen();

          
      stopSoundBackground();
      quizRef.current.name = "";
      console.log("gamestatus before i clicked:", gameStatusRef.current);
      canvas.onclick = (event) => {
        scoreRef.current = 0;
        lifeRef.current = 3;
        obsRef.current = [];
        auxRef.current = 0;
        gravityRef.current = 1;
        elementSort();

        alert(
          "In this game, your objective is to select the element presented by the oval rim. You begin with three lives, and each time you miss an element, you lose a life. Earn points for each correctly identified element!"
        );
        gameStatusRef.current = status.playing;
        console.log("gamestatus after i clicked:", gameStatusRef.current);
      };
    } else if (gameStatusRef.current === status.playing) {
      draw();
      update();
      

      playSoundBackground();
      canvas.onclick = (event) => {
        gameClick(event);
      };
    }
    window.requestAnimationFrame(play);
  };
  return null;
};

export default GameEngine;
