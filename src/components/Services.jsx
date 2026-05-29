import { useState } from 'react';
import styles from './Services.module.css';

const services = [
  { number: '1', title: 'UX/UI Design',   tagline: 'I design apps and websites people genuinely enjoy using.', size: 270, floatClass: 'float1', delay: '0s',   variant: 'variant1' },
  { number: '2', title: 'Web Development', tagline: 'I build fast, clean websites that work beautifully on any device.', size: 290, floatClass: 'float2', delay: '1.5s', variant: 'variant2' },
  { number: '3', title: 'Digital Creation', tagline: 'I get your site found on Google and launch it fast.',      size: 270, floatClass: 'float3', delay: '0.8s', variant: 'variant3' },
];

export default function Services() {
  const [hovered, setHovered] = useState(null);

  return (
    <section className={styles.services}>
      <h2 className={styles.heading}>What I Do</h2>
      <div className={styles.container}>
        {services.map((s, i) => (
          <div
            key={i}
            className={`${styles.sphereWrap} ${styles[s.floatClass]}`}
            style={{ width: s.size, height: s.size, animationDelay: s.delay }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            <div className={styles.groundShadow} aria-hidden="true" />
            <div className={`${styles.sphereInner} ${styles[s.variant]} ${hovered === i ? styles.hovered : ''}`}>
              <span className={styles.number}>{s.number}</span>
              <span className={styles.title}>{s.title}</span>
              <span className={`${styles.tagline} ${hovered === i ? styles.taglineVisible : ''}`}>
                {s.tagline}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
