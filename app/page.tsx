"use client";

import Image from "next/image";
import { useState } from "react";
import CursorRayTracerWrapper from "./components/CursorRayTracerWrapper";
import ScrollReveal from "./components/ScrollReveal";
import TerminalScene from "./components/TerminalScene";

const heroImage =
  "/517RsN-X6-L.webp";

const navItems = [
  { label: "Home", href: "#home", active: true },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
];

const skills = [
  { label: "C/C++", className: "bg-cyber-yellow text-on-surface" },
  { label: "JavaScript", className: "bg-signal-pink text-white-base" },
  { label: "Python", className: "bg-tertiary-container text-on-surface" },
  { label: "Wireshark", className: "bg-white-base text-on-surface" },
  { label: "Metasploit", className: "bg-cyber-yellow text-on-surface" },
  { label: "BurpSuite", className: "bg-signal-pink text-white-base" },
  { label: "React", className: "bg-tertiary-container text-on-surface" },
  { label: "Redis", className: "bg-white-base text-on-surface" },
  { label: "PostgreSQL", className: "bg-cyber-yellow text-on-surface" },
  { label: "Docker", className: "bg-signal-pink text-white-base" },
  { label: "Git", className: "bg-tertiary-container text-on-surface" },
];

const projects = [
  {
    title: "Reconnaissance & Exposure Analyzer",
    description:
      "Advanced security audit tool for analyzing external attack surfaces. Built with Next.js and FastAPI for high-performance scanning.",
    tags: ["NEXT.JS", "FASTAPI"],
    headerClass: "bg-cyber-yellow text-on-surface",
  },
  {
    title: "Site Infrastructure Analyzer",
    description:
      "A browser extension that deconstructs website technologies and identifies potential architectural vulnerabilities in real-time.",
    tags: ["JAVASCRIPT", "CHROME API"],
    headerClass: "bg-signal-pink text-white-base",
  },
  {
    title: "onlyU - E2E Chat",
    description:
      "End-to-End Encrypted communication platform prioritizing privacy. Zero-knowledge architecture for secure data transmission.",
    tags: ["SECURITY", "CRYPTOGRAPHY"],
    headerClass: "bg-tertiary-container text-on-surface",
  },
  {
    title: "Assistive Hardware System",
    description:
      "Hardware solution using Raspberry Pi 5 and Gemini API to assist visually impaired individuals through real-time environment narration.",
    tags: ["PI 5", "GEMINI AI"],
    headerClass: "bg-on-background text-cyber-yellow",
  },
];

const timeline = [
  {
    heading: "Experience",
    items: [
      {
        dotClass: "bg-cyber-yellow",
        dates: "2026",
        title: "MERN Stack Intern",
        subtitle: "ChargeMod (Software Department)",
        body: "Developing scalable full-stack applications using MongoDB, Express.js, React, and Node.js. Contributing to EV infrastructure management software and internal tooling.",
      },
      {
        dotClass: "bg-cyber-yellow",
        dates: "2025",
        title: "Network Engineer Intern",
        subtitle: "Syama Dynamic",
        body: "Managing enterprise-grade network infrastructure and implementing security protocols.",
      },
    ]
  },
  {
    heading: "Education",
    items: [
      {
        dotClass: "bg-signal-pink",
        dates: "2024",
        title: "B.Tech in Engineering",
        subtitle: "Cochin University of Science and Technology (CUSAT)",
        body: "Focusing on Network Engineering and System Security architectures.",
      },
    ]
  },
];

