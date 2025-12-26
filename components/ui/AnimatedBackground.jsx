"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function AnimatedBackground() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Create floating particles
      const particles = [];
      for (let i = 0; i < 20; i++) {
        const particle = document.createElement("div");
        particle.className = "absolute rounded-full opacity-20";
        particle.style.width = `${Math.random() * 100 + 50}px`;
        particle.style.height = particle.style.width;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.background = `radial-gradient(circle, var(--theme-${Math.floor(Math.random() * 5) * 100}) 0%, transparent 70%)`;
        
        containerRef.current.appendChild(particle);
        particles.push(particle);

        // Animate particles
        gsap.to(particle, {
          y: `${Math.random() * 200 - 100}`,
          x: `${Math.random() * 200 - 100}`,
          duration: Math.random() * 10 + 10,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
      aria-hidden="true"
    />
  );
}