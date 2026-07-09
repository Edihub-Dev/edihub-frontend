import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import { WavyCtaBg } from "./ServiceVisuals";


export function ServicesTopBar() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#F3F4F6] bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-[72px] w-full max-w-[140rem] items-center justify-between px-5 sm:px-6 lg:px-10 xl:px-16">
        <Link to="/" className="text-[20px] font-bold tracking-[-0.04em] text-[#111827]">
          EDIHUB
        </Link>
        <Link
          to="/contact"
          className="group inline-flex items-center gap-2 rounded-full border border-[#111827] px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[#111827] transition-colors hover:bg-[#111827] hover:text-white"
        >
          Let&apos;s talk
          <ArrowIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </header>
  );
}

export function ServiceLabel({ children }: { children: ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2.5 text-[14px] font-black uppercase tracking-[0.24em] text-[#0066FF] select-none">
      <span className="h-2.5 w-2.5 rounded-full border-[2px] border-[#0066FF] bg-white shrink-0" />
      <span>{children}</span>
    </div>
  );
}

export function ArrowIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
    </svg>
  );
}

export function PrimaryButton({
  to,
  children,
  className = "",
}: {
  to: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      to={to}
      className={`group inline-flex items-center gap-2.5 rounded-lg bg-[#111827] px-4 sm:px-7 py-4 text-[11px] font-bold uppercase tracking-[0.1em] text-white transition-colors hover:bg-black ${className}`}
    >
      {children}
      <ArrowIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </Link>
  );
}

export function SecondaryButton({
  to,
  children,
  className = "",
}: {
  to: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      to={to}
      className={`group inline-flex items-center gap-2.5 rounded-lg border border-[#D1D5DB] bg-white px-4 sm:px-7 py-4 text-[11px] font-bold uppercase tracking-[0.1em] text-[#111827] transition-colors hover:border-[#111827] ${className}`}
    >
      {children}
      <ArrowIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </Link>
  );
}

export function ServicePageFooter() {
  return (
    <footer className="border-t border-[#F3F4F6] bg-white py-12">
      <div className="mx-auto grid w-full max-w-[140rem] grid-cols-1 items-center gap-8 px-5 sm:grid-cols-3 sm:px-6 lg:px-10 xl:px-16">
        <Link to="/" className="text-[18px] font-bold tracking-tight text-[#111827] sm:justify-self-start">
          EDIHUB
        </Link>
        <p className="text-center text-[12px] text-[#9CA3AF]">© 2026 Edihub. All rights reserved.</p>
        <div className="flex flex-wrap items-center justify-center gap-6 sm:justify-end">
          {["Instagram", "LinkedIn", "Twitter"].map((s) => (
            <a
              key={s}
              href="#"
              className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#6B7280] hover:text-[#111827]"
            >
              {s}
            </a>
          ))}
          <a
            href="mailto:contact@edihub.com"
            className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#6B7280] hover:text-[#111827]"
          >
            contact@edihub.com
          </a>
        </div>
      </div>
    </footer>
  );
}

export function ServiceCtaBanner({ heading }: { heading: string }) {
  return (
    <section className="relative overflow-hidden bg-[#F0F7FF] py-24 md:py-32">
      <WavyCtaBg />
      <div className="relative mx-auto w-full max-w-[140rem] px-5 text-center sm:px-6 lg:px-10 xl:px-16">
        <ServiceLabel>Ready to start?</ServiceLabel>
        <h2 className="mx-auto mt-6 max-w-[22ch] text-[36px] font-semibold leading-[1.08] tracking-[-0.06em] text-[#111827] sm:text-[44px] md:text-[52px] lg:text-[56px]">
          {heading}
        </h2>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <PrimaryButton to="/contact">Book a call</PrimaryButton>
          <SecondaryButton to="/contact">Start your project</SecondaryButton>
        </div>
      </div>
    </section>
  );
}

const serviceIcons: Record<string, ReactNode> = {
  brand: (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v8M8 12h8" strokeLinecap="round" />
    </svg>
  ),
  web: (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <rect x="3" y="4" width="18" height="14" rx="2" />
      <path d="M3 9h18" />
    </svg>
  ),
  ui: (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <path d="M9 18h6" strokeLinecap="round" />
    </svg>
  ),
  code: (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path d="M8 9l-3 3 3 3M16 9l3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  motion: (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <polygon points="5,3 19,12 5,21" />
    </svg>
  ),
  strategy: (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path d="M4 18V6M10 18V10M16 18V4M22 18V8" strokeLinecap="round" />
    </svg>
  ),
};

