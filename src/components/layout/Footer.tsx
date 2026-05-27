import { Container } from "@/components/ui/Container";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-black py-20 text-white lg:py-32">
      <Container className="px-6 sm:px-8 lg:px-14 xl:px-20">
        <div className="flex flex-col justify-between gap-16 lg:flex-row lg:items-start lg:gap-24">
          
          {/* Left Side: Brand & Description */}
          <div className="max-w-md lg:max-w-xl">
            <h2 className="text-[48px] font-bold tracking-tight text-white lg:text-[64px]">
              EDIHUB
            </h2>
            <p className="mt-8 text-[18px] leading-relaxed text-[#9CA3AF] lg:text-[22px]">
              We help businesses succeed in the digital space by creating thoughtful solutions that combine smart design, reliable technology, and a deep understanding of what your users really need.
            </p>
          </div>

          {/* Right Side: Email */}
          <div className="flex flex-col lg:items-end lg:text-right">
            <p className="text-[14px] font-bold uppercase tracking-widest text-[#9CA3AF]">
              You can also email us at:
            </p>
            <a 
              href="mailto:contact@edihub.com" 
              className="mt-4 text-[28px] font-medium text-white transition-opacity hover:opacity-80 sm:text-[36px] lg:text-[48px]"
            >
              contact@edihub.com
            </a>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-24 flex flex-col items-start justify-between gap-12 border-t border-zinc-800 pt-12 md:flex-row md:items-center lg:mt-32">
          
          {/* Social Links */}
          <div className="flex flex-wrap gap-x-8 gap-y-4">
            {["Facebook", "Instagram", "Dribbble", "Behance"].map((social) => (
              <a 
                key={social}
                href="#" 
                className="text-[14px] font-bold uppercase tracking-widest text-[#9CA3AF] transition-colors hover:text-white"
              >
                {social}
              </a>
            ))}
          </div>

          {/* Site Links */}
          <nav className="flex flex-wrap gap-x-8 gap-y-4">
            {[
              { name: "Home", path: "/" },
              { name: "Projects", path: "/projects" },
              { name: "Blog", path: "/blog" },
              { name: "About Us", path: "/about" },
              { name: "Contact", path: "/contact" },
            ].map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-[14px] font-bold uppercase tracking-widest text-[#9CA3AF] transition-colors hover:text-white"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Copyright */}
        <div className="mt-16 text-[12px] font-medium text-[#4B5563]">
          @2025 EDIHUB, All Rights Reserved
        </div>
      </Container>
    </footer>
  );
}
