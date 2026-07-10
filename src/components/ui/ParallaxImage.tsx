import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface ParallaxImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  containerClassName?: string;
  offset?: number;
}

export function ParallaxImage({
  containerClassName = "",
  className = "",
  offset = 30,
  ...props
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  // The previous slowness was caused by CSS transitions fighting the scroll
  // Now we can use a more natural multiplier since it instantly reacts
  const travel = offset * 2.5;
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [-travel, travel]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${containerClassName}`}>
      <motion.div
        className="absolute left-0 w-full"
        style={{ 
            y, 
            top: `-${travel}px`,
            height: `calc(100% + ${travel * 2}px)`,
            willChange: "transform" 
        }}
      >
        <img
          {...props}
          className={`w-full h-full object-cover ${className}`}
        />
      </motion.div>
    </div>
  );
}
