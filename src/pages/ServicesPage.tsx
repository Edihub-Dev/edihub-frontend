import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { Faq } from "@/components/sections/Faq";
import { Testimonials } from "@/components/sections/Testimonials";
import { Link } from "react-router-dom";
import { Container } from "@/components/ui/Container";
import {
  mergeApiServicesWithStatic,
  servicesProcessSteps,
  selectedWork,
  servicesFaq,
  type ApiService,
} from "@/data/services";
import { getApiUrl } from "@/utils/api";
import { ServicePageHero } from "@/components/services/ServicePageHero";
import { ScrollRevealText } from "@/components/ui/ScrollRevealText";
import {
  ServiceLabel,
  ArrowIcon,
  ProcessTimeline,
  SecondaryButton,
} from "@/components/services/ServiceUi";
import { Footer } from "@/components/layout/Footer";
import { CtaSection } from "@/components/sections/CtaSection";
import { ParallaxImage } from "@/components/ui/ParallaxImage";
import arrowsImg from "@/assets/projects/arrows.webp";
import chantalleImg from "@/assets/projects/chantalle.webp";
import papyrusImg from "@/assets/projects/papyrus.webp";
import bullseyeImg from "@/assets/projects/bullseye.webp";

const customImageMap: Record<string, string> = {
  "arrows": arrowsImg,
  "chantalle": chantalleImg,
  "papyrus": papyrusImg,
  "bullseye": bullseyeImg,
};

const serviceStyles: Record<string, {
  headerGradient: string;
  iconColor: string;
  iconRing: string;
  accentText: string;
  badgeGradient: string;
  glowColor: string;
  borderDefault: string;
  borderHover: string;
  arrowAccent: string;
  decorDots: string;
  decorLine: string;
}> = {
  brand: {
    headerGradient: "from-[#2563eb] to-[#1d4ed8]",
    iconColor: "text-white",
    iconRing: "bg-white/20 ring-white/30",
    accentText: "text-blue-600",
    badgeGradient: "bg-blue-100 text-blue-700",
    glowColor: "hover:shadow-[0_20px_60px_rgba(37,99,235,0.2)]",
    borderDefault: "border-blue-200",
    borderHover: "hover:border-blue-500",
    arrowAccent: "bg-blue-600 text-white border-blue-600",
    decorDots: "bg-blue-300/40",
    decorLine: "from-blue-400/60 to-transparent",
  },
  web: {
    headerGradient: "from-[#047857] to-[#059669]",
    iconColor: "text-white",
    iconRing: "bg-white/20 ring-white/30",
    accentText: "text-emerald-600",
    badgeGradient: "bg-emerald-100 text-emerald-700",
    glowColor: "hover:shadow-[0_20px_60px_rgba(4,120,87,0.2)]",
    borderDefault: "border-emerald-200",
    borderHover: "hover:border-emerald-500",
    arrowAccent: "bg-emerald-600 text-white border-emerald-600",
    decorDots: "bg-emerald-300/40",
    decorLine: "from-emerald-400/60 to-transparent",
  },
  ui: {
    headerGradient: "from-[#5b21b6] to-[#7c3aed]",
    iconColor: "text-white",
    iconRing: "bg-white/20 ring-white/30",
    accentText: "text-purple-600",
    badgeGradient: "bg-purple-100 text-purple-700",
    glowColor: "hover:shadow-[0_20px_60px_rgba(124,58,237,0.2)]",
    borderDefault: "border-purple-200",
    borderHover: "hover:border-purple-500",
    arrowAccent: "bg-purple-600 text-white border-purple-600",
    decorDots: "bg-purple-300/40",
    decorLine: "from-purple-400/60 to-transparent",
  },
  code: {
    headerGradient: "from-[#9f1239] to-[#e11d48]",
    iconColor: "text-white",
    iconRing: "bg-white/20 ring-white/30",
    accentText: "text-rose-600",
    badgeGradient: "bg-rose-100 text-rose-700",
    glowColor: "hover:shadow-[0_20px_60px_rgba(225,29,72,0.2)]",
    borderDefault: "border-rose-200",
    borderHover: "hover:border-rose-500",
    arrowAccent: "bg-rose-600 text-white border-rose-600",
    decorDots: "bg-rose-300/40",
    decorLine: "from-rose-400/60 to-transparent",
  },
  motion: {
    headerGradient: "from-[#92400e] to-[#d97706]",
    iconColor: "text-white",
    iconRing: "bg-white/20 ring-white/30",
    accentText: "text-amber-600",
    badgeGradient: "bg-amber-100 text-amber-700",
    glowColor: "hover:shadow-[0_20px_60px_rgba(217,119,6,0.2)]",
    borderDefault: "border-amber-200",
    borderHover: "hover:border-amber-500",
    arrowAccent: "bg-amber-600 text-white border-amber-600",
    decorDots: "bg-amber-300/40",
    decorLine: "from-amber-400/60 to-transparent",
  },
  strategy: {
    headerGradient: "from-[#0c4a6e] to-[#0284c7]",
    iconColor: "text-white",
    iconRing: "bg-white/20 ring-white/30",
    accentText: "text-sky-600",
    badgeGradient: "bg-sky-100 text-sky-700",
    glowColor: "hover:shadow-[0_20px_60px_rgba(2,132,199,0.2)]",
    borderDefault: "border-sky-200",
    borderHover: "hover:border-sky-500",
    arrowAccent: "bg-sky-600 text-white border-sky-600",
    decorDots: "bg-sky-300/40",
    decorLine: "from-sky-400/60 to-transparent",
  },
};