export function ServiceCardIcon({ type, className = "text-[#0066FF] bg-[#FAFCFF] border-[#E8EEF8]" }: { type: string; className?: string }) {
  return (
    <div className={`mb-8 flex h-12 w-12 items-center justify-center rounded-xl border ${className}`}>
      {serviceIcons[type] ?? serviceIcons.web}
    </div>
  );
}

export function FeatureIcon({ type }: { type: "target" | "device" | "bolt" | "scale" }) {
  const icons = {
    target: (
      <svg className="h-5 w-5 text-[#6B7280]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
      </svg>
    ),
    device: (
      <svg className="h-5 w-5 text-[#6B7280]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <rect x="2" y="4" width="14" height="12" rx="1" />
        <rect x="16" y="8" width="6" height="10" rx="1" />
      </svg>
    ),
    bolt: (
      <svg className="h-5 w-5 text-[#6B7280]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path d="M13 2L4 14h6l-2 8 10-14h-6l1-6z" strokeLinejoin="round" />
      </svg>
    ),
    scale: (
      <svg className="h-5 w-5 text-[#6B7280]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path d="M12 3v18M3 12h18" strokeLinecap="round" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  };
  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#E5E7EB] bg-[#FAFAFA]">
      {icons[type]}
    </div>
  );
}

export function WhyEdihubIcon({ index }: { index: number }) {
  const colors = ["#0066FF", "#6366F1", "#8B5CF6", "#0066FF"];
  return (
    <div
      className="flex h-13 w-13 shrink-0 items-center justify-center rounded-xl border border-[#E8EEF8] bg-white transition-all duration-300 group-hover:scale-110 group-hover:border-transparent group-hover:shadow-[0_4px_20px_rgba(0,102,255,0.12)]"
      style={{ color: colors[index % colors.length] }}
    >
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path d="M12 2l2.4 7.2H22l-6 4.6 2.3 7.2L12 17l-6.3 4 2.3-7.2-6-4.6h7.6L12 2z" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

export function ProcessTimeline({ steps }: { steps: { number: string; title: string; description: string }[] }) {
  return (
    <div className="relative mt-12 lg:mt-24">
      {/* Horizontal Line for Desktop */}
      <div className="absolute left-0 right-0 top-[11px] hidden h-px bg-[#E5E7EB] lg:block" />
      
      {/* Vertical Line for Mobile */}
      <div className="absolute left-[11px] top-[24px] bottom-[48px] w-[1.5px] bg-gradient-to-b from-[#0066FF]/40 via-[#E5E7EB] to-[#E5E7EB] lg:hidden" />
      
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
        {steps.map((step) => (
          <div key={step.number} className="relative pl-10 lg:pl-0 group">
            {/* Mobile: Interactive Glowing Indicator Dot */}
            <div className="absolute left-0 top-[20px] lg:static lg:mb-10 flex h-6 w-6 items-center justify-center rounded-full bg-white border border-[#0066FF] shadow-md shadow-blue-500/10 ring-[5px] ring-blue-50/50 transition-all duration-300 group-hover:scale-110 group-hover:border-[#0066FF] group-hover:ring-blue-100/60 lg:ring-[10px] lg:ring-white">
              <span className="h-2.5 w-2.5 rounded-full bg-[#0066FF] animate-pulse" />
            </div>
            
            {/* Content Wrapper Card for Mobile / Column Content for Desktop */}
            <div className="border border-zinc-100/80 bg-zinc-50/30 lg:border-0 lg:bg-transparent rounded-2xl p-5.5 lg:p-0 shadow-[0_8px_30px_rgb(0,0,0,0.015)] lg:shadow-none transition-all duration-300 group-hover:border-[#0066FF]/20 group-hover:bg-white group-hover:shadow-[0_12px_40px_rgba(0,102,255,0.03)] lg:group-hover:bg-transparent lg:group-hover:shadow-none">
              {/* Number Badge */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center rounded-full bg-blue-50/60 lg:bg-transparent px-2.5 py-0.5 text-[10px] lg:text-[14px] lg:px-0 lg:py-0 font-mono font-bold tracking-widest text-[#0066FF]">
                  STEP {step.number}
                </span>
              </div>
              
              <h3 className="mt-3 lg:mt-4 text-[20px] lg:text-[28px] font-extrabold tracking-tight text-[#111827] sm:text-[24px] group-hover:text-[#0066FF] transition-colors duration-300">
                {step.title}
              </h3>
              <p className="mt-2.5 lg:mt-5 text-[14px] lg:text-[18px] leading-[1.65] lg:leading-[1.75] text-[#4B5563] font-medium">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TechLogo({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E5E7EB] bg-white text-[11px] font-bold text-[#9CA3AF]">
        {name.charAt(0)}
      </div>
      <span className="text-[14px] font-medium text-[#6B7280]">{name}</span>
    </div>
  );
}
