import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
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

const getBenefitIcon = (iconName: string) => {
  switch (iconName) {
    case "globe":
      return <FiGlobe className="w-6 h-6 text-blue-600" />;
    case "heart":
      return <FiHeart className="w-6 h-6 text-blue-600" />;
    case "trending":
      return <FiTrendingUp className="w-6 h-6 text-blue-600" />;
    case "calendar":
      return <FiCalendar className="w-6 h-6 text-blue-600" />;
    case "users":
    default:
      return <FiUsers className="w-6 h-6 text-blue-600" />;
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

              <div 
                className="relative w-full max-w-[420px] h-full"
                style={{ perspective: 1200 }}
              >
                {/* 3D stacked cards */}
                {/* Back card */}
                <motion.div
                  initial={{ opacity: 0, rotateY: -35, rotateX: 18, z: -100, x: 80, y: -20 }}
                  animate={{ opacity: 0.35, rotateY: -25, rotateX: 12, z: -80, x: 60, y: 0 }}
                  transition={{ duration: 0.9, delay: 0.4 }}
                  className="absolute inset-0 bg-white border border-zinc-150 rounded-3xl p-8 shadow-xl flex flex-col justify-between"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div className="w-12 h-12 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center justify-center font-bold text-zinc-400">03</div>
                  <div className="text-xl font-bold text-zinc-300">Design</div>
                </motion.div>

                {/* Middle card */}
                <motion.div
                  initial={{ opacity: 0, rotateY: -35, rotateX: 18, z: -50, x: 40, y: -10 }}
                  animate={{ opacity: 0.7, rotateY: -25, rotateX: 12, z: -40, x: 30, y: 0 }}
                  transition={{ duration: 0.9, delay: 0.3 }}
                  className="absolute inset-0 bg-white border border-zinc-200 rounded-3xl p-8 shadow-xl flex flex-col justify-between"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div className="w-12 h-12 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center justify-center font-bold text-zinc-400">02</div>
                  <div className="text-xl font-bold text-zinc-400">Development</div>
                </motion.div>

                {/* Front card */}
                <motion.div
                  initial={{ opacity: 0, rotateY: -30, rotateX: 15, z: 0, x: 0, y: 0 }}
                  animate={{ opacity: 1, rotateY: -20, rotateX: 10, z: 0, x: 0, y: 0 }}
                  whileHover={{ scale: 1.05, rotateY: -15, rotateX: 5 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  className="absolute inset-0 bg-white/70 backdrop-blur-md border border-white/80 rounded-3xl p-8 shadow-2xl flex flex-col justify-between select-none"
                  style={{ transformStyle: "preserve-3d", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.08)" }}
                >
                  <div className="flex justify-between items-start">
                    <div className="px-3 py-1 bg-blue-50 border border-blue-100 rounded-full text-[10px] font-black text-blue-600 uppercase tracking-widest">
                      We're Hiring
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center font-extrabold text-blue-600 text-lg">01</div>
                  </div>
                  
                  <div className="space-y-4">
                    <p className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 leading-tight">
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
                    className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      activeDept === dept
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
                          className={`w-full text-left px-4 py-2.5 text-xs transition-colors hover:bg-zinc-50 cursor-pointer block ${
                            activeLoc === loc ? "text-blue-600 font-bold bg-blue-50/40" : "text-zinc-600"
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
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-6 sm:p-8 bg-white border border-zinc-200 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/[0.02] rounded-3xl transition-all duration-300 gap-6"
                  >
                    {/* Icon & Title info */}
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-600/10 transition-colors">
                        {getJobIcon(job.icon)}
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-bold text-zinc-900 group-hover:text-blue-600 transition-colors">
                            {job.title}
                          </h3>
                          {job.isNew && (
                            <span className="px-2 py-0.5 rounded-full bg-blue-500 text-white font-extrabold text-[9px] uppercase tracking-wider">
                              NEW
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400">
                          <span>{job.department}</span>
                          <span>•</span>
                          <span>{job.employmentType}</span>
                        </div>
                      </div>
                    </div>

                    {/* Location & Details Action */}
                    <div className="flex items-center justify-between sm:justify-end gap-12 border-t sm:border-0 border-zinc-100 pt-4 sm:pt-0">
                      <span className="text-sm font-semibold text-zinc-500">
                        {job.location}
                      </span>
                      
                      <div className="flex items-center gap-3">
                        <span className="px-4 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-[10px] font-black text-zinc-500 uppercase group-hover:bg-blue-50 group-hover:border-blue-200 group-hover:text-blue-600 transition-all tracking-wider">
                          {job.employmentType}
                        </span>
                        
                        <div className="w-10 h-10 rounded-full border border-zinc-200 flex items-center justify-center text-zinc-400 group-hover:bg-zinc-950 group-hover:text-white group-hover:border-zinc-950 transition-colors shadow-sm">
                          <FiArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {whyJoinEdihub.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="p-6 bg-zinc-50 border border-zinc-200/60 rounded-3xl flex flex-col justify-between h-56 hover:shadow-lg hover:border-zinc-200 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-white rounded-2xl border border-zinc-200 flex items-center justify-center shadow-sm">
                  {getBenefitIcon(item.icon)}
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-[15px] font-bold text-zinc-900 tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-normal">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
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

      {/* CTA Card Section */}
      <Section className="bg-white py-24">
        <Container className="px-6 sm:px-8 lg:px-14 xl:px-20">
          <div className="relative overflow-hidden rounded-[3rem] border border-blue-100 bg-gradient-to-br from-blue-50/80 via-white to-blue-50/30 p-12 sm:p-16 md:p-24 text-center">
            {/* Glowing accents */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-100/50 rounded-full blur-[100px] -z-10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-50/80 rounded-full blur-[100px] -z-10 pointer-events-none" />

            <div className="relative max-w-2xl mx-auto space-y-8">
              <span className="text-[10px] font-black tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100/80 uppercase">
                • Ready to Join?
              </span>
              
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-zinc-950 leading-none">
                Let's create the future together.
              </h2>
              
              <p className="text-zinc-500 max-w-md mx-auto text-sm sm:text-base leading-relaxed">
                If you don't see an exact fit in our open listings, send us your resume anyway! We're always looking for talented minds.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                <a
                  href="#positions"
                  onClick={handleScrollToPositions}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-zinc-950 hover:bg-zinc-850 text-white rounded-2xl text-xs font-black transition-all cursor-pointer active:scale-98"
                >
                  View Open Positions
                  <FiArrowUpRight className="w-4 h-4" />
                </a>
                
                <Link
                  to="/contact"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-800 rounded-2xl text-xs font-black transition-all cursor-pointer active:scale-98"
                >
                  Send Us Your Resume
                  <FiArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Footer />
    </div>
  );
}
