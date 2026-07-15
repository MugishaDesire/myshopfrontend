import { Link } from "react-router-dom";

const SERVICES = [
  {
    icon: "⚡",
    title: "Electronics",
    tag: "Tech & Gadgets",
    color: "#3b82f6",
    bg: "#eff6ff",
    desc: "Discover cutting-edge technology—from flagship smartphones to smart home innovations. All backed by comprehensive warranties and expert support.",
    features: ["Official warranties", "Expert setup support", "Same-day dispatch", "Price match guarantee"],
  },
  {
    icon: "👗",
    title: "Fashion",
    tag: "Clothing & Style",
    color: "#ec4899",
    bg: "#fdf2f8",
    desc: "Express your style with our handpicked collections. From timeless essentials to bold statement pieces—fresh drops delivered weekly.",
    features: ["Free returns (30 days)", "Size guides & styling tips", "New drops weekly", "Authentic brands only"],
  },
  {
    icon: "🍽️",
    title: "Food & Grocery",
    tag: "Fresh Delivery",
    color: "#10b981",
    bg: "#f0fdf4",
    desc: "Premium groceries and artisanal foods sourced locally and globally. Same-day delivery powered by our cold-chain network.",
    features: ["Same-day delivery", "Fresh & cold-chain", "Local & imported", "Subscription bundles"],
  },
  {
    icon: "🎨",
    title: "Art & Decor",
    tag: "Creative Living",
    color: "#f59e0b",
    bg: "#fffbeb",
    desc: "Authentic artworks and handcrafted decor from Rwanda's finest artists. Each piece carries a unique story and cultural heritage.",
    features: ["Artist-authenticated", "Gift wrapping", "Custom framing", "Corporate orders"],
  },
  {
    icon: "💄",
    title: "Beauty",
    tag: "Skincare & Wellness",
    color: "#a855f7",
    bg: "#faf5ff",
    desc: "Elevate your self-care ritual with premium skincare and wellness essentials. Clean, dermatologist-tested formulas for every skin type.",
    features: ["Clean ingredients", "All skin types", "Expert recommendations", "Loyalty rewards"],
  },
  {
    icon: "🚚",
    title: "Express Delivery",
    tag: "Logistics",
    color: "#f97316",
    bg: "#fff7ed",
    desc: "Reliable delivery network spanning Kigali and beyond. Track every step of your journey from checkout to doorstep.",
    features: ["Real-time tracking", "Same-day in Kigali", "Nationwide shipping", "Secure packaging"],
  },
];

const PROCESS = [
  { step: "01", title: "Explore", desc: "Browse thousands of products with intelligent filters and personalized recommendations.", icon: "🔍" },
  { step: "02", title: "Select", desc: "Build your cart at your own pace—we'll save your selections even if you step away.", icon: "🛒" },
  { step: "03", title: "Checkout", desc: "Complete your purchase with secure, frictionless payment. Your data stays protected.", icon: "🔒" },
  { step: "04", title: "Receive", desc: "Track your order in real-time. We keep you updated from dispatch to delivery.", icon: "📦" },
];

const STATS = [
  { value: "10K+", label: "Happy Customers" },
  { value: "5K+", label: "Products Listed" },
  { value: "50+", label: "Brand Partners" },
  { value: "4.9★", label: "Average Rating" },
];

