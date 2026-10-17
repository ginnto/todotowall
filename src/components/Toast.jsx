import { CheckCircle2, AlertCircle } from 'lucide-react'

export default function Toast({ toast }) {
  if (!toast) return null
  const Icon = toast.tone === 'error' ? AlertCircle : CheckCircle2
  return (
    <div className={`toast toast-${toast.tone || 'success'}`} role="status" aria-live="polite">
      <Icon size={18} aria-hidden="true" />
      <span>{toast.message}</span>
    </div>
  )
}
