import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import ProjectsGrid from "@/components/ProjectsGrid";
import Skills from "@/components/Skills";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <ProjectsGrid />
      <Skills />
      <Contact />
      <Footer />
    </>
  );
}
