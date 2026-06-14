'use client'

import GooeyGradientBackground from './GooeyGradientBackground'

// Premium animated background
// Luxury real estate aesthetic with interactive gooey gradient and building silhouettes
export default function VideoBackground() {
  return (
    <>
      {/* Gooey Gradient Background */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        overflow: 'hidden',
      }}>
        <GooeyGradientBackground />
      </div>

      {/* Overlays (silhouettes, light streaks, grid lines) */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        overflow: 'hidden',
      }}>
        {/* Building silhouettes at bottom */}
        <svg
          style={{ position: 'absolute', bottom: 0, left: 0, right: 0, width: '100%', opacity: 0.06 }}
          viewBox="0 0 1440 300" preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* City skyline silhouette */}
          <path d="
            M0,300 L0,200
            L60,200 L60,140 L80,140 L80,120 L100,120 L100,140 L120,140 L120,200
            L160,200 L160,100 L170,100 L170,80 L180,80 L180,100 L190,100 L190,200
            L220,200 L220,160 L260,160 L260,200
            L280,200 L280,80 L300,80 L300,60 L320,60 L320,80 L340,80 L340,200
            L380,200 L380,130 L420,130 L420,200
            L450,200 L450,90 L460,90 L460,70 L470,70 L470,50 L480,50 L480,70 L490,70 L490,90 L500,90 L500,200
            L540,200 L540,150 L580,150 L580,200
            L620,200 L620,110 L640,110 L640,200
            L680,200 L680,70 L700,70 L700,50 L720,50 L720,70 L740,70 L740,200
            L780,200 L780,140 L820,140 L820,200
            L860,200 L860,90 L880,90 L880,200
            L920,200 L920,120 L940,120 L940,100 L960,100 L960,120 L980,120 L980,200
            L1020,200 L1020,160 L1060,160 L1060,200
            L1080,200 L1080,80 L1100,80 L1100,60 L1120,60 L1120,80 L1140,80 L1140,200
            L1180,200 L1180,130 L1220,130 L1220,200
            L1260,200 L1260,100 L1280,100 L1280,200
            L1320,200 L1320,140 L1360,140 L1360,200
            L1440,200 L1440,300 Z
          " fill="#C8762A" />

          {/* Ground floor windows */}
          <rect x="165" y="110" width="8" height="10" fill="#C8762A" opacity="0.8"/>
          <rect x="177" y="110" width="8" height="10" fill="#C8762A" opacity="0.8"/>
          <rect x="305" y="90" width="8" height="10" fill="#C8762A" opacity="0.8"/>
          <rect x="317" y="90" width="8" height="10" fill="#C8762A" opacity="0.8"/>
          <rect x="455" y="100" width="8" height="10" fill="#C8762A" opacity="0.8"/>
          <rect x="467" y="100" width="8" height="10" fill="#C8762A" opacity="0.8"/>
          <rect x="705" y="80" width="8" height="10" fill="#C8762A" opacity="0.8"/>
          <rect x="717" y="80" width="8" height="10" fill="#C8762A" opacity="0.8"/>
        </svg>

        {/* Horizontal light streaks */}
        <div style={{
          position: 'absolute', bottom: '15%', left: 0, right: 0, height: '1px',
          background: 'linear-gradient(90deg, transparent 0%, rgba(200,118,42,0.08) 30%, rgba(200,118,42,0.15) 50%, rgba(200,118,42,0.08) 70%, transparent 100%)',
          animation: 'streakPulse 6s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', bottom: '35%', left: 0, right: 0, height: '1px',
          background: 'linear-gradient(90deg, transparent 0%, rgba(200,118,42,0.04) 40%, rgba(200,118,42,0.08) 50%, rgba(200,118,42,0.04) 60%, transparent 100%)',
          animation: 'streakPulse 8s ease-in-out infinite 2s',
        }} />

        {/* Grid lines - subtle */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `
            linear-gradient(rgba(200,118,42,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(200,118,42,0.02) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
          animation: 'gridFade 10s ease-in-out infinite',
        }} />
      </div>

      <style>{`
        @keyframes orbFloat1 {
          0%,100% { transform: translate(0,0) scale(1); }
          33%      { transform: translate(-30px, 20px) scale(1.05); }
          66%      { transform: translate(20px, -30px) scale(0.95); }
        }
        @keyframes orbFloat2 {
          0%,100% { transform: translate(0,0) scale(1); }
          50%      { transform: translate(40px,-20px) scale(1.08); }
        }
        @keyframes orbFloat3 {
          0%,100% { opacity: 1; transform: translate(-50%,-50%) scale(1); }
          50%      { opacity: 0.6; transform: translate(-50%,-50%) scale(1.1); }
        }
        @keyframes streakPulse {
          0%,100% { opacity: 0.5; }
          50%      { opacity: 1; }
        }
        @keyframes gridFade {
          0%,100% { opacity: 0.6; }
          50%      { opacity: 1; }
        }
      `}</style>
    </>
  )
}
