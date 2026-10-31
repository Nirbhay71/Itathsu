import React, { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Plus,
  Minus,
  Check,
  Image,
  Focus,
} from "lucide-react";
import { Chamber } from "./ProductArtwork.jsx";

export function Quantity({ value, onChange, label = "Quantity" }) {
  return (
    <div className="quantity" role="group" aria-label={label}>
      <button
        aria-label={`Decrease ${label.toLowerCase()}`}
        disabled={value <= 1}
        onClick={() => onChange(value - 1)}
      >
        <Minus size={13} />
      </button>
      <span aria-live="polite">{value}</span>
      <button
        aria-label={`Increase ${label.toLowerCase()}`}
        disabled={value >= 99}
        onClick={() => onChange(value + 1)}
      >
        <Plus size={13} />
      </button>
    </div>
  );
}

export default function ProductDetail({
  product,
  products,
  money,
  add,
  follow,
}) {
  const [quantity, setQuantity] = useState(1);
  const [original, setOriginal] = useState(false);
  const [options, setOptions] = useState(
    Object.fromEntries(
      (product.options || []).map((option) => [option.name, option.values[0]]),
    ),
  );
  const current = products.findIndex((item) => item.id === product.id);
  const next = products[(current + 1) % products.length];
  const previous = products[(current + products.length - 1) % products.length];
  return (
    <section className="product-room" aria-labelledby="product-title">
      <a className="back-link" href="/" onClick={(event) => follow(event, "/")}>
        <ArrowLeft size={13} /> Back to collection
      </a>
      <div className="product-copy">
        <div className="eyebrow">THE COLLECTION / {product.category}</div>
        <h1 id="product-title">{product.name}</h1>
        <p className="product-subtitle">{product.subtitle}</p>
        <div className="fine-rule" />
        <p className="product-description">{product.description}</p>
        <dl className="specifications">
          {Object.entries(product.specifications || {}).map(([key, value]) => (
            <div key={key}>
              <dt>{key}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
        <div className="product-price">
          {money(product.price)}
          <span>Illustrative price</span>
        </div>
        {(product.options || []).map((option) => (
          <fieldset className="option-group" key={option.name}>
            <legend>{option.name}</legend>
            <div className="option-values">
              {option.values.map((value) => (
                <button
                  className={`option ${options[option.name] === value ? "chosen" : ""}`}
                  key={value}
                  aria-pressed={options[option.name] === value}
                  onClick={() =>
                    setOptions({ ...options, [option.name]: value })
                  }
                >
                  {value}
                  {options[option.name] === value && <Check size={11} />}
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
            Add to bag <Plus size={14} />
          </button>
        </div>
        <p className="preview-note">
          Concept catalogue. Checkout is not enabled.
        </p>
      </div>
      <Chamber
        product={product}
        className="focus-chamber"
        original={original}
        transition
      >
        <span className="focus-number">
          {String(current + 1).padStart(2, "0")} /{" "}
          {String(products.length).padStart(2, "0")}
        </span>
        <button
          className="photo-toggle"
          aria-pressed={original}
          onClick={() => setOriginal(!original)}
          aria-label={
            original ? "View showroom cutout" : "View original photograph"
          }
        >
          {original ? <Focus size={15} /> : <Image size={15} />}
          <span>{original ? "Showroom" : "Original photo"}</span>
        </button>
      </Chamber>
      <div className="piece-navigation">
        <span className="eyebrow">CONTINUE EXPLORING</span>
        <a
          href={`/products/${next.id}`}
          onClick={(event) => follow(event, `/products/${next.id}`)}
          className="next-piece"
        >
          <span>Next piece</span>
          <strong>{next.name}</strong>
          <ArrowRight size={20} />
        </a>
        <div className="detail-arrows">
          <a
            aria-label={`Previous piece, ${previous.name}`}
            href={`/products/${previous.id}`}
            onClick={(event) => follow(event, `/products/${previous.id}`)}
          >
            <ArrowLeft size={15} />
          </a>
          <a
            aria-label={`Next piece, ${next.name}`}
            href={`/products/${next.id}`}
            onClick={(event) => follow(event, `/products/${next.id}`)}
          >
            <ArrowRight size={15} />
          </a>
        </div>
      </div>
      <div className="product-room-floor" aria-hidden="true" />
    </section>
  );
}
