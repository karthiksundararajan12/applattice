"use client";

import { useEffect, useId, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { portfolioProjects } from "@/lib/portfolio";
import { ProjectMockup } from "@/components/portfolio/ProjectMockups";

function Reveal({ children, className, delay = 0 }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function ProjectDetailsDialog({ project, onClose }) {
  const dialogRef = useRef(null);
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    const node = dialogRef.current;
    if (!node) return;
    if (project && !node.open) node.showModal();
    if (!project && node.open) node.close();
  }, [project]);

  useEffect(() => {
    const node = dialogRef.current;
    if (!node) return;
    const handleClose = () => onClose();
    node.addEventListener("close", handleClose);
    return () => node.removeEventListener("close", handleClose);
  }, [onClose]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={descId}
      className="project-dialog w-[min(36rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-border bg-white p-0 text-text shadow-xl backdrop:bg-slate-900/40"
      onClick={(event) => {
        if (event.target === dialogRef.current) dialogRef.current?.close();
      }}
    >
      {project ? (
        <div className="flex max-h-[min(40rem,calc(100vh-2rem))] flex-col">
          <div className="flex items-start justify-between gap-4 border-b border-border px-5 py-4 sm:px-6">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">
                {project.tag}
              </p>
              <h3 id={titleId} className="mt-1 text-lg font-bold tracking-tight text-text">
                {project.title}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => dialogRef.current?.close()}
              className="rounded-full border border-border p-1.5 text-muted transition-colors hover:border-primary/30 hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
              aria-label="Close project details"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          </div>
          <div className="overflow-y-auto px-5 py-5 sm:px-6">
            <p id={descId} className="text-sm leading-relaxed text-muted">
              {project.description}
            </p>
            <p className="mt-3 text-xs font-medium text-slate-500">
              Preview shown is a {project.previewLabel.toLowerCase()}, not a live client screenshot.
            </p>
            <h4 className="mt-5 text-xs font-semibold uppercase tracking-wider text-text">
              What it covers
            </h4>
            <ul className="mt-2 space-y-2">
              {project.features.map((feature) => (
                <li key={feature} className="flex gap-2 text-sm text-muted">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" aria-hidden />
                  {feature}
                </li>
              ))}
            </ul>
            <div className="mt-5 flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-border bg-bg-secondary px-2 py-0.5 text-[11px] font-medium text-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="border-t border-border px-5 py-4 sm:px-6">
            <a
              href="#contact"
              onClick={() => dialogRef.current?.close()}
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
            >
              Discuss this solution
              <ArrowRight className="h-4 w-4" aria-hidden />
            </a>
          </div>
        </div>
      ) : null}
    </dialog>
  );
}

function PortfolioCard({ project, onViewDetails, delay = 0 }) {
  return (
    <Reveal delay={delay} className="h-full min-w-0">
      <article
        className={cn(
          "project-card group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm",
          "transition-[transform,box-shadow,border-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          "hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg",
          "motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:hover:shadow-sm"
        )}
      >
        <figure className="relative bg-bg-secondary p-3 sm:p-3.5">
          <div
            className={cn(
              "h-[18rem] overflow-hidden rounded-xl sm:h-[20rem] lg:h-[22.5rem]",
              "transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.015]",
              "motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            )}
          >
            <ProjectMockup type={project.mockup} className="h-full" />
          </div>
          <figcaption className="sr-only">
            {project.previewLabel} of the {project.title} dashboard. Sample interface for illustration, not a live project screenshot.
          </figcaption>
        </figure>
        <div className="flex flex-1 flex-col px-5 pb-5 pt-4 sm:px-6 sm:pb-6">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-primary">{project.tag}</p>
          <h3 className="mt-1.5 text-lg font-bold tracking-tight text-text">{project.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">{project.description}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md border border-border bg-bg-secondary px-2 py-0.5 text-[11px] font-medium text-muted"
              >
                {tag}
              </span>
            ))}
          </div>
          <button
            type="button"
            aria-haspopup="dialog"
            onClick={() => onViewDetails(project)}
            className="mt-4 inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-primary transition-all duration-300 hover:gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 motion-reduce:transition-none"
          >
            View Details
            <ArrowRight className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </article>
    </Reveal>
  );
}

export function WorkSection() {
  const [activeProject, setActiveProject] = useState(null);
  const reduce = useReducedMotion();

  return (
    <section id="work" className="section-padding bg-bg-alt">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Selected Projects</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-text md:text-4xl">
            Solutions We&apos;ve Built
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
            Product concepts and selected software designed around how teams actually operate.
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {portfolioProjects.map((project, i) => (
            <PortfolioCard
              key={project.id}
              project={project}
              onViewDetails={setActiveProject}
              delay={reduce ? 0 : i * 0.08}
            />
          ))}
        </div>
      </div>
      <ProjectDetailsDialog project={activeProject} onClose={() => setActiveProject(null)} />
    </section>
  );
}
