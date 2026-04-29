export default function Loading() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#0a0a0a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
      aria-live="polite"
      aria-label="Cargando"
    >
      <div
        style={{
          width: 48,
          height: 48,
          border: '3px solid rgba(255,255,255,0.12)',
          borderTopColor: '#ECBA23',
          borderRadius: '50%',
          animation: 'spinDpavo 0.8s linear infinite',
        }}
      />
      <style>{`
        @keyframes spinDpavo {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
