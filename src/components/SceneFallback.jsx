/**
 * Graceful static fallback when WebGL is unavailable.
 * It is intentionally a product illustration, not a generic placeholder.
 */
export function SceneFallback() {
  return (
    <div className="scene-fallback">
      <svg viewBox="0 0 520 420" role="img" aria-label="Illustration of Pulsar Buds One earbud and charging case">
        <defs>
          <linearGradient id="fallback-case" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#2C2E30" />
            <stop offset="1" stopColor="#171819" />
          </linearGradient>
          <linearGradient id="fallback-bud" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#F1F0EB" />
            <stop offset="1" stopColor="#D4D1C8" />
          </linearGradient>
          <linearGradient id="fallback-tip" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#D6D1C7" />
            <stop offset="1" stopColor="#B9B4AA" />
          </linearGradient>
        </defs>

        <ellipse cx="260" cy="360" rx="180" ry="22" fill="#0B0C0D" opacity=".12" />

        <g transform="translate(145 250) rotate(-7 115 45)">
          <rect x="0" y="0" width="230" height="92" rx="32" fill="url(#fallback-case)" />
          <rect x="10" y="10" width="210" height="30" rx="20" fill="#FFFFFF" opacity=".05" />
          <path d="M8 48h214" stroke="#0B0C0D" strokeWidth="2" />
          <path d="M8 51h214" stroke="#FFFFFF" strokeOpacity=".08" />
          <circle cx="115" cy="70" r="4" fill="#28B99A" />
          <text x="115" y="30" textAnchor="middle" fill="#F1F0EB" fillOpacity=".28" fontFamily="JetBrains Mono, monospace" fontSize="10" letterSpacing="4">PULSAR</text>
        </g>

        <g transform="translate(245 105) rotate(14)">
          <ellipse cx="0" cy="30" rx="52" ry="62" fill="url(#fallback-tip)" />
          <ellipse cx="0" cy="30" rx="34" ry="42" fill="#0B0C0D" opacity=".28" />
          <path d="M-42 10c18-42 66-46 88-10 16 28 6 64-20 78-26 14-58 2-68-24-6-16-4-32 0-44z" fill="url(#fallback-bud)" />
          <rect x="4" y="60" width="32" height="118" rx="16" fill="url(#fallback-bud)" />
          <rect x="10" y="72" width="20" height="92" rx="10" fill="#FFFFFF" opacity=".16" />
          <circle cx="20" cy="154" r="3.5" fill="#28B99A" />
          <circle cx="20" cy="154" r="8" fill="#28B99A" opacity=".16" />
          <ellipse cx="8" cy="28" rx="30" ry="38" fill="none" stroke="#BFC1BD" strokeWidth="2" opacity=".7" />
        </g>
      </svg>
      <p>3D preview unavailable on this device.</p>
    </div>
  )
}
