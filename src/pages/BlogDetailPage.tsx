import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CtaSection } from "@/components/sections/CtaSection";
import { getApiUrl, getYouTubeId } from "@/utils/api";
import { FiArrowLeft, FiShare2 } from "react-icons/fi";
import { ParallaxImage } from "@/components/ui/ParallaxImage";
import { ScrollRevealText } from "@/components/ui/ScrollRevealText";

type Blog = {
  title: string;
  slug: string;
  category: string;
  tags: string[];
  author: string;
  date: string;
  readTime: string;
  excerpt: string;
  content: string;
  image: string;
  gallery?: string[];
  videos?: { type: 'youtube' | 'upload'; url: string }[];
};

export function BlogDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  // Lightbox state: null = closed, number = index of open image
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  // Video lightbox state
  const [videoLightboxIndex, setVideoLightboxIndex] = useState<number | null>(null);

  // All images including the cover image
  const allImages = useMemo(() => (blog ? [blog.image, ...(blog.gallery || [])] : []), [blog]);

  // Keyboard navigation for image lightbox
  useEffect(() => {
    if (lightboxIndex === null || allImages.length === 0) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') setLightboxIndex(i => i !== null ? (i + 1) % allImages.length : null);
      if (e.key === 'ArrowLeft') setLightboxIndex(i => i !== null ? (i - 1 + allImages.length) % allImages.length : null);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightboxIndex, allImages]);

  // Keyboard navigation for video lightbox
  useEffect(() => {
    if (videoLightboxIndex === null || !blog?.videos) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setVideoLightboxIndex(null);
      if (e.key === 'ArrowRight') setVideoLightboxIndex(i => i !== null ? (i + 1) % blog.videos!.length : null);
      if (e.key === 'ArrowLeft') setVideoLightboxIndex(i => i !== null ? (i - 1 + blog.videos!.length) % blog.videos!.length : null);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [videoLightboxIndex, blog]);

  useEffect(() => {
    const apiUrl = getApiUrl();
    fetch(`${apiUrl}/blogs`)
      .then((res) => res.json())
      .then((data: Blog[]) => {
        setBlogs(data);
        const found = data.find((b) => b.slug === slug);
        if (found) {
          setBlog(found);
        } else {
          navigate("/blog");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching blog details:", err);
        setLoading(false);
      });
      
    window.scrollTo(0, 0);
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0066FF] border-t-transparent" />
      </div>
    );
  }

  if (!blog) return null;

  // Custom renderer for simple markdown-like content in the json
  const renderContent = (text: string) => {
    return text.split('\n').filter(p => p.trim() !== '').map((paragraph, index) => {
      if (paragraph.startsWith('### ')) {
        return (
          <h3 key={index} className="mt-8 text-[22px] font-bold text-black sm:text-[26px]">
            {paragraph.replace('### ', '')}
          </h3>
        );
      }
      if (paragraph.startsWith('## ')) {
        return (
          <h2 key={index} className="mt-10 text-[26px] font-bold text-black sm:text-[32px]">
            {paragraph.replace('## ', '')}
          </h2>
        );
      }
      return (
        <p key={index} className="mt-6 text-[18px] leading-[1.7] text-black/70 sm:text-[19px]">
          {paragraph}
        </p>
      );
    });
  };

  // Find related articles (same category, excluding current)
  const relatedArticles = blogs
    .filter((b) => b.category === blog.category && b.slug !== blog.slug)
    .slice(0, 2);

  // If there are no related articles in same category, just pick other ones
  const displayedRelated = relatedArticles.length > 0 
    ? relatedArticles 
    : blogs.filter((b) => b.slug !== blog.slug).slice(0, 2);

  return (
    <div className="bg-white">
      <Navbar />
      
      <main className="pt-0">
        {/* Tall Hero Section with background cover image */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative w-full h-screen flex items-end overflow-hidden bg-zinc-950"
        >
          {/* Cover image with group hover zoom & Parallax */}
          <ParallaxImage
            src={blog.image}
            alt={blog.title}
            containerClassName="absolute inset-0 w-full h-full"
            className="opacity-60 blur-md scale-[1.05]"
            offset={40}
          />

          {/* Dark Overlay Gradient to guarantee white text visibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/30" />

          {/* Content Overlay */}
          <Container className="relative z-10 px-6 sm:px-8 lg:px-14 xl:px-20 pb-48 sm:pb-64 lg:pb-80 w-full">
            <div className="max-w-5xl space-y-6">
              {/* Back to Blog */}
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 text-[14px] font-bold text-zinc-300 hover:text-white transition-colors"
              >
                <FiArrowLeft className="w-4 h-4" />
                Back to Blog
              </Link>

              {/* Tag/Category */}
              <div>
                <span className="rounded-full bg-[#0066FF] text-white px-4 py-1.5 text-xs font-black uppercase tracking-wider inline-block">
                  {blog.category}
                </span>
              </div>

              <ScrollRevealText
                text={blog.title}
                as="h1"
                className="text-white text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.08] max-w-4xl"
              />

              {/* Author & Share Row */}
              <div className="mt-8 flex flex-wrap items-center justify-between gap-6 pt-6 border-t border-white/10">
                <div className="flex items-center gap-3">
                  {/* Letter Avatar */}
                  <div className="w-12 h-12 rounded-full bg-[#0066FF] text-white flex items-center justify-center font-bold text-lg border border-white/10 shadow-lg">
                    {blog.author.charAt(0).toUpperCase()}
                  </div>

                  <div className="flex flex-col">
                    <span className="text-white font-bold text-[15px] sm:text-base leading-tight">
                      {blog.author}
                    </span>
                    <span className="text-zinc-400 text-xs sm:text-[13px] font-bold uppercase tracking-wider mt-0.5">
                      ADMIN • {blog.date} • {blog.readTime}
                    </span>
                  </div>
                </div>

                {/* Share Button */}
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert("Article link copied to clipboard!");
                  }}
                  className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-lg"
                  title="Share Article"
                >
                  <FiShare2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </Container>
        </motion.div>

        {/* Main Content Layout */}
        <Section className="relative z-20 -mt-36 md:-mt-48 lg:-mt-60 pb-24 pt-0">
          <Container className="max-w-5xl px-4 sm:px-6">
            {/* 80% Width Overlapping Premium Box */}
            <div className="bg-white border border-zinc-200/80 rounded-[32px] p-8 sm:p-12 md:p-16 shadow-2xl relative z-10">
              <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
                {/* Left Side: Empty space or quick stats */}
                <div className="hidden lg:block lg:col-span-3">
                  <div className="sticky top-44 border-l-2 border-[#0066FF]/20 pl-6 py-2 space-y-8">
                    <div>
                      <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#9CA3AF]">
                        Category
                      </h4>
                      <p className="mt-2 text-[16px] font-semibold text-black">
                        {blog.category}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#9CA3AF]">
                        Share
                      </h4>
                      <div className="mt-3 flex gap-4">
                        {["Twitter", "LinkedIn", "Copy Link"].map((platform) => (
                          <button
                            key={platform}
                            onClick={() => alert(`${platform} sharing is coming soon!`)}
                            className="text-[13px] font-bold text-black/50 hover:text-[#0066FF] transition-colors"
                          >
                            {platform}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side: Article Body & Tags */}
                <div className="lg:col-span-9">
                  <div className="prose prose-lg">
                    {renderContent(blog.content)}
                  </div>

                  {/* Blog Gallery */}
                  {blog.gallery && blog.gallery.length > 0 && (
                    <div className="mt-16 border-t border-black/10 pt-12 space-y-6">
                      <h3 className="text-[22px] font-bold tracking-tight text-[#111827] sm:text-[28px] text-left">
                        Article Gallery
                      </h3>
                      <div className="grid gap-6 sm:grid-cols-2">
                        {blog.gallery.map((imgUrl, idx) => {
                          const isFullWidth = blog.gallery!.length % 2 !== 0 && idx === blog.gallery!.length - 1;
                          return (
                            <motion.button
                              key={idx}
                              type="button"
                              onClick={() => setLightboxIndex(idx + 1)}
                              initial={{ opacity: 0, y: 30 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.6, delay: idx * 0.08 }}
                              className={`group relative overflow-hidden rounded-[20px] border border-zinc-150 bg-zinc-50 shadow-sm aspect-video cursor-zoom-in ${isFullWidth ? 'sm:col-span-2' : ''}`}
                            >
                              <ParallaxImage
                                src={imgUrl}
                                alt={`${blog.title} gallery image ${idx + 1}`}
                                containerClassName="absolute inset-0 w-full h-full"
                                className="transition-transform duration-700 group-hover:scale-105"
                                offset={25}
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur-sm rounded-full p-2.5 shadow-lg">
                                  <svg className="w-5 h-5 text-[#111827]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0zm-6-3v6m-3-3h6"/>
                                  </svg>
                                </div>
                              </div>
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Videos */}
                  {blog.videos && blog.videos.length > 0 && (
                    <div className="mt-16 border-t border-black/10 pt-12 space-y-6">
                      <h3 className="text-[22px] font-bold tracking-tight text-[#111827] sm:text-[28px] text-left">
                        Featured Videos
                      </h3>
                      <div className="grid gap-6 sm:grid-cols-2">
                        {blog.videos.map((vid, idx) => {
                          const ytId = vid.type === 'youtube' ? getYouTubeId(vid.url) : null;
                          const thumbSrc = ytId
                            ? `https://img.youtube.com/vi/${ytId}/hqdefault.webp`
                            : null;

                          return (
                            <motion.button
                              key={idx}
                              type="button"
                              onClick={() => setVideoLightboxIndex(idx)}
                              className="group relative overflow-hidden rounded-[20px] border border-zinc-150 shadow-sm aspect-video cursor-pointer bg-[#111827] w-full text-left"
                              aria-label="Play video"
                            >
                              {/* Thumbnail */}
                              {thumbSrc ? (
                                <img
                                  src={thumbSrc}
                                  alt={`${blog.title} video thumbnail ${idx + 1}`}
                                  className="h-full w-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center bg-slate-900">
                                  <span className="text-white text-[12px] font-bold tracking-wider">Play Video</span>
                                </div>
                              )}

                              {/* Play button */}
                              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                                <div className="w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-2xl transition-transform duration-300 group-hover:scale-110 group-hover:bg-white">
                                  <svg className="w-7 h-7 text-[#111827] ml-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                                  </svg>
                                </div>
                                <span className="text-white text-[12px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">
                                  Play Video
                                </span>
                              </div>

                              {/* Badges */}
                              <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full">
                                {vid.type === 'youtube' ? (
                                  <>
                                    <svg className="w-3.5 h-3.5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                    </svg>
                                    <span className="text-white text-[10px] font-bold">YouTube</span>
                                  </>
                                ) : (
                                  <>
                                    <svg className="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z"/>
                                    </svg>
                                    <span className="text-white text-[10px] font-bold">Upload</span>
                                  </>
                                )}
                              </div>
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Tag Chips */}
                  <div className="mt-16 flex flex-wrap gap-2 border-t border-black/10 pt-10">
                    {blog.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-black/10 bg-white px-4 py-2 text-[13px] font-medium text-black/60 hover:border-black/20 hover:text-black transition-colors"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </Section>

        <Section className="pb-32 border-t border-black/5 pt-24 bg-zinc-50/50">
          <Container>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between mb-16">
              <div>
                <p className="text-[12px] font-bold tracking-[0.2em] text-[#0066FF] uppercase">
                  / Next Stories /
                </p>
                <h2 className="mt-3 text-[32px] font-semibold leading-tight tracking-tight text-black sm:text-[44px]">
                  Keep reading
                </h2>
              </div>
              <Link
                to="/blog"
                className="group inline-flex items-center gap-2 text-[15px] font-semibold text-black underline decoration-black/30 underline-offset-4 transition-colors hover:decoration-[#0066FF] hover:text-[#0066FF] hover:decoration-solid"
              >
                All articles
                <svg className="h-4 w-4 text-[#0066FF] transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>

            <div className="grid gap-10 sm:grid-cols-2 lg:gap-14">
              {displayedRelated.map((related) => (
                <Link
                  key={related.slug}
                  to={`/blog/${related.slug}`}
                  className="group block"
                >
                  <ParallaxImage
                    src={related.image}
                    alt={related.title}
                    containerClassName="aspect-[16/9] w-full rounded-[24px] bg-zinc-100 shadow-sm transition-all duration-500 hover:shadow-md"
                    className="transition-transform duration-700 ease-[0.33,1,0.68,1] group-hover:scale-104"
                    offset={30}
                  />
                  
                  <div className="mt-6 flex flex-col gap-3 px-1">
                    <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-wider text-black/55">
                      <span className="text-[#0066FF]">{related.category}</span>
                      <span>{related.readTime}</span>
                    </div>
                    
                    <h3 className="text-[20px] font-semibold leading-tight text-black group-hover:text-[#0066FF] transition-colors duration-300">
                      {related.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </Section>
      </main>

      <CtaSection />
      <Footer />

      {/* ── Image Lightbox Modal ── */}
      <AnimatePresence>
        {lightboxIndex !== null && allImages.length > 0 && (
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
                src={allImages[lightboxIndex]}
                alt={`Gallery item ${lightboxIndex + 1}`}
                className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
              />

              {/* Counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-4 py-1.5 rounded-full">
                {lightboxIndex + 1} / {allImages.length}
              </div>
            </motion.div>

            {/* Close button */}
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors backdrop-blur-sm border border-white/20"
              aria-label="Close lightbox"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>

            {/* Prev arrow */}
            {allImages.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(i => i !== null ? (i - 1 + allImages.length) % allImages.length : null); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors backdrop-blur-sm border border-white/20"
                aria-label="Previous image"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"/>
                </svg>
              </button>
            )}

            {/* Next arrow */}
            {allImages.length > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(i => i !== null ? (i + 1) % allImages.length : null); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors backdrop-blur-sm border border-white/20"
                aria-label="Next image"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"/>
                </svg>
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Video Lightbox Modal ── */}
      <AnimatePresence>
        {videoLightboxIndex !== null && blog.videos && (() => {
          const vid = blog.videos[videoLightboxIndex];
          let ytId: string | null = null;
          if (vid.type === 'youtube') {
            ytId = getYouTubeId(vid.url);
          }

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
                {vid.type === 'youtube' && ytId ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`}
                    title={`Video ${videoLightboxIndex + 1}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full rounded-2xl border-0 shadow-2xl"
                  />
                ) : (
                  <video
                    src={vid.url}
                    controls
                    autoPlay
                    className="absolute inset-0 w-full h-full object-contain rounded-2xl shadow-2xl bg-black"
                  />
                )}

                {/* Counter */}
                {blog.videos.length > 1 && (
                  <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-4 py-1.5 rounded-full whitespace-nowrap">
                    {videoLightboxIndex + 1} / {blog.videos.length}
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
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>

              {/* Prev arrow */}
              {blog.videos.length > 1 && (
                <button
                  onClick={(e) => { e.stopPropagation(); setVideoLightboxIndex(i => i !== null ? (i - 1 + blog.videos!.length) % blog.videos!.length : null); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors backdrop-blur-sm border border-white/20"
                  aria-label="Previous video"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"/>
                  </svg>
                </button>
              )}

              {/* Next arrow */}
              {blog.videos.length > 1 && (
                <button
                  onClick={(e) => { e.stopPropagation(); setVideoLightboxIndex(i => i !== null ? (i + 1) % blog.videos!.length : null); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors backdrop-blur-sm border border-white/20"
                  aria-label="Next video"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"/>
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
