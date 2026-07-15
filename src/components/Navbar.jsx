import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

const CATEGORIES = [
  { label: "Electronics", icon: "⚡" },
  { label: "Fashion",     icon: "👗" },
  { label: "Food",        icon: "🍽️" },
  { label: "Art",         icon: "🎨" },
  { label: "Beauty",      icon: "💄" },
];

export default function Navbar() {
  const location  = useLocation();
  const navigate  = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user,             setUser]             = useState(null);
  const [openCategory,     setOpenCategory]     = useState(null);
  const [searchQuery,      setSearchQuery]      = useState("");
  const [cartCount,        setCartCount]        = useState(0);
  const [wishlistCount,    setWishlistCount]    = useState(0);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const categoryRef    = useRef(null);
  const mobileSearchRef = useRef(null);

  /* ── counts ── */
  const readCounts = () => {
    try { const c = JSON.parse(localStorage.getItem("shoppingCart") || "[]"); setCartCount(c.reduce((s, i) => s + (i.quantity || 1), 0)); } catch { setCartCount(0); }
    try { const w = JSON.parse(localStorage.getItem("wishlist")     || "[]"); setWishlistCount(w.length); }                                 catch { setWishlistCount(0); }
  };
  useEffect(() => {
    readCounts();
    ["cartUpdated","wishlistUpdated","storage","focus"].forEach(e => window.addEventListener(e, readCounts));
    return () => ["cartUpdated","wishlistUpdated","storage","focus"].forEach(e => window.removeEventListener(e, readCounts));
  }, []);

  /* ── user ── */
  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (raw && raw !== "undefined" && raw !== "null") {
      try { setUser(JSON.parse(raw)); } catch { localStorage.removeItem("user"); }
    } else { setUser(null); }
  }, [location]);

  /* ── close on route change ── */
  useEffect(() => { setIsMobileMenuOpen(false); setOpenCategory(null); setShowMobileSearch(false); }, [location]);

  /* ── body scroll lock ── */
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isMobileMenuOpen]);

  /* ── close category dropdown on outside click ── */
  useEffect(() => {
    const h = (e) => { if (categoryRef.current && !categoryRef.current.contains(e.target)) setOpenCategory(null); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  /* ── close mobile search on outside click ── */
  useEffect(() => {
    if (!showMobileSearch) return;
    const h = (e) => { if (mobileSearchRef.current && !mobileSearchRef.current.contains(e.target)) setShowMobileSearch(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [showMobileSearch]);

  const isActive = (path) => location.pathname === path;

  const getUserInitials = () => {
    if (!user) return "U";
    const name = user.fullname || user.name || user.email || "U";
    return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setIsMobileMenuOpen(false);
    window.location.href = "/";
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) { navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`); setShowMobileSearch(false); }
  };

  return (
    <>
      <header className="site-header">

        {/* ── PROMO BAR ── */}
        <div className="discover-bar">
          <span className="discover-text">✨ Discover Amazing Products</span>
        </div>

        {/* ══════════════════════════════════════
            TOP BAR
        ══════════════════════════════════════ */}
        <div className="top-bar">
          <div className="top-bar-inner">

            {/* Hamburger — visible on all screen sizes, opens the drawer */}
            <button
              className={`hamburger-top ${isMobileMenuOpen ? "open" : ""}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              <span /><span /><span />
            </button>

            {/* Logo */}
            <Link to="/" className="logo">
              <span className="logo-icon">🛍️</span>
              <span className="logo-text">MyShop</span>
            </Link>

            {/* Category Dropdown — hidden on mobile */}
            <div className="categories-wrap desktop-only" ref={categoryRef}>
              <button
                className="all-categories-btn"
                onClick={() => setOpenCategory(openCategory === "all" ? null : "all")}
                aria-expanded={openCategory === "all"}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                  <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
                </svg>
                All Categories
                <svg className={`chevron ${openCategory === "all" ? "up" : ""}`} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
              {openCategory === "all" && (
                <div className="mega-dropdown">
                  {CATEGORIES.map(cat => (
                    <Link key={cat.label} to={`/category/${cat.label.toLowerCase()}`} className="mega-cat-link" onClick={() => setOpenCategory(null)}>
                      <span className="mega-cat-icon">{cat.icon}</span>{cat.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Search — hidden on mobile (replaced by icon) */}
            <form className="search-form desktop-only" onSubmit={handleSearch}>
              <input
                type="text" className="search-input"
                placeholder="Search products, brands..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="search-btn" aria-label="Search">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </button>
            </form>

            {/* Mobile search icon */}
            <button
              className="mobile-search-icon mobile-only"
              onClick={() => setShowMobileSearch(s => !s)}
              aria-label="Search"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </button>

            {/* Right Actions */}
            <div className="top-actions">
              {/* Wishlist */}
              <Link to="/wishlist" className="action-icon-btn" aria-label="Wishlist">
                <span className="action-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                  {wishlistCount > 0 && <span className="badge red">{wishlistCount}</span>}
                </span>
                <span className="action-label">Wishlist</span>
              </Link>

              {/* Cart */}
              <Link to="/cart" className="action-icon-btn" aria-label="Cart">
                <span className="action-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                  </svg>
                  {cartCount > 0 && <span className="badge yellow">{cartCount}</span>}
                </span>
                <span className="action-label">Cart</span>
              </Link>

              {/* Account — avatar only on mobile, full button on desktop */}
              <Link
                to={user ? "/userdashboard" : "/ulogin"}
                className={`account-btn ${user ? "logged-in" : ""}`}
                aria-label="My Account"
              >
                {user ? (
                  <>
                    <div className="avatar">{getUserInitials()}</div>
                    <div className="account-info desktop-only">
                      <span className="account-name">{user.fullname || user.name || user.email}</span>
                      <span className="account-status">● Logged In</span>
                    </div>
                  </>
                ) : (
                  <>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    <div className="account-info desktop-only">
                      <span className="account-name">My Account</span>
                      <span className="account-status">Sign In / Register</span>
                    </div>
                  </>
                )}
              </Link>
            </div>
          </div>

          {/* Mobile Search Dropdown */}
          {showMobileSearch && (
            <div className="mobile-search-bar" ref={mobileSearchRef}>
              <form onSubmit={handleSearch} style={{ display:"flex", width:"100%" }}>
                <input
                  autoFocus
                  type="text" className="mobile-search-input"
                  placeholder="Search products, brands..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="search-btn" aria-label="Search">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Bottom bar removed — Home / About / Contact / Services now live
            exclusively in the drawer (hamburger), which is available at
            every screen size. This avoids duplicate navigation. */}
      </header>

      {/* ══════════════════════════════════════
          DRAWER (used at all screen sizes)
      ══════════════════════════════════════ */}
      {isMobileMenuOpen && (
        <div className="mobile-overlay" onClick={() => setIsMobileMenuOpen(false)} />
      )}
      <div className={`mobile-drawer ${isMobileMenuOpen ? "open" : ""}`}>
        <div className="drawer-header">
          <span className="drawer-title">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
              <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
            </svg>
            Menu
          </span>
          <button className="drawer-close" onClick={() => setIsMobileMenuOpen(false)}>✕</button>
        </div>

        <div className="drawer-body">
          {user && (
            <div className="drawer-user-card">
              <div className="drawer-avatar">{getUserInitials()}</div>
              <div>
                <div className="drawer-username">{user.fullname || user.name || user.email}</div>
                <div className="drawer-userstatus">● Logged In</div>
              </div>
            </div>
          )}

          <div className="drawer-section-title">Categories</div>
          {CATEGORIES.map(cat => (
            <Link key={cat.label} to={`/category/${cat.label.toLowerCase()}`} className="drawer-nav-link" onClick={() => setIsMobileMenuOpen(false)}>
              <span>{cat.icon}</span>{cat.label}
            </Link>
          ))}

          <div className="drawer-divider" />
          <div className="drawer-section-title">Navigation</div>
          {[
            { to:"/",        label:"Home",     icon:"🏠" },
            { to:"/about",   label:"About Us", icon:"ℹ️" },
            { to:"/contact", label:"Contact",  icon:"📞" },
            { to:"/services",label:"Services", icon:"🛠️" },
          ].map(({ to, label, icon }) => (
            <Link key={to} to={to} className={`drawer-nav-link ${isActive(to) ? "active" : ""}`} onClick={() => setIsMobileMenuOpen(false)}>
              <span>{icon}</span>{label}
            </Link>
          ))}

          <div className="drawer-divider" />

          {user ? (
            <>
              <Link to="/userdashboard" className="drawer-nav-link" onClick={() => setIsMobileMenuOpen(false)}>📊 Dashboard</Link>
              <Link to="/profile"       className="drawer-nav-link" onClick={() => setIsMobileMenuOpen(false)}>⚙️ Profile Settings</Link>
              <button className="drawer-nav-link logout" onClick={handleLogout}>🚪 Sign Out</button>
            </>
          ) : (
            <>
              <Link to="/ulogin" className="drawer-nav-link" onClick={() => setIsMobileMenuOpen(false)}>👤 My Account</Link>
              <Link to="/login"  className="drawer-nav-link" onClick={() => setIsMobileMenuOpen(false)}>🔐 Admin Login</Link>
            </>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════
          STYLES
      ══════════════════════════════════════ */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --brand:  #0f172a;
          --brand2: #1e293b;
          --accent: #f97316;
          --accent2:#fb923c;
          --gold:   #fbbf24;
          --white:  #ffffff;
          --muted:  #94a3b8;
          --green:  #10b981;
          --red:    #ef4444;
          --radius: 10px;
          --shadow: 0 4px 24px rgba(0,0,0,0.12);
        }

        /* ── Visibility helpers ── */
        .desktop-only { display: flex; }
        .mobile-only  { display: none; }

        /* ── Header shell ── */
        .site-header {
          position: sticky; top: 0; z-index: 1000;
          font-family: 'DM Sans', sans-serif;
          box-shadow: var(--shadow);
        }

        /* ── Promo bar ── */
        .discover-bar {
          background: linear-gradient(90deg,#5b5e67,#585c65,#62666f);
          background-size: 200% 100%;
          animation: shimmer 4s linear infinite;
          text-align: center; padding: 5px 16px;
        }
        @keyframes shimmer { 0%{background-position:0%}100%{background-position:200%} }
        .discover-text {
          font-size: 0.75rem; font-weight: 600;
          color: rgba(255,255,255,0.85);
          letter-spacing: 0.06em; text-transform: uppercase;
        }

        /* ── Top bar ── */
        .top-bar {
          background: var(--brand);
          border-bottom: 2px solid rgba(249,115,22,0.35);
        }
        .top-bar-inner {
          max-width: 1400px; margin: 0 auto;
          padding: 0 20px; height: 64px;
          display: flex; align-items: center; gap: 16px;
        }

        /* ── Hamburger (top bar) — visible at every screen size ── */
        .hamburger-top {
          display: flex;
          flex-direction: column; justify-content: center;
          gap: 5px;
          background: rgba(249,115,22,0.12);
          border: 1px solid rgba(249,115,22,0.3);
          border-radius: 8px;
          width: 40px; height: 40px;
          padding: 8px;
          cursor: pointer;
          flex-shrink: 0;
          transition: background 0.2s;
        }
        .hamburger-top span {
          display: block; height: 2px; border-radius: 2px;
          background: var(--accent);
          transition: all 0.3s;
          transform-origin: center;
        }
        .hamburger-top:hover { background: rgba(249,115,22,0.25); }
        /* Animate to X */
        .hamburger-top.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .hamburger-top.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .hamburger-top.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

        /* ── Logo ── */
        .logo {
          display: flex; align-items: center; gap: 9px;
          text-decoration: none; flex-shrink: 0;
          transition: transform 0.2s;
        }
        .logo:hover { transform: scale(1.04); }
        .logo-icon { font-size: 24px; }
        .logo-text {
          font-family: 'Syne', sans-serif;
          font-size: 1.65rem; font-weight: 800;
          background: linear-gradient(135deg,#fff 30%,var(--accent2));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          letter-spacing: -0.5px;
        }

        /* ── Categories ── */
        .categories-wrap { position: relative; flex-shrink: 0; }
        .all-categories-btn {
          display: flex; align-items: center; gap: 7px;
          background: var(--accent); color: white;
          border: none; padding: 9px 15px;
          border-radius: var(--radius);
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem; font-weight: 600;
          cursor: pointer; white-space: nowrap;
          transition: all 0.2s;
        }
        .all-categories-btn:hover {
          background: var(--accent2);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(249,115,22,0.4);
        }
        .chevron { transition: transform 0.25s; }
        .chevron.up { transform: rotate(180deg); }
        .mega-dropdown {
          position: absolute; top: calc(100% + 8px); left: 0;
          min-width: 195px; background: white;
          border-radius: 12px; border: 1px solid #e2e8f0;
          box-shadow: 0 12px 40px rgba(0,0,0,0.15);
          overflow: hidden; z-index: 2000;
          animation: dropIn 0.2s ease;
          padding: 6px 0;
        }
        @keyframes dropIn { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        .mega-cat-link {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 18px; color: var(--brand2);
          text-decoration: none; font-size: 0.9rem; font-weight: 600;
          transition: all 0.15s;
        }
        .mega-cat-link:hover { background: #fff7ed; color: var(--accent); padding-left: 24px; }
        .mega-cat-icon { font-size: 1.05rem; }

        /* ── Search ── */
        .search-form {
          flex: 1; min-width: 0;
          background: rgba(255,255,255,0.08);
          border: 1.5px solid rgba(255,255,255,0.15);
          border-radius: var(--radius); overflow: hidden;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .search-form:focus-within {
          border-color: var(--accent);
          box-shadow: 0 0 0 3px rgba(249,115,22,0.2);
          background: rgba(255,255,255,0.12);
        }
        .search-input {
          flex: 1; border: none; outline: none;
          background: transparent; color: white;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.92rem; padding: 0 15px; min-width: 0;
        }
        .search-input::placeholder { color: rgba(255,255,255,0.45); }
        .search-btn {
          background: var(--accent); border: none; color: white;
          width: 44px; display: flex; align-items: center;
          justify-content: center; cursor: pointer;
          transition: background 0.2s; flex-shrink: 0;
        }
        .search-btn:hover { background: var(--accent2); }

        /* Mobile search icon button */
        .mobile-search-icon {
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 8px; color: rgba(255,255,255,0.85);
          width: 40px; height: 40px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: background 0.2s; flex-shrink: 0;
        }
        .mobile-search-icon:hover { background: rgba(255,255,255,0.15); }

        /* Mobile search dropdown */
        .mobile-search-bar {
          padding: 10px 16px 12px;
          border-top: 1px solid rgba(255,255,255,0.08);
          display: flex;
          animation: dropIn 0.2s ease;
        }
        .mobile-search-input {
          flex: 1; border: none; outline: none;
          background: rgba(255,255,255,0.1);
          color: white; font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem; padding: 10px 14px;
          border-radius: var(--radius) 0 0 var(--radius);
          border: 1.5px solid rgba(255,255,255,0.15);
          border-right: none;
        }
        .mobile-search-input::placeholder { color: rgba(255,255,255,0.45); }
        .mobile-search-bar .search-btn {
          border-radius: 0 var(--radius) var(--radius) 0;
          width: 48px; height: auto;
        }

        /* ── Right actions ── */
        .top-actions {
          display: flex; align-items: center; gap: 2px; flex-shrink: 0;
        }
        .action-icon-btn {
          display: flex; flex-direction: column; align-items: center;
          gap: 2px; color: rgba(255,255,255,0.85);
          text-decoration: none; padding: 6px 10px;
          border-radius: var(--radius); transition: all 0.2s;
        }
        .action-icon-btn:hover { color: white; background: rgba(255,255,255,0.1); }
        .action-icon { position: relative; display: flex; align-items: center; justify-content: center; }
        .badge {
          position: absolute; top: -6px; right: -8px;
          width: 18px; height: 18px; border-radius: 50%;
          font-size: 0.62rem; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
          color: white; border: 2px solid var(--brand);
        }
        .badge.red    { background: var(--red); }
        .badge.yellow { background: var(--accent); }
        .action-label { font-size: 0.68rem; font-weight: 500; }

        /* ── Account button ── */
        .account-btn {
          display: flex; align-items: center; gap: 9px;
          color: rgba(255,255,255,0.9); text-decoration: none;
          padding: 7px 12px; border-radius: var(--radius);
          border: 1.5px solid rgba(255,255,255,0.2);
          background: rgba(255,255,255,0.08);
          transition: all 0.2s; flex-shrink: 0;
        }
        .account-btn:hover { background: rgba(255,255,255,0.15); border-color: rgba(255,255,255,0.35); }
        .account-btn.logged-in {
          background: linear-gradient(135deg,#065f46,#10b981);
          border-color: rgba(255,255,255,0.3);
          box-shadow: 0 2px 10px rgba(16,185,129,0.3);
        }
        .avatar {
          width: 32px; height: 32px; background: white; color: #065f46;
          border-radius: 50%; display: flex; align-items: center;
          justify-content: center; font-family: 'Syne', sans-serif;
          font-weight: 800; font-size: 0.8rem; flex-shrink: 0;
        }
        .account-info { display: flex; flex-direction: column; gap: 1px; }
        .account-name {
          font-size: 0.86rem; font-weight: 600; color: white;
          max-width: 120px; white-space: nowrap;
          overflow: hidden; text-overflow: ellipsis;
        }
        .account-status { font-size: 0.67rem; color: rgba(255,255,255,0.7); }

        /* ── Overlay ── */
        .mobile-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.55); z-index: 1999;
          animation: fadeIn 0.2s ease;
        }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }

        /* ── Drawer ── */
        .mobile-drawer {
          position: fixed; top: 0; left: -100%;
          width: min(320px, 100vw); height: 100vh;
          background: white; z-index: 2000;
          transition: left 0.3s cubic-bezier(0.4,0,0.2,1);
          display: flex; flex-direction: column;
          box-shadow: 4px 0 24px rgba(0,0,0,0.2);
        }
        .mobile-drawer.open { left: 0; }
        .drawer-header {
          display: flex; justify-content: space-between; align-items: center;
          padding: 0 18px; height: 54px;
          background: var(--brand); color: white; flex-shrink: 0;
        }
        .drawer-title {
          display: flex; align-items: center; gap: 8px;
          font-family: 'Syne', sans-serif; font-weight: 700; font-size: 1rem;
        }
        .drawer-close {
          background: rgba(255,255,255,0.15); border: none; color: white;
          width: 32px; height: 32px; border-radius: 50%; font-size: 15px;
          cursor: pointer; transition: all 0.2s;
          display: flex; align-items: center; justify-content: center;
        }
        .drawer-close:hover { background: rgba(255,255,255,0.3); transform: rotate(90deg); }
        .drawer-body { flex: 1; overflow-y: auto; padding: 14px; }
        .drawer-user-card {
          display: flex; align-items: center; gap: 12px;
          background: linear-gradient(135deg,#065f46,#10b981);
          border-radius: 10px; padding: 13px; margin-bottom: 14px;
        }
        .drawer-avatar {
          width: 42px; height: 42px; background: white; color: #065f46;
          border-radius: 50%; display: flex; align-items: center;
          justify-content: center; font-family: 'Syne', sans-serif;
          font-weight: 800; font-size: 0.88rem;
        }
        .drawer-username { color: white; font-weight: 700; font-size: 0.93rem; }
        .drawer-userstatus { color: rgba(255,255,255,0.8); font-size: 0.73rem; }
        .drawer-section-title {
          font-family: 'Syne', sans-serif; font-size: 0.7rem;
          font-weight: 700; letter-spacing: 0.08em;
          text-transform: uppercase; color: var(--muted);
          padding: 4px 4px 7px; margin-top: 4px;
        }
        .drawer-divider { height: 1px; background: #e2e8f0; margin: 10px 0; }
        .drawer-nav-link {
          display: flex; align-items: center; gap: 10px;
          padding: 11px 12px; color: #1e293b;
          text-decoration: none; font-size: 0.92rem; font-weight: 500;
          border-radius: 8px; transition: all 0.15s;
          margin-bottom: 2px; background: none; border: none;
          width: 100%; text-align: left; cursor: pointer;
          font-family: 'DM Sans', sans-serif;
        }
        .drawer-nav-link:hover { background: #f1f5f9; transform: translateX(4px); }
        .drawer-nav-link.active { background: #fff7ed; color: var(--accent); font-weight: 600; }
        .drawer-nav-link.logout { color: var(--red); }
        .drawer-nav-link.logout:hover { background: #fef2f2; }

        /* ════════════════════════════════════════
           RESPONSIVE BREAKPOINTS
        ════════════════════════════════════════ */

        /* Tablet — hide account text */
        @media (max-width: 1024px) {
          .account-info { display: none !important; }
          .account-btn  { padding: 7px; }
        }

        /* Large mobile / small tablet */
        @media (max-width: 768px) {
          .desktop-only { display: none !important; }
          .mobile-only  { display: flex !important; }
          .action-label { display: none; }
          .top-bar-inner { height: 56px; padding: 0 14px; gap: 10px; }
          .logo-text { font-size: 1.45rem; }
        }

        /* Small phones */
        @media (max-width: 380px) {
          .logo-text { font-size: 1.25rem; }
          .logo-icon { font-size: 20px; }
          .top-bar-inner { padding: 0 10px; gap: 8px; }
        }
      `}</style>
    </>
  );
}