import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { getApiUrl } from "@/utils/api";

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

export function Services() {
  const ref = useRef(null);
  const [activeService, setActiveService] = useState<string | null>(null);
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    const apiUrl = getApiUrl();
    fetch(`${apiUrl}/services`)
      .then((res) => res.json())
      .then((data) => {
        setServices(data);
      })
      .catch((err) => console.error("Error fetching services:", err));
  }, []);

  if (services.length === 0) return null;

  return (
    <Section id="services" className="bg-white">
      <Container>
        <motion.div
          ref={ref}
          variants={list}
          initial="hidden"
          animate="show"
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <motion.p
              variants={item}
              className="max-w-3xl text-[28px] font-bold leading-[1.05] tracking-[-1.2px] text-[#1A1A1A] sm:text-[34px] md:text-[40px]"
            >
              This is how we help ambitious companies succeed.
            </motion.p>

            <motion.div variants={item}>
              <Link
                to="/services"
                className="inline-flex h-12 shrink-0 items-center justify-center rounded-full bg-[#0066FF] px-6 text-[14px] font-bold tracking-[-0.2px] text-white transition-colors hover:bg-[#0057D6] md:h-14 md:px-8"
              >
                View all services
              </Link>
            </motion.div>
          </div>

          <div className="mt-10 space-y-0 md:mt-12">
            {services.map((service) => {
              const isActive = activeService === service.number;
              return (
                <motion.div
                  key={service.number}
                  variants={item}
                  className={`border-b border-[#E0E0E0] overflow-hidden md:overflow-visible ${isActive ? "bg-[#0066FF] rounded-2xl border-transparent" : "bg-white"
                    }`}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setActiveService((prev) => (prev === service.number ? null : service.number))
                    }
                    className={`group relative flex w-full items-center gap-6 px-6 py-6 text-left md:gap-8 md:px-8 md:py-7 md:transition-[padding] md:duration-200 md:ease-out md:hover:px-[30px] ${isActive ? "px-6 md:px-8" : ""
                      }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`absolute inset-y-2 left-0 right-0 rounded-2xl bg-[#0066FF] opacity-0 transition-[opacity,left,right] duration-200 ease-out group-hover:opacity-100 group-hover:left-8 group-hover:right-8 md:group-hover:left-10 md:group-hover:right-10 hidden md:block ${isActive ? "md:opacity-100 md:left-8 md:right-8 md:left-10 md:right-10" : ""
                        }`}
                    />
                    <span
                      className={`relative z-10 text-[18px] md:text-[22px] font-medium text-[#1A1A1A] group-hover:text-white transition-colors duration-200 ${isActive ? "text-white" : ""
                        }`}
                    >
                      {service.number}
                    </span>
                    <h3
                      className={`relative z-10 flex-1 text-[28px] font-semibold tracking-[-1px] text-[#1A1A1A] transition-[letter-spacing,color] duration-200 group-hover:tracking-[-2.2px] group-hover:text-white sm:text-[32px] md:text-[44px] md:tracking-[-2.2px] lg:text-[52px] ${isActive ? "md:tracking-[-2.2px] text-white" : ""
                        }`}
                    >
                      {service.title}
                    </h3>

                    {/* Desktop description - visible on active or hover */}
                    <p
                      className={`relative z-10 hidden max-w-2xl text-[16px] md:text-[18px] lg:text-[19px] leading-relaxed text-white/90 transition-opacity duration-200 md:block ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                        }`}
                    >
                      {service.description}
                    </p>

                    <span
                      className={`relative z-10 shrink-0 text-[32px] md:text-[36px] lg:text-[40px] font-light text-[#1A1A1A] transition-[transform,color] duration-200 group-hover:rotate-45 group-hover:text-white ${isActive ? "rotate-45 text-white" : ""
                        }`}
                    >
                      +
                    </span>
                  </button>

                  {/* Expandable description for mobile */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-out ${isActive ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
                      }`}
                  >
                    <p className="px-6 pb-6 pt-2 text-[16px] leading-relaxed text-white/90 md:hidden">
                      {service.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </Container>
    </Section>
  );
}
