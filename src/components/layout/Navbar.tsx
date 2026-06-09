import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { BiMenuAltRight } from "react-icons/bi";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import logoSrc from "@/assets/edihubBLCK.webp";

export function Navbar() {
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const lastYRef = useRef(0);
  const hiddenRef = useRef(false);
  const accRef = useRef(0);
  const lastDirRef = useRef<0 | 1 | -1>(0);

  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (menuOpen) return;
    const last = lastYRef.current;
    lastYRef.current = latest;

    const delta = latest - last;
    const MIN_DELTA = 2;
    const TOGGLE_THRESHOLD = 12;

    if (latest < 10) {
      accRef.current = 0;
      lastDirRef.current = 0;
      if (hiddenRef.current) {
        hiddenRef.current = false;
        setHidden(false);
      }
      return;
    }

    if (Math.abs(delta) < MIN_DELTA) return;

    const dir: 1 | -1 = delta > 0 ? 1 : -1;
    if (dir !== lastDirRef.current) {
      accRef.current = 0;
      lastDirRef.current = dir;
    }

    accRef.current += Math.abs(delta);
    if (accRef.current < TOGGLE_THRESHOLD) return;
    accRef.current = 0;

    if (dir === 1 && !hiddenRef.current) {
      hiddenRef.current = true;
      setHidden(true);
    } else if (dir === -1 && hiddenRef.current) {
      hiddenRef.current = false;
      setHidden(false);
    }
  });

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-[3000] border-b border-zinc-200/80 bg-white/50 backdrop-blur-sm"
        animate={hidden && !menuOpen ? { y: "-110%" } : { y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
          <nav className="flex h-20 items-center justify-between md:h-[6rem]">
            <Link
              to="/"
              className="inline-flex items-center transition-opacity hover:opacity-80"
              aria-label="Home"
            >
              <img src={logoSrc} alt="" className="h-20 w-auto md:h-22" />
            </Link>

            <motion.button
              type="button"
              className="relative z-[3001] flex h-20 w-20 items-center justify-center rounded-full text-black transition-colors hover:bg-zinc-100"
              aria-label="Open menu"
              onClick={() => setMenuOpen(true)}
            >
              <BiMenuAltRight className="h-15 w-15" />
            </motion.button>
          </nav>
        </div>
      </motion.header>

      <AnimatePresence>
        {menuOpen ? (
          <div className="fixed inset-0 z-[3100]">
            <motion.button
              type="button"
              aria-label="Close menu"
              className="absolute inset-0 bg-black/50"
              onClick={() => setMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            />

            <motion.aside
              role="dialog"
              aria-modal="true"
              className="absolute right-0 top-0 h-full w-[78vw] max-w-[720px] bg-[#0052FF] text-white overflow-y-auto"
              variants={{
                open: {
                  x: 0,
                  transition: { type: "tween", duration: 0.6, ease: "easeOut" },
                },
                closed: {
                  x: "100%",
                  transition: { type: "tween", duration: 0.6, ease: "easeIn" },
                },
              }}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <div className="flex min-h-full flex-col px-12 pb-12 pt-12 justify-between">
                <div className="flex items-start justify-between shrink-0">
                  <div className="h-10 w-10" />
                  <button
                    type="button"
                    className="inline-flex h-16 w-16 items-center justify-center text-white/90 transition-opacity hover:opacity-80"
                    onClick={() => setMenuOpen(false)}
                    aria-label="Close"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-12 w-12">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
                    </svg>
                  </button>
                </div>

                <nav className="mt-8 sm:mt-14 mb-10 shrink-0">
                  <ul className="space-y-2 sm:space-y-4 text-[34px] sm:text-[48px] md:text-[52px] lg:text-[56px] font-semibold leading-[1.02] tracking-[-0.05em]">
                    <li>
                      <Link
                        to="/"
                        className="block pl-0 transition-all duration-200 ease-out hover:pl-6 hover:opacity-80"
                        onClick={() => setMenuOpen(false)}
                      >
                        Home
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/about"
                        className="block pl-0 transition-all duration-200 ease-out hover:pl-6 hover:opacity-80"
                        onClick={() => setMenuOpen(false)}
                      >
                        About
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/services"
                        className="block pl-0 transition-all duration-200 ease-out hover:pl-6 hover:opacity-80"
                        onClick={() => setMenuOpen(false)}
                      >
                        Services
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/projects"
                        className="block pl-0 transition-all duration-200 ease-out hover:pl-6 hover:opacity-80"
                        onClick={() => setMenuOpen(false)}
                      >
                        Projects
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/blog"
                        className="block pl-0 transition-all duration-200 ease-out hover:pl-6 hover:opacity-80"
                        onClick={() => setMenuOpen(false)}
                      >
                        Blog
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/contact"
                        className="block pl-0 transition-all duration-200 ease-out hover:pl-6 hover:opacity-80"
                        onClick={() => setMenuOpen(false)}
                      >
                        Contact
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/career"
                        className="block pl-0 transition-all duration-200 ease-out hover:pl-6 hover:opacity-80"
                        onClick={() => setMenuOpen(false)}
                      >
                        Career
                      </Link>
                    </li>
                  </ul>
                </nav>

                <div className="grid grid-cols-2 gap-x-10 gap-y-4 text-white/90 mt-auto pt-8 border-t border-white/10 shrink-0">
                  <div className="flex flex-col gap-1">
                    <a href="#" className="text-[16px] sm:text-[20px] md:text-[24px] transition-opacity hover:opacity-80" onClick={() => setMenuOpen(false)}>
                      Facebook
                    </a>
                  </div>
                  <div className="flex flex-col gap-1">
                    <a href="#" className="text-[16px] sm:text-[20px] md:text-[24px] transition-opacity hover:opacity-80" onClick={() => setMenuOpen(false)}>
                      Instagram
                    </a>
                  </div>
                  <div className="flex flex-col gap-1">
                    <a href="#" className="text-[16px] sm:text-[20px] md:text-[24px] transition-opacity hover:opacity-80" onClick={() => setMenuOpen(false)}>
                      Dribbble
                    </a>
                  </div>
                  <div className="flex flex-col gap-1">
                    <a href="#" className="text-[16px] sm:text-[20px] md:text-[24px] transition-opacity hover:opacity-80" onClick={() => setMenuOpen(false)}>
                      Behance
                    </a>
                  </div>
                  <div className="flex flex-col gap-1">
                    <a href="#" className="text-[14px] sm:text-[16px] md:text-[18px] transition-opacity hover:opacity-80" onClick={() => setMenuOpen(false)}>
                      Privacy Policy
                    </a>
                  </div>
                  <div className="flex flex-col gap-1">
                    <a href="#" className="text-[14px] sm:text-[16px] md:text-[18px] transition-opacity hover:opacity-80" onClick={() => setMenuOpen(false)}>
                      Terms of Service
                    </a>
                  </div>
                </div>
              </div>
            </motion.aside>
          </div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
