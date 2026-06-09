import servicesHeroRender from "@/assets/services-hero-render.webp";



export function ServiceHeroVisual({ image }: { image?: string } = {}) {
  return (
    <div className="relative flex h-full w-full min-h-[320px] items-center justify-center bg-white sm:min-h-[380px] lg:min-h-[480px]">
      {/* 3D Render Image representing the premium glass panels and stone */}
      <img
        src={image || servicesHeroRender}
        alt="Digital Solutions Glass Panels and Stone Render"
        className={`h-full w-full ${image ? "object-cover" : "object-contain"}`}
      />

      {/* Decorative text in bottom-right corner */}
      <div className="absolute bottom-2 right-4 text-right sm:bottom-4 sm:right-6 lg:bottom-6 lg:right-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#9CA3AF] leading-relaxed select-none">
          Digital Solutions
          <br />
          that drive impact
        </p>
      </div>

      {/* Decorative slider indicator / line on the right side */}
      <div className="absolute right-0 top-0 bottom-0 flex flex-col items-center justify-center pointer-events-none" aria-hidden="true">
        {/* Vertical line matching the mockup */}
        <div className="w-[1px] h-[70%] bg-[#E5E7EB]/70" />
        {/* Circular indicator */}
        <div className="absolute flex items-center justify-center right-[-19px]">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E5E7EB] bg-white shadow-sm">
            <div className="h-2 w-2 rounded-full bg-black" />
          </div>
        </div>
      </div>
    </div>
  );
}

export const EdihubHeroVisual = ServiceHeroVisual;
export const EdihubBrowserVisual = ServiceHeroVisual;

export function ScrollExploreIndicator() {
  return (
    <div className="mt-16 flex items-center gap-3">
      <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#0066FF]" />
      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9CA3AF]">
        Scroll
      </span>
    </div>
  );
}

export function WavyCtaBg() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 1440 400"
      preserveAspectRatio="none"
      aria-hidden
    >
      <rect width="100%" height="100%" fill="#F0F7FF" />
      <path
        fill="rgba(0,102,255,0.05)"
        d="M0,180 C360,100 720,260 1080,160 C1260,120 1380,140 1440,130 L1440,400 L0,400 Z"
      />
    </svg>
  );
}
