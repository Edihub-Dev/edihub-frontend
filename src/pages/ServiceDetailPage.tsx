import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Container } from "@/components/ui/Container";
import { resolveServiceDetail, type ApiService } from "@/data/services";
import { getApiUrl } from "@/utils/api";
import { ServicePageHero } from "@/components/services/ServicePageHero";
import {
  ServicesTopBar,
  ServicePageFooter,
  ServiceCtaBanner,
  FeatureIcon,
  ArrowIcon,
  TechLogo,
  ServiceLabel,
} from "@/components/services/ServiceUi";

export function ServiceDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [apiService, setApiService] = useState<ApiService | undefined>();
  const [loading, setLoading] = useState(true);

  const service = slug ? resolveServiceDetail(apiService, slug) : undefined;

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!slug) return;

    const apiUrl = getApiUrl();
    fetch(`${apiUrl}/services`)
      .then((res) => res.json())
      .then((data: ApiService[]) => {
        const found = Array.isArray(data) ? data.find((s) => s.slug === slug) : undefined;
        setApiService(found);
      })
      .catch(() => setApiService(undefined))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (!loading && !service && slug) {
      navigate("/services", { replace: true });
    }
  }, [service, slug, navigate, loading]);

  if (loading || !service) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0066FF] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="bg-white">
      <ServicesTopBar />

      <ServicePageHero
        label={
          <Link
            to="/services"
            className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#0066FF] hover:underline"
          >
            <span aria-hidden className="text-[12px] font-semibold">&lt;</span> SERVICES
          </Link>
        }
        title={service.title}
        description={service.heroDescription}
      />

      {/* Key features — 4 columns with icon boxes */}
      <section className="border-b border-[#F3F4F6] py-16 md:py-20">
        <Container className="px-5 sm:px-6 lg:px-10 xl:px-16">
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {service.features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
              >
                <FeatureIcon type={f.icon} />
                <h3 className="mt-5 text-[16px] font-bold text-[#111827]">{f.title}</h3>
                <p className="mt-2 text-[14px] leading-[1.65] text-[#6B7280]">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Overview — image left, text + checklist right */}
      <section className="py-20 md:py-28">
        <Container className="px-5 sm:px-6 lg:px-10 xl:px-16">
          <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
            <div className="overflow-hidden rounded-2xl border border-[#EBEEF2] bg-[#F9FAFB] shadow-sm">
              <img
                src={service.overviewImage}
                alt=""
                className="aspect-[4/3] w-full object-cover lg:aspect-auto lg:min-h-[440px]"
              />
            </div>
            <div>
              <ServiceLabel>Overview</ServiceLabel>
              <h2 className="mt-4 text-[32px] font-semibold leading-[1.1] tracking-[-0.05em] text-[#111827] sm:text-[40px]">
                {service.overviewHeading}
              </h2>
              <p className="mt-6 text-[15px] leading-[1.7] text-[#6B7280]">{service.overviewBody}</p>
              <ul className="mt-10 space-y-5">
                {service.overviewPoints.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0066FF]">
                      <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span className="text-[14px] leading-[1.6] text-[#374151]">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* Process — heading left, steps right (EDIHUB layout) */}
      <section className="border-t border-[#F3F4F6] bg-[#FAFAFA] py-20 md:py-28">
        <Container className="px-5 sm:px-6 lg:px-10 xl:px-16">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <ServiceLabel>Our process</ServiceLabel>
              <h2 className="mt-4 text-[32px] font-semibold leading-[1.1] tracking-[-0.06em] text-[#111827] sm:text-[40px]">
                A simple process for powerful {service.shortTitle.toLowerCase()}.
              </h2>
            </div>
            <div className="lg:col-span-8">
              <div className="relative">
                <div className="absolute left-0 right-0 top-[6px] hidden h-px bg-[#D1D5DB] md:block" />
                <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4 md:gap-4">
                  {service.processSteps.map((step) => (
                    <div key={step.number} className="relative bg-[#FAFAFA] md:bg-transparent">
                      <div className="mb-6 h-3 w-3 rounded-full bg-[#0066FF] ring-4 ring-[#FAFAFA] md:ring-white" />
                      <p className="text-[11px] font-bold text-[#0066FF]">{step.number}</p>
                      <h3 className="mt-2 text-[16px] font-bold text-[#111827]">{step.title}</h3>
                      <p className="mt-2 text-[13px] leading-[1.6] text-[#6B7280]">{step.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Related work — text left, large card right */}
      <section className="py-20 md:py-28">
        <Container className="px-5 sm:px-6 lg:px-10 xl:px-16">
          <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
            <div>
              <ServiceLabel>Related work</ServiceLabel>
              <h2 className="mt-4 text-[32px] font-semibold tracking-[-0.06em] text-[#111827] sm:text-[40px]">
                {service.relatedWork.title}
              </h2>
              <p className="mt-6 text-[15px] leading-[1.7] text-[#6B7280]">{service.relatedWork.description}</p>
              <Link
                to={`/projects/${service.relatedWork.slug}`}
                className="group mt-8 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[#111827] hover:text-[#0066FF]"
              >
                View project
                <ArrowIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
            <Link
              to={`/projects/${service.relatedWork.slug}`}
              className="group overflow-hidden rounded-2xl border border-[#EBEEF2] bg-[#F5F6F8] p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <img
                src={service.relatedWork.image}
                alt=""
                className="w-full rounded-xl object-cover transition-transform duration-500 group-hover:scale-[1.01]"
              />
            </Link>
          </div>
        </Container>
      </section>

      {/* Technologies */}
      <section className="border-t border-[#F3F4F6] py-14 md:py-16">
        <Container className="px-5 sm:px-6 lg:px-10 xl:px-16">
          <div className="flex flex-col gap-10 md:flex-row md:items-center md:justify-between">
            <ServiceLabel>Technologies we use</ServiceLabel>
            <div className="flex flex-wrap gap-8 md:gap-10">
              {service.technologies.map((tech) => (
                <TechLogo key={tech} name={tech} />
              ))}
            </div>
          </div>
        </Container>
      </section>

      <ServiceCtaBanner heading={service.ctaHeading} />
      <ServicePageFooter />
    </div>
  );
}
