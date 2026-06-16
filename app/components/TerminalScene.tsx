"use client";

import React, { useState, useEffect, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  Html,
  Text,
  Environment,
  ContactShadows,
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

function ResponsiveCamera() {
  const { camera, size } = useThree();

  useEffect(() => {
    const aspect = size.width / size.height;
    if (aspect < 0.85) {
      camera.position.set(0, 2.8, 11);
    } else if (aspect < 1.2) {
      camera.position.set(0, 2.4, 9.5);
    } else {
      camera.position.set(0, 2, 8);
    }
    camera.updateProjectionMatrix();
  }, [camera, size]);

  return null;
}

function ComputerModel({
  activeWindow,
  onNavigate,
}: {
  activeWindow: ActiveWindow;
  onNavigate: (win: ActiveWindow) => void;
}) {
  const lidRef = useRef<THREE.Group>(null);
  const [currentTime, setCurrentTime] = useState("");
  const { width, height } = useThree((state) => state.size);
  const distanceFactor = Math.max(3.2, Math.min(6.5, width / 165));

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
    <group position={[0, -1.2, 0]}>
      <group position={[0, 0, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[6.0, 0.16, 4.2]} />
          <meshStandardMaterial color="#2a2a2a" metalness={0.9} roughness={0.15} />
        </mesh>

        <mesh position={[0, 0.081, 1.35]}>
          <boxGeometry args={[2.4, 0.005, 1.4]} />
          <meshStandardMaterial color="#252525" metalness={0.2} roughness={0.5} />
        </mesh>

        <mesh position={[0, 0.075, -0.6]}>
          <boxGeometry args={[4.4, 0.01, 2.0]} />
          <meshStandardMaterial color="#111111" />
        </mesh>

        <group position={[0, 0.085, -0.6]}>
          {Array.from({ length: 6 }).map((_, i) =>
            Array.from({ length: 14 }).map((_, j) => {
              const isSpace = i === 0 && j > 4 && j < 10;
              if (isSpace && j !== 5) return null;
              return (
                <mesh
                  key={`${i}-${j}`}
                  position={[j * 0.3 - 1.95, 0, (5 - i) * 0.32 - 0.85]}
                >
                  <boxGeometry args={[isSpace ? 1.45 : 0.26, 0.03, 0.26]} />
                  <meshStandardMaterial color="#050505" roughness={0.3} />
                </mesh>
              );
            })
          )}
        </group>

        <mesh position={[-2.95, -0.02, 0.2]}>
          <boxGeometry args={[0.01, 0.06, 0.4]} />
          <meshStandardMaterial color="#000" />
        </mesh>
        <mesh position={[2.95, -0.02, 0.2]}>
          <boxGeometry args={[0.01, 0.06, 0.4]} />
          <meshStandardMaterial color="#000" />
        </mesh>
      </group>

      <group ref={lidRef} position={[0, 0.08, -2.1]} rotation={[-0.1, 0, 0]}>
        <mesh position={[0, 1.9, -0.04]} castShadow>
          <boxGeometry args={[6.0, 3.8, 0.08]} />
          <meshStandardMaterial color="#2a2a2a" metalness={0.9} roughness={0.15} />
        </mesh>

        <mesh position={[0, 1.9, 0.01]}>
          <boxGeometry args={[5.8, 3.6, 0.02]} />
          <meshStandardMaterial color="#000000" roughness={0.1} />
        </mesh>

        <mesh position={[0, 1.9, 0.021]}>
          <boxGeometry args={[5.6, 3.4, 0.005]} />
          <meshStandardMaterial
            color="#000"
            emissive="#000"
            roughness={0}
            metalness={1}
          />
          <Html
            transform
            distanceFactor={distanceFactor}
            position={[0, 0, 0.01]}
            occlude="blending"
            style={{
              width: "560px",
              height: "340px",
              background: "#1a1a1a",
              color: "#fff",
              fontFamily: "JetBrains Mono, monospace",
              overflow: "hidden",
              pointerEvents: "auto",
              borderRadius: "2px",
              boxShadow: "inset 0 0 60px rgba(0,0,0,0.8)",
            }}
          >
            <div className="w-full h-full flex flex-col select-none relative overflow-hidden bg-[#050505]">
              <div className="h-5 bg-black/80 backdrop-blur-md px-2 flex justify-between items-center text-[8px] border-b border-white/5 z-20 shrink-0">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-black text-cyber-yellow tracking-tighter shrink-0">
                    ALEN_OS
                  </span>
                  <div className="hidden sm:flex gap-2 text-white/60">
                    <span className="cursor-default hover:text-white">File</span>
                    <span className="cursor-default hover:text-white">Edit</span>
                    <span className="cursor-default hover:text-white">View</span>
                    <span className="cursor-default hover:text-white">Terminal</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    onClick={() => onNavigate("wifi")}
                    className="material-symbols-outlined text-[10px] text-white/60 cursor-pointer hover:text-cyber-yellow transition-colors"
                  >
                    wifi
                  </span>
                  <span className="material-symbols-outlined text-[10px] text-white/60">
                    battery_full
                  </span>
                  <span className="font-medium text-white/80 text-[8px]">
                    {currentTime}
                  </span>
                </div>
              </div>

              <div className="flex-grow relative bg-gradient-to-br from-[#1a1c2c] via-[#4d194d] to-[#000000] overflow-hidden p-3 min-h-0">
                <div className="grid grid-flow-col grid-rows-4 gap-3 w-fit">
                  <div
                    onClick={() => onNavigate("terminal")}
                    className="flex flex-col items-center gap-0.5 group cursor-pointer w-12"
                  >
                    <div className="w-9 h-9 bg-black/40 backdrop-blur-md rounded-lg flex items-center justify-center border border-white/10 group-hover:bg-white/10 transition-all">
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
                    <div className="w-9 h-9 bg-black/40 backdrop-blur-md rounded-lg flex items-center justify-center border border-white/10 group-hover:bg-white/10 transition-all">
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
                    <div className="w-9 h-9 bg-black/40 backdrop-blur-md rounded-lg flex items-center justify-center border border-white/10 group-hover:bg-white/10 transition-all">
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
                  <div className="absolute top-[6%] left-[4%] w-[92%] h-[78%] bg-[#0c0c0c] rounded-lg shadow-2xl border border-white/10 flex flex-col overflow-hidden terminal-window-enter">
                    <div className="h-6 bg-[#1a1a1a] flex justify-between items-center px-2 border-b border-white/5 shrink-0">
                      <div className="flex gap-1.5">
                        <div
                          onClick={() => onNavigate("desktop")}
                          className="w-2 h-2 rounded-full bg-[#ff5f56] cursor-pointer hover:brightness-125"
                        />
                        <div className="w-2 h-2 rounded-full bg-[#ffbd2e]" />
                        <div className="w-2 h-2 rounded-full bg-[#27c93f]" />
                      </div>
                      <span className="text-[8px] text-white/40 font-mono italic">
                        alen@os: ~
                      </span>
                      <div className="w-8" />
                    </div>
                    <TerminalApp onClose={() => onNavigate("desktop")} />
                  </div>
                )}

                {activeWindow === "projects" && (
                  <div className="absolute top-[10%] left-[8%] w-[84%] h-[70%] bg-[#1a1a1a] rounded-lg shadow-2xl border border-white/10 flex flex-col overflow-hidden terminal-window-enter">
                    <div className="h-6 bg-[#252525] flex justify-between items-center px-2 border-b border-white/5 shrink-0">
                      <div className="flex gap-1.5">
                        <div
                          onClick={() => onNavigate("desktop")}
                          className="w-2 h-2 rounded-full bg-[#ff5f56] cursor-pointer hover:brightness-125"
                        />
                        <div className="w-2 h-2 rounded-full bg-[#ffbd2e]" />
                        <div className="w-2 h-2 rounded-full bg-[#27c93f]" />
                      </div>
                      <span className="text-[8px] text-white/40 font-mono italic">
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
                          className="bg-white/5 border border-white/5 p-2 rounded-md hover:bg-white/10 transition-colors cursor-pointer"
                        >
                          <h4 className={`font-bold text-[9px] ${p.color}`}>
                            {p.title}
                          </h4>
                          <p className="text-[7px] text-white/60 mt-0.5">
                            {p.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeWindow === "wifi" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-40">
                    <div className="w-[70%] max-w-[200px] bg-[#1a1a1a] rounded-xl shadow-2xl border border-white/10 overflow-hidden terminal-window-enter">
                      <div className="p-3">
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="font-bold text-cyber-yellow flex items-center gap-1 text-[9px]">
                            <span className="material-symbols-outlined text-[10px]">
                              wifi
                            </span>
                            Networks
                          </h3>
                          <button
                            onClick={() => onNavigate("desktop")}
                            className="text-white/40 hover:text-white"
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
                              className="flex items-center justify-between p-2 hover:bg-white/5 rounded-lg cursor-pointer group transition-colors"
                            >
                              <span className="text-[8px] text-white/80 group-hover:text-white truncate mr-2">
                                {ssid}
                              </span>
                              <span className="material-symbols-outlined text-[10px] text-white/20 group-hover:text-cyber-yellow shrink-0">
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
                  <div className="absolute inset-0 bg-black z-50 flex flex-col items-center justify-center font-mono">
                    <div className="w-40 space-y-3">
                      <div className="text-cyber-yellow text-[9px] animate-pulse font-bold">
                        ALEN.SH_OS_v2.0
                      </div>
                      <div className="w-full h-0.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-cyber-yellow animate-[loading_2s_ease-in-out_infinite]"
                          style={{ width: "60%" }}
                        />
                      </div>
                      <div className="text-white/20 text-[7px] text-center">
                        Loading secure kernel modules...
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="h-10 flex items-center justify-center mb-1 z-20 shrink-0">
                <div className="bg-white/10 backdrop-blur-2xl px-2 py-1 rounded-xl border border-white/10 flex gap-2 shadow-2xl">
                  <div
                    onClick={() => onNavigate("terminal")}
                    className={`w-7 h-7 rounded-lg bg-gradient-to-br from-signal-pink to-transparent flex items-center justify-center hover:scale-110 transition-all cursor-pointer shadow-lg ${
                      activeWindow === "terminal" ? "ring-1 ring-white/40" : ""
                    }`}
                  >
                    <span className="material-symbols-outlined text-white text-sm">
                      terminal
                    </span>
                  </div>
                  <div
                    onClick={() => onNavigate("projects")}
                    className={`w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-transparent flex items-center justify-center hover:scale-110 transition-all cursor-pointer shadow-lg ${
                      activeWindow === "projects" ? "ring-1 ring-white/40" : ""
                    }`}
                  >
                    <span className="material-symbols-outlined text-white text-sm">
                      folder
                    </span>
                  </div>
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyber-yellow to-transparent flex items-center justify-center hover:scale-110 transition-all cursor-pointer shadow-lg">
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

function ResponsiveOrbitControls() {
  const { size } = useThree();
  const isMobile = size.width / size.height < 0.9;

  return (
    <OrbitControls
      enablePan={false}
      minDistance={isMobile ? 7 : 5}
      maxDistance={isMobile ? 14 : 12}
      maxPolarAngle={Math.PI / 2.1}
      makeDefault
    />
  );
}

export default function TerminalScene({ onBack }: { onBack?: () => void }) {
  const [activeWindow, setActiveWindow] = useState<ActiveWindow>("boot");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const timer = setTimeout(() => {
      setActiveWindow("desktop");
    }, 2200);
    return () => clearTimeout(timer);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-black">
      <button
        onClick={() => (onBack ? onBack() : window.location.reload())}
        className="fixed top-3 left-3 md:top-6 md:left-6 z-[110] bg-cyber-yellow text-black px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-black border-2 border-black neubrutalist-shadow-hover transition-all"
      >
        BACK TO PORTFOLIO
      </button>

      <Canvas shadows camera={{ position: [0, 2, 8], fov: 45 }}>
        <ResponsiveCamera />
        <ambientLight intensity={0.8} />
        <spotLight
          position={[5, 8, 5]}
          angle={0.4}
          penumbra={1}
          intensity={1.5}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <pointLight position={[-5, 5, -5]} intensity={0.5} />
        <Environment preset="studio" />

        <ResponsiveOrbitControls />

        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, -2.5, 0]}
          receiveShadow
        >
          <planeGeometry args={[50, 50]} />
          <meshStandardMaterial
            color="#050505"
            roughness={0.1}
            metalness={0.8}
          />
        </mesh>

        <group position={[0, 5, -8]}>
          <mesh position={[-4, 0, 0]} castShadow>
            <boxGeometry args={[6, 12, 1]} />
            <meshStandardMaterial color="#ff3366" />
          </mesh>
          <mesh position={[4, -2, 0]} castShadow>
            <boxGeometry args={[8, 8, 1]} />
            <meshStandardMaterial color="#ffff00" />
          </mesh>
        </group>

        <mesh position={[0, -2.4, 0.5]} receiveShadow castShadow>
          <boxGeometry args={[14, 0.4, 6]} />
          <meshStandardMaterial color="#ffffff" roughness={0} metalness={0} />
        </mesh>
        <mesh position={[0, -2.65, 0.5]}>
          <boxGeometry args={[14.2, 0.1, 6.2]} />
          <meshStandardMaterial color="#000000" />
        </mesh>

        <ComputerModel
          activeWindow={activeWindow}
          onNavigate={(win) => setActiveWindow(win)}
        />

        <ContactShadows
          position={[0, -2.5, 0]}
          opacity={0.4}
          scale={20}
          blur={2.4}
          far={4.5}
        />

        <Text
          position={[0, 6, -7]}
          fontSize={2}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          ALEN.SH
        </Text>
        <Text
          position={[0, 4.5, -7]}
          fontSize={0.5}
          color="#ffff00"
          anchorX="center"
          anchorY="middle"
        >
          {">> MISSION_CONTROL"}
        </Text>
      </Canvas>
    </div>
  );
}
