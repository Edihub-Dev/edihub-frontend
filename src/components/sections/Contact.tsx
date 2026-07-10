import { motion } from "framer-motion";
import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { ScrollRevealText } from "@/components/ui/ScrollRevealText";
import { getApiUrl } from "@/utils/api";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";

const countryCodes = [
  { code: "+91", label: "IN (+91)" },
  { code: "+1", label: "US (+1)" },
  { code: "+44", label: "UK (+44)" },
  { code: "+61", label: "AU (+61)" },
  { code: "+971", label: "UAE (+971)" },
  { code: "+81", label: "JP (+81)" },
  { code: "+49", label: "DE (+49)" },
  { code: "+33", label: "FR (+33)" },
];

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    countryCode: "+91",
    phone: "",
    projectInfo: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const payload = {
        ...formData,
        phone: formData.phone ? `${formData.countryCode} ${formData.phone}` : "",
      };

      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", countryCode: "+91", phone: "", projectInfo: "" });
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setStatus("error");
    }
  };

  return (
    <Section id="contact" className="bg-white py-24 lg:py-32">
      <Container className="px-6 sm:px-8 lg:px-14 xl:px-20">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-24">

          {/* Left Column: Contact Information */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <ScrollRevealText
                text="EDIHUB"
                as="h2"
                className="text-[28px] font-bold tracking-tight text-[#111827]"
              />

              <div className="mt-10 sm:mt-16 space-y-5 sm:space-y-6">
                {/* Email Card */}
                <div className="group/item flex items-start gap-4 p-4.5 rounded-2xl border border-zinc-100 bg-zinc-50/50 hover:bg-white hover:shadow-xl hover:shadow-zinc-200/50 hover:border-[#0066FF]/25 transition-all duration-300">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white border border-zinc-200 text-[#4B5563] group-hover/item:bg-[#0066FF] group-hover/item:text-white group-hover/item:border-[#0066FF] shadow-sm transition-all duration-300">
                    <FiMail className="h-5.5 w-5.5" />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#9CA3AF]">
                      E-mail
                    </h4>
                    <a
                      href="mailto:contact@edihub.com"
                      className="mt-1 block text-[16px] sm:text-[18px] font-semibold text-[#111827] hover:text-[#0066FF] transition-colors break-all"
                    >
                      contact@edihub.com
                    </a>
                  </div>
                </div>

                {/* Phone Card */}
                <div className="group/item flex items-start gap-4 p-4.5 rounded-2xl border border-zinc-100 bg-zinc-50/50 hover:bg-white hover:shadow-xl hover:shadow-zinc-200/50 hover:border-[#0066FF]/25 transition-all duration-300">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white border border-zinc-200 text-[#4B5563] group-hover/item:bg-[#0066FF] group-hover/item:text-white group-hover/item:border-[#0066FF] shadow-sm transition-all duration-300">
                    <FiPhone className="h-5.5 w-5.5" />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#9CA3AF]">
                      Phone
                    </h4>
                    <a
                      href="tel:+15551234567"
                      className="mt-1 block text-[16px] sm:text-[18px] font-semibold text-[#111827] hover:text-[#0066FF] transition-colors"
                    >
                      +1 (555) 123-4567
                    </a>
                  </div>
                </div>

                {/* Address Card */}
                <div className="group/item flex items-start gap-4 p-4.5 rounded-2xl border border-zinc-100 bg-zinc-50/50 hover:bg-white hover:shadow-xl hover:shadow-zinc-200/50 hover:border-[#0066FF]/25 transition-all duration-300">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white border border-zinc-200 text-[#4B5563] group-hover/item:bg-[#0066FF] group-hover/item:text-white group-hover/item:border-[#0066FF] shadow-sm transition-all duration-300">
                    <FiMapPin className="h-5.5 w-5.5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#9CA3AF]">
                      Address
                    </h4>
                    <a
                      href="https://maps.google.com/maps?q=26.90553351017583,75.70276965802596"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 block text-[16px] sm:text-[18px] font-semibold leading-relaxed text-[#111827] hover:text-[#0066FF] transition-colors"
                    >
                      <span className="text-[#111827] block font-bold text-[17px] sm:text-[19px] mb-0.5 group-hover/item:text-[#0066FF] transition-colors">Vaishali Estate</span>
                      <span className="text-zinc-500 block font-normal text-[14px] sm:text-[15px]">Jaipur, Rajasthan, India</span>
                    </a>
                  </div>
                </div>
              </div>
                 <div className="mt-12 group relative overflow-hidden rounded-[2.5rem] border border-zinc-200 bg-white shadow-2xl transition-all duration-500 hover:border-[#0066FF]/40">
                  {/* Grid Overlay for high-tech architectural vibe */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000004_1px,transparent_1px),linear-gradient(to_bottom,#00000004_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-10" />

                  {/* High-tech Glowing Accent Ambient Light */}
                  <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-[#0066FF]/8 blur-[100px] transition-all duration-700 group-hover:bg-[#0066FF]/15 pointer-events-none" />
                  <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-[#0066FF]/3 blur-[100px] transition-all duration-700 group-hover:bg-[#0066FF]/8 pointer-events-none" />

                  {/* HUD Corner Brackets */}
                  <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-[#0066FF]/30 pointer-events-none z-15 transition-all duration-500 group-hover:border-[#0066FF]/80 group-hover:scale-105" />
                  <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-[#0066FF]/30 pointer-events-none z-15 transition-all duration-500 group-hover:border-[#0066FF]/80 group-hover:scale-105" />
                  <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-[#0066FF]/30 pointer-events-none z-15 transition-all duration-500 group-hover:border-[#0066FF]/80 group-hover:scale-105" />
                  <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-[#0066FF]/30 pointer-events-none z-15 transition-all duration-500 group-hover:border-[#0066FF]/80 group-hover:scale-105" />

                  {/* Sonar Laser Scanning Line Sweep */}
                  <div className="absolute left-0 right-0 h-[2.5px] bg-gradient-to-r from-transparent via-[#0066FF]/80 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-sonar-scan pointer-events-none z-15 shadow-[0_0_10px_rgba(0,102,255,0.6)]" />

                  {/* Central Radar Crosshair Targeting Scanner */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                    <div className="relative flex h-24 w-24 items-center justify-center">
                      {/* Ripple Rings */}
                      <span className="absolute inline-flex h-full w-full rounded-full bg-[#0066FF]/5 animate-[ping_2.5s_infinite] opacity-75" />
                      <span className="absolute inline-flex h-16 w-16 rounded-full bg-[#0066FF]/8 animate-[ping_1.8s_infinite] opacity-60" />
                      <span className="absolute inline-flex h-8 w-8 rounded-full bg-[#0066FF]/10 animate-pulse" />
                      
                      {/* Target Crosshair Marks */}
                      <div className="absolute h-8 w-[1.5px] bg-[#0066FF]/30 group-hover:bg-[#0066FF]/70 transition-colors duration-300" />
                      <div className="absolute w-8 h-[1.5px] bg-[#0066FF]/30 group-hover:bg-[#0066FF]/70 transition-colors duration-300" />
                      
                      {/* Glowing core indicator */}
                      <div className="relative h-3 w-3 rounded-full bg-[#0066FF] border-2 border-white shadow-[0_0_12px_rgba(0,102,255,0.8)]" />
                    </div>
                  </div>

                  {/* Floating Glassmorphic Top Controls Panel */}
                  <div className="absolute top-4 left-4 right-4 sm:top-5 sm:left-5 sm:right-5 z-20 flex items-center justify-between gap-2 pointer-events-none">
                    <a
                      href="https://maps.google.com/maps?q=26.90553351017583,75.70276965802596"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-full bg-white/90 px-3 py-2 text-[10px] sm:px-4.5 sm:py-2.5 sm:text-[12px] font-bold text-zinc-950 backdrop-blur-md border border-white/60 shadow-lg pointer-events-auto hover:text-[#0066FF] transition-colors whitespace-nowrap"
                    >
                      <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5 shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0066FF] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-[#0066FF]"></span>
                      </span>
                      EDIHUB — JAIPUR HQ
                    </a>

                    <a
                      href="https://maps.google.com/maps?q=26.90553351017583,75.70276965802596"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hidden sm:inline-block rounded-full bg-white/90 px-4 py-2.5 text-[11px] font-mono font-bold tracking-widest text-[#4B5563] backdrop-blur-md border border-white/60 shadow-lg pointer-events-auto hover:text-[#0066FF] transition-colors whitespace-nowrap"
                    >
                      26.9055° N, 75.7028° E
                    </a>
                  </div>

                  {/* Floating Bottom Navigation Bar */}
                  <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-5 z-20 flex items-center justify-between gap-2 pointer-events-none">
                    <div className="flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-2 text-[9px] sm:px-4 sm:py-2.5 sm:text-[11px] font-semibold text-zinc-600 backdrop-blur-md border border-white/60 shadow-lg pointer-events-auto whitespace-nowrap">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                      SYSTEM ONLINE
                    </div>

                    <a
                      href="https://maps.google.com/maps?q=26.90553351017583,75.70276965802596"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/btn flex items-center gap-1.5 rounded-full bg-[#0066FF] hover:bg-black px-3.5 py-2 text-[10px] sm:px-5 sm:py-2.5 sm:text-[12px] font-bold text-white transition-all duration-300 shadow-lg shadow-[#0066FF]/20 pointer-events-auto whitespace-nowrap"
                    >
                      NAVIGATE
                      <svg width="11" height="11" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 shrink-0">
                        <path d="M3 9L9 3M9 3H4.5M9 3V7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </a>
                  </div>

                  <iframe
                    src="https://maps.google.com/maps?q=26.90553351017583,75.70276965802596&t=&z=15&ie=UTF8&iwloc=&output=embed"
                    width="100%"
                    height="380"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Google Map Location"
                    className="opacity-80 transition-all duration-700 ease-out grayscale-[0.9] brightness-[1.04] contrast-[1.02] group-hover:grayscale-[0.2] group-hover:brightness-[1.0] group-hover:contrast-[1.05] group-hover:opacity-100"
                  />
                </div>
              </motion.div>
            </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <ScrollRevealText
                text="Got a project in mind? We'd love to hear about it. Big or small, we're here to help bring your ideas to life."
                as="h3"
                className="text-[36px] font-semibold leading-[1.1] tracking-[-0.04em] text-[#111827] sm:text-[44px] md:text-[56px]"
              />

              <form onSubmit={handleSubmit} className="mt-20 space-y-12">
                <div className="grid gap-12 sm:grid-cols-2">
                  <div className="relative">
                    <input
                      type="text"
                      id="name"
                      required
                      placeholder="Name *"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full border-b border-[#E5E7EB] bg-transparent py-4 text-[18px] font-medium text-[#111827] outline-none transition-colors focus:border-[#0066FF] placeholder:text-[#9CA3AF]"
                    />
                  </div>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      required
                      placeholder="E-mail *"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full border-b border-[#E5E7EB] bg-transparent py-4 text-[18px] font-medium text-[#111827] outline-none transition-colors focus:border-[#0066FF] placeholder:text-[#9CA3AF]"
                    />
                  </div>
                </div>

                <div className="relative flex gap-4 border-b border-[#E5E7EB] transition-colors focus-within:border-[#0066FF]">
                  <select
                    value={formData.countryCode}
                    onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                    className="bg-transparent py-4 text-[18px] font-medium text-[#111827] outline-none cursor-pointer"
                  >
                    {countryCodes.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.code}
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    id="phone"
                    required
                    placeholder="Contact Number *"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="flex-1 bg-transparent py-4 text-[18px] font-medium text-[#111827] outline-none placeholder:text-[#9CA3AF]"
                  />
                </div>

                <div className="relative">
                  <textarea
                    id="projectInfo"
                    required
                    placeholder="Project Information *"
                    rows={4}
                    value={formData.projectInfo}
                    onChange={(e) => setFormData({ ...formData, projectInfo: e.target.value })}
                    className="w-full resize-none border-b border-[#E5E7EB] bg-transparent py-4 text-[18px] font-medium text-[#111827] outline-none transition-colors focus:border-[#0066FF] placeholder:text-[#9CA3AF]"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="group flex items-center gap-2 border-b-2 border-[#111827] pb-1 text-[18px] font-bold text-[#111827] transition-all hover:border-[#0066FF] hover:text-[#0066FF] disabled:opacity-50"
                  >
                    {status === "sending" ? "Sending..." : "Send message"}
                    <span className="inline-block transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4.5 13.5L13.5 4.5M13.5 4.5H6.75M13.5 4.5V11.25" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </button>

                  {status === "success" && (
                    <motion.p
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-[16px] font-bold text-green-600"
                    >
                      ✓ Message sent successfully!
                    </motion.p>
                  )}
                  {status === "error" && (
                    <motion.p
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-[16px] font-bold text-red-600"
                    >
                      ✕ Failed to send. Please try again.
                    </motion.p>
                  )}
                </div>
              </form>
            </motion.div>
          </div>

        </div>
      </Container>
    </Section>
  );
}
