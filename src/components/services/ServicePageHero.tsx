import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { ServiceHeroVisual, ScrollExploreIndicator } from "./ServiceVisuals";
import { PrimaryButton, SecondaryButton } from "./ServiceUi";
import { Container } from "@/components/ui/Container";

const list = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

type ServicePageHeroProps = {
  label: ReactNode;
  title: string;
  description: string;
  primaryCta?: { to: string; label: string };
  secondaryCta?: { to: string; label: string };
  heroImage?: string;
};

/** Identical hero block — used on /services and /services/:slug */
export function ServicePageHero({
  label,
  title,
  description,
  primaryCta = { to: "/contact", label: "Start a project" },
  secondaryCta = { to: "/projects", label: "View our work" },
  heroImage,
}: ServicePageHeroProps) {
  return (
    <section className="border-b border-[#F3F4F6] bg-white py-16 md:py-20 lg:py-24">
      <Container className="px-5 sm:px-6 lg:px-10 xl:px-16">
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-12 xl:gap-20">
          {/* Left — text (same as Web Design page) */}
          <motion.div
            variants={list}
            initial="hidden"
            animate="show"
            className="flex min-h-0 flex-col lg:min-h-[480px] lg:justify-center lg:py-4"
          >
            <motion.div variants={item}>{label}</motion.div>
            <motion.h1
              variants={item}
              className="mt-8 text-[44px] font-semibold leading-[1.02] tracking-[-0.06em] text-[#111827] sm:text-[56px] md:text-[64px] lg:text-[72px]"
            >
              {title}
            </motion.h1>
            <motion.p
              variants={item}
              className="mt-8 max-w-[46ch] text-[15px] leading-[1.7] text-[#6B7280] sm:text-[17px]"
            >
              {description}
            </motion.p>
            <motion.div variants={item} className="mt-10 flex flex-wrap gap-4">
              <PrimaryButton to={primaryCta.to}>{primaryCta.label}</PrimaryButton>
              <SecondaryButton to={secondaryCta.to}>{secondaryCta.label}</SecondaryButton>
            </motion.div>
            <motion.div variants={item}>
              <ScrollExploreIndicator />
            </motion.div>
          </motion.div>

          {/* Right — full-size 3D graphic (same as Web Design page) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="relative w-full lg:min-h-[480px]"
          >
            <ServiceHeroVisual image={heroImage} />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
