import express from 'express';
import cors from 'cors';
import { Resend } from 'resend';

const app = express();
const resend = new Resend('re_JXip3dES_EiKgwFjoPdYCS5drnqF64HGn');

app.use(cors());
app.use(express.json());

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

app.get('/api/projects', (req, res) => {
  res.json(projects);
});

app.post('/api/contact', async (req, res) => {
  const { name, company, email, phone, service, message } = req.body;

  try {
    await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: 'alexbuildsweb1@gmail.com',
      subject: `New message from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Company:</strong> ${company || 'N/A'}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
        <p><strong>Service:</strong> ${service || 'N/A'}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

app.listen(3001, () => console.log('API server running on port 3001'));
