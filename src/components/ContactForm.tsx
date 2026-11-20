import { useState } from 'react'
import { AlertCircle, CheckCircle2, Loader2, ArrowUpRight } from 'lucide-react'
import { eventTypes } from '../data/content'
import { submitEnquiry, validate, type Enquiry } from '../lib/enquiry'

const empty: Enquiry = {
  name: '',
  company: '',
  email: '',
  phone: '',
  type: '',
  date: '',
  attendees: '',
  location: '',
  notes: '',
}

const inputClass =
  'w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3.5 text-sm text-snow placeholder:text-muted/40 transition-all focus:border-gold/60 focus:bg-white/[0.06] focus:outline-none focus:ring-1 focus:ring-gold/40 aria-[invalid=true]:border-red-400'

function FormField({
  id,
  label,
  error,
  required,
  children,
}: {
  id: string
  label: string
  error?: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="eyebrow !text-[0.62rem] text-slate-300">
        {label}
        {required && <span className="text-gold font-normal"> *</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-err`} role="alert" className="text-xs text-red-400 mt-0.5">
          {error}
        </p>
      )}
    </div>
  )
}

export default function ContactForm({ presetType = '' }: { presetType?: string }) {
  const [data, setData] = useState<Enquiry>({ ...empty, type: presetType })
  const [errors, setErrors] = useState<Partial<Record<keyof Enquiry, string>>>({})
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const set =
    (k: keyof Enquiry) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setData((d) => ({ ...d, [k]: e.target.value }))
      if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined }))
    }

  const p = (k: keyof Enquiry) => ({
    id: k,
    name: k,
    value: data[k],
    onChange: set(k),
    className: inputClass,
    'aria-invalid': !!errors[k],
    'aria-describedby': errors[k] ? `${k}-err` : undefined,
  })

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const v = validate(data)
    setErrors(v)
    const first = Object.keys(v)[0]
    if (first) return document.getElementById(first)?.focus()
    setStatus('loading')
    try {
      await submitEnquiry(data)
      setStatus('success')
      setData(empty)
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div role="status" className="rounded-xl border border-gold/40 bg-white/[0.02] p-6 sm:p-10 text-center backdrop-blur-md md:p-14">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-gold/10 border border-gold/40">
          <CheckCircle2 className="text-gold" size={28} aria-hidden />
        </div>
        <h3 className="display mt-6 text-2xl sm:text-3xl md:text-4xl text-white">Brief Received.</h3>
        <p className="mt-3 text-sm text-slate-300 leading-relaxed max-w-sm mx-auto">
          Thank you. An executive production director will review your event parameters and contact you within 24 hours.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="eyebrow mt-8 inline-flex items-center gap-2 border-b border-gold/60 pb-1 text-gold hover:text-white transition-colors"
        >
          <span>Submit Another Inquiry</span>
          <ArrowUpRight size={13} />
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-x-6 gap-y-6 sm:grid-cols-2">
      <FormField id="name" label="Full Name" required error={errors.name}>
        <input {...p('name')} autoComplete="name" placeholder="e.g. Sterling Hayes" />
      </FormField>

      <FormField id="company" label="Organisation / Brand Name">
        <input {...p('company')} autoComplete="organization" placeholder="e.g. Apex Global" />
      </FormField>

      <FormField id="email" label="Corporate Email" required error={errors.email}>
        <input {...p('email')} type="email" autoComplete="email" inputMode="email" placeholder="e.g. s.hayes@apex.com" />
      </FormField>

      <FormField id="phone" label="Direct Phone">
        <input {...p('phone')} type="tel" autoComplete="tel" inputMode="tel" placeholder="+1 (555) 019-2834" />
      </FormField>

      <FormField id="type" label="Production Format" required error={errors.type}>
        <select {...p('type')} className={`${inputClass} bg-[#0c0d12]`}>
          <option value="" className="bg-[#0c0d12] text-muted">Select Event Format</option>
          {eventTypes.map((t) => (
            <option key={t} value={t} className="bg-[#0c0d12] text-white">
              {t}
            </option>
          ))}
        </select>
      </FormField>

      <FormField id="date" label="Projected Event Date" error={errors.date}>
        <input {...p('date')} type="date" className={`${inputClass} [color-scheme:dark]`} />
      </FormField>

      <FormField id="location" label="Host City / Venue Target">
        <input {...p('location')} placeholder="e.g. London, Dubai, or Singapore" />
      </FormField>

      <FormField id="attendees" label="Expected Audience Size" error={errors.attendees}>
        <input {...p('attendees')} inputMode="numeric" placeholder="e.g. 1,500" />
      </FormField>

      <div className="sm:col-span-2">
        <FormField id="notes" label="Production Scope & Objectives">
          <textarea
            {...p('notes')}
            rows={4}
            placeholder="Outline your venue goals, creative vision, technical staging requirements, or any specific challenges."
          />
        </FormField>
      </div>

      {status === 'error' && (
        <p
          role="alert"
          className="flex items-center gap-3 rounded-lg border border-red-400/40 bg-red-500/10 p-4 text-xs text-red-200 sm:col-span-2"
        >
          <AlertCircle size={16} className="shrink-0 text-red-400" aria-hidden />
          <span>Something went wrong submitting your brief. Please verify your details or email us directly.</span>
        </p>
      )}

      <div className="sm:col-span-2 pt-2">
        <button
          type="submit"
          disabled={status === 'loading'}
          className="group relative inline-flex w-full items-center justify-center gap-3 overflow-hidden rounded-lg bg-gold px-8 py-4 text-[0.72rem] font-bold uppercase tracking-[0.22em] text-ink transition-all duration-300 hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] disabled:opacity-70 sm:w-auto"
        >
          <span
            aria-hidden
            className="absolute inset-0 -translate-x-full bg-white transition-transform duration-500 ease-out group-hover:translate-x-0"
          />
          <span className="relative flex items-center gap-3">
            {status === 'loading' ? (
              <>
                <Loader2 className="animate-spin" size={15} aria-hidden />
                <span>Transmitting Brief…</span>
              </>
            ) : (
              <>
                <span>Submit Production Brief</span>
                <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </>
            )}
          </span>
        </button>
      </div>
    </form>
  )
}
