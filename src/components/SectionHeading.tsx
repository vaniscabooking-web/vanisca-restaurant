import Reveal from "./Reveal";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "start";
  light?: boolean;
}

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: SectionHeadingProps) {
  const alignment =
    align === "center" ? "items-center text-center mx-auto" : "items-start text-start";

  return (
    <Reveal>
      <div className={`flex max-w-2xl flex-col ${alignment}`}>
        {eyebrow && <span className="eyebrow mb-3">{eyebrow}</span>}
        <h2 className="heading-display text-3xl font-semibold text-cream sm:text-4xl md:text-[2.75rem] md:leading-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-4 text-base leading-relaxed text-cream/70 sm:text-lg">
            {subtitle}
          </p>
        )}
        <span className="mt-6 h-px w-16 bg-gold-gradient" aria-hidden="true" />
      </div>
    </Reveal>
  );
}
