import SectionHeading from "../ui/SectionHeading";
import FeatureCard from "../ui/FeatureCard";
import { FEATURES } from "../../constants/features";

export default function Features() {
  return (
    <section className="py-20 sm:py-28">
      <div className="section-container">
        <SectionHeading
          eyebrow="Why Choose Us"
          title="Built for speed, quality, and simplicity"
          subtitle="Everything you need in one place — professional results without the learning curve."
          className="mb-14"
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
