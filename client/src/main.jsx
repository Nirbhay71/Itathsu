import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowUpRight,
  ArrowRight,
  ArrowLeft,
  ShoppingBag,
  X,
  Plus,
  Minus,
  Check,
  ChevronDown,
  MoveUpRight,
} from "lucide-react";
import { addToCart, restoreCart, MAX_QUANTITY } from "./cart.js";
import "./styles.css";

const STORAGE_KEY = "itatshu-cart-v1";
function WatchPlaceholder({ product }) {
  const index = [
    "noir",
    "argent",
    "meridian",
    "sable",
    "atlas",
    "aube",
  ].indexOf(product.id);
  const uid = React.useId().replace(/:/g, "");
  const leather = index === 0 || index === 4;
  const silver = index === 1 || index === 2 || index === 5;
  const face = index === 5 ? "#d8d4c8" : index === 4 ? "#142631" : "#171b1b";
  const ink = index === 5 ? "#46463e" : "#cec9ba";
  const radius = index === 2 || index === 4 ? 64 : 60;
  return (
    <svg
      className="watch-placeholder"
      viewBox="0 0 260 420"
      role="img"
      aria-label={`${product.name}: temporary watch illustration; product photo to be supplied`}
    >
      <defs>
        <linearGradient id={`metal${uid}`} x1="0" x2="1">
          <stop stopColor={silver ? "#747b7c" : "#745c38"} />
          <stop offset=".22" stopColor={silver ? "#e2e4df" : "#d7bb80"} />
          <stop offset=".48" stopColor={silver ? "#8b9494" : "#9c8054"} />
          <stop offset=".73" stopColor={silver ? "#f1f0e8" : "#e7cd98"} />
          <stop offset="1" stopColor={silver ? "#717a7b" : "#75603f"} />
        </linearGradient>
        <linearGradient id={`strap${uid}`} x1="0" x2="1">
          <stop stopColor={leather ? "#33251e" : "#50575a"} />
          <stop offset=".45" stopColor={leather ? "#654734" : "#a3aaab"} />
          <stop offset="1" stopColor={leather ? "#33251e" : "#51595a"} />
        </linearGradient>
        <radialGradient id={`glass${uid}`} cx=".3" cy=".1" r="1">
          <stop stopColor="white" stopOpacity=".12" />
          <stop offset=".65" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <filter
          id={`shadow${uid}`}
          x="-100%"
          y="-30%"
          width="300%"
          height="170%"
        >
          <feDropShadow dx="9" dy="14" stdDeviation="12" floodOpacity=".65" />
        </filter>
      </defs>
      <g filter={`url(#shadow${uid})`}>
        <rect
          x="97"
          y="28"
          width="66"
          height="364"
          rx="13"
          fill={`url(#strap${uid})`}
        />
        {leather ? (
          <>
            <rect
              x="104"
              y="36"
              width="52"
              height="349"
              rx="8"
              stroke="#9a7250"
              strokeOpacity=".55"
              strokeDasharray="2 4"
              fill="none"
            />
            {[0, 1, 2, 3, 4].map((n) => (
              <rect
                key={n}
                x="128"
                y={303 + n * 13}
                width="4"
                height="5"
                rx="2"
                fill="#201a16"
              />
            ))}
          </>
        ) : (
          Array.from({ length: 24 }, (_, n) => (
            <g key={n}>
              <path
                d={`M98 ${35 + n * 15}h64`}
                stroke="#252b2b"
                strokeOpacity=".7"
              />
              <path
                d={`M113 ${35 + n * 15}v14m34-14v14`}
                stroke="#323b3a"
                strokeOpacity=".6"
              />
            </g>
          ))
        )}
        <path
          d="M94 141l-5 24h82l-5-24M94 279l-5-24h82l-5 24"
          fill={`url(#metal${uid})`}
        />
        <rect
          x="191"
          y="204"
          width="12"
          height="17"
          rx="3"
          fill={`url(#metal${uid})`}
        />
        <circle cx="130" cy="210" r={radius + 7} fill={`url(#metal${uid})`} />
        <circle
          cx="130"
          cy="210"
          r={radius + 1}
          stroke="#171b19"
          strokeWidth="2"
          fill={`url(#metal${uid})`}
        />
        <circle cx="130" cy="210" r={radius - 4} fill={face} />
        {Array.from({ length: 60 }, (_, n) => (
          <line
            key={n}
            x1="130"
            y1={210 - radius + 8}
            x2="130"
            y2={210 - radius + (n % 5 === 0 ? 17 : 11)}
            transform={`rotate(${n * 6} 130 210)`}
            stroke={ink}
            strokeWidth={n % 5 === 0 ? 2 : 0.65}
            opacity={n % 5 === 0 ? 1 : 0.5}
          />
        ))}
        <text
          x="130"
          y="188"
          textAnchor="middle"
          fontSize="6"
          letterSpacing="2"
          fill={ink}
        >
          PHOTO
        </text>
        <text
          x="130"
          y="238"
          textAnchor="middle"
          fontSize="4.5"
          letterSpacing="1.1"
          fill={ink}
        >
          PLACEHOLDER
        </text>
        {(index === 2 || index === 4) && (
          <>
            {[104, 156].map((x) => (
              <g key={x}>
                <circle
                  cx={x}
                  cy="213"
                  r="13"
                  fill="none"
                  stroke={ink}
                  strokeOpacity=".4"
                />
                <path d={`M${x} 203v11l5 3`} stroke={ink} fill="none" />
              </g>
            ))}
          </>
        )}
        <path
          d="M130 210l-23-25M130 210l30-24"
          stroke={ink}
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path d="M121 238l18-55" stroke="#ad8660" strokeWidth="1" />
        <circle cx="130" cy="210" r="3.5" fill={ink} />
        <circle cx="130" cy="210" r={radius - 4} fill={`url(#glass${uid})`} />
      </g>
    </svg>
  );
}

