/** Joins class names, skipping falsy values. */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

/** Formats an ISO date string as "27 Aug 2026, 10:15 AM". */
export function formatDateTime(iso) {
  const d = new Date(iso)
  return d.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

/** Formats an ISO date string as "27 Aug 2026". */
export function formatDate(iso) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

/** Generates a new inspection ID in the same format as the seed data. */
export function generateInspectionId(existingCount) {
  const year = new Date().getFullYear()
  const seq = String(143 + existingCount).padStart(4, '0')
  return `INS-${year}-${seq}`
}

export const STATUS_META = {
  compliant: { label: 'Compliant', tone: 'verified' },
  review: { label: 'Needs Review', tone: 'caution' },
  violation: { label: 'Potential Violation', tone: 'violation' },
}
