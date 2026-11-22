import { useState } from 'react'
import { Briefcase, Eye, CheckCircle2, ArrowUpRight } from 'lucide-react'
import { projects as initialProjects, type Project } from '../../data/content'
import { Link } from 'react-router'

export default function AdminProjects() {
  const [projectList] = useState<Project[]>(initialProjects)

  return (
    <div className="max-w-6xl space-y-6">
      <div className="pb-6 border-b border-white/10">
        <span className="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-gold">
          Production Portfolio
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
          Corporate Projects & Case Studies
        </h1>
        <p className="text-xs sm:text-sm text-muted mt-1">
          Demonstrating KAD Events capabilities across conferences, reveals, exhibitions, and milestones.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projectList.map((project) => (
          <div
            key={project.slug}
            className="flex flex-col justify-between rounded-xl border border-white/10 bg-card p-5 hover:border-gold/30 transition-all"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="rounded bg-gold/10 px-2.5 py-0.5 text-[0.62rem] font-bold uppercase tracking-wider text-gold">
                  {project.category}
                </span>
                <span className="inline-flex items-center gap-1 text-[0.62rem] font-bold uppercase text-emerald-400">
                  <CheckCircle2 size={11} /> Published
                </span>
              </div>

              <h2 className="text-base font-bold text-white mt-3">{project.title}</h2>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">{project.overview}</p>
            </div>

            <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="font-mono text-[0.68rem] text-muted">/work/{project.slug}</span>
              <Link
                to={`/work/${project.slug}`}
                className="flex items-center gap-1 text-[0.68rem] font-semibold text-gold hover:underline"
              >
                <span>Live View</span>
                <ArrowUpRight size={12} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
