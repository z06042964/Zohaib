import SectionHeading from "../ui/SectionHeading";
import ToolCard from "../ui/ToolCard";
import { TOOLS } from "../../constants/tools";

export default function Tools() {
  return (
    <section id="tools" className="py-20 sm:py-28">
      <div className="section-container">
        <SectionHeading
          eyebrow="Our Tools"
          title="Everything you need for image editing"
          subtitle="Choose from our suite of AI-powered tools designed to save you time and deliver professional results."
          className="mb-14"
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {TOOLS.map((tool) => (
            <ToolCard key={tool.id} {...tool} />
          ))}
        </div>
      </div>
    </section>
  );
}
