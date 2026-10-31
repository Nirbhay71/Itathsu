export const MAX_QUANTITY = 99;
export function cartKey(id, options = {}) { return JSON.stringify([id, Object.entries(options).sort(([a], [b]) => a.localeCompare(b))]); }
export function restoreCart(value, products) {
  if (!Array.isArray(value)) return [];
  const result = [];
  for (const line of value.slice(0, 100)) {
    if (!line || typeof line !== 'object') continue;
    const product = products.find(p => p.id === line.productId);
    if (!product || !Number.isInteger(line.quantity) || line.quantity < 1) continue;
    const options = {};
    for (const option of product.options || []) options[option.name] = option.values.includes(line.options?.[option.name]) ? line.options[option.name] : option.values[0];
    const key = cartKey(product.id, options);
    const existing = result.find(item => item.key === key);
    if (existing) existing.quantity = Math.min(MAX_QUANTITY, existing.quantity + line.quantity);
    else result.push({ key, productId: product.id, options, quantity: Math.min(MAX_QUANTITY, line.quantity) });
  }
  return result;
}
export function addToCart(lines, product, options, quantity) {
  const key = cartKey(product.id, options);
  const existing = lines.find(line => line.key === key);
  if (existing) return lines.map(line => line.key === key ? { ...line, quantity: Math.min(MAX_QUANTITY, line.quantity + quantity) } : line);
  return [...lines, { key, productId: product.id, options, quantity: Math.min(MAX_QUANTITY, quantity) }];
}
