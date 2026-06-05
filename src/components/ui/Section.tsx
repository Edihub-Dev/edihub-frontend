import { type ReactNode, type Ref } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  ref?: Ref<HTMLElement>;
}

export function Section({ children, className = "", id, ref }: SectionProps) {
  return (
    <section ref={ref} id={id} className={`py-16 md:py-20 lg:py-24 xl:py-28 ${className}`}>
      {children}
    </section>
  );
}
