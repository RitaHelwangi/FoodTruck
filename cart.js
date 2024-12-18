import { fetchMenuItemData } from "./api.js";

let cart = {};

export function updateCart(id) {
  cart[id] = cart[id] ? cart[id] + 1 : 1;
}

export function decrementCartItem(id) {
  if (cart[id] > 1) {
    cart[id] -= 1;
  } else {
    delete cart[id];
  }
}

export function getCartArray() {
  return Object.entries(cart).flatMap(([key, value]) =>
    Array(value).fill(Number(key))
  );
}

export async function renderCartItems(orderList) {
  orderList.innerHTML = ""; // Clear the order list before rendering
  for (const [key, value] of Object.entries(cart)) {
    const itemData = await fetchMenuItemData(key);
    renderCartItem(orderList, itemData, value);
  }
}

function renderCartItem(orderList, itemData, value) {
  const div = document.createElement("div");
  div.classList.add("order-item");
  div.setAttribute("cart-item-id", itemData.item.id);

  const h2 = document.createElement("h2");
  h2.innerHTML = `${itemData.item.name} <span class="dots"></span> ${
    itemData.item.price * value
  } SEK`;

  const p = document.createElement("p");
  p.textContent = `${value} stycken`;

  orderList.append(div);
}

export function resetCart() {
  cart = {};
}
