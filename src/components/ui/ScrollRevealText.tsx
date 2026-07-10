import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface ScrollRevealTextProps {
  text: string;
  className?: string;
  as?: React.ElementType;
}

export function ScrollRevealText({
  text,
  className = "",
  as: Component = "h2",
}: ScrollRevealTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track the scroll position relative to the container element
  const { scrollYProgress } = useScroll({
    target: containerRef,
    // Start revealing when the element's top reaches 90% of viewport
    // Finish revealing when the element's top reaches 40% of viewport
    offset: ["start 90%", "start 40%"],
  });

  const words = text.split(" ");

  return (
    <Component ref={containerRef} className={`${className} flex flex-wrap`}>
      {words.map((word, i) => {
        // Calculate start and end progress for each word
        // so they reveal sequentially
        const start = i / words.length;
        const end = start + 1 / words.length;
        
        // Map the overall scroll progress to the individual word's opacity
        const opacity = useTransform(scrollYProgress, [start, end], [0.2, 1]);

        return (
          <motion.span
            key={i}
            style={{ opacity }}
            className="mr-[0.25em] inline-block"
          >
            {word}
          </motion.span>
        );
      })}
    </Component>
  );
}
