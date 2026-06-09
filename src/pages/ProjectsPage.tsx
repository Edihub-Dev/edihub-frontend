import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Footer } from "@/components/layout/Footer";
import { CtaSection } from "@/components/sections/CtaSection";
import { getApiUrl } from "@/utils/api";

import pexels1 from "@/assets/projects/pexels-1.webp";
import pexels2 from "@/assets/projects/pexels-2.webp";
import pexels3 from "@/assets/projects/pexels-3.webp";
import pexels4 from "@/assets/projects/pexels-4.webp";
import pexels5 from "@/assets/projects/pexels-5.webp";

import arrowsImg from "@/assets/projects/arrows.webp";
import chantalleImg from "@/assets/projects/chantalle.webp";
import papyrusImg from "@/assets/projects/papyrus.webp";
import londonMuseumImg from "@/assets/projects/london-museum.webp";
import bullseyeImg from "@/assets/projects/bullseye.webp";
import interferenceImg from "@/assets/projects/interference.webp";

const imageMap: Record<string, string> = {
  "pexels-1.webp": pexels1,
  "pexels-2.webp": pexels2,
  "pexels-3.webp": pexels3,
  "pexels-4.webp": pexels4,
  "pexels-5.webp": pexels5,
};

type Project = {
  title: string;
  tags: string[];
  slug: string;
  image: string;
  category: string;
  client: string;
  year: string;
  description: string;
};

const customImageMap: Record<string, string> = {
  "arrows": arrowsImg,
  "chantalle": chantalleImg,
  "papyrus": papyrusImg,
  "london-museum": londonMuseumImg,
  "bullseye": bullseyeImg,
  "interference": interferenceImg,
};

const slugOrder = ["arrows", "chantalle", "papyrus", "london-museum", "bullseye", "interference"];

const list = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl = getApiUrl();
    fetch(`${apiUrl}/projects`)
      .then((res) => res.json())
      .then((data: Project[]) => {
        // Sort projects to match the exact EDIHUB template order, placing custom ones at the end
        const sorted = [...data].sort((a, b) => {
          const idxA = slugOrder.indexOf(a.slug) === -1 ? 9999 : slugOrder.indexOf(a.slug);
          const idxB = slugOrder.indexOf(b.slug) === -1 ? 9999 : slugOrder.indexOf(b.slug);
          return idxA - idxB;
        });
        setProjects(sorted);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching projects:", err);
        setLoading(false);
      });
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0066FF] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Top Padding for fixed Navbar */}
      <main className="pt-32 md:pt-44 lg:pt-52">
        {/* Hero Header Section */}
        <Section className="pb-10 pt-8">
          <Container className="px-6 sm:px-8 lg:px-14 xl:px-20">
            <div className="grid gap-8 lg:grid-cols-12 lg:gap-14 lg:items-end">
              {/* Left Column: Heading */}
              <div className="lg:col-span-8">
                <motion.h1 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  className="text-[44px] font-semibold leading-[0.98] tracking-[-0.07em] text-black sm:text-[58px] md:text-[72px] lg:text-[84px]"
                >
                  Discover our
                  <br />
                  recent projects
                </motion.h1>
              </div>
              
              {/* Right Column: Paragraph */}
              <div className="lg:col-span-4 lg:pb-3">
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
                  className="text-[16px] leading-[1.65] text-[#4B5563] sm:text-[18px] max-w-[36ch] lg:max-w-none font-medium text-black/60"
                >
                  Explore how we've helped ambitious businesses transform their digital presence through thoughtfully crafted websites and applications that deliver meaningful results.
                </motion.p>
              </div>
            </div>
          </Container>
        </Section>

        {/* 2-Column Projects Grid Section */}
        <Section className="pb-24 pt-12 md:pb-32 lg:pb-44">
          <Container className="px-6 sm:px-8 lg:px-14 xl:px-20">
            <motion.div 
              variants={list}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:gap-x-12 lg:gap-y-24"
            >
              {projects.map((project) => {
                const projectImage = customImageMap[project.slug] || imageMap[project.image] || project.image;
                return (
                  <motion.div
                    key={project.slug}
                    variants={item}
                    className="group"
                  >
                    <Link to={`/projects/${project.slug}`} className="block">
                      {/* Image Container with Zoom Effect */}
                      <div className="aspect-[4/3] w-full overflow-hidden rounded-[24px] md:rounded-[32px] bg-zinc-50 relative shadow-sm transition-all duration-500 hover:shadow-lg">
                        <img
                          src={projectImage}
                          alt={project.title}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-700 ease-[0.33,1,0.68,1] group-hover:scale-105"
                        />
                        {/* Soft overlay on hover */}
                        <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/[0.02]" />
                      </div>

                      {/* Text & Tags Row */}
                      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-1">
                        <h3 className="text-[20px] font-semibold tracking-tight text-black sm:text-[24px] group-hover:text-[#0066FF] transition-colors duration-300">
                          {project.title}
                        </h3>
                        <div className="flex flex-wrap gap-2 sm:justify-end">
                          {project.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full border border-black/15 bg-white px-3 py-1.5 text-[12px] font-medium leading-none text-black/60 transition-all duration-300 group-hover:border-black/30 group-hover:text-black"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          </Container>
        </Section>

        {/* CTA "Let's build something" section */}
        <CtaSection />
      </main>

      <Footer />
    </div>
  );
}
