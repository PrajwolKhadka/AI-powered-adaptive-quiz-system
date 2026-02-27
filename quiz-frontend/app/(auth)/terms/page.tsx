"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

const sections = [
  { id: "introduction", title: "Introduction" },
  { id: "definitions", title: "Definitions" },
  { id: "eligibility", title: "Eligibility & Accounts" },
  { id: "acceptable-use", title: "Acceptable Use" },
  { id: "ai-services", title: "AI Services" },
  { id: "data-privacy", title: "Data & Privacy" },
  { id: "security", title: "Security" },
  { id: "intellectual-property", title: "Intellectual Property" },
  { id: "payments", title: "Payments" },
  { id: "termination", title: "Termination" },
  { id: "liability", title: "Liability" },
  { id: "changes", title: "Changes to Terms" },
  { id: "governing-law", title: "Governing Law" },
  { id: "contact", title: "Contact" },
];

const definitions = [
  [
    "Platform",
    "The Adaptive AI Quiz System including all software, APIs, AI models, and services.",
  ],
  [
    "School",
    "Any registered educational institution with an active service agreement.",
  ],
  [
    "Administrator",
    "Authorized representative managing accounts and institutional data.",
  ],
  [
    "Teacher",
    "Authorized educator creating assessments and monitoring progress.",
  ],
  [
    "Student",
    "Enrolled learner accessing the Platform for quizzes and assessments.",
  ],
  [
    "AI Services",
    "Automated question generation, scoring, analytics, and personalized feedback.",
  ],
  [
    "Content",
    "All data, questions, assessments, and materials created through the Platform.",
  ],
  [
    "Personal Data",
    "Any information that identifies or could reasonably identify an individual User.",
  ],
];

const prohibitions = [
  [
    "Academic Dishonesty",
    "Manipulating AI scoring, sharing quiz answers, or facilitating academic fraud.",
  ],
  [
    "Reverse Engineering",
    "Decompiling or extracting source code, algorithms, or AI models.",
  ],
  [
    "Unauthorized Access",
    "Accessing accounts or data without authorization or bypassing authentication.",
  ],
  [
    "Harmful Content",
    "Uploading illegal, defamatory, obscene, or discriminatory material.",
  ],
  [
    "Commercial Exploitation",
    "Reselling or sublicensing any portion of the Platform without written consent.",
  ],
  [
    "Interference",
    "Disrupting Platform infrastructure through denial-of-service attacks or automated abuse.",
  ],
];

