'use client';

import { useEffect, useState } from 'react';
import { InstagramEmbed } from 'react-social-media-embed';
import type { InstaPost } from '@/app/api/instagram/route';
import { INSTAGRAM_POSTS } from '@/content/instagram';
import styles from './InstaGrid.module.css';

function FallbackGrid() {
  const posts = INSTAGRAM_POSTS.filter((u) => !u.includes('REPLACE_WITH'));
  if (!posts.length) return null;
  return (
    <div className={styles.grid}>
      {posts.map((url) => (
        <InstagramEmbed key={url} url={url} width="100%" />
      ))}
    </div>
  );
}

export function InstaGrid() {
  const [posts, setPosts] = useState<InstaPost[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('/api/instagram')
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: InstaPost[]) => setPosts(data))
      .catch(() => setError(true));
  }, []);

  if (error || (posts && posts.length === 0)) return <FallbackGrid />;

  if (!posts) {
    return (
      <div className={styles.skeleton}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className={styles.skeletonItem} />
        ))}
      </div>
    );
  }

  return (
    <div className={styles.photoGrid}>
      {posts.map((post) => {
        const src = post.media_type === 'VIDEO' ? post.thumbnail_url ?? post.media_url : post.media_url;
        return (
          <a
            key={post.id}
            href={post.permalink}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.photoItem}
          >
            <img src={src} alt={post.caption?.slice(0, 80) ?? 'D\'Pavo Instagram'} className={styles.photo} loading="lazy" />
            {post.media_type === 'VIDEO' && <span className={styles.videoIcon}>▶</span>}
          </a>
        );
      })}
    </div>
  );
}
