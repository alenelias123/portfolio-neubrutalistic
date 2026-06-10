"use client";

import React, { useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { 
  OrbitControls, 
  Html, 
  Text,
  Float,
  MeshReflectorMaterial,
  Environment,
  ContactShadows
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
    ""
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
          "Coding/Fun: hack, scan, create, run, ls"
        ];
        break;
      case "hack":
        response = ["CONNECTING...", "BYPASSING FIREWALL...", "ACCESS GRANTED."];
        break;
      case "scan":
        response = ["Scanning ports...", "Port 80: OPEN", "Vulnerability Found: CVE-2024-X"];
        break;
      case "create":
        if (!arg) { response = "Error: Specify a filename."; } 
        else { setFiles({ ...files, [arg]: `print("Hello World")` }); response = `File '${arg}' created.`; }
        break;
      case "run":
        if (!arg || !files[arg]) { response = `Error: File '${arg}' not found.`; } 
        else { response = [`Executing ${arg}...`, "SUCCESS: Code executed."]; }
        break;
      case "ls":
        response = Object.keys(files).join("  ") || "No files found.";
        break;
      case "about":
        response = "Computer Science and Engineering student at CUSAT.";
        break;
      case "clear":
        setHistory([]);
        setInput("");
        return;
      case "exit":
        onClose();
        return;
      case "": break;
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
      className="flex-grow p-4 font-mono text-green-500 overflow-y-auto scrollbar-hide text-[10px]"
      onClick={() => inputRef.current?.focus()}
    >
      {history.map((line, i) => (
        <div key={i} className="whitespace-pre-wrap">{line}</div>
      ))}
      <form onSubmit={handleCommand} className="flex">
        <span className="mr-2">ALEN@OS:~$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-grow bg-transparent border-none outline-none text-green-500"
          autoFocus
        />
      </form>
    </div>
  );
}

