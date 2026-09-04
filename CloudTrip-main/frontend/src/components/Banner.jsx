export default function Banner({ banner, onDismiss }) {
  if (!banner) return null;

  return (
    <div className={`banner ${banner.type === "error" ? "banner-error" : "banner-success"}`}>
      <span>{banner.message}</span>
      <button type="button" className="banner-close" onClick={onDismiss} aria-label="Dismiss">
        ×
      </button>
    </div>
  );
}
