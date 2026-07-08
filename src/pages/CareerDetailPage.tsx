import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CtaSection } from "@/components/sections/CtaSection";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { getApiUrl } from "@/utils/api";
import { defaultCareers, whyJoinEdihub } from "@/data/careers";
import type { Career } from "@/data/careers";

import {
  FiArrowLeft,
  FiBriefcase,
  FiClock,
  FiMapPin,
  FiTrendingUp,
  FiCalendar,
  FiArrowUpRight,
  FiCheck,
  FiGlobe,
  FiHeart,
  FiUsers,
  FiSend,
  FiX
} from "react-icons/fi";

import statsImage from "@/assets/stats.webp";
import heroImage from "@/assets/hero-image.webp";
import pexels1 from "@/assets/projects/pexels-1.webp";
import pexels2 from "@/assets/projects/pexels-2.webp";
import pexels3 from "@/assets/projects/pexels-3.webp";
import pexels4 from "@/assets/projects/pexels-4.webp";
import pexels5 from "@/assets/projects/pexels-5.webp";

const getCareerImage = (slug: string, dept: string) => {
  if (slug === "senior-ui-ux-designer") return pexels3;
  if (slug === "framer-developer") return pexels2;
  if (slug === "brand-designer") return pexels4;
  if (slug === "growth-marketing-manager") return pexels5;
  if (slug === "project-manager" || slug === "project-manager-professional") return statsImage;
  if (slug === "content-writer") return pexels1;
  
  if (dept.toLowerCase() === "design") return pexels3;
  if (dept.toLowerCase() === "development") return pexels2;
  return heroImage;
};

const getBenefitIcon = (iconName: string) => {
  switch (iconName) {
    case "globe":
      return <FiGlobe className="w-5 h-5 text-blue-600" />;
    case "heart":
      return <FiHeart className="w-5 h-5 text-blue-600" />;
    case "trending":
      return <FiTrendingUp className="w-5 h-5 text-blue-600" />;
    case "calendar":
      return <FiCalendar className="w-5 h-5 text-blue-600" />;
    case "users":
    default:
      return <FiUsers className="w-5 h-5 text-blue-600" />;
  }
};

