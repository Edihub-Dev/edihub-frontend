import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CtaSection } from "@/components/sections/CtaSection";
import { getApiUrl, getYouTubeId } from "@/utils/api";
import pexels1 from "@/assets/projects/pexels-1.webp";
import pexels2 from "@/assets/projects/pexels-2.webp";
import pexels3 from "@/assets/projects/pexels-3.webp";
import pexels4 from "@/assets/projects/pexels-4.webp";
import pexels5 from "@/assets/projects/pexels-5.webp";

import arrowsImg from "@/assets/projects/arrows.webp";
import chantalleImg from "@/assets/projects/chantalle.webp";
import papyrusImg from "@/assets/projects/papyrus.webp";
import londonMuseumImg from "@/assets/projects/london-museum.webp";
import bullseyeImg from "@/assets/projects/bullseye.webp";
import interferenceImg from "@/assets/projects/interference.webp";

const imageMap: Record<string, string> = {
  "pexels-1.webp": pexels1,
  "pexels-2.webp": pexels2,
  "pexels-3.webp": pexels3,
  "pexels-4.webp": pexels4,
  "pexels-5.webp": pexels5,
};

const customImageMap: Record<string, string> = {
  "arrows": arrowsImg,
  "chantalle": chantalleImg,
  "papyrus": papyrusImg,
  "london-museum": londonMuseumImg,
  "bullseye": bullseyeImg,
  "interference": interferenceImg,
};

type Project = {
  title: string;
  tags: string[];
  slug: string;
  image: string;
  category: string;
  client: string;
  year: string;
  description: string;
  gallery?: string[];
  videos?: string[];
};