function ProductVisual({ product, className = "" }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [product.image]);
  return (
    <div
      className={`product-visual ${className}`}
      style={{ "--piece-tone": product.tone || "#a6aaa4" }}
    >
      {product.image && !failed ? (
        <img
          src={product.image}
          alt={product.name}
          style={{ objectPosition: product.imagePosition || "center" }}
          onError={() => setFailed(true)}
          loading="lazy"
        />
      ) : (
        <WatchPlaceholder product={product} />
      )}
      {(!product.image || failed) && (
        <span className="placeholder-note">
          {failed
            ? "Photo unavailable · Preview illustration"
            : "Photo placeholder"}
        </span>
      )}
    </div>
  );
}
function Quantity({ value, onChange, label = "Quantity" }) {
  return (
    <div className="quantity" role="group" aria-label={label}>
      <button
        aria-label={`Decrease ${label.toLowerCase()}`}
        disabled={value <= 1}
        onClick={() => onChange(value - 1)}
      >
        <Minus size={14} />
      </button>
      <span aria-live="polite">{value}</span>
      <button
        aria-label={`Increase ${label.toLowerCase()}`}
        disabled={value >= MAX_QUANTITY}
        onClick={() => onChange(value + 1)}
      >
        <Plus size={14} />
      </button>
    </div>
  );
}

