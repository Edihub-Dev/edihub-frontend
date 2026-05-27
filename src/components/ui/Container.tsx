import { type ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "main";
}

export function Container({ children, className = "", as: Tag = "div" }: ContainerProps) {
  return (
    <Tag className={`mx-auto w-full max-w-[1200px] px-6 sm:px-10 lg:px-12 ${className}`}>
      {children}
    </Tag>
  );
}
