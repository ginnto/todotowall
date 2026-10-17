export default function TaskProgress({ progress }) {
  return (
    <section className="progress-card" aria-label="Daily progress">
      <div className="progress-copy">
        <p className="section-kicker">Progress</p>
        <strong>{progress.percent}%</strong>
        <p>
          {progress.completed} complete · {progress.remaining} remaining · {progress.total} total
        </p>
      </div>
      <div className="progress-track" aria-hidden="true">
        <span style={{ width: `${progress.percent}%` }} />
      </div>
      <progress className="sr-only" max={100} value={progress.percent}>
        {progress.percent}% complete
      </progress>
    </section>
  )
}
