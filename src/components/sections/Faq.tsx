import { useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useRef } from "react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Link } from "react-router-dom";
import { ServiceLabel } from "@/components/services/ServiceUi";

const faqs = [
  {
    question: "What types of projects do you typically work on?",
    answer:
      "We specialize in digital solutions including website development, web applications, e-commerce platforms, and enterprise software integrations. Our expertise spans diverse industries, delivering strategic technological solutions tailored to unique business challenges.",
  },
  {
    question: "How long does a typical project take?",
    answer:
      "Project timelines range from 4-6 weeks for small websites to 16-24 weeks for complex enterprise integrations. Each project is carefully scoped to balance efficiency with comprehensive development requirements.",
  },
  {
    question: "What's your development process like?",
    answer:
      "We support imports of vendor data, team budgets, historical expenses, and departmental codes. You can also connect directly to your ERP or finance tools to sync this data automatically. Our team is available to assist with imports during onboarding.",
  },
  {
    question: "Do you provide ongoing support after launch?",
    answer:
      "We offer 30-day post-launch support and optional maintenance packages that include performance monitoring, security updates, and technical assistance. Clients can choose from flexible support contracts to meet their long-term technological needs.",
  },
  {
    question: "Can you work with our existing systems and team?",
    answer:
      "We conduct comprehensive system audits to ensure seamless integration with your current technology stack and organizational workflow. Our team provides flexible collaboration models, knowledge transfer, and transparent communication to minimize disruption.",
  },
];

export type FaqItem = {
  question: string;
  answer: string;
};

interface FaqProps {
  items?: FaqItem[];
  title?: string;
  label?: string;
}

export function Faq({ items, title = "Common Qs", label }: FaqProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const displayFaqs = items || faqs;

  return (
    <Section id="faq" className="bg-white">
      <Container>
        <div ref={ref} className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            {label && (
              <div className="mb-4">
                <ServiceLabel>{label}</ServiceLabel>
              </div>
            )}
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4 }}
              className="text-6xl font-bold tracking-tight text-[#1A1A1A] sm:text-7xl"
            >
              {title}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="mt-6 max-w-2xl text-[18px] leading-relaxed text-[#666666] sm:text-[20px]"
            >
              Get quick answers about working with us and our approach to digital solutions. Can't find what you're looking for? Reach out below!
            </motion.p>
            <Link to="/contact">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="group mt-8 inline-flex items-center gap-2 text-[18px] font-medium text-[#1A1A1A] underline decoration-[#1A1A1A]/60 underline-offset-4 hover:decoration-[#1A1A1A] sm:text-[20px] cursor-pointer"
              >
                Contact us
                <svg className="h-5 w-5 shrink-0 text-[#0066FF] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </motion.div>
            </Link>
          </div>
          <div className="lg:col-span-7">
            <div className="space-y-0 border-t border-[#EFEFEF]">
              {displayFaqs.map((faq, i) => (
                <motion.div
                  key={faq.question}
                  initial={{ opacity: 0, y: 12 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.05 * i }}
                  className="border-b border-[#EFEFEF]"
                >
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-6 py-10 text-left text-[18px] font-medium text-[#1A1A1A] transition-opacity hover:opacity-70 sm:text-[20px]"
                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  >
                    <span>{faq.question}</span>
                    <motion.span
                      animate={{ rotate: openIndex === i ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="shrink-0 text-[#1A1A1A]/70"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </motion.span>
                  </button>
                  <AnimatePresence>
                    {openIndex === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <p className="pb-6 pr-12 text-[16px] leading-relaxed text-[#666666] sm:text-[18px]">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
