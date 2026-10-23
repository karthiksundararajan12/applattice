"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from "motion/react";
import {
  ArrowRight,
  ChevronDown,
  Menu,
  X,
  MapPin,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  navLinks,
  heroModules,
  capabilityBadges,
  problems,
  solutionWorkflow,
  automationWorkflow,
  services,
  aiAgents,
  industries,
  processSteps,
  whyChoose,
  technologies,
  serviceOptions,
  footerLinks,
} from "@/lib/data";
import { WorkSection } from "@/components/sections/WorkSection";

const HERO_SUPPORT =
  "AppLattice builds AI-powered automation, custom software, web applications and mobile experiences that help businesses eliminate repetitive work, capture more opportunities and scale efficiently.";

function Reveal({ children, className, delay = 0, y = 24 }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function MagneticButton({ children, className, href, onClick, type = "button", disabled = false }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });
  const reduce = useReducedMotion();

  const handleMove = (e) => {
    if (disabled || reduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const relX = e.clientX - rect.left - rect.width / 2;
    const relY = e.clientY - rect.top - rect.height / 2;
    x.set(relX * 0.15);
    y.set(relY * 0.15);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  const Comp = href ? motion.a : motion.button;
  const props = href
    ? {
        href: disabled ? undefined : href,
        "aria-disabled": disabled || undefined,
        onClick: disabled
          ? (event) => event.preventDefault()
          : onClick,
      }
    : { type, onClick, disabled };

  return (
    <motion.div style={{ x: springX, y: springY }} className="inline-flex">
      <Comp
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        className={className}
        {...props}
      >
        {children}
      </Comp>
    </motion.div>
  );
}

function Logo({ className }) {
  return (
    <a
      href="#home"
      className={cn("group flex shrink-0 items-center transition-opacity hover:opacity-90", className)}
      aria-label="AppLattice home"
    >
      <Image
        src="/logo-applattice.png"
        alt="AppLattice"
        width={338}
        height={80}
        className="h-14 w-auto sm:h-16 lg:h-20"
        priority
      />
    </a>
  );
}

const MODULE_POSITIONS = [
  { x: 50, y: 8 },
  { x: 82, y: 22 },
  { x: 92, y: 50 },
  { x: 82, y: 78 },
  { x: 50, y: 92 },
  { x: 18, y: 78 },
  { x: 8, y: 50 },
  { x: 18, y: 22 },
];

function HeroVisual() {
  const reduce = useReducedMotion();

  return (
    <div className="relative w-full max-w-lg mx-auto lg:max-w-none">
      <div className="absolute inset-0 hero-gradient rounded-3xl" aria-hidden />
      <div className="hidden md:block relative aspect-square max-h-[420px] w-full">
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" aria-hidden>
          {MODULE_POSITIONS.map((pos, i) => (
            <motion.line
              key={heroModules[i]}
              x1="50" y1="50" x2={pos.x} y2={pos.y}
              stroke="#6D28D9" strokeWidth="0.3" strokeOpacity="0.25"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: reduce ? 0 : 1.2, delay: reduce ? 0 : i * 0.08, ease: "easeOut" }}
            />
          ))}
          {!reduce && MODULE_POSITIONS.map((pos, i) => (
            <motion.circle
              key={`p-${i}`} r="0.5" fill="#0EA5E9" fillOpacity="0.7"
              initial={{ cx: 50, cy: 50, opacity: 0 }}
              animate={{ cx: [50, pos.x, 50], cy: [50, pos.y, 50], opacity: [0, 0.8, 0] }}
              transition={{ duration: 3.5, delay: i * 0.4, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </svg>
        <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
          <div className="surface-card rounded-2xl px-6 py-5 text-center shadow-md border-t-2 border-t-primary">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-primary">Core System</p>
            <p className="mt-1 text-sm font-bold text-text">AppLattice AI</p>
          </div>
        </div>
        {heroModules.map((label, i) => {
          const pos = MODULE_POSITIONS[i];
          return (
            <motion.div
              key={label}
              className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              initial={reduce ? false : { opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.06, duration: 0.45 }}
            >
              <div className="surface-card rounded-lg px-2.5 py-1.5 text-[10px] font-medium text-muted sm:text-xs whitespace-nowrap shadow-sm">
                {label}
              </div>
            </motion.div>
          );
        })}
      </div>
      <div className="md:hidden flex flex-col gap-2 w-full overflow-x-hidden relative z-10">
        <div className="surface-card rounded-xl p-4 text-center shadow-md border-t-2 border-t-primary">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Core System</p>
          <p className="mt-1 font-bold text-text">AppLattice AI</p>
        </div>
        {heroModules.map((label, i) => (
          <motion.div
            key={label}
            className="surface-card rounded-lg px-4 py-3 text-sm text-muted shadow-sm"
            initial={reduce ? false : { opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
          >
            {label}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function WorkflowDiagram({ steps, className }) {
  return (
    <div className={cn("flex flex-col gap-0 max-w-md mx-auto", className)}>
      {steps.map((step, i) => (
        <div key={step} className="flex flex-col items-center">
          <div className="surface-card rounded-xl px-5 py-2.5 text-sm font-medium text-text text-center w-full max-w-xs shadow-sm">
            {step}
          </div>
          {i < steps.length - 1 && (
            <div className="flex flex-col items-center py-1 text-primary">
              <span className="h-5 w-px bg-border" />
              <ChevronDown className="h-4 w-4 text-primary/60" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedIndustry, setExpandedIndustry] = useState(null);
  const [form, setForm] = useState({
    name: "",
    company: "",
    phone: "",
    email: "",
    business_type: "",
    service: "",
    message: "",
    website: "",
  });
  const [formStatus, setFormStatus] = useState("idle");
  const [formError, setFormError] = useState("");
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const updateField = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const submitContact = async (e) => {
    e.preventDefault();
    if (formStatus === "loading") return;
    setFormStatus("loading");
    setFormError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.success !== true) {
        setFormError(data.error || "Unable to save your inquiry. Please try again.");
        setFormStatus("idle");
        return;
      }
      setFormStatus("success");
      setForm({
        name: "",
        company: "",
        phone: "",
        email: "",
        business_type: "",
        service: "",
        message: "",
        website: "",
      });
    } catch {
      setFormError("Network error. Please try again.");
      setFormStatus("idle");
    }
  };

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return (
    <div className="min-h-screen bg-bg-primary">
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          scrolled
            ? "border-b border-border bg-white/90 py-3 shadow-sm backdrop-blur-md"
            : "border-b border-transparent bg-white py-5"
        )}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Logo />
          <nav className="hidden items-center gap-8 lg:flex" aria-label="Main">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="text-sm font-medium text-muted transition-colors hover:text-text">
                {link.label}
              </a>
            ))}
          </nav>
          <div className="hidden lg:block">
            <MagneticButton href="#contact" className="btn-primary">Book a Free Consultation</MagneticButton>
          </div>
          <button
            type="button"
            className="lg:hidden rounded-lg border border-border p-2 text-text"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden overflow-hidden border-t border-border bg-white"
            >
              <nav className="flex flex-col gap-1 px-4 py-4" aria-label="Mobile">
                {navLinks.map((link) => (
                  <a key={link.href} href={link.href} onClick={closeMobile} className="rounded-lg px-3 py-3 text-sm font-medium text-muted hover:bg-bg-secondary hover:text-text">
                    {link.label}
                  </a>
                ))}
                <MagneticButton href="#contact" className="btn-primary mt-2 w-full" onClick={closeMobile}>
                  Book a Free Consultation
                </MagneticButton>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main>
        <section id="home" className="section-padding relative overflow-hidden bg-white pt-32 md:pt-36">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              <div>
                <Reveal>
                  <p className="inline-flex rounded-full border border-border bg-bg-secondary px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-primary">
                    AI AUTOMATION • SOFTWARE • DIGITAL SYSTEMS
                  </p>
                </Reveal>
                <Reveal delay={0.08}>
                  <h1 className="mt-8 text-4xl font-bold leading-[1.1] tracking-tight text-text sm:text-5xl lg:text-[3.25rem]">
                    Build Smarter.{" "}
                    <span className="text-gradient">Automate Faster.</span>{" "}
                    Grow Better.
                  </h1>
                </Reveal>
                <Reveal delay={0.12}>
                  <p className="mt-5 text-lg font-semibold">
                    <span className="text-gradient">AI-powered automation & software solutions</span>
                  </p>
                </Reveal>
                <Reveal delay={0.16}>
                  <p className="mt-4 max-w-xl leading-relaxed text-muted">{HERO_SUPPORT}</p>
                </Reveal>
                <Reveal delay={0.2} className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <MagneticButton href="#contact" className="btn-primary">Book a Free Consultation</MagneticButton>
                  <MagneticButton href="#solutions" className="btn-secondary">
                    Explore Our Solutions
                    <ArrowRight className="h-4 w-4" />
                  </MagneticButton>
                </Reveal>
                <Reveal delay={0.24}>
                  <p className="mt-8 text-sm text-muted">Built for startups, SMBs and growing enterprises.</p>
                </Reveal>
              </div>
              <Reveal delay={0.12} className="w-full lg:justify-self-end">
                <HeroVisual />
              </Reveal>
            </div>
          </div>
        </section>

        <section className="border-y border-border bg-bg-secondary py-12">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Reveal>
              <p className="mx-auto max-w-3xl text-center text-lg font-semibold text-text md:text-xl">
                Technology that turns business problems into automated systems.
              </p>
            </Reveal>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {capabilityBadges.map((badge, i) => {
                const Icon = badge.icon;
                return (
                  <Reveal key={badge.label} delay={i * 0.04}>
                    <span className="badge-outline">
                      <Icon className="h-4 w-4 text-primary" aria-hidden />
                      {badge.label}
                    </span>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        <section id="solutions" className="section-padding bg-white">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Reveal>
              <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-text md:text-4xl">
                Your business doesn&apos;t need more tools. It needs better systems.
              </h2>
            </Reveal>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {problems.map((problem, i) => (
                <Reveal key={problem} delay={i * 0.03}>
                  <div className="card-hover surface-card rounded-xl p-5 shadow-sm">
                    <span className="text-sm font-medium text-muted">{problem}</span>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal className="mt-16 text-center">
              <p className="text-xl font-semibold text-text">AppLattice connects the entire workflow.</p>
            </Reveal>
            <Reveal className="mt-10">
              <WorkflowDiagram steps={solutionWorkflow} />
            </Reveal>
          </div>
        </section>

        <section id="services" className="section-padding bg-bg-alt">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Reveal>
              <h2 className="text-3xl font-bold tracking-tight text-text md:text-4xl">What We Build</h2>
            </Reveal>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {services.map((item, i) => {
                const Icon = item.icon;
                return (
                  <Reveal key={item.title} delay={i * 0.04}>
                    <a href="#contact" className="card-hover group surface-card flex h-full flex-col rounded-2xl p-6 shadow-sm">
                      <Icon className="h-7 w-7 text-primary transition-transform duration-300 group-hover:scale-110" aria-hidden />
                      <h3 className="mt-4 font-semibold text-text">{item.title}</h3>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{item.description}</p>
                      <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary transition-all group-hover:gap-2">
                        Learn more
                        <ArrowRight className="h-4 w-4" aria-hidden />
                      </span>
                    </a>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        <section className="section-padding section-gradient">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Reveal>
              <h2 className="text-center text-3xl font-bold tracking-tight text-text md:text-4xl">
                Turn Your Business Into an Automated Workflow
              </h2>
            </Reveal>
            <Reveal delay={0.08} className="mt-4">
              <p className="mx-auto max-w-2xl text-center leading-relaxed text-muted">
                From the first customer enquiry to follow-up and conversion, AppLattice connects AI agents,
                communication channels and business systems into one automated workflow.
              </p>
            </Reveal>
            <Reveal delay={0.12} className="mt-10">
              <div className="relative surface-card overflow-hidden rounded-2xl p-6 shadow-md md:p-10">
                <div className="hidden md:flex flex-wrap items-center justify-center gap-2">
                  {automationWorkflow.map((step, i) => (
                    <div key={step} className="flex items-center gap-2">
                      <div className="rounded-lg border border-border bg-bg-secondary px-3 py-2 text-xs font-medium text-text shadow-sm">
                        {step}
                      </div>
                      {i < automationWorkflow.length - 1 && (
                        <ArrowRight className="h-4 w-4 shrink-0 text-primary/50" aria-hidden />
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex flex-col gap-2 md:hidden">
                  {automationWorkflow.map((step, i) => (
                    <div key={step} className="flex flex-col items-center">
                      <div className="w-full rounded-lg border border-border bg-bg-secondary px-4 py-2.5 text-center text-sm font-medium text-text">{step}</div>
                      {i < automationWorkflow.length - 1 && <ChevronDown className="my-1 h-4 w-4 text-primary/50" />}
                    </div>
                  ))}
                </div>
                {!reduce && (
                  <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
                    {[...Array(6)].map((_, i) => (
                      <motion.span
                        key={i}
                        className="absolute h-1 w-1 rounded-full bg-accent/60"
                        style={{ left: `${15 + i * 14}%`, top: `${40 + (i % 2) * 20}%` }}
                        animate={{ opacity: [0.2, 0.7, 0.2], y: [0, -6, 0] }}
                        transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.3 }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </Reveal>
            <Reveal delay={0.16} className="mt-8 flex justify-center">
              <MagneticButton href="#contact" className="btn-primary">Automate My Business</MagneticButton>
            </Reveal>
          </div>
        </section>

        <section className="section-padding bg-white">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Reveal>
              <h2 className="text-3xl font-bold tracking-tight text-text md:text-4xl">
                AI Agents That Work While Your Team Sleeps
              </h2>
            </Reveal>
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {aiAgents.map((agent, i) => {
                const Icon = agent.icon;
                return (
                  <Reveal key={agent.title} delay={i * 0.06}>
                    <div className="card-hover surface-card h-full rounded-2xl p-6 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-violet-50 p-2.5">
                          <Icon className="h-6 w-6 text-primary" aria-hidden />
                        </div>
                        <h3 className="text-lg font-semibold text-text">{agent.title}</h3>
                      </div>
                      <ul className="mt-5 space-y-2.5">
                        {agent.features.map((f) => (
                          <li key={f} className="flex items-start gap-2.5 text-sm text-muted">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        <section id="industries" className="section-padding bg-bg-secondary">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Reveal>
              <h2 className="text-3xl font-bold tracking-tight text-text md:text-4xl">Built Around Your Industry</h2>
            </Reveal>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {industries.map((ind, i) => {
                const Icon = ind.icon;
                const open = expandedIndustry === ind.title;
                return (
                  <Reveal key={ind.title} delay={i * 0.03}>
                    <div className="card-hover surface-card group overflow-hidden rounded-2xl shadow-sm">
                      <button
                        type="button"
                        className="flex w-full flex-col items-start p-5 text-left"
                        aria-expanded={open}
                        onClick={() => setExpandedIndustry(open ? null : ind.title)}
                      >
                        <div className="rounded-xl bg-violet-50 p-2.5">
                          <Icon className="h-5 w-5 text-primary" aria-hidden />
                        </div>
                        <h3 className="mt-4 font-semibold text-text">{ind.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-muted line-clamp-2">{ind.description}</p>
                        <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                          Explore <ArrowRight className="h-3.5 w-3.5" />
                        </span>
                      </button>
                      <AnimatePresence initial={false}>
                        {open && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: reduce ? 0 : 0.25 }}
                            className="overflow-hidden border-t border-border"
                          >
                            <div className="px-5 pb-5 pt-4">
                              <p className="text-sm leading-relaxed text-muted">{ind.description}</p>
                              <p className="mt-2 text-sm font-medium text-primary">{ind.example}</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        <section id="process" className="section-padding bg-white">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Reveal>
              <h2 className="text-3xl font-bold tracking-tight text-text md:text-4xl">
                From Business Problem to Working System
              </h2>
            </Reveal>
            <div className="relative mt-14">
              <div className="absolute left-0 right-0 top-8 hidden h-px bg-border md:block" aria-hidden />
              <div className="grid gap-8 md:grid-cols-5">
                {processSteps.map((step, i) => (
                  <Reveal key={step.number} delay={i * 0.05}>
                    <div className="relative flex flex-col items-center text-center md:items-center">
                      <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-sm font-bold text-white shadow-md shadow-primary/20">
                        {step.number}
                      </div>
                      <h3 className="mt-4 font-semibold text-text">{step.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted">{step.description}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        <WorkSection />

        <section id="about" className="section-padding why-gradient">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Reveal>
              <h2 className="text-3xl font-bold tracking-tight text-text md:text-4xl">Why Businesses Choose AppLattice</h2>
            </Reveal>
            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {whyChoose.map((item, i) => {
                const Icon = item.icon;
                return (
                  <Reveal key={item.title} delay={i * 0.05}>
                    <div className="card-hover surface-card rounded-2xl p-6 shadow-sm">
                      <div className="rounded-xl bg-violet-50 p-2.5 w-fit">
                        <Icon className="h-7 w-7 text-primary" aria-hidden />
                      </div>
                      <h3 className="mt-4 font-semibold text-text">{item.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted">{item.description}</p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        <section className="section-padding bg-white">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Reveal>
              <h2 className="text-center text-3xl font-bold tracking-tight text-text md:text-4xl">Technology Ecosystem</h2>
              <p className="mx-auto mt-3 max-w-xl text-center text-sm text-muted">
                Modern, reliable tools chosen to deliver business outcomes.
              </p>
            </Reveal>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              {technologies.map((tech, i) => (
                <Reveal key={tech} delay={i * 0.03}>
                  <span className="badge-outline font-medium">{tech}</span>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="section-padding">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <Reveal>
              <div className="cta-gradient rounded-3xl border border-border p-10 text-center shadow-sm md:p-14">
                <h2 className="text-3xl font-bold tracking-tight text-text md:text-4xl">
                  Have a Business Problem Worth Automating?
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-muted">
                  Tell us what is slowing your business down. We&apos;ll help you identify what can be
                  automated, simplified or built.
                </p>
                <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                  <MagneticButton href="#contact" className="btn-dark">Book a Free Consultation</MagneticButton>
                  <MagneticButton href="#contact" className="btn-secondary">Talk to AppLattice</MagneticButton>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section id="contact" className="section-padding bg-bg-secondary">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="grid gap-12 lg:grid-cols-2">
              <div>
                <Reveal>
                  <h2 className="text-3xl font-bold text-text md:text-4xl">Let&apos;s Build It</h2>
                </Reveal>
                <Reveal delay={0.08} className="mt-4">
                  <p className="text-muted leading-relaxed">
                    Share your business context and the outcome you want. We will respond with a clear
                    path from problem to working system.
                  </p>
                </Reveal>
                <Reveal delay={0.12} className="mt-8 flex items-start gap-3 text-muted">
                  <MapPin className="h-5 w-5 shrink-0 text-accent mt-0.5" />
                  <div>
                    <p className="font-medium text-text">AppLattice</p>
                    <p className="text-sm">Bangalore, India</p>
                  </div>
                </Reveal>
              </div>
              <Reveal delay={0.1}>
                <form onSubmit={submitContact} className="relative surface-card space-y-4 rounded-2xl p-6 shadow-md md:p-8" aria-busy={formStatus === "loading"}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="mb-1.5 block text-xs font-medium text-muted">Name</label>
                      <input id="name" required className="input-field" value={form.name} onChange={updateField("name")} />
                    </div>
                    <div>
                      <label htmlFor="company" className="mb-1.5 block text-xs font-medium text-muted">Company</label>
                      <input id="company" className="input-field" value={form.company} onChange={updateField("company")} />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="phone" className="mb-1.5 block text-xs font-medium text-muted">Phone</label>
                      <input id="phone" type="tel" className="input-field" value={form.phone} onChange={updateField("phone")} />
                    </div>
                    <div>
                      <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-muted">Email</label>
                      <input id="email" type="email" required className="input-field" value={form.email} onChange={updateField("email")} />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="business_type" className="mb-1.5 block text-xs font-medium text-muted">Business Type</label>
                      <input id="business_type" className="input-field" value={form.business_type} onChange={updateField("business_type")} placeholder="e.g. Real Estate, Healthcare" />
                    </div>
                    <div>
                      <label htmlFor="service" className="mb-1.5 block text-xs font-medium text-muted">Required Service</label>
                      <select id="service" required className="input-field" value={form.service} onChange={updateField("service")}>
                        <option value="">Select service</option>
                        {serviceOptions.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="message" className="mb-1.5 block text-xs font-medium text-muted">What do you want to build?</label>
                    <textarea id="message" rows={4} required className="input-field resize-y min-h-[100px]" value={form.message} onChange={updateField("message")} placeholder="Describe the workflow, automation or software you need" />
                  </div>
                  <div className="absolute -left-[10000px] h-0 w-0 overflow-hidden" aria-hidden="true">
                    <label htmlFor="website">Website</label>
                    <input
                      id="website"
                      name="website"
                      tabIndex={-1}
                      autoComplete="off"
                      value={form.website}
                      onChange={updateField("website")}
                    />
                  </div>
                  {formError && (
                    <p className="text-sm text-red-600" role="alert">{formError}</p>
                  )}
                  {formStatus === "success" && (
                    <p className="flex items-center gap-2 text-sm text-primary" role="status">
                      <CheckCircle2 className="h-4 w-4" />
                      Thank you — we received your inquiry.
                    </p>
                  )}
                  <MagneticButton
                    type="submit"
                    className="btn-primary w-full sm:w-auto disabled:opacity-60"
                    disabled={formStatus === "loading"}
                  >
                    {formStatus === "loading" ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sending…
                      </>
                    ) : (
                      "Let's Build It"
                    )}
                  </MagneticButton>
                </form>
              </Reveal>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-800 bg-footer py-14 text-slate-300">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col gap-10 md:flex-row md:justify-between">
            <div className="max-w-xs">
              <div className="inline-flex rounded-lg bg-white px-3 py-2 shadow-sm">
                <Logo />
              </div>
              <p className="mt-4 text-sm leading-relaxed text-slate-400">
                AI Automation & Software Solutions for Growing Businesses.
              </p>
            </div>
            <div className="grid flex-1 max-w-xl grid-cols-2 gap-8 sm:grid-cols-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-white">Solutions</p>
                <ul className="mt-4 space-y-2">
                  {footerLinks.solutions.map((l) => (
                    <li key={l.label}>
                      <a href={l.href} className="text-sm text-slate-400 transition-colors hover:text-primary">{l.label}</a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-white">Development</p>
                <ul className="mt-4 space-y-2">
                  {footerLinks.development.map((l) => (
                    <li key={l.label}>
                      <a href={l.href} className="text-sm text-slate-400 transition-colors hover:text-primary">{l.label}</a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-white">Company</p>
                <ul className="mt-4 space-y-2">
                  {footerLinks.company.map((l) => (
                    <li key={l.label}>
                      <a href={l.href} className="text-sm text-slate-400 transition-colors hover:text-primary">{l.label}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-12 flex flex-col gap-4 border-t border-slate-800 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">© 2026 AppLattice. All rights reserved.</p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-slate-400 transition-colors hover:text-primary">Privacy Policy</a>
              <a href="#" className="text-slate-400 transition-colors hover:text-primary">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
