import heroImage from "@/assets/hero-image.webp";
import statsImage from "@/assets/stats.webp";
import teamImage from "@/assets/team.webp";
import pexels1 from "@/assets/projects/pexels-1.webp";
import pexels2 from "@/assets/projects/pexels-2.webp";
import pexels3 from "@/assets/projects/pexels-3.webp";
import pexels4 from "@/assets/projects/pexels-4.webp";
import servicesHeroRender from "@/assets/services-hero-render.webp";

export type ServiceFeature = {
  title: string;
  description: string;
  icon: "target" | "device" | "bolt" | "scale";
};

export type ServiceProcessStep = {
  number: string;
  title: string;
  description: string;
};

export type ServiceDetail = {
  slug: string;
  title: string;
  shortTitle: string;
  tagline: string;
  heroDescription: string;
  cardDescription: string;
  icon: "brand" | "web" | "ui" | "code" | "motion" | "strategy";
  features: ServiceFeature[];
  overviewHeading: string;
  overviewBody: string;
  overviewPoints: string[];
  overviewImage: string;
  processSteps: ServiceProcessStep[];
  relatedWork: {
    title: string;
    category: string;
    description: string;
    slug: string;
    image: string;
  };
  technologies: string[];
  ctaHeading: string;
  heroImage: string;
};

