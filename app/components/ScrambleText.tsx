"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface ScrambleTextProps {
  text: string;
  className?: string;
  trigger?: "hover" | "mount";
}

export default function ScrambleText({
  text,
  className,
  trigger = "mount",
}: ScrambleTextProps) {
  const textRef = useRef<HTMLSpanElement>(null);
  const chars = "!<>-_\\/[]{}—=+*^?#________";

  const scramble = () => {
    if (!textRef.current) return;

    const target = textRef.current;
    const originalText = text;
    let iteration = 0;

    const interval = setInterval(() => {
      target.innerText = originalText
        .split("")
        .map((char, index) => {
          if (index < iteration) {
            return originalText[index];
          }
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join("");

      if (iteration >= originalText.length) {
        clearInterval(interval);
        target.innerText = originalText;
      }

      iteration += 1 / 3;
    }, 30);
  };

  useEffect(() => {
    if (trigger === "mount") {
      const timeout = setTimeout(scramble, 100);
      return () => clearTimeout(timeout);
    }
  }, [text, trigger]);

  return (
    <span
      ref={textRef}
      className={className}
      onMouseEnter={() => {
        if (trigger === "hover") scramble();
      }}
    >
      {text}
    </span>
  );
}
