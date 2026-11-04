import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import {
  ShoppingBag,
  ChevronDown,
  Check,
  ArrowUpRight,
  ArrowRight,
} from "lucide-react";
import { addToCart, restoreCart } from "./cart.js";
import Showroom from "./components/Showroom.jsx";
import ProductDetail from "./components/ProductDetail.jsx";
import Bag from "./components/Bag.jsx";
import "./styles.css";
import "./showroom.css";

const STORAGE_KEY = "itatshu-cart-v1";
function App() {
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [path, setPath] = useState(location.pathname);
  const [category, setCategory] = useState("");
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [storageWarning, setStorageWarning] = useState(false);
  const loaded = useRef(false);
  const filters = useRef(null);
  useEffect(() => {
    let active = true;
    Promise.all(
      ["/api/store", "/api/products"].map(async (url) => {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Could not load the collection");
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
    const pop = () => {
      setPath(location.pathname);
      window.scrollTo(0, 0);
    };
    window.addEventListener("popstate", pop);
    return () => window.removeEventListener("popstate", pop);
  }, []);
  useEffect(() => {
    if (!store) return;
    const product = products.find((item) => path === `/products/${item.id}`);
    document.title = `${product ? product.name : store.name} — ${product ? store.name : store.tagline}`;
    document.querySelector('meta[name="description"]').content =
      product?.description || store.description;
    document.documentElement.style.setProperty("--accent", store.accentColor);
  }, [path, products, store]);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 3500);
    return () => clearTimeout(timer);
  }, [toast]);
  useEffect(() => {
    const close = (event) => {
      if (filters.current && !filters.current.contains(event.target))
        filters.current.open = false;
    };
    const escape = (event) => {
      if (event.key === "Escape" && filters.current)
        filters.current.open = false;
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", escape);
    };
  }, []);
  const navigate = (to) => {
    if (location.pathname === to) return;
    history.pushState({}, "", to);
    const update = () => {
      flushSync(() => setPath(to));
      window.scrollTo({ top: 0, behavior: "instant" });
    };
    if (
      document.startViewTransition &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      const transition = document.startViewTransition(update);
      transition.ready.catch(() => {});
    } else update();
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
  const selected = products.find(
    (product) => path === `/products/${product.id}`,
  );
  const visible =
    category === store?.categories[0]
      ? products
      : products.filter((product) => product.category === category);
  if (error)
    return (
      <div className="load-state">
        <span className="wordmark">ITATSHU</span>
        <p>{error}</p>
        <button className="primary" onClick={() => location.reload()}>
          Try again <ArrowRight size={15} />
        </button>
      </div>
    );
  if (!store)
    return (
      <div className="load-state">
        <span className="wordmark">ITATSHU</span>
        <div className="loading-line" />
        <p>Entering the collection</p>
      </div>
    );
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="header">
        <a
          href="/"
          className="brand-lockup"
          onClick={(event) => follow(event, "/")}
          aria-label={`${store.name} home`}
        >
          <span className="wordmark">{store.wordmark}</span>
          <span className="brand-descriptor">{store.tagline}</span>
        </a>
        <details className="collection-switcher" ref={filters}>
          <summary>
            <span className="collection-status" />
            {path === "/"
              ? category === store.categories[0]
                ? "The collection"
                : category
              : "Collection 01"}
            <ChevronDown size={11} />
          </summary>
          <nav className="category-menu" aria-label="Filter collection">
            {store.categories.map((item) => (
              <button
                key={item}
                aria-label={item}
                aria-pressed={category === item}
                onClick={() => {
                  setCategory(item);
                  filters.current.open = false;
                  navigate("/");
                }}
              >
                {item}
                {category === item && <Check size={12} />}
              </button>
            ))}
          </nav>
        </details>
        <button
          className="bag-button"
          aria-label={`Open shopping bag, ${count} items`}
          onClick={() => setCartOpen(true)}
        >
          <ShoppingBag size={15} strokeWidth={1.3} />
          <span>Bag</span>
          <span className="bag-count">({String(count).padStart(2, "0")})</span>
        </button>
      </header>
      <main id="main" tabIndex={-1}>
        {path === "/" ? (
          <Showroom
            store={store}
            products={visible}
            allProducts={products}
            money={money}
            follow={follow}
          />
        ) : selected ? (
          <ProductDetail
            key={selected.id}
            product={selected}
            products={products}
            money={money}
            add={add}
            follow={follow}
          />
        ) : (
          <section className="not-found">
            <span className="eyebrow">404 / OUTSIDE THE COLLECTION</span>
            <h1>A different direction.</h1>
            <p>We couldn't find that page.</p>
            <a
              className="primary"
              href="/"
              onClick={(event) => follow(event, "/")}
            >
              Return to the collection <ArrowRight size={15} />
            </a>
          </section>
        )}
      </main>
      <Bag
        open={cartOpen}
        close={() => setCartOpen(false)}
        lines={cart}
        setLines={setCart}
        products={products}
        money={money}
        followProduct={navigate}
        storageWarning={storageWarning}
      />
      <div
        className={`toast ${toast ? "visible" : ""}`}
        role="status"
        aria-live="polite"
      >
        {toast && (
          <>
            <Check size={15} />
            <span>{toast}</span>
            <button
              onClick={() => {
                setToast("");
                setCartOpen(true);
              }}
            >
              View bag <ArrowUpRight size={12} />
            </button>
          </>
        )}
      </div>
    </>
  );
}
createRoot(document.getElementById("root")).render(<App />);