export const servicesList: ServiceDetail[] = [
  {
    slug: "brand-identity",
    title: "Brand Identity",
    shortTitle: "Brand Identity",
    tagline: "Distinctive brands that communicate value and build lasting recognition.",
    heroDescription:
      "Strategic brand systems designed to differentiate your business, connect with audiences, and scale across every touchpoint.",
    cardDescription:
      "We craft cohesive visual identities and brand narratives that resonate across digital and physical channels.",
    icon: "brand",
    features: [
      { title: "Strategic Positioning", description: "We define what makes your brand unique and memorable.", icon: "target" },
      { title: "Visual Systems", description: "Logos, typography, and color palettes built for consistency.", icon: "device" },
      { title: "Brand Guidelines", description: "Clear rules so your team stays on-brand everywhere.", icon: "bolt" },
      { title: "Scalable Assets", description: "Design systems that grow with new products and markets.", icon: "scale" },
    ],
    overviewHeading: "Brands that stand out — and stay consistent everywhere.",
    overviewBody:
      "Your brand is more than a logo. We build identity systems that communicate trust, quality, and personality from the first impression to every interaction after.",
    overviewPoints: [
      "Custom logo and visual identity tailored to your market",
      "Typography, color, and layout systems for consistency",
      "Brand voice and messaging frameworks",
      "Guidelines and assets ready for your whole team",
    ],
    overviewImage: teamImage,
    processSteps: [
      { number: "01", title: "Discover", description: "We learn about your business, goals, and audience." },
      { number: "02", title: "Define", description: "We shape positioning, personality, and creative direction." },
      { number: "03", title: "Design", description: "We build visual systems and brand applications." },
      { number: "04", title: "Deliver", description: "We hand off guidelines and assets for seamless rollout." },
    ],
    relatedWork: { title: "Arrows rebrand", category: "BRANDING", description: "A full brand refresh for a growing SaaS company focused on clarity and trust.", slug: "arrows", image: pexels2 },
    technologies: ["Figma", "Illustrator", "After Effects", "Notion", "Framer"],
    ctaHeading: "Let's build a brand that sets you apart.",
    heroImage: servicesHeroRender,
  },
  {
    slug: "web-design",
    title: "Web Design",
    shortTitle: "Web Design",
    tagline: "High-performance websites designed to engage, convert, and scale with your business.",
    heroDescription:
      "High-performance websites designed to engage, convert, and scale with your business.",
    cardDescription:
      "Beautiful, conversion-focused websites built for speed, clarity, and long-term growth.",
    icon: "web",
    features: [
      { title: "Conversion Focused", description: "We design with clear goals and user intent at the core.", icon: "target" },
      { title: "Responsive by Default", description: "Beautiful experiences across all devices and screen sizes.", icon: "device" },
      { title: "Performance First", description: "Optimized for speed, SEO, and Core Web Vitals.", icon: "bolt" },
      { title: "Scalable Design", description: "Built on systems that grow with your business.", icon: "scale" },
    ],
    overviewHeading: "Design that makes an impact — and drives results.",
    overviewBody:
      "Your website is often the first impression your brand makes. We design digital experiences that not only look exceptional but also communicate your value, build trust, and drive action.",
    overviewPoints: [
      "Custom, modern design tailored to your brand",
      "User-centered layouts for better engagement",
      "Clear information hierarchy and intuitive navigation",
      "Built to convert visitors into customers",
    ],
    overviewImage: statsImage,
    processSteps: [
      { number: "01", title: "Discover", description: "We learn about your business, goals, and audience." },
      { number: "02", title: "Design", description: "We create layouts and visuals focused on clarity and impact." },
      { number: "03", title: "Develop", description: "Pixel-perfect builds with clean, scalable structure." },
      { number: "04", title: "Launch", description: "We test, optimize, and launch your site for maximum performance." },
    ],
    relatedWork: { title: "Fintech platform redesign", category: "FINTECH", description: "A complete website redesign for a fintech company focused on clarity, trust, and conversion.", slug: "bullseye", image: pexels1 },
    technologies: ["Framer", "Webflow", "GSAP", "Lottie", "Figma", "Spline"],
    ctaHeading: "Let's build a website that sets your brand apart.",
    heroImage: servicesHeroRender,
  },
  {
    slug: "ui-ux-design",
    title: "UI/UX Design",
    shortTitle: "UI/UX Design",
    tagline: "Intuitive product experiences that users love and businesses rely on.",
    heroDescription:
      "Research-driven interfaces and flows that reduce friction, increase engagement, and support product growth.",
    cardDescription:
      "We design digital products with clarity, usability, and delight at every step of the user journey.",
    icon: "ui",
    features: [
      { title: "User Research", description: "Insights that inform every design decision.", icon: "target" },
      { title: "Wireframes & Prototypes", description: "Test ideas fast before development begins.", icon: "device" },
      { title: "Design Systems", description: "Reusable components for consistent product UI.", icon: "bolt" },
      { title: "Usability Testing", description: "Validate flows with real users before launch.", icon: "scale" },
    ],
    overviewHeading: "Products people understand — and actually want to use.",
    overviewBody:
      "Great UX removes confusion and builds confidence. We map journeys, design interfaces, and refine interactions so your product feels effortless.",
    overviewPoints: [
      "User flows mapped to business goals",
      "High-fidelity UI aligned with your brand",
      "Accessible, inclusive interface patterns",
      "Handoff ready for development teams",
    ],
    overviewImage: heroImage,
    processSteps: [
      { number: "01", title: "Research", description: "We study users, competitors, and product requirements." },
      { number: "02", title: "Structure", description: "We map flows, wireframes, and interaction patterns." },
      { number: "03", title: "Design", description: "We craft polished UI and component systems." },
      { number: "04", title: "Validate", description: "We test, iterate, and prepare dev-ready specs." },
    ],
    relatedWork: { title: "Chantalle product design", category: "PRODUCT", description: "End-to-end UX for a consumer app focused on simplicity and retention.", slug: "chantalle", image: pexels3 },
    technologies: ["Figma", "FigJam", "Principle", "Maze", "Storybook"],
    ctaHeading: "Let's design a product your users will love.",
    heroImage: servicesHeroRender,
  },
  {
    slug: "development",
    title: "Development",
    shortTitle: "Development",
    tagline: "Robust, scalable code that brings designs to life and performs under pressure.",
    heroDescription:
      "From marketing sites to complex web apps, we build fast, maintainable solutions aligned with your business goals.",
    cardDescription:
      "Clean architecture, modern stacks, and integrations that keep your digital products running smoothly.",
    icon: "code",
    features: [
      { title: "Modern Stack", description: "React, Node, and cloud-native tools built for scale.", icon: "target" },
      { title: "Clean Code", description: "Maintainable codebases your team can extend.", icon: "device" },
      { title: "API Integrations", description: "Connect CRMs, payments, and third-party services.", icon: "bolt" },
      { title: "Performance Tuned", description: "Fast loads, strong SEO, and reliable uptime.", icon: "scale" },
    ],
    overviewHeading: "Engineering that ships — and scales with confidence.",
    overviewBody:
      "We translate design into production-ready software with attention to performance, security, and long-term maintainability.",
    overviewPoints: [
      "Frontend and backend development",
      "CMS and headless integrations",
      "Quality assurance and deployment pipelines",
      "Ongoing optimization and support options",
    ],
    overviewImage: pexels4,
    processSteps: [
      { number: "01", title: "Scope", description: "We define technical requirements and architecture." },
      { number: "02", title: "Build", description: "We develop features in structured sprints." },
      { number: "03", title: "Test", description: "We QA across devices, browsers, and edge cases." },
      { number: "04", title: "Deploy", description: "We launch, monitor, and hand off documentation." },
    ],
    relatedWork: { title: "Bullseye platform build", category: "DEVELOPMENT", description: "Full-stack build for a analytics dashboard with real-time data.", slug: "bullseye", image: pexels1 },
    technologies: ["React", "TypeScript", "Node.js", "Vite", "PostgreSQL"],
    ctaHeading: "Let's build software that scales with your vision.",
    heroImage: servicesHeroRender,
  },
  {
    slug: "motion-design",
    title: "Motion Design",
    shortTitle: "Motion Design",
    tagline: "Dynamic animations and motion systems that bring your brand and product to life.",
    heroDescription:
      "From micro-interactions to hero animations, we use motion to communicate, delight, and guide users.",
    cardDescription:
      "Engaging motion graphics and UI animation that elevate storytelling and user experience.",
    icon: "motion",
    features: [
      { title: "Brand Motion", description: "Logo reveals, transitions, and campaign animations.", icon: "target" },
      { title: "UI Animation", description: "Micro-interactions that improve usability.", icon: "device" },
      { title: "Explainer Videos", description: "Clear visual stories for complex products.", icon: "bolt" },
      { title: "Lottie & Web", description: "Lightweight animations optimized for the web.", icon: "scale" },
    ],
    overviewHeading: "Motion that communicates — without getting in the way.",
    overviewBody:
      "Thoughtful animation adds personality and clarity. We create motion that supports your message and feels natural across every screen.",
    overviewPoints: [
      "Concept development and storyboarding",
      "2D and 3D motion for web and social",
      "Scroll-driven and interactive experiences",
      "Export-ready assets for dev teams",
    ],
    overviewImage: pexels2,
    processSteps: [
      { number: "01", title: "Concept", description: "We explore style, pacing, and narrative direction." },
      { number: "02", title: "Storyboard", description: "We map key frames and interaction moments." },
      { number: "03", title: "Animate", description: "We produce and refine motion sequences." },
      { number: "04", title: "Deliver", description: "We export optimized assets for production." },
    ],
    relatedWork: { title: "London Museum campaign", category: "MOTION", description: "Motion-led launch assets for a cultural institution rebrand.", slug: "london-museum", image: pexels3 },
    technologies: ["After Effects", "Lottie", "Rive", "Cinema 4D", "GSAP"],
    ctaHeading: "Let's add motion that makes your brand unforgettable.",
    heroImage: servicesHeroRender,
  },
  {
    slug: "digital-strategy",
    title: "Digital Strategy",
    shortTitle: "Digital Strategy",
    tagline: "Clear roadmaps that align technology, design, and business goals for measurable growth.",
    heroDescription:
      "We help you prioritize initiatives, define KPIs, and build digital roadmaps that turn ambition into action.",
    cardDescription:
      "Research, positioning, and growth planning to guide every design and development decision.",
    icon: "strategy",
    features: [
      { title: "Market Research", description: "Competitive and audience insights that inform strategy.", icon: "target" },
      { title: "Roadmapping", description: "Prioritized plans aligned with budget and timeline.", icon: "device" },
      { title: "KPI Frameworks", description: "Metrics that tie design work to business outcomes.", icon: "bolt" },
      { title: "Growth Planning", description: "Scalable strategies for acquisition and retention.", icon: "scale" },
    ],
    overviewHeading: "Strategy that turns ideas into measurable outcomes.",
    overviewBody:
      "Before pixels or code, we align on what success looks like. Our strategic work ensures every investment in design and development moves the needle.",
    overviewPoints: [
      "Discovery workshops with stakeholders",
      "Competitive and market analysis",
      "Product and channel prioritization",
      "Ongoing advisory and performance reviews",
    ],
    overviewImage: statsImage,
    processSteps: [
      { number: "01", title: "Audit", description: "We assess your current digital presence and gaps." },
      { number: "02", title: "Align", description: "We define goals, audiences, and success metrics." },
      { number: "03", title: "Plan", description: "We build phased roadmaps and resource plans." },
      { number: "04", title: "Execute", description: "We guide implementation and measure results." },
    ],
    relatedWork: { title: "Papyrus growth strategy", category: "STRATEGY", description: "Digital transformation roadmap for an established B2B brand.", slug: "papyrus", image: pexels4 },
    technologies: ["Notion", "Miro", "GA4", "Hotjar", "Figma"],
    ctaHeading: "Let's map a digital strategy that drives real growth.",
    heroImage: servicesHeroRender,
  },
];

