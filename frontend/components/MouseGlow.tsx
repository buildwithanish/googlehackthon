"use client";
import { useEffect, useState } from "react";

export default function MouseGlow() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden"
      style={{
        background: `radial-gradient(600px at ${mousePos.x}px ${mousePos.y}px, rgba(99, 102, 241, 0.07), transparent 80%)`
      }}
    />
  );
}
