import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Hero from "../components/home/Hero";
import Stats from "../components/home/Stats";
import Features from "../components/home/Features";
import HowItWorks from "../components/home/HowItWorks";
import CropsSection from "../components/home/CropsSection";
import ProblemStatement from "../components/home/ProblemStatement";
import FAQSection from "../components/home/FAQSection";
import CTASection from "../components/home/CTASection";
import Team from "../components/home/Team";

export default function Home() {
  return (
    <div>
      <Header />
      <main>
        <Hero />
        <Stats />
        <Features />
        <ProblemStatement />
        <HowItWorks />
        <CropsSection />
        <Team />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
