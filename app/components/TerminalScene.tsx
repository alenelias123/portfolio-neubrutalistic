"use client";

import React, { useState, useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Html,
  Text,
  Environment,
  ContactShadows,
  RoundedBox,
  PointerLockControls,
} from "@react-three/drei";
import * as THREE from "three";

function TerminalApp({ onClose }: { onClose: () => void }) {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([
    "ALEN.SH OS [Version 2.0.42]",
    "System: Linux-based kernel 6.8.0",
    "Status: All systems operational.",
    "",
    "WELCOME TO THE CODING PLAYGROUND!",
    "---------------------------------",
    "> hack          : Start a simulated system breach",
    "> scan          : Run a network vulnerability scan",
    "> help          : View all basic commands",
    "",
  ]);
  const [files, setFiles] = useState<Record<string, string>>({});
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const parts = input.trim().split(" ");
    const cmd = parts[0].toLowerCase();
    const arg = parts.slice(1).join(" ");
    let response: string | string[] = "";

    switch (cmd) {
      case "help":
        response = [
          "Core Commands: about, projects, clear, exit",
          "Coding/Fun: hack, scan, create, run, ls",
        ];
        break;
      case "hack":
        response = ["CONNECTING...", "BYPASSING FIREWALL...", "ACCESS GRANTED."];
        break;
      case "scan":
        response = [
          "Scanning ports...",
          "Port 80: OPEN",
          "Vulnerability Found: CVE-2024-X",
        ];
        break;
      case "create":
        if (!arg) {
          response = "Error: Specify a filename.";
        } else {
          setFiles({ ...files, [arg]: `print("Hello World")` });
          response = `File '${arg}' created.`;
        }
        break;
      case "run":
        if (!arg || !files[arg]) {
          response = `Error: File '${arg}' not found.`;
        } else {
          response = [`Executing ${arg}...`, "SUCCESS: Code executed."];
        }
        break;
      case "ls":
        response = Object.keys(files).join("  ") || "No files found.";
        break;
      case "about":
        response = "Computer Science and Engineering student at CUSAT.";
        break;
      case "projects":
        response = "Open the Projects folder from the desktop or dock.";
        break;
      case "clear":
        setHistory([]);
        setInput("");
        return;
      case "exit":
        onClose();
        return;
      case "":
        break;
      default:
        response = `Command not found: ${cmd}.`;
    }

    const newHistory = [...history, `ALEN@OS:~$ ${input}`];
    if (Array.isArray(response)) newHistory.push(...response);
    else if (response) newHistory.push(response);
    newHistory.push("");
    setHistory(newHistory);
    setInput("");
  };

  return (
    <div
      className="flex-grow p-3 sm:p-4 font-mono text-green-500 overflow-y-auto custom-computer-scroll text-[11px] leading-relaxed"
      onClick={() => inputRef.current?.focus()}
    >
      {history.map((line, i) => (
        <div key={i} className="whitespace-pre-wrap mb-0.5">{line}</div>
      ))}
      <form onSubmit={handleCommand} className="flex mt-1">
        <span className="mr-1 text-cyber-yellow shrink-0">ALEN@OS:~$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-grow min-w-0 bg-transparent border-none outline-none text-green-500"
          autoFocus
        />
      </form>
    </div>
  );
}

type ActiveWindow = "desktop" | "terminal" | "wifi" | "boot" | "projects";

const MACBOOK_SCREEN = {
  worldWidth: 5.92,
  worldHeight: 3.34,
  cssWidth: 605,
  cssHeight: 342,
};

const MACBOOK_SCREEN_DISTANCE_FACTOR =
  (MACBOOK_SCREEN.worldWidth * 400) / MACBOOK_SCREEN.cssWidth;

const HOMEPAGE_PANEL = {
  worldWidth: 5.8,
  worldHeight: 3.26,
  cssWidth: 960,
  cssHeight: 540,
};

const HOMEPAGE_PANEL_DISTANCE_FACTOR =
  (HOMEPAGE_PANEL.worldWidth * 400) / HOMEPAGE_PANEL.cssWidth;

const KEY_LABELS = [
  ["esc", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "="],
  ["tab", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "[", "]"],
  ["caps", "A", "S", "D", "F", "G", "H", "J", "K", "L", ";", "'"],
  ["shift", "Z", "X", "C", "V", "B", "N", "M", ",", ".", "/", "ret"],
  ["fn", "ctrl", "opt", "cmd", "space", "cmd", "opt", "←", "↓", "→"],
];