export type ApiService = {
  slug: string;
  number: string;
  title: string;
  description: string;
  icon: ServiceDetail["icon"];
  overviewHeading?: string;
  overviewBody?: string;
  overviewImage?: string;
  overviewGallery?: string[];
  overviewVideos?: { type: 'youtube' | 'upload'; url: string }[];
  relatedWorkTitle?: string;
  relatedWorkDescription?: string;
  relatedWorkSlug?: string;
  relatedWorkImage?: string;
  relatedWorkGallery?: string[];
  relatedWorkVideos?: { type: 'youtube' | 'upload'; url: string }[];
  heroImage?: string;
};

/** Maps API slugs from admin/DB to rich static detail templates */
const STATIC_SLUG_BY_API: Record<string, string> = {
  "web-design": "web-design",
  "product-design": "ui-ux-design",
  branding: "brand-identity",
  "motion-graphics": "motion-design",
  development: "development",
};

const defaultFeatures: ServiceFeature[] = [
  { title: "Strategic Focus", description: "Every decision aligns with your business goals.", icon: "target" },
  { title: "Responsive Design", description: "Polished experiences on every device.", icon: "device" },
  { title: "Performance", description: "Fast, reliable, and built to scale.", icon: "bolt" },
  { title: "Long-term Value", description: "Solutions that grow with your brand.", icon: "scale" },
];

