import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
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

export function BlogDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl = getApiUrl();
    fetch(`${apiUrl}/blogs`)
      .then((res) => res.json())
      .then((data: Blog[]) => {
        setBlogs(data);
        const found = data.find((b) => b.slug === slug);
        if (found) {
          setBlog(found);
        } else {
          navigate("/blog");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching blog details:", err);
        setLoading(false);
      });
      
    window.scrollTo(0, 0);
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#0066FF] border-t-transparent" />
      </div>
    );
  }

  if (!blog) return null;

  // Custom renderer for simple markdown-like content in the json
  const renderContent = (text: string) => {
    return text.split('\n\n').map((paragraph, index) => {
      if (paragraph.startsWith('### ')) {
        return (
          <h3 key={index} className="mt-8 text-[22px] font-bold text-black sm:text-[26px]">
            {paragraph.replace('### ', '')}
          </h3>
        );
      }
      if (paragraph.startsWith('## ')) {
        return (
          <h2 key={index} className="mt-10 text-[26px] font-bold text-black sm:text-[32px]">
            {paragraph.replace('## ', '')}
          </h2>
        );
      }
      return (
        <p key={index} className="mt-6 text-[18px] leading-[1.7] text-black/70 sm:text-[19px]">
          {paragraph}
        </p>
      );
    });
  };

  // Find related articles (same category, excluding current)
  const relatedArticles = blogs
    .filter((b) => b.category === blog.category && b.slug !== blog.slug)
    .slice(0, 2);

  // If there are no related articles in same category, just pick other ones
  const displayedRelated = relatedArticles.length > 0 
    ? relatedArticles 
    : blogs.filter((b) => b.slug !== blog.slug).slice(0, 2);

  return (
    <div className="bg-white">
      <Navbar />
      
      <main className="pt-20 md:pt-[6rem]">
        {/* Full-bleed Featured Image at the absolute top */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full overflow-hidden bg-zinc-50 border-b border-zinc-150"
        >
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-[50vh] sm:h-[60vh] lg:h-[70vh] xl:h-[80vh] object-cover"
          />
        </motion.div>

        {/* Blog Header (Category, Title, Author) - rendered elegantly below the image */}
        <Section className="pb-8 pt-16">
          <Container>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl"
            >
              {/* Back to Blog Button */}
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 text-[14px] font-bold text-[#0066FF] hover:text-[#0052CC] transition-colors mb-6"
              >
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                  <path d="M16 10H4M4 10L9 5M4 10L9 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Back to Blog
              </Link>

              {/* Category, Date & Read Time */}
              <div className="flex flex-wrap items-center gap-4 text-[12px] font-bold uppercase tracking-wider text-black/50">
                <span className="rounded-full bg-[#0066FF]/10 text-[#0066FF] px-3.5 py-1.5">
                  {blog.category}
                </span>
                <span>{blog.date}</span>
                <span>•</span>
                <span>{blog.readTime}</span>
              </div>

              {/* Title */}
              <h1 className="mt-6 text-[36px] font-semibold leading-[1.08] tracking-[-0.05em] text-[#111827] sm:text-[48px] md:text-[60px] lg:text-[76px]">
                {blog.title}
              </h1>

              {/* Author Row */}
              <div className="mt-8 flex items-center gap-4 border-t border-black/10 pt-6">
                <div>
                  <p className="text-[14px] font-bold text-black">Written by</p>
                  <p className="text-[16px] font-semibold text-[#0066FF]">{blog.author}</p>
                </div>
              </div>
            </motion.div>
          </Container>
        </Section>

        {/* Main Content Layout */}
        <Section className="py-20 lg:py-28">
          <Container>
            <div className="grid gap-16 lg:grid-cols-12 lg:gap-24">
              {/* Left Side: Empty space or quick stats */}
              <div className="hidden lg:block lg:col-span-3">
                <div className="sticky top-44 border-l-2 border-[#0066FF]/20 pl-6 py-2 space-y-8">
                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#9CA3AF]">
                      Category
                    </h4>
                    <p className="mt-2 text-[16px] font-semibold text-black">
                      {blog.category}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#9CA3AF]">
                      Share
                    </h4>
                    <div className="mt-3 flex gap-4">
                      {["Twitter", "LinkedIn", "Copy Link"].map((platform) => (
                        <button
                          key={platform}
                          onClick={() => alert(`${platform} sharing is coming soon!`)}
                          className="text-[13px] font-bold text-black/50 hover:text-[#0066FF] transition-colors"
                        >
                          {platform}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: Article Body & Tags */}
              <div className="lg:col-span-9 max-w-3xl">
                <div className="prose prose-lg">
                  {renderContent(blog.content)}
                </div>

                {/* Tag Chips */}
                <div className="mt-16 flex flex-wrap gap-2 border-t border-black/10 pt-10">
                  {blog.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-black/10 bg-white px-4 py-2 text-[13px] font-medium text-black/60 hover:border-black/20 hover:text-black transition-colors"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Container>
        </Section>

        <Section className="pb-32 border-t border-black/5 pt-24 bg-zinc-50/50">
          <Container>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between mb-16">
              <div>
                <p className="text-[12px] font-bold tracking-[0.2em] text-[#0066FF] uppercase">
                  / Next Stories /
                </p>
                <h2 className="mt-3 text-[32px] font-semibold leading-tight tracking-tight text-black sm:text-[44px]">
                  Keep reading
                </h2>
              </div>
              <Link
                to="/blog"
                className="group inline-flex items-center gap-2 text-[15px] font-semibold text-black underline decoration-black/30 underline-offset-4 transition-colors hover:decoration-[#0066FF] hover:text-[#0066FF] hover:decoration-solid"
              >
                All articles
                <svg className="h-4 w-4 text-[#0066FF] transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>

            <div className="grid gap-10 sm:grid-cols-2 lg:gap-14">
              {displayedRelated.map((related) => (
                <Link
                  key={related.slug}
                  to={`/blog/${related.slug}`}
                  className="group block"
                >
                  <div className="aspect-[16/9] w-full overflow-hidden rounded-[24px] bg-zinc-100 shadow-sm transition-all duration-500 hover:shadow-md">
                    <img
                      src={related.image}
                      alt={related.title}
                      className="h-full w-full object-cover transition-transform duration-700 ease-[0.33,1,0.68,1] group-hover:scale-104"
                    />
                  </div>
                  
                  <div className="mt-6 flex flex-col gap-3 px-1">
                    <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-wider text-black/55">
                      <span className="text-[#0066FF]">{related.category}</span>
                      <span>{related.readTime}</span>
                    </div>
                    
                    <h3 className="text-[20px] font-semibold leading-tight text-black group-hover:text-[#0066FF] transition-colors duration-300">
                      {related.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </Section>
      </main>

      <Footer />
    </div>
  );
}
