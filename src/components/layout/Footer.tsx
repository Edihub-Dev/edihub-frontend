import { Container } from "@/components/ui/Container";
import { Link } from "react-router-dom";
import { FiFacebook, FiInstagram } from "react-icons/fi";
import { FaDribbble, FaBehance } from "react-icons/fa";
import logoSrc from "@/assets/edihubBLCK.webp";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { name: "Facebook", icon: <FiFacebook className="w-5 h-5" />, href: "#" },
    { name: "Instagram", icon: <FiInstagram className="w-5 h-5" />, href: "#" },
    { name: "Dribbble", icon: <FaDribbble className="w-5 h-5" />, href: "#" },
    { name: "Behance", icon: <FaBehance className="w-5 h-5" />, href: "#" },
  ];

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Projects", path: "/projects" },
    { name: "Blog", path: "/blog" },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "Careers", path: "/career" },
  ];

  return (
    <footer className="relative overflow-hidden bg-[#0A0B0F] border-t border-zinc-900/80 pt-16 pb-16 md:py-24 text-white z-[2200]">
      {/* Premium Ambient Background Glows */}
      <div className="pointer-events-none absolute bottom-0 right-0 h-[350px] w-[350px] rounded-full bg-blue-600/[0.03] blur-[100px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-violet-600/[0.03] blur-[100px]" />

      <Container className="relative z-10 px-6 sm:px-8 lg:px-14 xl:px-20">
        <div className="flex flex-col justify-between gap-12 lg:flex-row lg:items-start lg:gap-24">
          
          {/* Left Column: Brand & Logo */}
          <div className="max-w-md lg:max-w-xl space-y-6">
            <Link to="/" className="relative inline-block transition-opacity hover:opacity-90 select-none group">
              {/* Base: Inverted logo to make text white */}
              <img 
                src={logoSrc} 
                alt="EDIHUB" 
                className="h-22 sm:h-28 w-auto brightness-0 invert opacity-95" 
              />
              {/* Overlay: Clipped to icon area only, un-inverted to keep blue background */}
              <img 
                src={logoSrc} 
                alt="" 
                className="absolute inset-0 h-full w-auto pointer-events-none" 
                style={{ clipPath: "inset(0% 78% 45% 0%)" }}
              />
            </Link>
            <p className="text-[16px] sm:text-[17px] leading-relaxed text-zinc-400 font-medium">
              We help businesses succeed in the digital space by creating thoughtful solutions that combine smart design, reliable technology, and a deep understanding of what your users really need.
            </p>
          </div>

          {/* Right Column: Contact Inquiry */}
          <div className="flex flex-col lg:items-end lg:text-right space-y-2.5">
            <p className="text-[12px] font-bold uppercase tracking-widest text-zinc-500">
              You can also email us at:
            </p>
            <a 
              href="mailto:contact@edihub.com" 
              className="relative text-[22px] sm:text-[32px] md:text-[38px] lg:text-[44px] font-bold tracking-tight text-white transition-colors duration-300 hover:text-blue-500 block group"
            >
              contact@edihub.com
              <span className="absolute bottom-0 left-0 lg:left-auto lg:right-0 w-0 h-[2px] bg-blue-500 transition-all duration-300 group-hover:w-full" />
            </a>
          </div>
        </div>

        {/* Divider Line */}
        <div className="mt-16 sm:mt-20 border-t border-zinc-800/80" />

        {/* Bottom Section: Socials + Navigation */}
        <div className="mt-10 grid grid-cols-1 gap-8 md:flex md:items-start md:justify-between md:gap-0">
          
          {/* Social Links Row */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500 shrink-0">Connect</h4>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  aria-label={social.name}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900/40 text-zinc-400 transition-all duration-300 hover:border-blue-500 hover:bg-blue-500 hover:text-white"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Links Column */}
          <div className="space-y-4">
            <h4 className="text-[13px] font-black uppercase tracking-[0.2em] text-zinc-400">Navigation</h4>
            <div className="grid grid-cols-2 gap-x-16 sm:gap-x-24 gap-y-4">
              {/* Left col of navigation (3 items) */}
              <div className="flex flex-col gap-4">
                {navLinks.slice(0, 3).map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className="text-[16px] sm:text-[17px] font-bold text-zinc-400 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
              {/* Right col of navigation (3 items) */}
              <div className="flex flex-col gap-4">
                {navLinks.slice(3, 6).map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className="text-[16px] sm:text-[17px] font-bold text-zinc-400 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 text-center text-[13px] font-medium text-zinc-500">
          &copy; {currentYear} EDIHUB. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}
