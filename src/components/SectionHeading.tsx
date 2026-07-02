import Reveal from "./Reveal";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "start";
  light?: boolean;
  /** Editorial chapter numeral rendered as a ghost figure behind the heading. */
  index?: string;
}

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  index,
}: SectionHeadingProps) {
  const alignment =
    align === "center" ? "items-center text-center mx-auto" : "items-start text-start";

  return (
    <Reveal>
      <div className={`relative flex max-w-2xl flex-col ${alignment}`}>
        {index && (
          <span
            aria-hidden="true"
            className="heading-display pointer-events-none absolute -top-14 start-1/2 -translate-x-1/2 select-none text-[7rem] font-semibold leading-none text-white/[0.045] sm:-top-20 sm:text-[10rem] rtl:translate-x-1/2"
          >
            {index}
          </span>
        )}
        {eyebrow && <span className="eyebrow mb-3">{eyebrow}</span>}
        <h2 className="heading-display text-balance text-4xl font-medium text-cream sm:text-5xl md:text-[3.4rem] md:leading-[1.08]">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-4 text-base font-light leading-relaxed text-cream/70 sm:text-lg">
            {subtitle}
          </p>
        )}
        <span className="rule-gold mt-7" aria-hidden="true" />
      </div>
    </Reveal>
  );
}
