import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

// Register plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
}

export { gsap, ScrollTrigger };

// Common animation presets
export const fadeIn = {
  opacity: 0,
  y: 50,
  duration: 1,
  ease: "power3.out"
};

export const slideIn = {
  x: -100,
  opacity: 0,
  duration: 0.8,
  ease: "power2.out"
};

export const scaleUp = {
  scale: 0.8,
  opacity: 0,
  duration: 0.6,
  ease: "back.out(1.7)"
};