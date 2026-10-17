export default function DeviceFrame({ children, aspectRatio, label }) {
  return (
    <figure className="device-frame" style={{ aspectRatio }} aria-label={label}>
      <div className="device-bezel">
        <span className="device-notch" aria-hidden="true" />
        {children}
      </div>
      <figcaption className="sr-only">{label}</figcaption>
    </figure>
  )
}
