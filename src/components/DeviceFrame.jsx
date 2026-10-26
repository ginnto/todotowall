export default function DeviceFrame({ children, aspectRatio, label, isDesktop = false }) {
  return (
    <figure className={`device-frame ${isDesktop ? 'is-desktop' : ''}`} style={{ aspectRatio }} aria-label={label}>
      <div className="device-bezel">
        <span className="device-notch" aria-hidden="true" />
        {children}
      </div>
      <figcaption className="sr-only">{label}</figcaption>
    </figure>
  )
}