export default function Home() {
  const [showTerminal, setShowTerminal] = useState(false);

  if (showTerminal) {
    return <TerminalScene />;
  }

  return (
    <>
      <CursorRayTracerWrapper />
      <header className="sticky top-0 z-50 flex w-full items-center justify-between border-b-4 border-black bg-white-base px-4 py-4 shadow-[8px_8px_0_0_rgba(0,0,0,1)] md:px-16">
        <a
          href="#home"
          className="font-headline-md text-headline-md font-black uppercase tracking-normal text-on-surface"
        >
          ALEN.SH
        </a>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Main">
          {navItems.map((item) => (
            <a
              key={item.href}
              className={`px-2 py-1 font-label-caps text-label-caps transition-all duration-100 hover:bg-signal-pink hover:text-white-base active:translate-x-1 active:translate-y-1 ${item.active
                  ? "bg-cyber-yellow text-on-surface"
                  : "text-on-surface-variant"
                }`}
              href={item.href}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a
          className="neubrutalist-shadow-hover border-4 border-black bg-secondary px-4 py-2 font-label-caps text-label-caps text-white-base transition-all"
          href="mailto:alen@example.com"
        >
          Hire Me
        </a>
      </header>

      <main className="mx-auto max-w-7xl space-y-24 px-4 py-12 md:px-16">
        <section
          className="flex scroll-mt-32 flex-col items-center gap-12 pt-8 md:flex-row"
          id="home"
        >
          <ScrollReveal direction="left" className="flex-1 space-y-6">
            <div className="inline-block rotate-[-2deg] border-2 border-black bg-tertiary-container px-3 py-1 font-label-code text-label-code">
              SYSTEM_INIT: READY
            </div>
            <h1 className="max-w-4xl font-display-lg text-display-lg leading-none text-on-surface md:text-[84px]">
              ALEN ELIAS CHERIAN
            </h1>
            <p className="max-w-xl font-body-lg text-body-lg text-on-surface">
              Cybersecurity & Network Engineering student at{" "}
              <span className="border-b-2 border-black bg-cyber-yellow px-1">
                CUSAT
              </span>
              . Building bulletproof systems and analyzing global network
              infrastructures.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <a
                className="neubrutalist-shadow neubrutalist-shadow-hover flex items-center gap-2 border-4 border-black bg-cyber-yellow px-6 py-4 font-headline-md text-2xl font-black text-on-surface transition-all sm:px-8 sm:text-headline-md"
                href="https://drive.google.com/uc?export=download&id=1XsJ_-7ikwZFUhBgpmkFljAzOvBo86YLO"
                rel="noopener noreferrer"
                target="_blank"
              >
                <span className="material-symbols-outlined" aria-hidden="true">
                  download
                </span>
                DOWNLOAD CV
              </a>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" className="relative w-full flex-1">
            <div className="absolute -left-4 -top-4 h-full w-full border-4 border-black bg-signal-pink" />
            <Image
              alt="Cybersecurity workspace with neon server racks and digital interfaces"
              className="relative z-10 aspect-square w-full border-4 border-black object-cover grayscale transition-all duration-500 hover:grayscale-0"
              height={900}
              priority
              src={heroImage}
              width={900}
            />
          </ScrollReveal>
        </section>

        <section className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <ScrollReveal direction="up" className="neubrutalist-shadow space-y-4 border-4 border-black bg-white-base p-8 md:col-span-2">
            <h2 className="font-headline-lg text-headline-lg uppercase underline decoration-cyber-yellow decoration-8 underline-offset-4">
              Identity_Brief
            </h2>
            <p className="font-body-lg text-body-lg">
              I am currently in my 2nd year of B.Tech at Cochin University of
              Science and Technology (CUSAT). My technical focus lies at the
              intersection of{" "}
              <span className="font-bold underline decoration-signal-pink decoration-2">
                Computer Networks
              </span>{" "}
              and{" "}
              <span className="font-bold underline decoration-signal-pink decoration-2">
                Cybersecurity
              </span>
              .
            </p>
            <p className="font-body-md text-body-md">
              Driven by the challenge of scalable software and the intricacies
              of network protocols, I spend my time auditing web infrastructures
              and developing assistive hardware that bridges the gap between AI
              and the physical world.
            </p>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.2} className="neubrutalist-shadow flex flex-col justify-between border-4 border-black bg-tertiary-container p-8">
            <div>
              <h3 className="mb-2 font-label-caps text-label-caps text-on-surface-variant">
                ACHIEVEMENT_01
              </h3>
              <p className="font-headline-md text-headline-md font-black">
                TOP 10 IN GOOGLE PHYSICAL AI HACKATHON
              </p>
            </div>
            <span
              className="material-symbols-outlined mt-4 text-[64px]"
              aria-hidden="true"
            >
              workspace_premium
            </span>
          </ScrollReveal>
        </section>

        <ScrollReveal direction="up" className="scroll-mt-32 space-y-8" id="skills">
          <h2 className="flex flex-wrap items-center gap-4 font-headline-lg text-headline-lg uppercase">
            <span className="bg-black px-3 py-1 text-white-base">SKILLS</span>
            <span className="font-label-code text-label-code text-on-surface-variant">
              :: STACK.MAP
            </span>
          </h2>
          <div className="flex flex-wrap gap-4">
            {skills.map((skill) => (
              <span
                className={`${skill.className} border-2 border-black px-4 py-2 font-label-code text-label-code font-bold uppercase transition-transform hover:-translate-y-1`}
                key={skill.label}
              >
                {skill.label}
              </span>
            ))}
          </div>
        </ScrollReveal>

        <section className="scroll-mt-32 space-y-12" id="projects">
          <ScrollReveal direction="up" className="flex items-end justify-between gap-8">
            <h2 className="font-headline-lg text-headline-lg uppercase">
              Projects
            </h2>
            <p className="max-w-xs text-right font-label-code text-label-code text-on-surface-variant">
              04 CRITICAL DEPLOYMENTS DETECTED
            </p>
          </ScrollReveal>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
            {projects.map((project, index) => (
              <ScrollReveal
                key={project.title}
                direction="up"
                delay={index * 0.1}
                className="neubrutalist-shadow neubrutalist-shadow-hover group flex w-full flex-col border-4 border-black bg-white-base transition-all"
              >
                <div className={`${project.headerClass} border-b-4 border-black p-4`}>
                  <h3 className="font-headline-md text-headline-md font-black uppercase">
                    {project.title}
                  </h3>
                </div>
                <div className="flex-grow space-y-4 p-6">
                  <p className="font-body-md text-body-md">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        className="bg-on-background px-2 py-1 font-label-caps text-[10px] text-white-base"
                        key={tag}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-auto p-6 pt-0">
                  <a
                    className="inline-flex items-center gap-2 font-label-caps text-label-caps font-extrabold transition-colors hover:text-signal-pink"
                    href="#home"
                  >
                    VIEW_SOURCE
                    <span
                      className="material-symbols-outlined"
                      aria-hidden="true"
                    >
                      arrow_outward
                    </span>
                  </a>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        <section
          className="grid scroll-mt-32 grid-cols-1 gap-12 md:grid-cols-2"
          id="experience"
        >
          {timeline.map((section, index) => (
            <ScrollReveal direction={index % 2 === 0 ? "left" : "right"} className="space-y-8" key={section.heading}>
              <h2 className="font-headline-lg text-headline-lg uppercase">
                {section.heading}
              </h2>
              <div className="relative ml-2 space-y-12 border-l-4 border-black pl-8">
                {section.items.map((item, itemIndex) => (
                  <div className="relative" key={itemIndex}>
                    <div
                      className={`absolute -left-[42px] top-0 h-4 w-4 border-4 border-black ${item.dotClass}`}
                    />
                    <span className="bg-on-background px-2 py-1 font-label-code text-label-code text-terminal-green">
                      {item.dates}
                    </span>
                    <h3 className="mt-2 font-headline-md text-headline-md">
                      {item.title}
                    </h3>
                    <p className="font-bold text-on-surface-variant">
                      {item.subtitle}
                    </p>
                    <p className="mt-2 font-body-md text-body-md">{item.body}</p>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          ))}
        </section>
      </main>

      <ScrollReveal direction="up" className="mt-24 w-full border-t-4 border-black bg-on-background px-4 py-12 md:px-16">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 md:flex-row">
          <div className="space-y-4">
            <div className="font-label-caps text-2xl font-black text-terminal-green">
              ALEN.SH
            </div>
            <p className="max-w-sm font-label-code text-label-code text-surface-container-lowest">
              © 2024 ALEN ELIAS CHERIAN | SECURED_CONNECTION
            </p>
          </div>
          <div className="flex gap-8">
            <button
              className="font-label-code text-label-code text-terminal-green transition-all hover:skew-x-2 hover:text-signal-pink cursor-pointer"
              onClick={() => setShowTerminal(true)}
            >
              Terminal
            </button>
            {["GitHub", "LinkedIn"].map((item) => (
              <a
                className="font-label-code text-label-code text-terminal-green transition-all hover:skew-x-2 hover:text-signal-pink"
                href="#home"
                key={item}
              >
                {item}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-4 border-2 border-black bg-surface-container-high p-4">
            <div className="h-3 w-3 animate-pulse rounded-full bg-terminal-green" />
            <span className="font-label-code text-label-code font-bold uppercase text-on-surface">
              Node_Status: Online
            </span>
          </div>
        </div>
      </ScrollReveal>
    </>
  );
}
