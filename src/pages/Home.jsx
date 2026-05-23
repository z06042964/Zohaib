import Hero from "../components/sections/Hero";
import Tools from "../components/sections/Tools";
import HowItWorks from "../components/sections/HowItWorks";
import Features from "../components/sections/Features";
import FAQ from "../components/sections/FAQ";
import CTA from "../components/sections/CTA";

export default function Home() {
  return (
    <main>
      <Hero />
      <Tools />
      <HowItWorks />
      <Features />
      <FAQ />
      <CTA />
    </main>
  );
}
