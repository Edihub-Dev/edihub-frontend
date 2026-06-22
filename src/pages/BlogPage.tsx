import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Footer } from "@/components/layout/Footer";
import { CtaSection } from "@/components/sections/CtaSection";
import { getApiUrl } from "@/utils/api";

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
              <div className="grid grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-4 lg:gap-8">
                {topBlogs.map((blog, index) => {
                  const isFeatured = index === 0;
                  return (
                    <motion.div
                      key={blog.slug}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className={`group ${
                        isFeatured 
                          ? "md:col-span-2 xl:col-span-2" 
                          : "col-span-1 md:col-span-1 xl:col-span-1"
                      }`}
                    >
                      <Link to={`/blog/${blog.slug}`} className="block h-full">
                        {/* Image Container with Zoom effect */}
                        <div className={`overflow-hidden rounded-[20px] bg-zinc-50 relative shadow-sm transition-all duration-500 group-hover:shadow-md ${isFeatured ? "aspect-[16/10]" : "aspect-[1.4]"}`}>
                          <img
                            src={blog.image}
                            alt={blog.title}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-700 ease-[0.33,1,0.68,1] group-hover:scale-104"
                          />
                        </div>

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
                    <h2 className="text-[36px] font-semibold tracking-[-0.04em] text-black sm:text-[44px]">
                      More articles
                    </h2>
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
                        className="group flex items-center justify-between py-6 sm:py-8 border-b border-zinc-200/80 transition-colors"
                      >
                        <div className="flex items-center gap-6 flex-1 pr-6">
                          {/* Thumbnail */}
                          <div className="h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-zinc-50 relative shadow-sm">
                            <img
                              src={blog.image}
                              alt={blog.title}
                              className="h-full w-full object-cover transition-transform duration-700 ease-[0.33,1,0.68,1] group-hover:scale-105"
                            />
                          </div>

                          {/* Date */}
                          <p className="text-[13px] font-semibold text-zinc-400 w-24 sm:w-32 shrink-0">
                            {blog.date}
                          </p>

                          {/* Title */}
                          <h3 className="text-[16px] sm:text-[18px] font-semibold leading-snug text-black group-hover:text-[#0066FF] transition-colors duration-300 line-clamp-1 flex-1">
                            {blog.title}
                          </h3>
                        </div>

                        {/* Arrow Link Indicator */}
                        <div className="h-10 w-10 shrink-0 rounded-full flex items-center justify-center bg-zinc-150/40 text-black group-hover:bg-[#0066FF]/10 group-hover:text-[#0066FF] transition-all duration-300">
                          <svg className="h-4.5 w-4.5 transform transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7m0 0H7m10 0v10" />
                          </svg>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Load More Button */}
                  {visibleCount < listBlogs.length && (
                    <div className="mt-8">
                      <button
                        onClick={() => setVisibleCount((prev) => prev + 3)}
                        className="text-[15px] font-bold text-black hover:text-[#0066FF] transition-colors duration-300 border-b border-black hover:border-[#0066FF] pb-0.5"
                      >
                        Load More +
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
