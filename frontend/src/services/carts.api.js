import api from "./api";
import { fetchWrapper } from "./fetchWrapper";

async function getCart() {
  return fetchWrapper(async () => {
    const res = await api.get("/carts/get-cart");
    return res.data.data;
  });
}

async function addToCart({ productId, quantity, variant }) {
  return fetchWrapper(async () => {
    const res = await api.post("/carts/add-to-cart", {
      productId,
      quantity,
      variant,
    });
    return res.data.data;
  });
}

async function updateCartItem(payload) {
  return fetchWrapper(async () => {
    const res = await api.put(`/carts/update-cart-item`, payload);
    return res.data.data;
  });
}

async function removeCartItem(itemId) {
  if (!itemId) throw new Error("itemId is required");

  return fetchWrapper(async () => {
    const res = await api.delete(`/carts/remove-cart-item/${itemId}`);
    return res.data.data;
  });
}

async function clearCart() {
  return fetchWrapper(async () => {
    const res = await api.delete("/carts/clear-cart");
    return res.data.data;
  });
}

export { getCart, addToCart, updateCartItem, removeCartItem, clearCart };