export default function Services() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap');

        :root {
          --brand: #0f172a;
          --accent: #f97316;
          --accent-light: #fb923c;
          --green: #10b981;
          --bg: #f8fafc;
          --card: #ffffff;
          --border: #e2e8f0;
          --text: #0f172a;
          --muted: #64748b;
          --shadow-sm: 0 1px 3px rgba(0,0,0,0.06);
          --shadow-md: 0 4px 20px rgba(0,0,0,0.08);
          --shadow-lg: 0 12px 48px rgba(0,0,0,0.12);
          --shadow-xl: 0 20px 60px rgba(0,0,0,0.15);
          --radius: 20px;
          --radius-sm: 12px;
          --transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .sv-page {
          font-family: 'DM Sans', sans-serif;
          color: var(--text);
          background: var(--bg);
          min-height: 100vh;
          overflow-x: hidden;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .sv-animate {
          animation: fadeUp 0.8s ease forwards;
        }
        .sv-animate-delay-1 { animation-delay: 0.1s; opacity: 0; }
        .sv-animate-delay-2 { animation-delay: 0.2s; opacity: 0; }
        .sv-animate-delay-3 { animation-delay: 0.3s; opacity: 0; }
        .sv-animate-delay-4 { animation-delay: 0.4s; opacity: 0; }

        .sv-hero {
          background: linear-gradient(135deg, #0a0f1e 0%, #1a2a4a 50%, #0f172a 100%);
          padding: 100px 24px 120px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .sv-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(ellipse at 30% 20%, rgba(249,115,22,0.15) 0%, transparent 60%),
            radial-gradient(ellipse at 70% 80%, rgba(59,130,246,0.1) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, rgba(16,185,129,0.05) 0%, transparent 40%);
        }
        .sv-hero::after {
          content: '';
          position: absolute;
          inset: 0;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }
        .sv-hero-inner { 
          position: relative; 
          max-width: 800px; 
          margin: 0 auto; 
          z-index: 1;
        }
        .sv-hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(249,115,22,0.12);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(249,115,22,0.25);
          color: var(--accent-light);
          font-size: 0.78rem;
          font-weight: 700;
          padding: 8px 18px;
          border-radius: 100px;
          margin-bottom: 28px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          transition: var(--transition);
        }
        .sv-hero-badge:hover {
          background: rgba(249,115,22,0.2);
          transform: translateY(-2px);
        }
        .sv-hero h1 {
          font-family: 'Syne', sans-serif;
          font-size: clamp(2.6rem, 6vw, 4.2rem);
          font-weight: 800;
          color: #fff;
          line-height: 1.08;
          margin-bottom: 24px;
          letter-spacing: -0.02em;
        }
        .sv-hero h1 span { 
          background: linear-gradient(135deg, var(--accent), var(--accent-light));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .sv-hero p {
          color: rgba(255,255,255,0.6);
          font-size: 1.15rem;
          line-height: 1.8;
          max-width: 560px;
          margin: 0 auto 40px;
          font-weight: 400;
        }
        .sv-hero-cta {
          display: flex;
          gap: 16px;
          justify-content: center;
          flex-wrap: wrap;
        }
        .sv-btn-primary {
          background: linear-gradient(135deg, var(--accent), #ea580c);
          color: #fff;
          padding: 15px 32px;
          border-radius: var(--radius-sm);
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 1rem;
          text-decoration: none;
          transition: var(--transition);
          display: inline-flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 4px 20px rgba(249,115,22,0.35);
          border: none;
          cursor: pointer;
        }
        .sv-btn-primary:hover { 
          transform: translateY(-3px) scale(1.02); 
          box-shadow: 0 8px 32px rgba(249,115,22,0.5);
        }
        .sv-btn-secondary {
          background: rgba(255,255,255,0.06);
          backdrop-filter: blur(10px);
          border: 1.5px solid rgba(255,255,255,0.15);
          color: #fff;
          padding: 15px 32px;
          border-radius: var(--radius-sm);
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 1rem;
          text-decoration: none;
          transition: var(--transition);
        }
        .sv-btn-secondary:hover { 
          background: rgba(255,255,255,0.12);
          transform: translateY(-3px);
          border-color: rgba(255,255,255,0.3);
        }

        .sv-wave { display: block; line-height: 0; background: var(--brand); }
        .sv-wave svg { width: 100%; height: 64px; display: block; }

        .sv-stats {
          background: var(--brand);
          padding: 0 24px 56px;
          position: relative;
        }
        .sv-stats-inner {
          max-width: 960px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1px;
          background: rgba(255,255,255,0.06);
          border-radius: var(--radius);
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.06);
          backdrop-filter: blur(10px);
        }
        .sv-stat {
          padding: 32px 20px;
          text-align: center;
          background: rgba(255,255,255,0.02);
          transition: var(--transition);
          position: relative;
        }
        .sv-stat:hover {
          background: rgba(255,255,255,0.06);
        }
        .sv-stat::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 2px;
          background: var(--accent);
          transition: var(--transition);
        }
        .sv-stat:hover::after {
          width: 60%;
        }
        .sv-stat-val {
          font-family: 'Syne', sans-serif;
          font-size: 2.4rem;
          font-weight: 800;
          background: linear-gradient(135deg, var(--accent), var(--accent-light));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          display: block;
          margin-bottom: 4px;
        }
        .sv-stat-lbl {
          color: rgba(255,255,255,0.4);
          font-size: 0.85rem;
          font-weight: 500;
          letter-spacing: 0.02em;
        }
        @media (max-width: 600px) {
          .sv-stats-inner { grid-template-columns: repeat(2, 1fr); border-radius: var(--radius-sm); }
        }

        .sv-section { padding: 80px 24px; }
        .sv-section-alt { background: var(--card); }
        .sv-section-inner { max-width: 1200px; margin: 0 auto; }
        .sv-section-label {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #fff7ed;
          border: 1px solid #fed7aa;
          color: #ea580c;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 6px 14px;
          border-radius: 100px;
          margin-bottom: 16px;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          transition: var(--transition);
        }
        .sv-section-label:hover {
          background: #ffedd5;
          transform: translateX(4px);
        }
        .sv-section-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(1.8rem, 4vw, 2.8rem);
          font-weight: 800;
          color: var(--text);
          margin-bottom: 16px;
          line-height: 1.15;
          letter-spacing: -0.02em;
        }
        .sv-section-title span { 
          background: linear-gradient(135deg, var(--accent), var(--accent-light));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .sv-section-sub {
          color: var(--muted);
          font-size: 1.05rem;
          line-height: 1.8;
          max-width: 560px;
          margin-bottom: 52px;
        }

        .sv-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        @media (max-width: 960px) { .sv-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 560px) { .sv-grid { grid-template-columns: 1fr; } }

        .sv-card {
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: var(--radius);
          padding: 32px;
          transition: var(--transition);
          position: relative;
          overflow: hidden;
          cursor: pointer;
        }
        .sv-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 4px;
          background: var(--c, var(--accent));
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .sv-card::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, var(--c, var(--accent)), transparent);
          opacity: 0;
          transition: var(--transition);
          pointer-events: none;
        }
        .sv-card:hover { 
          transform: translateY(-8px); 
          box-shadow: var(--shadow-xl);
          border-color: transparent;
        }
        .sv-card:hover::before { transform: scaleX(1); }
        .sv-card:hover::after { opacity: 0.04; }

        .sv-card-icon {
          width: 64px;
          height: 64px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.8rem;
          margin-bottom: 20px;
          background: var(--ibg, #fff7ed);
          transition: var(--transition);
          position: relative;
          z-index: 1;
        }
        .sv-card:hover .sv-card-icon {
          transform: scale(1.05) rotate(-2deg);
        }
        .sv-card-tag {
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--c, var(--accent));
          margin-bottom: 8px;
          position: relative;
          z-index: 1;
        }
        .sv-card-title {
          font-family: 'Syne', sans-serif;
          font-size: 1.3rem;
          font-weight: 800;
          color: var(--text);
          margin-bottom: 12px;
          position: relative;
          z-index: 1;
        }
        .sv-card-desc {
          color: var(--muted);
          font-size: 0.9rem;
          line-height: 1.7;
          margin-bottom: 20px;
          position: relative;
          z-index: 1;
        }
        .sv-card-features {
          list-style: none;
          padding: 0; margin: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
          position: relative;
          z-index: 1;
        }
        .sv-card-features li {
          font-size: 0.84rem;
          color: var(--text);
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 500;
        }
        .sv-card-features li::before {
          content: '✓';
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: var(--ibg, #fff7ed);
          color: var(--c, var(--accent));
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          font-weight: 700;
          flex-shrink: 0;
          transition: var(--transition);
        }
        .sv-card:hover .sv-card-features li::before {
          transform: scale(1.1);
        }

        .sv-process {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 28px;
          position: relative;
        }
        .sv-process::before {
          content: '';
          position: absolute;
          top: 40px;
          left: 12%;
          right: 12%;
          height: 2px;
          background: linear-gradient(90deg, var(--accent), #3b82f6, var(--green));
          z-index: 0;
          opacity: 0.2;
        }
        @media (max-width: 768px) {
          .sv-process { grid-template-columns: repeat(2, 1fr); gap: 32px; }
          .sv-process::before { display: none; }
        }
        @media (max-width: 460px) { .sv-process { grid-template-columns: 1fr; } }

        .sv-step {
          text-align: center;
          position: relative;
          z-index: 1;
          transition: var(--transition);
        }
        .sv-step:hover {
          transform: translateY(-4px);
        }
        .sv-step-num {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--accent), #ea580c);
          color: #fff;
          font-family: 'Syne', sans-serif;
          font-size: 1.2rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          box-shadow: 0 8px 32px rgba(249,115,22,0.3);
          position: relative;
          transition: var(--transition);
        }
        .sv-step:hover .sv-step-num {
          transform: scale(1.05) rotate(-4deg);
          box-shadow: 0 12px 40px rgba(249,115,22,0.4);
        }
        .sv-step-emoji {
          position: absolute;
          top: -6px;
          right: -6px;
          width: 32px;
          height: 32px;
          background: #fff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.95rem;
          box-shadow: var(--shadow-sm);
          animation: float 3s ease-in-out infinite;
        }
        .sv-step-title {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 1.05rem;
          color: var(--text);
          margin-bottom: 8px;
        }
        .sv-step-desc {
          color: var(--muted);
          font-size: 0.85rem;
          line-height: 1.6;
          max-width: 200px;
          margin: 0 auto;
        }

        .sv-why {
          background: linear-gradient(135deg, #0a0f1e 0%, #1a2a4a 50%, #0f172a 100%);
          padding: 80px 24px;
          position: relative;
          overflow: hidden;
        }
        .sv-why::before {
          content: '';
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(ellipse at 20% 50%, rgba(249,115,22,0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 50%, rgba(59,130,246,0.05) 0%, transparent 50%);
        }
        .sv-why-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
          position: relative;
          z-index: 1;
        }
        @media (max-width: 768px) { .sv-why-inner { grid-template-columns: 1fr; gap: 48px; } }
        .sv-why-text .sv-section-label { 
          background: rgba(249,115,22,0.12); 
          border-color: rgba(249,115,22,0.2); 
          color: var(--accent-light);
        }
        .sv-why-text .sv-section-title { color: #fff; }
        .sv-why-text .sv-section-sub { 
          color: rgba(255,255,255,0.5); 
          margin-bottom: 36px;
        }
        .sv-why-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .sv-why-item {
          display: flex;
          gap: 16px;
          align-items: flex-start;
          padding: 16px;
          border-radius: var(--radius-sm);
          transition: var(--transition);
          cursor: pointer;
        }
        .sv-why-item:hover {
          background: rgba(255,255,255,0.04);
          transform: translateX(4px);
        }
        .sv-why-icon {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-sm);
          background: rgba(249,115,22,0.12);
          border: 1px solid rgba(249,115,22,0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          flex-shrink: 0;
          transition: var(--transition);
        }
        .sv-why-item:hover .sv-why-icon {
          background: rgba(249,115,22,0.2);
          transform: scale(1.05);
        }
        .sv-why-item-title {
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          color: #fff;
          font-size: 1rem;
          margin-bottom: 4px;
        }
        .sv-why-item-desc { 
          color: rgba(255,255,255,0.4); 
          font-size: 0.85rem; 
          line-height: 1.6;
        }
        .sv-why-cards {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .sv-why-card {
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: var(--radius);
          padding: 28px 20px;
          text-align: center;
          transition: var(--transition);
          cursor: pointer;
        }
        .sv-why-card:hover {
          background: rgba(255,255,255,0.08);
          transform: translateY(-4px);
          border-color: rgba(249,115,22,0.2);
        }
        .sv-why-card-val {
          font-family: 'Syne', sans-serif;
          font-size: 2rem;
          font-weight: 800;
          background: linear-gradient(135deg, var(--accent), var(--accent-light));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          display: block;
          margin-bottom: 4px;
        }
        .sv-why-card-lbl { 
          color: rgba(255,255,255,0.4); 
          font-size: 0.82rem;
          font-weight: 500;
        }

        .sv-cta {
          background: linear-gradient(135deg, var(--accent), #ea580c);
          padding: 64px 24px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .sv-cta::before {
          content: '';
          position: absolute;
          inset: 0;
          background: 
            radial-gradient(ellipse at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 60%),
            radial-gradient(ellipse at 80% 50%, rgba(255,255,255,0.05) 0%, transparent 60%);
        }
        .sv-cta h2 {
          font-family: 'Syne', sans-serif;
          font-size: clamp(1.8rem, 4vw, 2.8rem);
          font-weight: 800;
          color: #fff;
          margin-bottom: 16px;
          position: relative;
          z-index: 1;
        }
        .sv-cta p { 
          color: rgba(255,255,255,0.85); 
          font-size: 1.05rem; 
          margin-bottom: 32px;
          position: relative;
          z-index: 1;
          max-width: 500px;
          margin-left: auto;
          margin-right: auto;
        }
        .sv-cta-btns { 
          display: flex; 
          gap: 16px; 
          justify-content: center; 
          flex-wrap: wrap;
          position: relative;
          z-index: 1;
        }
        .sv-cta-btn-w {
          background: #fff;
          color: #ea580c;
          padding: 15px 32px;
          border-radius: var(--radius-sm);
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 1rem;
          text-decoration: none;
          transition: var(--transition);
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        }
        .sv-cta-btn-w:hover { 
          transform: translateY(-3px) scale(1.02); 
          box-shadow: 0 8px 32px rgba(0,0,0,0.2);
        }
        .sv-cta-btn-t {
          background: rgba(255,255,255,0.12);
          backdrop-filter: blur(10px);
          border: 2px solid rgba(255,255,255,0.3);
          color: #fff;
          padding: 15px 32px;
          border-radius: var(--radius-sm);
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 1rem;
          text-decoration: none;
          transition: var(--transition);
        }
        .sv-cta-btn-t:hover { 
          background: rgba(255,255,255,0.2);
          transform: translateY(-3px);
          border-color: rgba(255,255,255,0.5);
        }
      `}</style>

      <div className="sv-page">

        <section className="sv-hero">
          <div className="sv-hero-inner">
            <div className="sv-hero-badge sv-animate">✦ What We Offer</div>
            <h1 className="sv-animate sv-animate-delay-1">Everything You Need,<br /><span>One Place to Find It</span></h1>
            <p className="sv-animate sv-animate-delay-2">From tech gadgets to fresh groceries, fashion to fine art — MyShop brings Rwanda's best products and services right to your door.</p>
            <div className="sv-hero-cta sv-animate sv-animate-delay-3">
              <Link to="/" className="sv-btn-primary">🛍️ Shop Now</Link>
              <Link to="/contact" className="sv-btn-secondary">Talk to Us</Link>
            </div>
          </div>
        </section>

        <div className="sv-wave" style={{ background: "#f8fafc" }}>
          <svg viewBox="0 0 1440 64" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,32 C360,64 1080,0 1440,32 L1440,64 L0,64 Z" fill="#0f172a" />
          </svg>
        </div>

        <div className="sv-stats">
          <div className="sv-stats-inner">
            {STATS.map((s, i) => (
              <div className="sv-stat" key={s.label}>
                <span className="sv-stat-val">{s.value}</span>
                <span className="sv-stat-lbl">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        <section className="sv-section">
          <div className="sv-section-inner">
            <div className="sv-section-label">✦ Our Services</div>
            <h2 className="sv-section-title">Categories We <span>Specialise In</span></h2>
            <p className="sv-section-sub">Every category is carefully managed with dedicated product teams, quality checks, and fast fulfilment.</p>

            <div className="sv-grid">
              {SERVICES.map(s => (
                <div
                  className="sv-card"
                  key={s.title}
                  style={{ "--c": s.color, "--ibg": s.bg }}
                >
                  <div className="sv-card-icon" style={{ background: s.bg }}>{s.icon}</div>
                  <div className="sv-card-tag">{s.tag}</div>
                  <div className="sv-card-title">{s.title}</div>
                  <p className="sv-card-desc">{s.desc}</p>
                  <ul className="sv-card-features">
                    {s.features.map(f => <li key={f}>{f}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="sv-section sv-section-alt">
          <div className="sv-section-inner">
            <div className="sv-section-label">✦ How It Works</div>
            <h2 className="sv-section-title">Shop in <span>4 Simple Steps</span></h2>
            <p className="sv-section-sub">We've made the shopping experience as smooth as possible — from discovery to your doorstep.</p>

            <div className="sv-process">
              {PROCESS.map(p => (
                <div className="sv-step" key={p.step}>
                  <div className="sv-step-num">
                    {p.step}
                    <div className="sv-step-emoji">{p.icon}</div>
                  </div>
                  <div className="sv-step-title">{p.title}</div>
                  <p className="sv-step-desc">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="sv-why">
          <div className="sv-why-inner">
            <div className="sv-why-text">
              <div className="sv-section-label">✦ Why MyShop</div>
              <h2 className="sv-section-title">Built for <span>Rwandans</span>,<br />Trusted by All</h2>
              <p className="sv-section-sub">We're not just a shop — we're a platform built around your convenience, safety, and satisfaction.</p>
              <div className="sv-why-list">
                {[
                  { icon: "🛡️", title: "Buyer Protection", desc: "Every purchase is protected. Full refund if something goes wrong." },
                  { icon: "⚡", title: "Lightning Fast Delivery", desc: "Same-day delivery in Kigali. Orders placed before 12PM arrive today." },
                  { icon: "🤝", title: "Verified Sellers Only", desc: "All vendors go through strict verification — no fakes, no surprises." },
                  { icon: "💬", title: "24/7 Support", desc: "Our support team is always on standby via WhatsApp, email or phone." },
                ].map(w => (
                  <div className="sv-why-item" key={w.title}>
                    <div className="sv-why-icon">{w.icon}</div>
                    <div>
                      <div className="sv-why-item-title">{w.title}</div>
                      <div className="sv-why-item-desc">{w.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="sv-why-cards">
              {[
                { val: "99%", lbl: "On-time Delivery" },
                { val: "24/7", lbl: "Customer Support" },
                { val: "30d", lbl: "Easy Returns" },
                { val: "0%", lbl: "Hidden Fees" },
              ].map(c => (
                <div className="sv-why-card" key={c.lbl}>
                  <span className="sv-why-card-val">{c.val}</span>
                  <span className="sv-why-card-lbl">{c.lbl}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="sv-cta">
          <h2>Ready to Start Shopping?</h2>
          <p>Join thousands of happy customers across Rwanda. Your next favourite product is one click away.</p>
          <div className="sv-cta-btns">
            <Link to="/" className="sv-cta-btn-w">🛍️ Explore Products</Link>
            <Link to="/contact" className="sv-cta-btn-t">📞 Contact Us</Link>
          </div>
        </section>

      </div>
    </>
  );
}