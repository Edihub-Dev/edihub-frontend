import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Container } from "@/components/ui/Container";
import { resolveServiceDetail, type ApiService } from "@/data/services";
import { getApiUrl } from "@/utils/api";
import { ServicePageHero } from "@/components/services/ServicePageHero";
import { ScrollRevealText } from "@/components/ui/ScrollRevealText";
import {
  FeatureIcon,
  ArrowIcon,
  TechLogo,
  ServiceLabel,
} from "@/components/services/ServiceUi";
import { Footer } from "@/components/layout/Footer";
import { CtaSection } from "@/components/sections/CtaSection";
import { ParallaxImage } from "@/components/ui/ParallaxImage";

// ─── helpers ──────────────────────────────────────────────
function getYouTubeId(url: string): string | null {
  const m = url.match(/(?:youtu\.be\/|v=|shorts\/)([^&?/]+)/);
  return m ? m[1] : null;
}

// ─── Lightbox ─────────────────────────────────────────────
interface LightboxImage {
  src: string;
  alt: string;
}

function ImageLightbox({
  images,
  startIndex,
  onClose,
}: {
  images: LightboxImage[];
  startIndex: number;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(startIndex);
  const prev = useCallback(() => setIdx((i) => (i - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setIdx((i) => (i + 1) % images.length), [images.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [prev, next, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm"
      onClick={onClose}
    >
      <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 text-white/70 hover:text-white text-3xl leading-none">×</button>
      {images.length > 1 && (
        <>
          <button onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white text-xl">‹</button>
          <button onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white text-xl">›</button>
        </>
      )}
      <motion.img
        key={idx}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        src={images[idx].src}
        alt={images[idx].alt}
        className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      />
      {images.length > 1 && (
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-white/50 text-xs">
          {idx + 1} / {images.length}
        </div>
      )}
    </motion.div>
  );
}

function VideoLightbox({
  vid,
  onClose,
}: {
  vid: { type: "youtube" | "upload"; url: string };
  onClose: () => void;
}) {
  const ytId = vid.type === "youtube" ? getYouTubeId(vid.url) : null;

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm"
      onClick={onClose}
    >
      <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 text-white/70 hover:text-white text-3xl leading-none">×</button>
      <div className="w-full max-w-4xl aspect-video rounded-xl overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {ytId ? (
          <iframe
            src={`https://www.youtube.com/embed/${ytId}?autoplay=1`}
            allow="autoplay; fullscreen"
            className="w-full h-full"
          />
        ) : (
          <video src={vid.url} controls autoPlay className="w-full h-full bg-black" />
        )}
      </div>
    </motion.div>
  );
}

// ─── Gallery Grid ─────────────────────────────────────────
function GalleryGrid({
  images,
  onOpen,
}: {
  images: LightboxImage[];
  onOpen: (i: number) => void;
}) {
  if (!images.length) return null;
  return (
    <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-3">
      {images.map((img, i) => (
        <motion.button
          key={i}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.05 }}
          onClick={() => onOpen(i)}
          className="relative aspect-[4/3] overflow-hidden rounded-xl border border-[#EBEEF2] bg-[#F9FAFB] cursor-zoom-in group"
        >
          <ParallaxImage
            src={img.src}
            alt={img.alt}
            containerClassName="absolute inset-0 w-full h-full"
            className="transition-transform duration-500 group-hover:scale-105"
            offset={25}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
            <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1116.65 16.65z" />
            </svg>
          </div>
        </motion.button>
      ))}
    </div>
  );
}