function App() {
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [path, setPath] = useState(location.pathname);
  const [category, setCategory] = useState("All pieces");
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [storageWarning, setStorageWarning] = useState(false);
  const dialog = useRef(null);
  const shelf = useRef(null);
  const closeButton = useRef(null);
  const loaded = useRef(false);
  useEffect(() => {
    let active = true;
    Promise.all(
      ["/api/store", "/api/products"].map(async (url) => {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Could not load the collection.");
        return response.json();
      }),
    )
      .then(([brand, items]) => {
        if (!active) return;
        setStore(brand);
        setProducts(items);
        setCategory(brand.categories[0]);
        try {
          setCart(
            restoreCart(
              JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"),
              items,
            ),
          );
        } catch {
          setCart([]);
        }
        loaded.current = true;
      })
      .catch(() => {
        if (active)
          setError("The collection could not be loaded. Please try again.");
      });
    return () => {
      active = false;
    };
  }, []);
  useEffect(() => {
    if (!loaded.current) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch {
      setStorageWarning(true);
    }
  }, [cart]);
  useEffect(() => {
    const listener = () => {
      setPath(location.pathname);
      window.scrollTo(0, 0);
    };
    window.addEventListener("popstate", listener);
    return () => window.removeEventListener("popstate", listener);
  }, []);
  useEffect(() => {
    if (!store) return;
    const selected = products.find((p) => path === `/products/${p.id}`);
    document.title = selected
      ? `${selected.name} — ${store.name}`
      : `${store.name} — ${store.tagline}`;
    document.documentElement.style.setProperty("--accent", store.accentColor);
    document.querySelector('meta[name="description"]').content = selected
      ? selected.description
      : store.description;
  }, [store, path, products]);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 3000);
    return () => clearTimeout(timer);
  }, [toast]);
  useEffect(() => {
    if (!dialog.current) return;
    if (cartOpen) {
      dialog.current.showModal();
      document.body.style.overflow = "hidden";
    } else {
      dialog.current.close();
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [cartOpen]);
  const navigate = (to) => {
    if (location.pathname !== to) history.pushState({}, "", to);
    setPath(to);
    window.scrollTo({ top: 0, behavior: "instant" });
  };
  const follow = (event, to) => {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return;
    event.preventDefault();
    navigate(to);
  };
  const collection = () => {
    if (path !== "/") {
      navigate("/");
      setTimeout(
        () =>
          document
            .getElementById("collection")
            ?.scrollIntoView({ behavior: "smooth" }),
        50,
      );
    } else
      document
        .getElementById("collection")
        ?.scrollIntoView({ behavior: "smooth" });
  };
  const add = (product, options, quantity) => {
    setCart((lines) => addToCart(lines, product, options, quantity));
    setToast(`${product.name} added to your bag`);
  };
  const money = (value) =>
    new Intl.NumberFormat(store?.locale || "en-IN", {
      style: "currency",
      currency: store?.currency || "INR",
      maximumFractionDigits: 0,
    }).format(value);
  const count = cart.reduce((sum, line) => sum + line.quantity, 0);
  const total = cart.reduce(
    (sum, line) =>
      sum +
      (products.find((p) => p.id === line.productId)?.price || 0) *
        line.quantity,
    0,
  );
  const selected = products.find((p) => path === `/products/${p.id}`);
  const visible =
    category === store?.categories[0]
      ? products
      : products.filter((p) => p.category === category);
  if (error)
    return (
      <div className="load-state">
        <span className="loading-wordmark">ITATSHU</span>
        <p>{error}</p>
        <button className="primary" onClick={() => location.reload()}>
          Try again <ArrowRight size={16} />
        </button>
      </div>
    );
  if (!store)
    return (
      <div className="load-state">
        <span className="loading-wordmark">ITATSHU</span>
        <span className="loading-line" />
        <p>Opening the collection</p>
      </div>
    );
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="announcement">
        <span className="status-dot" /> An independent perspective on time{" "}
        <span className="announcement-right">
          Designed to be discovered <ArrowUpRight size={12} />
        </span>
      </div>
      <header className="header">
        <a
          href="/"
          className="wordmark"
          aria-label={`${store.name} home`}
          onClick={(e) => follow(e, "/")}
        >
          {store.wordmark}
          <span>®</span>
        </a>
        <nav aria-label="Main navigation">
          <button
            className={path === "/" ? "nav-link active" : "nav-link"}
            onClick={collection}
          >
            Collection
          </button>
          <a
            className="nav-link story-link"
            href="/#story"
            onClick={(e) => {
              e.preventDefault();
              if (path !== "/") navigate("/");
              setTimeout(
                () =>
                  document
                    .getElementById("story")
                    ?.scrollIntoView({ behavior: "smooth" }),
                50,
              );
            }}
          >
            Our perspective <ArrowUpRight size={12} />
          </a>
        </nav>
        <button
          className="bag-button"
          onClick={() => setCartOpen(true)}
          aria-label={`Open shopping bag, ${count} items`}
        >
          <ShoppingBag size={17} strokeWidth={1.4} />
          <span>Bag</span>
          <span className="bag-count">{count.toString().padStart(2, "0")}</span>
        </button>
      </header>
      <main id="main" tabIndex="-1">
        {path === "/" ? (
          <>
            <section className="intro">
              <div>
                <div className="eyebrow">
                  <span className="tiny-line" />
                  {store.collectionLabel}
                </div>
                <h1>
                  {store.heroTitle[0]}
                  <br />
                  <em>{store.heroTitle[1]}</em>
                </h1>
              </div>
              <div className="intro-side">
                <span className="edition">{store.edition}</span>
                <p>{store.heroDescription}</p>
                <button className="text-link" onClick={collection}>
                  Find your piece <ArrowDownIcon />
                </button>
              </div>
            </section>
            <section
              id="collection"
              className="collection"
              aria-labelledby="collection-title"
            >
              <div className="collection-toolbar">
                <h2 id="collection-title" className="sr-only">
                  Explore the collection
                </h2>
                <div className="filters" aria-label="Filter collection">
                  {store.categories.map((c) => (
                    <button
                      key={c}
                      aria-pressed={category === c}
                      className={category === c ? "filter selected" : "filter"}
                      onClick={() => {
                        setCategory(c);
                        shelf.current?.scrollTo({ left: 0 });
                      }}
                    >
                      {c}
                      {c === store.categories[0] && (
                        <span>
                          {products.length.toString().padStart(2, "0")}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
                <span className="swipe-hint">
                  Scroll to discover <ArrowRight size={13} />
                </span>
              </div>
              <div className="shelf" ref={shelf}>
                {visible.map((p, i) => (
                  <article
                    className="piece"
                    key={p.id}
                    style={{
                      "--piece-tone": p.tone,
                      "--piece-delay": `${i * 65}ms`,
                    }}
                  >
                    <a
                      href={`/products/${p.id}`}
                      onClick={(e) => follow(e, `/products/${p.id}`)}
                      className="piece-link"
                      aria-label={`Discover ${p.name}, ${money(p.price)}`}
                    >
                      <div className="niche">
                        <div className="spotlight" />
                        <div className="niche-top">
                          <span>
                            {String(products.indexOf(p) + 1).padStart(2, "0")} /{" "}
                            {String(products.length).padStart(2, "0")}
                          </span>
                          <span className="piece-tag">{p.tag}</span>
                        </div>
                        <ProductVisual product={p} />
                        <div className="plinth" />
                        <span className="discover-circle">
                          <MoveUpRight size={20} strokeWidth={1} />
                        </span>
                      </div>
                      <div className="piece-info">
                        <div>
                          <h3>{p.name}</h3>
                          <p>{p.subtitle}</p>
                        </div>
                        <span className="price">{money(p.price)}</span>
                      </div>
                    </a>
                  </article>
                ))}
              </div>
              {!visible.length && (
                <p className="empty-filter">
                  No pieces in this collection yet.
                </p>
              )}
              <div className="shelf-footer">
                <span>
                  <span className="status-dot" />{" "}
                  {visible.length.toString().padStart(2, "0")} pieces.
                  Individual by nature.
                </span>
                <div className="shelf-arrows">
                  <button
                    aria-label="Previous pieces"
                    onClick={() =>
                      shelf.current.scrollBy({
                        left: -shelf.current.clientWidth * 0.8,
                        behavior: "smooth",
                      })
                    }
                  >
                    <ArrowLeft size={17} />
                  </button>
                  <button
                    aria-label="Next pieces"
                    onClick={() =>
                      shelf.current.scrollBy({
                        left: shelf.current.clientWidth * 0.8,
                        behavior: "smooth",
                      })
                    }
                  >
                    <ArrowRight size={17} />
                  </button>
                </div>
              </div>
            </section>
            <section className="perspective" id="story">
              <span className="eyebrow">The {store.name} perspective</span>
              <h2>{store.storyTitle}</h2>
              <div>
                <p>{store.storyDescription}</p>
                <span className="small-caps">
                  Objects of character. Yours to define.
                </span>
              </div>
            </section>
          </>
        ) : selected ? (
          <ProductDetail
            key={selected.id}
            product={selected}
            store={store}
            money={money}
            add={add}
            collection={collection}
          />
        ) : (
          <section className="not-found">
            <span className="eyebrow">404 / Not in this collection</span>
            <h1>A different direction.</h1>
            <p>We couldn't find that page.</p>
            <button className="primary" onClick={() => navigate("/")}>
              Explore the collection <ArrowRight size={16} />
            </button>
          </section>
        )}
      </main>
      <footer>
        <a href="/" className="footer-brand" onClick={(e) => follow(e, "/")}>
          {store.wordmark}
        </a>
        <span>{store.tagline}</span>
        <span className="demo-notice">{store.demoNotice}</span>
        <span>
          © {new Date().getFullYear()} {store.name}
        </span>
      </footer>
      <dialog
        ref={dialog}
        className="cart-dialog"
        aria-labelledby="bag-title"
        onCancel={() => setCartOpen(false)}
        onClose={() => setCartOpen(false)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setCartOpen(false);
        }}
      >
        <div className="cart-panel">
          <div className="cart-header">
            <div>
              <span className="eyebrow">Your selection</span>
              <h2 id="bag-title">
                The bag <span>({count})</span>
              </h2>
            </div>
            <button
              ref={closeButton}
              className="icon-button"
              aria-label="Close shopping bag"
              onClick={() => setCartOpen(false)}
            >
              <X size={22} />
            </button>
          </div>
          {cart.length ? (
            <>
              <div className="cart-items">
                {cart.map((line) => {
                  const p = products.find((p) => p.id === line.productId);
                  return (
                    <div className="cart-line" key={line.key}>
                      <button
                        className="cart-image"
                        aria-label={`View ${p.name}`}
                        onClick={() => {
                          setCartOpen(false);
                          navigate(`/products/${p.id}`);
                        }}
                      >
                        <ProductVisual product={p} />
                      </button>
                      <div className="cart-line-info">
                        <div className="line-heading">
                          <h3>{p.name}</h3>
                          <span>{money(p.price * line.quantity)}</span>
                        </div>
                        <p>
                          {Object.entries(line.options)
                            .map(([key, value]) => `${key}: ${value}`)
                            .join(" · ")}
                        </p>
                        <div className="line-actions">
                          <Quantity
                            label={`${p.name} quantity`}
                            value={line.quantity}
                            onChange={(quantity) =>
                              setCart((lines) =>
                                lines.map((l) =>
                                  l.key === line.key ? { ...l, quantity } : l,
                                ),
                              )
                            }
                          />
                          <button
                            className="remove-link"
                            aria-label={`Remove ${p.name} from bag`}
                            onClick={() =>
                              setCart((lines) =>
                                lines.filter((l) => l.key !== line.key),
                              )
                            }
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="cart-summary">
                <div className="subtotal">
                  <span>Subtotal</span>
                  <strong>{money(total)}</strong>
                </div>
                <p>
                  This is a preview store. Checkout and payments will be added
                  later.
                </p>
                {storageWarning && (
                  <p role="status">
                    Your browser couldn't save the bag. It will last for this
                    visit.
                  </p>
                )}
                <button
                  className="primary"
                  onClick={() => {
                    setCartOpen(false);
                    collection();
                  }}
                >
                  Continue exploring <ArrowRight size={17} />
                </button>
              </div>
            </>
          ) : (
            <div className="empty-bag">
              <ShoppingBag size={44} strokeWidth={0.7} />
              <h3>A little room for something special.</h3>
              <p>Your bag is waiting for its first piece.</p>
              <button
                className="primary"
                onClick={() => {
                  setCartOpen(false);
                  collection();
                }}
              >
                Discover the collection <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      </dialog>
      <div
        className={`toast ${toast ? "visible" : ""}`}
        role="status"
        aria-live="polite"
      >
        {toast && (
          <>
            <Check size={16} />
            <span>{toast}</span>
            <button
              onClick={() => {
                setToast("");
                setCartOpen(true);
              }}
            >
              View bag <ArrowUpRight size={13} />
            </button>
          </>
        )}
      </div>
    </>
  );
}
function ArrowDownIcon() {
  return <ArrowRight className="down-arrow" size={16} />;
}
function ProductDetail({ product, store, money, add, collection }) {
  const [options, setOptions] = useState(
    Object.fromEntries(
      (product.options || []).map((option) => [option.name, option.values[0]]),
    ),
  );
  const [quantity, setQuantity] = useState(1);
  const [expanded, setExpanded] = useState("details");
  const [zoom, setZoom] = useState(false);
  return (
    <section className="detail-page">
      <button className="back-link" onClick={collection}>
        <ArrowLeft size={14} /> Back to collection
      </button>
      <div className="detail-grid">
        <div
          className={`detail-stage ${zoom ? "zoomed" : ""}`}
          style={{ "--piece-tone": product.tone }}
        >
          <div className="detail-stage-top">
            <span className="eyebrow">
              {store.wordmark} / {product.category}
            </span>
            <span className="piece-tag">{product.tag}</span>
          </div>
          <div className="spotlight" />
          <ProductVisual product={product} />
          <div className="plinth" />
          <button
            className="zoom-button"
            onClick={() => setZoom((z) => !z)}
            aria-label={zoom ? "Zoom out of product" : "Zoom into product"}
            aria-pressed={zoom}
          >
            {zoom ? <Minus size={18} /> : <Plus size={18} />}
          </button>
          <span className="stage-caption">
            A closer look. A different perspective.
          </span>
        </div>
        <div className="detail-content">
          <div className="eyebrow">
            {product.category} / {store.edition}
          </div>
          <h1>{product.name}</h1>
          <p className="detail-subtitle">{product.subtitle}</p>
          <div className="detail-price">
            {money(product.price)}
            <span>Sample price · INR</span>
          </div>
          <p className="detail-description">{product.description}</p>
          {(product.options || []).map((option) => (
            <fieldset className="option-group" key={option.name}>
              <legend>
                {option.name} <span>— {options[option.name]}</span>
              </legend>
              <div className="option-values">
                {option.values.map((value) => (
                  <button
                    key={value}
                    aria-pressed={options[option.name] === value}
                    className={
                      options[option.name] === value
                        ? "option chosen"
                        : "option"
                    }
                    onClick={() =>
                      setOptions({ ...options, [option.name]: value })
                    }
                  >
                    {value}
                    {options[option.name] === value && <Check size={13} />}
                  </button>
                ))}
              </div>
            </fieldset>
          ))}
          <div className="buy-row">
            <Quantity value={quantity} onChange={setQuantity} />
            <button
              className="primary"
              onClick={() => add(product, options, quantity)}
            >
              Add to bag <Plus size={17} />
            </button>
          </div>
          <p className="purchase-note">
            <span className="status-dot" /> Explore freely. Checkout is coming
            later.
          </p>
          <div className="accordions">
            <div className="accordion">
              <button
                aria-expanded={expanded === "details"}
                onClick={() =>
                  setExpanded(expanded === "details" ? "" : "details")
                }
              >
                The details <ChevronDown size={16} />
              </button>
              {expanded === "details" && (
                <dl>
                  {Object.entries(product.specifications || {}).map(
                    ([key, value]) => (
                      <div key={key}>
                        <dt>{key}</dt>
                        <dd>{value}</dd>
                      </div>
                    ),
                  )}
                  <p className="spec-note">
                    Illustrative specifications for this concept catalogue.
                  </p>
                </dl>
              )}
            </div>
            <div className="accordion">
              <button
                aria-expanded={expanded === "preview"}
                onClick={() =>
                  setExpanded(expanded === "preview" ? "" : "preview")
                }
              >
                About this preview <ChevronDown size={16} />
              </button>
              {expanded === "preview" && (
                <p>
                  This concept store lets you browse products, select options
                  and save a bag on this device. This preview uses photographs
                  supplied by the store owner. Delivery, payments and purchasing
                  are not enabled.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
createRoot(document.getElementById("root")).render(<App />);
