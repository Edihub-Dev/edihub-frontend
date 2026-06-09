import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import teamImage from "@/assets/team.webp";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

const infinity = "\u221E";

const list = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.32,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

export function TeamImageStats() {
  const mediaRef = useRef<HTMLDivElement | null>(null);
  const headingRef = useRef(null);
  const headingInView = useInView(headingRef, { once: true, margin: "-60px" });
  const inView = useInView(mediaRef, { once: true, margin: "-80px" });
  const { scrollYProgress } = useScroll({
    target: mediaRef,
    offset: ["start end", "end start"],
    layoutEffect: false,
  });
  const y = useTransform(scrollYProgress, [0, 0.6], [0, -130]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.4, 1, 1]);

  return (
    <Section id="team" className="bg-white py-0">
      <Container className="pb-10 pt-4 md:pb-14 lg:pb-16">
        <motion.h2
          ref={headingRef}
          initial={{ opacity: 0, y: 14 }}
          animate={headingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="text-center text-[36px] font-semibold leading-[1.02] tracking-[-0.06em] text-[#1A1A1A] sm:text-[44px] md:text-[52px] lg:text-[64px]"
        >
          or get to know us first!
        </motion.h2>
      </Container>

      <div className="relative w-full">
        <div
          ref={mediaRef}
          className="relative h-[70vh] min-h-[420px] w-full overflow-hidden bg-zinc-200 lg:h-screen"
        >
          <motion.img
            src={teamImage}
            alt=""
            loading="lazy"
            draggable={false}
            className="absolute left-0 top-[-220px] h-[calc(100%+440px)] w-full object-cover object-center"
            style={{ y, scale, willChange: "transform" }}
          />

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[320px] bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[220px] bg-black/25 blur-2xl" />

          <Container className="absolute inset-x-0 bottom-0">
            <motion.div
              variants={list}
              initial="hidden"
              animate={inView ? "show" : "hidden"}
              className="flex w-full flex-col gap-8 pt-10 pb-[72px] text-white sm:flex-row sm:items-end sm:justify-between sm:gap-14 lg:justify-start lg:gap-44"
            >
              <motion.div variants={item} className="flex items-end gap-4">
                <div className="text-[64px] font-semibold leading-none tracking-[-0.06em] sm:text-[76px] lg:text-[92px]">
                  19
                </div>
                <div className="pb-2 text-[20px] font-medium leading-[1.1] text-white/90 sm:text-[22px] lg:text-[24px]">
                  talented
                  <br />
                  individuals
                </div>
              </motion.div>

              <motion.div variants={item} className="flex items-end gap-4">
                <div className="text-[64px] font-semibold leading-none tracking-[-0.06em] sm:text-[76px] lg:text-[92px]">
                  134<span className="text-[#0066FF]">+</span>
                </div>
                <div className="pb-2 text-[20px] font-medium leading-[1.1] text-white/90 sm:text-[22px] lg:text-[24px]">
                  projects
                  <br />
                  later
                </div>
              </motion.div>

              <motion.div variants={item} className="flex items-end gap-4">
                <div className="text-[64px] font-semibold leading-none tracking-[-0.06em] sm:text-[76px] lg:text-[92px]">
                  {infinity}
                </div>
                <div className="pb-2 text-[20px] font-medium leading-[1.1] text-white/90 sm:text-[22px] lg:text-[24px]">
                  combined
                  <br />
                  experience
                </div>
              </motion.div>
            </motion.div>
          </Container>
        </div>
      </div>
    </Section>
  );
}