export function ProjectDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  // Lightbox state: null = closed, number = index of open image
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  // Video lightbox state
  const [videoLightboxIndex, setVideoLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    const apiUrl = getApiUrl();
    fetch(`${apiUrl}/projects`)
      .then((res) => res.json())
      .then((data: Project[]) => {
        setProjects(data);
        const found = data.find((p) => p.slug === slug);
        if (found) {
          setProject(found);
        } else {
          navigate("/projects");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching project:", err);
        setLoading(false);
      });

    window.scrollTo(0, 0);
  }, [slug, navigate]);

  // Keyboard navigation for image lightbox
  useEffect(() => {
    if (lightboxIndex === null || !project?.gallery) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') setLightboxIndex(i => i !== null ? (i + 1) % project.gallery!.length : null);
      if (e.key === 'ArrowLeft') setLightboxIndex(i => i !== null ? (i - 1 + project.gallery!.length) % project.gallery!.length : null);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightboxIndex, project]);

  // Keyboard navigation for video lightbox
  useEffect(() => {
    if (videoLightboxIndex === null || !project?.videos) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setVideoLightboxIndex(null);
      if (e.key === 'ArrowRight') setVideoLightboxIndex(i => i !== null ? (i + 1) % project.videos!.length : null);
      if (e.key === 'ArrowLeft') setVideoLightboxIndex(i => i !== null ? (i - 1 + project.videos!.length) % project.videos!.length : null);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [videoLightboxIndex, project]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0066FF] border-t-transparent" />
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="bg-white">
      <Navbar />

      <main>
        {/* ── Finux-style Hero: image as full background with overlaid content ── */}
        <div className="relative h-screen flex flex-col justify-end overflow-hidden bg-zinc-950">
          {/* Background image */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <img
              src={customImageMap[project.slug] || imageMap[project.image] || project.image}
              alt={project.title}
              className="w-full h-full object-cover scale-[1.05] opacity-60"
              style={{ filter: "blur(12px)" }}
            />
            {/* Dark gradient overlay — dark at top for navbar, fades to dark at bottom */}
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/30"
            />
          </motion.div>
 
          {/* Overlaid content */}
          <div className="relative z-10 pt-44 pb-48 md:pb-64 lg:pb-80">
            <Container className="px-6 sm:px-8 lg:px-14 xl:px-20">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15 }}
              >
                {/* Back link */}
                <Link
                  to="/projects"
                  className="inline-flex items-center gap-2 text-[13px] font-bold text-white/70 hover:text-white transition-colors mb-6 uppercase tracking-widest"
                >
                  <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                    <path d="M16 10H4M4 10L9 5M4 10L9 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Back to Projects
                </Link>

                {/* Category badge */}
                <div className="mb-5">
                  <span className="text-[11px] font-black tracking-widest text-blue-300 uppercase bg-blue-500/20 border border-blue-400/30 px-3 py-1 rounded-full backdrop-blur-sm">
                    {project.category}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-[48px] font-semibold leading-[0.95] tracking-[-0.06em] text-white sm:text-[64px] md:text-[80px] lg:text-[110px]">
                  {project.title}
                </h1>
              </motion.div>
            </Container>
          </div>
        </div>

        {/* Content Section */}
        <Section className="relative z-20 -mt-36 md:-mt-48 lg:-mt-60 pb-24 pt-0">
          <Container className="max-w-5xl px-4 sm:px-6">
            {/* 80% Width Overlapping Premium Box */}
            <div className="bg-white border border-zinc-200/80 rounded-[32px] p-8 sm:p-12 md:p-16 shadow-2xl relative z-10">
              <div className="grid gap-16 lg:grid-cols-12 lg:gap-24">
                {/* Left Side: Metadata */}
                <div className="lg:col-span-4">
                <div className="space-y-12">
                  <div>
                    <h4 className="text-[12px] font-bold uppercase tracking-widest text-[#9CA3AF]">
                      Client
                    </h4>
                    <p className="mt-3 text-[18px] font-medium text-[#111827]">
                      {project.client}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-[12px] font-bold uppercase tracking-widest text-[#9CA3AF]">
                      Year
                    </h4>
                    <p className="mt-3 text-[18px] font-medium text-[#111827]">
                      {project.year}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-[12px] font-bold uppercase tracking-widest text-[#9CA3AF]">
                      Services
                    </h4>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-[#E5E7EB] bg-white px-4 py-2 text-[14px] font-medium text-[#4B5563]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
                            {/* Right Side: Description */}
              <div className="lg:col-span-8">
                <div className="max-w-2xl">
                  <h3 className="text-[28px] font-semibold leading-[1.2] text-[#111827] sm:text-[36px]">
                    The Challenge & Solution
                  </h3>
                  <p className="mt-8 text-[18px] leading-[1.6] text-[#4B5563] sm:text-[20px]">
                    {project.description}
                  </p>
                  <p className="mt-8 text-[18px] leading-[1.6] text-[#4B5563] sm:text-[20px]">
                    We approached this project with a focus on delivering a high-end digital experience that reflects the client's values and vision. Every detail, from the color palette to the typography, was carefully considered to ensure a cohesive and impactful brand identity.
                  </p>
                </div>
              </div>
            </div>

            {project.gallery && project.gallery.length > 0 && (
              <div className="mt-20 space-y-6">
                <h4 className="text-[12px] font-bold uppercase tracking-widest text-[#9CA3AF] border-b border-[#E5E7EB] pb-3">
                  Project Gallery
                </h4>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {project.gallery.map((imgUrl, idx) => {
                    const isLast = idx === project.gallery!.length - 1;
                    const isOddTotal = project.gallery!.length % 3 !== 0;
                    const colSpanClass = isLast && isOddTotal
                      ? (project.gallery!.length % 3 === 1 ? "sm:col-span-2 lg:col-span-3" : "sm:col-span-2 lg:col-span-1")
                      : "";
                    return (
                      <motion.button
                        key={idx}
                        type="button"
                        onClick={() => setLightboxIndex(idx)}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: idx * 0.08 }}
                        className={`group relative overflow-hidden rounded-2xl border border-[#E5E7EB] bg-slate-50 shadow-sm aspect-video cursor-zoom-in ${colSpanClass}`}
                      >
                        <img
                          src={imageMap[imgUrl] || imgUrl}
                          alt={`${project.title} gallery item ${idx + 1}`}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        {/* Zoom icon hint */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur-sm rounded-full p-2.5 shadow-lg">
                            <svg className="w-5 h-5 text-[#111827]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0zm-6-3v6m-3-3h6" />
                            </svg>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            )}

            {project.videos && project.videos.length > 0 && (
              <div className="mt-20 space-y-6">
                <h4 className="text-[12px] font-bold uppercase tracking-widest text-[#9CA3AF] border-b border-[#E5E7EB] pb-3">
                  Video Showcase
                </h4>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
                  {project.videos.map((vidUrl, idx) => {
                    // Detect YouTube (watch, youtu.be, shorts)
                    const ytId = getYouTubeId(vidUrl);

                    const isLast = idx === project.videos!.length - 1;
                    const isOddTotal = project.videos!.length % 2 !== 0;
                    const colSpanClass = isLast && isOddTotal ? "sm:col-span-2" : "";
                    const thumbSrc = ytId
                      ? `https://img.youtube.com/vi/${ytId}/hqdefault.webp`
                      : null;

                    return (
                      <motion.button
                        key={idx}
                        type="button"
                        onClick={() => setVideoLightboxIndex(idx)}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: idx * 0.08 }}
                        className={`group relative overflow-hidden rounded-2xl border border-[#E5E7EB] shadow-sm aspect-video cursor-pointer bg-[#111827] ${colSpanClass}`}
                        aria-label="Play video"
                      >
                        {/* Thumbnail */}
                        {thumbSrc ? (
                          <img
                            src={thumbSrc}
                            alt={`${project.title} video ${idx + 1}`}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 brightness-75 group-hover:brightness-90"
                          />
                        ) : (
                          <div className="h-full w-full bg-gradient-to-br from-[#1e293b] to-[#0f172a]" />
                        )}

                        {/* Play button */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                          <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-2xl transition-transform duration-300 group-hover:scale-110 group-hover:bg-white">
                            <svg className="w-7 h-7 text-[#111827] ml-1" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                            </svg>
                          </div>
                          <span className="text-white text-[12px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">
                            Play Video
                          </span>
                        </div>

                        {/* YouTube badge */}
                        {ytId && (
                          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full">
                            <svg className="w-3.5 h-3.5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                            </svg>
                            <span className="text-white text-[10px] font-bold">YouTube</span>
                          </div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            )}
            </div>
          </Container>
        </Section>

        {/* Next Project Section */}
        <Section className="pb-32">
          <Container className="px-6 sm:px-8 lg:px-14 xl:px-20">
            <div className="border-t border-[#E5E7EB] pt-24">
              <p className="text-[14px] font-bold tracking-[0.2em] text-[#9CA3AF] uppercase text-center">
                / Next Projects /
              </p>

              {(() => {
                // Find next two projects
                if (projects.length === 0) return null;
                const currentIndex = projects.findIndex(p => p.slug === slug);
                const nextProject1 = projects[(currentIndex + 1) % projects.length];
                const nextProject2 = projects.length > 2
                  ? projects[(currentIndex + 2) % projects.length]
                  : null;

                const displayProjects = [nextProject1, nextProject2].filter((p): p is Project => p !== null);

                return (
                  <div className={`mt-12 grid gap-8 max-w-5xl mx-auto ${displayProjects.length > 1 ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
                    {displayProjects.map((nextProject) => (
                      <Link
                        key={nextProject.slug}
                        to={`/projects/${nextProject.slug}`}
                        className="group block text-center"
                      >
                        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[2rem]">
                          <img
                            src={customImageMap[nextProject.slug] || imageMap[nextProject.image] || nextProject.image}
                            alt={nextProject.title}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/10" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <h2 className="text-[32px] font-bold text-white sm:text-[40px] lg:text-[44px]">
                              {nextProject.title}
                            </h2>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                );
              })()}

              <div className="mt-16 text-center">
                <Link
                  to="/projects"
                  className="group inline-flex items-center gap-3 text-[18px] font-bold text-[#111827] transition-colors hover:text-[#0066FF]"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="rotate-180 transition-transform group-hover:-translate-x-2">
                    <path d="M4.16666 10H15.8333M15.8333 10L10.8333 5M15.8333 10L10.8333 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Back to All Projects
                </Link>
              </div>
            </div>
          </Container>
        </Section>
      </main>

      <CtaSection />
      <Footer />

      {/* ── Lightbox Modal ── */}
      <AnimatePresence>
        {lightboxIndex !== null && project.gallery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4"
            onClick={() => setLightboxIndex(null)}
          >
            {/* Image container */}
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="relative max-w-6xl w-full max-h-[90vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={imageMap[project.gallery[lightboxIndex]] || project.gallery[lightboxIndex]}
                alt={`${project.title} gallery item ${lightboxIndex + 1}`}
                className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
              />

              {/* Counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-4 py-1.5 rounded-full">
                {lightboxIndex + 1} / {project.gallery.length}
              </div>
            </motion.div>

            {/* Close button */}
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors backdrop-blur-sm border border-white/20"
              aria-label="Close lightbox"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Prev arrow */}
            {project.gallery.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(i => i !== null ? (i - 1 + project.gallery!.length) % project.gallery!.length : null); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors backdrop-blur-sm border border-white/20"
                aria-label="Previous image"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
            )}

            {/* Next arrow */}
            {project.gallery.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(i => i !== null ? (i + 1) % project.gallery!.length : null); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors backdrop-blur-sm border border-white/20"
                aria-label="Next image"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Video Lightbox Modal ── */}
      <AnimatePresence>
        {videoLightboxIndex !== null && project.videos && (() => {
          const vidUrl = project.videos[videoLightboxIndex];
          const ytId = getYouTubeId(vidUrl);

          return (
            <motion.div
              key="video-lightbox"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 sm:p-8"
              onClick={() => setVideoLightboxIndex(null)}
            >
              {/* Video container */}
              <motion.div
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.92, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="relative w-full max-w-5xl"
                style={{ aspectRatio: '16/9' }}
                onClick={(e) => e.stopPropagation()}
              >
                {ytId ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`}
                    title={`Video ${videoLightboxIndex + 1}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full rounded-2xl border-0 shadow-2xl"
                  />
                ) : (
                  <video
                    src={vidUrl}
                    controls
                    autoPlay
                    className="absolute inset-0 w-full h-full object-contain rounded-2xl shadow-2xl bg-black"
                  />
                )}

                {/* Counter */}
                {project.videos.length > 1 && (
                  <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-4 py-1.5 rounded-full whitespace-nowrap">
                    {videoLightboxIndex + 1} / {project.videos.length}
                  </div>
                )}
              </motion.div>

              {/* Close button */}
              <button
                onClick={() => setVideoLightboxIndex(null)}
                className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors backdrop-blur-sm border border-white/20"
                aria-label="Close video"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Prev arrow */}
              {project.videos.length > 1 && (
                <button
                  onClick={(e) => { e.stopPropagation(); setVideoLightboxIndex(i => i !== null ? (i - 1 + project.videos!.length) % project.videos!.length : null); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors backdrop-blur-sm border border-white/20"
                  aria-label="Previous video"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>
              )}

              {/* Next arrow */}
              {project.videos.length > 1 && (
                <button
                  onClick={(e) => { e.stopPropagation(); setVideoLightboxIndex(i => i !== null ? (i + 1) % project.videos!.length : null); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors backdrop-blur-sm border border-white/20"
                  aria-label="Next video"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              )}
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}
