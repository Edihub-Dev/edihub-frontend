import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CtaSection } from "@/components/sections/CtaSection";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { getApiUrl } from "@/utils/api";
import { defaultCareers } from "@/data/careers";
import type { Career } from "@/data/careers";

import {
  FiGlobe,
  FiHeart,
  FiTrendingUp,
  FiCalendar,
  FiUsers,
  FiArrowUpRight,
  FiChevronDown,
  FiCode,
  FiLayout,
  FiLayers,
  FiTarget,
  FiCpu,
  FiEdit3,
  FiSearch
} from "react-icons/fi";

import teamImage from "@/assets/team.webp";
import statsImage from "@/assets/stats.webp";
import heroImage from "@/assets/hero-image.webp";
import pexels1 from "@/assets/projects/pexels-1.webp";
import pexels2 from "@/assets/projects/pexels-2.webp";
import pexels3 from "@/assets/projects/pexels-3.webp";

// Map key string to React icon
const getJobIcon = (iconName: string) => {
  switch (iconName) {
    case "ui":
      return <FiLayout className="w-5 h-5 text-blue-600" />;
    case "code":
      return <FiCode className="w-5 h-5 text-blue-600" />;
    case "brand":
      return <FiLayers className="w-5 h-5 text-blue-600" />;
    case "marketing":
      return <FiTarget className="w-5 h-5 text-blue-600" />;
    case "operations":
      return <FiCpu className="w-5 h-5 text-blue-600" />;
    case "writer":
    default:
      return <FiEdit3 className="w-5 h-5 text-blue-600" />;
  }
};




const listVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export function CareersPage() {
  const [careers, setCareers] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [activeDept, setActiveDept] = useState("All Departments");
  const [activeLoc, setActiveLoc] = useState("All Locations");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLocDropdownOpen, setIsLocDropdownOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const positionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const apiUrl = getApiUrl();
    fetch(`${apiUrl}/careers`)
      .then((res) => {
        if (!res.ok) throw new Error("API failed");
        return res.json();
      })
      .then((data: Career[]) => {
        setCareers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.warn("Fallback to static defaultCareers due to:", err.message);
        setCareers(defaultCareers);
        setLoading(false);
      });

    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!loading) {
      const globalWindow = window as any;
      if (globalWindow.lenis) {
        globalWindow.lenis.scrollTo(0, { immediate: true });
      } else {
        window.scrollTo(0, 0);
      }
    }
  }, [loading]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCardIndex((prev) => (prev + 1) % 3);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Extract unique locations dynamically
  const uniqueLocations = ["All Locations", ...Array.from(new Set(careers.map((c) => c.location)))];

  // Filter careers
  const filteredCareers = careers.filter((job) => {
    const matchesDept = activeDept === "All Departments" || job.department.toLowerCase() === activeDept.toLowerCase();
    const matchesLoc = activeLoc === "All Locations" || job.location.toLowerCase() === activeLoc.toLowerCase();
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesLoc && matchesSearch;
  });

  const handleScrollToPositions = (e: React.MouseEvent) => {
    e.preventDefault();
    positionsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const cardVariants = {
    front: { zIndex: 30, opacity: 1, rotateY: -8, rotateX: 4, z: 0, x: 0, y: 5, scale: isMobile ? 0.8 : 1.02 },
    right: { zIndex: 10, opacity: 0.95, rotateY: -10, rotateX: 5, z: 0, x: isMobile ? 35 : 100, y: isMobile ? -10 : -25, rotate: 6, scale: isMobile ? 0.75 : 0.95 },
    left: { zIndex: 20, opacity: 0.95, rotateY: -10, rotateX: 5, z: 0, x: isMobile ? -35 : -100, y: isMobile ? 10 : 20, rotate: -6, scale: isMobile ? 0.75 : 0.95 }
  };

  const getCardAnimateState = (cardIdx: number) => {
    const rel = (cardIdx - activeCardIndex + 3) % 3;
    if (rel === 0) return "front";
    if (rel === 1) return "right";
    return "left";
  };

  return (
    <div className="bg-white text-zinc-900 min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <Section className="pt-32 md:pt-44 pb-8 md:pb-12 lg:pb-16 overflow-hidden">
        <Container className="px-6 sm:px-8 lg:px-14 xl:px-20">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left Info Column */}
            <div className="lg:col-span-6 space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-xs font-bold tracking-wider text-blue-600 uppercase"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                Careers at Edihub
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-[-0.05em] leading-[0.95] text-zinc-950"
              >
                Build the future <br />with us.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg md:text-xl text-zinc-500 leading-relaxed max-w-lg"
              >
                We're a team of strategists, designers, and builders working together to create digital experiences that make an impact.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex gap-2.5 sm:gap-4 pt-4"
              >
                <a
                  href="#positions"
                  onClick={handleScrollToPositions}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3 sm:px-8 py-4 bg-zinc-950 hover:bg-zinc-850 text-white rounded-2xl text-[12px] sm:text-[15px] font-bold transition-all shadow-lg shadow-zinc-950/10 cursor-pointer active:scale-98 text-center"
                >
                  <span className="truncate">View Open Positions</span>
                  <FiArrowUpRight className="w-4 h-4 shrink-0" />
                </a>
                <a
                  href="#why-join"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById("why-join")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3 sm:px-8 py-4 bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-800 rounded-2xl text-[12px] sm:text-[15px] font-bold transition-all cursor-pointer active:scale-98 text-center"
                >
                  <span className="truncate">Life at Edihub</span>
                  <FiArrowUpRight className="w-4 h-4 shrink-0" />
                </a>
              </motion.div>
            </div>

            {/* Right fanned out cards */}
            <div className="lg:col-span-6 relative h-[320px] sm:h-[400px] md:h-[450px] w-full flex items-center justify-center">
              {/* Blur Glowing Background */}
              <div className="absolute w-[350px] h-[350px] rounded-full bg-blue-400/20 blur-[100px] pointer-events-none" />

              <div
                className="relative w-full max-w-[420px] h-full select-none"
                style={{ perspective: 1200 }}
              >
                {/* 3D stacked cards (fanned out statically and cycling automatically) */}
                {/* Back card (Design Team - Tilted Left) */}
                <motion.div
                  variants={cardVariants}
                  animate={getCardAnimateState(2)}
                  transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
                  onClick={handleScrollToPositions}
                  className="absolute inset-0 bg-white border border-zinc-200 rounded-3xl p-4 sm:p-6 shadow-xl flex flex-col justify-between cursor-pointer"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] sm:text-[13px] font-black text-zinc-400 uppercase tracking-widest">Design Team</span>
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-zinc-50 border border-zinc-200 flex items-center justify-center font-bold text-zinc-400 text-[11px] sm:text-[13px]">03</div>
                  </div>

                  <div className="my-2 sm:my-3 h-[110px] sm:h-[150px] md:h-[180px] rounded-2xl overflow-hidden bg-zinc-50 border border-zinc-150 relative">
                    <img src={pexels3} alt="Design" className="w-full h-full object-cover" />
                  </div>

                  <div className="text-[16px] sm:text-[22px] font-bold text-zinc-900 leading-tight">Design & Creative</div>
                </motion.div>

                {/* Middle card (Dev Team - Tilted Right) */}
                <motion.div
                  variants={cardVariants}
                  animate={getCardAnimateState(1)}
                  transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
                  onClick={handleScrollToPositions}
                  className="absolute inset-0 bg-white border border-zinc-200 rounded-3xl p-4 sm:p-6 shadow-xl flex flex-col justify-between cursor-pointer"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] sm:text-[13px] font-black text-zinc-400 uppercase tracking-widest">Dev Team</span>
                    <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-zinc-50 border border-zinc-200 flex items-center justify-center font-bold text-zinc-400 text-[11px] sm:text-[13px]">02</div>
                  </div>

                  <div className="my-2 sm:my-3 h-[110px] sm:h-[150px] md:h-[180px] rounded-2xl overflow-hidden bg-zinc-50 border border-zinc-150 relative">
                    <img src={pexels2} alt="Development" className="w-full h-full object-cover" />
                  </div>

                  <div className="text-[16px] sm:text-[22px] font-bold text-zinc-900 leading-tight">Tech & Development</div>
                </motion.div>

                {/* Front card (We're Hiring - Center) */}
                <motion.div
                  variants={cardVariants}
                  animate={getCardAnimateState(0)}
                  transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
                  onClick={handleScrollToPositions}
                  className="absolute inset-0 bg-white border border-zinc-200 rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col justify-between cursor-pointer"
                  style={{ transformStyle: "preserve-3d", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.08)" }}
                >
                  <div className="flex justify-between items-start">
                    <div className="px-2 sm:px-3 py-0.5 sm:py-1 bg-blue-50 border border-blue-100 rounded-full text-[11px] sm:text-[13px] font-black text-blue-600 uppercase tracking-widest">
                      We're Hiring
                    </div>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-blue-600/10 flex items-center justify-center font-extrabold text-blue-600 text-[11px] sm:text-[13px]">01</div>
                  </div>

                  <div className="my-2 sm:my-3 h-[110px] sm:h-[150px] md:h-[180px] rounded-2xl overflow-hidden bg-zinc-50 border border-zinc-150 relative">
                    <img src={heroImage} alt="Hiring" className="w-full h-full object-cover" />
                  </div>

                  <div className="space-y-2 sm:space-y-3">
                    <p className="text-[16px] sm:text-[22px] font-bold tracking-tight text-zinc-900 leading-tight">
                      We're hiring creative minds and problem solvers.
                    </p>
                    <div className="w-full h-1 bg-blue-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "70%" }}
                        transition={{ duration: 1.5, delay: 0.8 }}
                        className="h-full bg-blue-600 rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Filter and Job List Section */}
      <Section id="positions" ref={positionsRef} className="bg-[#F8F8FA] border-t border-zinc-100 pt-10 md:pt-16 lg:pt-20 pb-20 md:pb-28">
        <Container className="px-6 sm:px-8 lg:px-14 xl:px-20">

          {/* Section header â€” 2-col with stats on right */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-14">
            <div>
              <span className="inline-flex items-center gap-2 text-[12px] font-black tracking-[0.18em] text-blue-600 uppercase mb-4">
                <span className="h-[2px] w-6 bg-blue-600 rounded-full inline-block" />
                Open Positions
              </span>
              <h2 className="text-[40px] sm:text-[52px] md:text-[64px] font-extrabold tracking-[-0.04em] leading-[1.05] text-zinc-950">
                Find your next<br />opportunity.
              </h2>
              <p className="mt-5 text-[17px] leading-relaxed text-zinc-500 max-w-[45ch]">
                Join a remote-first team that values creativity, ownership, and continuous growth.
              </p>
            </div>

            {/* Live stats */}
            <div className="flex gap-8 shrink-0">
              <div className="text-center">
                <div className="text-[40px] font-extrabold tracking-tight text-zinc-950">{careers.length}</div>
                <div className="text-[12px] font-bold uppercase tracking-widest text-zinc-400 mt-1">Open Roles</div>
              </div>
              <div className="w-[1px] bg-zinc-200" />
              <div className="text-center">
                <div className="text-[40px] font-extrabold tracking-tight text-zinc-950">100%</div>
                <div className="text-[12px] font-bold uppercase tracking-widest text-zinc-400 mt-1">Remote</div>
              </div>
              <div className="w-[1px] bg-zinc-200" />
              <div className="text-center">
                <div className="text-[40px] font-extrabold tracking-tight text-zinc-950">5</div>
                <div className="text-[12px] font-bold uppercase tracking-widest text-zinc-400 mt-1">Teams</div>
              </div>
            </div>
          </div>

          {/* Filtering Tools Bar */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-3 flex flex-col lg:flex-row gap-3 items-stretch lg:items-center mb-8 shadow-sm">
            {/* Search Input */}
            <div className="relative flex-1">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by role, skill, or keyword..."
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3.5 pl-12 pr-4 text-[15px] font-medium focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all text-zinc-800 placeholder:text-zinc-400"
              />
            </div>

            {/* Divider */}
            <div className="hidden lg:block w-[1px] h-10 bg-zinc-200 self-center" />

            {/* Department Tabs */}
            <div className="flex gap-1 overflow-x-auto flex-wrap">
              {["All Departments", "Design", "Development", "Marketing", "Operations"].map((dept) => (
                <button
                  key={dept}
                  onClick={() => {
                    setActiveDept(dept);
                    setVisibleCount(6);
                  }}
                  className={`px-4 py-2.5 rounded-xl text-[13px] font-bold whitespace-nowrap transition-all cursor-pointer ${activeDept === dept
                      ? "bg-zinc-950 text-white shadow-sm"
                      : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
                    }`}
                >
                  {dept}
                </button>
              ))}
            </div>

            {/* Divider */}
            <div className="hidden lg:block w-[1px] h-10 bg-zinc-200 self-center" />

            {/* Location Selector Dropdown */}
            <div className="relative shrink-0">
              <button
                onClick={() => setIsLocDropdownOpen(!isLocDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2.5 bg-zinc-50 border border-zinc-200 hover:bg-white rounded-xl text-[13px] font-bold text-zinc-800 transition-all cursor-pointer w-full lg:w-auto"
              >
                <FiGlobe className="w-4 h-4 text-zinc-400" />
                {activeLoc}
                <FiChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ml-auto ${isLocDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {isLocDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsLocDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 w-52 bg-white border border-zinc-200 rounded-2xl shadow-xl z-50 py-2">
                    {uniqueLocations.map((loc) => (
                      <button
                        key={loc}
                        onClick={() => {
                          setActiveLoc(loc);
                          setIsLocDropdownOpen(false);
                          setVisibleCount(6);
                        }}
                        className={`w-full text-left px-5 py-3 text-[14px] font-semibold transition-colors hover:bg-zinc-50 cursor-pointer block ${activeLoc === loc ? "text-blue-600 font-bold bg-blue-50/50" : "text-zinc-600"}`}
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Results count */}
          {!loading && (
            <p className="text-[13px] text-zinc-400 font-medium mb-5">
              {filteredCareers.length} position{filteredCareers.length !== 1 ? "s" : ""} found
            </p>
          )}

          {/* Positions List */}
          {loading ? (
            <div className="py-24 flex justify-center items-center">
              <div className="w-8 h-8 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
            </div>
          ) : filteredCareers.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-3xl border border-zinc-200 shadow-sm">
              <p className="text-zinc-500 font-semibold text-lg">No positions match your search.</p>
              <p className="text-zinc-400 text-sm mt-1">Try clearing your filters or testing another search term.</p>
            </div>
          ) : (
            <motion.div
              variants={listVariants}
              initial="hidden"
              animate="show"
              className="space-y-3"
            >
              {filteredCareers.slice(0, visibleCount).map((job, idx) => (
                <motion.div
                  key={job.slug}
                  variants={itemVariants}
                  className="group block"
                >
                  <Link
                    to={`/career/${job.slug}`}
                    className="flex flex-col sm:flex-row sm:items-center justify-between bg-white border border-zinc-200 hover:border-blue-400 hover:shadow-[0_8px_40px_rgba(0,102,255,0.08)] rounded-2xl transition-all duration-300 overflow-hidden"
                  >
                    {/* Left accent bar */}
                    <div className="flex items-center gap-5 flex-1 min-w-0 p-6 md:p-7">
                      {/* Colored left bar */}
                      <div className={`w-1 self-stretch rounded-full shrink-0 ${["bg-blue-500", "bg-violet-500", "bg-emerald-500", "bg-amber-500", "bg-rose-500"][idx % 5]
                        }`} />

                      {/* Icon box */}
                      <div className="w-12 h-12 shrink-0 rounded-xl bg-zinc-50 border border-zinc-100 flex items-center justify-center group-hover:bg-blue-600/10 group-hover:border-blue-200 transition-all duration-300">
                        {getJobIcon(job.icon)}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
                          <h3 className="text-[18px] sm:text-[20px] font-bold tracking-tight text-zinc-950 group-hover:text-blue-600 transition-colors duration-300 line-clamp-1">
                            {job.title}
                          </h3>
                          {job.isNew && (
                            <span className="px-2.5 py-1 rounded-full bg-blue-600 text-white font-black text-[10px] uppercase tracking-widest leading-none">
                              NEW
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[13px] font-semibold">
                          <span className="text-blue-600 uppercase tracking-wider">{job.department}</span>
                          <span className="text-zinc-300">â€¢</span>
                          <span className="text-zinc-400">{job.employmentType}</span>
                          <span className="text-zinc-300">â€¢</span>
                          <span className="text-zinc-400">{job.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right action */}
                    <div className="flex items-center gap-4 px-6 py-4 sm:py-0 border-t sm:border-0 border-zinc-100 shrink-0">
                      <span className="px-4 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-[12px] font-extrabold text-zinc-500 uppercase tracking-wider group-hover:bg-blue-600/5 group-hover:border-blue-200 group-hover:text-blue-600 transition-all">
                        {job.employmentType}
                      </span>
                      <div className="w-10 h-10 rounded-full border border-zinc-200 bg-white flex items-center justify-center text-zinc-400 group-hover:bg-zinc-950 group-hover:text-white group-hover:border-transparent transition-all duration-300">
                        <FiArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Load More Button */}
          {!loading && filteredCareers.length > visibleCount && (
            <div className="text-center mt-10">
              <button
                onClick={() => setVisibleCount((prev) => prev + 3)}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-800 rounded-2xl text-[14px] font-bold transition-all cursor-pointer hover:border-zinc-300 shadow-sm"
              >
                Load more positions
              </button>
            </div>
          )}
        </Container>
      </Section>

      {/* Why Join Us Section */}
      <Section id="why-join" className="bg-white py-20 md:py-28">
        <Container className="px-6 sm:px-8 lg:px-14 xl:px-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
            <div>
              <span className="inline-flex items-center gap-2 text-[12px] font-black tracking-[0.18em] text-blue-600 uppercase mb-4">
                <span className="h-[2px] w-6 bg-blue-600 rounded-full inline-block" />
                Why Join Edihub
              </span>
              <h2 className="text-[40px] sm:text-[52px] font-extrabold tracking-[-0.04em] leading-[1.05] text-zinc-950">
                More than a job.<br />A place to grow.
              </h2>
            </div>
            <p className="text-[22px] leading-[1.75] text-zinc-500 max-w-[38ch]">
              We empower our team to solve meaningful challenges, providing an environment that fosters continuous learning, autonomy, and cross-functional collaboration.
            </p>
          </div>

          {/* Benefits grid â€” clean colored cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: <FiGlobe className="w-6 h-6" />,
                title: "Work from anywhere",
                description: "Fully remote team with flexibility that fits your life.",
                accent: "bg-blue-50 text-blue-600 border-blue-100",
                iconBg: "bg-blue-600",
              },
              {
                icon: <FiHeart className="w-6 h-6" />,
                title: "Health & wellness",
                description: "Comprehensive health coverage for you and your family.",
                accent: "bg-rose-50 text-rose-600 border-rose-100",
                iconBg: "bg-rose-500",
              },
              {
                icon: <FiTrendingUp className="w-6 h-6" />,
                title: "Growth & learning",
                description: "Annual learning budget and clear paths for advancement.",
                accent: "bg-emerald-50 text-emerald-600 border-emerald-100",
                iconBg: "bg-emerald-600",
              },
              {
                icon: <FiCalendar className="w-6 h-6" />,
                title: "Flexible schedule",
                description: "Flexible hours that help you do your best work.",
                accent: "bg-amber-50 text-amber-600 border-amber-100",
                iconBg: "bg-amber-500",
              },
              {
                icon: <FiUsers className="w-6 h-6" />,
                title: "Great team",
                description: "Collaborate with talented, kind, and ambitious people.",
                accent: "bg-violet-50 text-violet-600 border-violet-100",
                iconBg: "bg-violet-600",
              },
              {
                icon: <FiArrowUpRight className="w-6 h-6" />,
                title: "Real impact",
                description: "Work on projects that shape brands and move businesses forward.",
                accent: "bg-cyan-50 text-cyan-600 border-cyan-100",
                iconBg: "bg-cyan-600",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.07 }}
                className="flex gap-5 items-start p-7 rounded-2xl border border-zinc-100 bg-zinc-50 hover:bg-white hover:border-zinc-200 hover:shadow-md transition-all duration-300 group"
              >
                <div className={`w-12 h-12 shrink-0 rounded-xl ${item.iconBg} text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300`}>
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-zinc-950 mb-1.5">{item.title}</h3>
                  <p className="text-[14px] leading-relaxed text-zinc-500">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-[#F8F8FA] pt-8 md:pt-10 pb-20 md:pb-28">
        <Container className="px-6 sm:px-8 lg:px-14 xl:px-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
            <div>
              <span className="inline-flex items-center gap-2 text-[12px] font-black tracking-[0.18em] text-blue-600 uppercase mb-4">
                <span className="h-[2px] w-6 bg-blue-600 rounded-full inline-block" />
                Life at Edihub
              </span>
              <h2 className="text-[40px] sm:text-[52px] font-extrabold tracking-[-0.04em] leading-[1.05] text-zinc-950">
                A culture built on<br />trust and creativity.
              </h2>
            </div>

            <a
              href="#positions"
              onClick={handleScrollToPositions}
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-zinc-950 hover:bg-zinc-850 text-white rounded-xl text-[14px] font-bold transition-all cursor-pointer group shrink-0 shadow-sm"
            >
              See open roles
              <FiArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { img: teamImage, caption: "Collaborative sprints", span: "col-span-1" },
              { img: heroImage, caption: "Modern workspace", span: "col-span-1" },
              { img: statsImage, caption: "Impactful milestones", span: "col-span-1" },
              { img: pexels1, caption: "Design & strategy", span: "col-span-1" },
            ].map((card, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.08 }}
                className={`group relative overflow-hidden aspect-[3/4] rounded-2xl bg-zinc-200 ${card.span} border border-zinc-200`}
              >
                <img
                  src={card.img}
                  alt={card.caption}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex items-end p-5">
                  <p className="text-white text-[13px] font-bold">{card.caption}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </Section>

      <CtaSection />

      <Footer />
    </div>
  );
}
