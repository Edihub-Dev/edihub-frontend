import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Footer } from "@/components/layout/Footer";
import { CtaSection } from "@/components/sections/CtaSection";
import { ParallaxImage } from "@/components/ui/ParallaxImage";
import { getApiUrl } from "@/utils/api";
import { ScrollRevealText } from "@/components/ui/ScrollRevealText";

type Blog = {
  title: string;
  slug: string;
  category: string;
  tags: string[];
  author: string;
  date: string;
  readTime: string;
  excerpt: string;
  content: string;
  image: string;
};

export function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [visibleCount, setVisibleCount] = useState(4); // Default to showing 4 in the list view, load more shows the rest
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl = getApiUrl();
    fetch(`${apiUrl}/blogs`)
      .then((res) => res.json())
      .then((data: Blog[]) => {
        setBlogs(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching blogs:", err);
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

  // Split into Top Grid (first 3) and List View (rest)
  const topBlogs = blogs.slice(0, 3);
  const listBlogs = blogs.slice(3);
  const visibleListBlogs = listBlogs.slice(0, visibleCount);

  return (
    <div className="bg-white font-sans selection:bg-blue-600/10 selection:text-blue-600">
      <main className="pt-32 md:pt-40 lg:pt-44">
        {/* Header Section */}
        <Section className="pb-16 pt-8">
          <Container>
            <div className="grid gap-8 lg:grid-cols-12 lg:gap-14 lg:items-end">
              <div className="lg:col-span-8">
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  className="text-[48px] font-semibold leading-[1.05] tracking-[-0.05em] text-black sm:text-[62px] md:text-[76px]"
                >
                  Fresh insights &
                  <br />
                  industry perspectives
                </motion.h1>
              </div>
              <div className="lg:col-span-4 lg:pb-3">
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
                  className="text-[15px] leading-[1.65] text-[#52525b] sm:text-[16px] max-w-[32ch] lg:max-w-none font-medium"
                >
                  Dive into our latest thinking on web development, digital strategy, and industry trends to help shape your next digital move and stay ahead of what's coming.
                </motion.p>
              </div>
            </div>
          </Container>
        </Section>

        {/* Top 3 Blogs Grid (4-Column Layout) */}
        {topBlogs.length > 0 && (
          <Section className="pb-24 pt-0">
            <Container>
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-8">
                {topBlogs.map((blog, index) => {
                  return (
                    <motion.div
                      key={blog.slug}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="group col-span-1"
                    >
                      <Link to={`/blog/${blog.slug}`} className="block h-full">
                        {/* Image Container with Zoom effect & Parallax */}
                        <ParallaxImage
                          src={blog.image}
                          alt={blog.title}
                          loading="lazy"
                          containerClassName="rounded-[20px] bg-zinc-50 shadow-sm transition-all duration-500 group-hover:shadow-md aspect-[16/10]"
                          className="transition-transform duration-700 ease-[0.33,1,0.68,1] group-hover:scale-104"
                          offset={30}
                        />

                        {/* Date and Title */}
                        <div className="mt-5 px-1">
                          <p className="text-[12px] font-semibold text-zinc-400">
                            {blog.date}
                          </p>
                          <h3 className="mt-2 text-[20px] font-semibold leading-[1.3] tracking-tight text-black group-hover:text-[#0066FF] transition-colors duration-300">
                            {blog.title}
                          </h3>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </Container>
          </Section>
        )}

        {/* Bottom Section: "More articles" */}
        {listBlogs.length > 0 && (
          <Section className="pb-32 pt-16 border-t border-zinc-100">
            <Container>
              <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-16 gap-12">
                {/* Left Side Static Info Column */}
                <div className="lg:col-span-4">
                  <div className="sticky top-32">
                    <ScrollRevealText
                      text="More articles"
                      as="h2"
                      className="text-[36px] font-semibold tracking-[-0.04em] text-black sm:text-[44px]"
                    />
                    <p className="mt-5 text-[15px] leading-relaxed text-[#52525b] font-medium max-w-[28ch]">
                      Explore more insights from our team to deepen your understanding of digital strategy and web development best practices.
                    </p>
                  </div>
                </div>

                {/* Right Side Articles List Column */}
                <div className="lg:col-span-8">
                  <div className="flex flex-col">
                    {visibleListBlogs.map((blog) => (
                      <Link
                        key={blog.slug}
                        to={`/blog/${blog.slug}`}
                        className="group flex flex-col sm:flex-row items-start sm:items-center justify-between py-8 sm:py-10 border-b border-zinc-200/80 transition-colors gap-6"
                      >
                        <div className="flex items-start gap-6 sm:gap-8 flex-1">
                          {/* Larger Thumbnail with Zoom effect & Parallax */}
                          <ParallaxImage
                            src={blog.image}
                            alt={blog.title}
                            containerClassName="w-[120px] sm:w-[180px] lg:w-[220px] aspect-[16/10] shrink-0 rounded-2xl bg-zinc-50 shadow-sm border border-neutral-100"
                            className="transition-transform duration-700 ease-[0.33,1,0.68,1] group-hover:scale-105"
                            offset={25}
                          />

                          <div className="flex-1 min-w-0">
                            {/* Meta: Date & Read Time */}
                            <div className="flex items-center gap-3 text-[12px] font-bold uppercase tracking-wider text-[#0066FF]">
                              <span>{blog.date}</span>
                              <span className="h-1 w-1 rounded-full bg-zinc-300" />
                              <span className="text-zinc-400 font-medium normal-case tracking-normal">{blog.readTime || "5 min read"}</span>
                            </div>

                            {/* Large Title */}
                            <h3 className="mt-3 text-[22px] sm:text-[28px] lg:text-[34px] font-semibold leading-[1.15] tracking-tight text-black group-hover:text-[#0066FF] transition-colors duration-300">
                              {blog.title}
                            </h3>

                            {/* Excerpt */}
                            {blog.excerpt && (
                              <p className="mt-3 text-[14px] sm:text-[15px] leading-relaxed text-zinc-500 line-clamp-2 max-w-[55ch] font-medium hidden md:block">
                                {blog.excerpt}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Arrow Link Indicator */}
                        <div className="h-12 w-12 shrink-0 rounded-full flex items-center justify-center bg-zinc-100 text-black group-hover:bg-[#0066FF] group-hover:text-white transition-all duration-300 shadow-sm self-end sm:self-center">
                          <svg className="h-5 w-5 transform transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7m0 0H7m10 0v10" />
                          </svg>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Load More Button */}
                  {visibleCount < listBlogs.length && (
                    <div className="mt-12 text-left">
                      <button
                        onClick={() => setVisibleCount((prev) => prev + 3)}
                        className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-6 py-3 text-[14px] font-bold uppercase tracking-wider text-black transition-all duration-300 hover:bg-black hover:text-white hover:border-black hover:scale-105 active:scale-95 shadow-sm cursor-pointer"
                      >
                        Load More Articles
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </Container>
          </Section>
        )}
      </main>

      <CtaSection />
      <Footer />
    </div>
  );
}
