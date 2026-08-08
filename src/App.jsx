import React, { useState, useEffect, useRef } from "react";
import {
  Search, Heart, ShoppingCart, User, Home as HomeIcon, Star, Zap,
  Plus, Minus, Trash2, X, ExternalLink, Headphones, Watch, Smartphone,
  Camera, Shirt, BookOpen, Speaker, Sparkles, MapPin, TrendingUp,
  ChevronRight, Package, Pencil, Lock, Unlock, Cpu, ShoppingBasket,
  Plug, Baby, LayoutGrid, Laptop, Tv, Gamepad2, Lightbulb, UtensilsCrossed,
  ShieldCheck, Briefcase, Footprints, Gem, Sofa, Refrigerator, Bike,
  Dumbbell, PenTool, Coffee, ChevronDown
} from "lucide-react";

const ADMIN_PASSWORD = "excite2026";

const COLORS = {
  ink: '#e2e8f0',
  dusk: '#0a0e1a',
  duskLight: '#1e293b',
  cream: '#0a0e1a',
  card: 'rgba(255,255,255,0.05)',
  orange: '#00d4ff',
  orangeDark: '#f43f5e',
  yellow: '#a855f7',
  muted: '#64748b',
  mint: '#00d4ff',
  line: 'rgba(255,255,255,0.08)',
};

const CATEGORY_TREE = [
  {
    name: "Mobiles & Electronics",
    icon: Smartphone,
    subcategories: [
      { name: "Mobiles & Accessories", icon: Smartphone },
      { name: "Electronics", icon: Cpu },
      { name: "Laptops", icon: Laptop },
      { name: "Televisions", icon: Tv },
      { name: "Headphones & Audio", icon: Headphones },
      { name: "Smart Watches", icon: Watch },
      { name: "Cameras", icon: Camera },
    ],
  },
  {
    name: "Fashion & Beauty",
    icon: Shirt,
    subcategories: [
      { name: "Men's Fashion", icon: Shirt },
      { name: "Women's Fashion", icon: Gem },
      { name: "Footwear", icon: Footprints },
      { name: "Beauty & Personal Care", icon: Sparkles },
      { name: "Bags & Luggage", icon: Briefcase },
    ],
  },
  {
    name: "Home & Furniture",
    icon: HomeIcon,
    subcategories: [
      { name: "Furniture", icon: Sofa },
      { name: "Kitchen & Dining", icon: UtensilsCrossed },
      { name: "Home Appliances", icon: Refrigerator },
      { name: "Home Decor", icon: Plug },
    ],
  },
  {
    name: "Health, Fitness & Stationery",
    icon: Dumbbell,
    subcategories: [
      { name: "Health & Fitness", icon: Dumbbell },
      { name: "Books & Stationery", icon: BookOpen },
    ],
  },
  {
    name: "Kids & Toys",
    icon: Baby,
    subcategories: [
      { name: "Toys & Games", icon: Gamepad2 },
      { name: "Baby Care", icon: Baby },
      { name: "Kids Fashion", icon: Shirt },
      { name: "School Supplies", icon: PenTool },
    ],
  },
];

const TINT_PALETTE = ['#0f172a','#131c2e','#0e1628','#101a2c','#0f1726','#14192d','#0d1525','#12182b','#0e1829','#13172a'];

const CATEGORY_META = {};
(function buildCategoryMeta() {
  let i = 0;
  CATEGORY_TREE.forEach((main) => {
    main.subcategories.forEach((sub) => {
      CATEGORY_META[sub.name] = { icon: sub.icon, tint: TINT_PALETTE[i % TINT_PALETTE.length], parent: main.name };
      i++;
    });
  });
})();

function parentCategoryOf(subName) {
  return CATEGORY_META[subName] ? CATEGORY_META[subName].parent : undefined;
}

const PLATFORM_COLORS = {
  Amazon: { bg: 'rgba(255,153,0,0.15)', text: '#fbbf24' },
  Flipkart: { bg: 'rgba(47,128,237,0.15)', text: '#60a5fa' },
  Myntra: { bg: 'rgba(255,68,104,0.15)', text: '#fb7185' },
  Ajio: { bg: 'rgba(255,107,53,0.15)', text: '#fb923c' },
  Nykaa: { bg: 'rgba(252,92,125,0.15)', text: '#fb7185' },
  Meesho: { bg: 'rgba(98,0,234,0.15)', text: '#a78bfa' },
  'Tata Cliq': { bg: 'rgba(39,174,96,0.15)', text: '#4ade80' },
  FirstCry: { bg: 'rgba(0,166,81,0.15)', text: '#4ade80' },
  Snapdeal: { bg: 'rgba(228,57,53,0.15)', text: '#f87171' },
  BigBasket: { bg: 'rgba(132,204,22,0.15)', text: '#a3e635' },
  Croma: { bg: 'rgba(0,189,126,0.15)', text: '#34d399' },
  Pepperfry: { bg: 'rgba(243,120,32,0.15)', text: '#fb923c' },
};

const PLATFORM_LIST = Object.keys(PLATFORM_COLORS);

const SEED_PRODUCTS = [];

const API_PRODUCTS = "/api/products";
const API_SCRAPE = "/api/scrape";

function exciteScore(p) {
  const discount = Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
  const score = Math.min(99, Math.round(discount * 0.75 + p.rating * 6));
  return { discount, score };
}

function formatINR(n) {
  return "₹" + Math.round(n).toLocaleString("en-IN");
}

