"use client";

export function NoiseSVG() {
  return (
    <div
      aria-hidden
      className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.035]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '256px 256px',
        // Promote to its own compositor layer so scroll doesn't trigger repaint
        transform: 'translateZ(0)',
        willChange: 'transform',
      }}
    />
  );
}
