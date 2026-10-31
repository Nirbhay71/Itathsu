import test from "node:test";
import assert from "node:assert/strict";
import { once } from "node:events";
import { openCatalog, getStore } from "../server/catalog.js";
import { createApp } from "../server/app.js";
import { cartKey, restoreCart, addToCart } from "../client/src/cart.js";

test("SQLite serves the configured catalogue and safe product lookups", () => {
  const catalog = openCatalog(":memory:");
  try {
    const products = catalog.all();
    assert.equal(products.length, 4);
    assert.equal(products[0].name, "Noir");
    assert.equal(catalog.get("argent").price, 12490);
    assert.equal(catalog.get("' OR 1=1 --"), null);
    assert.equal(catalog.get("missing"), null);
    assert.equal(getStore().currency, "INR");
  } finally {
    catalog.close();
  }
});
test("API returns catalogue, branding, product and real 404 responses", async () => {
  const catalog = openCatalog(":memory:");
  const server = createApp(catalog).listen(0, "127.0.0.1");
  await once(server, "listening");
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    assert.equal(
      (await (await fetch(`${base}/api/store`)).json()).name,
      "Itatshu",
    );
    assert.equal(
      (await (await fetch(`${base}/api/products`)).json()).length,
      4,
    );
    assert.equal(
      (await (await fetch(`${base}/api/products/noir`)).json()).id,
      "noir",
    );
    assert.equal((await fetch(`${base}/api/products/missing`)).status, 404);
    assert.equal((await fetch(`${base}/api/missing`)).status, 404);
  } finally {
    await new Promise((resolve) => server.close(resolve));
    catalog.close();
  }
});
test("bag merges identical selections, preserves variants and caps quantities", () => {
  const product = { id: "sample" };
  let cart = addToCart([], product, { Size: "M" }, 2);
  cart = addToCart(cart, product, { Size: "M" }, 3);
  cart = addToCart(cart, product, { Size: "L" }, 1);
  assert.equal(cart.length, 2);
  assert.equal(cart[0].quantity, 5);
  assert.equal(addToCart(cart, product, { Size: "M" }, 99)[0].quantity, 99);
  assert.equal(
    cartKey("sample", { Size: "M", Colour: "Blue" }),
    cartKey("sample", { Colour: "Blue", Size: "M" }),
  );
});
test("restoring a saved bag drops invalid entries and obsolete products", () => {
  const products = [
    { id: "sample", options: [{ name: "Size", values: ["S", "M"] }] },
  ];
  const lines = restoreCart(
    [
      null,
      { productId: "deleted", quantity: 1 },
      { productId: "sample", quantity: -2 },
      { productId: "sample", quantity: 1.5 },
      { productId: "sample", quantity: 2, options: { Size: "invalid" } },
      { productId: "sample", quantity: 3, options: { Size: "S" } },
    ],
    products,
  );
  assert.equal(lines.length, 1);
  assert.equal(lines[0].quantity, 5);
  assert.deepEqual(lines[0].options, { Size: "S" });
  assert.deepEqual(restoreCart({}, products), []);
});
