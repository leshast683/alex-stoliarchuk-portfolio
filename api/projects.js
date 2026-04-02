const projects = [
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
  }
];

export default function handler(req, res) {
  res.json(projects);
}
