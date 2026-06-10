"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

const C = {
  pink: 0xff4dff,
  yellow: 0xffd600,
  green: 0x00fb40,
  black: 0x1b1b1b,
  gray: 0xaaaaaa,
};

interface Node {
  group: THREE.Group;
  core: THREE.Mesh;
  edges: THREE.LineSegments;
  base: THREE.Vector3;
  // per-axis oscillation
  freqX: number; phaseX: number; ampX: number;
  freqY: number; phaseY: number; ampY: number;
  freqZ: number; phaseZ: number; ampZ: number;
  // spin
  spinX: number; spinY: number; spinZ: number;
  highlight: number;
}

export default function CursorRayTracer() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    let W = window.innerWidth;
    let H = window.innerHeight;

    /* ── scene ── */
    const scene = new THREE.Scene();
    // No scene.background → canvas stays transparent → page shows through

    /* ── camera ── */
    const cam = new THREE.PerspectiveCamera(50, W / H, 0.1, 100);
    cam.position.set(0, 5, 13);
    cam.lookAt(0, 0, 0);

    /* ── renderer (transparent bg) ── */
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0); // fully transparent


    /* ── gateway emitter ── */
    const emGeo = new THREE.OctahedronGeometry(0.42, 0);
    const emEdges = new THREE.EdgesGeometry(emGeo);
    const emLine = new THREE.LineSegments(emEdges,
      new THREE.LineBasicMaterial({ color: C.black, transparent: true, opacity: 0.5 })
    );
    emLine.position.set(-5.5, 3.0, -4);
    scene.add(emLine);

    /* ── helper: make a node ── */
    const outerBoxGeo = new THREE.BoxGeometry(0.52, 0.52, 0.52);
    const innerBoxGeo = new THREE.BoxGeometry(0.2, 0.2, 0.2);

    interface Node {
      group: THREE.Group;
      core: THREE.Mesh;
      edges: THREE.LineSegments;
      base: THREE.Vector3;
      currentPos: THREE.Vector3;
      freqX: number; phaseX: number; ampX: number;
      freqY: number; phaseY: number; ampY: number;
      freqZ: number; phaseZ: number; ampZ: number;
      spinX: number; spinY: number; spinZ: number;
      highlight: number;
      // dynamic scatter variables
      scatterProgress: number; // 0 to 1
      scatterSpeed: number;
      activated: boolean;
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

      const base = new THREE.Vector3(x, y, z);
      // Start at emitter position, then scatter outwards to base
      const emitterPos = new THREE.Vector3(-5.5, 3.0, -4);
      group.position.copy(emitterPos);
      scene.add(group);

      return {
        group, core, edges, base,
        currentPos: group.position,
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
      };
    };

    const nodes: Node[] = [
      // Page 1 (Top/Hero section) - Starts scattered or activates immediately
      mkNode(-3.2, 0.7, -2.5, C.pink),
      mkNode(2.9, 1.3, -3.0, C.yellow),
      mkNode(-0.4, -0.4, -4.0, C.pink),
      mkNode(3.6, -0.7, -1.0, C.yellow),
      mkNode(-3.8, -0.9, 1.3, C.green),
      mkNode(1.1, 0.5, 1.8, C.pink),
      mkNode(-1.0, 1.7, -1.2, C.yellow),
      mkNode(3.9, 1.0, 2.3, C.green),

      // Page 2 (Skills / Projects transition) - Y range: -3 to -10
      mkNode(-2.5, -4.0, -2.0, C.pink),
      mkNode(2.0, -5.5, -3.0, C.green),
      mkNode(-0.8, -7.0, -1.0, C.yellow),
      mkNode(3.2, -8.5, 0.5, C.pink),
      mkNode(-3.0, -10.0, 1.8, C.green),
      mkNode(1.5, -4.5, 2.2, C.yellow),

      // Page 3 (Projects / Experience transition) - Y range: -11 to -20
      mkNode(-2.0, -13.0, -3.5, C.pink),
      mkNode(3.0, -14.5, -2.0, C.yellow),
      mkNode(-1.2, -16.0, 1.0, C.green),
      mkNode(2.5, -18.0, 0.5, C.pink),
      mkNode(-3.5, -19.5, 2.0, C.green),
      mkNode(1.0, -12.0, -1.0, C.yellow),

      // Page 4 (Footer / Experience end) - Y range: -21 to -28
      mkNode(-2.8, -22.0, -2.5, C.yellow),
      mkNode(2.2, -23.5, -1.5, C.pink),
      mkNode(-0.5, -25.0, 1.2, C.green),
      mkNode(3.5, -26.5, 0.8, C.yellow),
      mkNode(-1.5, -28.0, -3.0, C.pink),
      mkNode(1.8, -21.0, 2.0, C.green),
    ];

    /* ── dynamic mesh lines between nearby nodes ── */
    const connectionLines: { line: THREE.Line; a: Node; b: Node }[] = [];
    nodes.forEach((a, i) => {
      nodes.forEach((b, j) => {
        if (j <= i) return;
        // Connect nodes that are vertically close to each other
        if (a.base.distanceTo(b.base) > 6.0) return;
        
        const geo = new THREE.BufferGeometry().setFromPoints([a.group.position, b.group.position]);
        const mat = new THREE.LineBasicMaterial({ color: 0xcccccc, transparent: true, opacity: 0 });
        const line = new THREE.Line(geo, mat);
        scene.add(line);
        connectionLines.push({ line, a, b });
      });
    });

    /* ── laser lines pool ── */
    const mkLaser = (color: number, opacity: number, dashed = false) => {
      const geo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()]);
      const mat = dashed
        ? new THREE.LineDashedMaterial({ color, transparent: true, opacity, dashSize: 0.22, gapSize: 0.1 })
        : new THREE.LineBasicMaterial({ color, transparent: true, opacity });
      const line = new THREE.Line(geo, mat);
      line.visible = false;
      scene.add(line);
      return line;
    };

    const primary = mkLaser(C.pink, 0.75);
    const snaps = [mkLaser(C.yellow, 0.6, true), mkLaser(C.yellow, 0.6, true), mkLaser(C.yellow, 0.6, true)];

    /* ── cursor ring ── */
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.1, 0.145, 8),
      new THREE.MeshBasicMaterial({ color: C.black, side: THREE.DoubleSide, transparent: true, opacity: 0 })
    );
    ring.visible = false;
    scene.add(ring);

    /* ── mouse & scroll ── */
    const mouse = new THREE.Vector2(9999, 9999);
    let lastMove = -Infinity;
    let scrollY = 0;
    let targetScrollY = 0;

    const onMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / W) * 2 - 1;
      mouse.y = -(e.clientY / H) * 2 + 1;
      lastMove = performance.now();
    };
    const onScroll = () => {
      targetScrollY = window.scrollY;
    };
    const onResize = () => {
      W = window.innerWidth; H = window.innerHeight;
      cam.aspect = W / H; cam.updateProjectionMatrix();
      renderer.setSize(W, H);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onResize);

    const raycaster = new THREE.Raycaster();
    const trackPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

    let laserAlpha = 0;
    let raf: number;
    const startTime = performance.now();

    // Emitter viewport random movement variables
    let lastRegenTime = 0;
    const emitterTarget = new THREE.Vector3(-5.5, 3.0, -4);

    const animate = (t: number) => {
      raf = requestAnimationFrame(animate);
      const elapsed = performance.now() - startTime;

      // Smooth scroll interpolation
      scrollY += (targetScrollY - scrollY) * 0.1;
      // Map scrollY pixel value to camera Y position offset.
      // High value means faster scrolling/parallax. Adjust multiplier to change speed/alignment.
      const scrollOffset = scrollY * 0.015;
      cam.position.y = 5 - scrollOffset;

      // Make sure lookAt is also updated or camera looks slightly ahead
      cam.lookAt(0, -scrollOffset, 0);

      // Keep tracking plane in front of the camera or aligned with scene
      trackPlane.constant = 0;

      // Periodically choose a new random viewport position for the emitter (every 4 seconds)
      const currentCameraY = cam.position.y;
      if (elapsed - lastRegenTime > 4000) {
        // Viewport bounds relative to camera Y: X from -5 to +5, Y relative to current camera Y, Z from -3 to -6
        emitterTarget.x = (Math.random() - 0.5) * 10.0;
        emitterTarget.y = (currentCameraY - 5) + Math.random() * 8.0;
        emitterTarget.z = -3.0 - Math.random() * 3.0;
        lastRegenTime = elapsed;
      }

      // Smoothly interpolate emitter position towards the target viewport location
      emLine.position.lerp(emitterTarget, 0.03);

      /* emitter spin */
      emLine.rotation.y = t * 0.0007;
      emLine.rotation.x = t * 0.0003;
      const pulse = 1 + Math.sin(t * 0.002) * 0.1;
      emLine.scale.setScalar(pulse);

      const emitterPos = new THREE.Vector3().setFromMatrixPosition(emLine.matrixWorld);

      /* nodes — dynamically scatter and animate */
      nodes.forEach((n) => {
        // Trigger activation when camera Y is close to or below the node's base Y position,
        // or trigger immediately for page 1 nodes (Y > -1.5)
        const cameraY = cam.position.y;
        if (n.base.y > -1.5 || Math.abs(cameraY - n.base.y) < 12.0 || cameraY < n.base.y) {
          n.activated = true;
        }

        if (n.activated && n.scatterProgress < 1) {
          n.scatterProgress = Math.min(1, n.scatterProgress + n.scatterSpeed);
        }

        // Target position with drift overlay
        const driftX = Math.sin(t * n.freqX + n.phaseX) * n.ampX;
        const driftY = Math.sin(t * n.freqY + n.phaseY) * n.ampY;
        const driftZ = Math.sin(t * n.freqZ + n.phaseZ) * n.ampZ;
        const targetPos = new THREE.Vector3(n.base.x + driftX, n.base.y + driftY, n.base.z + driftZ);

        // Interpolate position from emitter to targetPos
        n.group.position.lerpVectors(emitterPos, targetPos, n.scatterProgress);

        // Individual spin
        n.group.rotation.x += n.spinX;
        n.group.rotation.y += n.spinY;
        n.group.rotation.z += n.spinZ;

        n.highlight += (0 - n.highlight) * 0.06;

        const breathe = 0.7 + Math.sin(t * n.freqY * 2 + n.phaseY) * 0.15;
        const visibility = n.scatterProgress; // fade in as they scatter

        if (n.core.material instanceof THREE.MeshBasicMaterial) {
          n.core.material.opacity = Math.min(1, (breathe + n.highlight * 0.6) * visibility * 0.75);
        }
        if (n.edges.material instanceof THREE.LineBasicMaterial) {
          n.edges.material.opacity = Math.min(1, (0.5 + n.highlight * 0.7) * visibility * 0.55);
        }
        n.core.scale.setScalar(1 + n.highlight * 1.2);
      });

      /* update dynamic lines */
      connectionLines.forEach(({ line, a, b }) => {
        const avgProgress = (a.scatterProgress + b.scatterProgress) / 2;
        const points = [a.group.position, b.group.position];
        line.geometry.setFromPoints(points);
        line.geometry.attributes.position.needsUpdate = true;
        if (line.material instanceof THREE.LineBasicMaterial) {
          // Lines fade in as both nodes scatter outwards
          line.material.opacity = avgProgress * 0.28;
        }
      });

      /* laser alpha: fade in when moving, out when idle > 2 s */
      const idle = performance.now() - lastMove;
      laserAlpha += ((idle < 2000 ? 1 : 0) - laserAlpha) * (idle < 2000 ? 0.14 : 0.05);

      if (laserAlpha > 0.02) {
        raycaster.setFromCamera(mouse, cam);
        const cur = new THREE.Vector3();
        raycaster.ray.intersectPlane(trackPlane, cur);

        /* cursor ring */
        ring.visible = true;
        ring.position.copy(cur);
        ring.rotation.z = t * 0.002;
        if (ring.material instanceof THREE.MeshBasicMaterial)
          ring.material.opacity = laserAlpha * 0.6;

        /* emitter → cursor */
        const emPos = new THREE.Vector3().setFromMatrixPosition(emLine.matrixWorld);
        primary.geometry.setFromPoints([emPos, cur]);
        primary.geometry.attributes.position.needsUpdate = true;
        primary.visible = true;
        if (primary.material instanceof THREE.LineBasicMaterial)
          primary.material.opacity = laserAlpha * 0.7;

        /* cursor → nearest nodes (snap lasers + drop lines) */
        const sorted = [...nodes]
          .map((n) => ({ n, d: n.group.position.distanceTo(cur) }))
          .sort((a, b) => a.d - b.d);

        for (let i = 0; i < 3; i++) {
          const { n, d } = sorted[i];
          const np = n.group.position.clone();
          const inRange = d < 5.8 && n.scatterProgress > 0.5; // only snap to sufficiently scattered nodes
          snaps[i].visible = inRange;

          if (inRange) {
            const s = (1 - d / 5.8) * n.scatterProgress;
            snaps[i].geometry.setFromPoints([cur, np]);
            snaps[i].geometry.attributes.position.needsUpdate = true;
            if (snaps[i].material instanceof THREE.LineDashedMaterial) {
              (snaps[i].material as THREE.LineDashedMaterial).opacity = laserAlpha * s * 0.65;
              snaps[i].computeLineDistances();
            }
            n.highlight = Math.max(n.highlight, s);
          }
        }
      } else {
        ring.visible = false;
        primary.visible = false;
        snaps.forEach((l) => { l.visible = false; });
      }

      renderer.render(scene, cam);
    };

    raf = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
    };
  }, []);

  return (
    /* z-[-10]: below page content to act as background */
    /* pointer-events-none: all clicks pass through to the page */
    <div className="fixed inset-0 z-[-10] pointer-events-none select-none">
      <canvas ref={ref} className="block w-full h-full" />
    </div>
  );
}
