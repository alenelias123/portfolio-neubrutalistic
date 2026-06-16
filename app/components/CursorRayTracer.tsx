"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

const C = {
  pink: 0xff4dff,
  yellow: 0xffd600,
  green: 0x00fb40,
  black: 0x1b1b1b,
  gray: 0xaaaaaa,
};

export default function CursorRayTracer() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    gsap.registerPlugin(MotionPathPlugin);

    let W = window.innerWidth;
    let H = window.innerHeight;

    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(50, W / H, 0.1, 100);
    cam.position.set(0, 5, 13);
    cam.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    const emGeo = new THREE.OctahedronGeometry(0.42, 0);
    const emLine = new THREE.LineSegments(
      new THREE.EdgesGeometry(emGeo),
      new THREE.LineBasicMaterial({ color: C.black, transparent: true, opacity: 0.5 })
    );
    scene.add(emLine);

    const outerBoxGeo = new THREE.BoxGeometry(0.52, 0.52, 0.52);
    const innerBoxGeo = new THREE.BoxGeometry(0.2, 0.2, 0.2);

    interface Node {
      group: THREE.Group;
      core: THREE.Mesh;
      edges: THREE.LineSegments;
      base: THREE.Vector3;
      freqX: number; phaseX: number; ampX: number;
      freqY: number; phaseY: number; ampY: number;
      freqZ: number; phaseZ: number; ampZ: number;
      spinX: number; spinY: number; spinZ: number;
      highlight: number;
      scatterProgress: number;
      scatterSpeed: number;
      activated: boolean;
      particleMode: boolean;
    }

    const mkNode = (x: number, y: number, z: number, coreColor: number): Node => {
      const group = new THREE.Group();
      const edges = new THREE.LineSegments(
        new THREE.EdgesGeometry(outerBoxGeo),
        new THREE.LineBasicMaterial({ color: C.gray, transparent: true, opacity: 0 })
      );
      group.add(edges);
      const core = new THREE.Mesh(
        innerBoxGeo,
        new THREE.MeshBasicMaterial({ color: coreColor, transparent: true, opacity: 0 })
      );
      group.add(core);
      scene.add(group);

      return {
        group, core, edges, base: new THREE.Vector3(x, y, z),
        freqX: 0.0004 + Math.random() * 0.0006, phaseX: Math.random() * Math.PI * 2, ampX: 0.35 + Math.random() * 0.55,
        freqY: 0.0005 + Math.random() * 0.0007, phaseY: Math.random() * Math.PI * 2, ampY: 0.28 + Math.random() * 0.45,
        freqZ: 0.0003 + Math.random() * 0.0005, phaseZ: Math.random() * Math.PI * 2, ampZ: 0.30 + Math.random() * 0.50,
        spinX: (Math.random() - 0.5) * 0.0014,
        spinY: (Math.random() - 0.5) * 0.0018,
        spinZ: (Math.random() - 0.5) * 0.0008,
        highlight: 0,
        scatterProgress: 0,
        scatterSpeed: 0.01 + Math.random() * 0.015,
        activated: false,
        particleMode: x > -100, // Nodes used as particles
      };
    };

    const nodes: Node[] = [];
    for(let i=0; i<40; i++) {
        const node = mkNode(gsap.utils.random(-15, 15), gsap.utils.random(-10, 10), gsap.utils.random(-10, 10), i%2?C.pink:C.yellow);
        nodes.push(node);
        
        // Use GSAP for infinite drifting
        gsap.to(node.base, {
            x: "+=2",
            y: "+=2",
            z: "+=1",
            duration: gsap.utils.random(5, 10),
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    }

    const mouseTarget = new THREE.Vector2(0, 0);
    const xTo = gsap.quickTo(mouseTarget, "x", { duration: 0.4, ease: "power3" });
    const yTo = gsap.quickTo(mouseTarget, "y", { duration: 0.4, ease: "power3" });

    const onMove = (e: MouseEvent) => {
      xTo((e.clientX / W) * 2 - 1);
      yTo(-(e.clientY / H) * 2 + 1);
    };

    const shaderGeo = new THREE.PlaneGeometry(2, 2);
    const shaderMat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 }, uScroll: { value: 0 }, uVelocity: { value: 0 } },
      vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position, 1.0); }`,
      fragmentShader: `
        uniform float uTime; uniform float uScroll; uniform float uVelocity; varying vec2 vUv;
        float random(vec2 st) { return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123); }
        void main() {
          vec2 uv = vUv;
          float grain = random(uv + uTime);
          float scanline = sin(uv.y * 400.0 + uTime * 5.0) * 0.1;
          float strength = clamp(uScroll * 0.001 + abs(uVelocity) * 0.05, 0.0, 0.5);
          gl_FragColor = vec4(vec3(0.0), (grain * strength + scanline * strength) * 0.5);
        }
      `,
      transparent: true, depthTest: false,
    });
    scene.add(new THREE.Mesh(shaderGeo, shaderMat));

    let scrollY = 0;
    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;
    const timeline = gsap.timeline();
    
    const animate = (t: number) => {
      const timeScale = gsap.utils.clamp(0, 1, 1 - window.scrollY / 1000);
      timeline.timeScale(timeScale);

      scrollVelocity = window.scrollY - lastScrollY;
      lastScrollY = window.scrollY;
      shaderMat.uniforms.uTime.value = t * 0.001;
      shaderMat.uniforms.uScroll.value = window.scrollY;
      shaderMat.uniforms.uVelocity.value = scrollVelocity;

      scrollY += (window.scrollY - scrollY) * 0.1;
      cam.position.y = 5 - scrollY * 0.015;
      cam.lookAt(0, -scrollY * 0.015, 0);

      nodes.forEach((n) => {
        const driftX = Math.sin(t * n.freqX + n.phaseX) * n.ampX;
        const driftY = Math.sin(t * n.freqY + n.phaseY) * n.ampY;
        const targetPos = new THREE.Vector3(n.base.x + driftX, n.base.y + driftY, n.base.z);
        n.group.position.lerp(targetPos, 0.05 * timeScale);
        
        n.group.rotation.x += n.spinX * timeScale;
        n.group.rotation.y += n.spinY * timeScale;

        const dist = n.group.position.distanceTo(new THREE.Vector3(mouseTarget.x * 10, mouseTarget.y * 10 - scrollY * 0.015, 0));
        if (dist < 3) {
            n.highlight = gsap.utils.mapRange(0, 3, 1, 0, dist);
        } else {
            n.highlight *= 0.9;
        }

        if (n.core.material instanceof THREE.MeshBasicMaterial) n.core.material.opacity = (0.3 + n.highlight) * timeScale;
        if (n.edges.material instanceof THREE.LineBasicMaterial) n.edges.material.opacity = (0.1 + n.highlight) * timeScale;
      });

      renderer.render(scene, cam);
      requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMove);
    const raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      renderer.dispose();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[-10] pointer-events-none select-none">
      <canvas ref={ref} className="block w-full h-full" />
    </div>
  );
}
