import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CtaSection } from "@/components/sections/CtaSection";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { getApiUrl } from "@/utils/api";
import { defaultCareers, whyJoinEdihub } from "@/data/careers";
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



const getBenefitIconWhite = (iconName: string) => {
  switch (iconName) {
    case "globe":
      return <FiGlobe className="w-6 h-6 text-white" />;
    case "heart":
      return <FiHeart className="w-6 h-6 text-white" />;
    case "trending":
      return <FiTrendingUp className="w-6 h-6 text-white" />;
    case "calendar":
      return <FiCalendar className="w-6 h-6 text-white" />;
    case "users":
    default:
      return <FiUsers className="w-6 h-6 text-white" />;
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
  const [cardsOpen, setCardsOpen] = useState(false);
  const [activeCardIndex, setActiveCardIndex] = useState(0);

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

  const handleCardClick = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeCardIndex === idx) {
      handleScrollToPositions(e);
    } else {
      setActiveCardIndex(idx);
    }
  };

  const getCardVariants = (cardIdx: number) => {
    const rel = (cardIdx - activeCardIndex + 3) % 3;
    if (rel === 0) {
      // Front active card position
      return {
        initial: { zIndex: 30, opacity: 1, rotateY: -15, rotateX: 8, z: 0, x: 0, y: 0, scale: 1 },
        hover: { zIndex: 30, opacity: 1, rotateY: -8, rotateX: 4, z: 0, x: 0, y: 5, scale: 1.02 }
      };
    } else if (rel === 1) {
      // Right/back card position
      return {
        initial: { zIndex: 10, opacity: 0.35, rotateY: -25, rotateX: 12, z: -80, x: 60, y: 0, rotate: 0 },
        hover: { zIndex: 10, opacity: 0.95, rotateY: -10, rotateX: 5, z: 0, x: 100, y: -25, rotate: 6 }
      };
    } else {
      // Left/back card position
      return {
        initial: { zIndex: 20, opacity: 0.7, rotateY: -25, rotateX: 12, z: -40, x: -30, y: 0, rotate: 0 },
        hover: { zIndex: 20, opacity: 0.95, rotateY: -10, rotateX: 5, z: 0, x: -100, y: 20, rotate: -6 }
      };
    }
  };

  return (
    <div className="bg-white text-zinc-900 min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <Section className="pt-32 md:pt-44 pb-16 overflow-hidden">
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
                className="flex flex-wrap gap-4 pt-4"
              >
                <a
                  href="#positions"
                  onClick={handleScrollToPositions}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-zinc-950 hover:bg-zinc-850 text-white rounded-2xl text-[15px] font-bold transition-all shadow-lg shadow-zinc-950/10 cursor-pointer active:scale-98"
                >
                  View Open Positions
                  <FiArrowUpRight className="w-4 h-4" />
                </a>
                <a
                  href="#why-join"
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById("why-join")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-800 rounded-2xl text-[15px] font-bold transition-all cursor-pointer active:scale-98"
                >
                  Life at Edihub
                  <FiArrowUpRight className="w-4 h-4" />
                </a>
              </motion.div>
            </div>

            {/* Right overlapping animated cards */}
            <div className="lg:col-span-6 relative h-[450px] w-full flex items-center justify-center">
              {/* Blur Glowing Background */}
              <div className="absolute w-[350px] h-[350px] rounded-full bg-blue-400/20 blur-[100px] pointer-events-none" />

              <motion.div
                className="relative w-full max-w-[420px] h-full cursor-pointer select-none"
                style={{ perspective: 1200 }}
                onMouseEnter={() => setCardsOpen(true)}
                onMouseLeave={() => setCardsOpen(false)}
                animate={cardsOpen ? "hover" : "initial"}
              >
                {/* 3D stacked cards */}
                {/* Back card (Design) */}
                <motion.div
                  variants={getCardVariants(2)}
                  onClick={(e) => handleCardClick(2, e)}
                  transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
                  className="absolute inset-0 bg-white border border-zinc-200 rounded-3xl p-6 shadow-xl flex flex-col justify-between cursor-pointer"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[13px] font-black text-zinc-400 uppercase tracking-widest">Design Team</span>
                    <div className="w-8 h-8 rounded-full bg-zinc-50 border border-zinc-200 flex items-center justify-center font-bold text-zinc-400 text-[13px]">03</div>
                  </div>

                  {/* Image container */}
                  <div className="my-3 h-[180px] rounded-2xl overflow-hidden bg-zinc-50 border border-zinc-150 relative">
                    <img src={pexels3} alt="Design" className="w-full h-full object-cover" />
                  </div>

                  <div className="text-[22px] font-bold text-zinc-900 leading-tight">Design & Creative</div>
                </motion.div>

                {/* Middle card (Development) */}
                <motion.div
                  variants={getCardVariants(1)}
                  onClick={(e) => handleCardClick(1, e)}
                  transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
                  className="absolute inset-0 bg-white border border-zinc-200 rounded-3xl p-6 shadow-xl flex flex-col justify-between cursor-pointer"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[13px] font-black text-zinc-400 uppercase tracking-widest">Dev Team</span>
                    <div className="w-8 h-8 rounded-full bg-zinc-50 border border-zinc-200 flex items-center justify-center font-bold text-zinc-400 text-[13px]">02</div>
                  </div>

                  {/* Image container */}
                  <div className="my-3 h-[180px] rounded-2xl overflow-hidden bg-zinc-50 border border-zinc-150 relative">
                    <img src={pexels2} alt="Development" className="w-full h-full object-cover" />
                  </div>

                  <div className="text-[22px] font-bold text-zinc-900 leading-tight">Tech & Development</div>
                </motion.div>

                {/* Front card (General / We're Hiring) */}
                <motion.div
                  variants={getCardVariants(0)}
                  onClick={(e) => handleCardClick(0, e)}
                  transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
                  className="absolute inset-0 bg-white border border-zinc-200 rounded-3xl p-6 shadow-2xl flex flex-col justify-between select-none cursor-pointer"
                  style={{ transformStyle: "preserve-3d", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.08)" }}
                >
                  <div className="flex justify-between items-start">
                    <div className="px-3 py-1 bg-blue-50 border border-blue-100 rounded-full text-[13px] font-black text-blue-600 uppercase tracking-widest">
                      We're Hiring
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center font-extrabold text-blue-600 text-[13px]">01</div>
                  </div>

                  {/* Image container */}
                  <div className="my-3 h-[180px] rounded-2xl overflow-hidden bg-zinc-50 border border-zinc-150 relative">
                    <img src={heroImage} alt="Hiring" className="w-full h-full object-cover" />
                  </div>

                  <div className="space-y-3">
                    <p className="text-[22px] font-bold tracking-tight text-zinc-900 leading-tight">
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
              </motion.div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Filter and Job List Section */}
      <Section id="positions" ref={positionsRef} className="bg-zinc-50 border-t border-zinc-100 py-24">
        <Container className="px-6 sm:px-8 lg:px-14 xl:px-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div className="space-y-4">
              <span className="text-[11px] font-black tracking-widest text-blue-600 uppercase">
                • Open Positions
              </span>
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-950">
                Find your next opportunity.
              </h2>
            </div>

            <p className="text-zinc-500 max-w-sm leading-relaxed text-sm md:text-[15px]">
              Join a remote-first team that values creativity, ownership, and continuous growth.
            </p>
          </div>

          {/* Filtering Tools Bar */}
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center mb-8">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-4.5 h-4.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search jobs..."
                className="w-full bg-white border border-zinc-200 rounded-2xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all text-zinc-800"
              />
            </div>

            {/* Dropdowns and active filter list */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Department Tabs */}
              <div className="flex bg-zinc-100 p-1.5 rounded-2xl overflow-x-auto border border-zinc-200">
                {["All Departments", "Design", "Development", "Marketing", "Operations"].map((dept) => (
                  <button
                    key={dept}
                    onClick={() => {
                      setActiveDept(dept);
                      setVisibleCount(6);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${activeDept === dept
                        ? "bg-white text-zinc-950 shadow-sm border border-zinc-200/50"
                        : "text-zinc-500 hover:text-zinc-800"
                      }`}
                  >
                    {dept}
                  </button>
                ))}
              </div>

              {/* Location Selector Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsLocDropdownOpen(!isLocDropdownOpen)}
                  className="flex items-center gap-2 px-4 py-3 bg-white border border-zinc-200 hover:bg-zinc-50 rounded-2xl text-xs font-bold text-zinc-800 transition-all cursor-pointer"
                >
                  {activeLoc}
                  <FiChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform ${isLocDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {isLocDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsLocDropdownOpen(false)} />
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-zinc-200 rounded-2xl shadow-xl z-50 py-1.5">
                      {uniqueLocations.map((loc) => (
                        <button
                          key={loc}
                          onClick={() => {
                            setActiveLoc(loc);
                            setIsLocDropdownOpen(false);
                            setVisibleCount(6);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-xs transition-colors hover:bg-zinc-50 cursor-pointer block ${activeLoc === loc ? "text-blue-600 font-bold bg-blue-50/40" : "text-zinc-600"
                            }`}
                        >
                          {loc}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

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
              className="space-y-4"
            >
              {filteredCareers.slice(0, visibleCount).map((job) => (
                <motion.div
                  key={job.slug}
                  variants={itemVariants}
                  className="group block"
                >
                  <Link
                    to={`/career/${job.slug}`}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-8 md:p-10 bg-white border border-zinc-200 hover:border-blue-300 hover:shadow-[0_20px_50px_rgba(0,102,255,0.05)] rounded-[24px] sm:rounded-[32px] transition-all duration-300 gap-6"
                  >
                    {/* Icon & Title info */}
                    <div className="flex items-center gap-6 flex-1 min-w-0">
                      <div className="w-14 h-14 shrink-0 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center group-hover:bg-blue-600/10 group-hover:scale-105 transition-all duration-300">
                        {getJobIcon(job.icon)}
                      </div>
                      
                      <div className="space-y-2 min-w-0">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-[20px] sm:text-[24px] font-semibold tracking-tight text-zinc-950 group-hover:text-blue-600 transition-colors duration-300 line-clamp-1">
                            {job.title}
                          </h3>
                          {job.isNew && (
                            <span className="px-2.5 py-1 rounded-full bg-blue-600 text-white font-extrabold text-[9px] uppercase tracking-widest leading-none shadow-sm">
                              NEW
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2.5 text-[14px] font-medium text-zinc-400">
                          <span className="text-blue-600 font-bold uppercase text-[11px] tracking-wider">{job.department}</span>
                          <span className="text-zinc-300">•</span>
                          <span>{job.employmentType}</span>
                        </div>
                      </div>
                    </div>

                    {/* Location & Details Action */}
                    <div className="flex items-center justify-between sm:justify-end gap-10 border-t sm:border-0 border-zinc-100 pt-6 sm:pt-0 shrink-0">
                      <span className="text-[16px] font-medium text-zinc-500">
                        {job.location}
                      </span>
                      
                      <div className="flex items-center gap-4">
                        <span className="px-4 py-2.5 rounded-xl bg-zinc-50 border border-zinc-150 text-[11px] font-extrabold text-zinc-500 uppercase tracking-wider group-hover:bg-blue-600/5 group-hover:border-blue-200 group-hover:text-blue-600 transition-all">
                          {job.employmentType}
                        </span>
                        
                        <div className="w-12 h-12 rounded-full border border-zinc-200 bg-white flex items-center justify-center text-zinc-400 group-hover:bg-zinc-950 group-hover:text-white group-hover:border-transparent transition-all duration-300 shadow-sm">
                          <FiArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Load More Button */}
          {!loading && filteredCareers.length > visibleCount && (
            <div className="text-center mt-12">
              <button
                onClick={() => setVisibleCount((prev) => prev + 3)}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-800 rounded-2xl text-[13px] font-extrabold transition-all cursor-pointer active:scale-98"
              >
                Load More Positions +
              </button>
            </div>
          )}
        </Container>
      </Section>

      {/* Why Join Us Section */}
      <Section id="why-join" className="bg-white py-24 md:py-32">
        <Container className="px-6 sm:px-8 lg:px-14 xl:px-20">
          <div className="flex flex-col lg:flex-row justify-between gap-12 mb-20">
            <div className="space-y-4 max-w-xl">
              <span className="text-[11px] font-black tracking-widest text-blue-600 uppercase">
                • Why Join Edihub
              </span>
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight text-zinc-950">
                More than a job. <br />A place to grow.
              </h2>
            </div>

            <p className="text-zinc-500 max-w-md leading-relaxed text-sm md:text-base">
              We empower our team to solve meaningful challenges, providing an environment that fosters continuous learning, autonomy, and cross-functional collaboration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {whyJoinEdihub.map((item, idx) => {
              const cardBgImages = [pexels1, pexels2, pexels3, teamImage, statsImage];
              const getGridSpan = (i: number) => {
                switch (i) {
                  case 0:
                  case 1:
                  case 2:
                    return "lg:col-span-2 md:col-span-1 col-span-1";
                  case 3:
                    return "lg:col-span-3 md:col-span-1 col-span-1";
                  case 4:
                    return "lg:col-span-3 md:col-span-2 col-span-1";
                  default:
                    return "lg:col-span-2 col-span-1";
                }
              };

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.08 }}
                  className={`relative rounded-[32px] overflow-hidden flex flex-col justify-between min-h-[300px] border border-zinc-200/80 hover:border-blue-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 ease-out group ${getGridSpan(idx)}`}
                >
                  {/* Background Image with Hover Zoom */}
                  <div className="absolute inset-0 z-0 overflow-hidden">
                    <img 
                      src={cardBgImages[idx % cardBgImages.length]} 
                      alt="" 
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/95 via-zinc-950/70 to-black/20" />
                  </div>

                  {/* Card Content Overlay */}
                  <div className="relative z-10 p-8 md:p-10 flex flex-col justify-between h-full min-h-[300px] w-full">
                    {/* Icon container - Glassmorphic design */}
                    <div className="w-14 h-14 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center shadow-lg text-white group-hover:scale-110 group-hover:bg-blue-600 group-hover:border-blue-500 transition-all duration-300">
                      {getBenefitIconWhite(item.icon)}
                    </div>
                    
                    <div className="space-y-3 mt-12">
                      <h3 className="text-[20px] sm:text-[24px] font-bold text-white tracking-tight group-hover:text-blue-400 transition-colors duration-300">
                        {item.title}
                      </h3>
                      <p className="text-[15px] text-zinc-300 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* Life at Edihub Section */}
      <Section className="bg-zinc-50 border-y border-zinc-100 py-24 md:py-32">
        <Container className="px-6 sm:px-8 lg:px-14 xl:px-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16">
            <div className="space-y-4">
              <span className="text-[11px] font-black tracking-widest text-blue-600 uppercase">
                • Life at Edihub
              </span>
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-950">
                A culture built on trust and creativity.
              </h2>
            </div>

            <a
              href="#positions"
              onClick={handleScrollToPositions}
              className="inline-flex items-center gap-1.5 text-sm font-bold text-zinc-900 hover:text-blue-600 transition-colors cursor-pointer group"
            >
              Explore Life at Edihub
              <FiArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { img: teamImage, caption: "Collaborative sprints" },
              { img: heroImage, caption: "Modern workspace environments" },
              { img: statsImage, caption: "Impactful milestones" },
              { img: pexels1, caption: "Design and strategy alignment" }
            ].map((card, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.08 }}
                className="group relative overflow-hidden aspect-[4/5] rounded-[2.5rem] bg-zinc-200 border border-zinc-300/40 shadow-sm cursor-zoom-in"
              >
                <img
                  src={card.img}
                  alt={card.caption}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/35 transition-all duration-300 flex items-end p-6">
                  <p className="text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {card.caption}
                  </p>
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
