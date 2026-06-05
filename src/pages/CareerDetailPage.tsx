import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
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
  FiBookmark,
  FiGlobe,
  FiHeart,
  FiUsers,
  FiSend,
  FiX
} from "react-icons/fi";

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
  const [careersList, setCareersList] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);

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
        setCareersList(data);
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
        setCareersList(defaultCareers);
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

      const res = await fetch(`${apiUrl}/careers/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to submit application.");
      }

      setApplySuccess(true);
      setFormFields({ name: "", email: "", phone: "", resumeUrl: "", coverLetter: "" });
    } catch (err: any) {
      setApplyError(err.message || "Something went wrong. Please try again.");
    } finally {
      setFormSubmitting(false);
    }
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
                <Link
                  to="/career"
                  className="inline-flex items-center gap-2 text-[13px] font-black text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-widest"
                >
                  <FiArrowLeft className="w-4 h-4" />
                  Back to All Positions
                </Link>
                
                <div className="flex flex-wrap gap-2 text-xs font-black tracking-widest text-blue-600 uppercase">
                  <span>{career.department}</span>
                  <span>•</span>
                  <span>{career.employmentType}</span>
                </div>

                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-zinc-950 leading-tight">
                  {career.title}
                </h1>

                <p className="text-lg text-zinc-500 leading-relaxed max-w-xl">
                  {career.description}
                </p>

                <div className="flex flex-wrap gap-4 pt-2">
                  <button
                    onClick={() => setIsApplyOpen(true)}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-black tracking-wider uppercase transition-all shadow-lg shadow-blue-600/10 cursor-pointer active:scale-98"
                  >
                    Apply for this Position
                    <FiArrowUpRight className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    className={`inline-flex items-center justify-center w-14 h-14 border rounded-2xl transition-all cursor-pointer ${
                      isBookmarked 
                        ? "bg-blue-50 border-blue-200 text-blue-600"
                        : "bg-white border-zinc-200 hover:bg-zinc-50 text-zinc-400 hover:text-zinc-600"
                    }`}
                    title={isBookmarked ? "Saved" : "Save Job"}
                  >
                    <FiBookmark className={`w-5 h-5 ${isBookmarked ? "fill-blue-600" : ""}`} />
                  </button>
                </div>
              </div>

              {/* Right Mockup Graphics */}
              <div className="lg:col-span-5 relative h-[280px] sm:h-[350px] w-full flex items-center justify-center">
                <div className="absolute w-[280px] h-[280px] rounded-full bg-blue-200/30 blur-[80px] pointer-events-none" />
                
                {/* 3D Glassmorphic Cards Stack */}
                <div 
                  className="relative w-full max-w-[320px] h-full"
                  style={{ perspective: 1000 }}
                >
                  {career.image ? (
                    <motion.div
                      initial={{ opacity: 0, rotateY: -10, rotateX: 5 }}
                      animate={{ opacity: 1, rotateY: -8, rotateX: 4 }}
                      whileHover={{ scale: 1.05, rotateY: 0, rotateX: 0 }}
                      className="absolute inset-0 bg-white border border-zinc-200 rounded-[2.5rem] overflow-hidden shadow-2xl p-4 flex flex-col justify-between"
                      style={{ transformStyle: "preserve-3d", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.08)" }}
                    >
                      <div className="w-full h-full rounded-[1.75rem] overflow-hidden bg-slate-50 border border-zinc-150 relative">
                        <img src={career.image} alt={career.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex flex-col justify-end p-6 text-white text-left">
                          <span className="text-[9px] font-black uppercase tracking-widest text-blue-300 mb-1">{career.department} Team</span>
                          <h4 className="text-base font-bold leading-tight truncate">{career.title}</h4>
                          <p className="text-[10px] text-zinc-300 font-semibold mt-1">{career.employmentType} • {career.location}</p>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <>
                      <div
                        className="absolute inset-0 bg-gradient-to-tr from-blue-50/50 to-indigo-50/20 border border-zinc-200/60 rounded-3xl p-6 shadow-xl flex flex-col justify-between"
                        style={{ transform: "rotateY(-15deg) rotateX(10deg) translateZ(-40px)", opacity: 0.6 }}
                      >
                        <div className="w-10 h-10 rounded-xl bg-zinc-50 border border-zinc-200" />
                        <div className="w-full h-2 bg-zinc-100 rounded-full" />
                      </div>

                      <div
                        className="absolute inset-0 bg-white/80 border border-zinc-200 rounded-3xl p-6 shadow-2xl flex flex-col justify-between"
                        style={{ transform: "rotateY(-8deg) rotateX(6deg) translateZ(0px)", boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.05)" }}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{career.department} Team</span>
                          <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600 font-bold text-xs">EDI</div>
                        </div>

                        <div className="space-y-3 pt-6">
                          <div className="text-lg font-bold text-zinc-950 tracking-tight leading-tight">{career.title}</div>
                          <div className="flex gap-2">
                            <span className="text-[10px] bg-zinc-100 px-2 py-0.5 rounded-full text-zinc-500 font-bold">{career.employmentType}</span>
                            <span className="text-[10px] bg-zinc-100 px-2 py-0.5 rounded-full text-zinc-500 font-bold">{career.location}</span>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </Container>
        </Section>

        {/* Info Strip */}
        <Section className="py-0">
          <Container className="px-6 sm:px-8 lg:px-14 xl:px-20">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 p-8 border border-zinc-200 bg-zinc-50/50 rounded-[2.5rem] shadow-sm">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Department</span>
                <div className="flex items-center gap-2 text-[14px] font-bold text-zinc-800">
                  <FiBriefcase className="w-4 h-4 text-blue-600 shrink-0" />
                  {career.department}
                </div>
              </div>
              
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Employment Type</span>
                <div className="flex items-center gap-2 text-[14px] font-bold text-zinc-800">
                  <FiClock className="w-4 h-4 text-blue-600 shrink-0" />
                  {career.employmentType}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Location</span>
                <div className="flex items-center gap-2 text-[14px] font-bold text-zinc-800">
                  <FiMapPin className="w-4 h-4 text-blue-600 shrink-0" />
                  {career.location}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Experience</span>
                <div className="flex items-center gap-2 text-[14px] font-bold text-zinc-800">
                  <FiTrendingUp className="w-4 h-4 text-blue-600 shrink-0" />
                  {career.experience}
                </div>
              </div>

              <div className="space-y-1 col-span-2 sm:col-span-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Date Posted</span>
                <div className="flex items-center gap-2 text-[14px] font-bold text-zinc-800">
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
                  <h2 className="text-[11px] font-black tracking-widest text-blue-600 uppercase">
                    / About the role /
                  </h2>
                  <h3 className="text-3xl font-bold tracking-tight text-zinc-950 leading-tight">
                    About the role
                  </h3>
                  <p className="text-zinc-500 text-base sm:text-lg leading-relaxed">
                    {career.aboutRole || `We are looking for a qualified candidate to step into the role of ${career.title}. You will have the opportunity to collaborate closely with our core team and define modern solutions for our clients.`}
                  </p>
                </div>

                {/* What you'll do */}
                {career.responsibilities && career.responsibilities.length > 0 && (
                  <div className="space-y-6">
                    <h2 className="text-[11px] font-black tracking-widest text-blue-600 uppercase">
                      / Responsibilities /
                    </h2>
                    <h3 className="text-3xl font-bold tracking-tight text-zinc-950 leading-tight">
                      What you'll do
                    </h3>
                    <ul className="space-y-4">
                      {career.responsibilities.map((resp, i) => (
                        <li key={i} className="flex items-start gap-4">
                          <div className="w-5 h-5 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 mt-1">
                            <FiCheck className="w-3.5 h-3.5 text-blue-600" />
                          </div>
                          <span className="text-zinc-600 text-[15px] sm:text-base leading-normal">
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
                    <h2 className="text-[11px] font-black tracking-widest text-blue-600 uppercase">
                      / Requirements /
                    </h2>
                    <h3 className="text-3xl font-bold tracking-tight text-zinc-950 leading-tight">
                      What we're looking for
                    </h3>
                    <ul className="space-y-4">
                      {career.requirements.map((req, i) => (
                        <li key={i} className="flex items-start gap-4">
                          <div className="w-5 h-5 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 mt-1">
                            <FiCheck className="w-3.5 h-3.5 text-blue-600" />
                          </div>
                          <span className="text-zinc-600 text-[15px] sm:text-base leading-normal">
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
                    <h2 className="text-[11px] font-black tracking-widest text-blue-600 uppercase">
                      / Nice to have /
                    </h2>
                    <h3 className="text-3xl font-bold tracking-tight text-zinc-950 leading-tight">
                      Nice to have
                    </h3>
                    <ul className="space-y-4">
                      {career.niceToHave.map((nice, i) => (
                        <li key={i} className="flex items-start gap-4">
                          <div className="w-5 h-5 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 mt-1">
                            <FiCheck className="w-3.5 h-3.5 text-blue-600" />
                          </div>
                          <span className="text-zinc-600 text-[15px] sm:text-base leading-normal">
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
                  <h4 className="text-lg font-bold text-zinc-950 tracking-tight">Job Details</h4>
                  
                  <div className="divide-y divide-zinc-100 text-sm">
                    <div className="py-3.5 flex justify-between gap-4">
                      <span className="text-zinc-400 font-semibold">Department</span>
                      <span className="text-zinc-800 font-bold">{career.department}</span>
                    </div>
                    <div className="py-3.5 flex justify-between gap-4">
                      <span className="text-zinc-400 font-semibold">Role</span>
                      <span className="text-zinc-800 font-bold">{career.title}</span>
                    </div>
                    <div className="py-3.5 flex justify-between gap-4">
                      <span className="text-zinc-400 font-semibold">Employment Type</span>
                      <span className="text-zinc-800 font-bold">{career.employmentType}</span>
                    </div>
                    <div className="py-3.5 flex justify-between gap-4">
                      <span className="text-zinc-400 font-semibold">Location</span>
                      <span className="text-zinc-800 font-bold">{career.location}</span>
                    </div>
                    <div className="py-3.5 flex justify-between gap-4">
                      <span className="text-zinc-400 font-semibold">Experience</span>
                      <span className="text-zinc-800 font-bold">{career.experience}</span>
                    </div>
                    <div className="py-3.5 flex justify-between gap-4">
                      <span className="text-zinc-400 font-semibold">Date Posted</span>
                      <span className="text-zinc-800 font-bold">{career.datePosted}</span>
                    </div>
                  </div>
                </div>

                {/* What We Offer Card */}
                <div className="p-8 border border-zinc-200 rounded-[2.5rem] bg-zinc-50/50 space-y-6">
                  <h4 className="text-lg font-bold text-zinc-950 tracking-tight">What we offer</h4>
                  
                  <div className="space-y-4">
                    {(career.benefits && career.benefits.length > 0 ? career.benefits : whyJoinEdihub).map((item, idx) => (
                      <div key={idx} className="flex gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200 flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                          {getBenefitIcon(item.icon)}
                        </div>
                        <div className="space-y-0.5">
                          <h5 className="text-[13px] font-bold text-zinc-900 leading-none">{item.title}</h5>
                          <p className="text-[11px] text-zinc-400 leading-normal">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </Section>

        {/* CTA Card Section */}
        <Section className="bg-white py-24 border-t border-zinc-100">
          <Container className="px-6 sm:px-8 lg:px-14 xl:px-20">
            <div className="relative overflow-hidden rounded-[3rem] border border-blue-100 bg-gradient-to-br from-blue-50/80 via-white to-blue-50/30 p-12 sm:p-16 md:p-24 text-center">
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-100/50 rounded-full blur-[100px] -z-10 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-50/80 rounded-full blur-[100px] -z-10 pointer-events-none" />

              <div className="relative max-w-2xl mx-auto space-y-8">
                <span className="text-[10px] font-black tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100/80 uppercase">
                  • Ready to Join?
                </span>
                
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-zinc-950 leading-none">
                  Let's build something amazing together.
                </h2>
                
                <p className="text-zinc-500 max-w-md mx-auto text-sm sm:text-base leading-relaxed">
                  If you're eager to build digital products that challenge the status quo, apply now or forward your resume details.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                  <button
                    onClick={() => setIsApplyOpen(true)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-zinc-950 hover:bg-zinc-850 text-white rounded-2xl text-xs font-black transition-all cursor-pointer active:scale-98"
                  >
                    Apply For This Position
                    <FiArrowUpRight className="w-4 h-4" />
                  </button>
                  
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
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative bg-white border border-zinc-200 rounded-[2.5rem] p-8 sm:p-10 max-w-xl w-full shadow-2xl max-h-[90vh] overflow-y-auto z-10"
            >
              {/* Close Button */}
              <button
                onClick={() => {
                  setIsApplyOpen(false);
                  setApplySuccess(false);
                  setApplyError("");
                }}
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-zinc-50 hover:bg-zinc-100 flex items-center justify-center text-zinc-400 hover:text-zinc-600 transition-colors border border-zinc-200"
              >
                <FiX className="w-5 h-5" />
              </button>

              {applySuccess ? (
                <div className="text-center py-10 space-y-6">
                  <div className="w-20 h-20 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto animate-bounce">
                    <FiCheck className="w-10 h-10 stroke-[2.5]" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-zinc-950">Application Submitted!</h3>
                    <p className="text-zinc-500 text-sm leading-relaxed max-w-xs mx-auto">
                      Thank you for applying for the <strong>{career.title}</strong> position. Our team will review your application and get in touch soon.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setIsApplyOpen(false);
                      setApplySuccess(false);
                    }}
                    className="px-8 py-3 bg-zinc-950 hover:bg-zinc-850 text-white rounded-xl text-xs font-bold transition-all"
                  >
                    Close Window
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplySubmit} className="space-y-6">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-blue-600 bg-blue-50 border border-blue-100/55 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      Apply Now
                    </span>
                    <h3 className="text-2xl font-black text-zinc-950 leading-tight">
                      Join us as a <br />{career.title}
                    </h3>
                  </div>

                  {applyError && (
                    <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-bold flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                      {applyError}
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-500 uppercase">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={formFields.name}
                        onChange={(e) => setFormFields({ ...formFields, name: e.target.value })}
                        placeholder="e.g. Jane Doe"
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3 px-4 text-xs font-bold text-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 focus:bg-white transition-all"
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-zinc-500 uppercase">Email Address *</label>
                        <input
                          type="email"
                          required
                          value={formFields.email}
                          onChange={(e) => setFormFields({ ...formFields, email: e.target.value })}
                          placeholder="e.g. jane@example.com"
                          className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3 px-4 text-xs font-bold text-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 focus:bg-white transition-all"
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-zinc-500 uppercase">Phone Number *</label>
                        <input
                          type="tel"
                          required
                          value={formFields.phone}
                          onChange={(e) => setFormFields({ ...formFields, phone: e.target.value })}
                          placeholder="e.g. +1 555 123 456"
                          className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3 px-4 text-xs font-bold text-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 focus:bg-white transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-500 uppercase">Resume/CV URL *</label>
                      <input
                        type="url"
                        required
                        value={formFields.resumeUrl}
                        onChange={(e) => setFormFields({ ...formFields, resumeUrl: e.target.value })}
                        placeholder="Link to PDF (Google Drive, Dropbox, etc.)"
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3 px-4 text-xs font-bold text-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 focus:bg-white transition-all"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-zinc-500 uppercase">Cover Letter / Message</label>
                      <textarea
                        rows={4}
                        value={formFields.coverLetter}
                        onChange={(e) => setFormFields({ ...formFields, coverLetter: e.target.value })}
                        placeholder="Tell us why you are a great fit..."
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl py-3 px-4 text-xs font-bold text-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 focus:bg-white transition-all resize-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={formSubmitting}
                    className="w-full inline-flex items-center justify-center gap-2 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-300 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-blue-600/10 cursor-pointer"
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
