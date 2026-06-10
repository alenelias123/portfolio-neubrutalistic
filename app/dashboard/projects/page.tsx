import React from 'react';

const projects = [
  {
    id: 1,
    title: "Reconnaissance & Exposure Analyzer",
    description: "Advanced security audit tool for analyzing external attack surfaces. Built with Next.js and FastAPI for high-performance scanning.",
    tags: ["NEXT.JS", "FASTAPI"],
    color: "bg-cyber-yellow",
    link: "https://github.com/alenelias123/recon",
  },
  {
    id: 2,
    title: "Project Two",
    description: "Description for the second critical deployment. Add more details about technology and purpose here.",
    tags: ["REACT", "NODE.JS"],
    color: "bg-cyan-300",
    link: "https://github.com/alenelias123/Site-Ammavan",
  },
  {
    id: 3,
    title: "Project Three",
    description: "Description for the third critical deployment. Highlight key achievements or unique capabilities.",
    tags: ["PYTHON", "TENSORFLOW"],
    color: "bg-lime-300",
    link: "https://github.com/alenelias123/onlyU",
  },
  {
    id: 4,
    title: "Project Four",
    description: "Description for the fourth critical deployment. Fully customizable for your needs.",
    tags: ["GO", "DOCKER"],
    color: "bg-pink-300",
    link: "https://github.com/alenelias123/braille2",
  },
];

export default function Projects() {
  return (
    <section className="space-y-12" id="projects">
      {/* Header */}
      <div className="flex justify-between items-end">
        <h2 className="font-headline-lg text-headline-lg uppercase">Projects</h2>
        <p className="font-label-code text-label-code text-on-surface-variant max-w-xs text-right">
          04 CRITICAL DEPLOYMENTS DETECTED
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {projects.map((project) => (
          <div
            key={project.id}
            className="group bg-white border-4 border-black neubrutalist-shadow neubrutalist-shadow-hover transition-all flex flex-col"
          >
            {/* Colored Header */}
            <div className={`${project.color} border-b-4 border-black p-4`}>
              <h3 className="font-headline-md text-headline-md font-black uppercase">
                {project.title}
              </h3>
            </div>

            {/* Content */}
            <div className="p-6 flex-grow space-y-4">
              <p className="font-body-md text-body-md">
                {project.description}
              </p>

              {/* Tags */}
              <div className="flex gap-2 flex-wrap">
                {project.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-on-background text-white-base px-2 py-1 font-label-caps text-[10px] tracking-widest"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer Link */}
            <div className="p-6 pt-0 mt-auto">
              <a
                href={project.link}
                className="inline-flex items-center gap-2 font-label-caps text-label-caps font-extrabold hover:text-signal-pink transition-colors"
              >
                VIEW SOURCE
                <span className="material-symbols-outlined">arrow_outward</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}