import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getWishlist, toggleWishlist } from "./Wishlist";
import api from "../api/axios.jsx";

// ── Constants ─────────────────────────────────────────────────────────────────
const CATEGORIES   = ["All", "Electronics", "Fashion", "Food", "Art", "Beauty"];
const CAT_ICONS    = { All:"🏷️", Electronics:"⚡", Fashion:"👗", Food:"🍽️", Art:"🎨", Beauty:"💄" };
const PLACEHOLDER  = "https://placehold.co/300x200/3b82f6/white?text=No+Image";
const PLACEHOLDER_LG = "https://placehold.co/600x500/3b82f6/white?text=No+Image";
const DESKTOP_BREAKPOINT = "(min-width: 900px)"; // keep in sync with the CSS @media queries below

// ── Normalise raw DB row ───────────────────────────────────────────────────────
function normaliseProduct(raw) {
  const id    = raw.id ?? raw.product_id ?? raw.productId;
  const price = parseFloat(raw.price) || 0;
  const stock = parseInt(raw.stock ?? raw.quantity ?? 0, 10) || 0;
  const category = (raw.category || raw.Category || "").trim();

  // image: handle full URL, relative path, or just a filename
  const rawImg = raw.image || raw.image_url || raw.imageUrl || raw.img || "";
  let imageUrl = "";
  if (rawImg) {
    if (rawImg.startsWith("http://") || rawImg.startsWith("https://")) {
      imageUrl = rawImg;
    } else {
      const base = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
      const path = rawImg.startsWith("/") ? rawImg : `/uploads/${rawImg}`;
      imageUrl = `${base}${path}`;
    }
  }
  return { ...raw, id, price, stock, category, imageUrl };
}

