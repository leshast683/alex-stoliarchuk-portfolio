import { useState } from 'react';
import styles from './Services.module.css';

const services = [
  { number: '1', title: 'UX/UI Design',   tagline: 'I design apps and websites people genuinely enjoy using.', size: 270, floatClass: 'float1', delay: '0s',   variant: 'variant1' },
  { number: '2', title: 'Web Development', tagline: 'I build fast, clean websites that work beautifully on any device.', size: 290, floatClass: 'float2', delay: '1.5s', variant: 'variant2' },
  { number: '3', title: 'Digital Creation', tagline: 'I craft the content, visuals, and brand identity that make your digital presence impossible to ignore.', size: 270, floatClass: 'float3', delay: '0.8s', variant: 'variant3' },
];

const behindSpheres = [];

const frontSpheres = [
  { id: 0, width: 80,  top: '12%', left: '6%',  delay: '0.3s', zIndex: 4 },
  { id: 1, width: 120, top: '60%', left: '2%',  delay: '1.2s', zIndex: 2 },
  { id: 2, width: 55,  top: '20%', right: '5%', delay: '0.7s', zIndex: 4 },
  { id: 3, width: 95,  top: '70%', right: '4%', delay: '2s',   zIndex: 2 },
];

export default function Services() {
  const [hovered, setHovered] = useState(null);
  const [popped, setPopped] = useState([]);
  const [hidden, setHidden] = useState([]);

  const handlePop = (id) => {
    if (!popped.includes(id)) setPopped(p => [...p, id]);
  };

  const renderSphere = (s, clickable) => {
    if (hidden.includes(s.id)) return null;
    const isPopping = popped.includes(s.id);
    return (
      <div
        key={s.id}
        aria-hidden="true"
        className={`${styles.decorSphere}${isPopping ? ` ${styles.decorSpherePop}` : ''}`}
        style={{ width: s.width, height: s.width, top: s.top, left: s.left, right: s.right, zIndex: s.zIndex ?? 0, animationDelay: isPopping ? '0s' : s.delay, cursor: clickable ? 'pointer' : 'default' }}
        onClick={() => clickable && handlePop(s.id)}
        onAnimationEnd={() => { if (isPopping) setHidden(h => [...h, s.id]); }}
      />
    );
  };

  return (
    <section className={styles.services}>
      {behindSpheres.map(s => renderSphere(s, false))}
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
      {frontSpheres.map(s => renderSphere(s, true))}
    </section>
  );
}