function ComputerModel({ activeWindow, onNavigate }: { activeWindow: string, onNavigate: (win: any) => void }) {
  const meshRef = useRef<THREE.Group>(null);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <group ref={meshRef} position={[0, -0.5, 0]}>
      {/* ... rest of the group content */}
      {/* Main Case - Solid block */}
      <mesh position={[0, 0, -0.05]} castShadow>
        <boxGeometry args={[4, 3, 2.1]} />
        <meshStandardMaterial color="#e0e0e0" metalness={0.2} roughness={0.1} />
      </mesh>

      {/* Front Bezel - To hold the screen */}
      <mesh position={[0, 0.2, 1.01]}>
        <boxGeometry args={[3.8, 2.4, 0.1]} />
        <meshStandardMaterial color="#222" metalness={0.5} roughness={0.2} />
      </mesh>

      {/* Screen Display - With Occlusion */}
      <mesh position={[0, 0.2, 1.07]}>
        <boxGeometry args={[3.5, 2.1, 0.01]} />
        <meshStandardMaterial color="#000" emissive="#000" roughness={0} metalness={1} />
        <Html
          transform
          distanceFactor={2.8}
          position={[0, 0, 0.01]}
          occlude="blending"
          style={{
            width: "500px",
            height: "300px",
            background: "#1a1a1a",
            color: "#fff",
            fontFamily: "sans-serif",
            fontSize: "12px",
            overflow: "hidden",
            pointerEvents: "auto",
            borderRadius: "4px",
            boxShadow: "inset 0 0 50px rgba(0,0,0,0.5)"
          }}
        >
          <div className="w-full h-full flex flex-col select-none relative overflow-hidden">
            {/* Linux Top Bar */}
            <div className="bg-black px-3 py-1 flex justify-between items-center text-[10px] border-b border-white/10 z-20">
              <div className="flex gap-4">
                <span className="font-bold text-cyber-yellow capitalize">{activeWindow === 'boot' ? 'System' : activeWindow}</span>
              </div>
              <div className="font-medium opacity-80">{currentTime}</div>
              <div className="flex gap-2">
                <button onClick={() => onNavigate("wifi")} className="material-symbols-outlined text-[14px] hover:text-cyber-yellow transition-colors">wifi</button>
                <button onClick={() => window.location.reload()} className="material-symbols-outlined text-[14px] hover:text-red-500 transition-colors">power_settings_new</button>
              </div>
            </div>
            
            {/* Screen Content Wrapper */}
            <div className="flex-grow relative bg-gradient-to-br from-[#2c3e50] to-[#000000] overflow-y-auto custom-computer-scroll">
              
              {/* BOOT VIEW */}
              {activeWindow === "boot" && (
                <div className="absolute inset-0 bg-black z-50 flex flex-col items-center justify-center font-mono p-10">
                  <div className="w-full max-w-xs space-y-2">
                    <div className="text-terminal-green text-[10px] animate-pulse">{" >> INITIALIZING BIOS..."}</div>
                    <div className="text-white/40 text-[8px]">Memory Check: 6442450944 Bytes OK</div>
                    <div className="text-white/40 text-[8px]">Disk 0: ST31000524AS - S.M.A.R.T. OK</div>
                    <div className="text-white/40 text-[8px]">Loading Kernel 6.8.0-generic...</div>
                    <div className="w-full h-1 bg-white/10 mt-4 overflow-hidden">
                      <div className="h-full bg-cyber-yellow animate-[loading_2s_ease-in-out_infinite]" style={{ width: '40%' }} />
                    </div>
                    <div className="text-center pt-4 text-cyber-yellow font-bold text-[12px]">ALEN_OS</div>
                  </div>
                </div>
              )}

              {/* PROJECTS VIEW */}
              {activeWindow === "projects" && (
                <div className="p-4 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <h3 className="font-bold text-blue-400 flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">folder_open</span>
                      Critical_Deployments
                    </h3>
                    <button onClick={() => onNavigate("desktop")} className="text-white/40 hover:text-white">
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  </div>
                  <div className="grid gap-3">
                    {[
                      { title: "Recon Analyzer", desc: "External attack surface audit tool.", stack: "Next.js, FastAPI" },
                      { title: "Site Infrastructure", desc: "Architectural vulnerability analyzer.", stack: "JS, Chrome API" },
                      { title: "onlyU - E2E Chat", desc: "Zero-knowledge encrypted platform.", stack: "Cryptography, Sec" },
                      { title: "Assistive Hardware", desc: "AI-powered environment narration.", stack: "Pi 5, Gemini" }
                    ].map((p) => (
                      <div key={p.title} className="bg-white/5 border border-white/10 p-3 rounded-lg hover:bg-white/10 transition-colors">
                        <h4 className="text-cyber-yellow font-bold text-[11px]">{p.title}</h4>
                        <p className="text-[9px] text-white/60 mt-1">{p.desc}</p>
                        <div className="mt-2 flex gap-2">
                          <span className="text-[7px] bg-black/40 px-1.5 py-0.5 rounded text-blue-400 border border-blue-400/20">{p.stack}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* DESKTOP VIEW */}
              {activeWindow === "desktop" && (
                <div className="p-6 grid grid-cols-4 grid-rows-4 gap-4 w-full h-full">
                  <a 
                    href="https://drive.google.com/uc?export=download&id=1XsJ_-7ikwZFUhBgpmkFljAzOvBo86YLO"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center w-fit gap-1 group cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors"
                  >
                    <div className="w-12 h-12 bg-cyber-yellow/20 rounded-lg flex items-center justify-center border border-cyber-yellow/30 shadow-lg group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-cyber-yellow text-3xl">description</span>
                    </div>
                    <span className="text-[10px] bg-black/60 px-1.5 py-0.5 rounded shadow text-white font-medium">resume.pdf</span>
                  </a>
                  
                  <div 
                    onClick={() => onNavigate("terminal")}
                    className="flex flex-col items-center w-fit gap-1 group cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors"
                  >
                    <div className="w-12 h-12 bg-signal-pink/20 rounded-lg flex items-center justify-center border border-signal-pink/30 shadow-lg group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-signal-pink text-3xl">terminal</span>
                    </div>
                    <span className="text-[10px] bg-black/60 px-1.5 py-0.5 rounded shadow text-white font-medium">Terminal</span>
                  </div>

                  <div 
                    onClick={() => onNavigate("projects")}
                    className="flex flex-col items-center w-fit gap-1 group cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors"
                  >
                    <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center border border-blue-500/30 shadow-lg group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-blue-400 text-3xl">folder</span>
                    </div>
                    <span className="text-[10px] bg-black/60 px-1.5 py-0.5 rounded shadow text-white font-medium">Projects</span>
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                    <div className="text-center">
                      <h2 className="text-4xl font-black tracking-tighter text-white">ALEN_OS</h2>
                      <p className="text-xs text-white uppercase tracking-[0.5em]">Network Security</p>
                    </div>
                  </div>
                </div>
              )}

              {/* TERMINAL VIEW */}
              {activeWindow === "terminal" && (
                <div className="w-full h-full bg-black/90 p-1 flex flex-col">
                  <div className="flex justify-between items-center bg-zinc-800 px-2 py-0.5 border-b border-zinc-700">
                    <div className="flex gap-1.5">
                      <div onClick={() => onNavigate("desktop")} className="w-2.5 h-2.5 rounded-full bg-red-500 cursor-pointer hover:brightness-125" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                    </div>
                    <span className="text-[9px] text-zinc-400 font-mono">alen@os: ~</span>
                    <div className="w-10" />
                  </div>
                  <TerminalApp onClose={() => onNavigate("desktop")} />
                </div>
              )}

              {/* WIFI VIEW */}
              {activeWindow === "wifi" && (
                <div className="w-full h-full p-8 flex items-center justify-center">
                  <div className="w-64 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl p-4 animate-in fade-in zoom-in duration-200">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-cyber-yellow flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">wifi</span>
                        Wi-Fi Networks
                      </h3>
                      <button onClick={() => onNavigate("desktop")} className="text-white/40 hover:text-white">
                        <span className="material-symbols-outlined text-sm">close</span>
                      </button>
                    </div>
                    <div className="space-y-2">
                      {[
                        "Pretty Fly for a Wi-Fi",
                        "Wu-Tang Lan",
                        "FBI Surveillance Van #4",
                        "It Hurts When IP",
                        "Virus_Infector_69",
                        "Alen's Secret Server"
                      ].map((ssid) => (
                        <div key={ssid} className="flex items-center justify-between p-2 hover:bg-white/5 rounded cursor-pointer group">
                          <span className="text-[10px] text-white/80 group-hover:text-white">{ssid}</span>
                          <span className="material-symbols-outlined text-sm text-white/20 group-hover:text-cyber-yellow">signal_wifi_4_bar</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Dock */}
            <div className="mb-4 mx-auto bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-2 flex gap-3 shadow-2xl z-20">
              <div 
                onClick={() => onNavigate("terminal")}
                className={`w-8 h-8 rounded-xl bg-gradient-to-br ${activeWindow === 'terminal' ? 'from-signal-pink border border-white/40' : 'from-signal-pink/40'} to-transparent flex items-center justify-center hover:scale-125 transition-all cursor-pointer`}
              >
                <span className="material-symbols-outlined text-white text-sm">terminal</span>
              </div>
              <div 
                onClick={() => onNavigate("projects")}
                className={`w-8 h-8 rounded-xl bg-gradient-to-br ${activeWindow === 'projects' ? 'from-cyber-yellow border border-white/40' : 'from-cyber-yellow/40'} to-transparent flex items-center justify-center hover:scale-125 transition-transform cursor-pointer`}
              >
                <span className="material-symbols-outlined text-white text-sm">folder</span>
              </div>
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-400/40 to-transparent flex items-center justify-center hover:scale-125 transition-transform cursor-pointer">
                <span className="material-symbols-outlined text-white text-sm">public</span>
              </div>
            </div>
          </div>
        </Html>
      </mesh>

      {/* Keyboard Base */}
      <mesh position={[0, -1.5, 1.8]} rotation={[-Math.PI / 12, 0, 0]} castShadow>
        <boxGeometry args={[4.2, 0.2, 1.8]} />
        <meshStandardMaterial color="#d1d1d1" metalness={0.1} roughness={0.3} />
      </mesh>

      {/* Keys (Simplified) */}
      <group position={[0, -1.4, 1.8]} rotation={[-Math.PI / 12, 0, 0]}>
        {[-1.5, -0.5, 0.5, 1.5].map((x) => 
          [-0.4, 0.4].map((z) => (
            <mesh key={`${x}-${z}`} position={[x, 0.1, z]}>
              <boxGeometry args={[0.8, 0.1, 0.6]} />
              <meshStandardMaterial color="#444" roughness={0.5} />
            </mesh>
          ))
        )}
      </group>

      {/* Back Panel Details */}
      <mesh position={[0, 0, -1.1]}>
        <boxGeometry args={[3.5, 2.5, 0.1]} />
        <meshStandardMaterial color="#ccc" />
      </mesh>
    </group>
  );
}

export default function TerminalScene() {
  const [activeWindow, setActiveWindow] = useState<"desktop" | "terminal" | "wifi" | "boot" | "projects">("boot");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Boot sequence
    const timer = setTimeout(() => {
      setActiveWindow("desktop");
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-white">
      <button 
        onClick={() => window.location.reload()}
        className="fixed top-8 left-8 z-[110] bg-cyber-yellow text-black px-4 py-2 font-black border-2 border-black neubrutalist-shadow-hover transition-all"
      >
        BACK TO PORTFOLIO
      </button>

      <Canvas shadows camera={{ position: [0, 1.5, 6], fov: 45 }}>
        {/* Room Lighting */}
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
        
        {/* Environment for reflections */}
        <Environment preset="studio" />

        <OrbitControls 
          enablePan={false} 
          minDistance={4} 
          maxDistance={10}
          maxPolarAngle={Math.PI / 2.1}
          makeDefault
        />

        {/* Room - Floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.5, 0]} receiveShadow>
          <planeGeometry args={[50, 50]} />
          <MeshReflectorMaterial
            blur={[300, 100]}
            resolution={1024}
            mixBlur={1}
            mixStrength={40}
            roughness={1}
            depthScale={1.2}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            color="#f0f0f0"
            metalness={0.05}
          />
        </mesh>

        {/* Walls */}
        <mesh position={[0, 7.5, -10]} receiveShadow>
          <planeGeometry args={[50, 20]} />
          <meshStandardMaterial color="#ffffff" roughness={0.8} />
        </mesh>
        <mesh position={[-10, 7.5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
          <planeGeometry args={[50, 20]} />
          <meshStandardMaterial color="#fafafa" roughness={0.8} />
        </mesh>
        <mesh position={[10, 7.5, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
          <planeGeometry args={[50, 20]} />
          <meshStandardMaterial color="#fafafa" roughness={0.8} />
        </mesh>

        {/* Desk */}
        <mesh position={[0, -2.4, 0.5]} receiveShadow castShadow>
          <boxGeometry args={[12, 0.2, 5]} />
          <meshStandardMaterial color="#ffffff" roughness={0.2} metalness={0.1} />
        </mesh>

        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
          <ComputerModel 
            activeWindow={activeWindow} 
            onNavigate={(win) => setActiveWindow(win)} 
          />
        </Float>

        <ContactShadows 
          position={[0, -2.5, 0]} 
          opacity={0.4} 
          scale={20} 
          blur={2.4} 
          far={4.5} 
        />

        <Text
          position={[0, 4, -5]}
          fontSize={1.2}
          color="#000000"
          anchorX="center"
          anchorY="middle"
          fillOpacity={0.1}
        >
          ALEN.SH_LABS
        </Text>
      </Canvas>
    </div>
  );
}
