import { useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useRef } from "react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { ScrollRevealText } from "@/components/ui/ScrollRevealText";

const header = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.22,
    },
  },
};

const headerItem = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

const steps = [
  {
    number: "01",
    title: "Discover",
    description:
      "We understand your goals, audience, and challenges before creating anything.",
  },
  {
    number: "02",
    title: "Strategize",
    description:
      "We plan the creative, technical, and AI approach aligned with your business objectives.",
  },
  {
    number: "03",
    title: "Create",
    description:
      "We design, build, and generate high-quality content and digital solutions under one roof.",
  },
  {
    number: "04",
    title: "Refine",
    description:
      "We review, test, and optimize every detail for performance and consistency.",
  },
  {
    number: "05",
    title: "Deliver",
    description:
      "We deliver your solution with full support and monitoring to ensure success.",
  },
];

const ACCENT_DOT = "#0B5CFF";

export function Process() {
  const [activeIndex, setActiveIndex] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <Section id="process" className="bg-black text-white py-10 md:py-12 lg:py-14 xl:py-40">
      <Container>
        <div ref={ref} className="flex flex-col">
          <motion.div
            variants={header}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            className="grid gap-8 lg:grid-cols-12 lg:gap-16"
          >
            <div className="lg:col-span-5">
              <motion.span
                variants={headerItem}
                className="text-[12px] font-black uppercase tracking-[0.1em] text-white/60"
              >
                / Our process
              </motion.span>
            </div>
            <div className="lg:col-span-6">
              <ScrollRevealText
                text="Our mission is to help businesses grow through strategic design, creating work that performs as good as it looks."
                as="h2"
                className="text-[28px] font-semibold leading-[1.05] tracking-[-2.6px] text-white sm:text-[34px] md:text-[44px] lg:text-[45px]"
              />
            </div>
          </motion.div>

          <div
            className="mx-auto mt-6 w-full grid gap-4 sm:grid-cols-2 lg:mt-20 lg:flex lg:items-stretch lg:max-w-[1350px]"
          >
            {steps.map((step, i) => {
              const isActive = activeIndex === i;
              return (
                <motion.article
                  key={step.number}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.03 * i }}
                  onMouseEnter={() => setActiveIndex(i)}
                  onClick={() => setActiveIndex(i)}
                  className={`cursor-pointer overflow-hidden rounded-2xl border px-6 py-7 transition-all duration-300 ease-out md:px-7 md:py-8 lg:flex lg:h-[28rem] lg:flex-col ${
                    isActive ? "border-white/30 lg:flex-[2]" : "border-white/15 lg:flex-[1]"
                  }`}
                >
                  <span
                    className={`text-xl font-medium transition-colors duration-300 ${isActive ? "text-white/70" : "text-white/30"}`}
                  >
                    {step.number}
                  </span>
                  <h3
                    className={`mt-5 text-[22px] font-semibold leading-[1.05] tracking-[-1.2px] transition-colors duration-300 md:text-[32px] lg:text-[44px] ${
                      isActive ? "text-white" : "text-white/50"
                    }`}
                  >
                    {step.title}
                  </h3>

                  {/* Desktop only spacer — pushes description to bottom in fixed-height cards */}
                  <div className="hidden lg:block lg:flex-1" />

                  {/*
                    MOBILE accordion using CSS grid-template-rows trick.
                    gridTemplateRows: "0fr" → "1fr" animates height smoothly to/from auto.
                    Inner div MUST have min-h-0 for the collapse to work.
                    This gives proper accordion: active = expanded, inactive = collapsed.
                  */}
                  <div
                    className="grid lg:hidden overflow-hidden"
                    style={{
                      gridTemplateRows: isActive ? "1fr" : "0fr",
                      transition: "grid-template-rows 320ms cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  >
                    <div className="min-h-0">
                      <p className="pt-5 text-[15px] leading-[1.55] text-white/65">
                        {step.description}
                      </p>
                      <div className="mt-4 pb-1">
                        <span
                          className="inline-block h-3 w-3 rounded-full"
                          style={{ backgroundColor: ACCENT_DOT }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Desktop: AnimatePresence — fine because lg cards have fixed height */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        className="hidden lg:block"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.25 }}
                      >
                        <p className="text-[20px] leading-[1.45] text-white/65">
                          {step.description}
                        </p>
                        <div className="mt-5">
                          <span
                            className="inline-block h-3 w-3 rounded-full"
                            style={{ backgroundColor: ACCENT_DOT }}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.article>
              );
            })}
          </div>
        </div>
      </Container>
    </Section>
  );
}
