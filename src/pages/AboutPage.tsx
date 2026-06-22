import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import teamImage from "@/assets/team.webp";
import statsImage from "@/assets/stats.webp";

import { CtaSection } from "@/components/sections/CtaSection";
import { Footer } from "@/components/layout/Footer";
import { team } from "@/data/team";

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

export function AboutPage() {
  const heroRef = useRef(null);
  const heroImagesRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroImagesRef,
    offset: ["start end", "end start"],
    layoutEffect: false,
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);

  const storyRef = useRef(null);
  const teamRef = useRef(null);

  return (
    <>
      {/* Hero - Building digital excellence since 2014 */}
      <Section className="bg-white pt-44 pb-16 md:pt-56 md:pb-20 lg:pt-64 lg:pb-24 xl:pt-72 xl:pb-28">
        <Container className="px-6 sm:px-8 lg:px-14 xl:px-20">
          <motion.div
            ref={heroRef}
            variants={list}
            initial="hidden"
            animate="show"
          >
            <motion.h1
              variants={item}
              className="max-w-[22ch] text-[40px] font-semibold leading-[0.95] tracking-[-0.09em] text-[#111827] sm:text-[52px] md:text-[64px] lg:text-[80px]"
            >
              Building digital
              <br />
              excellence since 2014
            </motion.h1>

            <div
              ref={heroImagesRef}
              className="relative mt-16 grid gap-8 lg:mt-24 lg:grid-cols-12 lg:gap-14"
            >
              {/* Left image card */}
              <motion.div variants={item} className="lg:col-span-6">
                <Link to="/team/markus-chen" className="group block overflow-hidden rounded-[2rem] lg:rounded-[3.5rem] bg-zinc-100">
                  <motion.div style={{ y: imageY }} className="h-full w-full">
                    <img
                      src={teamImage}
                      alt="Our Team"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </motion.div>
                </Link>
              </motion.div>

              {/* Right text + image stack */}
              <motion.div
                variants={item}
                className="flex flex-col justify-end lg:col-span-6 lg:pb-12"
              >
                <p className="max-w-[45ch] text-[18px] leading-relaxed text-[#4B5563] sm:text-[20px] lg:text-[24px]">
                  We are a full-service digital agency driven by creativity, powered by
                  technology, and accelerated by AI. From building brands to
                  developing scalable digital products, we help businesses transform
                  ideas into impactful digital experiences.
                </p>
                <div className="mt-12 overflow-hidden rounded-[2rem] lg:rounded-[3.5rem] bg-zinc-100">
                  <Link to="/services" className="group block h-full w-full">
                    <img
                      src={statsImage}
                      alt="Our Impact"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </Link>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </Container>
      </Section>

      {/* Story + large quote */}
      <Section className="bg-white py-24 md:py-32 lg:py-48">
        <Container className="px-6 sm:px-8 lg:px-14 xl:px-20">
          <motion.div
            ref={storyRef}
            variants={list}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {/* Top: Title and paragraph on left */}
            <div className="lg:w-[65%]">
              <motion.h2 variants={item} className="text-[36px] font-semibold leading-[1.05] tracking-[-0.06em] text-[#111827] sm:text-[44px] md:text-[56px] lg:text-[72px]">
                From humble beginnings to a trusted digital partner
              </motion.h2>
              <motion.p variants={item} className="mt-12 text-[18px] leading-relaxed text-[#4B5563] sm:text-[20px] lg:text-[26px]">
                What started as a small team of three developers working from a tiny office has grown into a dynamic
                digital agency trusted by businesses across multiple industries. Through dedication to quality,
                transparent communication, and a deep understanding of our clients' needs, we've built lasting
                partnerships and delivered solutions that make a difference.
              </motion.p>
            </div>

            {/* Bottom: Quote section aligned right */}
            <motion.div
              variants={item}
              className="mt-32 md:mt-48 flex justify-end"
            >
              <div className="lg:w-[60%]">
                <div className="flex items-start gap-6">
                  <span className="text-[80px] font-bold leading-[0.8] text-[#0066FF] lg:text-[140px] flex-shrink-0">
                    ❝
                  </span>
                  <p className="text-[24px] leading-[1.3] text-[#111827] sm:text-[32px] md:text-[40px] lg:text-[48px] font-semibold tracking-[-0.06em]">
                    When we founded Edihub, we had a simple vision - to help businesses succeed in the digital world by
                    combining technical excellence with genuine care for our clients' success.
                  </p>
                </div>
                {/* Author */}
                <div className="mt-12 flex items-center gap-6 ml-20 lg:ml-32">
                  <div className="h-20 w-20 overflow-hidden rounded-full bg-zinc-100 lg:h-24 lg:w-24">
                    <img
                      src={teamImage}
                      alt="Markus Chen"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-[20px] font-bold text-[#111827] lg:text-[28px]">Markus Chen</div>
                    <div className="text-[16px] text-[#6B7280] lg:text-[20px]">CEO & Co-founder</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </Container>
      </Section>

      {/* Team Section */}
      <Section className="bg-[#F9FAFB] py-24 md:py-32 lg:py-48" id="team">
        <Container className="px-6 sm:px-8 lg:px-14 xl:px-20">
          <motion.div
            ref={teamRef}
            variants={list}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
              <div className="max-w-2xl">
                <motion.p variants={item} className="text-[14px] font-bold tracking-[0.2em] text-[#0066FF] uppercase">
                  / Our People /
                </motion.p>
                <motion.h2 variants={item} className="mt-6 text-[44px] font-semibold leading-[1.05] tracking-[-0.06em] text-[#111827] sm:text-[52px] lg:text-[72px]">
                  The experts behind the magic.
                </motion.h2>
              </div>
              <motion.p variants={item} className="max-w-[30ch] text-[18px] leading-relaxed text-[#4B5563] lg:text-[22px]">
                A diverse team of designers, developers, and strategists united by a passion for excellence.
              </motion.p>
            </div>

            <div className="mt-20 grid grid-cols-2 gap-6 sm:gap-8 lg:mt-32 lg:grid-cols-4 lg:gap-10">
              {team.map((person) => (
                <motion.div
                  key={person.id}
                  variants={item}
                  className="group cursor-pointer"
                  onClick={() => window.location.href = `/team/${person.id}`}
                >
                  <div className="aspect-[4/5] overflow-hidden rounded-[2rem] bg-zinc-200 lg:rounded-[3rem] shadow-sm transition-shadow hover:shadow-2xl">
                    <img
                      src={person.image}
                      alt={person.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="mt-8">
                    <h3 className="text-[20px] font-bold tracking-tight text-[#111827] lg:text-[28px]">
                      {person.name}
                    </h3>
                    <p className="mt-2 text-[15px] font-medium text-[#6B7280] lg:text-[18px]">
                      {person.role}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </Container>
      </Section>

      <CtaSection />
      <Footer />
    </>
  );
}