// ══════════════════════════════════════════════════════════════════════════════
// FilterPanel — TOP-LEVEL component (NOT inside Home) so React never remounts it
// ══════════════════════════════════════════════════════════════════════════════
function FilterPanel({
  products, categories,
  selectedCategory, setSelectedCategory,
  priceRange, setPriceRange,
  sortBy, setSortBy,
  hasActiveFilters, clearFilters,
  ceiling,
  onClose,   // only passed from mobile drawer — closes sheet after category pick
}) {
  const step = Math.max(1, Math.floor(ceiling / 100));
  return (
    <div className="filter-panel">

      {/* Categories */}
      <div className="filter-section">
        <h3 className="filter-title">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
            <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
          </svg>
          Categories
        </h3>
        <div className="cat-list">
          {categories.map(cat => {
            const count = cat === "All"
              ? products.length
              : products.filter(p => p.category?.toLowerCase() === cat.toLowerCase()).length;
            return (
              <button
                key={cat}
                className={`cat-btn ${selectedCategory === cat ? "active" : ""}`}
                onClick={() => {
                  setSelectedCategory(cat);
                  if (onClose) onClose();   // close mobile drawer only
                }}
              >
                <span>{CAT_ICONS[cat] || ""} {cat}</span>
                <span className="cat-count">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="filter-divider" />

      {/* Price Range */}
      <div className="filter-section">
        <h3 className="filter-title">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="1" x2="12" y2="23"/>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
          Price Range
        </h3>
        <div className="price-display">
          <span className="price-val">${priceRange[0].toLocaleString()}</span>
          <span className="price-sep">—</span>
          <span className="price-val">${priceRange[1].toLocaleString()}</span>
        </div>
        <div className="range-wrap">
          <input
            type="range" min={0} max={ceiling} step={step}
            value={priceRange[0]}
            onChange={e => {
              const v = Number(e.target.value);
              setPriceRange([Math.min(v, priceRange[1] - step), priceRange[1]]);
            }}
            className="range-slider"
          />
          <input
            type="range" min={0} max={ceiling} step={step}
            value={priceRange[1]}
            onChange={e => {
              const v = Number(e.target.value);
              setPriceRange([priceRange[0], Math.max(v, priceRange[0] + step)]);
            }}
            className="range-slider"
          />
        </div>
        <div className="price-ticks">
          <span>$0</span>
          <span>${Math.round(ceiling / 2).toLocaleString()}</span>
          <span>${ceiling.toLocaleString()}</span>
        </div>
        <button className="price-reset" onClick={() => setPriceRange([0, ceiling])}>Reset Price</button>
      </div>

      <div className="filter-divider" />

      {/* Sort */}
      <div className="filter-section">
        <h3 className="filter-title">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M3 6h18M6 12h12M10 18h4"/>
          </svg>
          Sort By
        </h3>
        <select className="sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="default">Featured</option>
          <option value="price-low">Price: Low → High</option>
          <option value="price-high">Price: High → Low</option>
          <option value="name">Name: A → Z</option>
          <option value="stock">Most in Stock</option>
        </select>
      </div>

      {hasActiveFilters && (
        <>
          <div className="filter-divider" />
          <button
            className="clear-all-btn"
            onClick={() => { clearFilters(); if (onClose) onClose(); }}
          >
            ✕ Clear All Filters
          </button>
        </>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// Main component
// ══════════════════════════════════════════════════════════════════════════════
export default function Home() {
  const [products,         setProducts]         = useState([]);
  const [maxPrice,         setMaxPrice]         = useState(5000);
  const [loading,          setLoading]          = useState(true);
  const [error,            setError]            = useState("");
  const [search,           setSearch]           = useState("");
  const [sortBy,           setSortBy]           = useState("default");
  const [cart,             setCart]             = useState([]);
  const [user,             setUser]             = useState(null);
  const [wishlist,         setWishlist]         = useState([]);
  const [selectedProduct,  setSelectedProduct]  = useState(null);
  const [imageZoom,        setImageZoom]        = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange,       setPriceRange]       = useState([0, 5000]);
  // FIX: the sidebar is a permanent column on desktop and a slide-up drawer on
  // mobile. It must default to OPEN on desktop (otherwise the desktop sidebar
  // renders at width:0/overflow:hidden and the whole FilterPanel is clipped
  // and unusable until the toggle button is clicked) and CLOSED on mobile
  // (where it's an overlay drawer that should start hidden).
  const [sidebarOpen,      setSidebarOpen]      = useState(
    () => typeof window !== "undefined" && window.matchMedia(DESKTOP_BREAKPOINT).matches
  );
  const [cartOpen,         setCartOpen]         = useState(false);
  const [lastAdded,        setLastAdded]        = useState(null);
  const navigate = useNavigate();

  // ── Load user + wishlist ───────────────────────────────
  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (raw && raw !== "undefined" && raw !== "null") {
      try { setUser(JSON.parse(raw)); } catch { localStorage.removeItem("user"); }
    }
    setWishlist(getWishlist());
  }, []);

  // ── Load cart from localStorage ────────────────────────
  useEffect(() => {
    try { setCart(JSON.parse(localStorage.getItem("shoppingCart") || "[]")); } catch {}
  }, []);

  // ── Sync cart to localStorage ──────────────────────────
  useEffect(() => {
    localStorage.setItem("shoppingCart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
  }, [cart]);

  // ── Fetch + normalise products ─────────────────────────
  useEffect(() => {
    api.get("/products")
      .then(res => {
        const raw = Array.isArray(res.data)
          ? res.data
          : (res.data?.data || res.data?.products || []);
        const normalised = raw.map(normaliseProduct);
        setProducts(normalised);
        if (normalised.length > 0) {
          const highest = Math.max(...normalised.map(p => p.price));
          const ceiling = Math.ceil(highest / 100) * 100 || 5000;
          setMaxPrice(ceiling);
          setPriceRange([0, ceiling]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Products fetch error:", err);
        setError("Failed to load products. Please check your connection and try again.");
        setLoading(false);
      });
  }, []);

  // ── Keep sidebar state in sync with viewport ───────────
  // FIX: previously this only listened for the breakpoint `change` event and
  // always forced sidebarOpen(false) when the viewport was desktop-sized,
  // which is backwards (it should stay OPEN on desktop). It also never ran
  // once on mount, so the very first desktop render used the stale default.
  // Now: crossing UP into desktop opens it, crossing DOWN into mobile closes
  // it (so the mobile drawer doesn't appear stuck open after a resize).
  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_BREAKPOINT);
    const handleChange = e => setSidebarOpen(e.matches);
    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, []);

  // ── Cart helpers ───────────────────────────────────────
  const addToCart = (product) => {
    const p = { ...product, price: parseFloat(product.price) || 0, quantity: 1 };
    setCart(prev => {
      const ex = prev.find(i => i.id === product.id);
      return ex
        ? prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)
        : [...prev, p];
    });
    setLastAdded(product);
    setCartOpen(true);
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("shoppingCart");
    window.dispatchEvent(new Event("cartUpdated"));
    setCartOpen(false);
  };

  const handleCheckout = () => {
    localStorage.setItem("shoppingCart", JSON.stringify(cart));
    if (!user) {
      localStorage.setItem("redirectAfterLogin", "checkout");
      navigate("/ulogin", { state: { from: "checkout" } });
    } else {
      navigate("/checkout", { state: { cart, user } });
    }
  };

  const handleBuyNow = (product) => {
    if (!user) {
      localStorage.setItem("buyNowProduct", JSON.stringify(product));
      localStorage.setItem("redirectAfterLogin", `order/${product.id}`);
      navigate("/ulogin", { state: { from: `order/${product.id}` } });
    } else {
      navigate(`/order/${product.id}`, { state: { product, user } });
    }
  };

  // ── Wishlist ───────────────────────────────────────────
  const handleWishlistToggle = (product) => {
    toggleWishlist(product);
    setWishlist(getWishlist());
  };

  // ── Modal ──────────────────────────────────────────────
  const openProductModal = (product) => {
    setSelectedProduct(product);
    document.body.style.overflow = "hidden";
  };
  const closeProductModal = () => {
    setSelectedProduct(null);
    setImageZoom(false);
    document.body.style.overflow = "unset";
  };

  // ── Derived ────────────────────────────────────────────
  const totalItemsInCart = cart.reduce((s, i) => s + i.quantity, 0);
  const cartTotal        = cart.reduce((s, i) => s + i.price * i.quantity, 0).toFixed(2);

  const clearFilters = () => {
    setSelectedCategory("All");
    setPriceRange([0, maxPrice]);
    setSearch("");
    setSortBy("default");
  };

  const hasActiveFilters =
    selectedCategory !== "All" ||
    priceRange[0] > 0 ||
    priceRange[1] < maxPrice ||
    !!search ||
    sortBy !== "default";

  const filteredProducts = products
    .filter(p => {
      const q           = search.toLowerCase().trim();
      const matchSearch = !q || [p.name, p.description, p.category]
        .some(f => f?.toLowerCase().includes(q));
      const matchCat    = selectedCategory === "All" ||
        p.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchPrice  = p.price === 0 ||
        (p.price >= priceRange[0] && p.price <= priceRange[1]);
      return matchSearch && matchCat && matchPrice;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":  return a.price - b.price;
        case "price-high": return b.price - a.price;
        case "name":       return (a.name || "").localeCompare(b.name || "");
        case "stock":      return b.stock - a.stock;
        default:           return 0;
      }
    });

  const getUserInitials = (u) => {
    if (!u) return "U";
    return (u.fullname || u.name || u.email || "U")
      .split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
  };

  // shared props for FilterPanel
  const filterProps = {
    products, categories: CATEGORIES,
    selectedCategory, setSelectedCategory,
    priceRange, setPriceRange,
    sortBy, setSortBy,
    hasActiveFilters, clearFilters,
    ceiling: maxPrice,
  };

  // ── RENDER ─────────────────────────────────────────────
  return (
    <>
      <div className="page-wrap">

        {/* ── CART BAR ── */}
        {totalItemsInCart > 0 && (
          <div className="cart-bar">
            <div className="cart-bar-inner">
              <Link
                to={user ? "/userdashboard" : "/ulogin"}
                className={`cb-account ${user ? "loggedin" : ""}`}
              >
                {user
                  ? <><div className="cb-avatar">{getUserInitials(user)}</div><span className="cb-name">{user.fullname || user.name || "Account"}</span></>
                  : <><span>👤</span><span className="cb-name">Sign In</span></>
                }
              </Link>
              <div className="cb-info">
                <span>🛒 <strong>{totalItemsInCart}</strong></span>
                <span className="cb-total">$<strong>{cartTotal}</strong></span>
              </div>
              <div className="cb-actions">
                <button className="cb-checkout" onClick={handleCheckout}>Checkout</button>
                <button className="cb-clear"    onClick={clearCart}>Clear</button>
              </div>
            </div>
          </div>
        )}

        {/* ── SEARCH + FILTER TOGGLE BAR ── */}
        <div className="search-bar-wrap">
          <div className="search-bar-inner">
            <button
              className={`filter-toggle-btn ${sidebarOpen ? "active" : ""}`}
              onClick={() => setSidebarOpen(o => !o)}
              aria-label="Toggle filters"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="4" y1="6" x2="20" y2="6"/>
                <line x1="4" y1="12" x2="16" y2="12"/>
                <line x1="4" y1="18" x2="12" y2="18"/>
              </svg>
              <span className="filter-toggle-label">Filters</span>
              {hasActiveFilters && <span className="filter-dot" />}
            </button>

            <div className="search-box">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{color:"#94a3b8",flexShrink:0}}>
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="search-input"
              />
              {search && <button className="search-clear" onClick={() => setSearch("")}>✕</button>}
            </div>

            <div className="search-meta">
              {filteredProducts.length}<span className="meta-of"> / {products.length}</span>
            </div>
          </div>

          {/* Category pills — mobile horizontal scroll */}
          <div className="cat-pills-bar">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`cat-pill ${selectedCategory === cat ? "active" : ""}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {CAT_ICONS[cat]} {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ── BODY: SIDEBAR + GRID ── */}
        <div className="body-wrap">

          {/* Desktop sidebar */}
          <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
            <FilterPanel {...filterProps} />
          </aside>

          {/* Product area */}
          <main className="main-area">
            {error && <div className="error-msg">⚠️ {error}</div>}

            {loading ? (
              <div className="loading-wrap">
                <div className="spinner" />
                <p>Loading products...</p>
              </div>
            ) : (
              <div className="product-grid">
                {filteredProducts.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">📦</div>
                    <h3>No products found</h3>
                    <p>{search ? `No results for "${search}"` : "Try adjusting your filters."}</p>
                    <button className="empty-reset" onClick={clearFilters}>Clear Filters</button>
                  </div>
                ) : (
                  filteredProducts.map(p => {
                    const cartItem   = cart.find(i => i.id === p.id);
                    const isInCart   = !!cartItem;
                    const cartQty    = cartItem?.quantity || 0;
                    const wishlisted = wishlist.some(w => w.id === p.id);
                    return (
                      <div key={p.id} className="product-card">
                        {/* Image */}
                        <div className="product-img-wrap" onClick={() => openProductModal(p)}>
                          <img
                            src={p.imageUrl || PLACEHOLDER}
                            alt={p.name || "Product"}
                            className="product-img"
                            onError={e => { e.target.src = PLACEHOLDER; e.target.onerror = null; }}
                          />
                          {p.stock <= 0
                            ? <span className="badge oos">Out of Stock</span>
                            : p.stock < 10
                            ? <span className="badge low-s">Low Stock</span>
                            : null}
                          {isInCart && <span className="badge in-c">In Cart: {cartQty}</span>}
                          <button
                            className={`heart-btn ${wishlisted ? "hearted" : ""}`}
                            onClick={e => { e.stopPropagation(); handleWishlistToggle(p); }}
                          >
                            {wishlisted ? "❤️" : "🤍"}
                          </button>
                          <div className="img-overlay">View Details</div>
                        </div>

                        {/* Body */}
                        <div className="product-body">
                          <div className="product-top">
                            <h3 className="product-name">{p.name || "Unnamed Product"}</h3>
                            <span className="price-tag">${p.price.toFixed(2)}</span>
                          </div>
                          {p.description && (
                            <p className="product-desc">
                              {p.description.length > 90
                                ? `${p.description.substring(0, 90)}…`
                                : p.description}
                            </p>
                          )}
                          <div className="product-bottom">
                            <span className={`stock-badge ${p.stock <= 0 ? "out" : p.stock < 10 ? "low" : "ok"}`}>
                              {p.stock <= 0 ? "Out of stock" : `${p.stock} units`}
                            </span>
                            <div className="btn-row">
                              <button
                                className="btn-cart"
                                onClick={() => addToCart(p)}
                                disabled={p.stock <= 0}
                              >
                                {isInCart ? `➕ (${cartQty})` : "🛒 Add"}
                              </button>
                              <button
                                className="btn-buy"
                                onClick={() => handleBuyNow(p)}
                                disabled={p.stock <= 0}
                              >
                                ⚡ Buy
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* Cart banner */}
            {cart.length > 0 && (
              <div className="cart-banner">
                <div className="cart-banner-text">
                  <h3>🛒 Ready to Checkout?</h3>
                  <p>{totalItemsInCart} item{totalItemsInCart !== 1 ? "s" : ""} · <strong>${cartTotal}</strong></p>
                </div>
                <button className="cart-banner-btn" onClick={handleCheckout}>Checkout →</button>
              </div>
            )}

            {/* Hot deal banner */}
            {!loading && products.length > 0 && (
              <div className="deal-banner">
                <div className="deal-text">
                  <h3>🔥 Hot Deal of the Day</h3>
                  <p>Check out our featured product</p>
                </div>
                <div className="deal-btns">
                  <button className="deal-cart" onClick={() => addToCart(products[0])}>Add to Cart</button>
                  <button className="deal-buy"  onClick={() => handleBuyNow(products[0])}>Buy Now</button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ── MOBILE FILTER DRAWER ── */}
      <div
        className={`filter-overlay ${sidebarOpen ? "open" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />
      <div className={`filter-drawer ${sidebarOpen ? "open" : ""}`}>
        <div className="fd-header">
          <span className="fd-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="4" y1="6" x2="20" y2="6"/>
              <line x1="4" y1="12" x2="16" y2="12"/>
              <line x1="4" y1="18" x2="12" y2="18"/>
            </svg>
            Filters
          </span>
          <button className="fd-close" onClick={() => setSidebarOpen(false)}>✕</button>
        </div>
        <div className="fd-body">
          {/* onClose NOT passed here so category picks don't close the drawer —
              user can pick multiple filters then close manually */}
          <FilterPanel {...filterProps} />
        </div>
        <div className="fd-footer">
          <button className="fd-apply" onClick={() => setSidebarOpen(false)}>
            Show {filteredProducts.length} result{filteredProducts.length !== 1 ? "s" : ""}
          </button>
        </div>
      </div>

      {/* ── PRODUCT MODAL ── */}
      {selectedProduct && (
        <div className="modal-overlay" onClick={closeProductModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={closeProductModal}>✕</button>
            <div className="modal-body">
              <div className="modal-img-side">
                <div
                  className={`modal-img-wrap ${imageZoom ? "zoomed" : ""}`}
                  onClick={() => setImageZoom(z => !z)}
                >
                  <img
                    src={selectedProduct.imageUrl || PLACEHOLDER_LG}
                    alt={selectedProduct.name}
                    className="modal-img"
                    onError={e => { e.target.src = PLACEHOLDER_LG; e.target.onerror = null; }}
                  />
                  <div className="zoom-hint">{imageZoom ? "🔍 Zoom out" : "🔍 Zoom in"}</div>
                </div>
                <div className={`modal-stock-badge ${selectedProduct.stock <= 0 ? "out" : selectedProduct.stock < 10 ? "low" : "in"}`}>
                  {selectedProduct.stock <= 0
                    ? "Out of Stock"
                    : selectedProduct.stock < 10
                    ? `Only ${selectedProduct.stock} left`
                    : `${selectedProduct.stock} in stock`}
                </div>
              </div>
              <div className="modal-detail-side">
                <h2 className="modal-name">{selectedProduct.name}</h2>
                <div className="modal-price-row">
                  <span className="modal-price">${selectedProduct.price.toFixed(2)}</span>
                  <button
                    className={`modal-wish-btn ${wishlist.some(w => w.id === selectedProduct.id) ? "active" : ""}`}
                    onClick={() => handleWishlistToggle(selectedProduct)}
                  >
                    {wishlist.some(w => w.id === selectedProduct.id) ? "❤️ Wishlisted" : "🤍 Wishlist"}
                  </button>
                </div>
                <div className="modal-desc-block">
                  <h4>Description</h4>
                  <p>{selectedProduct.description || "No description available."}</p>
                </div>
                <div className="modal-info-grid">
                  <div className="info-item"><span className="info-label">Product ID</span><span className="info-val">#{selectedProduct.id}</span></div>
                  <div className="info-item"><span className="info-label">Category</span><span className="info-val">{selectedProduct.category || "General"}</span></div>
                  <div className="info-item">
                    <span className="info-label">Availability</span>
                    <span className={`info-val ${selectedProduct.stock > 0 ? "avail" : "unavail"}`}>
                      {selectedProduct.stock > 0 ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>
                  <div className="info-item"><span className="info-label">Stock</span><span className="info-val">{selectedProduct.stock} units</span></div>
                </div>
                <div className="modal-actions">
                  <button
                    className="modal-btn-cart"
                    onClick={() => { addToCart(selectedProduct); closeProductModal(); }}
                    disabled={selectedProduct.stock <= 0}
                  >🛒 Add to Cart</button>
                  <button
                    className="modal-btn-buy"
                    onClick={() => { handleBuyNow(selectedProduct); closeProductModal(); }}
                    disabled={selectedProduct.stock <= 0}
                  >⚡ Buy Now</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── CART DRAWER ── */}
      <div
        className={`cart-overlay ${cartOpen ? "open" : ""}`}
        onClick={() => { setCartOpen(false); setLastAdded(null); }}
      />
      <div className={`cart-drawer ${cartOpen ? "open" : ""}`}>
        <div className="cd-head">
          <div className="cd-head-title">
            🛒 Your Cart
            {totalItemsInCart > 0 && <span className="cd-head-badge">{totalItemsInCart}</span>}
          </div>
          <button className="cd-close" onClick={() => { setCartOpen(false); setLastAdded(null); }}>✕</button>
        </div>

        {lastAdded && (
          <div className="cd-added-banner">
            <span className="cd-added-img">🛍️</span>
            <span>✅ <strong>{lastAdded.name}</strong> added!</span>
          </div>
        )}

        {cart.length === 0 ? (
          <div className="cd-empty">
            <div className="cd-empty-icon">🛒</div>
            <h3>Cart is empty</h3>
            <p>Add some products to get started.</p>
          </div>
        ) : (
          <div className="cd-items">
            {cart.map(item => {
              const price = parseFloat(item.price) || 0;
              return (
                <div className="cd-item" key={item.id}>
                  <div className="cd-item-ph">🛍️</div>
                  <div className="cd-item-info">
                    <div className="cd-item-name">{item.name}</div>
                    <div className="cd-item-price">${(price * item.quantity).toFixed(2)}</div>
                    <div className="cd-item-unit">${price.toFixed(2)} each</div>
                  </div>
                  <div className="cd-item-controls">
                    <div className="cd-qty-box">
                      <button className="cd-qty-btn" onClick={() =>
                        setCart(prev =>
                          prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i)
                              .filter(i => i.quantity > 0)
                        )
                      }>−</button>
                      <span className="cd-qty-num">{item.quantity}</span>
                      <button className="cd-qty-btn" onClick={() =>
                        setCart(prev =>
                          prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)
                        )
                      }>+</button>
                    </div>
                    <button
                      className="cd-remove"
                      onClick={() => setCart(prev => prev.filter(i => i.id !== item.id))}
                    >🗑️ Remove</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {cart.length > 0 && (
          <div className="cd-footer">
            <div className="cd-totals">
              <div className="cd-row">
                <span className="cd-lbl">Subtotal</span>
                <span>${cartTotal}</span>
              </div>
              <div className="cd-row">
                <span className="cd-lbl">Shipping</span>
                <span className={parseFloat(cartTotal) > 100 ? "cd-free" : ""}>
                  {parseFloat(cartTotal) > 100 ? "FREE ✓" : "$9.99"}
                </span>
              </div>
              <div className="cd-row cd-grand">
                <span>Total</span>
                <span>${(parseFloat(cartTotal) + (parseFloat(cartTotal) > 100 ? 0 : 9.99)).toFixed(2)}</span>
              </div>
            </div>
            <div className="cd-btn-row">
              <Link to="/cart" className="cd-btn-view" onClick={() => setCartOpen(false)}>View Cart</Link>
              <button className="cd-btn-checkout" onClick={() => { setCartOpen(false); handleCheckout(); }}>Checkout →</button>
            </div>
            <button className="cd-btn-clear" onClick={clearCart}>🧹 Clear Cart</button>
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --brand:#0f172a; --accent:#f97316; --green:#10b981;
          --blue:#3b82f6; --red:#ef4444; --gold:#f59e0b;
          --bg:#f1f5f9; --card:#ffffff; --text:#1e293b;
          --muted:#64748b; --border:#e2e8f0; --radius:12px;
        }

        .page-wrap { min-height:100vh; background:var(--bg); font-family:'DM Sans',sans-serif; }

        /* ── CART BAR ── */
        .cart-bar { background:white; border-bottom:3px solid var(--blue); box-shadow:0 2px 12px rgba(0,0,0,0.08); position:sticky; top:0; z-index:900; }
        .cart-bar-inner { max-width:1400px; margin:0 auto; padding:8px 16px; display:flex; align-items:center; justify-content:space-between; gap:10px; min-height:52px; }
        .cb-account { display:flex; align-items:center; gap:7px; text-decoration:none; color:var(--text); font-weight:600; padding:5px 10px; border-radius:8px; background:#f1f5f9; font-size:0.88rem; flex-shrink:0; }
        .cb-account.loggedin { background:linear-gradient(135deg,#065f46,#10b981); color:white; }
        .cb-avatar { width:26px; height:26px; background:white; color:#08a47b; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:0.7rem; }
        .cb-name { max-width:80px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
        .cb-info { display:flex; align-items:center; gap:10px; font-size:0.88rem; }
        .cb-total { color:var(--green); font-weight:700; }
        .cb-actions { display:flex; gap:6px; flex-shrink:0; }
        .cb-checkout { background:var(--blue); color:white; border:none; padding:7px 14px; border-radius:8px; font-weight:600; cursor:pointer; font-size:0.85rem; white-space:nowrap; }
        .cb-clear { background:#fee2e2; color:var(--red); border:none; padding:7px 12px; border-radius:8px; font-weight:600; cursor:pointer; font-size:0.85rem; white-space:nowrap; }

        /* ── SEARCH BAR ── */
        .search-bar-wrap { background:white; border-bottom:1px solid var(--border); position:sticky; top:0; z-index:800; box-shadow:0 2px 8px rgba(0,0,0,0.05); }
        .search-bar-inner { max-width:1400px; margin:0 auto; padding:10px 16px; display:flex; align-items:center; gap:10px; }
        .filter-toggle-btn { display:flex; align-items:center; gap:6px; position:relative; background:var(--bg); border:1.5px solid var(--border); color:var(--text); padding:8px 13px; border-radius:8px; font-family:'DM Sans',sans-serif; font-size:0.88rem; font-weight:600; cursor:pointer; transition:all 0.2s; flex-shrink:0; white-space:nowrap; }
        .filter-toggle-btn.active, .filter-toggle-btn:hover { background:var(--accent); color:white; border-color:var(--accent); }
        .filter-dot { width:8px; height:8px; background:var(--red); border-radius:50%; position:absolute; top:-3px; right:-3px; border:2px solid white; }
        .filter-toggle-label { display:inline; }
        .search-box { flex:1; display:flex; align-items:center; gap:8px; background:var(--bg); border:1.5px solid var(--border); border-radius:10px; padding:0 12px; transition:all 0.2s; min-width:0; }
        .search-box:focus-within { border-color:var(--accent); box-shadow:0 0 0 3px rgba(249,115,22,0.12); background:white; }
        .search-input { flex:1; border:none; outline:none; background:transparent; font-family:'DM Sans',sans-serif; font-size:0.92rem; padding:9px 0; color:var(--text); min-width:0; }
        .search-input::placeholder { color:var(--muted); }
        .search-clear { background:none; border:none; color:var(--muted); cursor:pointer; font-size:13px; padding:3px; flex-shrink:0; }
        .search-meta { color:var(--muted); font-size:0.82rem; white-space:nowrap; flex-shrink:0; font-weight:600; }
        .meta-of { font-weight:400; }

        /* ── CATEGORY PILLS (mobile) ── */
        .cat-pills-bar { display:none; gap:6px; padding:8px 16px 10px; overflow-x:auto; -webkit-overflow-scrolling:touch; scrollbar-width:none; }
        .cat-pills-bar::-webkit-scrollbar { display:none; }
        .cat-pill { flex-shrink:0; padding:6px 14px; border-radius:999px; border:1.5px solid var(--border); background:white; font-size:0.82rem; font-weight:600; color:var(--muted); cursor:pointer; transition:all 0.15s; white-space:nowrap; font-family:'DM Sans',sans-serif; }
        .cat-pill.active { background:var(--accent); color:white; border-color:var(--accent); }
        .cat-pill:not(.active):hover { border-color:var(--accent); color:var(--accent); }

        /* ── BODY ── */
        .body-wrap { max-width:1400px; margin:0 auto; padding:20px 16px; display:flex; gap:20px; align-items:flex-start; }

        /* ── DESKTOP SIDEBAR ── */
        .sidebar { flex-shrink:0; width:250px; transition:width 0.3s ease, opacity 0.3s ease; overflow:hidden; }
        .sidebar.closed { width:0; opacity:0; }
        .sidebar.open { opacity:1; }
        .sidebar .filter-panel { background:var(--card); border-radius:var(--radius); padding:18px; box-shadow:0 2px 12px rgba(0,0,0,0.06); border:1px solid var(--border); position:sticky; top:130px; }

        /* ── MOBILE FILTER DRAWER ── */
        /* FIX: this overlay is a mobile-only dimmer for the bottom-sheet drawer.
           It previously had no breakpoint guard, so on desktop it rendered as
           a full-viewport fixed layer (z-index:1998) sitting ABOVE the desktop
           sidebar (which has no z-index of its own). Every click meant for a
           category/price/sort control in the sidebar actually landed on this
           overlay instead, whose only handler closes the panel — that's why
           filtering appeared to work only on mobile. display:block is now
           gated inside the same max-width:900px block as the drawer, so on
           desktop this element is never visible or clickable. */
        .filter-overlay { display:none; position:fixed; inset:0; background:rgba(0,0,0,0.5); z-index:1998; }
        .filter-drawer { display:none; position:fixed; bottom:0; left:0; right:0; background:white; z-index:1999; border-radius:20px 20px 0 0; max-height:88vh; flex-direction:column; box-shadow:0 -8px 32px rgba(0,0,0,0.15); transform:translateY(100%); transition:transform 0.35s cubic-bezier(0.4,0,0.2,1); }
        .filter-drawer.open { transform:translateY(0); }
        .fd-header { display:flex; justify-content:space-between; align-items:center; padding:16px 20px; border-bottom:1px solid var(--border); flex-shrink:0; }
        .fd-title { display:flex; align-items:center; gap:8px; font-family:'Syne',sans-serif; font-weight:700; font-size:1rem; color:var(--text); }
        .fd-close { background:#f1f5f9; border:none; width:32px; height:32px; border-radius:50%; font-size:14px; cursor:pointer; display:flex; align-items:center; justify-content:center; color:var(--muted); }
        .fd-body { overflow-y:auto; padding:16px; flex:1; }
        .fd-footer { padding:14px 16px; border-top:1px solid var(--border); flex-shrink:0; }
        .fd-apply { width:100%; padding:13px; background:var(--accent); color:white; border:none; border-radius:10px; font-family:'Syne',sans-serif; font-weight:700; font-size:0.95rem; cursor:pointer; transition:all 0.2s; }
        .fd-apply:hover { background:#ea580c; }

        /* ── SHARED FILTER STYLES ── */
        .filter-section { margin-bottom:4px; }
        .filter-title { display:flex; align-items:center; gap:7px; font-family:'Syne',sans-serif; font-size:0.78rem; font-weight:700; text-transform:uppercase; letter-spacing:0.06em; color:var(--muted); margin-bottom:10px; }
        .filter-divider { height:1px; background:var(--border); margin:14px 0; }
        .cat-list { display:flex; flex-direction:column; gap:3px; }
        .cat-btn { display:flex; align-items:center; justify-content:space-between; padding:9px 10px; border-radius:8px; background:none; border:1.5px solid transparent; font-family:'DM Sans',sans-serif; font-size:0.9rem; font-weight:500; color:var(--text); cursor:pointer; text-align:left; transition:all 0.15s; min-height:40px; }
        .cat-btn:hover { background:#fff7ed; color:var(--accent); }
        .cat-btn.active { background:#fff7ed; border-color:var(--accent); color:var(--accent); font-weight:700; }
        .cat-count { background:var(--bg); color:var(--muted); font-size:0.7rem; font-weight:700; padding:2px 7px; border-radius:20px; flex-shrink:0; }
        .cat-btn.active .cat-count { background:var(--accent); color:white; }
        .price-display { display:flex; align-items:center; gap:8px; margin-bottom:12px; }
        .price-val { background:var(--bg); border:1.5px solid var(--border); border-radius:7px; padding:4px 8px; font-size:0.85rem; font-weight:700; color:var(--text); flex:1; text-align:center; }
        .price-sep { color:var(--muted); font-size:0.8rem; }
        .range-wrap { position:relative; height:36px; margin-bottom:4px; }
        .range-slider { position:absolute; width:100%; left:0; -webkit-appearance:none; -moz-appearance:none; appearance:none; height:4px; background:transparent; outline:none; pointer-events:none; top:14px; }
        .range-slider::-webkit-slider-thumb { -webkit-appearance:none; width:22px; height:22px; border-radius:50%; background:var(--accent); border:3px solid white; box-shadow:0 2px 6px rgba(249,115,22,0.4); cursor:pointer; pointer-events:all; }
        .range-slider::-webkit-slider-runnable-track { height:4px; background:var(--border); border-radius:4px; }
        /* FIX: Firefox ignores the WebKit-only thumb selector above, so the
           slider's pointer-events:none on the input was never re-enabled and
           the price slider couldn't be dragged at all in Firefox. */
        .range-slider::-moz-range-thumb { width:22px; height:22px; border-radius:50%; background:var(--accent); border:3px solid white; box-shadow:0 2px 6px rgba(249,115,22,0.4); cursor:pointer; pointer-events:all; }
        .range-slider::-moz-range-track { height:4px; background:var(--border); border-radius:4px; }
        .price-ticks { display:flex; justify-content:space-between; font-size:0.65rem; color:var(--muted); margin-top:2px; }
        .price-reset { width:100%; margin-top:8px; padding:7px; border-radius:7px; background:var(--bg); border:1.5px solid var(--border); font-family:'DM Sans',sans-serif; font-size:0.82rem; font-weight:600; color:var(--muted); cursor:pointer; transition:all 0.15s; }
        .price-reset:hover { border-color:var(--accent); color:var(--accent); background:#fff7ed; }
        .sort-select { width:100%; padding:9px 10px; border-radius:8px; border:1.5px solid var(--border); background:var(--bg); font-family:'DM Sans',sans-serif; font-size:0.9rem; font-weight:500; color:var(--text); cursor:pointer; outline:none; }
        .sort-select:focus { border-color:var(--blue); }
        .clear-all-btn { width:100%; padding:9px; border-radius:8px; background:#fef2f2; border:1.5px solid #fecaca; color:var(--red); font-family:'DM Sans',sans-serif; font-size:0.85rem; font-weight:700; cursor:pointer; }
        .clear-all-btn:hover { background:#fee2e2; }

        /* ── MAIN AREA ── */
        .main-area { flex:1; min-width:0; }
        .error-msg { background:#fee2e2; color:var(--red); padding:12px 16px; border-radius:8px; margin-bottom:16px; }
        .loading-wrap { display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:300px; gap:14px; color:var(--muted); }
        .spinner { width:40px; height:40px; border:4px solid var(--border); border-top-color:var(--accent); border-radius:50%; animation:spin 0.9s linear infinite; }
        @keyframes spin { to { transform:rotate(360deg); } }

        /* ── PRODUCT GRID ── */
        .product-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:16px; margin-bottom:24px; }
        .product-card { background:var(--card); border-radius:var(--radius); border:1px solid var(--border); overflow:hidden; display:flex; flex-direction:column; box-shadow:0 2px 8px rgba(0,0,0,0.05); transition:all 0.25s ease; }
        .product-card:hover { transform:translateY(-4px); box-shadow:0 12px 28px rgba(0,0,0,0.1); }
        .product-img-wrap { position:relative; height:180px; overflow:hidden; cursor:pointer; background:#f8fafc; }
        .product-img { width:100%; height:100%; object-fit:cover; transition:transform 0.3s ease; }
        .product-card:hover .product-img { transform:scale(1.05); }
        .img-overlay { position:absolute; inset:0; background:rgba(15,23,42,0.45); color:white; font-weight:700; font-size:0.88rem; display:flex; align-items:center; justify-content:center; opacity:0; transition:opacity 0.25s; }
        .product-card:hover .img-overlay { opacity:1; }
        .badge { position:absolute; padding:3px 9px; border-radius:20px; font-size:0.68rem; font-weight:700; text-transform:uppercase; }
        .badge.oos  { top:8px; left:8px; background:var(--red); color:white; }
        .badge.low-s { top:8px; left:8px; background:var(--gold); color:white; }
        .badge.in-c  { top:8px; right:44px; background:var(--blue); color:white; }
        .heart-btn { position:absolute; top:8px; right:8px; background:rgba(255,255,255,0.92); border:none; border-radius:50%; width:30px; height:30px; font-size:0.9rem; cursor:pointer; display:flex; align-items:center; justify-content:center; box-shadow:0 2px 8px rgba(0,0,0,0.12); transition:all 0.2s; z-index:5; }
        .heart-btn:hover { transform:scale(1.15); }
        .product-body { padding:12px; flex:1; display:flex; flex-direction:column; gap:7px; }
        .product-top { display:flex; justify-content:space-between; align-items:flex-start; gap:6px; }
        .product-name { font-size:0.92rem; font-weight:700; color:var(--text); flex:1; line-height:1.3; }
        .price-tag { background:linear-gradient(135deg,#10b981,#059669); color:white; padding:3px 9px; border-radius:20px; font-size:0.78rem; font-weight:700; white-space:nowrap; flex-shrink:0; }
        .product-desc { color:var(--muted); font-size:0.8rem; line-height:1.5; flex:1; }
        .product-bottom { margin-top:auto; display:flex; flex-direction:column; gap:8px; }
        .stock-badge { font-size:0.72rem; font-weight:700; padding:2px 9px; border-radius:20px; align-self:flex-start; }
        .stock-badge.ok  { background:#d1fae5; color:#065f46; }
        .stock-badge.low { background:#fef3c7; color:#92400e; }
        .stock-badge.out { background:#fee2e2; color:var(--red); }
        .btn-row { display:flex; gap:6px; }
        .btn-cart, .btn-buy { flex:1; padding:9px 6px; border:none; border-radius:8px; font-family:'DM Sans',sans-serif; font-size:0.82rem; font-weight:700; cursor:pointer; transition:all 0.2s; display:flex; align-items:center; justify-content:center; gap:3px; min-height:40px; }
        .btn-cart { background:linear-gradient(135deg,#10b981,#059669); color:white; flex:2; }
        .btn-buy  { background:linear-gradient(135deg,#3b82f6,#2563eb); color:white; }
        .btn-cart:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 4px 10px rgba(16,185,129,0.3); }
        .btn-buy:hover:not(:disabled)  { transform:translateY(-1px); box-shadow:0 4px 10px rgba(59,130,246,0.3); }
        .btn-cart:disabled, .btn-buy:disabled { background:#cbd5e1; cursor:not-allowed; }
        .empty-state { grid-column:1/-1; text-align:center; padding:50px 20px; background:var(--card); border-radius:var(--radius); border:2px dashed var(--border); }
        .empty-icon { font-size:3rem; margin-bottom:10px; opacity:0.5; }
        .empty-state h3 { color:var(--text); margin-bottom:6px; }
        .empty-state p { color:var(--muted); margin-bottom:14px; }
        .empty-reset { background:var(--accent); color:white; border:none; padding:8px 20px; border-radius:8px; font-weight:600; cursor:pointer; }
        .cart-banner { background:linear-gradient(135deg,#f59e0b,#d97706); border-radius:var(--radius); padding:16px 20px; color:white; display:flex; justify-content:space-between; align-items:center; gap:16px; margin-bottom:16px; flex-wrap:wrap; }
        .cart-banner-text h3 { font-size:1rem; font-weight:700; margin-bottom:2px; }
        .cart-banner-text p { opacity:0.9; font-size:0.85rem; }
        .cart-banner-btn { background:white; color:#d97706; border:none; padding:9px 18px; border-radius:30px; font-weight:700; cursor:pointer; white-space:nowrap; flex-shrink:0; }
        .deal-banner { background:linear-gradient(135deg,#241f2f,#7c3aed); border-radius:var(--radius); padding:20px; color:white; display:flex; justify-content:space-between; align-items:center; gap:16px; flex-wrap:wrap; }
        .deal-text h3 { font-size:1.1rem; font-weight:700; margin-bottom:3px; }
        .deal-text p { opacity:0.85; font-size:0.85rem; }
        .deal-btns { display:flex; gap:10px; }
        .deal-cart { background:var(--gold); color:white; border:none; padding:9px 18px; border-radius:30px; font-weight:700; cursor:pointer; }
        .deal-buy  { background:white; color:#2a2238; border:none; padding:9px 18px; border-radius:30px; font-weight:700; cursor:pointer; }

        /* ── MODAL ── */
        .modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.7); backdrop-filter:blur(4px); display:flex; align-items:center; justify-content:center; z-index:9999; padding:16px; animation:fadeIn 0.2s ease; }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        .modal-content { background:white; border-radius:20px; max-width:900px; width:100%; max-height:92vh; overflow-y:auto; position:relative; animation:slideUp 0.25s ease; box-shadow:0 25px 60px rgba(0,0,0,0.25); }
        @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .modal-close { position:absolute; top:14px; right:14px; width:36px; height:36px; border-radius:50%; background:rgba(0,0,0,0.08); border:none; font-size:16px; cursor:pointer; z-index:10; transition:all 0.2s; display:flex; align-items:center; justify-content:center; color:var(--muted); }
        .modal-close:hover { background:var(--red); color:white; transform:rotate(90deg); }
        .modal-body { display:grid; grid-template-columns:1fr 1fr; gap:1.8rem; padding:1.8rem; }
        .modal-img-wrap { border-radius:12px; overflow:hidden; background:#f8fafc; cursor:zoom-in; }
        .modal-img-wrap.zoomed { cursor:zoom-out; }
        .modal-img-wrap.zoomed .modal-img { transform:scale(1.5); }
        .modal-img { width:100%; height:auto; display:block; transition:transform 0.3s; }
        .zoom-hint { text-align:center; padding:7px; font-size:0.75rem; color:var(--muted); font-weight:600; }
        .modal-stock-badge { display:inline-block; margin-top:8px; padding:4px 12px; border-radius:20px; font-size:0.8rem; font-weight:700; }
        .modal-stock-badge.out { background:#fee2e2; color:var(--red); }
        .modal-stock-badge.low { background:#fef3c7; color:#92400e; }
        .modal-stock-badge.in  { background:#d1fae5; color:#065f46; }
        .modal-detail-side { display:flex; flex-direction:column; gap:1.1rem; }
        .modal-name { font-family:'Syne',sans-serif; font-size:1.5rem; font-weight:800; color:var(--text); line-height:1.2; }
        .modal-price-row { display:flex; align-items:center; justify-content:space-between; gap:10px; }
        .modal-price { font-size:1.7rem; font-weight:800; color:var(--green); }
        .modal-wish-btn { padding:6px 13px; border-radius:20px; border:2px solid var(--border); background:white; font-weight:600; font-size:0.85rem; cursor:pointer; transition:all 0.2s; }
        .modal-wish-btn:hover, .modal-wish-btn.active { border-color:#e11d48; background:#fff1f2; color:#be123c; }
        .modal-desc-block h4 { font-size:0.75rem; text-transform:uppercase; letter-spacing:0.06em; color:var(--muted); font-weight:700; margin-bottom:5px; }
        .modal-desc-block p { color:var(--muted); line-height:1.6; font-size:0.9rem; }
        .modal-info-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; background:#f8fafc; padding:14px; border-radius:10px; }
        .info-item { display:flex; flex-direction:column; gap:2px; }
        .info-label { font-size:0.68rem; text-transform:uppercase; letter-spacing:0.05em; color:var(--muted); font-weight:700; }
        .info-val { font-size:0.9rem; font-weight:700; color:var(--text); }
        .info-val.avail { color:var(--green); }
        .info-val.unavail { color:var(--red); }
        .modal-actions { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:auto; }
        .modal-btn-cart, .modal-btn-buy { padding:13px; border:none; border-radius:12px; font-weight:700; font-size:0.95rem; cursor:pointer; transition:all 0.2s; display:flex; align-items:center; justify-content:center; gap:5px; font-family:'DM Sans',sans-serif; min-height:48px; }
        .modal-btn-cart { background:linear-gradient(135deg,#10b981,#059669); color:white; }
        .modal-btn-buy  { background:linear-gradient(135deg,#3b82f6,#2563eb); color:white; }
        .modal-btn-cart:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 6px 16px rgba(16,185,129,0.3); }
        .modal-btn-buy:hover:not(:disabled)  { transform:translateY(-2px); box-shadow:0 6px 16px rgba(59,130,246,0.3); }
        .modal-btn-cart:disabled, .modal-btn-buy:disabled { background:#cbd5e1; cursor:not-allowed; }

        /* ── CART DRAWER ── */
        .cart-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.45); z-index:4000; opacity:0; pointer-events:none; transition:opacity 0.3s; }
        .cart-overlay.open { opacity:1; pointer-events:all; }
        .cart-drawer { position:fixed; top:0; right:0; width:min(400px,100vw); height:100vh; background:white; z-index:4001; display:flex; flex-direction:column; transform:translateX(100%); transition:transform 0.35s cubic-bezier(0.4,0,0.2,1); box-shadow:-8px 0 40px rgba(0,0,0,0.15); }
        .cart-drawer.open { transform:translateX(0); }
        .cd-head { background:#0f172a; padding:16px 18px; display:flex; align-items:center; justify-content:space-between; flex-shrink:0; }
        .cd-head-title { font-family:'Syne',sans-serif; font-weight:800; font-size:1rem; color:white; display:flex; align-items:center; gap:8px; }
        .cd-head-badge { background:var(--accent); color:white; font-size:0.7rem; font-weight:700; padding:2px 8px; border-radius:20px; }
        .cd-close { background:rgba(255,255,255,0.12); border:none; color:white; width:32px; height:32px; border-radius:8px; font-size:1.1rem; cursor:pointer; display:flex; align-items:center; justify-content:center; }
        .cd-added-banner { background:#f0fdf4; border-bottom:1px solid #bbf7d0; padding:10px 16px; display:flex; align-items:center; gap:8px; font-size:0.85rem; color:#166534; font-weight:600; flex-shrink:0; }
        .cd-added-img { font-size:1.3rem; }
        .cd-items { flex:1; overflow-y:auto; padding:8px 0; }
        .cd-item { display:grid; grid-template-columns:52px 1fr auto; gap:10px; padding:10px 16px; border-bottom:1px solid #f1f5f9; align-items:center; }
        .cd-item-ph { width:52px; height:52px; border-radius:8px; background:linear-gradient(135deg,#e2e8f0,#f1f5f9); display:flex; align-items:center; justify-content:center; font-size:1.3rem; flex-shrink:0; }
        .cd-item-info { min-width:0; }
        .cd-item-name { font-family:'Syne',sans-serif; font-weight:700; font-size:0.85rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; margin-bottom:3px; }
        .cd-item-price { color:var(--accent); font-weight:700; font-size:0.88rem; }
        .cd-item-unit { color:#94a3b8; font-size:0.75rem; }
        .cd-item-controls { display:flex; flex-direction:column; align-items:flex-end; gap:5px; }
        .cd-qty-box { display:flex; align-items:center; border:1.5px solid var(--border); border-radius:8px; overflow:hidden; }
        .cd-qty-btn { width:28px; height:28px; background:#f8fafc; border:none; font-size:1rem; font-weight:700; cursor:pointer; color:var(--text); transition:background 0.15s; display:flex; align-items:center; justify-content:center; }
        .cd-qty-btn:hover { background:var(--accent); color:white; }
        .cd-qty-num { width:28px; text-align:center; font-weight:700; font-size:0.82rem; border-left:1.5px solid var(--border); border-right:1.5px solid var(--border); line-height:28px; }
        .cd-remove { background:none; border:none; color:var(--red); font-size:0.72rem; cursor:pointer; font-weight:600; font-family:'DM Sans',sans-serif; }
        .cd-empty { flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:10px; color:#94a3b8; padding:40px; text-align:center; }
        .cd-empty-icon { font-size:3rem; }
        .cd-empty h3 { font-family:'Syne',sans-serif; font-weight:700; color:var(--text); }
        .cd-footer { border-top:1px solid var(--border); padding:14px 16px; flex-shrink:0; background:white; }
        .cd-totals { margin-bottom:12px; }
        .cd-row { display:flex; justify-content:space-between; font-size:0.88rem; padding:3px 0; }
        .cd-lbl { color:#64748b; }
        .cd-row.cd-grand { font-family:'Syne',sans-serif; font-weight:800; font-size:1rem; color:var(--text); border-top:1px solid var(--border); margin-top:6px; padding-top:8px; }
        .cd-free { color:var(--green); font-weight:700; }
        .cd-btn-row { display:flex; gap:8px; }
        .cd-btn-view { flex:1; background:#0f172a; color:white; border:none; padding:11px; border-radius:10px; font-family:'Syne',sans-serif; font-weight:700; font-size:0.9rem; cursor:pointer; text-align:center; text-decoration:none; display:flex; align-items:center; justify-content:center; }
        .cd-btn-checkout { flex:1.4; background:linear-gradient(135deg,#f97316,#ea580c); color:white; border:none; padding:11px; border-radius:10px; font-family:'Syne',sans-serif; font-weight:700; font-size:0.9rem; cursor:pointer; }
        .cd-btn-clear { background:none; border:1.5px solid var(--border); color:var(--red); padding:8px 12px; border-radius:8px; font-size:0.8rem; font-weight:600; cursor:pointer; font-family:'DM Sans',sans-serif; margin-top:8px; width:100%; }
        .cd-btn-clear:hover { background:var(--red); color:white; border-color:var(--red); }

        /* ════════════════════════════
           RESPONSIVE
        ════════════════════════════ */
        @media (max-width:1100px) { .sidebar { width:220px; } }

        @media (max-width:900px) {
          .sidebar { display:none !important; }
          .filter-overlay.open { display:block; animation:fadeIn 0.2s ease; }
          .filter-drawer { display:flex; }
          .cat-pills-bar { display:flex; }
          .filter-toggle-label { display:none; }
          .body-wrap { padding:12px; }
          .product-grid { grid-template-columns:repeat(2,1fr); gap:12px; }
        }

        @media (max-width:600px) {
          .cart-bar-inner { padding:8px 12px; }
          .cb-name { display:none; }
          .search-bar-inner { padding:8px 12px; gap:8px; }
          .modal-body { grid-template-columns:1fr; padding:1.2rem; gap:1.2rem; }
          .modal-actions { grid-template-columns:1fr; }
          .modal-name { font-size:1.2rem; }
          .modal-price { font-size:1.4rem; }
          .cart-banner, .deal-banner { flex-direction:column; text-align:center; }
          .deal-btns { justify-content:center; }
        }

        @media (max-width:420px) {
          .product-grid { grid-template-columns:1fr; }
          .body-wrap { padding:10px; }
          .product-img-wrap { height:200px; }
        }
      `}</style>
    </>
  );
}
