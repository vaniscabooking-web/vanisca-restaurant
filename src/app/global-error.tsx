"use client";

/**
 * Root error boundary — the last-resort fallback that renders when the root
 * layout itself fails, so it must be fully self-contained (its own <html>/
 * <body>, inline styles; globals.css and the intl provider are not guaranteed
 * here). Kept minimal and on-brand (charcoal + gold).
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="fr">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0d0b09",
          color: "#f4eee2",
          fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
          textAlign: "center",
          padding: "2rem",
        }}
      >
        <div style={{ maxWidth: "32rem" }}>
          <p
            style={{
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              fontSize: "0.7rem",
              color: "#c8a45c",
              margin: 0,
            }}
          >
            Vanisca
          </p>
          <h1 style={{ fontSize: "2rem", fontWeight: 500, margin: "1rem 0 0.5rem" }}>
            Something went wrong
          </h1>
          <p style={{ color: "rgba(244,238,226,0.7)", lineHeight: 1.6, margin: "0 0 1.75rem" }}>
            An unexpected error occurred. Please try again.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              cursor: "pointer",
              border: 0,
              background: "linear-gradient(135deg,#e6cd93,#c8a45c,#9c7c3e)",
              color: "#0d0b09",
              padding: "0.75rem 1.75rem",
              borderRadius: "9999px",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              fontSize: "0.75rem",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
