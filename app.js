import { fetchMenuData, sendOrder, fetchReceipt } from "./api.js";
import { updateCartNumber, updateTotalPrice, renderCartItems } from "./cart.js";
import {
  openCart,
  openMenu,
  openEta,
  openReceipt,
  resetOrder,
} from "./toggle.js";

let cart = {};
let getOrderId = "";

// DOM Elements
const menuVy = document.querySelector(".menu-vy");
const cartVy = document.querySelector(".cart-vy");
const etaVy = document.querySelector(".eta-vy");
const receiptVy = document.querySelector(".receipt-vy");
const orderList = document.querySelector(".order-list");

async function fetchAllData() {
  const [wontonData, dipData, drinkData] = await Promise.all([
    fetchMenuData("wonton"),
    fetchMenuData("dip"),
    fetchMenuData("drink"),
  ]);
  return { wontonData, dipData, drinkData };
}

// Initialize menu
function createMenuItem(food) {
  const div = document.createElement("div");
  div.classList.add("item");
  div.setAttribute("orderId", food.id);

  const h2 = document.createElement("h2");
  h2.innerHTML = `${food.name} <span class="dots"></span> ${food.price} SEK`;

  const p = document.createElement("p");
  p.textContent = food.ingredients.join(", ");

  div.append(h2, p);
  document.querySelector(".menu").append(div);
}

// Event listeners for navigation and actions
function addEventListeners() {
  document.querySelector(".cart-menu").addEventListener("click", openCart);
  document.querySelector(".home").addEventListener("click", openMenu);
  document.querySelector("#order").addEventListener("click", openEta);
  document
    .querySelector(".menu")
    .addEventListener("click", handleMenuItemClick);
  document
    .querySelector(".dips-btn")
    .addEventListener("click", handleMenuItemClick);
  document
    .querySelector(".drinks-btn")
    .addEventListener("click", handleMenuItemClick);
  document.querySelector(".fade-btn").addEventListener("click", openReceipt);
  document.querySelectorAll(".new-order").forEach((button) => {
    button.addEventListener("click", resetOrder);
  });
}

function handleMenuItemClick(event) {
  const item = event.target.closest("[orderId]");
  if (item) {
    const itemId = item.getAttribute("orderId");
    cart[itemId] = cart[itemId] ? cart[itemId] + 1 : 1;
    updateCartNumber(cart);
    updateTotalPrice(cart);
  }
}

// Initialize everything
async function init() {
  const { wontonData, dipData, drinkData } = await fetchAllData();
  wontonData.items.forEach(createMenuItem);
  dipData.items.forEach((item) =>
    createDipOrDrinkList(item, document.querySelector(".dips-btn"))
  );
  drinkData.items.forEach((item) =>
    createDipOrDrinkList(item, document.querySelector(".drinks-btn"))
  );
  addEventListeners();
}

init();
