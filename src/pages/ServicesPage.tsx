import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { Faq } from "@/components/sections/Faq";
import { Testimonials } from "@/components/sections/Testimonials";
import { Link } from "react-router-dom";
import { Container } from "@/components/ui/Container";
import {
  mergeApiServicesWithStatic,
  servicesProcessSteps,
  whyEdihubItems,
  selectedWork,
  servicesFaq,
  type ApiService,
} from "@/data/services";
import { getApiUrl } from "@/utils/api";
import { ServicePageHero } from "@/components/services/ServicePageHero";
import {
  ServiceLabel,
  ServiceCardIcon,
  ArrowIcon,
  WhyEdihubIcon,
  ProcessTimeline,
  SecondaryButton,
} from "@/components/services/ServiceUi";
import { Footer } from "@/components/layout/Footer";
import { CtaSection } from "@/components/sections/CtaSection";
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
  borderHover: string;
  arrowAccent: string;
  decorDots: string;
  decorLine: string;
}> = {
  brand: {
    headerGradient: "from-[#0052cc] to-[#1a6ff5]",
    iconColor: "text-white",
    iconRing: "bg-white/20 ring-white/30",
    accentText: "text-blue-600",
    badgeGradient: "bg-blue-100 text-blue-700",
    glowColor: "shadow-[0_20px_60px_rgba(0,82,204,0.18)]",
    borderHover: "hover:border-blue-300",
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
    glowColor: "shadow-[0_20px_60px_rgba(4,120,87,0.18)]",
    borderHover: "hover:border-emerald-300",
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
    glowColor: "shadow-[0_20px_60px_rgba(91,33,182,0.18)]",
    borderHover: "hover:border-purple-300",
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
    glowColor: "shadow-[0_20px_60px_rgba(159,18,57,0.18)]",
    borderHover: "hover:border-rose-300",
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
    glowColor: "shadow-[0_20px_60px_rgba(146,64,14,0.18)]",
    borderHover: "hover:border-amber-300",
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
    glowColor: "shadow-[0_20px_60px_rgba(12,74,110,0.18)]",
    borderHover: "hover:border-sky-300",
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
              <h2 className="mt-4 text-[40px] font-semibold tracking-[-0.06em] text-[#111827] sm:text-[48px]">
                What we do
              </h2>
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
                brand: <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8" strokeLinecap="round"/></svg>,
                web: <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><rect x="3" y="4" width="18" height="14" rx="2"/><path d="M3 9h18"/></svg>,
                ui: <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><rect x="5" y="2" width="14" height="20" rx="2"/><path d="M9 18h6" strokeLinecap="round"/></svg>,
                code: <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M8 9l-3 3 3 3M16 9l3 3-3 3" strokeLinecap="round" strokeLinejoin="round"/></svg>,
                motion: <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><polygon points="5,3 19,12 5,21"/></svg>,
                strategy: <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path d="M4 18V6M10 18V10M16 18V4M22 18V8" strokeLinecap="round"/></svg>,
              };

              return (
                <motion.div
                  key={service.slug}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.07 }}
                  whileHover={{ y: -8 }}
                  className="group"
                >
                  <Link
                    to={`/services/${service.slug}`}
                    className={`relative flex flex-col overflow-hidden rounded-[24px] border border-[#EAECF0] bg-white transition-all duration-500 ${s.borderHover}`}
                    style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
                  >
                    {/* ── Gradient header ── */}
                    <div
                      className={`relative flex h-[156px] items-end overflow-hidden bg-gradient-to-br ${s.headerGradient} p-6`}
                      style={{ transition: "box-shadow 0.5s" }}
                    >
                      {/* Large blurred orb */}
                      <div className={`absolute -right-10 -top-10 h-40 w-40 rounded-full ${s.decorDots} blur-[40px] opacity-80`} />
                      {/* Medium circle */}
                      <div className={`absolute right-14 top-6 h-20 w-20 rounded-full ${s.decorDots} opacity-50`} />
                      {/* Small circle */}
                      <div className={`absolute right-6 top-14 h-9 w-9 rounded-full ${s.decorDots} opacity-30`} />
                      {/* Subtle bottom shimmer line */}
                      <div className={`absolute bottom-0 left-0 h-[1px] w-full bg-gradient-to-r ${s.decorLine}`} />

                      {/* Service number badge (top-right) */}
                      <span className="absolute top-5 right-5 rounded-full bg-black/20 px-2.5 py-[3px] text-[11px] font-black text-white/60 font-mono tracking-widest">
                        {padIndex}
                      </span>

                      {/* Icon in frosted glass box */}
                      <div className="relative z-10 flex h-[52px] w-[52px] items-center justify-center rounded-xl bg-white/20 text-white ring-1 ring-white/25 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                        {headerIcons[service.icon] ?? headerIcons.web}
                      </div>
                    </div>

                    {/* ── Card body ── */}
                    <div className="flex flex-1 flex-col p-6 pb-7">
                      {/* Category pill */}
                      <span className={`mb-3 inline-flex w-fit items-center rounded-full px-3 py-[3px] text-[11px] font-bold uppercase tracking-wider ${s.badgeGradient}`}>
                        {service.icon}
                      </span>

                      <h3 className="text-[20px] font-extrabold leading-snug tracking-tight text-zinc-900">
                        {service.title}
                      </h3>

                      <p className="mt-3 flex-1 text-[14px] leading-[1.75] text-zinc-500 font-medium">
                        {service.cardDescription}
                      </p>

                      {/* Footer row */}
                      <div className="mt-6 flex items-center justify-between">
                        <span className={`text-[12px] font-bold uppercase tracking-widest transition-colors duration-300 ${s.accentText}`}>
                          Explore →
                        </span>
                        <span
                          className={`flex h-9 w-9 items-center justify-center rounded-full transition-all duration-300 group-hover:scale-110 ${s.arrowAccent}`}
                        >
                          <ArrowIcon className="h-3.5 w-3.5" />
                        </span>
                      </div>
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
          <h2 className="mt-5 max-w-[22ch] text-[42px] font-bold leading-[1.05] tracking-[-0.06em] text-[#111827] sm:text-[54px] md:text-[68px]">
            A simple process built for complex projects.
          </h2>
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
                    {/* Image Container with Zoom Effect */}
                    <div className="aspect-[4/3] w-full overflow-hidden rounded-[24px] md:rounded-[32px] bg-zinc-50 relative shadow-sm transition-all duration-500 hover:shadow-lg">
                      <img
                        src={projectImage}
                        alt={project.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 ease-[0.33,1,0.68,1] group-hover:scale-105"
                      />
                      {/* Soft overlay on hover */}
                      <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/[0.02]" />
                    </div>

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

      {/* Why EDIHUB — dark premium section */}
      <section className="relative overflow-hidden bg-[#0A0A0F] py-24 md:py-36">
        {/* Background decorative glow blobs */}
        <div className="pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="pointer-events-none absolute -right-40 bottom-0 h-[400px] w-[400px] rounded-full bg-purple-600/10 blur-[100px]" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-indigo-600/5 blur-[140px]" />

        <Container className="relative z-10 px-5 sm:px-6 lg:px-10 xl:px-16">
          {/* Top label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2 mb-6"
          >
            <span className="h-[1px] w-8 bg-blue-500/60" />
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-400">Why Edihub</span>
          </motion.div>

          {/* Main heading row */}
          <div className="grid gap-12 lg:grid-cols-2 lg:items-end mb-20">
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-[42px] font-extrabold leading-[1.05] tracking-[-0.04em] text-white sm:text-[54px] md:text-[68px]"
            >
              Built for brands that want{" "}
              <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                more
              </span>{" "}
              than aesthetics.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-[18px] leading-[1.8] text-white/50 font-medium max-w-[40ch] lg:ml-auto"
            >
              We combine sharp strategy, refined design, and solid engineering to build digital products that actually drive growth.
            </motion.p>
          </div>

          {/* 4 feature cards */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                number: "01",
                title: "Strategic Thinking",
                description: "Every decision is tied to business goals, not just aesthetics.",
                icon: (
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                    <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ),
                accent: "from-blue-500 to-blue-700",
                glow: "group-hover:shadow-[0_0_40px_rgba(59,130,246,0.15)]",
                borderHover: "group-hover:border-blue-500/40",
                tagColor: "text-blue-400",
              },
              {
                number: "02",
                title: "Scalable Systems",
                description: "Design and code built to grow with your company.",
                icon: (
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                    <path d="M4 7h16M4 12h10M4 17h6" strokeLinecap="round" />
                  </svg>
                ),
                accent: "from-emerald-500 to-teal-700",
                glow: "group-hover:shadow-[0_0_40px_rgba(16,185,129,0.15)]",
                borderHover: "group-hover:border-emerald-500/40",
                tagColor: "text-emerald-400",
              },
              {
                number: "03",
                title: "Fast Execution",
                description: "Structured process that keeps projects moving without sacrificing quality.",
                icon: (
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                    <polygon points="13,2 3,14 12,14 11,22 21,10 12,10" strokeLinejoin="round" />
                  </svg>
                ),
                accent: "from-amber-500 to-orange-600",
                glow: "group-hover:shadow-[0_0_40px_rgba(245,158,11,0.15)]",
                borderHover: "group-hover:border-amber-500/40",
                tagColor: "text-amber-400",
              },
              {
                number: "04",
                title: "Premium Experience",
                description: "Polished work that reflects the caliber of your brand.",
                icon: (
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeLinejoin="round" />
                  </svg>
                ),
                accent: "from-violet-500 to-purple-700",
                glow: "group-hover:shadow-[0_0_40px_rgba(139,92,246,0.15)]",
                borderHover: "group-hover:border-violet-500/40",
                tagColor: "text-violet-400",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: i * 0.1 }}
                whileHover={{ y: -6 }}
                className="group"
              >
                <div
                  className={`relative flex h-full flex-col rounded-2xl border border-white/[0.08] bg-white/[0.03] p-7 transition-all duration-500 ${item.borderHover} ${item.glow}`}
                >
                  {/* Subtle inner glow on hover */}
                  <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.04] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  {/* Icon box */}
                  <div className={`mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${item.accent} text-white shadow-lg`}>
                    {item.icon}
                  </div>

                  {/* Number */}
                  <span className={`mb-2 text-[11px] font-black tracking-[0.18em] uppercase ${item.tagColor}`}>
                    {item.number}
                  </span>

                  {/* Title */}
                  <h3 className="text-[19px] font-extrabold leading-snug tracking-tight text-white">
                    {item.title}
                  </h3>

                  {/* Divider */}
                  <div className={`my-4 h-[1px] w-10 bg-gradient-to-r ${item.accent} opacity-60`} />

                  {/* Description */}
                  <p className="text-[14px] leading-[1.75] text-white/50 font-medium">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom stat bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-16 flex flex-wrap gap-px overflow-hidden rounded-2xl border border-white/[0.08]"
          >
            {[
              { stat: "50+", label: "Projects delivered" },
              { stat: "98%", label: "Client satisfaction" },
              { stat: "4×", label: "Faster time-to-market" },
              { stat: "24h", label: "Response guarantee" },
            ].map((s) => (
              <div
                key={s.stat}
                className="flex flex-1 min-w-[140px] flex-col items-center justify-center gap-1 bg-white/[0.03] py-7 px-4 text-center"
              >
                <span className="text-[32px] font-black tracking-tight text-white">{s.stat}</span>
                <span className="text-[12px] font-medium uppercase tracking-widest text-white/40">{s.label}</span>
              </div>
            ))}
          </motion.div>
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
