import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { getApiUrl } from "@/utils/api";

import bgCanvasStudio from "@/assets/pexels-canvastudio-3153198.webp";
import bgMikhailNilov from "@/assets/pexels-mikhail-nilov-6930549.webp";
import heroImage from "@/assets/hero-image.webp";
import teamImage from "@/assets/team.webp";

const imageMap: Record<string, string> = {
  "hero-image.webp": heroImage,
  "pexels-mikhail-nilov-6930549.webp": bgMikhailNilov,
  "pexels-canvastudio-3153198.webp": bgCanvasStudio,
  "team.webp": teamImage,
};

const fallbackTestimonials = [
  {
    quote: "Finally found a team that understands both design and business. Our brand now perfectly captures what makes us different.",
    name: "James Chen",
    role: "CEO, Vertex Labs",
    bgImage: "pexels-canvastudio-3153198.webp",
    avatar: "team.webp"
  },
  {
    quote: "EDIHUB transformed our digital presence completely. The new website increased our conversion rate by 40% in the first month.",
    name: "Sarah Mitchell",
    role: "Marketing Director, Nexora",
    bgImage: "pexels-mikhail-nilov-6930549.webp",
    avatar: "team.webp"
  },
  {
    quote: "The attention to detail and strategic thinking set them apart. Our product launch was a huge success thanks to their design.",
    name: "Emma Rodriguez",
    role: "Product Lead, Flowstack",
    bgImage: "hero-image.webp",
    avatar: "team.webp"
  }
];

export function Testimonials() {
  const bgRef = useRef<HTMLDivElement | null>(null);
  const [testimonials, setTestimonials] = useState<any[]>([]);

  useEffect(() => {
    const apiUrl = getApiUrl();
    fetch(`${apiUrl}/testimonials`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setTestimonials(data);
        } else {
          setTestimonials(fallbackTestimonials);
        }
      })
      .catch((err) => {
        console.error("Error fetching testimonials:", err);
        setTestimonials(fallbackTestimonials);
      });
  }, []);

  const { scrollYProgress } = useScroll({
    target: bgRef,
    offset: ["start end", "end start"],
    layoutEffect: false,
  });
  const parallaxY = useTransform(scrollYProgress, [0, 0.7], [0, -120]);

  useEffect(() => {
    const srcs = Array.from(new Set(testimonials.map((t) => t.bgImage))).filter(
      (src): src is string => typeof src === "string" && src.length > 0,
    );

    const imgs = srcs.map((src) => {
      const img = new Image();
      img.src = imageMap[src] || src;
      img.decoding = "async";
      return img;
    });

    return () => {
      for (const img of imgs) {
        img.src = "";
      }
    };
  }, [testimonials]);

  const slideVariants = {
    enter: (d: 1 | -1) => ({ opacity: 0, x: d * 36 }),
    center: { opacity: 1, x: 0 },
    exit: (d: 1 | -1) => ({ opacity: 0, x: d * -36 }),
  };

  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const active = testimonials[activeIndex];
  const total = testimonials.length;
  const progressWidth = useMemo(() => {
    if (total <= 1) return "100%";
    return `${((activeIndex + 1) / total) * 100}%`;
  }, [activeIndex, total]);

  const goPrev = () => {
    setDirection(-1);
    setActiveIndex((i) => (i - 1 + total) % total);
  };

  const goNext = () => {
    setDirection(1);
    setActiveIndex((i) => (i + 1) % total);
  };

  // Always render the section so `bgRef` is hydrated immediately;
  // hide content until data arrives to avoid layout shift.
  if (testimonials.length === 0) {
    return (
      <Section id="testimonials" className="bg-white">
        <div ref={bgRef} style={{ position: "relative" }} />
      </Section>
    );
  }

  return (
    <Section id="testimonials" className="bg-white">
      <Container>
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center text-5xl font-bold tracking-tight text-[#1A1A1A] sm:text-6xl"
        >
          Real results, real feedback
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="mx-auto mt-6 max-w-3xl text-center text-[16px] leading-relaxed text-[#666666] sm:text-[18px]"
        >
          Companies we've helped grow through strategic design, development, and digital transformation solutions.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-auto mt-12 w-full max-w-[1300px]"
        >
          <div ref={bgRef} className="relative overflow-hidden rounded-2xl bg-[#F5F5F3] px-4 py-10 md:bg-[#F2F2F2] md:px-0 md:py-0">
            <div className="relative hidden h-[420px] w-full md:block md:h-[780px]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.img
                  key={activeIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  src={imageMap[active.bgImage] || active.bgImage}
                  alt="Testimonial background"
                  loading="eager"
                  decoding="async"
                  className="absolute inset-0 h-[calc(100%+140px)] w-full object-cover object-center"
                  style={{ y: parallaxY, willChange: "transform" }}
                />
              </AnimatePresence>
            </div>
            <div className="absolute inset-0 hidden bg-black/10 md:block" />

            <div className="relative mx-auto w-[min(360px,90%)] md:absolute md:left-1/2 md:top-1/2 md:w-[min(620px,92%)] md:-translate-x-1/2 md:-translate-y-1/2">
              <AnimatePresence mode="wait" initial={false} custom={direction}>
                <motion.div
                  key={activeIndex}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.28, ease: "easeOut" }}
                  className="relative flex min-h-[440px] flex-col rounded-2xl bg-[#F5F5F3] px-10 pb-10 pt-14 shadow-[0_24px_60px_rgba(0,0,0,0.18)] md:px-14 md:pb-14 md:pt-20"
                >
                  <div className="absolute right-10 top-10 text-[#0066FF] md:right-14 md:top-14">
                    <svg width="56" height="56" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M7.17 6A5.17 5.17 0 0 0 2 11.17V18a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H6.24a3.2 3.2 0 0 1 3.18-2.8.75.75 0 0 0 .75-.75V6.75A.75.75 0 0 0 9.42 6H7.17Zm12 0A5.17 5.17 0 0 0 14 11.17V18a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-1.76a3.2 3.2 0 0 1 3.18-2.8.75.75 0 0 0 .75-.75V6.75A.75.75 0 0 0 21.42 6h-2.25Z" />
                    </svg>
                  </div>

                  <div className="mx-auto w-full max-w-[520px] pr-14 md:max-w-[560px] md:pr-16">
                    <p className="text-[32px] font-semibold tracking-[-0.05em] leading-[1.05] text-[#111] md:text-[36px]">
                      {active.quote}
                    </p>
                  </div>

                  <div className="mt-auto flex items-end justify-between gap-6 pt-8">
                    <div>
                      <div className="text-[18px] font-semibold leading-none text-[#111] md:text-[20px]">{active.name}</div>
                      <div className="mt-2 text-[16px] leading-none text-[#777] md:text-[18px]">{active.role}</div>
                    </div>

                    <div className="h-16 w-16 overflow-hidden rounded-full bg-[#EAEAEA]">
                      <img
                        src={imageMap[active.avatar] || active.avatar || imageMap[active.bgImage] || active.bgImage}
                        alt={active.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-4">
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white text-black transition-colors hover:bg-black hover:text-white"
              aria-label="Previous testimonial"
              onClick={goPrev}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white text-black transition-colors hover:bg-black hover:text-white"
              aria-label="Next testimonial"
              onClick={goNext}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
              </svg>
            </button>

            <div className="ml-2 h-[2px] flex-1 rounded-full bg-black/10">
              <div className="h-full rounded-full bg-black" style={{ width: progressWidth }} />
            </div>
          </div>
        </motion.div>
      </Container>
    </Section>
  );
}
