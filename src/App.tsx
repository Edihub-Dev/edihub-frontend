import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/sections/Hero";
import { Vision } from "@/components/sections/Vision";
import { ClientMarquee } from "@/components/sections/ClientMarquee";
import { Services } from "@/components/sections/Services";
import { Process } from "@/components/sections/Process";
import { Projects } from "@/components/sections/Projects";
import { BuildBetter } from "@/components/sections/BuildBetter";
import { AboutStats } from "@/components/sections/AboutStats";
import { CtaSection } from "@/components/sections/CtaSection";
import { Pricing } from "@/components/sections/Pricing";
import { Testimonials } from "@/components/sections/Testimonials";
import { Faq } from "@/components/sections/Faq";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/layout/Footer";
import { AboutPage } from "@/pages/AboutPage";
import { ServicesPage } from "@/pages/ServicesPage";
import { ServiceDetailPage } from "@/pages/ServiceDetailPage";
import { TeamDetailPage } from "@/pages/TeamDetailPage";
import { ProjectDetailPage } from "@/pages/ProjectDetailPage";
import { ProjectsPage } from "@/pages/ProjectsPage";
import { BlogPage } from "@/pages/BlogPage";
import { BlogDetailPage } from "@/pages/BlogDetailPage";
import { AdminLogin } from "@/pages/AdminLogin";
import { AdminDashboard } from "@/pages/AdminDashboard";
import { CareersPage } from "@/pages/CareersPage";
import { CareerDetailPage } from "@/pages/CareerDetailPage";
import { Route, Routes, useLocation } from "react-router-dom";

import GradualBlur from "@/components/ui/GradualBlur.jsx";

import { SmoothScrollProvider } from "@/components/layout/SmoothScrollProvider";
import { ScrollToTop } from "@/components/layout/ScrollToTop";

function App() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');
  const hideNavbar = false;

  return (
    <>
      <ScrollToTop />
      {!isAdminPage && <SmoothScrollProvider />}
      {!isAdminPage && (
        <GradualBlur
          target="page"
          position="bottom"
          height="8rem"
          strength={2}
          divCount={3}
          curve="bezier"
          exponential
          opacity={1}
          zIndex={2000}
          style={{ pointerEvents: "none" }}
        />
      )}
      <div className={isAdminPage ? "relative h-screen overflow-hidden" : "relative min-h-screen"}>
        {!isAdminPage && !hideNavbar && <Navbar />}
        <main className={isAdminPage ? "h-full" : ""}>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Hero />
                  <Vision />
                  <ClientMarquee />
                  <Services />
                  <Process />
                  <Projects />
                  <BuildBetter />
                  <AboutStats />
                  <Pricing />
                  <Testimonials />
                  <Faq />
                  <CtaSection />
                  <Footer />
                </>
              }
            />

            <Route
              path="/about"
              element={<AboutPage />}
            />
            <Route
              path="/team/:id"
              element={<TeamDetailPage />}
            />

            <Route path="/services" element={<ServicesPage />} />
            <Route path="/services/:slug" element={<ServiceDetailPage />} />

            <Route
              path="/projects"
              element={<ProjectsPage />}
            />

            <Route
              path="/projects/:slug"
              element={<ProjectDetailPage />}
            />

            <Route
              path="/blog"
              element={<BlogPage />}
            />

            <Route
              path="/blog/:slug"
              element={<BlogDetailPage />}
            />

            <Route
              path="/contact"
              element={
                <>
                  <Contact />
                  <Footer />
                </>
              }
            />

            <Route
              path="/career"
              element={<CareersPage />}
            />
            <Route
              path="/career/:slug"
              element={<CareerDetailPage />}
            />
            <Route
              path="/admin"
              element={<AdminDashboard />}
            />

            <Route
              path="/admin-login"
              element={<AdminLogin />}
            />
          </Routes>
        </main>
      </div>
    </>
  );
}

export default App;
