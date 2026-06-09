import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import heroImage from "@/assets/hero-image.webp";
import ShinyText from "./ShinyText";

const accentBlue = "#0066FF";

export function Hero() {
  const heroImageRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: heroImageRef,
    offset: ["start end", "end start"],
    layoutEffect: false,
  });
  const y = useTransform(scrollYProgress, [0, 0.6], [0, -200]);

  return (
    <section className="bg-white">
      {/* White content block: two columns */}
      <div className="relative">
        <div className="mx-auto w-full max-w-[140rem] px-5 pt-32 pb-10 sm:px-6 sm:pt-36 sm:pb-12 md:pt-40 md:pb-14 lg:px-10 lg:pt-100 lg:pb-16">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12 xl:gap-16">
            {/* Left column: headline (~60–65%) */}
            <div className="lg:col-span-8">
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-black leading-[1.02]"
                style={{
                  fontFamily: '"Manrope", "Manrope Placeholder", sans-serif',
                  fontFeatureSettings:
                    '"blwf" on, "cv09" on, "cv03" on, "cv04" on, "cv11" on',
                  fontSize: "clamp(68px, 9.5vw, 96px)",
                  fontStyle: "normal",
                  fontWeight: 600,
                  letterSpacing: "-0.06em",
                  lineHeight: "1.02em",
                  textAlign: "start",
                  textDecoration: "none",
                }}
              >
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="block max-w-[900px]"
                >
                  <ShinyText
                    text="We design solutions"
                    speed={2}
                    delay={10}
                    color="#1A1A1A"
                    shineColor="#FFFFFF"
                    spread={120}
                    direction="left"
                    yoyo={false}
                    pauseOnHover={false}
                    disabled={false}
                  />
                  <br />
                  <span className="inline-flex flex-wrap items-baseline gap-x-3 gap-y-2 xl:flex-nowrap xl:whitespace-nowrap">
                    <ShinyText
                      text="that drive"
                      speed={2}
                      delay={10}
                      color="#1A1A1A"
                      shineColor="#FFFFFF"
                      spread={120}
                      direction="left"
                      yoyo={false}
                      pauseOnHover={false}
                      disabled={false}
                    />
                    <span
                      className="inline-block align-baseline px-2 py-1 text-white"
                      style={{ backgroundColor: accentBlue, fontWeight: 700 }}
                    >
                      business.
                    </span>
                  </span>
                </motion.span>
              </motion.h1>
            </div>

            {/* Right column: description + CTA (~35–40%) */}
            <div className="flex flex-col lg:col-span-4 lg:col-start-9 lg:pt-15">
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.35 }}
                className="max-w-md text-[20px] font-bold leading-[1.45] tracking-tight text-[#0c120c99]"
              >
                We help brands grow through creative media, AI-powered content, and scalable digital technology — all under one roof.
              </motion.p>
              <motion.a
                href="#services"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                className="group mt-6 inline-flex items-center gap-2 text-[20px] font-bold text-black underline decoration-black/60 underline-offset-2 transition-colors hover:decoration-black"
              >
                Browse our services
                <svg className="h-5 w-5 shrink-0 transition-transform text-[#0066FF] group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </motion.a>
            </div>
          </div>
        </div>
      </div>

      {/* Full-width hero image — add public/hero-image.webp for the co-working / team photo */}
      <div ref={heroImageRef} className="relative h-[65vh] min-h-[320px] w-full overflow-hidden bg-zinc-200">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.65, ease: "easeOut" }}
          className="relative h-full w-full"
        >
          <motion.img
            src={heroImage}
            alt="Team working in a modern co-working space"
            className="absolute left-0 top-0 h-[calc(100%+220px)] w-full object-cover object-center"
            style={{ y, willChange: "transform" }}
          />
        </motion.div>
      </div>
    </section>
  );
}
