import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
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
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { getApiUrl } from "@/utils/api";

type Project = {
  title: string;
  tags: string[];
  slug: string;
  image: string;
};

const header = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.22,
    },
  },
};

const headerItem = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

const imageMap: Record<string, string> = {
  "pexels-1.webp": pexels1,
  "pexels-2.webp": pexels2,
  "pexels-3.webp": pexels3,
  "pexels-4.webp": pexels4,
  "pexels-5.webp": pexels5,
};

const customImageMap: Record<string, string> = {
  "arrows": arrowsImg,
  "chantalle": chantalleImg,
  "papyrus": papyrusImg,
  "london-museum": londonMuseumImg,
  "bullseye": bullseyeImg,
  "interference": interferenceImg,
};

function ProjectCard({
  project,
  i,
  wrapper,
  media,
  stagger,
}: {
  project: Project;
  i: number;
  wrapper: string;
  media: string;
  stagger: string;
}) {
  return (
    <motion.div
      key={project.slug}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.04 * i, ease: "easeOut" }}
      className={`group relative block rounded-[28px] bg-white ${wrapper} ${stagger}`}
    >
      <Link to={`/projects/${project.slug}`}>
        <div
          className={`relative w-full overflow-hidden rounded-[28px] bg-zinc-200 ${media}`}
        >
          <motion.img
            src={customImageMap[project.slug] || imageMap[project.image] || project.image}
            alt={project.title}
            loading="lazy"
            className="h-full w-full object-cover object-center"
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
          />

          <div className="pointer-events-none absolute bottom-4 right-4 opacity-0 transition-all duration-200 group-hover:opacity-100">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-white shadow-[0_8px_24px_rgba(0,0,0,0.14)]">
              <svg
                className="h-5 w-5 text-[#0066FF]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7m0 0H7m10 0v10" />
              </svg>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 px-1 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
          <h3 className="text-[18px] font-semibold leading-[1.15] tracking-[-0.02em] text-black sm:text-[20px]">
            {project.title}
          </h3>
          <div className="flex flex-wrap gap-2 sm:justify-end">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-black/20 bg-white px-3 py-1 text-[12px] font-medium leading-none text-black/65"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function Projects() {
  const ref = useRef(null);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const apiUrl = getApiUrl();
    fetch(`${apiUrl}/projects`)
      .then((res) => res.json())
      .then((data: Project[]) => {
        // Only show default template projects on the home page showcase
        const defaultSlugs = ["arrows", "chantalle", "papyrus", "london-museum", "bullseye", "interference"];
        const filtered = data.filter((p) => defaultSlugs.includes(p.slug));
        setProjects(filtered);
      })
      .catch((err) => console.error("Error fetching projects:", err));
  }, []);

  const variants = useMemo(
    () => [
      {
        wrapper: "lg:col-span-5",
        media: "h-[260px] sm:h-[300px] lg:h-[360px]",
      },
      {
        wrapper: "sm:col-span-2 lg:col-span-7",
        media: "h-[280px] sm:h-[340px] lg:h-[420px]",
      },
      {
        wrapper: "lg:col-span-4",
        media: "h-[280px] sm:h-[320px] lg:h-[400px]",
      },
      {
        wrapper: "lg:col-span-8",
        media: "h-[300px] sm:h-[360px] lg:h-[480px]",
      },
      {
        wrapper: "lg:col-span-8",
        media: "h-[320px] sm:h-[380px] lg:h-[520px]",
      },
      {
        wrapper: "lg:col-span-4",
        media: "h-[260px] sm:h-[320px] lg:h-[420px]",
      },
    ],
    [],
  );

  const shuffled = useMemo(() => {
    if (projects.length === 0) return [];
    const list = [...projects];
    for (let i = list.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = list[i];
      list[i] = list[j];
      list[j] = tmp;
    }
    return list;
  }, [projects]);

  if (projects.length === 0) return null;

  return (
    <Section id="projects" className="bg-white">
      <Container>
        <div ref={ref} className="grid gap-10 lg:gap-12">
          <div className="lg:pl-[100px]">
            <motion.div
              variants={header}
              initial="hidden"
              animate="show"
            >
              <motion.span
                variants={headerItem}
                className="text-[12px] font-black uppercase tracking-[0.1em] text-black/60"
              >
                / Our projects
              </motion.span>
              <motion.h2
                variants={headerItem}
                className="mt-6 text-[36px] font-semibold leading-[1.05] tracking-[-1.5px] sm:tracking-[-3.8px] text-black sm:text-[64px] lg:text-[76px] text-balance"
                style={{ textWrap: "balance" }}
              >
                Our recent projects
              </motion.h2>
              <motion.p
                variants={headerItem}
                className="mt-5 max-w-[56ch] text-[16px] leading-[1.6] text-black/55 sm:text-[17px] lg:text-[18px]"
              >
                Dive into our diverse collection of innovative projects, where creativity meets cutting-edge technology to solve real-world challenges.
              </motion.p>

              <Link
                to="/projects"
                className="group mt-7 inline-flex items-center gap-2 text-[15px] font-semibold text-black underline decoration-black/30 underline-offset-4 transition-colors hover:decoration-black/60 sm:text-[16px]"
              >
                All projects
                <svg
                  className="h-4 w-4 shrink-0 text-[#0066FF] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7m0 0H7m10 0v10" />
                </svg>
              </Link>
            </motion.div>
          </div>

          <div className="mt-20 grid gap-10 px-2 sm:grid-cols-2 sm:px-4 lg:mt-82 lg:grid-flow-dense lg:grid-cols-12 lg:gap-x-[100px] lg:gap-y-[260px] lg:px-[100px]">
            {shuffled.map((project, i) => {
              const v = variants[i % variants.length];
              const stagger =
                i % 4 === 1 ? "lg:mt-[-200px]" : i % 4 === 2 ? "lg:mt-[-180px]" : "";

              return (
                <ProjectCard
                  key={project.slug}
                  project={project}
                  i={i}
                  wrapper={v.wrapper}
                  media={v.media}
                  stagger={stagger}
                />
              );
            })}
          </div>
        </div>
      </Container>
    </Section>
  );
}