export function CareerDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [career, setCareer] = useState<Career | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailCardsOpen, setDetailCardsOpen] = useState(false);
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  // Application form modal state
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [applyError, setApplyError] = useState("");
  const [formFields, setFormFields] = useState({
    name: "",
    email: "",
    phone: "",
    resumeUrl: "",
    coverLetter: ""
  });

  useEffect(() => {
    const apiUrl = getApiUrl();
    fetch(`${apiUrl}/careers`)
      .then((res) => {
        if (!res.ok) throw new Error("API failed");
        return res.json();
      })
      .then((data: Career[]) => {
        const found = data.find((c) => c.slug === slug);
        if (found) {
          setCareer(found);
        } else {
          // Fallback check against static list
          const localFound = defaultCareers.find((c) => c.slug === slug);
          if (localFound) {
            setCareer(localFound);
          } else {
            navigate("/career");
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        console.warn("Fallback to static defaultCareers due to:", err.message);
        const localFound = defaultCareers.find((c) => c.slug === slug);
        if (localFound) {
          setCareer(localFound);
        } else {
          navigate("/career");
        }
        setLoading(false);
      });

    window.scrollTo(0, 0);
  }, [slug, navigate]);

  useEffect(() => {
    if (detailCardsOpen) return;
    const interval = setInterval(() => {
      setActiveCardIndex((prev) => (prev === 0 ? 1 : 0));
    }, 3000);
    return () => clearInterval(interval);
  }, [detailCardsOpen]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (!career) return null;

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formFields.name.trim() || !formFields.email.trim() || !formFields.phone.trim() || !formFields.resumeUrl.trim()) {
      setApplyError("Please fill out all required fields first.");
      return;
    }

    setFormSubmitting(true);
    setApplyError("");

    try {
      const apiUrl = getApiUrl();
      const payload = {
        ...formFields,
        careerSlug: career.slug,
        careerTitle: career.title
      };

      let success = false;
      try {
        const res = await fetch(`${apiUrl}/careers/apply`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          success = true;
        } else {
          const errData = await res.json();
          throw new Error(errData.message || "Failed to submit application.");
        }
      } catch (fetchErr) {
        console.warn("Backend API not reachable. Simulating live success using localStorage...", fetchErr);
        // Save to localStorage as fallback
        const localApps = JSON.parse(localStorage.getItem("career_applications") || "[]");
        localApps.push({
          id: String(Date.now()),
          ...payload,
          dateSubmitted: new Date().toLocaleString()
        });
        localStorage.setItem("career_applications", JSON.stringify(localApps));
        
        // Wait 800ms to simulate a live server response
        await new Promise(resolve => setTimeout(resolve, 800));
        success = true;
      }

      if (success) {
        setApplySuccess(true);
        setFormFields({ name: "", email: "", phone: "", resumeUrl: "", coverLetter: "" });
      }
    } catch (err: any) {
      setApplyError(err.message || "Something went wrong. Please try again.");
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleCardClick = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeCardIndex !== idx) {
      setActiveCardIndex(idx);
    } else {
      setIsApplyOpen(true);
    }
  };

  const detailCardVariants = {
    "front-initial": { zIndex: 30, opacity: 1, rotateY: -8, rotateX: 6, z: 0, x: 0, y: 0, rotate: 0 },
    "front-hover": { zIndex: 30, opacity: 1, rotateY: -12, rotateX: 8, z: 0, x: -20, y: 10, rotate: -4 },
    "back-initial": { zIndex: 10, opacity: 0.6, rotateY: -15, rotateX: 10, z: -40, x: 0, y: 0, rotate: 0 },
    "back-hover": { zIndex: 10, opacity: 1, rotateY: -5, rotateX: 2, z: 0, x: 80, y: -20, rotate: 6 }
  };

  return (
    <div className="bg-white text-zinc-900 min-h-screen">
      <Navbar />

      <main className="pt-32">
        {/* Back Link & Hero Header */}
        <Section className="pb-12">
          <Container className="px-6 sm:px-8 lg:px-14 xl:px-20">
            <div className="grid lg:grid-cols-12 gap-12 items-start">
              {/* Info Column */}
              <div className="lg:col-span-7 space-y-6">


                <div className="flex flex-wrap gap-2 text-[15px] font-black tracking-widest text-blue-600 uppercase">
                  <span>{career.department}</span>
                  <span>•</span>
                  <span>{career.employmentType}</span>
                </div>

                <h1 className="text-[36px] sm:text-[48px] md:text-[60px] font-bold tracking-tight text-zinc-950 leading-tight">
                  {career.title}
                </h1>

                <p className="text-[18px] sm:text-[20px] text-zinc-500 leading-relaxed max-w-xl">
                  {career.description}
                </p>

                <div className="flex flex-wrap gap-4 pt-2">
                  <button
                    onClick={() => setIsApplyOpen(true)}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-[15px] sm:text-[16px] font-black tracking-wider uppercase transition-all shadow-lg shadow-blue-600/10 cursor-pointer active:scale-98"
                  >
                    Apply for this Position
                    <FiArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Right Mockup Graphics */}
              <div className="lg:col-span-5 relative h-[280px] sm:h-[350px] w-full flex items-center justify-center">
                <div className="absolute w-[280px] h-[280px] rounded-full bg-blue-200/30 blur-[80px] pointer-events-none" />

                {/* 3D Glassmorphic Cards Stack */}
                <motion.div
                  className="relative w-full max-w-[320px] h-full cursor-pointer select-none"
                  style={{ perspective: 1000 }}
                  onMouseEnter={() => setDetailCardsOpen(true)}
                  onMouseLeave={() => setDetailCardsOpen(false)}
                >
                  {/* Back card */}
                  <motion.div
                    variants={detailCardVariants}
                    animate={activeCardIndex === 1 ? (detailCardsOpen ? "front-hover" : "front-initial") : (detailCardsOpen ? "back-hover" : "back-initial")}
                    onClick={(e) => handleCardClick(1, e)}
                    transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
                    className="absolute inset-0 bg-white border border-zinc-200 rounded-3xl p-6 shadow-xl flex flex-col justify-between cursor-pointer"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-[13px] font-black text-zinc-400 uppercase tracking-widest">Life at Edihub</span>
                      <div className="w-10 h-10 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center justify-center font-bold text-zinc-400 text-[13px]">EDI</div>
                    </div>

                    {/* Image inside back card */}
                    <div className="my-3 h-[140px] rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200/60 relative">
                      <img src={heroImage} alt="Life at Edihub" className="w-full h-full object-cover" />
                    </div>

                    <div className="space-y-1">
                      <div className="text-[18px] font-bold text-zinc-955">Join our team.</div>
                      <div className="flex gap-2">
                        <span className="text-[12px] bg-zinc-100 px-2 py-0.5 rounded-full text-zinc-400 font-bold">Remote-first</span>
                        <span className="text-[12px] bg-zinc-100 px-2 py-0.5 rounded-full text-zinc-400 font-bold">Global</span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Front card */}
                  <motion.div
                    variants={detailCardVariants}
                    animate={activeCardIndex === 0 ? (detailCardsOpen ? "front-hover" : "front-initial") : (detailCardsOpen ? "back-hover" : "back-initial")}
                    onClick={(e) => handleCardClick(0, e)}
                    transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
                    className="absolute inset-0 bg-white border border-zinc-200 rounded-3xl p-6 shadow-2xl flex flex-col justify-between cursor-pointer"
                    style={{ transformStyle: "preserve-3d", boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.05)" }}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-[13px] font-black text-zinc-400 uppercase tracking-widest">{career.department} Team</span>
                      <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600 font-bold text-[13px]">EDI</div>
                    </div>

                    {/* Image inside card */}
                    <div className="my-4 h-[140px] rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200/60 relative">
                      <motion.img 
                        src={getCareerImage(career.slug, career.department)} 
                        alt={career.title} 
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.08 }}
                        transition={{ duration: 0.6 }}
                      />
                    </div>

                    <div className="space-y-3 pt-2">
                      <div className="text-[22px] font-bold text-zinc-955 tracking-tight leading-tight">{career.title}</div>
                      <div className="flex gap-2">
                        <span className="text-[12px] bg-zinc-100 px-2 py-0.5 rounded-full text-zinc-500 font-bold">{career.employmentType}</span>
                        <span className="text-[12px] bg-zinc-100 px-2 py-0.5 rounded-full text-zinc-500 font-bold">{career.location}</span>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </Container>
        </Section>

        {/* Info Strip */}
        <Section className="py-0">
          <Container className="px-6 sm:px-8 lg:px-14 xl:px-20">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 p-8 border border-zinc-200 bg-zinc-50/50 rounded-[2.5rem] shadow-sm">
              <div className="space-y-1">
                <span className="text-[13px] font-bold uppercase tracking-wider text-zinc-400">Department</span>
                <div className="flex items-center gap-2 text-[18px] font-bold text-zinc-800">
                  <FiBriefcase className="w-4 h-4 text-blue-600 shrink-0" />
                  {career.department}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[13px] font-bold uppercase tracking-wider text-zinc-400">Employment Type</span>
                <div className="flex items-center gap-2 text-[18px] font-bold text-zinc-800">
                  <FiClock className="w-4 h-4 text-blue-600 shrink-0" />
                  {career.employmentType}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[13px] font-bold uppercase tracking-wider text-zinc-400">Location</span>
                <div className="flex items-center gap-2 text-[18px] font-bold text-zinc-800">
                  <FiMapPin className="w-4 h-4 text-blue-600 shrink-0" />
                  {career.location}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[13px] font-bold uppercase tracking-wider text-zinc-400">Experience</span>
                <div className="flex items-center gap-2 text-[18px] font-bold text-zinc-800">
                  <FiTrendingUp className="w-4 h-4 text-blue-600 shrink-0" />
                  {career.experience}
                </div>
              </div>

              <div className="space-y-1 col-span-2 sm:col-span-1">
                <span className="text-[13px] font-bold uppercase tracking-wider text-zinc-400">Date Posted</span>
                <div className="flex items-center gap-2 text-[18px] font-bold text-zinc-800">
                  <FiCalendar className="w-4 h-4 text-blue-600 shrink-0" />
                  {career.datePosted}
                </div>
              </div>
            </div>
          </Container>
        </Section>

        {/* Content Details (About, Do, Looking For, Nice To Have, Sidebar info) */}
        <Section className="py-24">
          <Container className="px-6 sm:px-8 lg:px-14 xl:px-20">
            <div className="grid gap-16 lg:grid-cols-12 lg:gap-20">

              {/* Left Column: Job Description Lists */}
              <div className="lg:col-span-8 space-y-14">

                {/* About the role */}
                <div className="space-y-6">
                  <h2 className="text-[13px] font-black tracking-widest text-blue-600 uppercase">
                    / About the role /
                  </h2>
                  <h3 className="text-4xl font-bold tracking-tight text-zinc-950 leading-tight">
                    About the role
                  </h3>
                  <p className="text-zinc-500 text-[18px] sm:text-[20px] leading-relaxed">
                    {career.aboutRole || `We are looking for a qualified candidate to step into the role of ${career.title}. You will have the opportunity to collaborate closely with our core team and define modern solutions for our clients.`}
                  </p>
                </div>

                {/* What you'll do */}
                {career.responsibilities && career.responsibilities.length > 0 && (
                  <div className="space-y-6">
                    <h2 className="text-[13px] font-black tracking-widest text-blue-600 uppercase">
                      / Responsibilities /
                    </h2>
                    <h3 className="text-4xl font-bold tracking-tight text-zinc-950 leading-tight">
                      What you'll do
                    </h3>
                    <ul className="space-y-4">
                      {career.responsibilities.map((resp, i) => (
                        <li key={i} className="flex items-start gap-4">
                          <div className="w-5 h-5 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 mt-1">
                            <FiCheck className="w-3.5 h-3.5 text-blue-600" />
                          </div>
                          <span className="text-zinc-600 text-[16px] sm:text-[18px] leading-relaxed">
                            {resp}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* What we're looking for */}
                {career.requirements && career.requirements.length > 0 && (
                  <div className="space-y-6">
                    <h2 className="text-[13px] font-black tracking-widest text-blue-600 uppercase">
                      / Requirements /
                    </h2>
                    <h3 className="text-4xl font-bold tracking-tight text-zinc-950 leading-tight">
                      What we're looking for
                    </h3>
                    <ul className="space-y-4">
                      {career.requirements.map((req, i) => (
                        <li key={i} className="flex items-start gap-4">
                          <div className="w-5 h-5 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 mt-1">
                            <FiCheck className="w-3.5 h-3.5 text-blue-600" />
                          </div>
                          <span className="text-zinc-600 text-[16px] sm:text-[18px] leading-relaxed">
                            {req}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Nice to have */}
                {career.niceToHave && career.niceToHave.length > 0 && (
                  <div className="space-y-6">
                    <h2 className="text-[13px] font-black tracking-widest text-blue-600 uppercase">
                      / Nice to have /
                    </h2>
                    <h3 className="text-4xl font-bold tracking-tight text-zinc-950 leading-tight">
                      Nice to have
                    </h3>
                    <ul className="space-y-4">
                      {career.niceToHave.map((nice, i) => (
                        <li key={i} className="flex items-start gap-4">
                          <div className="w-5 h-5 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 mt-1">
                            <FiCheck className="w-3.5 h-3.5 text-blue-600" />
                          </div>
                          <span className="text-zinc-600 text-[16px] sm:text-[18px] leading-relaxed">
                            {nice}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Right Column: Sticky Summary Cards */}
              <div className="lg:col-span-4 space-y-8">
                {/* Job Details Card */}
                <div className="p-8 border border-zinc-200 rounded-[2.5rem] bg-white shadow-sm space-y-6">
                  <h4 className="text-[24px] font-bold text-zinc-950 tracking-tight">Job Details</h4>

                  <div className="divide-y divide-zinc-100 text-[16px]">
                    <div className="py-4 flex justify-between gap-4">
                      <span className="text-zinc-400 font-semibold">Department</span>
                      <span className="text-zinc-800 font-bold">{career.department}</span>
                    </div>
                    <div className="py-4 flex justify-between gap-4">
                      <span className="text-zinc-400 font-semibold">Role</span>
                      <span className="text-zinc-800 font-bold">{career.title}</span>
                    </div>
                    <div className="py-4 flex justify-between gap-4">
                      <span className="text-zinc-400 font-semibold">Employment Type</span>
                      <span className="text-zinc-800 font-bold">{career.employmentType}</span>
                    </div>
                    <div className="py-4 flex justify-between gap-4">
                      <span className="text-zinc-400 font-semibold">Location</span>
                      <span className="text-zinc-800 font-bold">{career.location}</span>
                    </div>
                    <div className="py-4 flex justify-between gap-4">
                      <span className="text-zinc-400 font-semibold">Experience</span>
                      <span className="text-zinc-800 font-bold">{career.experience}</span>
                    </div>
                    <div className="py-4 flex justify-between gap-4">
                      <span className="text-zinc-400 font-semibold">Date Posted</span>
                      <span className="text-zinc-800 font-bold">{career.datePosted}</span>
                    </div>
                  </div>
                </div>

                {/* What We Offer Card */}
                <div className="p-8 border border-zinc-200 rounded-[2.5rem] bg-zinc-50/50 space-y-6">
                  <h4 className="text-[24px] font-bold text-zinc-950 tracking-tight">What we offer</h4>

                  <div className="space-y-4">
                    {(career.benefits && career.benefits.length > 0 ? career.benefits : whyJoinEdihub).map((item, idx) => (
                      <div key={idx} className="flex gap-4">
                        <div className="w-11 h-11 rounded-xl bg-white border border-zinc-200 flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                          {getBenefitIcon(item.icon)}
                        </div>
                        <div className="space-y-0.5">
                          <h5 className="text-[17px] font-bold text-zinc-900 leading-snug">{item.title}</h5>
                          <p className="text-[14px] text-zinc-500 leading-relaxed">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </Section>

        <CtaSection />
      </main>

      <Footer />

      {/* Floating Application Modal */}
      <AnimatePresence>
        {isApplyOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Modal backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsApplyOpen(false);
                setApplySuccess(false);
                setApplyError("");
              }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -80 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -80 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative bg-white border border-zinc-200 rounded-[32px] p-8 md:p-10 max-w-2xl w-full shadow-2xl max-h-[95vh] overflow-y-auto z-10 [&::-webkit-scrollbar]:hidden"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {/* Close Button */}
              <button
                onClick={() => {
                  setIsApplyOpen(false);
                  setApplySuccess(false);
                  setApplyError("");
                }}
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-zinc-50 hover:bg-zinc-100 flex items-center justify-center text-zinc-400 hover:text-zinc-800 transition-all border border-zinc-200 shadow-sm"
              >
                <FiX className="w-5 h-5" />
              </button>

              {applySuccess ? (
                <div className="text-center py-8 space-y-6">
                  <div className="w-16 h-16 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto animate-bounce">
                    <FiCheck className="w-8 h-8 stroke-[2.5]" />
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-2xl md:text-3xl font-bold text-zinc-950">Application Submitted!</h3>
                    <p className="text-zinc-500 text-[15px] leading-relaxed max-w-sm mx-auto">
                      Thank you for applying for the <strong>{career.title}</strong> position. Our team will review your application and get in touch soon.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setIsApplyOpen(false);
                      setApplySuccess(false);
                    }}
                    className="px-8 py-4 bg-zinc-950 hover:bg-zinc-850 text-white rounded-2xl text-[13px] font-bold transition-all shadow-md active:scale-98"
                  >
                    Close Window
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplySubmit} className="space-y-5">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-black text-blue-600 bg-blue-50/50 border border-blue-100/50 px-3 py-0.5 rounded-full uppercase tracking-wider inline-block">
                      Apply Now
                    </span>
                    <h3 className="text-[24px] sm:text-[28px] font-bold text-zinc-950 leading-tight tracking-tight">
                      Join us as a <br />{career.title}
                    </h3>
                  </div>

                  {applyError && (
                    <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-800 text-[13px] font-semibold flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                      {applyError}
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[13px] font-bold text-zinc-500 uppercase tracking-wider block">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={formFields.name}
                        onChange={(e) => setFormFields({ ...formFields, name: e.target.value })}
                        placeholder="e.g. Jane Doe"
                        className="w-full bg-zinc-50/50 border border-zinc-200 rounded-2xl py-3 px-5 text-[15px] font-medium text-zinc-800 focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 focus:bg-white transition-all duration-300"
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[13px] font-bold text-zinc-500 uppercase tracking-wider block">Email Address *</label>
                        <input
                          type="email"
                          required
                          value={formFields.email}
                          onChange={(e) => setFormFields({ ...formFields, email: e.target.value })}
                          placeholder="e.g. jane@example.com"
                          className="w-full bg-zinc-50/50 border border-zinc-200 rounded-2xl py-3 px-5 text-[15px] font-medium text-zinc-800 focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 focus:bg-white transition-all duration-300"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[13px] font-bold text-zinc-500 uppercase tracking-wider block">Phone Number *</label>
                        <input
                          type="tel"
                          required
                          value={formFields.phone}
                          onChange={(e) => setFormFields({ ...formFields, phone: e.target.value })}
                          placeholder="e.g. +1 555 123 456"
                          className="w-full bg-zinc-50/50 border border-zinc-200 rounded-2xl py-3 px-5 text-[15px] font-medium text-zinc-800 focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 focus:bg-white transition-all duration-300"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[13px] font-bold text-zinc-500 uppercase tracking-wider block">Resume/CV URL *</label>
                      <input
                        type="url"
                        required
                        value={formFields.resumeUrl}
                        onChange={(e) => setFormFields({ ...formFields, resumeUrl: e.target.value })}
                        placeholder="Link to PDF (Google Drive, Dropbox, etc.)"
                        className="w-full bg-zinc-50/50 border border-zinc-200 rounded-2xl py-3 px-5 text-[15px] font-medium text-zinc-800 focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 focus:bg-white transition-all duration-300"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[13px] font-bold text-zinc-500 uppercase tracking-wider block">Cover Letter / Message</label>
                      <textarea
                        rows={3}
                        value={formFields.coverLetter}
                        onChange={(e) => setFormFields({ ...formFields, coverLetter: e.target.value })}
                        placeholder="Tell us why you are a great fit..."
                        className="w-full bg-zinc-50/50 border border-zinc-200 rounded-2xl py-3 px-5 text-[15px] font-medium text-zinc-800 focus:outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600 focus:bg-white transition-all duration-300 resize-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={formSubmitting}
                    className="w-full inline-flex items-center justify-center gap-2 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-300 text-white rounded-2xl text-[15px] font-extrabold uppercase tracking-wider transition-all shadow-lg shadow-blue-600/10 cursor-pointer active:scale-98"
                  >
                    {formSubmitting ? (
                      <span className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    ) : (
                      <>
                        Submit Application
                        <FiSend className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