function SectionTitle({ num, title }: { num: number; title: string }) {
  return (
    <div className="flex items-center gap-2.5 pb-3 mb-4 border-b border-gray-100">
      <span className="font-mono text-xs font-medium text-blue-500 bg-blue-50 px-2 py-0.5 rounded">
        {String(num).padStart(2, "0")}
      </span>
      <h2 className="text-lg font-semibold text-gray-900 tracking-tight">
        {title}
      </h2>
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-1.5 my-3">
      {items.map((item, i) => (
        <li
          key={i}
          className="flex gap-2.5 items-start text-sm text-gray-600 bg-gray-50 border border-gray-100 rounded-md px-3 py-2.5 leading-relaxed"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-blue-50 border border-blue-100 border-l-2 border-l-blue-400 rounded-md px-4 py-3 my-4 text-sm text-blue-700 leading-relaxed">
      {children}
    </div>
  );
}

export default function TermsAndConditions() {
  const [active, setActive] = useState("introduction");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-10% 0px -75% 0px" },
    );
    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="flex min-h-screen bg-white font-sans">
      {/* Sidebar */}
      <aside className="sticky top-0 h-screen w-56 shrink-0 bg-gray-50 border-r border-gray-200 flex flex-col overflow-hidden">
        <div className="px-6 py-6 border-b border-gray-800 flex items-center justify-center shrink-0">
          <div className="w-full h-28 relative">
            <Image
              src="/images/logo.png"
              alt="Logo"
              fill
              className="object-contain"
            />
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-700 px-2 pb-2">
            Contents
          </p>
          {sections.map((s, i) => (
            <button
              key={s.id}
              onClick={() => scrollTo(s.id)}
              className={`flex items-center gap-2 w-full text-left px-2 py-1.5 rounded-md text-xs mb-0.5 transition-all ${
                active === s.id
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "text-gray-500 hover:bg-gray-100 hover:text-gray-800"
              }`}
            >
              <span
                className={`font-mono text-[10px] w-4 shrink-0 ${active === s.id ? "text-blue-400" : "text-gray-300"}`}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              {s.title}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto px-16 py-12 max-w-3xl">
        {/* Header */}
        <header className="mb-10 pb-8 border-b border-gray-100">
          <span className="inline-flex items-center gap-0 text-[20px] font-semibold uppercase text-black px-0 py-1 rounded-full mb-4">
            Legal Document
          </span>
          <h1 className="text-3xl font-semibold text-gray-900 tracking-tight mb-2">
            Terms and Conditions
          </h1>
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
            <span>Maanak-Adaptive AI Quiz System</span>
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            <span>
              Last updated{" "}
              {new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          <p className="text-sm text-gray-500 leading-relaxed max-w-lg">
            By registering or accessing the Platform, your institution agrees to
            be legally bound by these Terms. Please read them carefully before
            use.
          </p>
        </header>

        {/* 1. Introduction */}
        <section id="introduction" className="mb-10 scroll-mt-6">
          <SectionTitle num={1} title="Introduction" />
          <p className="text-sm text-gray-600 leading-relaxed mb-3">
            The Adaptive AI Quiz System ("Platform") is an AI-powered
            educational solution providing personalized, adaptive assessments to
            registered academic institutions. These Terms govern access and use
            by all authorized institutions, administrators, educators, and
            students.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed mb-3">
            The Platform is available exclusively to registered schools with a
            valid service agreement. Unauthorized access or reproduction is
            strictly prohibited.
          </p>
          <Callout>
            By using this Platform, your institution agrees to comply with these
            Terms. If you do not accept them, you must cease access immediately
            and notify us to terminate your account.
          </Callout>
        </section>

        {/* 2. Definitions */}
        <section id="definitions" className="mb-10 scroll-mt-6">
          <SectionTitle num={2} title="Definitions" />
          <p className="text-sm text-gray-500 mb-3">
            Key terms used throughout these Terms:
          </p>
          <div className="border-t border-gray-100">
            {definitions.map(([term, desc]) => (
              <div
                key={term}
                className="grid grid-cols-[140px_1fr] gap-4 py-2.5 border-b border-gray-100"
              >
                <span className="text-xs font-semibold text-gray-800">
                  {term}
                </span>
                <span className="text-xs text-gray-500 leading-relaxed">
                  {desc}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Eligibility */}
        <section id="eligibility" className="mb-10 scroll-mt-6">
          <SectionTitle num={3} title="Eligibility & Accounts" />
          <p className="text-sm text-gray-600 leading-relaxed mb-3">
            <strong className="text-gray-800">
              Institutional Eligibility.
            </strong>{" "}
            Access is restricted to accredited educational institutions that
            have completed registration and entered into a valid Service
            Agreement.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed mb-2">
            <strong className="text-gray-800">Account Responsibilities.</strong>{" "}
            Schools are responsible for all activities under their account,
            including:
          </p>
          <BulletList
            items={[
              "Creating accounts only for active, authorized members of the institution.",
              "Keeping credentials confidential and promptly deactivating departing users.",
              "Reporting any unauthorized access immediately.",
            ]}
          />
          <p className="text-sm text-gray-600 leading-relaxed">
            <strong className="text-gray-800">Student Accounts.</strong> Schools
            must ensure student data accuracy and obtain any required parental
            consent for applicable age groups.
          </p>
        </section>

        {/* 4. Acceptable Use */}
        <section id="acceptable-use" className="mb-10 scroll-mt-6">
          <SectionTitle num={4} title="Acceptable Use Policy" />
          <p className="text-sm text-gray-600 leading-relaxed mb-3">
            The Platform may be used solely for lawful educational purposes. The
            following activities are strictly prohibited:
          </p>
          <ul className="flex flex-col gap-1.5 my-3">
            {prohibitions.map(([bold, text]) => (
              <li
                key={bold}
                className="flex gap-2.5 items-start text-sm text-gray-600 bg-gray-50 border border-gray-100 rounded-md px-3 py-2.5 leading-relaxed"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                <span>
                  <strong className="text-gray-800">{bold}:</strong> {text}
                </span>
              </li>
            ))}
          </ul>
          <Callout>
            Violations may result in immediate suspension or permanent
            termination of access, and may be reported to relevant authorities.
          </Callout>
        </section>

        {/* 5. AI Services */}
        <section id="ai-services" className="mb-10 scroll-mt-6">
          <SectionTitle num={5} title="AI-Generated Services" />
          <p className="text-sm text-gray-600 leading-relaxed mb-3">
            The Platform uses machine learning to generate adaptive quizzes,
            evaluate responses, and produce personalized feedback. These AI
            Services are designed to augment — not replace — professional
            educational judgment.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed mb-3">
            <strong className="text-gray-800">Accuracy Limitations.</strong> AI
            outputs may occasionally be incomplete or incorrect. We do not
            warrant that AI-generated content will be error-free or free from
            bias.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed mb-3">
            <strong className="text-gray-800">Human Oversight Required.</strong>{" "}
            High-stakes decisions — including grades, promotions, or
            disciplinary actions — must not be based solely on automated outputs
            without human review.
          </p>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {[
              "Machine Learning",
              "Adaptive Scoring",
              "Personalized Feedback",
              "Human Oversight",
            ].map((tag) => (
              <span
                key={tag}
                className="font-mono text-[10px] text-gray-500 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        </section>

        {/* 6. Data & Privacy */}
        <section id="data-privacy" className="mb-10 scroll-mt-6">
          <SectionTitle num={6} title="Data & Privacy" />
          <p className="text-sm text-gray-600 leading-relaxed mb-3">
            <strong className="text-gray-800">Data Ownership.</strong> Schools
            retain full ownership of all institutional and student data. We act
            as a data processor on behalf of the School as the data controller.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed mb-2">
            <strong className="text-gray-800">Data We Collect:</strong>
          </p>
          <BulletList
            items={[
              "Account Data: institution name, administrator contacts, and login credentials.",
              "Student Data: names, IDs, quiz responses, scores, and learning progress.",
              "Usage Data: session metadata, feature usage, and device/browser information.",
            ]}
          />
          <p className="text-sm text-gray-600 leading-relaxed mb-3">
            We do not sell or share Personal Data with third parties for
            commercial purposes. Data is retained for the duration of the
            Service Agreement plus up to 12 months. We comply with FERPA, COPPA,
            and GDPR where applicable.
          </p>
        </section>

        {/* 7. Security */}
        <section id="security" className="mb-10 scroll-mt-6">
          <SectionTitle num={7} title="Security & Compliance" />
          <p className="text-sm text-gray-600 leading-relaxed mb-2">
            We implement industry-standard security measures including:
          </p>
          <BulletList
            items={[
              "TLS/SSL encrypted data transmission for all Platform communications.",
              "JWT-based authentication with configurable token expiry.",
              "Role-based access controls (RBAC) and encrypted data storage.",
              "Regular security audits, penetration testing, and automated breach monitoring.",
            ]}
          />
          <p className="text-sm text-gray-600 leading-relaxed">
            No system guarantees absolute security. In the event of a confirmed
            breach, we will notify affected Schools promptly and cooperate on
            containment and regulatory obligations.
          </p>
        </section>

        {/* 8. Intellectual Property */}
        <section id="intellectual-property" className="mb-10 scroll-mt-6">
          <SectionTitle num={8} title="Intellectual Property" />
          <p className="text-sm text-gray-600 leading-relaxed mb-3">
            All intellectual property — including source code, AI algorithms, UI
            designs, and documentation — remains the exclusive property of the
            Platform operator. Schools receive a limited, non-exclusive,
            non-transferable license for internal educational use only.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed mb-3">
            <strong className="text-gray-800">School Content.</strong> Schools
            retain ownership of content they upload. By uploading, you grant us
            a limited license to host and process it solely to deliver the
            Platform's services.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            Users may not copy, reverse engineer, or create derivative works
            from any Platform component without prior written consent.
          </p>
        </section>

        {/* 9. Payments */}
        <section id="payments" className="mb-10 scroll-mt-6">
          <SectionTitle num={9} title="Payments & Subscriptions" />
          <p className="text-sm text-gray-600 leading-relaxed mb-3">
            Premium features require subscription fees as outlined in your
            Service Agreement, billed in advance on your chosen cycle (monthly,
            quarterly, or annually). All fees are exclusive of applicable taxes.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed mb-3">
            <strong className="text-gray-800">Late Payment.</strong> Failure to
            pay by the due date may result in service suspension after a grace
            period. Fees are generally non-refundable. Billing errors must be
            reported within 30 days.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            <strong className="text-gray-800">Price Changes.</strong> We will
            provide at least 60 days' written notice before any pricing changes
            take effect.
          </p>
        </section>

        {/* 10. Termination */}
        <section id="termination" className="mb-10 scroll-mt-6">
          <SectionTitle num={10} title="Termination" />
          <p className="text-sm text-gray-600 leading-relaxed mb-3">
            Schools may terminate their account at any time with written notice.
            Please export all data before closure, as it will be permanently
            deleted afterward.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed mb-2">
            We may suspend or terminate accounts for:
          </p>
          <BulletList
            items={[
              "Material breach of these Terms not remedied within a reasonable cure period.",
              "Non-payment beyond the applicable grace period.",
              "Detected misuse, fraud, or actions posing a security risk.",
            ]}
          />
          <p className="text-sm text-gray-600 leading-relaxed">
            Upon termination, all licenses cease immediately. Provisions on IP,
            liability, and governing law survive termination.
          </p>
        </section>

        {/* 11. Liability */}
        <section id="liability" className="mb-10 scroll-mt-6">
          <SectionTitle num={11} title="Limitation of Liability" />
          <p className="text-sm text-gray-600 leading-relaxed mb-3">
            The Platform is provided "as is" without warranties of any kind. We
            do not guarantee uninterrupted service or that AI-generated content
            will be accurate or error-free.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed mb-3">
            To the maximum extent permitted by law, we are not liable for
            indirect, incidental, or consequential damages. Our total cumulative
            liability shall not exceed fees paid by the School in the 12 months
            preceding the claim.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            Schools agree to indemnify and hold harmless the Platform operator
            from claims arising from their violation of these Terms or misuse of
            the Platform.
          </p>
        </section>

        {/* 12. Changes */}
        <section id="changes" className="mb-10 scroll-mt-6">
          <SectionTitle num={12} title="Changes to Terms" />
          <p className="text-sm text-gray-600 leading-relaxed mb-3">
            We may revise these Terms at any time. For material changes, we will
            provide at least 30 days' advance written notice by email and via a
            Platform notification. Minor changes may take effect immediately.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            Continued use of the Platform after revised Terms take effect
            constitutes acceptance. Schools that disagree must cease use and
            request account termination before the effective date.
          </p>
        </section>

        {/* 13. Governing Law */}
        <section id="governing-law" className="mb-10 scroll-mt-6">
          <SectionTitle num={13} title="Governing Law" />
          <p className="text-sm text-gray-600 leading-relaxed mb-3">
            These Terms are governed by the laws of the jurisdiction in which
            the Platform operator is incorporated, without regard to conflict of
            law principles.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed mb-3">
            Both parties agree to attempt informal resolution through good-faith
            negotiation for at least 30 days before pursuing formal proceedings.
            Where permitted, unresolved disputes shall be submitted to binding
            arbitration.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            Either party may seek immediate equitable relief from any competent
            court to prevent irreparable harm, particularly for IP infringement
            or data breaches.
          </p>
        </section>

        {/* 14. Contact */}
        <section id="contact" className="mb-10 scroll-mt-6">
          <SectionTitle num={14} title="Contact Information" />
          <p className="text-sm text-gray-600 leading-relaxed mb-3">
            For general questions, technical support, or account matters,
            contact your assigned system administrator or reach out through the
            support channels provided in your Service Agreement.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed mb-3">
            Formal legal notices must be submitted in writing to the Platform
            operator's registered address. For data privacy inquiries, contact
            our Data Protection Officer at the details provided in your Service
            Agreement.
          </p>
          <Callout>
            This document constitutes the entire agreement between your
            institution and the Platform operator, superseding all prior
            agreements. It is effective from the date your institution first
            accessed the Platform or the date shown above, whichever is earlier.
          </Callout>
        </section>
      </main>
    </div>
  );
}
