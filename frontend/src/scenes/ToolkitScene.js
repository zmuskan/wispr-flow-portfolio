import { ExternalLink, GraduationCap, Check, AppWindow, Code2, Database, Network, Sparkles, Workflow } from "lucide-react";
import { TOOLKIT } from "@/data/content";
import { SketchUnderline } from "@/components/scrapbook/Scrapbook";

const STACK_CATEGORIES = [
  {
    icon: AppWindow,
    title: "01 — Programming & Data",
    items: ["Python", "SQL", "JavaScript", "TypeScript", "NumPy", "Pandas", "scikit-learn"],
  },
  {
    icon: Workflow,
    title: "02 — Backend Engineering & APIs",
    items: ["FastAPI", "Flask", "REST APIs", "Pydantic", "SQLAlchemy", "BeautifulSoup", "Trafilatura"],
  },
  {
    icon: Database,
    title: "03 — Databases & Geospatial Systems",
    items: ["PostgreSQL", "Supabase", "PostGIS", "Database Design"],
  },
  {
    icon: Code2,
    title: "04 — Frontend Engineering",
    items: ["React", "TypeScript", "Vite", "Tailwind CSS", "TanStack Router", "Zustand", "Axios"],
  },
  {
    icon: Sparkles,
    title: "05 — AI, Machine Learning & Generative AI",
    items: [
      "scikit-learn",
      "Machine Learning Workflows",
      "LangChain",
      "FAISS",
      "Ollama",
      "OpenAI / ChatGPT",
      "Google Gemini API",
      "Claude",
      "GitHub Copilot",
      "Prompt Engineering",
    ],
  },
  {
    icon: Network,
    title: "06 — Cloud, Deployment & Developer Tools",
    items: ["Docker", "Git", "GitHub", "Vercel", "Render", "Microsoft Fabric", "Streamlit", "Jupyter Notebook"],
  },
];

function TechItem({ item }) {
  return <span className="chip">{item}</span>;
}

function CompletedMarker() {
  return (
    <span className="w-4 h-4 rounded-full bg-[#D98B9C] flex items-center justify-center shrink-0 mt-0.5 cert-marker">
      <Check size={9} strokeWidth={3.5} className="text-white" />
    </span>
  );
}

export default function ToolkitScene() {
  const t = TOOLKIT;
  return (
    <div className="scene-scroll h-full" data-inner-scroll data-testid="toolkit-content">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 xl:px-16 pb-12 min-h-full flex flex-col justify-center gap-4">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-10 items-start">
          <div className="lg:w-[300px] shrink-0 pt-1">
            <h2 className="t-serif italic font-medium text-cream text-[clamp(30px,3.4vw,48px)] leading-[1.05]">
              {t.heading}
            </h2>
            <SketchUnderline width={140} className="mt-1" />
            <p className="mt-3 text-[12.5px] sm:text-[13.5px] leading-relaxed text-cream/80 max-w-[300px]">{t.copy}</p>
          </div>
        </div>

        <div className="paper p-5 sm:p-6 relative" style={{ "--rot": "0deg" }}>
          <div className="flex items-center justify-center gap-2">
            <GraduationCap size={17} className="text-[#7A4B33]" />
            <h3 className="t-play font-extrabold text-[17px] sm:text-[18px] text-center">Courses &amp; Certifications</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-5 mt-4">
            <section>
              <h4 className="flex items-center gap-2 text-[10px] font-extrabold tracking-[0.14em] uppercase opacity-70 mb-2.5">
                <CompletedMarker /> Completed
              </h4>
              <ul className="space-y-2">
                {t.certs.completed.map((cert) => (
                  <li key={cert.name}>
                    <a
                      href={cert.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-testid="cert-link"
                      className="group flex items-start gap-2 text-[11.5px] leading-snug"
                    >
                      <CompletedMarker />
                      <span>
                        <span className="font-bold group-hover:underline decoration-[#A94B66]">{cert.name}</span>
                        <span className="opacity-60"> — {cert.provider}</span>
                        <ExternalLink size={9} className="inline ml-1 text-[#A94B66]" />
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h4 className="flex items-center gap-2 text-[10px] font-extrabold tracking-[0.14em] uppercase opacity-70 mb-2.5">
                <span className="w-4 h-4 rounded-full border-[1.5px] border-[var(--ink)]/60 shrink-0 cert-marker" />
                In Progress
              </h4>
              <ul className="space-y-2">
                {t.certs.inProgress.map((name) => (
                  <li key={name} className="flex items-start gap-2 text-[11.5px] leading-snug">
                    <span className="w-4 h-4 rounded-full border-[1.5px] border-[var(--ink)]/60 shrink-0 mt-0.5 cert-marker" />
                    <span className="font-semibold">{name}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h4 className="flex items-center gap-2 text-[10px] font-extrabold tracking-[0.14em] uppercase opacity-70 mb-2.5">
                <span className="w-2 h-2 rounded-full bg-[var(--ink)]/35 shrink-0 mx-1 cert-marker" />
                Familiar With
              </h4>
              <ul className="space-y-2">
                {t.certs.familiar.map((name) => (
                  <li key={name} className="flex items-start gap-2 text-[11.5px] leading-snug">
                    <span className="w-2 h-2 rounded-full bg-[var(--ink)]/35 shrink-0 mt-1.5 mx-1" />
                    <span>{name}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>

        <div className="paper flex-1 p-5 sm:p-6" style={{ "--rot": "0deg" }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-7 gap-y-5">
            {STACK_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <div key={cat.title} className="toolkit-category">
                  <div className="flex items-center gap-2.5">
                    <span className="cat-icon">
                      <Icon size={14} strokeWidth={2.2} />
                    </span>
                    <h3 className="t-play font-bold text-[15px] leading-tight">{cat.title}</h3>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {cat.items.map((item) => (
                      <TechItem key={`${cat.title}-${item}`} item={item} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="scroll-hint xl:hidden">
          <span>keep scrolling</span>
        </div>
      </div>
    </div>
  );
}
