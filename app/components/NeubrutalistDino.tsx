"use client";

import React, { useState, useEffect, useRef } from "react";

export default function NeubrutalistDino() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [dinoY, setDinoY] = useState(0);
  const [obstacles, setObstacles] = useState<{ id: number; x: number; type: number }[]>([]);

  // Refs for game state to avoid closure issues in requestAnimationFrame
  const isPlayingRef = useRef(false);
  const isGameOverRef = useRef(false);
  const dinoYRef = useRef(0);
  const obstaclesRef = useRef<{ id: number; x: number; type: number }[]>([]);
  const scoreRef = useRef(0);
  const velocityRef = useRef(0);
  const obstacleTimerRef = useRef(0);
  const obstacleIdRef = useRef(0);
  
  const gameRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>(null);
  const lastTimeRef = useRef<number>(0);

  const GRAVITY = 0.6;
  const JUMP_FORCE = -12;
  const GROUND_Y = 0;
  const DINO_X = 40; // left-10 is 40px
  const DINO_WIDTH = 48; // w-12 is 48px
  const DINO_HEIGHT = 48;
  const OBSTACLE_WIDTH = 30;

  const handleJump = () => {
    if (!isPlayingRef.current) {
      startGame();
      return;
    }
    if (dinoYRef.current === GROUND_Y) {
      velocityRef.current = JUMP_FORCE;
    }
  };

  const startGame = () => {
    isPlayingRef.current = true;
    isGameOverRef.current = false;
    dinoYRef.current = GROUND_Y;
    obstaclesRef.current = [];
    scoreRef.current = 0;
    velocityRef.current = 0;
    obstacleTimerRef.current = 0;
    lastTimeRef.current = performance.now();

    setIsPlaying(true);
    setIsGameOver(false);
    setScore(0);
    setDinoY(GROUND_Y);
    setObstacles([]);

    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    requestRef.current = requestAnimationFrame(gameLoop);
  };

  const gameLoop = (time: number) => {
    if (!isPlayingRef.current || isGameOverRef.current) return;

    const deltaTime = time - lastTimeRef.current;
    lastTimeRef.current = time;

    // Cap deltaTime to prevent huge jumps (e.g. after tab switch)
    const dt = Math.min(deltaTime, 32);

    // Update Dino physics
    velocityRef.current += GRAVITY;
    dinoYRef.current += velocityRef.current;
    if (dinoYRef.current >= GROUND_Y) {
      dinoYRef.current = GROUND_Y;
      velocityRef.current = 0;
    }

    // Update Obstacles
    const speed = 0.45;
    obstaclesRef.current = obstaclesRef.current
      .map((obs) => ({ ...obs, x: obs.x - speed * dt }))
      .filter((obs) => obs.x > -100);

    // Check Collision
    const dinoHitbox = {
      left: DINO_X + 10,
      right: DINO_X + DINO_WIDTH - 10,
      top: dinoYRef.current - DINO_HEIGHT + 10,
      bottom: dinoYRef.current - 5,
    };

    const collided = obstaclesRef.current.some((obs) => {
      const obsHeight = obs.type === 0 ? 30 : obs.type === 1 ? 45 : 20;
      const obsHitbox = {
        left: obs.x + 5,
        right: obs.x + OBSTACLE_WIDTH - 5,
        top: -obsHeight,
        bottom: 0,
      };

      return (
        dinoHitbox.right > obsHitbox.left &&
        dinoHitbox.left < obsHitbox.right &&
        dinoHitbox.bottom > obsHitbox.top &&
        dinoHitbox.top < obsHitbox.bottom
      );
    });

    if (collided) {
      isGameOverRef.current = true;
      isPlayingRef.current = false;
      setIsGameOver(true);
      setIsPlaying(false);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      return;
    }

    // Add new obstacle
    obstacleTimerRef.current += dt;
    if (obstacleTimerRef.current > 1200 + Math.random() * 2000) {
      obstacleTimerRef.current = 0;
      obstacleIdRef.current += 1;
      const stageWidth = gameRef.current?.clientWidth || 400;
      obstaclesRef.current.push({
        id: obstacleIdRef.current,
        x: stageWidth,
        type: Math.floor(Math.random() * 3),
      });
    }

    // Update Score
    scoreRef.current += 1;

    // Sync to state for rendering
    setDinoY(dinoYRef.current);
    setObstacles([...obstaclesRef.current]);
    setScore(scoreRef.current);

    requestRef.current = requestAnimationFrame(gameLoop);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        handleJump();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <div 
      ref={gameRef}
      onClick={handleJump}
      className="relative w-full aspect-square flex items-center justify-center p-8 bg-white-base border-4 border-black neubrutalist-shadow cursor-pointer overflow-hidden select-none"
    >
      {/* Game Stage */}
      <div className="relative w-full h-64 border-b-4 border-black mt-12">
        {/* Score */}
        <div className="absolute top-[-40px] right-0 font-label-code text-xl font-black">
          SCORE: {Math.floor(score / 10)}
        </div>

        {/* Dino */}
        <div 
          className="absolute left-10"
          style={{ 
            bottom: "0px",
            transform: `translateY(${dinoY}px)`
          }}
        >
          <div className="relative w-12 h-12 bg-cyber-yellow border-2 border-black">
            {/* Dino Face */}
            <div className="absolute top-1 right-1 w-2 h-2 bg-black"></div>
            {/* Small arm */}
            <div className="absolute top-6 right-[-4px] w-3 h-2 bg-black"></div>
            {/* Spikes */}
            <div className="absolute top-[-4px] left-2 w-2 h-2 bg-signal-pink border border-black rotate-45"></div>
            <div className="absolute top-2 left-[-2px] w-2 h-2 bg-signal-pink border border-black rotate-45"></div>
          </div>
        </div>

        {/* Obstacles */}
        {obstacles.map((obs) => (
          <div
            key={obs.id}
            className="absolute bg-black"
            style={{
              left: `${obs.x}px`,
              bottom: "0px",
              width: `${OBSTACLE_WIDTH}px`,
              height: obs.type === 0 ? "30px" : obs.type === 1 ? "45px" : "20px",
              border: "2px solid white"
            }}
          />
        ))}

        {!isPlaying && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/40 backdrop-blur-sm z-10">
            {isGameOver ? (
              <>
                <div className="font-display-lg text-4xl text-error mb-2 font-black">GAME OVER</div>
                <div className="font-label-code text-sm mb-4">FINAL SCORE: {Math.floor(score / 10)}</div>
              </>
            ) : (
              <div className="font-display-lg text-2xl mb-4 font-black">NEUBRUTAL DINO</div>
            )}
            <button 
              className="bg-cyber-yellow border-4 border-black px-6 py-2 font-black neubrutalist-shadow-hover transition-all"
              onClick={(e) => {
                e.stopPropagation();
                startGame();
              }}
            >
              {isGameOver ? "RESTART" : "START GAME"}
            </button>
            <p className="mt-4 font-label-code text-[10px]">SPACE OR CLICK TO JUMP</p>
          </div>
        )}
      </div>

      {/* Decorative Labels */}
      <div className="absolute bottom-4 left-4 bg-black text-white-base font-label-code text-[10px] px-2 py-1">
        SYS_DINO_V2.1
      </div>
      <div className="absolute top-4 left-4 bg-signal-pink text-white border-2 border-black font-label-code text-[10px] px-2 py-1 rotate-[-2deg]">
        INTERACTIVE_MODULE
      </div>
    </div>
  );
}
