import React from 'react';

export default function TopBanner({ theme, setTheme }) {
  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 w-full shadow-2xl transition-all duration-300"
      style={{
        background: theme === 'bright' ? 'linear-gradient(135deg, #101c1d 0%, #1e3537 100%)' : '#05070a',
        height: '80px',
        borderBottom: theme === 'bright' ? '1px solid rgba(30, 46, 48, 0.4)' : '1px solid rgba(197,168,128,0.3)',
      }}
    >
      {/* Decorative gold curved line - top right */}
      <svg
        className="absolute top-0 right-0 h-full opacity-30 pointer-events-none"
        viewBox="0 0 300 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '300px' }}
      >
        <path
          d="M300 0 Q200 40 300 80"
          stroke="#c5a880"
          strokeWidth="1.5"
          fill="none"
          className="transition-colors duration-300"
        />
        <path
          d="M300 10 Q220 40 300 70"
          stroke="#c5a880"
          strokeWidth="0.8"
          fill="none"
          opacity="0.5"
          className="transition-colors duration-300"
        />
        <circle cx="290" cy="40" r="2" fill="#c5a880" opacity="0.6" className="transition-colors duration-300" />
        <circle cx="270" cy="20" r="1" fill="#c5a880" opacity="0.4" className="transition-colors duration-300" />
        <circle cx="270" cy="60" r="1" fill="#c5a880" opacity="0.4" className="transition-colors duration-300" />
      </svg>

      {/* Subtle dot grid pattern on right */}
      <div
        className="absolute right-0 top-0 h-full pointer-events-none opacity-20"
        style={{
          width: '200px',
          backgroundImage: theme === 'bright' ? 'radial-gradient(circle, #1e2e30 1px, transparent 1px)' : 'radial-gradient(circle, #c5a880 1px, transparent 1px)',
          backgroundSize: '12px 12px',
        }}
      />

      <div className="relative z-10 flex items-center h-full px-4">

        {/* ─── LEFT: Logo ─── */}
        <div className="flex items-center shrink-0" style={{ width: '80px' }}>
          <img
            src="/darshi-logo.png"
            alt="Darshi Logo"
            className="h-[68px] w-[68px] object-contain drop-shadow-md"
          />
        </div>

        {/* ─── DIVIDER ─── */}
        <div className="mx-3 h-12 w-px bg-gradient-to-b from-transparent via-[#c5a880]/50 to-transparent shrink-0" />

        {/* ─── CENTER: CIN + Company Name ─── */}
        <div className="flex-1 flex flex-col justify-center min-w-0">
          {/* Top row: CIN and Estb */}
          <div className="flex items-center gap-5 mb-0.5">
            <div className="flex items-center gap-1.5">
              {/* Shield icon */}
              <svg className="h-3.5 w-3.5 text-[#c5a880] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L3 7l9 5 9-5-9-5z" />
                <path d="M3 7v7a9 9 0 0 0 9 9 9 9 0 0 0 9-9V7" />
              </svg>
              <span style={{ color: '#c5a880', fontSize: '10px', fontFamily: 'Inter, sans-serif', fontWeight: '600', letterSpacing: '0.05em' }}>
                CIN : U62099AP2026PTC126197
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              {/* Calendar icon */}
              <svg className="h-3.5 w-3.5 text-[#c5a880] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <span style={{ color: '#c5a880', fontSize: '10px', fontFamily: 'Inter, sans-serif', fontWeight: '600', letterSpacing: '0.05em' }}>
                Estb: 2026
              </span>
            </div>
          </div>

          {/* Company Name */}
          <div
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: '800',
              fontSize: '18px',
              color: '#ffffff',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              lineHeight: '1.1',
              textShadow: '0 0 30px rgba(197,168,128,0.2)',
              whiteSpace: 'nowrap',
            }}
          >
            DARSHI SOFTWARE SOLUTIONS{' '}
            <span style={{ color: '#ffffff' }}>PRIVATE LIMITED</span>
          </div>

          {/* Gold diamond divider */}
          <div className="flex items-center gap-1 mt-0.5">
            <div className="h-px w-8 bg-gradient-to-r from-transparent to-[#c5a880]/60" />
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M5 0 L10 5 L5 10 L0 5 Z" fill="#c5a880" opacity="0.8" />
            </svg>
            <svg width="6" height="6" viewBox="0 0 6 6" fill="none">
              <path d="M3 0 L6 3 L3 6 L0 3 Z" fill="#c5a880" opacity="0.5" />
            </svg>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M5 0 L10 5 L5 10 L0 5 Z" fill="#c5a880" opacity="0.8" />
            </svg>
            <div className="h-px w-8 bg-gradient-to-l from-transparent to-[#c5a880]/60" />
          </div>

          {/* Address */}
          <div style={{ color: '#a8b8c8', fontSize: '9px', fontFamily: 'Inter, sans-serif', letterSpacing: '0.03em', marginTop: '1px' }}>
            # 87/1368-HIG-II-40, Road No 1, AP Housing Board Colony, Joharapuram, Kurnool, Andhra Pradesh, India, Pin 518002
          </div>
        </div>

        {/* ─── RIGHT: Theme Toggle & Phone Numbers ─── */}
        <div className="flex items-center gap-4 shrink-0 ml-4">
          {/* Theme Toggle Button */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'bright' : 'dark')}
            className="flex items-center justify-center rounded-full p-2.5 transition-all duration-300 border border-transparent hover:scale-110"
            style={{
              border: '1.5px solid #c5a880',
              background: 'rgba(197,168,128,0.06)',
              color: '#c5a880',
            }}
            title={`Switch to ${theme === 'dark' ? 'Bright' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? (
              // Sun icon for bright theme
              <svg className="h-5 w-5 animate-pulse text-[#c5a880]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              // Moon icon for dark theme (brightened for contrast against dark banner background)
              <svg className="h-5 w-5 text-[#c5a880]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

          <div
            className="flex items-center gap-3 px-4 py-2 rounded-full transition-all duration-300"
            style={{
              border: '1.5px solid #c5a880',
              background: 'rgba(197,168,128,0.06)',
              backdropFilter: 'blur(8px)',
            }}
          >
            {/* Phone icon circle */}
            <div
              className="flex items-center justify-center rounded-full shrink-0 transition-all duration-300"
              style={{
                width: '36px',
                height: '36px',
                background: 'linear-gradient(135deg, #c5a880, #b5976f)',
                boxShadow: '0 0 12px rgba(197,168,128,0.4)',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0a1628" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12 19.79 19.79 0 0 1 1.07 3.37a2 2 0 0 1 1.99-2.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
            </div>
            {/* Numbers */}
            <div className="flex flex-col">
              <span style={{ color: '#ffffff', fontSize: '13px', fontWeight: '700', fontFamily: 'Inter, sans-serif', letterSpacing: '0.05em', lineHeight: '1.3' }}>
                9121237729
              </span>
              <span style={{ color: '#c5a880', fontSize: '12px', fontWeight: '600', fontFamily: 'Inter, sans-serif', letterSpacing: '0.05em', lineHeight: '1.3' }} className="transition-colors duration-300">
                8179075149
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