function FirstPersonRig() {
  const { camera } = useThree();
  const keys = useRef<Record<string, boolean>>({});
  const velocity = useRef(new THREE.Vector3());
  const forward = useRef(new THREE.Vector3());
  const right = useRef(new THREE.Vector3());

  useEffect(() => {
    camera.position.set(0, 1.7, 7.4);
    camera.rotation.set(-0.13, 0, 0);

    const setKey = (event: KeyboardEvent, pressed: boolean) => {
      keys.current[event.code] = pressed;
    };
    const handleKeyDown = (event: KeyboardEvent) => setKey(event, true);
    const handleKeyUp = (event: KeyboardEvent) => setKey(event, false);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [camera]);

  useFrame((_, delta) => {
    const move = new THREE.Vector3();
    camera.getWorldDirection(forward.current);
    forward.current.y = 0;
    forward.current.normalize();
    right.current.crossVectors(forward.current, camera.up).normalize();

    if (keys.current.KeyW || keys.current.ArrowUp) move.add(forward.current);
    if (keys.current.KeyS || keys.current.ArrowDown) move.sub(forward.current);
    if (keys.current.KeyD || keys.current.ArrowRight) move.add(right.current);
    if (keys.current.KeyA || keys.current.ArrowLeft) move.sub(right.current);

    if (move.lengthSq() > 0) {
      move.normalize().multiplyScalar(4.2);
    }

    velocity.current.lerp(move, Math.min(1, delta * 8));
    camera.position.addScaledVector(velocity.current, delta);
    camera.position.x = THREE.MathUtils.clamp(camera.position.x, -6.3, 6.3);
    camera.position.z = THREE.MathUtils.clamp(camera.position.z, -7.2, 7.6);
    camera.position.y = 1.7;
  });

  return null;
}

function ComputerModel({
  activeWindow,
  onNavigate,
  isOpen,
  onToggleOpen,
}: {
  activeWindow: ActiveWindow;
  onNavigate: (win: ActiveWindow) => void;
  isOpen: boolean;
  onToggleOpen: () => void;
}) {
  const lidRef = useRef<THREE.Group>(null);
  const laptopRef = useRef<THREE.Group>(null);
  const [currentTime, setCurrentTime] = useState("");
  const openProgress = useRef(0);

  useFrame(({ clock }, delta) => {
    const elapsed = clock.getElapsedTime();
    const target = isOpen ? 1 : 0;
    openProgress.current = THREE.MathUtils.damp(
      openProgress.current,
      target,
      5.8,
      delta
    );

    if (laptopRef.current) {
      laptopRef.current.position.y = -0.72 + Math.sin(elapsed * 0.9) * 0.008;
    }
    if (lidRef.current) {
      lidRef.current.rotation.x =
        THREE.MathUtils.lerp(1.52, -0.38, openProgress.current) +
        Math.sin(elapsed * 1.1) * 0.004 * openProgress.current;
    }
  });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const date = now.toLocaleDateString([], {
        month: "short",
        day: "numeric",
      });
      const time = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      setCurrentTime(`${date} ${time}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <group
      ref={laptopRef}
      position={[0, -0.72, 0]}
      scale={0.72}
    >
      <group position={[0, 0, 0]}>
        <RoundedBox
          args={[7.15, 0.12, 4.42]}
          radius={0.16}
          smoothness={12}
          castShadow
          receiveShadow
          scale={[1, 0.64, 1]}
          onClick={onToggleOpen}
        >
          <meshStandardMaterial color="#e0e0dc" metalness={0.94} roughness={0.15} />
        </RoundedBox>

        <mesh position={[0, 0.086, 2.18]} rotation={[0, 0, 0]}>
          <boxGeometry args={[1.25, 0.018, 0.08]} />
          <meshStandardMaterial color="#f6f6f2" metalness={0.76} roughness={0.18} />
        </mesh>

        <RoundedBox
          args={[2.55, 0.026, 1.42]}
          radius={0.08}
          smoothness={8}
          position={[0, 0.105, 1.05]}
          onClick={onToggleOpen}
        >
          <meshStandardMaterial color="#a5a5a0" metalness={0.5} roughness={0.28} />
        </RoundedBox>

        <mesh position={[0, 0.095, -0.74]}>
          <boxGeometry args={[5.45, 0.008, 2.08]} />
          <meshStandardMaterial
            color="#171717"
            emissive="#202020"
            emissiveIntensity={0.35}
            roughness={0.42}
          />
        </mesh>

        <group position={[0, 0.15, -0.74]}>
          {KEY_LABELS.map((row, i) =>
            row.map((label, j) => {
              const isSpace = label === "space";
              const wide =
                label === "tab" ||
                label === "caps" ||
                label === "shift" ||
                label === "ret";
              const keyWidth = isSpace ? 1.52 : wide ? 0.48 : 0.28;
              const rowOffset = i === 0 ? 0 : i === 1 ? 0.1 : i === 2 ? 0.18 : i === 3 ? 0.34 : 0.54;
              const x = j * 0.36 - 2.18 + rowOffset + (isSpace ? 0.42 : 0);
              const z = 0.82 - i * 0.34;

              return (
                <group key={`${label}-${i}-${j}`} position={[x, 0, z]}>
                  <RoundedBox args={[keyWidth, 0.045, 0.25]} radius={0.035} smoothness={4}>
                    <meshStandardMaterial
                      color="#101010"
                      emissive="#f6f6f2"
                      emissiveIntensity={0.08}
                      roughness={0.34}
                    />
                  </RoundedBox>
                  <Text
                    position={[0, 0.032, 0.002]}
                    rotation={[-Math.PI / 2, 0, 0]}
                    fontSize={isSpace ? 0.055 : 0.065}
                    color="#d8d8d3"
                    anchorX="center"
                    anchorY="middle"
                  >
                    {label}
                  </Text>
                </group>
              );
            })
          )}
          <mesh position={[0, -0.02, 0.02]}>
            <boxGeometry args={[5.35, 0.004, 1.95]} />
            <meshStandardMaterial
              color="#00fb40"
              transparent
              opacity={0.09}
              emissive="#00fb40"
              emissiveIntensity={0.25}
            />
          </mesh>
        </group>

        <mesh position={[0, 0.08, -2.09]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.105, 0.105, 5.8, 32]} />
          <meshStandardMaterial color="#bdbdb7" metalness={0.95} roughness={0.16} />
        </mesh>
        <mesh position={[-3.05, 0.08, -2.09]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.13, 0.13, 0.52, 32]} />
          <meshStandardMaterial color="#161616" roughness={0.24} />
        </mesh>
        <mesh position={[3.05, 0.08, -2.09]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.13, 0.13, 0.52, 32]} />
          <meshStandardMaterial color="#161616" roughness={0.24} />
        </mesh>
      </group>

      <group
        ref={lidRef}
        position={[0, 0.14, -2.12]}
        rotation={[1.52, 0, 0]}
        onClick={onToggleOpen}
      >
        <RoundedBox
          args={[6.72, 4.06, 0.12]}
          radius={0.18}
          smoothness={14}
          position={[0, 1.92, -0.08]}
          castShadow
        >
          <meshStandardMaterial color="#e1e1dc" metalness={0.94} roughness={0.14} />
        </RoundedBox>

        <RoundedBox
          args={[6.28, 3.64, 0.035]}
          radius={0.12}
          smoothness={10}
          position={[0, 1.92, 0.02]}
        >
          <meshStandardMaterial color="#050505" roughness={0.16} />
        </RoundedBox>

        <mesh position={[0, 3.58, 0.046]}>
          <boxGeometry args={[0.34, 0.105, 0.012]} />
          <meshStandardMaterial color="#0d0d0d" roughness={0.2} />
        </mesh>

        <mesh position={[0, 1.92, 0.052]}>
          <boxGeometry
            args={[
              MACBOOK_SCREEN.worldWidth,
              MACBOOK_SCREEN.worldHeight,
              0.006,
            ]}
          />
          <meshStandardMaterial
            color="#000"
            emissive="#000"
            roughness={0}
            metalness={1}
          />
          <Html
            transform
            distanceFactor={MACBOOK_SCREEN_DISTANCE_FACTOR}
            position={[0, 0, 0.01]}
            occlude="blending"
            style={{
              width: `${MACBOOK_SCREEN.cssWidth}px`,
              height: `${MACBOOK_SCREEN.cssHeight}px`,
              background: "#1a1a1a",
              color: "#fff",
              fontFamily: "JetBrains Mono, monospace",
              overflow: "hidden",
              pointerEvents: "auto",
              borderRadius: "2px",
              boxShadow: "inset 0 0 60px rgba(0,0,0,0.8)",
              opacity: isOpen ? 1 : 0,
              transition: "opacity 500ms ease",
            }}
          >
            <div className="w-full h-full flex flex-col select-none relative overflow-hidden bg-[#050505] terminal-screen-glow">
              <div className="absolute inset-0 opacity-50 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:100%_4px]" />
              <div className="h-6 bg-cyber-yellow text-black px-2 flex justify-between items-center text-[8px] border-b-2 border-black z-20 shrink-0 font-black">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="shrink-0">
                    ALEN_OS
                  </span>
                  <div className="hidden sm:flex gap-2 text-black/70">
                    <span className="cursor-default hover:text-black">File</span>
                    <span className="cursor-default hover:text-black">Edit</span>
                    <span className="cursor-default hover:text-black">View</span>
                    <span className="cursor-default hover:text-black">Terminal</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    onClick={() => onNavigate("wifi")}
                    className="material-symbols-outlined text-[10px] text-black/70 cursor-pointer hover:text-signal-pink transition-colors"
                  >
                    wifi
                  </span>
                  <span className="material-symbols-outlined text-[10px] text-black/70">
                    battery_full
                  </span>
                  <span className="font-black text-black/80 text-[8px]">
                    {currentTime}
                  </span>
                </div>
              </div>

              <div className="flex-grow relative bg-[#111] overflow-hidden p-3 min-h-0">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,#00fb40_0_10%,transparent_22%),radial-gradient(circle_at_82%_18%,#ff4dff_0_8%,transparent_23%),linear-gradient(135deg,#101010_0%,#191919_52%,#050505_100%)]" />
                <div className="absolute inset-0 opacity-35 bg-[linear-gradient(rgba(255,255,255,0.14)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.14)_1px,transparent_1px)] bg-[length:28px_28px]" />
                <div className="absolute right-5 top-7 w-28 border-2 border-black bg-white p-2 text-black shadow-[5px_5px_0_#000] animate-brutal-float">
                  <div className="text-[7px] font-black">CPU</div>
                  <div className="mt-1 h-1.5 border border-black bg-cyber-yellow">
                    <div className="h-full w-2/3 bg-signal-pink os-meter" />
                  </div>
                  <div className="mt-1 text-[6px] font-mono">secure kernel live</div>
                </div>
                <div className="absolute right-16 bottom-11 w-24 bg-cyber-yellow border-2 border-black p-2 text-black shadow-[5px_5px_0_#000] rotate-6 animate-brutal-float-delayed">
                  <div className="text-[7px] font-black">TODAY</div>
                  <div className="text-[10px] font-black">{currentTime}</div>
                </div>
                <div className="relative z-10 grid grid-flow-col grid-rows-4 gap-3 w-fit">
                  <div
                    onClick={() => onNavigate("terminal")}
                    className="flex flex-col items-center gap-0.5 group cursor-pointer w-12"
                  >
                    <div className="w-9 h-9 bg-white text-black flex items-center justify-center border-2 border-black shadow-[3px_3px_0_#000] group-hover:translate-x-0.5 group-hover:translate-y-0.5 group-hover:shadow-[1px_1px_0_#000] transition-all">
                      <span className="material-symbols-outlined text-signal-pink text-lg">
                        terminal
                      </span>
                    </div>
                    <span className="text-[7px] text-white font-medium drop-shadow-md text-center">
                      Terminal
                    </span>
                  </div>

                  <div
                    onClick={() => onNavigate("projects")}
                    className="flex flex-col items-center gap-0.5 group cursor-pointer w-12"
                  >
                    <div className="w-9 h-9 bg-cyber-yellow text-black flex items-center justify-center border-2 border-black shadow-[3px_3px_0_#000] group-hover:translate-x-0.5 group-hover:translate-y-0.5 group-hover:shadow-[1px_1px_0_#000] transition-all">
                      <span className="material-symbols-outlined text-blue-400 text-lg">
                        folder
                      </span>
                    </div>
                    <span className="text-[7px] text-white font-medium drop-shadow-md text-center">
                      Projects
                    </span>
                  </div>

                  <a
                    href="https://drive.google.com/uc?export=download&id=1XsJ_-7ikwZFUhBgpmkFljAzOvBo86YLO"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-0.5 group cursor-pointer w-12"
                  >
                    <div className="w-9 h-9 bg-signal-pink text-black flex items-center justify-center border-2 border-black shadow-[3px_3px_0_#000] group-hover:translate-x-0.5 group-hover:translate-y-0.5 group-hover:shadow-[1px_1px_0_#000] transition-all">
                      <span className="material-symbols-outlined text-cyber-yellow text-lg">
                        description
                      </span>
                    </div>
                    <span className="text-[7px] text-white font-medium drop-shadow-md text-center">
                      Resume
                    </span>
                  </a>
                </div>

                {activeWindow === "terminal" && (
                  <div className="absolute top-[7%] left-[4%] z-20 w-[92%] h-[76%] bg-[#0c0c0c] shadow-[7px_7px_0_#000] border-2 border-black flex flex-col overflow-hidden terminal-window-enter">
                    <div className="h-6 bg-white text-black flex justify-between items-center px-2 border-b-2 border-black shrink-0">
                      <div className="flex gap-1.5">
                        <div
                          onClick={() => onNavigate("desktop")}
                          className="w-2 h-2 rounded-full bg-[#ff5f56] cursor-pointer hover:brightness-125"
                        />
                        <div className="w-2 h-2 rounded-full bg-[#ffbd2e]" />
                        <div className="w-2 h-2 rounded-full bg-[#27c93f]" />
                      </div>
                      <span className="text-[8px] text-black/70 font-mono font-black">
                        alen@os: ~
                      </span>
                      <div className="w-8" />
                    </div>
                    <TerminalApp onClose={() => onNavigate("desktop")} />
                  </div>
                )}

                {activeWindow === "projects" && (
                  <div className="absolute top-[10%] left-[8%] z-20 w-[84%] h-[70%] bg-[#1a1a1a] shadow-[7px_7px_0_#000] border-2 border-black flex flex-col overflow-hidden terminal-window-enter">
                    <div className="h-6 bg-cyber-yellow text-black flex justify-between items-center px-2 border-b-2 border-black shrink-0">
                      <div className="flex gap-1.5">
                        <div
                          onClick={() => onNavigate("desktop")}
                          className="w-2 h-2 rounded-full bg-[#ff5f56] cursor-pointer hover:brightness-125"
                        />
                        <div className="w-2 h-2 rounded-full bg-[#ffbd2e]" />
                        <div className="w-2 h-2 rounded-full bg-[#27c93f]" />
                      </div>
                      <span className="text-[8px] text-black/70 font-mono font-black">
                        projects
                      </span>
                      <div className="w-8" />
                    </div>
                    <div className="p-3 grid grid-cols-2 gap-2 overflow-y-auto custom-computer-scroll min-h-0">
                      {[
                        {
                          title: "Recon Analyzer",
                          desc: "Attack surface audit tool.",
                          color: "text-signal-pink",
                        },
                        {
                          title: "Site Infra",
                          desc: "Vulnerability scanner.",
                          color: "text-blue-400",
                        },
                        {
                          title: "onlyU Chat",
                          desc: "E2E encrypted platform.",
                          color: "text-cyber-yellow",
                        },
                        {
                          title: "Assistive HW",
                          desc: "AI environment narration.",
                          color: "text-green-400",
                        },
                      ].map((p) => (
                        <div
                          key={p.title}
                          className="bg-white border-2 border-black p-2 shadow-[3px_3px_0_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[1px_1px_0_#000] transition-all cursor-pointer"
                        >
                          <h4 className={`font-bold text-[9px] ${p.color}`}>
                            {p.title}
                          </h4>
                          <p className="text-[7px] text-black/70 mt-0.5">
                            {p.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeWindow === "wifi" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-40">
                    <div className="w-[70%] max-w-[200px] bg-white text-black shadow-[7px_7px_0_#000] border-2 border-black overflow-hidden terminal-window-enter">
                      <div className="p-3">
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="font-black text-black flex items-center gap-1 text-[9px]">
                            <span className="material-symbols-outlined text-[10px]">
                              wifi
                            </span>
                            Networks
                          </h3>
                          <button
                            onClick={() => onNavigate("desktop")}
                            className="text-black/50 hover:text-black"
                          >
                            <span className="material-symbols-outlined text-[10px]">
                              close
                            </span>
                          </button>
                        </div>
                        <div className="space-y-1">
                          {[
                            "Pretty Fly for a Wi-Fi",
                            "Wu-Tang Lan",
                            "FBI Surveillance Van #4",
                            "It Hurts When IP",
                            "Alen's Secret Server",
                          ].map((ssid) => (
                            <div
                              key={ssid}
                              className="flex items-center justify-between p-2 hover:bg-cyber-yellow cursor-pointer group transition-colors border border-transparent hover:border-black"
                            >
                              <span className="text-[8px] text-black/80 group-hover:text-black truncate mr-2">
                                {ssid}
                              </span>
                              <span className="material-symbols-outlined text-[10px] text-black/40 group-hover:text-black shrink-0">
                                signal_wifi_4_bar
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeWindow === "boot" && (
                  <div className="absolute inset-0 bg-black z-50 flex flex-col items-center justify-center font-mono terminal-boot">
                    <div className="w-48 space-y-3">
                      <div className="text-cyber-yellow text-[10px] animate-pulse font-black">
                        ALEN.SH_OS_v3.1
                      </div>
                      <div className="text-white/50 text-[7px] leading-relaxed">
                        wake signal accepted<br />
                        decrypting workspace<br />
                        mounting desktop environment
                      </div>
                      <div className="w-full h-2 bg-white/10 border border-white/20 overflow-hidden">
                        <div
                          className="h-full bg-cyber-yellow os-boot-bar"
                          style={{ width: "70%" }}
                        />
                      </div>
                      <div className="text-white/25 text-[7px] text-center">
                        retina compositor online
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="h-10 flex items-center justify-center mb-1 z-20 shrink-0">
                <div className="bg-white px-2 py-1 border-2 border-black flex gap-2 shadow-[4px_4px_0_#000]">
                  <div
                    onClick={() => onNavigate("terminal")}
                    className={`w-7 h-7 bg-signal-pink border-2 border-black flex items-center justify-center hover:-translate-y-0.5 transition-all cursor-pointer ${
                      activeWindow === "terminal" ? "ring-2 ring-black" : ""
                    }`}
                  >
                    <span className="material-symbols-outlined text-white text-sm">
                      terminal
                    </span>
                  </div>
                  <div
                    onClick={() => onNavigate("projects")}
                    className={`w-7 h-7 bg-[#00a6ff] border-2 border-black flex items-center justify-center hover:-translate-y-0.5 transition-all cursor-pointer ${
                      activeWindow === "projects" ? "ring-2 ring-black" : ""
                    }`}
                  >
                    <span className="material-symbols-outlined text-white text-sm">
                      folder
                    </span>
                  </div>
                  <div className="w-7 h-7 bg-cyber-yellow border-2 border-black flex items-center justify-center hover:-translate-y-0.5 transition-all cursor-pointer">
                    <span className="material-symbols-outlined text-white text-sm">
                      public
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Html>
        </mesh>
      </group>
    </group>
  );
}

function RoomEnvironment() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
        <planeGeometry args={[16, 18]} />
        <meshStandardMaterial color="#ece7dc" roughness={0.72} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.985, 2.9]}>
        <planeGeometry args={[5.8, 2.4]} />
        <meshStandardMaterial color="#111111" roughness={0.82} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.975, 2.9]}>
        <planeGeometry args={[5.25, 1.9]} />
        <meshStandardMaterial color="#ffd600" roughness={0.78} />
      </mesh>

      <mesh position={[0, 3.1, -8]} receiveShadow>
        <boxGeometry args={[16, 8.2, 0.16]} />
        <meshStandardMaterial color="#f8f4ea" roughness={0.86} />
      </mesh>
      <mesh position={[-8, 3.1, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[18, 8.2, 0.16]} />
        <meshStandardMaterial color="#ff4dff" roughness={0.78} />
      </mesh>
      <mesh position={[8, 3.1, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <boxGeometry args={[18, 8.2, 0.16]} />
        <meshStandardMaterial color="#00fb40" roughness={0.78} />
      </mesh>
      <mesh position={[0, 7.16, 0]} rotation={[Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[16, 18]} />
        <meshStandardMaterial color="#111111" roughness={0.7} />
      </mesh>

      <RoundedBox
        args={[8.7, 0.28, 4.6]}
        radius={0.08}
        smoothness={6}
        position={[0, -0.86, 0.2]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#ffffff" roughness={0.36} />
      </RoundedBox>
      <mesh position={[0.13, -1.06, 0.36]}>
        <boxGeometry args={[8.8, 0.16, 4.7]} />
        <meshStandardMaterial color="#000000" />
      </mesh>

      {[
        [-3.7, -1.75, -1.6],
        [3.7, -1.75, -1.6],
        [-3.7, -1.75, 2],
        [3.7, -1.75, 2],
      ].map(([x, y, z]) => (
        <mesh key={`${x}-${z}`} position={[x, y, z]} castShadow>
          <boxGeometry args={[0.22, 1.55, 0.22]} />
          <meshStandardMaterial color="#111111" roughness={0.45} />
        </mesh>
      ))}

      <group position={[0, 3.2, -7.88]}>
        <mesh position={[-4.5, 0.6, 0]} castShadow>
          <boxGeometry args={[2.4, 2.9, 0.12]} />
          <meshStandardMaterial color="#ffd600" roughness={0.5} />
        </mesh>
        <Text position={[-4.5, 0.63, 0.08]} fontSize={0.22} color="#111111">
          NETWORK MAP
        </Text>

        <mesh position={[0, 0.7, 0]} castShadow>
          <boxGeometry args={[3.4, 2.2, 0.12]} />
          <meshStandardMaterial color="#111111" roughness={0.5} />
        </mesh>
        <Text position={[0, 1.25, 0.09]} fontSize={0.34} color="#ffffff">
          ALEN.SH
        </Text>
        <Text position={[0, 0.78, 0.09]} fontSize={0.16} color="#ffd600">
          SECURE TERMINAL ROOM
        </Text>
        <mesh position={[4.25, 0.35, 0]} castShadow>
          <boxGeometry args={[2.2, 2.2, 0.12]} />
          <meshStandardMaterial color="#00fb40" roughness={0.5} />
        </mesh>
        <Text position={[4.25, 0.37, 0.09]} fontSize={0.18} color="#111111">
          SYSTEMS ONLINE
        </Text>

        <mesh position={[0, -1.15, 0.05]} castShadow>
          <boxGeometry args={[7.4, 0.08, 0.12]} />
          <meshStandardMaterial color="#ff4dff" emissive="#ff4dff" emissiveIntensity={0.45} />
        </mesh>
        <mesh position={[0, 2.45, 0.05]} castShadow>
          <boxGeometry args={[7.4, 0.08, 0.12]} />
          <meshStandardMaterial color="#00fb40" emissive="#00fb40" emissiveIntensity={0.42} />
        </mesh>
      </group>

      <group position={[-7.88, 2.8, -1.8]} rotation={[0, Math.PI / 2, 0]}>
        <mesh position={[0, 0.9, 0.05]} castShadow>
          <boxGeometry args={[3.2, 0.12, 0.16]} />
          <meshStandardMaterial color="#111111" />
        </mesh>
        {[-1.15, 0, 1.15].map((x, index) => (
          <mesh key={x} position={[x, 1.22, 0.08]} castShadow>
            <boxGeometry args={[0.72, 0.54 + index * 0.12, 0.22]} />
            <meshStandardMaterial
              color={index === 0 ? "#ffd600" : index === 1 ? "#ffffff" : "#00fb40"}
              roughness={0.55}
            />
          </mesh>
        ))}
        <mesh position={[0, -0.45, 0.06]} castShadow>
          <boxGeometry args={[3.4, 1.9, 0.1]} />
          <meshStandardMaterial color="#ffffff" roughness={0.55} />
        </mesh>
        <Text position={[0, -0.16, 0.13]} fontSize={0.18} color="#111111">
          PACKET FLOW
        </Text>
        {[-1.1, -0.35, 0.4, 1.15].map((x) => (
          <mesh key={x} position={[x, -0.72, 0.13]} castShadow>
            <boxGeometry args={[0.42, 0.42, 0.08]} />
            <meshStandardMaterial color="#ff4dff" roughness={0.45} />
          </mesh>
        ))}
      </group>

      <group position={[7.88, 2.85, -0.4]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh position={[0, 0.95, 0.06]} castShadow>
          <boxGeometry args={[3.4, 1.7, 0.12]} />
          <meshStandardMaterial color="#111111" roughness={0.48} />
        </mesh>
        <Text position={[0, 1.18, 0.14]} fontSize={0.18} color="#ffd600">
          BUILD LOG
        </Text>
        <Text position={[0, 0.82, 0.14]} fontSize={0.11} color="#ffffff">
          exploits patched / demos live
        </Text>
        <mesh position={[-1.25, -0.55, 0.08]} castShadow>
          <boxGeometry args={[0.85, 0.85, 0.1]} />
          <meshStandardMaterial color="#ffd600" roughness={0.5} />
        </mesh>
        <mesh position={[0, -0.55, 0.08]} castShadow>
          <boxGeometry args={[0.85, 0.85, 0.1]} />
          <meshStandardMaterial color="#ffffff" roughness={0.5} />
        </mesh>
        <mesh position={[1.25, -0.55, 0.08]} castShadow>
          <boxGeometry args={[0.85, 0.85, 0.1]} />
          <meshStandardMaterial color="#ff4dff" roughness={0.5} />
        </mesh>
      </group>

      <group position={[0, 6.7, 1.3]} rotation={[Math.PI / 2.55, 0, 0]}>
        <mesh castShadow>
          <boxGeometry args={[HOMEPAGE_PANEL.worldWidth + 0.35, HOMEPAGE_PANEL.worldHeight + 0.35, 0.08]} />
          <meshStandardMaterial color="#ffffff" roughness={0.38} />
        </mesh>
        <mesh position={[0.08, -0.08, -0.08]}>
          <boxGeometry args={[HOMEPAGE_PANEL.worldWidth + 0.42, HOMEPAGE_PANEL.worldHeight + 0.42, 0.04]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        <mesh position={[0, 0, 0.05]}>
          <boxGeometry args={[HOMEPAGE_PANEL.worldWidth, HOMEPAGE_PANEL.worldHeight, 0.03]} />
          <meshStandardMaterial color="#f9f9f9" />
          <Html
            transform
            distanceFactor={HOMEPAGE_PANEL_DISTANCE_FACTOR}
            position={[0, 0, 0.04]}
            style={{
              width: `${HOMEPAGE_PANEL.cssWidth}px`,
              height: `${HOMEPAGE_PANEL.cssHeight}px`,
              overflow: "hidden",
              pointerEvents: "none",
              background: "#f9f9f9",
            }}
          >
            <iframe
              src="/"
              title="Live portfolio page"
              className="h-full w-full border-0 bg-white"
              tabIndex={-1}
            />
          </Html>
        </mesh>
      </group>
    </group>
  );
}

export default function TerminalScene({ onBack }: { onBack?: () => void }) {
  const [activeWindow, setActiveWindow] = useState<ActiveWindow>("boot");
  const [isMounted, setIsMounted] = useState(false);
  const [isLaptopOpen, setIsLaptopOpen] = useState(false);
  const bootTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (bootTimerRef.current) {
      clearTimeout(bootTimerRef.current);
      bootTimerRef.current = null;
    }

    if (!isLaptopOpen) {
      setActiveWindow("boot");
      return;
    }

    setActiveWindow("boot");
    bootTimerRef.current = setTimeout(() => {
      setActiveWindow("desktop");
    }, 1700);

    return () => {
      if (bootTimerRef.current) {
        clearTimeout(bootTimerRef.current);
      }
    };
  }, [isLaptopOpen]);

  if (!isMounted) return null;

  return (
    <div className="terminal-scene fixed inset-0 z-[60] bg-black">
      <button
        onClick={() => (onBack ? onBack() : window.location.reload())}
        className="fixed top-3 left-3 md:top-6 md:left-6 z-[110] bg-cyber-yellow text-black px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-black border-2 border-black neubrutalist-shadow-hover transition-all"
      >
        BACK TO PORTFOLIO
      </button>

      <div className="pointer-events-none fixed bottom-4 left-1/2 z-[110] -translate-x-1/2 border-2 border-black bg-white px-3 py-2 text-center font-mono text-[10px] font-black text-black shadow-[5px_5px_0_#000] md:text-xs">
        CLICK SCENE TO LOOK AROUND · WASD TO WALK · CLICK MACBOOK TO OPEN/CLOSE
      </div>

      <Canvas
        className="terminal-canvas"
        shadows
        camera={{ position: [0, 1.7, 7.4], fov: 58 }}
      >
        <FirstPersonRig />
        <PointerLockControls selector=".terminal-canvas" makeDefault />
        <ambientLight intensity={0.34} />
        <spotLight
          position={[0, 6.8, 2.5]}
          angle={0.65}
          penumbra={1}
          intensity={1.7}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <pointLight position={[-4, 2.2, 3.5]} intensity={0.85} color="#ff4dff" />
        <pointLight position={[4, 2.5, -2.5]} intensity={0.75} color="#00fb40" />
        <Environment preset="apartment" />

        <RoomEnvironment />

        <ComputerModel
          activeWindow={activeWindow}
          onNavigate={(win) => setActiveWindow(win)}
          isOpen={isLaptopOpen}
          onToggleOpen={() => setIsLaptopOpen((open) => !open)}
        />

        <ContactShadows
          position={[0, -0.82, 0]}
          opacity={0.4}
          scale={8}
          blur={2.4}
          far={4.5}
        />
      </Canvas>
    </div>
  );
}
