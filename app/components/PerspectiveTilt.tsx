"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";

interface PerspectiveTiltProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}

export default function PerspectiveTilt({ children, className, intensity = 15 }: PerspectiveTiltProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onMouseMove = (e: MouseEvent) => {
      const { left, top, width, height } = container.getBoundingClientRect();
      const x = (e.clientX - left) / width - 0.5;
      const y = (e.clientY - top) / height - 0.5;

      gsap.to(container, {
        rotationY: x * intensity,
        rotationX: -y * intensity,
        ease: "power2.out",
        duration: 0.5,
        perspective: 1000,
        transformPerspective: 1000,
        overwrite: "auto"
      });
    };

    const onMouseLeave = () => {
      gsap.killTweensOf(container);
      gsap.to(container, {
        rotationY: 0,
        rotationX: 0,
        ease: "power2.out",
        duration: 0.5,
        clearProps: "transform"
      });
    };

    container.addEventListener("mousemove", onMouseMove);
    container.addEventListener("mouseleave", onMouseLeave);

    return () => {
      container.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [intensity]);

  return (
    <div ref={containerRef} className={`${className} transition-transform duration-100`}>
      {children}
    </div>
  );
}
