import { motion } from "framer-motion";
import { useEffect, useState } from "react";
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
  ServiceCtaBanner,
  ServiceCardIcon,
  ArrowIcon,
  WhyEdihubIcon,
  ProcessTimeline,
  SecondaryButton,
} from "@/components/services/ServiceUi";
import { Footer } from "@/components/layout/Footer";
import teamImage from "@/assets/team.jpg";

export function ServicesPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
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
      <section className="border-t border-[#F3F4F6] py-20 md:py-28">
        <Container className="px-5 sm:px-6 lg:px-10 xl:px-16">
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

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {selectedWork.map((project) => (
              <Link
                key={project.slug}
                to={`/projects/${project.slug}`}
                className="group overflow-hidden rounded-2xl border border-[#EBEEF2] bg-white transition-shadow hover:shadow-lg"
              >
                <div className="aspect-[16/10] overflow-hidden bg-zinc-100">
                  <img
                    src={project.image}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="flex items-start justify-between gap-4 p-6">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#0066FF]">
                      {project.category}
                    </p>
                    <h3 className="mt-2 text-[18px] font-bold text-[#111827]">{project.title}</h3>
                  </div>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#E5E7EB] transition-colors group-hover:border-[#111827]">
                    <ArrowIcon className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Why EDIHUB */}
      <section className="py-20 md:py-28">
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
                <div key={w.title} className="flex gap-5">
                  <WhyEdihubIcon index={i} />
                  <div>
                    <h3 className="text-[17px] font-bold text-[#111827]">{w.title}</h3>
                    <p className="mt-1.5 text-[14px] leading-[1.6] text-[#6B7280]">{w.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Testimonials */}
      <section className="border-t border-[#F3F4F6] bg-[#FAFAFA] py-20 md:py-28">
        <Container className="px-5 sm:px-6 lg:px-10 xl:px-16">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <ServiceLabel>Testimonials</ServiceLabel>
              <span className="mt-8 block text-[120px] font-serif leading-none text-[#E5E7EB]">&ldquo;</span>
              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setTestimonialIndex((p) => (p === 0 ? servicesTestimonials.length - 1 : p - 1))}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E5E7EB] text-[#6B7280] hover:border-[#111827] hover:text-[#111827]"
                  aria-label="Previous"
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => setTestimonialIndex((p) => (p + 1) % servicesTestimonials.length)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E5E7EB] text-[#6B7280] hover:border-[#111827] hover:text-[#111827]"
                  aria-label="Next"
                >
                  →
                </button>
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-3 lg:col-span-8">
              {servicesTestimonials.map((t, i) => (
                <div
                  key={t.name}
                  className={`rounded-2xl border bg-white p-6 transition-opacity ${
                    i === testimonialIndex ? "border-[#C7D9F5] shadow-sm" : "border-[#EBEEF2] opacity-80"
                  }`}
                >
                  <p className="text-[14px] leading-[1.65] text-[#374151]">&ldquo;{t.quote}&rdquo;</p>
                  <div className="mt-6 flex items-center gap-3">
                    <img src={teamImage} alt="" className="h-10 w-10 rounded-full object-cover" />
                    <div>
                      <p className="text-[13px] font-bold text-[#111827]">{t.name}</p>
                      <p className="text-[12px] text-[#9CA3AF]">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="py-20 md:py-28">
        <Container className="px-5 sm:px-6 lg:px-10 xl:px-16">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <ServiceLabel>FAQ</ServiceLabel>
              <h2 className="mt-4 text-[40px] font-semibold tracking-[-0.06em] text-[#111827]">
                Frequently asked questions
              </h2>
            </div>
            <div className="lg:col-span-7">
              {servicesFaq.map((faq, i) => (
                <div key={faq.question} className="border-b border-[#EBEEF2]">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="flex w-full items-center justify-between py-6 text-left"
                  >
                    <span className="pr-8 text-[15px] font-semibold text-[#111827]">{faq.question}</span>
                    <span className="text-xl font-light text-[#9CA3AF]">{openFaq === i ? "−" : "+"}</span>
                  </button>
                  {openFaq === i && (
                    <p className="pb-6 text-[14px] leading-[1.7] text-[#6B7280]">{faq.answer}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <ServiceCtaBanner heading="Let's create something exceptional together." />
      <Footer />
      </main>
    </div>
  );
}
