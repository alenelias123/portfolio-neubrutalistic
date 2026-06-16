"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface MarqueeProps {
  text: string;
  speed?: number;
  className?: string;
  direction?: "left" | "right";
}

export default function Marquee({ text, speed = 20, className, direction = "left" }: MarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !textRef.current) return;

    const container = containerRef.current;
    const textElement = textRef.current;
    const textWidth = textElement.offsetWidth;

    const xVal = direction === "left" ? -textWidth : textWidth;

    gsap.to(textElement, {
      x: xVal,
      duration: speed,
      ease: "none",
      repeat: -1,
    });
  }, [speed, direction]);

  return (
    <div ref={containerRef} className={`overflow-hidden whitespace-nowrap ${className}`}>
      <div ref={textRef} className="inline-block">
        <span className="mx-4">{text}</span>
        <span className="mx-4">{text}</span>
        <span className="mx-4">{text}</span>
        <span className="mx-4">{text}</span>
      </div>
    </div>
  );
}
