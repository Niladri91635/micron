import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, background: "#f5f8fa", color: "#12324a" }}>
      <section style={{ textAlign: "center", maxWidth: 520 }}>
        <p style={{ letterSpacing: ".18em", fontSize: 11, fontWeight: 800 }}>404 · PAGE NOT FOUND</p>
        <h1 style={{ fontSize: "clamp(42px, 7vw, 72px)", margin: "12px 0" }}>Nothing here.</h1>
        <p style={{ color: "#6b7f8d", lineHeight: 1.7 }}>The page you requested does not exist or may have moved.</p>
        <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 18, padding: "11px 16px", background: "#12324a", color: "#fff", textDecoration: "none", borderRadius: 4 }}>
          <ArrowLeft size={15} /> Back to home
        </Link>
      </section>
    </main>
  );
}

export default NotFound;
