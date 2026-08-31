import { useEffect, useState } from 'react'

const dateFormatter = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
})

const timeFormatter = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
})

/**
 * Returns a live-updating Persian calendar date string and 24h time string.
 * Ticks once per second; a single interval is shared for the component's
 * lifetime and cleaned up on unmount.
 */
export default function usePersianClock() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  return {
    date: dateFormatter.format(now),
    time: timeFormatter.format(now),
  }
}
