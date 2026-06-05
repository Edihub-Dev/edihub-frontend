export type Career = {
  title: string;
  slug: string;
  department: string;
  employmentType: string;
  location: string;
  experience: string;
  datePosted: string;
  isNew: boolean;
  icon: string;
  description: string;
  aboutRole: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave: string[];
  image?: string;
  benefits?: { title: string; description: string; icon: string }[];
};

export const defaultCareers: Career[] = [
  {
    title: "Senior UI/UX Designer",
    slug: "senior-ui-ux-designer",
    department: "Design",
    employmentType: "Full-time",
    location: "Anywhere",
    experience: "5+ Years",
    datePosted: "May 20, 2024",
    isNew: true,
    icon: "ui",
    description: "We're looking for a Senior UI/UX Designer who can craft intuitive digital experiences that are beautiful, functional, and driven by real user needs.",
    aboutRole: "As a Senior UI/UX Designer at Edihub, you'll lead the design process from research and wireframing to final UI, creating high-quality experiences across websites and digital products. You'll collaborate with strategists, developers, and clients to bring ideas to life.",
    responsibilities: [
      "Lead the design of websites and digital products from concept to launch",
      "Create user-centered designs based on research and insights",
      "Build wireframes, prototypes, and high-fidelity UI in Figma",
      "Collaborate with developers to ensure design accuracy and quality",
      "Maintain and evolve design systems and component libraries",
      "Present design concepts and rationale to clients and stakeholders"
    ],
    requirements: [
      "5+ years of professional experience in UI/UX design",
      "Strong portfolio showcasing web and digital product design",
      "Proficiency in Figma and design systems",
      "Solid understanding of user experience principles and best practices",
      "Excellent communication and collaboration skills",
      "Experience working in agencies is a plus"
    ],
    niceToHave: [
      "Motion design or interaction design experience",
      "Basic knowledge of HTML, CSS, or Webflow/Framer",
      "Experience with data-driven design and analytics tools"
    ]
  },
  {
    title: "Framer Developer",
    slug: "framer-developer",
    department: "Development",
    employmentType: "Full-time",
    location: "Anywhere",
    experience: "3+ Years",
    datePosted: "May 22, 2024",
    isNew: true,
    icon: "code",
    description: "We're looking for a Framer Developer who can translate beautiful designs into interactive, pixel-perfect, and high-performing websites using Framer.",
    aboutRole: "As a Framer Developer at Edihub, you will bridge the gap between design and development, translating static wireframes and high-fidelity Figma components into clean, responsive, and interactive websites using Framer.",
    responsibilities: [
      "Build responsive, high-performance web pages in Framer",
      "Implement advanced animations, transitions, and interactions",
      "Optimize website load times and performance metrics",
      "Collaborate with designers to ensure exact implementation of UI concepts",
      "Integrate third-party tools, APIs, and custom code blocks where necessary",
      "Manage SEO settings, redirects, and custom domains within Framer"
    ],
    requirements: [
      "3+ years of experience building websites in Framer or Webflow",
      "Strong understanding of CSS, HTML, responsive design, and flexbox layout models",
      "Portfolio of live Framer websites displaying creative animations",
      "Eye for design details and ability to match Figma designs pixel-for-pixel",
      "Familiarity with basic JavaScript or React for custom components is a plus"
    ],
    niceToHave: [
      "Knowledge of SEO best practices and page speed optimization",
      "Experience working with Figma to Framer import workflows",
      "Familiarity with analytics setup (GTM, Hotjar)"
    ]
  },
  {
    title: "Brand Designer",
    slug: "brand-designer",
    department: "Design",
    employmentType: "Full-time",
    location: "Europe",
    experience: "3+ Years",
    datePosted: "May 18, 2024",
    isNew: false,
    icon: "brand",
    description: "We're looking for a Brand Designer who can craft visual identities, brand assets, and collateral that build strong, cohesive, and memorable brands.",
    aboutRole: "As a Brand Designer at Edihub, you will shape the visual identities of our clients. From logo design and color palettes to marketing collateral and digital assets, you will build design systems that communicate core values across all channels.",
    responsibilities: [
      "Develop brand strategy, visual positioning, and brand voice guidelines",
      "Design logos, iconography systems, typography scales, and color guidelines",
      "Create high-fidelity print and digital layouts for brand collateral",
      "Collaborate with digital designers to align branding with product UI",
      "Create design templates that can scale across social media and marketing channels",
      "Deliver client brand books and source files with structured asset libraries"
    ],
    requirements: [
      "3+ years of professional branding and graphic design experience",
      "Expert knowledge of Adobe Illustrator, Photoshop, Indesign, and Figma",
      "Portfolio displaying complete brand identity systems and print/digital collateral",
      "Strong storytelling capabilities and ability to justify design choices",
      "Great attention to detail regarding typography, layouts, and print production"
    ],
    niceToHave: [
      "Experience in packaging design or environmental branding",
      "Ability to create vector illustrations or custom typography",
      "Familiarity with motion design in After Effects"
    ]
  },
  {
    title: "Growth Marketing Manager",
    slug: "growth-marketing-manager",
    department: "Marketing",
    employmentType: "Full-time",
    location: "Anywhere",
    experience: "4+ Years",
    datePosted: "May 15, 2024",
    isNew: false,
    icon: "marketing",
    description: "We're looking for a Growth Marketing Manager who can design and execute data-driven campaigns that acquire, retain, and scale our customer base.",
    aboutRole: "As a Growth Marketing Manager at Edihub, you will be responsible for defining and driving our customer acquisition strategies. You will design, launch, and optimize pay-per-click, content marketing, and email marketing funnels to accelerate user growth.",
    responsibilities: [
      "Manage paid advertising budgets across Google Ads, Meta Ads, and LinkedIn Ads",
      "Analyze marketing funnel metrics (CAC, LTV, conversion rates) and report insights",
      "Design A/B tests for landing pages, ad copy, and creative formats",
      "Partner with copywriters and designers to produce high-performing creative assets",
      "Formulate organic search strategies (SEO) and content syndication channels",
      "Set up automation workflows for lead nurturing, retention, and lifecycle emails"
    ],
    requirements: [
      "4+ years of growth marketing or user acquisition experience in tech/agencies",
      "Proven track record of scaling digital advertising campaigns with positive ROI",
      "Expertise in Google Analytics, Tag Manager, SEMRush, and ad managers",
      "Strong analytical skillset with ability to extract insights from raw data",
      "Excellent copywriting skills for ad titles, descriptions, and landing pages"
    ],
    niceToHave: [
      "Experience with HTML/CSS and page editors (Framer, Webflow)",
      "Basic SQL knowledge or data visualization experience (Looker, Tableau)",
      "Knowledge of product-led growth strategies"
    ]
  },
  {
    title: "Project Manager",
    slug: "project-manager",
    department: "Operations",
    employmentType: "Full-time",
    location: "Anywhere",
    experience: "4+ Years",
    datePosted: "May 10, 2024",
    isNew: false,
    icon: "operations",
    description: "We're looking for a Project Manager who can organize development cycles, align stakeholders, and ensure projects are delivered on time and within scope.",
    aboutRole: "As a Project Manager at Edihub, you will oversee digital project lifecycles from kick-off to launch. You'll keep multidisciplinary teams of designers and developers aligned, remove blockers, manage timelines, and serve as the main point of contact for clients.",
    responsibilities: [
      "Facilitate sprint planning, daily standups, sprint reviews, and retrospectives",
      "Scope out project requirements, milestones, resources, and budgets",
      "Act as the primary interface between clients and the technical/design team",
      "Manage project backlogs, writing detailed user stories and tasks in Jira/Asana",
      "Track project performance and profitability metrics, flagging risks early",
      "Establish operational guidelines to improve team velocity and handoff efficiency"
    ],
    requirements: [
      "4+ years of project management experience in digital agencies or tech teams",
      "Deep understanding of Agile, Scrum, and Kanban methodologies",
      "Mastery of project management software (Jira, Confluence, Asana, Notion)",
      "Outstanding communication and conflict-resolution capabilities",
      "Ability to explain complex technical structures to non-technical stakeholders"
    ],
    niceToHave: [
      "Scrum Master (CSM) or PMP certification",
      "Technical background or basic coding understanding",
      "Experience managing remote, global teams"
    ]
  },
  {
    title: "Content Writer",
    slug: "content-writer",
    department: "Marketing",
    employmentType: "Part-time",
    location: "Anywhere",
    experience: "2+ Years",
    datePosted: "May 05, 2024",
    isNew: false,
    icon: "writer",
    description: "We're looking for a Content Writer who can craft compelling blogs, copy, and resources that educate our audience and elevate our brand presence.",
    aboutRole: "As a Part-time Content Writer at Edihub, you will draft highly engaging, search-optimized articles, blogs, case studies, and newsletter copy that showcase our expertise and drive brand engagement.",
    responsibilities: [
      "Write 2-3 high-quality blog posts or articles per week",
      "Research topics related to web design, product development, and agency trends",
      "Optimize all content for SEO keywords and user engagement metrics",
      "Craft newsletter content and marketing emails to nurture subscribers",
      "Interview team experts and clients to write detailed case studies",
      "Proofread, edit, and polish drafts written by other team members"
    ],
    requirements: [
      "2+ years of content writing or copywriting experience, preferably B2B SaaS/Agency",
      "Excellent research skills and ability to write in an informative yet conversational tone",
      "Basic understanding of SEO best practices, keyword density, and search intent",
      "Portfolio showcasing published articles, blog posts, or marketing copies",
      "Self-motivated, detail-oriented, and able to hit editorial deadlines"
    ],
    niceToHave: [
      "Familiarity with markdown or content management systems (Wordpress, Webflow)",
      "Basic design skills (Canva/Figma) to create simple blog graphics",
      "Experience hosting or writing scripts for social videos/podcasts"
    ]
  }
];

export const whyJoinEdihub = [
  {
    title: "Work from anywhere",
    description: "Fully remote team with flexibility that fits your life.",
    icon: "globe"
  },
  {
    title: "Health & wellness",
    description: "Comprehensive health coverage for you and your family.",
    icon: "heart"
  },
  {
    title: "Growth & learning",
    description: "Annual learning budget and clear paths for advancement.",
    icon: "trending"
  },
  {
    title: "Flexible schedule",
    description: "Flexible hours that help you do your best work.",
    icon: "calendar"
  },
  {
    title: "Great team",
    description: "Collaborate with talented, kind, and ambitious people.",
    icon: "users"
  }
];
