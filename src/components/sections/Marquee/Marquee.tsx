import styles from './Marquee.module.css';

interface MarqueeProps {
  items: string[];
}

export function Marquee({ items }: MarqueeProps) {
  const repeated = [...items, ...items, ...items, ...items];
  return (
    <div className={styles.wrapper}>
      <div className={styles.track}>
        {repeated.map((item, i) => (
          <span key={i} className={styles.item}>{item} <span className={styles.dot}>•</span></span>
        ))}
      </div>
    </div>
  );
}
