import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import videoBg from "@/assets/download.mp4";
import { Link } from "react-router-dom";
import { ScrollRevealText } from "@/components/ui/ScrollRevealText";

const list = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export function CtaSection() {
  const ref = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const travel = 25 * 3.5;
  const y = useTransform(scrollYProgress, [0, 1], [-travel, travel]);

  return (
    <section
      id="cta"
      ref={sectionRef}
      className="relative h-[460px] max-h-[460px] overflow-hidden md:h-[520px] md:max-h-[520px] lg:h-[620px] lg:max-h-[620px]"
    >
      {/* Video Background */}
      <motion.video
        autoPlay
        muted
        loop
        playsInline
        className="absolute left-0 w-full object-cover"
        src={videoBg}
        style={{
          y,
          top: `-${travel}px`,
          height: `calc(100% + ${travel * 2}px)`,
          willChange: "transform",
        }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/80 to-black/60" />

      {/* Content */}
      <div className="relative z-10 flex h-full items-center justify-center px-5 pt-8 md:pt-12 lg:pt-14">
        <motion.div
          ref={ref}
          variants={list}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="flex max-w-7xl flex-col items-center text-center"
        >
          <ScrollRevealText
            text="Let's build something great together"
            as="h2"
            className="mx-auto text-5xl font-semibold leading-[0.95] tracking-[-0.06em] text-white sm:text-6xl md:text-6xl lg:text-9xl text-center justify-center"
          />
          
          <motion.p
            variants={item}
            className="mt-8 max-w-2xl font-semibold tracking-[-0.02em] text-lg text-white/60 sm:mt-10 sm:text-xl md:mt-14 md:text-3xl"
          >
            Get in touch to explore how we can help your business reach its full potential.
          </motion.p>
          
          <Link to="/contact">
            <motion.div
              variants={item}
              className="mt-8 inline-flex items-center justify-center rounded-lg bg-white px-12 py-5 text-lg font-semibold tracking-[-0.02em] text-black transition-all hover:bg-white/90 sm:mt-10 sm:px-14 sm:py-5 sm:text-xl md:mt-12 md:px-20 md:py-7 md:text-3xl cursor-pointer"
            >
              Get Started Today
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
