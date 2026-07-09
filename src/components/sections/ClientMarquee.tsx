import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

const clientLogos = [
  { name: "", file: "1-5.webp" },
  { name: "", file: "2.webp" },
  { name: "", file: "3-4.webp" },
  { name: "", file: "4.webp" },
  { name: "", file: "5-1.webp" },
  { name: "", file: "6.webp" },
  { name: "", file: "7.webp" },
  { name: "", file: "Asset 3.svg" },
  { name: "", file: "Finux.svg" },
];

export function ClientMarquee() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <Section id="clients" className="bg-white py-0 sm:py-8">
      <Container className="py-1 lg:py-8">
        <div ref={ref}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.4 }}
          >
            <div className="relative flex overflow-hidden">
              <div className="flex items-center gap-16 whitespace-nowrap animate-marquee">
                {[...clientLogos, ...clientLogos].map((logo, i) => (
                  <img
                    key={`${logo.file}-${i}`}
                    src={`/client-logos/${logo.file}`}
                    alt={logo.name}
                    className="h-30 w-30 opacity-70 grayscale invert"
                    loading="lazy"
                    draggable={false}
                  />
                ))}
              </div>

              <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-white to-transparent" />
              <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-white to-transparent" />
            </div>
          </motion.div>
        </div>
      </Container>
    </Section>
  );
}
