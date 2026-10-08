import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Shell = ({ title, eyebrow, children }: { title: string; eyebrow: string; children: ReactNode }) => (
  <main className="legal-page">
    <header className="legal-nav">
      <Link to="/" className="intro-brand"><span className="brand-symbol">∞</span><span><strong>Infinity Labs</strong><small>Technologies LLC</small></span></Link>
      <Link to="/" className="legal-back"><ArrowLeft size={15}/> Back to company</Link>
    </header>
    <section className="legal-hero"><span>{eyebrow}</span><h1>{title}</h1><p>Last updated: October 7, 2026</p></section>
    <article className="legal-content">{children}</article>
  </main>
);

export function TermsOfService() {
  return <Shell title="Terms of Service" eyebrow="LEGAL / TERMS">
    <h2>1. Agreement</h2><p>These Terms of Service govern your use of websites, applications, and services provided by Infinity Labs Technologies LLC, including NexusFlow.</p>
    <h2>2. Use of the service</h2><p>You agree to use the service lawfully, protect your account credentials, and avoid actions that could disrupt, abuse, or compromise the platform or other users.</p>
    <h2>3. Accounts and access</h2><p>You are responsible for information submitted to your account and for activity performed through credentials under your control. Company administrators may manage access within their organization.</p>
    <h2>4. Customer content</h2><p>You retain rights to content and business data you submit. You grant Infinity Labs the limited rights necessary to operate, secure, maintain, and improve the service.</p>
    <h2>5. Availability</h2><p>We aim to provide a reliable service, but availability may occasionally be affected by maintenance, infrastructure failures, or circumstances outside our reasonable control.</p>
    <h2>6. Changes</h2><p>We may update these terms as the product evolves. Material changes will be communicated through appropriate product or website notices.</p>
    <h2>7. Contact</h2><p>For questions about these terms, contact Infinity Labs Technologies LLC through the company contact channel associated with your account.</p>
  </Shell>;
}

export function PrivacyPolicy() {
  return <Shell title="Privacy Policy" eyebrow="LEGAL / PRIVACY">
    <h2>1. Information we collect</h2><p>We may collect account information, organization information, product usage data, and information you choose to store in NexusFlow.</p>
    <h2>2. How we use information</h2><p>We use information to provide and secure the service, authenticate users, support customers, maintain platform reliability, and improve our products.</p>
    <h2>3. Business data</h2><p>Workspace content such as customers, projects, tasks, and appointments is processed to provide the features requested by your organization.</p>
    <h2>4. Security</h2><p>We use reasonable technical and organizational safeguards designed to protect information against unauthorized access, alteration, disclosure, or destruction.</p>
    <h2>5. Retention</h2><p>We retain information for as long as reasonably necessary to provide the service, meet legitimate business needs, resolve disputes, and comply with applicable obligations.</p>
    <h2>6. Your choices</h2><p>Depending on your account and applicable law, you may request access, correction, or deletion of personal information by contacting us.</p>
    <h2>7. Updates</h2><p>This policy may change as our services evolve. We will publish updated versions with a new effective date when appropriate.</p>
  </Shell>;
}
