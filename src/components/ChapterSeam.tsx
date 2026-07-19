import LuxeImage from "./LuxeImage";
import Parallax from "./Parallax";

/**
 * A thin cinematic texture band between two chapters — connective tissue for
 * the evening's story (e.g. the kitchen's embers between the signatures and
 * the house selection). Pure atmosphere: aria-hidden, lazy, masked at both
 * edges so it rises out of one section and dissolves into the next, with a
 * gentle parallax drift for depth. Under reduced motion Parallax renders the
 * still band; without JS the masked image simply paints.
 */
export default function ChapterSeam({ image }: { image: string }) {
  return (
    <div
      aria-hidden="true"
      className="relative h-40 w-full overflow-hidden sm:h-52 lg:h-64"
      style={{
        maskImage:
          "linear-gradient(to bottom, transparent, black 22%, black 78%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent, black 22%, black 78%, transparent)",
      }}
    >
      <Parallax amount={30} className="absolute -inset-y-8 inset-x-0">
        <LuxeImage
          src={image}
          alt=""
          fill
          sizes="100vw"
          className="h-full w-full scale-105 object-cover"
        />
      </Parallax>
      {/* Quiet the band so it reads as atmosphere, never a competing image */}
      <div className="absolute inset-0 bg-charcoal-950/45" />
    </div>
  );
}
