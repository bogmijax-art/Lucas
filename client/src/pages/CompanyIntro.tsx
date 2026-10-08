import softwareImage from "../capability-software.png";
import aiImage from "../capability-ai.png";
import mobileImage from "../capability-mobile.png";

import { ArrowRight, BrainCircuit, Check, Code2, Layers3, Menu, Sparkles, X, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const capabilities = [
  {
    title: "Software & Web Development",
    text: "Reliable web platforms and business software designed around real workflows.",
    icon: Code2,
    image: softwareImage,
  },
  {
    title: "AI & Intelligent Solutions",
    text: "Practical AI, automation, and intelligent experiences that create measurable value.",
    icon: BrainCircuit,
    image: aiImage,
  },
  {
    title: "Mobile & Digital Solutions",
    text: "Connected digital products that make customer and team experiences simpler.",
    icon: Layers3,
    image: mobileImage,
  },
];

const principles = [
  ["Human-centered", "Technology should be clear, useful, and easy to work with."],
  ["Built for growth", "Strong foundations let products evolve without unnecessary complexity."],
  ["AI with purpose", "We use intelligence where it creates meaningful leverage."],
];

export default function CompanyIntro() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const enter = () => navigate(session ? "/workspace" : "/login");
  const closeMenu = () => setMenuOpen(false);

  return (
    <main className="intro-page simple-intro">
      <nav className="simple-nav">
        <Link to="/" className="simple-brand" onClick={closeMenu}>
          <span className="simple-mark">∞</span>
          <span><strong>Infinity Labs</strong><small>Technologies LLC</small></span>
        </Link>

        <div className={`simple-links ${menuOpen ? "open" : ""}`}>
          <a href="#company" onClick={closeMenu}>Company</a>
          <a href="#capabilities" onClick={closeMenu}>Capabilities</a>
          <a href="#mission" onClick={closeMenu}>Mission</a>
          <a href="#nexusflow" onClick={closeMenu}>NexusFlow</a>
          <a href="#contact" onClick={closeMenu}>Contact Us</a>
          <button className="simple-mobile-action" onClick={enter}>{session ? "Open workspace" : "Enter NexusFlow"}</button>
        </div>

        <div className="simple-nav-actions">
          <a className="simple-contact-action" href="#contact">Contact Us</a>
          <button className="simple-nav-action" onClick={enter}>
            {session ? "Open workspace" : "Enter NexusFlow"}<ArrowRight size={15} />
          </button>
        </div>
        <button className="simple-menu" aria-label="Toggle navigation" onClick={() => setMenuOpen(v => !v)}>
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </nav>

      <section className="simple-hero" id="company">
        <div className="simple-hero-image" />
        <div className="simple-hero-shade" />
        <div className="simple-hero-content">
          <span className="simple-eyebrow">INFINITY LABS TECHNOLOGIES LLC</span>
          <h1>Technology that<br /><span>moves business forward.</span></h1>
          <p>We combine software engineering and artificial intelligence to create reliable, useful technology that helps people and businesses work better.</p>
          <div className="simple-actions">
            <button className="simple-primary" onClick={enter}>Explore NexusFlow <ArrowRight size={17} /></button>
            <a href="#company-story">Learn about us</a>
          </div>
        </div>
      </section>

      <section className="simple-section simple-story" id="company-story">
        <div className="simple-section-head">
          <span className="simple-eyebrow dark">WHO WE ARE</span>
          <h2>Software should solve problems,<br /><span>not create more of them.</span></h2>
        </div>
        <div className="simple-story-copy">
          <p className="simple-lead">Infinity Labs Technologies is a software and AI company focused on solving real-world business challenges through thoughtful engineering.</p>
          <p>We bring dependable software, intelligent automation, and human-centered product design together. The goal is straightforward: reduce friction, improve efficiency, and create technology people can trust.</p>
        </div>
      </section>

      <section className="simple-section simple-capabilities" id="capabilities">
        <div className="simple-solutions-head">
          <span className="simple-solutions-kicker"><i /> OUR SOLUTIONS <i /></span>
          <h2>Innovative Solutions for a <span>Smarter Tomorrow</span></h2>
          <p>NexusFlow brings together people, technology and intelligence to build<br className="desktop-break" /> smarter, faster and more connected systems for every industry.</p>
        </div>
        <div className="simple-capability-grid">
          {capabilities.map(({ title, text, icon: Icon, image }, index) => (
            <article className="simple-capability" key={title}>
              <div className="simple-capability-image-wrap">
                <img className="simple-capability-image" src={image} alt="" loading="lazy" />
              </div>
              <div className="simple-capability-body">
                <div className="simple-capability-top"><span>0{index + 1}</span><Icon size={21} /></div>
                <div><h3>{title}</h3><p>{text}</p></div>
                <ArrowRight className="simple-capability-arrow" size={18} />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="simple-section simple-mission" id="mission">
        <div className="simple-mission-main">
          <span className="simple-eyebrow dark">OUR MISSION</span>
          <h2>Build reliable technology<br /><span>with a human purpose.</span></h2>
          <p>Our mission is to design and develop reliable, scalable, and user-focused technology solutions that help businesses solve real-world challenges, improve efficiency, and achieve sustainable growth.</p>
        </div>
        <div className="simple-principles">
          {principles.map(([title, text], index) => (
            <div className="simple-principle" key={title}>
              <span>0{index + 1}</span><div><h3>{title}</h3><p>{text}</p></div>
            </div>
          ))}
        </div>
      </section>

      <section className="simple-nexus" id="nexusflow">
        <div>
          <span className="simple-eyebrow">OUR PRODUCT</span>
          <h2>Nexus<span>Flow</span></h2>
          <p>A connected workspace for modern businesses—bringing customers, projects, tasks, appointments, notifications, and activity into one place.</p>
          <button className="simple-light-button" onClick={enter}>Enter NexusFlow <ArrowRight size={17} /></button>
        </div>
        <div className="simple-nexus-panel">
          <div className="simple-panel-head"><span>WORKSPACE</span><Sparkles size={17} /></div>
          <strong>Everything connected.</strong>
          <div className="simple-panel-list">
            <span><Check size={14} /> Customers</span><span><Check size={14} /> Projects</span><span><Check size={14} /> Tasks</span><span><Check size={14} /> Activity</span>
          </div>
        </div>
      </section>

      <section className="simple-contact" id="contact">
        <div>
          <span className="simple-eyebrow dark">CONTACT US</span>
          <h2>Let’s build something<br /><span>useful together.</span></h2>
          <p>Have a business challenge, product idea, or question about NexusFlow? We’d be glad to hear from you.</p>
        </div>
        <div className="simple-contact-card">
          <span><Mail size={20} /> Start a conversation</span>
          <ArrowRight size={19} />
        </div>
      </section>

      <footer className="simple-footer">
        <div className="simple-brand footer-brand"><span className="simple-mark">∞</span><span><strong>Infinity Labs</strong><small>Technologies LLC</small></span></div>
        <span>Software engineering × artificial intelligence</span>
        <div><Link to="/terms">Terms</Link><Link to="/privacy">Privacy</Link><span>© 2026 Infinity Labs Technologies LLC</span></div>
      </footer>
    </main>
  );
}
