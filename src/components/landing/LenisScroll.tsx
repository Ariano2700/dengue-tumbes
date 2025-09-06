'use client'
import Lenis from "lenis";
import { useEffect, useRef } from "react";

function LenisScroll() {
  const initialized = useRef(false);

  useEffect(() => {
    // Defer initialization to avoid blocking initial render
    const initLenis = () => {
      if (initialized.current) return;
      initialized.current = true;

      const lenis = new Lenis({ 
        smoothWheel: true,
        // Optimize performance
        lerp: 0.1,
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
      });

      let rafId: number;
      const raf = (time: number) => {
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);

      // Interceptar clics en <a href="#..."> with better performance
      const handleAnchorClick = (e: Event) => {
        const target = e.target as HTMLElement;
        const anchor = target.closest('a[href^="#"]') as HTMLAnchorElement;
        if (!anchor) return;

        const href = anchor.getAttribute("href");
        if (!href) return;

        const targetId = href.slice(1);
        const targetEl = document.getElementById(targetId);
        if (!targetEl) return;

        e.preventDefault();
        lenis.scrollTo(targetEl, { duration: 1.5 });
      };

      // Use event delegation for better performance
      document.addEventListener("click", handleAnchorClick);

      return () => {
        if (rafId) cancelAnimationFrame(rafId);
        document.removeEventListener("click", handleAnchorClick);
        lenis.destroy();
      };
    };

    // Use requestIdleCallback for non-critical initialization
    if ('requestIdleCallback' in window) {
      const idleId = requestIdleCallback(initLenis, { timeout: 2000 });
      return () => cancelIdleCallback(idleId);
    } else {
      // Fallback for browsers without requestIdleCallback
      const timeoutId = setTimeout(initLenis, 100);
      return () => clearTimeout(timeoutId);
    }
  }, []);

  return null;
}

export default LenisScroll;