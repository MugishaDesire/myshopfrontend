const PLACEHOLDER = "https://placehold.co/300x200/3b82f6/white?text=No+Image";

// ══════════════════════════════════════════════════════════════════════════════
// ProductCard — extracted from Home.jsx (Uiverse "SachinKumar666" card)
// Owns its own styling (below). Still relies on the CSS custom properties
// (--accent, --blue, --red, --gold, --green, --border, etc.) declared on
// :root in Home.jsx's stylesheet, since ProductCard is only ever rendered
// inside Home — those tokens are page-wide, not card-specific.
// ══════════════════════════════════════════════════════════════════════════════
export default function ProductCard({
  product,
  isInCart,
  cartQty,
  wishlisted,
  onAddToCart,
  onBuyNow,
  onWishlistToggle,
  onOpenModal,
}) {
  const badgeLabel = product.stock <= 0
    ? "Out of Stock"
    : product.stock < 10
    ? "Low Stock"
    : isInCart
    ? `In Cart · ${cartQty}`
    : null;
  const badgeClass = product.stock <= 0 ? "oos" : product.stock < 10 ? "low" : "cart";

  return (
    <>
    <div className="card" onClick={() => onOpenModal(product)}>
      <div className="card__shine"></div>
      <div className="card__glow"></div>

      <button
        className={`card__heart ${wishlisted ? "hearted" : ""}`}
        onClick={e => { e.stopPropagation(); onWishlistToggle(product); }}
      >
        {wishlisted ? "❤️" : "🤍"}
      </button>

      <div className="card__content">
        {badgeLabel && (
          <div className={`card__badge ${badgeClass}`}>{badgeLabel}</div>
        )}

        <div className="card__image">
          <img
            src={product.imageUrl || PLACEHOLDER}
            alt={product.name || "Product"}
            onError={e => { e.target.src = PLACEHOLDER; e.target.onerror = null; }}
          />
        </div>

        <div className="card__text">
          <p className="card__title">{product.name || "Unnamed Product"}</p>
          <p className="card__description">
            {product.description
              ? (product.description.length > 60
                  ? `${product.description.substring(0, 60)}…`
                  : product.description)
              : `${product.category || "General"} · ${product.stock <= 0 ? "Out of stock" : `${product.stock} in stock`}`}
          </p>
        </div>

        <div className="card__footer">
          <div className="card__price">${product.price.toFixed(2)}</div>
          <div className="card__actions">
            <button
              className="card__action card__action--cart"
              onClick={e => { e.stopPropagation(); onAddToCart(product); }}
              disabled={product.stock <= 0}
              title={product.stock <= 0 ? "Out of stock" : isInCart ? `Add another (${cartQty} in cart)` : "Add to cart"}
            >
              {isInCart ? `🛒 ${cartQty}` : "🛒 Add"}
            </button>
            <button
              className="card__action card__action--buy"
              onClick={e => { e.stopPropagation(); onBuyNow(product); }}
              disabled={product.stock <= 0}
              title="Buy now"
            >
              ⚡ Buy
            </button>
          </div>
        </div>
      </div>
    </div>

    <style>{`
      /* ── PRODUCT CARD (Uiverse "SachinKumar666" card) ── */
      .card {
        --card-bg: #ffffff;
        --card-accent: #f97316;
        --card-text: #1e293b;
        --card-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
        width: 100%;
        background: var(--card-bg);
        border-radius: 20px;
        position: relative;
        overflow: hidden;
        transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        box-shadow: var(--card-shadow);
        border: 1px solid rgba(255, 255, 255, 0.2);
        font-family: 'DM Sans', sans-serif;
        cursor: pointer;
        display: flex;
        flex-direction: column;
      }
      .card__shine {
        position: absolute;
        inset: 0;
        background: linear-gradient(120deg, rgba(255,255,255,0) 40%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0) 60%);
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
      }
      .card__glow {
        position: absolute;
        inset: -10px;
        background: radial-gradient(circle at 50% 0%, rgba(249,115,22,0.25) 0%, rgba(249,115,22,0) 70%);
        opacity: 0;
        transition: opacity 0.5s ease;
        pointer-events: none;
      }
      .card__heart {
        position: absolute;
        top: 12px;
        right: 12px;
        z-index: 6;
        background: rgba(255,255,255,0.92);
        border: none;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        font-size: 0.9rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(0,0,0,0.12);
        transition: transform 0.2s ease;
      }
      .card__heart:hover { transform: scale(1.15); }
      .card__content {
        padding: 1.1em;
        height: 100%;
        display: flex;
        flex-direction: column;
        gap: 0.7em;
        position: relative;
        z-index: 2;
      }
      .card__badge {
        position: absolute;
        top: 12px;
        left: 12px;
        color: white;
        padding: 0.25em 0.6em;
        border-radius: 999px;
        font-size: 0.65em;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.03em;
        z-index: 3;
      }
      .card__badge.oos  { background: var(--red); }
      .card__badge.low  { background: var(--gold); }
      .card__badge.cart { background: var(--blue); }
      .card__image {
        width: 100%;
        height: 130px;
        background-color: #ede9fe;
        border-radius: 12px;
        transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        position: relative;
        overflow: hidden;
      }
      .card__image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        transition: transform 0.4s ease;
      }
      .card:hover .card__image img { transform: scale(1.06); }
      .card__text { display: flex; flex-direction: column; gap: 0.25em; }
      .card__title {
        color: var(--card-text);
        font-size: 1em;
        font-weight: 700;
        transition: all 0.3s ease;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .card__description {
        color: var(--card-text);
        font-size: 0.75em;
        opacity: 0.7;
        transition: all 0.3s ease;
        line-height: 1.4;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      .card__footer {
        display: flex;
        flex-direction: column;
        gap: 0.5em;
        margin-top: auto;
      }
      .card__price {
        color: var(--card-text);
        font-weight: 700;
        font-size: 1.05em;
        transition: all 0.3s ease;
      }
      .card__actions { display: flex; gap: 6px; }
      .card__action {
        flex: 1;
        border: none;
        border-radius: 8px;
        padding: 8px 4px;
        font-family: 'DM Sans', sans-serif;
        font-size: 0.78rem;
        font-weight: 700;
        color: white;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 3px;
        min-height: 36px;
      }
      .card__action--cart { background: linear-gradient(135deg,#10b981,#059669); flex: 1.2; }
      .card__action--buy  { background: var(--card-accent); }
      .card__action:hover:not(:disabled) { transform: translateY(-1px); filter: brightness(1.05); }
      .card__action:disabled { background: #cbd5e1; cursor: not-allowed; }

      /* Hover effects */
      .card:hover {
        transform: translateY(-8px);
        box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04);
        border-color: rgba(249,115,22,0.2);
      }
      .card:hover .card__shine { opacity: 1; animation: shine 3s infinite; }
      .card:hover .card__glow { opacity: 1; }
      .card:hover .card__image { box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); }
      .card:hover .card__title { color: var(--card-accent); }
      .card:hover .card__description { opacity: 1; }
      .card:hover .card__price { color: var(--card-accent); }
      .card:active { transform: translateY(-3px) scale(0.98); }

      @keyframes shine { 0% { background-position: -100% 0; } 100% { background-position: 200% 0; } }

      @media (max-width: 420px) {
        .card__image { height: 160px; }
      }
    `}</style>
    </>
  );
}
