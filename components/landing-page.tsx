import { getCvData } from "@/lib/cv-data"
import { EnterSystemButton } from "@/components/enter-system-button"

const SECTIONS = [
  { id: "sobre-mi", label: "sobre-mi" },
  { id: "experiencia", label: "experiencia" },
  { id: "proyectos", label: "proyectos" },
  { id: "educacion", label: "educacion" },
  { id: "contacto", label: "contacto" },
] as const

function Prompt({ children }: { children: React.ReactNode }) {
  return <p className="font-mono text-xs text-[#7ee787] sm:text-sm">{children}</p>
}

function SectionTitle({ id, index, title }: { id: string; index: string; title: string }) {
  return (
    <div className="mb-8 flex items-baseline gap-4 border-b border-[#29292f] pb-3">
      <span className="font-mono text-xs text-[#f5b301]">{index}</span>
      <h2 id={id} className="scroll-mt-24 font-mono text-xl font-semibold tracking-tight text-[#e7e7ea] sm:text-2xl">
        {title}
      </h2>
    </div>
  )
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="border border-[#29292f] bg-[#141417] px-2 py-0.5 font-mono text-[11px] text-[#9b9ba4]">
      {children}
    </span>
  )
}

export function LandingPage() {
  const { about, experience, education, projects, skills, contact } = getCvData("es")

  return (
    <div className="min-h-screen bg-[#0b0b0c] font-mono text-[#e7e7ea] antialiased selection:bg-[#f5b301]/30">
      {/* Header / navegación lineal (funciona en móvil por anclas) */}
      <header className="sticky top-0 z-40 border-b border-[#29292f] bg-[#0b0b0c]/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-5">
          <a href="#top" className="flex items-center gap-2 font-mono text-sm text-[#e7e7ea]">
            <span className="text-[#f5b301]">~/</span>
            <span className="font-semibold">daniel-gonzalez-pascual</span>
          </a>
          <nav aria-label="Secciones" className="hidden items-center gap-5 md:flex">
            {SECTIONS.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="font-mono text-xs text-[#9b9ba4] transition-colors hover:text-[#f5b301]"
              >
                {section.label}
              </a>
            ))}
          </nav>
          <a
            href={contact.cvPath}
            className="border border-[#f5b301]/60 px-3 py-1.5 font-mono text-xs text-[#f5b301] transition-colors hover:bg-[#f5b301] hover:text-[#0b0b0c]"
          >
            CV.pdf
          </a>
        </div>
      </header>

      <main id="top" className="mx-auto max-w-5xl px-5">
        {/* HERO */}
        <section aria-labelledby="sobre-mi" className="border-b border-[#29292f] py-14 sm:py-20">
          <Prompt>
            <span className="text-[#9b9ba4]">daniel@portfolio</span>:<span className="text-[#f5b301]">~</span>$
            whoami
          </Prompt>
          <h1 className="mt-4 font-mono text-3xl font-bold leading-tight tracking-tight text-[#e7e7ea] sm:text-5xl">
            {about.name}
          </h1>
          <p className="mt-3 font-mono text-lg text-[#f5b301] sm:text-xl">{about.role}</p>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#9b9ba4] sm:text-base">{about.tagline}</p>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#9b9ba4] sm:text-base">{about.summary}</p>

          <ul className="mt-8 space-y-3" id="sobre-mi">
            {about.bullets.map((bullet) => (
              <li key={bullet} className="flex gap-3 text-sm leading-relaxed text-[#c9c9cf]">
                <span aria-hidden className="text-[#7ee787]">
                  ▸
                </span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Tag>{about.yearsOfExperience} de experiencia</Tag>
            <Tag>{about.location}</Tag>
            <Tag>Backend · Python · FastAPI</Tag>
          </div>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
            <a
              href={contact.cvPath}
              className="inline-flex items-center justify-center border border-[#e7e7ea]/30 px-5 py-3 text-sm font-medium text-[#e7e7ea] transition-colors hover:border-[#e7e7ea] hover:bg-[#e7e7ea] hover:text-[#0b0b0c]"
            >
              Descargar CV
            </a>
            <a
              href={`mailto:${contact.email}`}
              className="inline-flex items-center justify-center border border-[#29292f] px-5 py-3 text-sm text-[#9b9ba4] transition-colors hover:border-[#9b9ba4] hover:text-[#e7e7ea]"
            >
              Contactar
            </a>
            <EnterSystemButton />
          </div>
        </section>

        {/* EXPERIENCIA */}
        <section aria-labelledby="experiencia" className="border-b border-[#29292f] py-14">
          <SectionTitle id="experiencia" index="01" title="experiencia" />
          <ol className="space-y-8">
            {experience.map((job) => (
              <li key={job.id} className="border border-[#29292f] bg-[#111114] p-5 sm:p-6">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                  <h3 className="font-mono text-base font-semibold text-[#e7e7ea] sm:text-lg">
                    {job.role} · <span className="text-[#f5b301]">{job.company}</span>
                  </h3>
                  <p className="font-mono text-xs text-[#9b9ba4]">{job.period}</p>
                </div>
                <p className="mt-1 font-mono text-xs text-[#6f6f78]">
                  {job.location} · {job.type}
                  {job.current ? " · actual" : ""}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-[#c9c9cf]">{job.summary}</p>
                <ul className="mt-3 space-y-1.5">
                  {job.highlights.map((highlight) => (
                    <li key={highlight} className="flex gap-2 text-sm leading-relaxed text-[#9b9ba4]">
                      <span aria-hidden className="text-[#7ee787]">
                        -
                      </span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex flex-wrap gap-2">
                  {job.stack.map((tech) => (
                    <Tag key={tech}>{tech}</Tag>
                  ))}
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* PROYECTOS */}
        <section aria-labelledby="proyectos" className="border-b border-[#29292f] py-14">
          <SectionTitle id="proyectos" index="02" title="proyectos" />
          <div className="grid gap-5 sm:grid-cols-2">
            {projects.map((project) => {
              const href = project.url ?? project.repo
              return (
                <article key={project.id} className="flex flex-col border border-[#29292f] bg-[#111114] p-5">
                  <h3 className="font-mono text-base font-semibold text-[#e7e7ea]">{project.name}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-[#9b9ba4]">{project.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.stack.map((tech) => (
                      <Tag key={tech}>{tech}</Tag>
                    ))}
                  </div>
                  {href ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 font-mono text-xs text-[#f5b301] hover:underline"
                    >
                      ver más →
                    </a>
                  ) : null}
                </article>
              )
            })}
          </div>
        </section>

        {/* EDUCACIÓN */}
        <section aria-labelledby="educacion" className="border-b border-[#29292f] py-14">
          <SectionTitle id="educacion" index="03" title="educacion" />
          <ul className="space-y-4">
            {education.map((item) => (
              <li key={item.id} className="border-l border-[#29292f] pl-4">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                  <h3 className="font-mono text-sm font-semibold text-[#e7e7ea]">{item.title}</h3>
                  <p className="font-mono text-xs text-[#9b9ba4]">{item.period}</p>
                </div>
                <p className="mt-1 font-mono text-xs text-[#6f6f78]">
                  {item.institution}
                  {item.status ? ` · ${item.status}` : ""}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-[#9b9ba4]">{item.description}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* SKILLS + CONTACTO */}
        <section aria-labelledby="contacto" className="grid gap-10 border-b border-[#29292f] py-14 md:grid-cols-2">
          <div>
            <SectionTitle id="skills" index="04" title="skills" />
            <dl className="space-y-5">
              {skills.map((group) => (
                <div key={group.category}>
                  <dt className="font-mono text-xs uppercase tracking-widest text-[#f5b301]">{group.category}</dt>
                  <dd className="mt-2 flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <Tag key={item}>{item}</Tag>
                    ))}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <SectionTitle id="contacto" index="05" title="contacto" />
            <p className="text-sm leading-relaxed text-[#9b9ba4]">
              Abierto a nuevas oportunidades y colaboraciones. Escríbeme y hablamos.
            </p>
            <ul className="mt-6 space-y-3 font-mono text-sm">
              <li>
                <span className="text-[#6f6f78]">email: </span>
                <a href={`mailto:${contact.email}`} className="text-[#f5b301] hover:underline">
                  {contact.email}
                </a>
              </li>
              <li>
                <span className="text-[#6f6f78]">linkedin: </span>
                <a
                  href={contact.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#7ee787] hover:underline"
                >
                  daniel-gonzalez-pascual
                </a>
              </li>
              <li>
                <span className="text-[#6f6f78]">github: </span>
                <a
                  href={contact.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#7ee787] hover:underline"
                >
                  danigpas
                </a>
              </li>
              <li>
                <span className="text-[#6f6f78]">ubicacion: </span>
                <span className="text-[#c9c9cf]">{contact.location}</span>
              </li>
            </ul>
            <div className="mt-8">
              <EnterSystemButton variant="panel" />
            </div>
          </div>
        </section>

        <footer className="flex flex-col gap-2 py-10 font-mono text-xs text-[#6f6f78] sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {about.name}
          </p>
          <p>
            construido con <span className="text-[#f5b301]">Next.js</span> ·{" "}
            <span className="text-[#7ee787]">TypeScript</span>
          </p>
        </footer>
      </main>
    </div>
  )
}