// ─── Video Grid ───────────────────────────────────────────
function VideoGrid({
  videos,
  onOpen,
}: {
  videos: { type: "youtube" | "upload"; url: string }[];
  onOpen: (i: number) => void;
}) {
  if (!videos.length) return null;
  return (
    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
      {videos.map((vid, i) => {
        const ytId = vid.type === "youtube" ? getYouTubeId(vid.url) : null;
        const thumb = ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.webp` : null;
        return (
          <motion.button
            key={i}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            onClick={() => onOpen(i)}
            className="relative aspect-video overflow-hidden rounded-xl border border-[#EBEEF2] bg-black cursor-pointer group"
          >
            {thumb ? (
              <ParallaxImage
                src={thumb}
                alt={`Video ${i + 1}`}
                containerClassName="absolute inset-0 w-full h-full"
                className="opacity-80 group-hover:opacity-100 transition-opacity"
                offset={25}
              />
            ) : vid.type === "upload" ? (
              <video src={vid.url} className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity" muted />
            ) : (
              <div className="w-full h-full bg-slate-900" />
            )}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center group-hover:bg-white/30 transition-all">
                <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────
export function ServiceDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [apiService, setApiService] = useState<ApiService | undefined>();
  const [loading, setLoading] = useState(true);

  // Lightbox state
  const [imageLightbox, setImageLightbox] = useState<{ images: LightboxImage[]; startIndex: number } | null>(null);
  const [videoLightbox, setVideoLightbox] = useState<{ videos: { type: "youtube" | "upload"; url: string }[]; index: number } | null>(null);

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

  // Build gallery arrays from apiService
  const overviewGallery: LightboxImage[] = (apiService?.overviewGallery || []).map((src, i) => ({
    src,
    alt: `Overview image ${i + 1}`,
  }));

  const overviewVideos: { type: "youtube" | "upload"; url: string }[] = apiService?.overviewVideos || [];

  const relatedWorkGallery: LightboxImage[] = (apiService?.relatedWorkGallery || []).map((src, i) => ({
    src,
    alt: `Related work image ${i + 1}`,
  }));

  const relatedWorkVideos: { type: "youtube" | "upload"; url: string }[] = apiService?.relatedWorkVideos || [];

  return (
    <div className="bg-white">
      <AnimatePresence>
        {imageLightbox && (
          <ImageLightbox
            images={imageLightbox.images}
            startIndex={imageLightbox.startIndex}
            onClose={() => setImageLightbox(null)}
          />
        )}
        {videoLightbox && (
          <VideoLightbox
            vid={videoLightbox.videos[videoLightbox.index]}
            onClose={() => setVideoLightbox(null)}
          />
        )}
      </AnimatePresence>

      <main className="pt-20 md:pt-28 lg:pt-32">
        <ServicePageHero
          label={
            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-[14px] font-bold text-[#0066FF] hover:text-[#0052CC] transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                <path d="M16 10H4M4 10L9 5M4 10L9 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Back to Services
            </Link>
          }
          title={service.title}
          description={service.heroDescription}
          heroImage={service.heroImage}
        />

        {/* Key features */}
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

        {/* Overview */}
        <section className="py-20 md:py-28">
          <Container className="px-5 sm:px-6 lg:px-10 xl:px-16">
            <div className="grid items-start gap-14 lg:grid-cols-2 lg:gap-20">
              {/* Left: main image + gallery */}
              <div>
                {/* Main overview image */}
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  onClick={() =>
                    setImageLightbox({
                      images: [
                        { src: typeof service.overviewImage === "string" ? service.overviewImage : "", alt: "Overview" },
                        ...overviewGallery,
                      ].filter((img) => img.src),
                      startIndex: 0,
                    })
                  }
                  className="relative w-full overflow-hidden rounded-2xl border border-[#EBEEF2] bg-[#F9FAFB] shadow-sm cursor-zoom-in group"
                >
                  <ParallaxImage
                    src={service.overviewImage as string}
                    alt=""
                    containerClassName="aspect-[4/3] w-full lg:aspect-auto lg:min-h-[440px]"
                    className="transition-transform duration-500 group-hover:scale-[1.02]"
                    offset={30}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-end justify-end p-4">
                    <div className="w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg className="w-4 h-4 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1116.65 16.65z" />
                      </svg>
                    </div>
                  </div>
                </motion.button>

                {/* Overview Gallery */}
                {overviewGallery.length > 0 && (
                  <GalleryGrid
                    images={overviewGallery}
                    onOpen={(i) =>
                      setImageLightbox({
                        images: overviewGallery,
                        startIndex: i,
                      })
                    }
                  />
                )}

                {/* Overview Videos */}
                {overviewVideos.length > 0 && (
                  <>
                    <p className="mt-8 text-xs font-bold text-[#6B7280] uppercase tracking-widest">Videos</p>
                    <VideoGrid
                      videos={overviewVideos}
                      onOpen={(i) => setVideoLightbox({ videos: overviewVideos, index: i })}
                    />
                  </>
                )}
              </div>

              {/* Right: text + checklist */}
              <div className="lg:sticky lg:top-32">
                <ServiceLabel>Overview</ServiceLabel>
                <ScrollRevealText
                  text={service.overviewHeading}
                  as="h2"
                  className="mt-4 text-[32px] font-semibold leading-[1.1] tracking-[-0.05em] text-[#111827] sm:text-[40px]"
                />
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

        {/* Process */}
        <section className="border-t border-[#F3F4F6] bg-slate-50/50 py-20 md:py-28 lg:py-32">
          <Container className="px-5 sm:px-6 lg:px-10 xl:px-16 w-full">
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-16 items-start">
              <div className="lg:col-span-4 lg:sticky lg:top-36">
                <ServiceLabel>Our process</ServiceLabel>
                <h2 className="mt-4 text-[40px] font-bold leading-[1.08] tracking-[-0.05em] text-[#111827] sm:text-[52px] lg:text-[60px]">
                  A simple process for powerful {service.shortTitle.toLowerCase()}.
                </h2>
                <p className="mt-6 text-[15px] leading-[1.7] text-[#6B7280] max-w-[36ch]">
                  How we take your projects from initial concept and design to flawless deployment and continuous optimization.
                </p>
              </div>
              <div className="lg:col-span-8 mt-10 lg:mt-0">
                <div className="relative flex flex-col gap-8">
                  {/* Vertical connection line */}
                  <div className="absolute left-[11px] top-20 bottom-20 w-[1.5px] bg-[#E5E7EB]" />
                  
                  {service.processSteps.map((step, idx) => (
                    <motion.div
                      key={step.number}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                      className="group relative flex items-center pl-12 sm:pl-16"
                    >
                      {/* Timeline Dot (always centered vertically with the card) */}
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10 flex h-6 w-6 items-center justify-center rounded-full border-[2.5px] border-[#0066FF] bg-white shadow-sm transition-transform duration-300 group-hover:scale-110">
                        <span className="h-2 w-2 rounded-full bg-[#0066FF]" />
                      </div>

                      {/* Content Card */}
                      <div className="w-full rounded-[24px] border border-slate-100 bg-white p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.01)] transition-all duration-300 hover:-translate-y-1 hover:border-[#0066FF]/20 hover:shadow-[0_20px_40px_rgba(0,102,255,0.04)]">
                        {/* Pill Badge */}
                        <span className="inline-block rounded-full bg-blue-50/70 px-3.5 py-1 text-[11px] font-bold tracking-widest text-[#0066FF] font-mono">
                          STEP {step.number}
                        </span>
                        
                        {/* Title */}
                        <h3 className="mt-4 text-[22px] sm:text-[26px] font-bold tracking-tight text-[#111827] group-hover:text-[#0066FF] transition-colors duration-300">
                          {step.title}
                        </h3>
                        
                        {/* Description */}
                        <p className="mt-3 text-[15px] sm:text-[16px] leading-[1.65] text-[#4B5563] font-normal">
                          {step.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Related work */}
        <section className="py-20 md:py-28">
          <Container className="px-5 sm:px-6 lg:px-10 xl:px-16">
            <div className="grid items-start gap-14 lg:grid-cols-2 lg:gap-20">
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

              <div>
                {/* Related work main image */}
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  onClick={() =>
                    setImageLightbox({
                      images: [
                        { src: typeof service.relatedWork.image === "string" ? service.relatedWork.image : "", alt: "Related Work" },
                        ...relatedWorkGallery,
                      ].filter((img) => img.src),
                      startIndex: 0,
                    })
                  }
                  className="group w-full overflow-hidden rounded-2xl border border-[#EBEEF2] bg-[#F5F6F8] p-4 shadow-sm hover:shadow-md transition-shadow cursor-zoom-in"
                >
                  <ParallaxImage
                    src={service.relatedWork.image as string}
                    alt=""
                    containerClassName="w-full rounded-xl"
                    className="transition-transform duration-500 group-hover:scale-[1.01]"
                    offset={30}
                  />
                </motion.button>

                {/* Related Work Gallery */}
                {relatedWorkGallery.length > 0 && (
                  <GalleryGrid
                    images={relatedWorkGallery}
                    onOpen={(i) => setImageLightbox({ images: relatedWorkGallery, startIndex: i })}
                  />
                )}

                {/* Related Work Videos */}
                {relatedWorkVideos.length > 0 && (
                  <>
                    <p className="mt-8 text-xs font-bold text-[#6B7280] uppercase tracking-widest">Videos</p>
                    <VideoGrid
                      videos={relatedWorkVideos}
                      onOpen={(i) => setVideoLightbox({ videos: relatedWorkVideos, index: i })}
                    />
                  </>
                )}
              </div>
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

        <CtaSection />
        <Footer />
      </main>
    </div>
  );
}
