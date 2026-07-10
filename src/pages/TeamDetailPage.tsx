import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { team } from "@/data/team";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Footer } from "@/components/layout/Footer";
import { CtaSection } from "@/components/sections/CtaSection";
import { useEffect } from "react";
import { ParallaxImage } from "@/components/ui/ParallaxImage";
import { ScrollRevealText } from "@/components/ui/ScrollRevealText";

export function TeamDetailPage() {
  const { id } = useParams();
  const person = team.find((p) => p.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!person) {
    return (
      <Section className="flex min-h-screen items-center justify-center bg-white">
        <Container className="text-center">
          <h1 className="text-4xl font-bold">Person not found</h1>
          <Link to="/about" className="mt-4 inline-block text-blue-600 hover:underline">
            Back to About
          </Link>
        </Container>
      </Section>
    );
  }

  return (
    <div className="bg-white pt-24 md:pt-32">
      <Section>
        <Container className="px-6 sm:px-8 lg:px-14 xl:px-20">
          <Link
            to="/about"
            className="group mb-12 inline-flex items-center gap-2 text-sm font-medium text-[#6B7280] transition-colors hover:text-[#111827]"
          >
            <svg
              className="h-4 w-4 transition-transform group-hover:-translate-x-1"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Team
          </Link>

          <div className="grid gap-12 lg:grid-cols-2 lg:gap-24">
            {/* Left: Image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <ParallaxImage
                src={person.image}
                alt={person.name}
                containerClassName="aspect-[4/5] rounded-[2rem] bg-zinc-100 lg:rounded-[3rem] shadow-xl"
                offset={25}
              />
            </motion.div>

            {/* Right: Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
              className="flex flex-col"
            >
              <div className="border-b border-zinc-100 pb-10">
                <ScrollRevealText
                  text={person.name}
                  as="h1"
                  className="text-[42px] font-bold tracking-tight text-[#111827] sm:text-[52px] lg:text-[64px]"
                />
                <p className="mt-4 text-[20px] font-semibold text-[#0066FF] sm:text-[24px]">
                  {person.role}
                </p>
              </div>

              <div className="mt-10 space-y-12">
                {/* About Section */}
                <div>
                  <h3 className="text-[12px] font-bold uppercase tracking-widest text-[#111827]">
                    About
                  </h3>
                  <p className="mt-5 text-[18px] leading-relaxed text-[#4B5563] lg:text-[22px]">
                    {person.bio}
                  </p>
                </div>

                {/* Expertise Section */}
                <div>
                  <h3 className="text-[12px] font-bold uppercase tracking-widest text-[#111827]">
                    Core Expertise
                  </h3>
                  <div className="mt-6 flex flex-wrap gap-3">
                    {person.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-[#F3F4F6] px-6 py-2 text-[15px] font-semibold text-[#111827]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Achievements Section */}
                <div>
                  <h3 className="text-[12px] font-bold uppercase tracking-widest text-[#111827]">
                    Key Achievements
                  </h3>
                  <ul className="mt-6 space-y-4">
                    {person.achievements?.map((achievement, index) => (
                      <li key={index} className="flex items-start gap-4 text-[16px] text-[#4B5563] lg:text-[18px]">
                        <span className="mt-2.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#0066FF]" />
                        {achievement}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </Container>
      </Section>

      {/* Related Team Members */}
      <Section className="border-t border-zinc-100 bg-[#F9FAFB] py-24 lg:py-32">
        <Container className="px-6 sm:px-8 lg:px-14 xl:px-20">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-[32px] font-bold tracking-tight text-[#111827] lg:text-[42px]">
                More from our team
              </h2>
              <p className="mt-4 text-[16px] text-[#6B7280] lg:text-[18px]">
                Meet the other experts behind our success.
              </p>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-4">
            {team
              .filter((p) => p.id !== person.id)
              .slice(0, 4)
              .map((otherPerson) => (
                <Link
                  key={otherPerson.id}
                  to={`/team/${otherPerson.id}`}
                  className="group flex flex-col"
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                >
                  <ParallaxImage
                    src={otherPerson.image}
                    alt={otherPerson.name}
                    containerClassName="aspect-[4/5] rounded-2xl bg-white lg:rounded-3xl shadow-sm transition-shadow hover:shadow-xl"
                    className="transition-transform duration-500 group-hover:scale-110"
                    offset={25}
                  />
                  <div className="mt-6">
                    <h4 className="text-[18px] font-bold text-[#111827] lg:text-[22px]">
                      {otherPerson.name}
                    </h4>
                    <p className="mt-1 text-[14px] font-medium text-[#6B7280] lg:text-[16px]">
                      {otherPerson.role}
                    </p>
                  </div>
                </Link>
              ))}
          </div>
        </Container>
      </Section>

      <CtaSection />
      <Footer />
    </div>
  );
}
