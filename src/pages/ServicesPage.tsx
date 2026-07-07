import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Faq } from "@/components/sections/Faq";
import { Link } from "react-router-dom";
import { Container } from "@/components/ui/Container";
import {
  mergeApiServicesWithStatic,
  servicesProcessSteps,
  whyEdihubItems,
  selectedWork,
  servicesFaq,
  servicesTestimonials,
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
import teamImage from "@/assets/team.webp";
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

export function ServicesPage() {
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % servicesTestimonials.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [testimonialIndex]);
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

      {/* What we do — white bg, header row, 2x3 cards with blue glow */}
      <section className="py-20 md:py-28">
        <Container className="px-5 sm:px-6 lg:px-10 xl:px-16">
          <div className="grid gap-8 border-b border-[#F3F4F6] pb-12 lg:grid-cols-2 lg:items-end">
            <div>
              <ServiceLabel>Services</ServiceLabel>
              <h2 className="mt-4 text-[40px] font-semibold tracking-[-0.06em] text-[#111827] sm:text-[48px]">
                What we do
              </h2>
            </div>
            <p className="max-w-[48ch] text-[15px] leading-[1.7] text-[#6B7280] lg:text-[16px]">
              End-to-end digital services — from brand strategy and design to development and launch. Click any service to explore details.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {loadingServices ? (
              <div className="col-span-full py-16 text-center text-[15px] text-[#9CA3AF]">Loading services…</div>
            ) : serviceCards.length === 0 ? (
              <div className="col-span-full py-16 text-center text-[15px] text-[#9CA3AF]">No services available yet.</div>
            ) : null}
            {serviceCards.map((service, i) => (
              <motion.div
                key={service.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={`/services/${service.slug}`}
                  className="group relative flex min-h-[280px] flex-col rounded-2xl border border-[#EBEEF2] bg-white p-8 transition-all duration-300 hover:border-[#C7D9F5] hover:shadow-[0_8px_40px_rgba(0,102,255,0.08)]"
                >
                  <div
                    className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#0066FF]/[0.07] blur-2xl transition-opacity group-hover:opacity-100"
                    aria-hidden
                  />
                  <ServiceCardIcon type={service.icon} />
                  <h3 className="text-[20px] font-bold tracking-[-0.02em] text-[#111827]">{service.title}</h3>
                  <p className="mt-4 flex-1 text-[14px] leading-[1.65] text-[#6B7280]">{service.cardDescription}</p>
                  <div className="mt-8 flex justify-end">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E5E7EB] text-[#111827] transition-all group-hover:border-[#0066FF] group-hover:bg-[#0066FF] group-hover:text-white">
                      <ArrowIcon className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Process */}
      <section className="border-t border-[#F3F4F6] min-h-screen flex items-center py-0 md:py-0">
        <Container className="px-5 sm:px-6 lg:px-10 xl:px-16 w-full">
          <ServiceLabel>Process</ServiceLabel>
          <h2 className="mt-4 max-w-[22ch] text-[36px] font-semibold leading-[1.08] tracking-[-0.06em] text-[#111827] sm:text-[44px] md:text-[52px]">
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
                          className="rounded-full border border-black/15 bg-white px-3 py-1.5 text-[12px] font-medium leading-none text-black/60 transition-all duration-300 group-hover:border-black/30 group-hover:text-black"
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

      {/* Why EDIHUB */}
      <section className="min-h-screen flex items-center py-0 md:py-0">
        <Container className="px-5 sm:px-6 lg:px-10 xl:px-16">
          <div className="grid gap-16 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <ServiceLabel>Why Edihub</ServiceLabel>
              <h2 className="mt-4 text-[36px] font-semibold leading-[1.08] tracking-[-0.06em] text-[#111827] sm:text-[44px]">
                Built for brands that want more than just aesthetics.
              </h2>
            </div>
            <div className="space-y-10 lg:col-span-7">
              {whyEdihubItems.map((w, i) => (
                <div key={w.title} className="flex gap-5 group cursor-pointer">
                  <WhyEdihubIcon index={i} />
                  <div>
                    <h3 className="text-[20px] font-semibold tracking-tight text-[#111827] sm:text-[22px] group-hover:text-[#0066FF] transition-colors duration-300">{w.title}</h3>
                    <p className="mt-2 text-[16px] leading-[1.65] text-[#555555]">{w.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Testimonials */}
      <section className="border-t border-[#F3F4F6] bg-[#FAFAFA] min-h-screen flex items-center py-0 md:py-0">
        <Container className="px-5 sm:px-6 lg:px-10 xl:px-16 w-full">
          <div className="grid gap-12 lg:grid-cols-12 items-center w-full">
            <div className="lg:col-span-4 flex flex-col justify-between min-h-[160px]">
              <div>
                <ServiceLabel>Testimonials</ServiceLabel>
                <div className="mt-6 text-[#0066FF] opacity-20 hidden lg:block">
                  <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M7.17 6A5.17 5.17 0 0 0 2 11.17V18a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H6.24a3.2 3.2 0 0 1 3.18-2.8.75.75 0 0 0 .75-.75V6.75A.75.75 0 0 0 9.42 6H7.17Zm12 0A5.17 5.17 0 0 0 14 11.17V18a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-1.76a3.2 3.2 0 0 1 3.18-2.8.75.75 0 0 0 .75-.75V6.75A.75.75 0 0 0 21.42 6h-2.25Z" />
                  </svg>
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setTestimonialIndex((p) => (p === 0 ? servicesTestimonials.length - 1 : p - 1))}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white text-black transition-all duration-300 hover:bg-black hover:text-white hover:scale-105 active:scale-95 shadow-sm cursor-pointer"
                  aria-label="Previous"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => setTestimonialIndex((p) => (p + 1) % servicesTestimonials.length)}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white text-black transition-all duration-300 hover:bg-black hover:text-white hover:scale-105 active:scale-95 shadow-sm cursor-pointer"
                  aria-label="Next"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="relative flex items-center justify-center lg:col-span-8 w-full min-h-[350px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={testimonialIndex}
                  initial={{ opacity: 0, x: 25 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -25 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="w-full rounded-[24px] md:rounded-[32px] border border-[#EBEEF2] bg-white p-10 md:p-14 shadow-lg shadow-black/[0.03] relative"
                >
                  {/* Decorative Quote Mark on the top right of the card */}
                  <div className="absolute right-10 top-10 text-[#0066FF]/10 md:right-14 md:top-14 pointer-events-none">
                    <svg width="56" height="56" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M7.17 6A5.17 5.17 0 0 0 2 11.17V18a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H6.24a3.2 3.2 0 0 1 3.18-2.8.75.75 0 0 0 .75-.75V6.75A.75.75 0 0 0 9.42 6H7.17Zm12 0A5.17 5.17 0 0 0 14 11.17V18a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-1.76a3.2 3.2 0 0 1 3.18-2.8.75.75 0 0 0 .75-.75V6.75A.75.75 0 0 0 21.42 6h-2.25Z" />
                    </svg>
                  </div>

                  <div className="pr-8 md:pr-12">
                    <p className="text-[28px] font-semibold tracking-[-0.05em] leading-[1.15] text-[#111827] md:text-[34px]">
                      &ldquo;{servicesTestimonials[testimonialIndex].quote}&rdquo;
                    </p>
                  </div>

                  <div className="mt-10 flex items-center justify-between gap-6 pt-6 border-t border-neutral-100">
                    <div className="flex items-center gap-4">
                      <div className="h-14 w-14 overflow-hidden rounded-full bg-zinc-100 border border-neutral-200/50 shadow-sm">
                        <img src={teamImage} alt="" className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <p className="text-[18px] font-semibold leading-none text-[#111827]">{servicesTestimonials[testimonialIndex].name}</p>
                        <p className="mt-2 text-[14px] leading-none text-[#6B7280] md:text-[15px]">{servicesTestimonials[testimonialIndex].role}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <Faq items={servicesFaq} title="Frequently asked questions" label="FAQ" />

      <CtaSection />
      <Footer />
      </main>
    </div>
  );
}
