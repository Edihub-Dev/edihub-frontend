import { motion, useInView } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import visionImage from "@/assets/vision-image.png";

const ACCENT_BLUE = "#0066FF";

const stats = [
  { value: "12k+", label: "Projects delivered" },
  { value: "95%", label: "Client retention" },
  { value: "$31M", label: "Client revenue impacted" },
];

function parseStatValue(value: string) {
  const trimmed = value.trim();
  const match = trimmed.match(/^([^0-9]*)([0-9]+)([^0-9]*)$/);
  if (match) {
    return {
      prefix: match[1] ?? "",
      digits: match[2] ?? "0",
      suffix: match[3] ?? "",
    };
  }

  const digits = trimmed.replace(/[^0-9]/g, "") || "0";
  return { prefix: "", digits, suffix: "" };
}

function randomDigits(length: number) {
  return Array.from({ length }, () => Math.floor(Math.random() * 10)).join("");
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export function Vision() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const parsedStats = useMemo(() => stats.map((s) => parseStatValue(s.value)), []);
  const [displayStats, setDisplayStats] = useState<string[]>(() =>
    stats.map((s) => s.value)
  );

  const timersRef = useRef<{ timeouts: number[]; intervals: number[] }>({
    timeouts: [],
    intervals: [],
  });

  useEffect(() => {
    if (!inView) return;

    timersRef.current.timeouts.forEach((t) => window.clearTimeout(t));
    timersRef.current.intervals.forEach((i) => window.clearInterval(i));
    timersRef.current = { timeouts: [], intervals: [] };

    setDisplayStats(
      parsedStats.map((p) => `${p.prefix}${randomDigits(p.digits.length)}${p.suffix}`)
    );

    const durationMs = 5000;
    const tickMs = 40;

    parsedStats.forEach((p, statIndex) => {
      const timeoutId = window.setTimeout(() => {
        const start = performance.now();
        const totalDigits = p.digits.length;

        const intervalId = window.setInterval(() => {
          const elapsed = performance.now() - start;
          const progress = Math.min(1, elapsed / durationMs);
          const eased = easeOutCubic(progress);
          const locked = Math.min(totalDigits, Math.floor(eased * (totalDigits + 1)));

          if (progress >= 1) {
            window.clearInterval(intervalId);
            setDisplayStats((prev) => {
              const next = prev.slice();
              next[statIndex] = `${p.prefix}${p.digits}${p.suffix}`;
              return next;
            });
            return;
          }

          const lockedPart = p.digits.slice(0, locked);
          const shufflePart = randomDigits(Math.max(0, totalDigits - locked));

          setDisplayStats((prev) => {
            const next = prev.slice();
            next[statIndex] = `${p.prefix}${lockedPart}${shufflePart}${p.suffix}`;
            return next;
          });
        }, tickMs);

        timersRef.current.intervals.push(intervalId);
      }, 0);

      timersRef.current.timeouts.push(timeoutId);
    });

    return () => {
      timersRef.current.timeouts.forEach((t) => window.clearTimeout(t));
      timersRef.current.intervals.forEach((i) => window.clearInterval(i));
      timersRef.current = { timeouts: [], intervals: [] };
    };
  }, [inView, parsedStats]);

  return (
    <Section id="vision" className="bg-white pt-6 pb-2 sm:py-14">
      <Container className="pt-8 pb-0 lg:py-10">
        <div ref={ref} className="grid gap-12 lg:grid-cols-12 lg:gap-16 lg:translate-y-10">
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              <motion.span
                initial={{ opacity: 0, y: 8 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4 }}
                className="text-[12px] font-black uppercase tracking-[0.2em] text-[#333333]"
              >
                / Our vision
              </motion.span>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="mt-8 overflow-hidden rounded-2xl border border-neutral-100 shadow-2xl lg:mt-12 group cursor-pointer relative"
              whileHover={{ y: -6, scale: 1.01 }}
            >
              {/* Overlay glow */}
              <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10" />
              <motion.img
                src={visionImage}
                alt="Modern digital agency abstract network"
                className="w-full h-[250px] sm:h-[350px] md:h-[400px] lg:h-[450px] object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </motion.div>
          </div>
          <div className="lg:col-span-6">
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="text-[28px] font-semibold leading-tight tracking-[-0.8px] sm:tracking-[-2.00px] text-[#1A1A1A] sm:text-[40px] md:text-[48px] lg:text-[56px] text-balance"
            >
              We’re a digital agency built for the modern internet.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="mt-6 max-w-full text-[14px] leading-[1.45] text-[#666666] sm:text-[22px]"
            >
              From high-impact visuals to intelligent software, we blend creativity, technology, and AI to help brands stand out, scale faster, and stay ahead.
            </motion.p>

            <div className="mt-12 grid grid-cols-3 gap-4 sm:gap-10">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
                  className="min-w-0"
                >
                  <div
                    className="text-[48px] font-semibold whitespace-nowrap md:text-[80px]"
                    style={{ color: ACCENT_BLUE }}
                  >
                    {displayStats[i] ?? stat.value}
                  </div>
                  <div className="mt-1 text-[10px] font-semibold text-[#0c120c99] sm:text-[16px]">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
