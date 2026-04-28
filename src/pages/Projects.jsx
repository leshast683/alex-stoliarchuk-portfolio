import { motion } from 'framer-motion';
import { useState } from 'react';
import styles from './Projects.module.css';

const allProjects = [
  {
    id: 1,
    title: "SWC 2026 Summer Program",
    description: "Designed and launched the official landing page for SWC's 2026 Summer Program from concept to final product, serving as the primary registration and informational hub.",
    tech: "Graphy",
    logo: "/img/logo5jpg.jpg",
    type: "swc"
  },
  {
    id: 2,
    title: "Radio App Redesign",
    description: "A modern redesign of a radio app focused on better user experience and simple, clear navigation. The project included user research, wireframes, and high-quality design mockups. I also made sure the layout worked well on mobile screens.",
    tech: "Figma, User Research, Prototyping",
    image: "/img/radio.jpg",
    type: "modal",
    images: ["/img/first.jpg", "/img/second.jpg", "/img/third.jpg", "/img/forth.jpg"]
  },
  {
    id: 3,
    title: "Priority Manager App",
    description: "A task management app that helps users stay organized and keep track of their daily tasks with an easy-to-use design and helpful scheduling tools. It makes it easier to stay on top of to-do lists, set reminders, and see progress all in one place.",
    tech: "Figma, User Research, Prototyping",
    image: "/img/manager.jpg",
    type: "modal",
    images: ["/img/priority1.jpg", "/img/priority2.jpg", "/img/priority3.jpg", "/img/priority4.jpg"]
  },
  {
    id: 4,
    title: "Packmates",
    description: "A collaborative travel packing app built as a capstone project. Features adaptive packing lists powered by a weather API, trip management, and a smart QR code luggage tag.",
    tech: "HTML, CSS, JavaScript, PHP",
    logo: "/img/logopack.png",
    type: "packmates"
  },
  {
    id: 5,
    title: "Budgetly",
    description: "A personal finance tracker built entirely with Claude. Track income, expenses, and savings goals in one clean dashboard — designed to make budgeting simple and stress-free.",
    tech: "Claude",
    image: "/img/budgetly.png",
    type: "budgetly"
  }
];

export default function Projects() {
  const [projects] = useState(allProjects);

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

  return (
    <motion.div
      className={styles.projects}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1>My Projects</h1>
      <div className={styles.grid}>
        {projects.map((project) => (
          <div key={project.id} className={styles.card}>
            <h3>{project.title}</h3>
            {project.logo ? (
              <div className={styles.logoPlaceholder}>
                <img src={project.logo} alt={`${project.title} logo`} className={styles.projectLogo} />
              </div>
            ) : project.image ? (
              <img src={project.image} alt={project.title} className={styles.previewImage} />
            ) : null}
            <p>{project.description}</p>
            <p className={styles.tech}>{project.tech}</p>
            {project.type === 'swc' ? (
              <button className={styles.viewButton} onClick={() => window.open('/swc-project', '_blank')}>View Project</button>
            ) : project.type === 'budgetly' ? (
              <button className={styles.viewButton} onClick={() => window.open('/budgetly-project', '_blank')}>View Project</button>
            ) : project.type === 'packmates' ? (
              <button className={styles.viewButton} onClick={() => window.open('/packmates-project', '_blank')}>View Project</button>
            ) : project.type === 'link' ? (
              <button className={styles.viewButton} onClick={() => window.open(project.url, '_blank')}>View Project</button>
            ) : (
              <button className={styles.viewButton} onClick={() => openModal(project)}>View Project</button>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
