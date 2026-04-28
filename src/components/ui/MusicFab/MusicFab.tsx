'use client';

import { useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import styles from './MusicFab.module.css';

export function MusicFab({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [muted, setMuted] = useState(true);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !muted;
    setMuted((m) => !m);
  };

  return (
    <>
      {/* autoPlay + muted satisfies browser autoplay policy */}
      <audio ref={audioRef} src={src} loop autoPlay muted />
      <button
        className={`${styles.fab} ${styles.playing}`}
        onClick={toggle}
        aria-label={muted ? 'Activar música' : 'Silenciar música'}
        type="button"
      >
        <span className={styles.ring} />
        <span className={styles.ring2} />
        {muted ? <VolumeX size={22} /> : <Volume2 size={22} />}
      </button>
    </>
  );
}
