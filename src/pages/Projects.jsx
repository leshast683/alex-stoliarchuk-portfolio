import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { db } from '../firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import styles from './Projects.module.css';

const allProjects = [
  {
    id: 1,
    title: "SWC 2026 Summer Program",
    description: "Designed and launched the official landing page for SWC's 2026 Summer Program from concept to live — the primary registration and information hub for the program, delivered in a single sprint.",
    tech: "Graphy",
    logo: "/img/logo5jpg.jpg",
    type: "swc"
  },
  {
    id: 2,
    title: "Radio App Redesign",
    description: "A complete UX/UI redesign of a radio app grounded in user research, wireframes, and high-fidelity prototypes. The redesign simplified navigation, reduced friction in the listening experience, and was fully optimized for mobile.",
    tech: "Figma, User Research, Prototyping",
    image: "/img/radio.jpg",
    type: "modal",
    images: ["/img/first.jpg", "/img/second.jpg", "/img/third.jpg", "/img/forth.jpg"]
  },
  {
    id: 3,
    title: "Priority Manager App",
    description: "A UX/UI design for a task management app built around user research and intuitive information architecture. The result: a clean interface where users can manage tasks, set reminders, and track progress — without feeling overwhelmed.",
    tech: "Figma, User Research, Prototyping",
    image: "/img/manager.jpg",
    type: "modal",
    images: ["/img/priority1.jpg", "/img/priority2.jpg", "/img/priority3.jpg", "/img/priority4.jpg"]
  },
  {
    id: 4,
    title: "Packmates",
    description: "A collaborative travel packing app built as a UCF capstone project. Ships with adaptive packing lists powered by live weather data, multi-user trip management, and a QR-coded luggage tag — delivered as a fully functional prototype.",
    tech: "HTML, CSS, JavaScript, PHP, Docker",
    logo: "/img/logo.pack.png",
    type: "packmates"
  },
  {
    id: 5,
    title: "Budgetly",
    description: "A personal finance tracker built with Claude. Tracks income, expenses, and savings goals in one focused dashboard — designed from the ground up to make budgeting feel simple, not stressful.",
    tech: "Claude",
    image: "/img/budgetly.png",
    type: "budgetly"
  },
  {
    id: 6,
    title: "Coming Soon",
    description: "Something new is in the works. Stay tuned for the next project.",
    tech: "",
    type: "coming-soon"
  }
];

const CARDS_PER_PAGE = 3;

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const snap = await getDocs(query(collection(db, 'projects'), orderBy('order', 'asc')));
        if (!snap.empty) {
          setProjects(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        } else {
          setProjects(allProjects);
        }
      } catch {
        setProjects(allProjects);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const pageCount = Math.ceil(projects.length / CARDS_PER_PAGE);
  const visibleProjects = projects.slice(page * CARDS_PER_PAGE, page * CARDS_PER_PAGE + CARDS_PER_PAGE);

  const goNext = () => { setDirection(1); setPage(p => p + 1); };
  const goPrev = () => { setDirection(-1); setPage(p => p - 1); };

  const openModal = (project) => {
    const modal = document.createElement('div');
    modal.className = styles.modal;
    modal.innerHTML = `
      <div class="${styles.modalContent}">
        <div class="${styles.framesContainer}">
          ${project.images.map(src => `
            <div class="${styles.iphoneFrame}">
              <div class="${styles.screen}">
                <img src="${src}" alt="Design" style="width:100%;height:100%;object-fit:cover;" />
              </div>
            </div>
          `).join('')}
        </div>
        <button class="${styles.closeButton}">Close</button>
      </div>
    `;
    document.body.appendChild(modal);
    modal.querySelector(`.${styles.closeButton}`).onclick = () => document.body.removeChild(modal);
  };

  const handleView = (project) => {
    if (project.type === 'swc') window.open('/swc-project', '_blank');
    else if (project.type === 'budgetly') window.open('/budgetly-project', '_blank');
    else if (project.type === 'packmates') window.open('/packmates-project', '_blank');
    else if (project.type === 'link') window.open(project.url, '_blank');
    else if (project.type === 'coming-soon') {
      const el = document.getElementById('contact');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      else window.location.href = '/#contact';
    } else openModal(project);
  };

  return (
    <motion.div
      className={styles.projects}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1>My Projects</h1>
      {loading ? (
        <div className={styles.grid}>
          {[1, 2, 3].map(i => (
            <div key={i} className={styles.skeletonCard} aria-hidden="true">
              <div className={styles.skeletonImg} />
              <div className={styles.skeletonBody}>
                <div className={styles.skeletonTitle} />
                <div className={styles.skeletonText} />
                <div className={styles.skeletonText} style={{ width: '60%' }} />
                <div className={styles.skeletonBtn} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.carouselWrapper}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={page}
              className={styles.grid}
              initial={{ opacity: 0, x: direction * 48 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -48 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              {visibleProjects.map((project) => (
                <div key={project.id} className={styles.card}>
                  <div className={styles.cardImage}>
                    {project.type === 'coming-soon' ? (
                      <div className={styles.comingSoonImg}>
                        <span>🚧</span>
                      </div>
                    ) : project.logo ? (
                      <img src={project.logo} alt={project.title} />
                    ) : project.image ? (
                      <img src={project.image} alt={project.title} />
                    ) : (
                      <div className={styles.imgPlaceholder} />
                    )}
                  </div>
                  <div className={styles.cardContent}>
                    <h3 className={styles.cardTitle}>{project.title}</h3>
                    <p className={styles.cardDesc}>{project.description}</p>
                    {project.tech && <span className={styles.tech}>{project.tech}</span>}
                    <button
                      className={styles.viewButton}
                      onClick={() => handleView(project)}
                    >
                      {project.type === 'coming-soon' ? 'Notify Me' : 'View Project'}
                    </button>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>

          {pageCount > 1 && (
            <div className={styles.navRow}>
              <button
                className={styles.navBtn}
                onClick={goPrev}
                disabled={page === 0}
                aria-label="Previous projects"
              >
                ←
              </button>
              <div className={styles.dots}>
                {Array.from({ length: pageCount }).map((_, i) => (
                  <span
                    key={i}
                    className={`${styles.dot} ${i === page ? styles.dotActive : ''}`}
                    onClick={() => { setDirection(i > page ? 1 : -1); setPage(i); }}
                  />
                ))}
              </div>
              <button
                className={styles.navBtn}
                onClick={goNext}
                disabled={page === pageCount - 1}
                aria-label="Next projects"
              >
                →
              </button>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
