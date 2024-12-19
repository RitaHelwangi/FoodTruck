import { renderCartItems } from "./cart.js";
import { sendOrder } from "./api.js";

export function hideAllPages() {
  const pages = [
    document.querySelector(".cart-vy"),
    document.querySelector(".eta-vy"),
    document.querySelector(".receipt-vy"),
    document.querySelector(".menu-vy"),
  ];
  pages.forEach((page) => page.classList.add("hide"));
}

export function openPage(page) {
  hideAllPages();
  page.classList.remove("hide");
}

export function openCart() {
  openPage(document.querySelector(".cart-vy"));
  renderCartItems();
}

export function openMenu() {
  openPage(document.querySelector(".menu-vy"));
  document.querySelector(".order-list").innerHTML = "";
}

export function openEta() {
  if (Object.keys(cart).length === 0) return;
  openPage(document.querySelector(".eta-vy"));
  sendOrder(cart);
}

export function openReceipt() {
  openPage(document.querySelector(".receipt-vy"));
  renderReceipt();
}

export function resetOrder() {
  cart = {};
  document.querySelector(".order-list").innerHTML = "";
  document.querySelector(".finish-order").innerHTML = "";
  updateCartNumber(cart);
  updateTotalPrice(cart);
  openMenu();
}
