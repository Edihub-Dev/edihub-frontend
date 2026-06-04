import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { TeamImageStats } from "./TeamImageStats";
import teamImage from "@/assets/stats.jpg";

const list = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.22,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

export function AboutStats() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const mediaRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: mediaRef,
    offset: ["start end", "end start"],
    layoutEffect: false,
  });
  const y = useTransform(scrollYProgress, [0, 0.6], [0, -90]);

  return (
    <>
      <TeamImageStats />

      {/* Two columns: text left, image right */}
      <Section className="bg-white pt-16 lg:pt-24">
        <Container className="px-6 sm:px-8 lg:px-14 xl:px-20">
          <div ref={ref} className="grid gap-12 lg:grid-cols-12 lg:gap-12 xl:gap-16">
            <motion.div
              variants={list}
              initial="hidden"
              animate={inView ? "show" : "hidden"}
              className="relative z-10 flex flex-col lg:col-span-6 lg:min-h-[520px]"
            >
              <motion.h3
                variants={item}
                className="text-[34px] font-semibold leading-[1.02] tracking-[-2.4px] text-[#1A1A1A] sm:text-[40px] md:text-[44px] lg:text-[44px]"
              >
                We are a group of positive thinkers, dedicated to making a difference in the digital world.
              </motion.h3>
              <motion.p
                variants={item}
                className="mt-24 max-w-[50ch] text-[14px] leading-[1.6] text-[#6A6A6A] sm:text-[18px]"
              >
                We combine creative vision with technical expertise to help businesses thrive in the digital space, turning ambitious goals into remarkable results.
              </motion.p>

              <div className="mt-12 lg:mt-auto">
                <motion.div variants={item}>
                  <Link
                    to="/about#team"
                    className="group inline-flex items-center gap-2 text-[18px] font-semibold text-[#1A1A1A] underline decoration-[#1A1A1A]/60 underline-offset-4 hover:decoration-[#1A1A1A] lg:text-[24px]"
                  >
                    Meet the team
                    <svg
                      className="h-5 w-5 shrink-0 text-[#0066FF] transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5 lg:h-6 lg:w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
                    </svg>
                  </Link>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              variants={list}
              initial="hidden"
              animate={inView ? "show" : "hidden"}
              className="lg:col-span-6 lg:flex lg:justify-end"
            >
              <motion.div
                variants={item}
                ref={mediaRef}
                className="relative aspect-[4/3] w-full max-w-[520px] overflow-hidden rounded-3xl bg-zinc-200 lg:aspect-[564/754] lg:max-w-[564px]"
              >
                <motion.img
                  src={teamImage}
                  alt=""
                  loading="lazy"
                  draggable={false}
                  className="absolute left-0 top-[-120px] h-[calc(100%+240px)] w-full object-cover object-center"
                  style={{ y, willChange: "transform" }}
                />
              </motion.div>
            </motion.div>
          </div>
        </Container>
      </Section>
    </>
  );
}