export function getServiceBySlug(slug: string): ServiceDetail | undefined {
  return servicesList.find((s) => s.slug === slug);
}

export function apiServiceToCard(api: ApiService) {
  return {
    slug: api.slug,
    title: api.title,
    cardDescription: api.description,
    icon: api.icon || ("web" as ServiceDetail["icon"]),
  };
}

export function buildMinimalServiceDetail(api: ApiService): ServiceDetail {
  return {
    slug: api.slug,
    title: api.title,
    shortTitle: api.title,
    tagline: api.description,
    heroDescription: api.description,
    cardDescription: api.description,
    icon: api.icon || "web",
    features: defaultFeatures,
    overviewHeading: api.overviewHeading || `Expert ${api.title.toLowerCase()} for growing brands.`,
    overviewBody: api.overviewBody || api.description,
    overviewPoints: [
      "Tailored to your brand and audience",
      "Clear process from discovery to launch",
      "Collaborative, transparent communication",
      "Results-focused delivery",
    ],
    overviewImage: api.overviewImage || statsImage,
    processSteps: [
      { number: "01", title: "Discover", description: "We learn about your business, goals, and audience." },
      { number: "02", title: "Design", description: "We shape concepts focused on clarity and impact." },
      { number: "03", title: "Build", description: "We develop and refine the solution." },
      { number: "04", title: "Launch", description: "We deliver, test, and optimize for performance." },
    ],
    relatedWork: {
      title: api.relatedWorkTitle || "Featured client project",
      category: "CASE STUDY",
      description: api.relatedWorkDescription || "Explore how we help brands succeed in the digital space.",
      slug: api.relatedWorkSlug || "bullseye",
      image: api.relatedWorkImage || pexels1,
    },
    technologies: ["Figma", "React", "TypeScript", "Framer", "Webflow"],
    ctaHeading: `Let's talk about your ${api.title.toLowerCase()} project.`,
    heroImage: api.heroImage || servicesHeroRender,
  };
}

