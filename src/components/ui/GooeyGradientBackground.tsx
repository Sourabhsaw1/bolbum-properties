'use client'

import React, { useEffect, useRef } from 'react';

interface GooeyGradientBackgroundProps {
  /** Content to render on top of the background */
  children?: React.ReactNode;
  /** Additional class names for the container */
  className?: string;
}

/**
 * GooeyGradientBackground Component
 * Mesmerizing, interactive gooey liquid gradient background using SVG filters and CSS keyframe animations.
 * Custom-tinted with gold and amber luxury colors for the Bol Bum Property platform.
 */
export function GooeyGradientBackground({ children, className = '' }: GooeyGradientBackgroundProps) {
  const interactiveRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let curX = 0;
    let curY = 0;
    let tgX = 0;
    let tgY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      tgX = event.clientX;
      tgY = event.clientY;
    };

    let animId = 0;
    const animate = () => {
      if (!interactiveRef.current) return;
      
      // Eased mouse movement
      curX += (tgX - curX) / 12;
      curY += (tgY - curY) / 12;
      
      interactiveRef.current.style.transform = `translate(${Math.round(curX)}px, ${Math.round(curY)}px)`;
      animId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className={`gooey-wrapper ${className}`} style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      <style>{`
        .gooey-wrapper {
          --color-bg1: rgb(8, 3, 1);
          --color-bg2: rgb(22, 9, 3);
          --color1: 255, 107, 26;       /* Brand Orange #FF6B1A */
          --color2: 255, 140, 74;       /* Brand Orange Light #FF8C4A */
          --color3: 195, 60, 10;        /* Mid Deep Orange */
          --color4: 255, 80, 10;        /* Bright Orange */
          --color5: 130, 40, 5;         /* Dark Red-Orange */
          --color-interactive: 255, 140, 74; /* Interactive Orange Blob */
          --circle-size: 80%;
          --blending: screen;
          
          width: 100%;
          height: 100%;
          position: relative;
          overflow: hidden;
        }

        @keyframes moveInCircle {
          0% { transform: rotate(0deg); }
          50% { transform: rotate(180deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes moveVertical {
          0% { transform: translateY(-50%); }
          50% { transform: translateY(50%); }
          100% { transform: translateY(-50%); }
        }

        @keyframes moveHorizontal {
          0% { transform: translateX(-50%) translateY(-10%); }
          50% { transform: translateX(50%) translateY(10%); }
          100% { transform: translateX(-50%) translateY(-10%); }
        }

        .gradient-bg {
          width: 100%;
          height: 100%;
          position: absolute;
          overflow: hidden;
          background: linear-gradient(40deg, var(--color-bg1), var(--color-bg2));
          top: 0;
          left: 0;
          z-index: 0;
          pointer-events: none;
        }

        .gradient-bg svg {
          position: fixed;
          top: 0;
          left: 0;
          width: 0;
          height: 0;
        }

        .gradients-container {
          filter: url(#goo) blur(40px);
          width: 100%;
          height: 100%;
        }

        .g1 {
          position: absolute;
          background: radial-gradient(circle at center, rgba(var(--color1), 0.7) 0, rgba(var(--color1), 0) 50%) no-repeat;
          mix-blend-mode: var(--blending);
          width: var(--circle-size);
          height: var(--circle-size);
          top: calc(50% - var(--circle-size) / 2);
          left: calc(50% - var(--circle-size) / 2);
          transform-origin: center center;
          animation: moveVertical 30s ease infinite;
          opacity: 0.9;
        }

        .g2 {
          position: absolute;
          background: radial-gradient(circle at center, rgba(var(--color2), 0.7) 0, rgba(var(--color2), 0) 50%) no-repeat;
          mix-blend-mode: var(--blending);
          width: var(--circle-size);
          height: var(--circle-size);
          top: calc(50% - var(--circle-size) / 2);
          left: calc(50% - var(--circle-size) / 2);
          transform-origin: calc(50% - 400px);
          animation: moveInCircle 20s reverse infinite;
          opacity: 0.9;
        }

        .g3 {
          position: absolute;
          background: radial-gradient(circle at center, rgba(var(--color3), 0.7) 0, rgba(var(--color3), 0) 50%) no-repeat;
          mix-blend-mode: var(--blending);
          width: var(--circle-size);
          height: var(--circle-size);
          top: calc(50% - var(--circle-size) / 2 + 200px);
          left: calc(50% - var(--circle-size) / 2 - 500px);
          transform-origin: calc(50% + 400px);
          animation: moveInCircle 40s linear infinite;
          opacity: 0.9;
        }

        .g4 {
          position: absolute;
          background: radial-gradient(circle at center, rgba(var(--color4), 0.7) 0, rgba(var(--color4), 0) 50%) no-repeat;
          mix-blend-mode: var(--blending);
          width: var(--circle-size);
          height: var(--circle-size);
          top: calc(50% - var(--circle-size) / 2);
          left: calc(50% - var(--circle-size) / 2);
          transform-origin: calc(50% - 200px);
          animation: moveHorizontal 40s ease infinite;
          opacity: 0.7;
        }

        .g5 {
          position: absolute;
          background: radial-gradient(circle at center, rgba(var(--color5), 0.7) 0, rgba(var(--color5), 0) 50%) no-repeat;
          mix-blend-mode: var(--blending);
          width: calc(var(--circle-size) * 2);
          height: calc(var(--circle-size) * 2);
          top: calc(50% - var(--circle-size));
          left: calc(50% - var(--circle-size));
          transform-origin: calc(50% - 800px) calc(50% + 200px);
          animation: moveInCircle 20s ease infinite;
          opacity: 0.9;
        }

        .interactive {
          position: absolute;
          background: radial-gradient(circle at center, rgba(var(--color-interactive), 0.8) 0, rgba(var(--color-interactive), 0) 50%) no-repeat;
          mix-blend-mode: var(--blending);
          width: 100%;
          height: 100%;
          top: -50%;
          left: -50%;
          opacity: 0.85;
          pointer-events: none;
        }
      `}</style>
      <div className="gradient-bg">
        <svg xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="goo">
              <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
              <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" result="goo" />
              <feBlend in="SourceGraphic" in2="goo" />
            </filter>
          </defs>
        </svg>
        <div className="gradients-container">
          <div className="g1"></div>
          <div className="g2"></div>
          <div className="g3"></div>
          <div className="g4"></div>
          <div className="g5"></div>
          <div ref={interactiveRef} className="interactive"></div>
        </div>
      </div>
      
      {/* Content Layer */}
      <div style={{ position: 'relative', zIndex: 10, width: '100%', height: '100%' }}>
        {children}
      </div>
    </div>
  );
}

export default GooeyGradientBackground;
