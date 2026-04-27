'use client';

import { useEffect, useRef, useState } from 'react';
import { Music, VolumeX } from 'lucide-react';
import styles from './MusicFab.module.css';

export function MusicFab({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    return () => { audioRef.current?.pause(); };
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => {});
    }
  };

  return (
    <>
      <audio ref={audioRef} src={src} loop preload="none" />
      <button
        className={`${styles.fab} ${playing ? styles.playing : ''}`}
        onClick={toggle}
        aria-label={playing ? 'Pausar música' : 'Reproducir música'}
        type="button"
      >
        {playing && <span className={styles.ring} />}
        {playing && <span className={styles.ring2} />}
        {playing ? <VolumeX size={22} /> : <Music size={22} />}
      </button>
    </>
  );
}