function FontLoader() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Inter:wght@400;500;600;700;800&display=swap');
      .se-root { font-family: 'Inter', sans-serif; }
      .se-display { font-family: 'Fraunces', 'Inter', serif; font-weight: 500; letter-spacing: -0.01em; }
      
      @keyframes se-pop { from { transform: scale(0.98); opacity: 0; } to { transform: scale(1); opacity: 1; } }
      @keyframes se-slidein { from { transform: translateY(8px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      @keyframes se-bump { 0% { transform: scale(1); } 50% { transform: scale(1.1); } 100% { transform: scale(1); } }
      
      @keyframes se-float { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-20px); } }
      @keyframes se-gradient-text { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
      @keyframes se-glow { 0%,100% { box-shadow: 0 0 5px rgba(0,212,255,0.3); } 50% { box-shadow: 0 0 20px rgba(0,212,255,0.6), 0 0 40px rgba(168,85,247,0.3); } }
      @keyframes se-shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }

      .se-card { 
        transition: transform 0.3s cubic-bezier(.2,.7,.3,1), box-shadow 0.3s cubic-bezier(.2,.7,.3,1), border-color 0.3s ease; 
        box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06); 
      }
      .se-card:hover { 
        transform: translateY(-8px); 
        box-shadow: 0 0 15px rgba(0,212,255,0.2), 0 0 30px rgba(0,212,255,0.1); 
        border-color: rgba(0,212,255,0.3) !important; 
      }
      .se-card:hover .se-img { transform: scale(1.08); }
      .se-img { transition: transform 0.5s cubic-bezier(.2,.7,.3,1); }
      
      .se-btn { transition: transform 0.15s ease, background-color 0.2s ease, border-color 0.2s ease, opacity 0.15s ease, box-shadow 0.2s ease; }
      .se-btn:active { transform: translateY(1px); opacity: 0.85; }
      
      .se-fadein { animation: se-slidein 0.4s cubic-bezier(.2,.7,.3,1) both; }
      .se-pop { animation: se-pop 0.22s cubic-bezier(.2,.7,.3,1) both; }
      .se-bump { animation: se-bump 0.32s cubic-bezier(.2,.7,.3,1); }
      .se-meter-fill { transition: width 0.6s cubic-bezier(.2,.7,.3,1); }
      .se-heart { transition: transform 0.2s cubic-bezier(.2,.7,.3,1); }
      .se-heart:active { transform: scale(0.85); }
      .se-tab-icon { transition: transform 0.2s cubic-bezier(.2,.7,.3,1); }
      .se-scrollx::-webkit-scrollbar { display: none; }
      .se-scrollx { -ms-overflow-style: none; scrollbar-width: none; }

      .se-gradient-text { background: linear-gradient(135deg, #00d4ff, #a855f7, #00d4ff); background-size: 200% 200%; -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: se-gradient-text 4s ease infinite; }
      .se-glow-btn { animation: se-glow 2s ease-in-out infinite; }
      .se-glass { background: rgba(255,255,255,0.05); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); border: 1px solid rgba(255,255,255,0.08); }

      @media (prefers-reduced-motion: reduce) {
        .se-card, .se-img, .se-btn, .se-fadein, .se-pop, .se-bump, .se-meter-fill, .se-heart, .se-tab-icon, .se-gradient-text, .se-glow-btn, .se-float, .se-shimmer { animation: none !important; transition: none !important; }
      }
    `}</style>
  );
}

function ParticlesBackground() {
  const particles = React.useMemo(() => Array.from({ length: 25 }, (_, i) => ({
    id: i,
    size: 2 + Math.random() * 4,
    left: Math.random() * 100,
    top: Math.random() * 100,
    duration: 15 + Math.random() * 25,
    delay: Math.random() * 10,
    opacity: 0.08 + Math.random() * 0.2,
    color: i % 3 === 0 ? '#a855f7' : '#00d4ff',
  })), []);
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      {particles.map(p => (
        <div key={p.id} style={{
          position: 'absolute', left: p.left + '%', top: p.top + '%',
          width: p.size, height: p.size, borderRadius: '50%',
          background: p.color, opacity: p.opacity,
          animation: `se-float ${p.duration}s ease-in-out ${p.delay}s infinite`,
        }} />
      ))}
    </div>
  );
}

function StarRow({ rating }) {
  const full = Math.floor(rating);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Star key={i} size={13} fill={i < full ? "#00d4ff" : "none"} stroke={i < full ? "#00d4ff" : COLORS.muted} />
      ))}
      <span style={{ fontSize: 12, color: COLORS.muted, marginLeft: 2, fontWeight: 600 }}>{rating}</span>
    </div>
  );
}

function ExciteMeter({ score }) {
  return (
    <div style={{ marginTop: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
        <span style={{ fontSize: 10.5, fontWeight: 700, color: COLORS.muted, letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: 4 }}>
          <Zap size={11} fill="none" stroke={COLORS.muted} /> EXCITE SCORE
        </span>
        <span style={{ fontSize: 11, fontWeight: 700, color: COLORS.ink }}>{score}%</span>
      </div>
      <div style={{ height: 3, borderRadius: 999, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
        <div
          className="se-meter-fill"
          style={{
            height: "100%",
            width: score + "%",
            borderRadius: 999,
            background: "linear-gradient(90deg, #00d4ff, #a855f7)",
          }}
        />
      </div>
    </div>
  );
}

function PlatformBadge({ platform }) {
  const c = PLATFORM_COLORS[platform] || PLATFORM_COLORS.Amazon;
  return (
    <span style={{ background: c.bg, color: c.text, fontSize: 10, fontWeight: 800, padding: "3px 8px", borderRadius: 999, letterSpacing: "0.02em" }}>
      {platform}
    </span>
  );
}

function ProductCard({ product, inWishlist, onToggleWishlist, onAddToCart, onViewDeal, onEdit, onDelete, index = 0 }) {
  const { discount, score } = exciteScore(product);
  const meta = CATEGORY_META[product.category] || { icon: LayoutGrid, tint: "#0f172a" };
  const Icon = meta.icon;
  return (
    <div className="se-card se-fadein se-glass" style={{ borderRadius: 14, overflow: "hidden", display: "flex", flexDirection: "column", animationDelay: Math.min(index * 40, 320) + "ms" }}>
      <div style={{ position: "relative", height: 160, background: meta.tint, overflow: "hidden" }}>
        <img
          src={product.image}
          alt={product.name}
          className="se-img"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
          onError={(e) => { e.target.style.display = "none"; }}
        />
        <div style={{ position: "absolute", top: 10, left: 10 }}>
          <PlatformBadge platform={product.platform} />
        </div>
        <div style={{ position: "absolute", top: 8, right: 8, display: "flex", flexDirection: "column", gap: 6 }}>
          <button
            onClick={() => onToggleWishlist(product.id)}
            className="se-btn"
            style={{
              width: 30, height: 30, borderRadius: "50%",
              background: "rgba(10,14,26,0.8)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", backdropFilter: "blur(4px)"
            }}
            aria-label="Toggle wishlist"
          >
            <Heart className="se-heart" size={15} fill={inWishlist ? COLORS.orange : "none"} stroke={inWishlist ? COLORS.orange : COLORS.ink} style={{ transition: "fill 0.2s ease, stroke 0.2s ease" }} />
          </button>
          {onEdit && (
            <button
              onClick={() => onEdit(product)}
              className="se-btn"
              style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(10,14,26,0.8)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", backdropFilter: "blur(4px)" }}
              aria-label="Edit product"
            >
              <Pencil size={13} color={COLORS.ink} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(product.id)}
              className="se-btn"
              style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(10,14,26,0.8)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", backdropFilter: "blur(4px)" }}
              aria-label="Delete product"
            >
              <Trash2 size={13} color={COLORS.orangeDark} />
            </button>
          )}
        </div>
        {discount > 0 && (
          <div style={{ position: "absolute", bottom: 8, left: 10, background: "linear-gradient(135deg, #00d4ff, #a855f7)", color: "#fff", fontSize: 10, fontWeight: 800, padding: "3px 8px", borderRadius: 6 }}>
            {discount}% OFF
          </div>
        )}
      </div>
      <div style={{ padding: "12px 14px 14px", display: "flex", flexDirection: "column", flex: 1 }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: COLORS.muted, textTransform: "uppercase", letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: 4 }}>
          <Icon size={11} /> {product.category}
        </span>
        <h3 style={{ fontSize: 14.5, fontWeight: 700, color: COLORS.ink, margin: "3px 0 6px", lineHeight: 1.3, minHeight: 36 }}>{product.name}</h3>
        <StarRow rating={product.rating} />
        <div style={{ display: "flex", alignItems: "baseline", gap: 7, marginTop: 8 }}>
          <span style={{ fontSize: 18, fontWeight: 800, color: COLORS.ink }}>{formatINR(product.price)}</span>
          {product.originalPrice > product.price && (
            <span style={{ fontSize: 12.5, color: COLORS.muted, textDecoration: "line-through" }}>{formatINR(product.originalPrice)}</span>
          )}
        </div>
        <ExciteMeter score={score} />
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <button
            onClick={() => onAddToCart(product.id)}
            className="se-btn"
            style={{ flex: 1, padding: "9px 0", borderRadius: 10, border: "1.5px solid rgba(255,255,255,0.2)", background: "transparent", color: "#e2e8f0", fontSize: 12.5, fontWeight: 700, cursor: "pointer" }}
          >
            Save to cart
          </button>
          <button
            onClick={() => onViewDeal(product)}
            className="se-btn"
            style={{ flex: 1, padding: "9px 0", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #00d4ff, #a855f7)", color: "#fff", fontSize: 12.5, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}
          >
            View deal <ExternalLink size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ title, body, ctaLabel, onCta, Icon }) {
  return (
    <div className="se-glass" style={{ textAlign: "center", padding: "56px 20px", borderRadius: 14 }}>
      <div style={{ width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg, rgba(0,212,255,0.2), rgba(168,85,247,0.2))", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
        <Icon size={24} color={COLORS.orange} />
      </div>
      <h3 style={{ fontSize: 17, fontWeight: 800, color: COLORS.ink, margin: "0 0 6px" }}>{title}</h3>
      <p style={{ fontSize: 13.5, color: COLORS.muted, margin: "0 0 18px", maxWidth: 320, marginLeft: "auto", marginRight: "auto" }}>{body}</p>
      {ctaLabel && (
        <button onClick={onCta} className="se-btn" style={{ background: COLORS.ink, color: "#0a0e1a", border: "none", padding: "10px 22px", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
          {ctaLabel}
        </button>
      )}
    </div>
  );
}

export default function SoulExciterApp() {
  const [products, setProducts] = useState(SEED_PRODUCTS);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState(false);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [tab, setTab] = useState("home");
  const [activeMain, setActiveMain] = useState("All");
  const [category, setCategory] = useState("All");
  const [toast, setToast] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [clickHistory, setClickHistory] = useState([]);
  const [cartBump, setCartBump] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminInput, setAdminInput] = useState("");
  const [adminError, setAdminError] = useState(false);
  const [savingProduct, setSavingProduct] = useState(false);
  const [fetchingDetails, setFetchingDetails] = useState(false);
  const toastTimer = useRef(null);

  const [form, setForm] = useState({
    name: "", category: "Mobiles & Accessories", platform: "Amazon", price: "", originalPrice: "", rating: "4.5", affiliateLink: "", image: "",
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(API_PRODUCTS);
        if (!res.ok) throw new Error("Failed to load products");
        const data = await res.json();
        if (!cancelled) {
          setProducts(Array.isArray(data) ? data : []);
          setProductsError(false);
        }
      } catch (err) {
        if (!cancelled) setProductsError(true);
      } finally {
        if (!cancelled) setLoadingProducts(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  function startEdit(product) {
    setForm({
      name: product.name,
      category: product.category,
      platform: product.platform,
      price: String(product.price),
      originalPrice: String(product.originalPrice),
      rating: String(product.rating),
      affiliateLink: product.affiliateLink,
      image: product.image,
    });
    setEditingId(product.id);
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setForm({ name: "", category: "Mobiles & Accessories", platform: "Amazon", price: "", originalPrice: "", rating: "4.5", affiliateLink: "", image: "" });
    setEditingId(null);
  }

  async function deleteProduct(id) {
    const prevProducts = products;
    setProducts((ps) => ps.filter((p) => p.id !== id));
    setCart((c) => c.filter((x) => x.id !== id));
    setWishlist((w) => w.filter((x) => x !== id));
    try {
      const res = await fetch(`${API_PRODUCTS}?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      notify("Product removed");
    } catch (err) {
      setProducts(prevProducts);
      notify("Couldn't remove product — check your connection and try again");
    }
  }

  function submitAdminLogin(e) {
    e.preventDefault();
    if (adminInput === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setShowAdminModal(false);
      setAdminInput("");
      setAdminError(false);
      notify("Admin mode on");
    } else {
      setAdminError(true);
    }
  }

  function logoutAdmin() {
    setIsAdmin(false);
    setShowAddForm(false);
    resetForm();
    notify("Admin mode off");
  }

  function notify(msg) {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2400);
  }

  function bumpCart() {
    setCartBump(true);
    setTimeout(() => setCartBump(false), 400);
  }

  function addToCart(id) {
    setCart((c) => {
      const existing = c.find((x) => x.id === id);
      if (existing) return c.map((x) => (x.id === id ? { ...x, qty: x.qty + 1 } : x));
      return [...c, { id, qty: 1 }];
    });
    bumpCart();
    const p = products.find((x) => x.id === id);
    notify((p ? p.name.slice(0, 24) : "Item") + " saved to cart");
  }

  function removeFromCart(id) {
    setCart((c) => c.filter((x) => x.id !== id));
  }

  function changeQty(id, delta) {
    setCart((c) => c.map((x) => (x.id === id ? { ...x, qty: Math.max(1, x.qty + delta) } : x)));
  }

  function toggleWishlist(id) {
    setWishlist((w) => {
      if (w.includes(id)) {
        notify("Removed from wishlist");
        return w.filter((x) => x !== id);
      }
      notify("Added to wishlist");
      return [...w, id];
    });
  }

  function moveToCart(id) {
    addToCart(id);
    setWishlist((w) => w.filter((x) => x !== id));
  }

  function viewDeal(product) {
    setProducts((ps) => ps.map((p) => (p.id === product.id ? { ...p, clicks: p.clicks + 1 } : p)));
    setClickHistory((h) => [{ id: product.id + "-" + Date.now(), name: product.name, platform: product.platform, image: product.image }, ...h].slice(0, 12));
    window.open(product.affiliateLink, "_blank", "noopener,noreferrer");
    fetch(API_PRODUCTS, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: product.id, clicks: product.clicks + 1 }),
    }).catch(() => {});
  }

  async function submitProduct(e) {
    e.preventDefault();
    if (!form.name || !form.price || !form.affiliateLink) {
      notify("Fill in name, price and affiliate link");
      return;
    }
    const price = Number(form.price);
    const originalPrice = Number(form.originalPrice) || Math.round(price * 1.4);
    const image = form.image || `https://picsum.photos/seed/${encodeURIComponent(form.name)}/500/500`;

    setSavingProduct(true);
    try {
      if (editingId) {
        const changes = {
          id: editingId, name: form.name, category: form.category, platform: form.platform, price, originalPrice,
          rating: Number(form.rating) || 4.5, affiliateLink: form.affiliateLink, image,
        };
        const res = await fetch(API_PRODUCTS, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(changes),
        });
        if (!res.ok) throw new Error("Update failed");
        const updated = await res.json();
        setProducts(updated);
        notify("Product updated");
      } else {
        const newP = {
          name: form.name, category: form.category, platform: form.platform, price, originalPrice,
          rating: Number(form.rating) || 4.5, affiliateLink: form.affiliateLink, image,
        };
        const res = await fetch(API_PRODUCTS, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newP),
        });
        if (!res.ok) throw new Error("Publish failed");
        const updated = await res.json();
        setProducts(updated);
        notify("Product listed on your home feed");
      }
      resetForm();
      setShowAddForm(false);
    } catch (err) {
      notify("Couldn't save that product — check your connection and try again");
    } finally {
      setSavingProduct(false);
    }
  }

  async function autofillFromLink() {
    if (!form.affiliateLink) {
      notify("Paste an affiliate link first");
      return;
    }
    setFetchingDetails(true);
    try {
      const res = await fetch(`${API_SCRAPE}?url=${encodeURIComponent(form.affiliateLink)}`);
      const data = await res.json();
      if (!res.ok || data.error) {
        notify(data.error || "Couldn't fetch details from that link");
        return;
      }
      setForm((f) => ({
        ...f,
        name: data.name || f.name,
        image: data.image || f.image,
        price: data.price != null ? String(data.price) : f.price,
        originalPrice: data.originalPrice != null ? String(data.originalPrice) : f.originalPrice,
        rating: data.rating != null ? String(data.rating) : f.rating,
      }));
      notify(data.fetched ? "Filled in what we could find — please double-check it" : "That page didn't expose product details — fill them in manually");
    } catch (err) {
      notify("Couldn't reach that link — check the URL and try again");
    } finally {
      setFetchingDetails(false);
    }
  }

  const NAV_MAIN = [{ name: "All", icon: LayoutGrid }, ...CATEGORY_TREE];

  function selectMain(name) {
    setActiveMain(name);
    setCategory("All");
  }

  function selectSub(name) {
    setCategory(name);
    document.getElementById("se-grid")?.scrollIntoView({ behavior: "smooth" });
  }

  const visibleProducts = products.filter((p) => {
    const matchesMain = activeMain === "All" || parentCategoryOf(p.category) === activeMain;
    const matchesSub = category === "All" || p.category === category;
    return matchesMain && matchesSub;
  });
  const cartCount = cart.reduce((s, x) => s + x.qty, 0);
  const cartProducts = cart.map((c) => ({ ...c, product: products.find((p) => p.id === c.id) })).filter((c) => c.product);
  const subtotal = cartProducts.reduce((s, c) => s + c.product.price * c.qty, 0);
  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));
  const totalClicks = products.reduce((s, p) => s + p.clicks, 0);
  const topPlatform = (() => {
    const counts = {};
    products.forEach((p) => { counts[p.platform] = (counts[p.platform] || 0) + p.clicks; });
    const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return entries.length && entries[0][1] > 0 ? entries[0][0] : "—";
  })();

  const NAV_ITEMS = [
    { key: "home", label: "Home", icon: HomeIcon },
    { key: "you", label: "You", icon: User },
    { key: "wishlist", label: "Wishlist", icon: Heart },
    { key: "cart", label: "Cart", icon: ShoppingCart },
  ];

  return (
    <div className="se-root" style={{ background: 'linear-gradient(135deg, #0a0e1a 0%, #0f172a 50%, #0a0e1a 100%)', minHeight: "100vh", width: "100%" }}>
      <FontLoader />
      <ParticlesBackground />

      {/* NAV */}
      <div style={{ position: "sticky", top: 0, zIndex: 40, background: 'rgba(10,14,26,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: "12px 16px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1, marginRight: 6 }}>
            <span className="se-display se-gradient-text" style={{ fontSize: 24 }}>SOUL EXCITER</span>
            <span style={{ color: COLORS.yellow, fontSize: 9, fontWeight: 700, letterSpacing: "0.18em" }}>— DO WHAT EXCITES —</span>
          </div>

          <div style={{ flex: 1, minWidth: 160, display: "flex", alignItems: "center", background: "rgba(255,255,255,0.06)", borderRadius: 10, padding: "8px 12px", gap: 8 }}>
            <Search size={16} color="#64748b" />
            <input
              placeholder="Search earbuds, sneakers, watches..."
              style={{ background: "transparent", border: "none", outline: "none", color: "#fff", fontSize: 13, width: "100%" }}
            />
          </div>

          <div style={{ display: "flex", gap: 4 }}>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = tab === item.key;
              const count = item.key === "cart" ? cartCount : item.key === "wishlist" ? wishlist.length : 0;
              return (
                <button
                  key={item.key}
                  onClick={() => setTab(item.key)}
                  className="se-btn"
                  style={{
                    position: "relative", display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", borderRadius: 10,
                    border: "none", cursor: "pointer", background: active ? 'linear-gradient(135deg, #00d4ff, #a855f7)' : "transparent", color: active ? "#fff" : "#ACA79A", fontSize: 12.5, fontWeight: 700,
                  }}
                >
                  <span className={item.key === "cart" && cartBump ? "se-bump" : ""} style={{ display: "flex" }}>
                    <Icon size={16} fill={item.key === "wishlist" && wishlist.length ? (active ? "#fff" : COLORS.orange) : "none"} />
                  </span>
                  {item.label}
                  {count > 0 && (
                    <span style={{ position: "absolute", top: -4, right: -4, background: COLORS.yellow, color: COLORS.dusk, fontSize: 10, fontWeight: 800, borderRadius: "50%", width: 17, height: 17, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
            <button
              onClick={() => (isAdmin ? logoutAdmin() : setShowAdminModal(true))}
              className="se-btn"
              title={isAdmin ? "Turn off admin mode" : "Admin login"}
              style={{
                display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", borderRadius: 10, border: "none", cursor: "pointer",
                background: isAdmin ? COLORS.mint : "transparent", color: isAdmin ? "#fff" : "#ACA79A", fontSize: 12.5, fontWeight: 700,
              }}
            >
              {isAdmin ? <Unlock size={16} /> : <Lock size={16} />}
            </button>
          </div>
        </div>
      </div>

      {showAdminModal && (
        <div
          onClick={() => { setShowAdminModal(false); setAdminInput(""); setAdminError(false); }}
          style={{ position: "fixed", inset: 0, background: "rgba(10,14,26,0.8)", backdropFilter: "blur(4px)", zIndex: 70, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="se-pop se-glass"
            style={{ borderRadius: 14, padding: 24, width: "100%", maxWidth: 320, boxShadow: "0 0 15px rgba(0,212,255,0.2)", border: "1px solid rgba(0,212,255,0.3)" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <Lock size={18} color={COLORS.orange} />
              <h3 style={{ fontSize: 16, fontWeight: 800, color: COLORS.ink, margin: 0 }}>Admin login</h3>
            </div>
            <p style={{ fontSize: 12.5, color: COLORS.muted, margin: "0 0 14px" }}>Enter the admin password to list, edit, or remove products.</p>
            <input
              type="password"
              autoFocus
              value={adminInput}
              onChange={(e) => { setAdminInput(e.target.value); setAdminError(false); }}
              onKeyDown={(e) => { if (e.key === "Enter") submitAdminLogin(e); }}
              placeholder="Password"
              style={{ ...inputStyle, borderColor: adminError ? COLORS.orangeDark : "rgba(255,255,255,0.1)", marginBottom: 6 }}
            />
            {adminError && <p style={{ fontSize: 11.5, color: COLORS.orangeDark, margin: "0 0 10px" }}>Incorrect password, try again.</p>}
            <button type="button" onClick={submitAdminLogin} className="se-btn" style={{ width: "100%", marginTop: 8, background: COLORS.ink, color: COLORS.dusk, border: "none", padding: "10px 0", borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
              Unlock admin mode
            </button>
          </div>
        </div>
      )}

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 16px 60px" }}>
        {tab === "home" && (
          <div className="se-fadein">
            {/* HERO */}
            <div style={{ position: "relative", overflow: "hidden", borderRadius: 18, margin: "20px 0", padding: "56px 32px", background: 'linear-gradient(150deg, #0a0e1a 0%, #1a103a 40%, #0a1628 100%)' }}>
              <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
              <div style={{ position: "relative", maxWidth: 560 }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: '#00d4ff', fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 18 }}>
                  <Sparkles size={12} /> HANDPICKED DEALS, DAILY
                </span>
                <h1 className="se-gradient-text se-display" style={{ fontSize: 46, lineHeight: 1.08, margin: "0 0 16px" }}>
                  Find it. Want it.<br />Do what excites.
                </h1>
                <p style={{ color: "#94a3b8", fontSize: 14.5, margin: "0 0 28px", maxWidth: 420, lineHeight: 1.6 }}>
                  Every product here is scored on our Excite Meter — real discounts, real ratings, zero guesswork. Tap a deal to grab it.
                </p>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button onClick={() => document.getElementById("se-grid")?.scrollIntoView({ behavior: "smooth" })} className="se-btn se-glow-btn" style={{ background: 'linear-gradient(135deg, #00d4ff, #a855f7)', color: '#fff', border: "none", padding: "12px 22px", borderRadius: 9, fontWeight: 700, fontSize: 13.5, cursor: "pointer" }}>
                    Browse today's picks
                  </button>
                  {isAdmin && (
                    <button onClick={() => { if (showAddForm) { setShowAddForm(false); } else { resetForm(); setShowAddForm(true); } }} className="se-btn" style={{ background: "transparent", color: '#e2e8f0', border: "1px solid rgba(255,255,255,0.2)", padding: "12px 22px", borderRadius: 9, fontWeight: 600, fontSize: 13.5, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                      <Plus size={15} /> List a product
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* ADD PRODUCT PANEL */}
            {showAddForm && isAdmin && (
              <div className="se-pop se-glass" style={{ borderRadius: 14, padding: 22, marginBottom: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: COLORS.ink, margin: 0, display: "flex", alignItems: "center", gap: 7 }}>
                    <Package size={17} color={COLORS.orange} /> {editingId ? "Edit product" : "List a new affiliate product"}
                  </h3>
                  <button type="button" onClick={() => { setShowAddForm(false); resetForm(); }} style={{ background: "none", border: "none", cursor: "pointer" }}>
                    <X size={18} color={COLORS.muted} />
                  </button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
                  <FormField label="Product name">
                    <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="AuraBeat Pro Earbuds" style={inputStyle} />
                  </FormField>
                  <FormField label="Category">
                    <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} style={{...inputStyle, '& option': {background: COLORS.dusk}}}>
                      {CATEGORY_TREE.map((main) => (
                        <optgroup key={main.name} label={main.name} style={{background: COLORS.dusk}}>
                          {main.subcategories.map((s) => <option key={s.name} value={s.name}>{s.name}</option>)}
                        </optgroup>
                      ))}
                    </select>
                  </FormField>
                  <FormField label="Platform">
                    <select value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })} style={{...inputStyle, '& option': {background: COLORS.dusk}}}>
                      {PLATFORM_LIST.map((pl) => <option key={pl} value={pl} style={{background: COLORS.dusk}}>{pl}</option>)}
                    </select>
                  </FormField>
                  <FormField label="Sale price (₹)">
                    <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="1999" style={inputStyle} />
                  </FormField>
                  <FormField label="Original price (₹)">
                    <input type="number" value={form.originalPrice} onChange={(e) => setForm({ ...form, originalPrice: e.target.value })} placeholder="3499" style={inputStyle} />
                  </FormField>
                  <FormField label="Rating (out of 5)">
                    <input type="number" step="0.1" max="5" min="1" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} style={inputStyle} />
                  </FormField>
                  <FormField label="Image URL (optional)">
                    <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." style={inputStyle} />
                  </FormField>
                  <FormField label="Affiliate link">
                    <div style={{ display: "flex", gap: 8 }}>
                      <input value={form.affiliateLink} onChange={(e) => setForm({ ...form, affiliateLink: e.target.value })} placeholder="https://amazon.in/dp/..." style={{ ...inputStyle, flex: 1 }} />
                      <button
                        type="button"
                        onClick={autofillFromLink}
                        disabled={fetchingDetails}
                        className="se-btn"
                        title="Fetch name, image, price & rating from this link"
                        style={{
                          whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 5, background: "transparent",
                          border: "1.5px solid " + COLORS.ink, color: COLORS.ink, padding: "0 12px", borderRadius: 9, fontWeight: 700, fontSize: 12,
                          cursor: fetchingDetails ? "default" : "pointer", opacity: fetchingDetails ? 0.6 : 1,
                        }}
                      >
                        <Sparkles size={13} /> {fetchingDetails ? "Fetching…" : "Autofill"}
                      </button>
                    </div>
                    <p style={{ fontSize: 10.5, color: COLORS.muted, margin: "5px 0 0" }}>Paste the product link, then tap Autofill — always double-check the result before publishing.</p>
                  </FormField>
                </div>
                <button type="button" onClick={submitProduct} disabled={savingProduct} className="se-btn" style={{ marginTop: 16, background: COLORS.ink, color: COLORS.dusk, border: "none", padding: "11px 24px", borderRadius: 10, fontWeight: 700, fontSize: 13.5, cursor: savingProduct ? "default" : "pointer", opacity: savingProduct ? 0.7 : 1 }}>
                  {savingProduct ? "Saving…" : editingId ? "Save changes" : "Publish to home feed"}
                </button>
              </div>
            )}

            {/* BROWSE CATEGORIES — top-level sections, Amazon-style */}
            <div className="se-scrollx" style={{ display: "flex", gap: 8, overflowX: "auto", padding: "4px 2px 16px" }}>
              {NAV_MAIN.map((m) => {
                const MainIcon = m.icon;
                const active = activeMain === m.name;
                return (
                  <button
                    key={m.name}
                    onClick={() => selectMain(m.name)}
                    className="se-btn"
                    style={{
                      whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 999, fontSize: 12.5, fontWeight: 700, cursor: "pointer",
                      border: active ? "none" : "1px solid rgba(255,255,255,0.1)",
                      background: active ? 'linear-gradient(135deg, #00d4ff, #a855f7)' : "rgba(255,255,255,0.06)", color: "#fff",
                      backdropFilter: active ? "none" : "blur(10px)",
                    }}
                  >
                    <MainIcon size={14} />
                    {m.name}
                  </button>
                );
              })}
            </div>

            {/* SUBCATEGORY GRID — appears once a section is picked */}
            {activeMain !== "All" && (
              <div className="se-fadein se-glass" style={{ borderRadius: 16, padding: "20px 20px 8px", marginBottom: 22 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: COLORS.ink, margin: 0 }}>{activeMain}</h3>
                  {category !== "All" && (
                    <button onClick={() => setCategory("All")} className="se-btn" style={{ background: "none", border: "none", color: COLORS.orange, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                      Show all in section
                    </button>
                  )}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(96px, 1fr))", gap: 16, paddingBottom: 20 }}>
                  {CATEGORY_TREE.find((m) => m.name === activeMain).subcategories.map((sub) => {
                    const SubIcon = sub.icon;
                    const active = category === sub.name;
                    return (
                      <button
                        key={sub.name}
                        onClick={() => selectSub(sub.name)}
                        className="se-btn"
                        style={{
                          display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "8px 4px 4px",
                          background: "none", cursor: "pointer",
                          border: "1.5px solid " + (active ? COLORS.orange : "transparent"), borderRadius: 14,
                        }}
                      >
                        <div style={{ width: 54, height: 54, borderRadius: "50%", background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <SubIcon size={22} color={COLORS.orange} />
                        </div>
                        <span style={{ fontSize: 11.5, fontWeight: 700, color: COLORS.ink, textAlign: "center", lineHeight: 1.3 }}>{sub.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div id="se-grid" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <TrendingUp size={18} color={COLORS.orange} />
              <h2 style={{ fontSize: 19, fontWeight: 800, color: COLORS.ink, margin: 0 }}>
                {category !== "All" ? category : activeMain !== "All" ? activeMain : "Trending picks"}
              </h2>
              <span style={{ fontSize: 12.5, color: COLORS.muted }}>({visibleProducts.length} deals)</span>
            </div>

            {loadingProducts ? (
              <div style={{ textAlign: "center", padding: "56px 20px", color: COLORS.muted, fontSize: 13.5 }}>Loading deals…</div>
            ) : productsError ? (
              <EmptyState
                Icon={Package}
                title="Couldn't load products"
                body="We couldn't reach the server just now. Check your connection and reload the page."
                ctaLabel="Retry"
                onCta={() => window.location.reload()}
              />
            ) : visibleProducts.length === 0 ? (
              <EmptyState
                Icon={Package}
                title="No products listed yet"
                body={isAdmin ? "Click \"List a product\" above to add your first affiliate deal." : "Log in as admin to start adding affiliate products."}
                ctaLabel={isAdmin ? "List a product" : undefined}
                onCta={() => { resetForm(); setShowAddForm(true); }}
              />
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 18 }}>
                {visibleProducts.map((p, i) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    index={i}
                    inWishlist={wishlist.includes(p.id)}
                    onToggleWishlist={toggleWishlist}
                    onAddToCart={addToCart}
                    onViewDeal={viewDeal}
                    onEdit={isAdmin ? startEdit : undefined}
                    onDelete={isAdmin ? deleteProduct : undefined}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "you" && (
          <div className="se-fadein" style={{ padding: "24px 0" }}>
            <div className="se-glass" style={{ borderRadius: 20, padding: 24, display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: 'linear-gradient(135deg, #00d4ff, #a855f7)', display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "#fff", fontSize: 19 }}>SE</div>
              <div>
                <p style={{ color: "#fff", fontWeight: 800, fontSize: 17, margin: 0 }}>Hey, explorer</p>
                <p style={{ color: COLORS.muted, fontSize: 13, margin: "2px 0 0" }}>Here's how your excitement is trending.</p>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: 24 }}>
              <StatCard label="Deals clicked" value={totalClicks} />
              <StatCard label="Wishlist items" value={wishlist.length} />
              <StatCard label="Cart items" value={cartCount} />
              <StatCard label="Top platform" value={topPlatform} />
            </div>

            <h3 style={{ fontSize: 16, fontWeight: 800, color: COLORS.ink, marginBottom: 12 }}>Recent activity</h3>
            {clickHistory.length === 0 ? (
              <EmptyState
                Icon={MapPin}
                title="No activity yet"
                body="Products you open on any partner store will show up here so you can find them again."
                ctaLabel="Browse deals"
                onCta={() => setTab("home")}
              />
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
                {clickHistory.map((h) => (
                  <div key={h.id} className="se-fadein se-glass" style={{ borderRadius: 12, padding: "10px 14px", display: "flex", alignItems: "center", gap: 12 }}>
                    <img src={h.image} alt="" style={{ width: 40, height: 40, borderRadius: 8, objectFit: "cover" }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 13.5, fontWeight: 700, color: COLORS.ink, margin: 0 }}>{h.name}</p>
                      <p style={{ fontSize: 11.5, color: COLORS.muted, margin: "2px 0 0" }}>Opened on {h.platform}</p>
                    </div>
                    <ChevronRight size={16} color={COLORS.muted} />
                  </div>
                ))}
              </div>
            )}

            <h3 style={{ fontSize: 16, fontWeight: 800, color: COLORS.ink, marginBottom: 12 }}>Saved address</h3>
            <div className="se-glass" style={{ borderRadius: 14, padding: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ fontSize: 13.5, fontWeight: 700, color: COLORS.ink, margin: 0 }}>Home</p>
                <p style={{ fontSize: 12.5, color: COLORS.muted, margin: "3px 0 0" }}>Checkout happens on the retailer's site, so we just keep this for your reference.</p>
              </div>
              <button onClick={() => notify("Address book is on its way soon")} className="se-btn" style={{ background: "transparent", border: "1.5px solid " + COLORS.ink, color: COLORS.ink, padding: "8px 14px", borderRadius: 9, fontWeight: 700, fontSize: 12.5, cursor: "pointer" }}>
                Add address
              </button>
            </div>
          </div>
        )}

        {tab === "wishlist" && (
          <div className="se-fadein" style={{ padding: "24px 0" }}>
            <h2 style={{ fontSize: 19, fontWeight: 800, color: COLORS.ink, marginBottom: 4 }}>Saved for later</h2>
            <p style={{ fontSize: 13, color: COLORS.muted, marginBottom: 18 }}>The things you didn't want to forget.</p>
            {wishlistProducts.length === 0 ? (
              <EmptyState
                Icon={Heart}
                title="Nothing saved for later"
                body="Tap the heart on any product to keep it here so you don't lose track of it."
                ctaLabel="Browse deals"
                onCta={() => setTab("home")}
              />
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 18 }}>
                {wishlistProducts.map((p) => (
                  <div key={p.id} style={{ position: "relative" }}>
                    <ProductCard product={p} inWishlist={true} onToggleWishlist={toggleWishlist} onAddToCart={addToCart} onViewDeal={viewDeal} />
                    <button
                      onClick={() => moveToCart(p.id)}
                      className="se-btn"
                      style={{ marginTop: 8, width: "100%", background: 'linear-gradient(135deg, #00d4ff, #a855f7)', color: "#fff", border: "none", padding: "9px 0", borderRadius: 10, fontWeight: 700, fontSize: 12.5, cursor: "pointer" }}
                    >
                      Move to cart
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "cart" && (
          <div className="se-fadein" style={{ padding: "24px 0" }}>
            <h2 style={{ fontSize: 19, fontWeight: 800, color: COLORS.ink, marginBottom: 4 }}>Your cart</h2>
            <p style={{ fontSize: 13, color: COLORS.muted, marginBottom: 18 }}>The important stuff, shortlisted and ready.</p>
            {cartProducts.length === 0 ? (
              <EmptyState
                Icon={ShoppingCart}
                title="Your cart is quiet right now"
                body="Save something exciting from the home feed and it'll show up here."
                ctaLabel="Browse deals"
                onCta={() => setTab("home")}
              />
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 20, alignItems: "start" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {cartProducts.map(({ id, qty, product }) => (
                    <div key={id} className="se-fadein se-glass" style={{ borderRadius: 14, padding: 12, display: "flex", gap: 12, alignItems: "center" }}>
                      <img src={product.image} alt="" style={{ width: 64, height: 64, borderRadius: 10, objectFit: "cover" }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 13.5, fontWeight: 700, color: COLORS.ink, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{product.name}</p>
                        <div style={{ marginTop: 3 }}><PlatformBadge platform={product.platform} /></div>
                        <p style={{ fontSize: 14, fontWeight: 800, color: COLORS.ink, margin: "6px 0 0" }}>{formatINR(product.price)}</p>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, border: "1px solid " + COLORS.line, borderRadius: 9, padding: "4px 8px" }}>
                        <button onClick={() => changeQty(id, -1)} className="se-btn" style={{ background: "none", border: "none", cursor: "pointer", display: "flex" }}><Minus size={14} color={COLORS.ink} /></button>
                        <span style={{ fontSize: 13, fontWeight: 700, minWidth: 14, textAlign: "center" }}>{qty}</span>
                        <button onClick={() => changeQty(id, 1)} className="se-btn" style={{ background: "none", border: "none", cursor: "pointer", display: "flex" }}><Plus size={14} color={COLORS.ink} /></button>
                      </div>
                      <button onClick={() => removeFromCart(id)} className="se-btn" style={{ background: "none", border: "none", cursor: "pointer" }} aria-label="Remove">
                        <Trash2 size={17} color={COLORS.muted} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="se-glass" style={{ borderRadius: 16, padding: 20, position: "sticky", top: 90 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 800, color: COLORS.ink, margin: "0 0 14px" }}>Order summary</h3>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: COLORS.muted, marginBottom: 8 }}>
                    <span>Items ({cartCount})</span><span>{formatINR(subtotal)}</span>
                  </div>
                  <div style={{ borderTop: "1px solid " + COLORS.line, marginTop: 10, paddingTop: 10, display: "flex", justifyContent: "space-between", fontSize: 15.5, fontWeight: 800, color: COLORS.ink }}>
                    <span>Estimated total</span><span>{formatINR(subtotal)}</span>
                  </div>
                  <p style={{ fontSize: 11.5, color: COLORS.muted, margin: "10px 0 16px" }}>Checkout finishes on the retailer's site. Tap a product's link to complete your purchase there.</p>
                  <button
                    onClick={() => cartProducts.forEach(({ product }) => viewDeal(product))}
                    className="se-btn"
                    style={{ width: "100%", background: 'linear-gradient(135deg, #00d4ff, #a855f7)', color: "#fff", border: "none", padding: "12px 0", borderRadius: 11, fontWeight: 700, fontSize: 13.5, cursor: "pointer" }}
                  >
                    Continue to store links
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {toast && (
        <div className="se-pop se-glass" style={{ position: "fixed", bottom: 22, right: 22, background: "rgba(10,14,26,0.9)", color: "#fff", padding: "12px 18px", borderRadius: 12, fontSize: 13, fontWeight: 600, boxShadow: "0 10px 24px rgba(0,0,0,0.25)", border: "1px solid rgba(0,212,255,0.2)", zIndex: 60, display: "flex", alignItems: "center", gap: 8 }}>
          <Zap size={14} fill={COLORS.orange} stroke={COLORS.orange} /> {toast}
        </div>
      )}
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "9px 11px", borderRadius: 9, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.06)", fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "Inter, sans-serif", color: "#e2e8f0",
};

function FormField({ label, children }) {
  return (
    <div>
      <label style={{ fontSize: 11.5, fontWeight: 700, color: "#94a3b8", marginBottom: 5, display: "block" }}>{label}</label>
      {children}
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="se-glass" style={{ borderRadius: 14, padding: "14px 16px" }}>
      <p style={{ fontSize: 11.5, color: COLORS.muted, fontWeight: 700, margin: 0, textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</p>
      <p style={{ fontSize: 21, fontWeight: 800, color: COLORS.ink, margin: "4px 0 0" }}>{value}</p>
    </div>
  );
}
