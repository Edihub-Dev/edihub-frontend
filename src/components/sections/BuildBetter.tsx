import { motion, useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

const list = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.18,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

function ArrowLink({
  to,
  children,
}: {
  to: string;
  children: ReactNode;
}) {
  return (
    <Link
      to={to}
      className="group inline-flex items-center gap-2 text-[18px] font-semibold text-[#1A1A1A] underline decoration-[#1A1A1A]/60 underline-offset-4 hover:decoration-[#1A1A1A] lg:text-[24px]"
    >
      {children}
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
  );
}

export function BuildBetter() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <Section id="build-better" className="bg-white py-20 md:py-28 lg:py-32">
      <Container className="px-5 sm:px-6 lg:px-10 xl:px-16">
        <motion.div
          ref={ref}
          variants={list}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
        >
          <div className="flex justify-end">
            <div className="w-full max-w-[640px] lg:max-w-[720px]">
              <motion.h2
                variants={item}
                className="text-[40px] font-semibold leading-[1.02] tracking-[-0.06em] text-[#1A1A1A] sm:text-[48px] md:text-[56px] lg:text-[64px]"
              >
                Want to build
                <br />
                something better?
              </motion.h2>

              <motion.p
                variants={item}
                className="mt-8 max-w-[42ch] text-[16px] leading-[1.55] text-[#6A6A6A] sm:mt-10 sm:text-[18px] lg:text-[20px]"
              >
                Our team brings together design, development, and strategic thinking to help you grow.
              </motion.p>

              <motion.div variants={item} className="mt-10 sm:mt-12">
                <ArrowLink to="/contact">Start now</ArrowLink>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </Container>
    </Section>
  );
}