export function resolveServiceDetail(api: ApiService | undefined, slug: string): ServiceDetail | undefined {
  const staticSlug = STATIC_SLUG_BY_API[slug] || slug;
  const staticDetail = getServiceBySlug(staticSlug);

  if (api) {
    if (staticDetail) {
      return {
        ...staticDetail,
        slug: api.slug,
        title: api.title,
        shortTitle: api.title,
        heroDescription: api.description,
        cardDescription: api.description,
        icon: api.icon || staticDetail.icon,
        overviewHeading: api.overviewHeading || staticDetail.overviewHeading,
        overviewBody: api.overviewBody || staticDetail.overviewBody,
        overviewImage: api.overviewImage || staticDetail.overviewImage,
        relatedWork: {
          title: api.relatedWorkTitle || staticDetail.relatedWork.title,
          category: staticDetail.relatedWork.category,
          description: api.relatedWorkDescription || staticDetail.relatedWork.description,
          slug: api.relatedWorkSlug || staticDetail.relatedWork.slug,
          image: api.relatedWorkImage || staticDetail.relatedWork.image,
        },
        heroImage: api.heroImage || staticDetail.heroImage,
      };
    }
    return buildMinimalServiceDetail(api);
  }

  return staticDetail ?? getServiceBySlug(slug);
}

export function mergeApiServicesWithStatic(apiServices: ApiService[]): Array<{
  slug: string;
  title: string;
  cardDescription: string;
  icon: ServiceDetail["icon"];
}> {
  if (!apiServices.length) {
    return servicesList.map((s) => ({
      slug: s.slug,
      title: s.title,
      cardDescription: s.cardDescription,
      icon: s.icon,
    }));
  }
  return apiServices.map(apiServiceToCard);
}

export const servicesProcessSteps = [
  { number: "01", title: "Discover", description: "Research, strategy, positioning, audience understanding." },
  { number: "02", title: "Design", description: "Wireframes, visual systems, interaction concepts." },
  { number: "03", title: "Develop", description: "Framer, Webflow, or custom development and integrations." },
  { number: "04", title: "Launch", description: "Optimization, analytics, SEO, and long-term scaling." },
];

export const whyEdihubItems = [
  { title: "Strategic Thinking", description: "Every decision is tied to business goals, not just aesthetics." },
  { title: "Scalable Systems", description: "Design and code built to grow with your company." },
  { title: "Fast Execution", description: "Structured process that keeps projects moving without sacrificing quality." },
  { title: "Premium Experience", description: "Polished work that reflects the caliber of your brand." },
];

export const selectedWork = [
  { title: "Fintech Platform Redesign", category: "FINTECH", slug: "bullseye", image: pexels1 },
  { title: "SaaS Dashboard UI", category: "PRODUCT", slug: "chantalle", image: pexels2 },
  { title: "Luxury Brand Website", category: "BRANDING", slug: "arrows", image: pexels3 },
  { title: "AI Automation Platform", category: "TECH", slug: "papyrus", image: pexels4 },
];

export const servicesTestimonials = [
  {
    quote: "EDIHUB transformed our digital presence completely. The new website increased our conversion rate by 40% in the first month.",
    name: "Sarah Mitchell",
    role: "Marketing Director, Nexora",
  },
  {
    quote: "Working with their team felt effortless. They understood our vision and delivered beyond expectations on every milestone.",
    name: "James Chen",
    role: "CEO, Vertex Labs",
  },
  {
    quote: "The attention to detail and strategic thinking set them apart. Our product launch was a huge success thanks to their design.",
    name: "Emma Rodriguez",
    role: "Product Lead, Flowstack",
  },
];

export const servicesFaq = [
  { question: "How long does a project take?", answer: "Timelines vary by scope — typically 4–8 weeks for websites and 8–16 weeks for full product engagements. We provide a clear schedule after discovery." },
  { question: "Do you work internationally?", answer: "Yes. We collaborate with clients globally through async updates, video calls, and shared project tools." },
  { question: "What is your pricing model?", answer: "We offer project-based and monthly retainer options depending on scope. Contact us for a tailored proposal." },
  { question: "Can you redesign an existing website?", answer: "Absolutely. We audit your current site, identify improvements, and rebuild with modern design and performance standards." },
  { question: "Do you provide ongoing support?", answer: "Yes — we offer maintenance, optimization, and growth support packages after launch." },
];
