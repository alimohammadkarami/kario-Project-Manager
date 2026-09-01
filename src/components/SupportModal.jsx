import { useEffect, useRef, useState } from 'react'
import { CloseIcon, HeadsetIcon } from './icons'

const EMPTY = { subject: '', description: '' }

export default function SupportModal({ open, onClose }) {
  const [form, setForm] = useState(EMPTY)
  const [sent, setSent] = useState(false)
  const subjectRef = useRef(null)
  const closeTimer = useRef(null)

  useEffect(() => {
    if (!open) return
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const id = requestAnimationFrame(() => subjectRef.current?.focus())
    return () => {
      cancelAnimationFrame(id)
      document.body.style.overflow = original
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  useEffect(() => {
    if (!open) {
      setForm(EMPTY)
      setSent(false)
      if (closeTimer.current) window.clearTimeout(closeTimer.current)
    }
  }, [open])

  const handleClose = () => {
    onClose()
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!form.subject.trim() || !form.description.trim()) return
    setSent(true)
    closeTimer.current = window.setTimeout(() => {
      onClose()
    }, 1100)
  }

  if (!open) return null

  const fieldClass =
    'w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-brand-400 focus:bg-white focus:ring-2 focus:ring-brand-600/15 dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-brand-500 dark:focus:bg-white/8'

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-3 sm:items-center" dir="rtl">
      <div
        onClick={handleClose}
        className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="support-modal-title"
        className="relative w-full max-w-md rounded-3xl bg-white p-5 shadow-xl shadow-slate-900/15 dark:bg-surface-dark sm:p-6"
      >
        <div className="mb-5 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-100 text-brand-600 dark:bg-brand-600/20 dark:text-brand-300">
              <HeadsetIcon className="h-5 w-5" />
            </span>
            <div>
              <h2 id="support-modal-title" className="text-base font-semibold text-slate-800 dark:text-slate-100">
                پشتیبانی
              </h2>
              <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                موضوع و توضیحات را بنویسید؛ همین.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-white/8 dark:hover:text-slate-200"
            aria-label="بستن"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>

        {sent ? (
          <p className="rounded-xl bg-brand-50 px-4 py-6 text-center text-sm font-medium text-brand-700 dark:bg-brand-600/15 dark:text-brand-300">
            تیکت ثبت شد
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">موضوع</span>
              <input
                ref={subjectRef}
                name="subject"
                value={form.subject}
                onChange={handleChange}
                required
                autoComplete="off"
                placeholder="مثلاً مشکل ورود به پروژه"
                className={fieldClass}
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">توضیحات</span>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows={4}
                placeholder="چه اتفاقی افتاده؟"
                className={`${fieldClass} resize-none`}
              />
            </label>

            <button
              type="submit"
              className="mt-1 w-full rounded-xl bg-brand-600 py-3 text-sm font-medium text-white shadow-sm shadow-brand-600/30 transition-colors hover:bg-brand-700 active:bg-brand-800"
            >
              ارسال تیکت
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