export function ServicesPage() {
  const [serviceCards, setServiceCards] = useState<
    Array<{ slug: string; title: string; cardDescription: string; icon: string }>
  >([]);
  const [loadingServices, setLoadingServices] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const apiUrl = getApiUrl();
    fetch(`${apiUrl}/services`)
      .then((res) => res.json())
      .then((data: ApiService[]) => {
        setServiceCards(mergeApiServicesWithStatic(Array.isArray(data) ? data : []));
      })
      .catch(() => setServiceCards(mergeApiServicesWithStatic([])))
      .finally(() => setLoadingServices(false));
  }, []);

  return (
    <div className="bg-white">
      <main className="pt-20 md:pt-28 lg:pt-32">
        <ServicePageHero
          label={<ServiceLabel>Our services</ServiceLabel>}
          title="We build digital experiences that move brands forward."
          description="We combine strategy, design, and technology to create products, websites, and systems that help ambitious companies grow faster."
        />

        {/* What we do — subtle grey bg for card contrast */}
        <section className="bg-[#F7F8FA] py-20 md:py-28">
          <Container className="px-5 sm:px-6 lg:px-10 xl:px-16">
            <div className="grid gap-8 border-b border-[#F3F4F6] pb-12 lg:grid-cols-2 lg:items-end">
              <div>
                <ServiceLabel>Services</ServiceLabel>
                <ScrollRevealText
                  text="What we do"
                  as="h2"
                  className="mt-4 text-[40px] font-semibold tracking-[-0.06em] text-[#111827] sm:text-[48px]"
                />
              </div>
              <p className="max-w-[48ch] text-[18px] sm:text-[20px] leading-[1.7] text-[#4B5563] font-medium">
                End-to-end digital services — from brand strategy and design to development and launch. Click any service to explore details.
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {loadingServices ? (
                <div className="col-span-full py-16 text-center text-[15px] text-[#9CA3AF]">Loading services…</div>
              ) : serviceCards.length === 0 ? (
                <div className="col-span-full py-16 text-center text-[15px] text-[#9CA3AF]">No services available yet.</div>
              ) : null}
              {serviceCards.map((service, i) => {
                const s = serviceStyles[service.icon] || serviceStyles.brand;
                const padIndex = String(i + 1).padStart(2, "0");

                // Inline SVG icons for header (white, larger)
                const headerIcons: Record<string, React.ReactNode> = {
                  brand: <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><circle cx="12" cy="12" r="9" /><path d="M12 8v8M8 12h8" strokeLinecap="round" /></svg>,
                  web: <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><rect x="3" y="4" width="18" height="14" rx="2" /><path d="M3 9h18" /></svg>,
                  ui: <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><rect x="5" y="2" width="14" height="20" rx="2" /><path d="M9 18h6" strokeLinecap="round" /></svg>,
                  code: <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M8 9l-3 3 3 3M16 9l3 3-3 3" strokeLinecap="round" strokeLinejoin="round" /></svg>,
                  motion: <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><polygon points="5,3 19,12 5,21" /></svg>,
                  strategy: <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M4 18V6M10 18V10M16 18V4M22 18V8" strokeLinecap="round" /></svg>,
                };

                return (
                  <motion.div
                    key={service.slug}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.07 }}
                    className="group h-full"
                  >
                    <Link
                      to={`/services/${service.slug}`}
                      className={`relative flex h-full flex-col overflow-hidden rounded-[32px] border-2 bg-white p-8 transition-all duration-500 hover:-translate-y-2 ${s.glowColor} ${s.borderDefault} ${s.borderHover}`}
                    >
                      {/* Background glow blob — visible on mobile, stronger on hover */}
                      <div className={`absolute -right-16 -top-16 h-64 w-64 rounded-full bg-gradient-to-br ${s.headerGradient} opacity-10 blur-[60px] transition-all duration-700 group-hover:opacity-35 group-hover:scale-110`} />

                      {/* Top Row: Icon and Number */}
                      <div className="mb-8 flex items-start justify-between relative z-10">
                        <div className={`flex h-14 w-14 items-center justify-center rounded-[18px] bg-gradient-to-br ${s.headerGradient} text-white shadow-md ring-4 ring-slate-50 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                          {headerIcons[service.icon] ?? headerIcons.web}
                        </div>
                        <span className="font-mono text-[14px] font-bold tracking-widest text-slate-300 transition-colors duration-500 group-hover:text-slate-400">
                          {padIndex}
                        </span>
                      </div>

                      {/* Category pill */}
                      <span className={`relative z-10 mb-5 inline-flex w-fit items-center rounded-full px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-widest ${s.badgeGradient}`}>
                        {service.icon}
                      </span>

                      {/* Title */}
                      <h3 className="relative z-10 mb-3 text-[24px] font-extrabold leading-tight tracking-tight text-slate-900 transition-colors duration-300">
                        {service.title}
                      </h3>

                      {/* Description */}
                      <p className="relative z-10 flex-1 text-[15px] leading-[1.7] text-slate-500 font-medium">
                        {service.cardDescription}
                      </p>

                      {/* Footer row */}
                      <div className="relative z-10 mt-8 flex items-center gap-2">
                        <span className={`text-[13px] font-bold uppercase tracking-widest transition-colors duration-300 ${s.accentText}`}>
                          Explore
                        </span>
                        <span
                          className={`transition-transform duration-500 group-hover:translate-x-1.5 ${s.accentText}`}
                        >
                          <ArrowIcon className="h-4 w-4" />
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </Container>
        </section>

        {/* Process */}
        <section className="border-t border-[#F3F4F6] min-h-screen flex items-center py-0 md:py-0">
          <Container className="px-5 sm:px-6 lg:px-10 xl:px-16 w-full">
            <ServiceLabel>Process</ServiceLabel>
            <ScrollRevealText
              text="A simple process built for complex projects."
              as="h2"
              className="mt-5 max-w-[22ch] text-[42px] font-bold leading-[1.05] tracking-[-0.06em] text-[#111827] sm:text-[54px] md:text-[68px]"
            />
            <ProcessTimeline steps={servicesProcessSteps} />
          </Container>
        </section>

        {/* Selected work — 2x2 grid */}
        <section className="bg-[#FAFAFA] py-20 md:py-28">
          <Container className="px-5 sm:px-6 lg:px-10 xl:px-16">
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <div>
                <ServiceLabel>Selected work</ServiceLabel>
                <h2 className="mt-4 text-[40px] font-semibold tracking-[-0.06em] text-[#111827]">Selected work</h2>
              </div>
              <SecondaryButton to="/projects" className="shrink-0">
                View all projects
              </SecondaryButton>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:gap-x-12 lg:gap-y-24">
              {selectedWork.map((project) => {
                const projectImage = customImageMap[project.slug] || project.image;
                const displayCategory = project.category.charAt(0).toUpperCase() + project.category.slice(1).toLowerCase();
                return (
                  <div
                    key={project.slug}
                    className="group"
                  >
                    <Link to={`/projects/${project.slug}`} className="block">
                      {/* Image Container with Zoom Effect & Parallax */}
                      <ParallaxImage
                        src={projectImage}
                        alt={project.title}
                        loading="lazy"
                        containerClassName="aspect-[4/3] w-full rounded-[24px] md:rounded-[32px] bg-zinc-50 shadow-sm transition-all duration-500 hover:shadow-lg"
                        className="transition-transform duration-700 ease-[0.33,1,0.68,1] group-hover:scale-105"
                        offset={30}
                      />

                      {/* Text & Tags Row */}
                      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-1">
                        <h3 className="text-[20px] font-semibold tracking-tight text-black sm:text-[24px] group-hover:text-[#0066FF] transition-colors duration-300">
                          {project.title}
                        </h3>
                        <div className="flex flex-wrap gap-2 sm:justify-end">
                          <span
                            className="rounded-full border border-black/15 bg-white px-3.5 py-2 text-[13px] sm:text-[14px] font-bold leading-none text-black/60 transition-all duration-300 group-hover:border-black/30 group-hover:text-black"
                          >
                            {displayCategory}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          </Container>
        </section>

        {/* Why EDIHUB — Premium Light Section */}
        <section className="relative overflow-hidden bg-white py-28 md:py-36">
          {/* Soft colored orbs in background */}
          <div className="pointer-events-none absolute left-[-150px] top-[-150px] h-[600px] w-[600px] rounded-full bg-blue-100/60 blur-[120px]" />
          <div className="pointer-events-none absolute right-[-100px] bottom-[-100px] h-[500px] w-[500px] rounded-full bg-violet-100/50 blur-[100px]" />

          <Container className="relative z-10 px-5 sm:px-6 lg:px-10 xl:px-16">

            {/* Top label + headline — centered */}
            <div className="mb-16 text-center">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-blue-200 bg-blue-50 px-4 py-2"
              >
                <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-blue-600">Why Edihub</span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="mx-auto max-w-[18ch] text-[38px] font-extrabold leading-[1.08] tracking-[-0.04em] text-slate-900 sm:text-[50px] md:text-[58px]"
              >
                Built for brands that want{" "}
                <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                  more.
                </span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mx-auto mt-5 max-w-[52ch] text-[18px] leading-[1.7] text-slate-500"
              >
                We don't just make things look good. We build systems, experiences, and products that perform.
              </motion.p>
            </div>

            {/* 2×2 Feature Cards */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  title: "Strategic Thinking",
                  description: "Every decision is tied to business goals, not just aesthetics.",
                  gradient: "from-blue-500 to-cyan-400",
                  bg: "bg-blue-50",
                  ring: "ring-blue-200",
                  text: "text-blue-600",
                  glow: "rgba(59,130,246,0.15)",
                  icon: (
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  ),
                },
                {
                  title: "Scalable Systems",
                  description: "Design and code built to grow with your company.",
                  gradient: "from-indigo-500 to-purple-500",
                  bg: "bg-indigo-50",
                  ring: "ring-indigo-200",
                  text: "text-indigo-600",
                  glow: "rgba(99,102,241,0.15)",
                  icon: (
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                    </svg>
                  ),
                },
                {
                  title: "Fast Execution",
                  description: "Structured process that keeps projects moving without sacrificing quality.",
                  gradient: "from-violet-500 to-pink-500",
                  bg: "bg-violet-50",
                  ring: "ring-violet-200",
                  text: "text-violet-600",
                  glow: "rgba(139,92,246,0.15)",
                  icon: (
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  ),
                },
                {
                  title: "Premium Experience",
                  description: "Polished work that reflects the caliber of your brand.",
                  gradient: "from-rose-500 to-orange-400",
                  bg: "bg-rose-50",
                  ring: "ring-rose-200",
                  text: "text-rose-600",
                  glow: "rgba(244,63,94,0.15)",
                  icon: (
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  ),
                },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: 0.08 * i }}
                  className="group"
                >
                  <div
                    className={`relative flex h-full flex-col overflow-hidden rounded-[28px] border border-slate-200/80 bg-white p-7 ring-1 ${item.ring} ring-opacity-0 transition-all duration-500 hover:-translate-y-2 hover:border-transparent hover:ring-opacity-100`}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.boxShadow = `0 20px 60px -10px ${item.glow}`;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.boxShadow = "none";
                    }}
                  >
                    {/* Soft gradient blob on hover */}
                    <div className={`absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br ${item.gradient} opacity-0 blur-[40px] transition-opacity duration-500 group-hover:opacity-20`} />

                    {/* Icon */}
                    <div className={`relative z-10 mb-6 flex h-14 w-14 items-center justify-center rounded-[18px] bg-gradient-to-br ${item.gradient} text-white shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                      {item.icon}
                    </div>

                    {/* Number */}
                    <span className="absolute right-6 top-6 font-mono text-[13px] font-bold tracking-widest text-slate-300 transition-colors duration-300 group-hover:text-slate-400">
                      0{i + 1}
                    </span>

                    <h3 className={`relative z-10 mb-2.5 text-[20px] font-extrabold tracking-tight text-slate-900`}>
                      {item.title}
                    </h3>
                    <p className="relative z-10 flex-1 text-[14px] leading-[1.75] text-slate-500 font-medium">
                      {item.description}
                    </p>

                    {/* Bottom gradient bar */}
                    <div className={`absolute bottom-0 left-0 h-[3px] w-0 rounded-full bg-gradient-to-r ${item.gradient} transition-all duration-500 group-hover:w-full`} />
                  </div>
                </motion.div>
              ))}
            </div>
          </Container>
        </section>

        {/* Testimonials */}
        <Testimonials />

        {/* FAQ */}
        <Faq items={servicesFaq} title="Frequently asked questions" label="FAQ" />

        <CtaSection />
        <Footer />
      </main>
    </div>
  );
}
