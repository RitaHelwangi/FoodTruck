const key = "yum-7BTxHCyHhzIME5TI";
const tenant = { id: "m3z7", name: "Rita" };
const options = {
  method: "GET",
  headers: {
    "Content-Type": "application/json",

    "x-zocom": key,
  },
};
const url = "https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com/menu";

let cart = {};
let getOrderId = "";

// DOM Elements
const menuVy = document.querySelector(".menu-vy");
const cartVy = document.querySelector(".cart-vy");
const etaVy = document.querySelector(".eta-vy");
const receiptVy = document.querySelector(".receipt-vy");
const orderList = document.querySelector(".order-list");
const numberOfItemInCart = document.querySelector(".note-cart");
const totalPriceDisplay = document.querySelector(".total-price");
const finishOrder = document.querySelector(".finish-order");

// Fetch data from API
async function fetchMenuData(type) {
  const response = await fetch(`${url}?type=${type}`, options);
  return await response.json();
}

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

// Create dip or drink list
function createDipOrDrinkList(type, container) {
  const button = document.createElement("button");
  button.setAttribute("orderId", type.id);
  button.textContent = type.name;
  container.append(button);
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

// Toggle visibility of pages
function hideAllPages() {
  [cartVy, etaVy, receiptVy, menuVy].forEach((page) =>
    page.classList.add("hide")
  );
}

function openPage(page) {
  hideAllPages();
  page.classList.remove("hide");
}

// Handle navigation actions
function openCart() {
  openPage(cartVy);
  renderCartItems();
}

function openMenu() {
  openPage(menuVy);
  orderList.innerHTML = "";
}

function openEta() {
  if (Object.keys(cart).length === 0) return;
  openPage(etaVy);
  sendOrder();
}

function openReceipt() {
  openPage(receiptVy);
  renderReceipt();
}

function resetOrder() {
  cart = {};
  orderList.innerHTML = "";
  finishOrder.innerHTML = "";
  updateCartNumber();
  updateTotalPrice();
  openMenu();
}

// Handle item selection and cart actions
function handleMenuItemClick(event) {
  const item = event.target.closest("[orderId]");
  if (item) {
    const itemId = item.getAttribute("orderId");
    updateCart(itemId);
    updateCartNumber();
    updateTotalPrice();
  }
}

// Update the cart with item quantity
function updateCart(id) {
  cart[id] = cart[id] ? cart[id] + 1 : 1;
}

// Decrease the item quantity
function decrementCartItem(id) {
  if (cart[id] > 1) {
    cart[id] -= 1;
  } else {
    delete cart[id];
  }
  updateCartNumber();
  updateTotalPrice();
}

// Render cart items in the order list
async function renderCartItems() {
  orderList.innerHTML = ""; // Clear the order list before rendering
  for (const [key, value] of Object.entries(cart)) {
    const itemData = await fetchMenuItemData(key);
    renderCartItem(itemData, value);
  }
}

async function fetchMenuItemData(id) {
  try {
    const response = await fetch(`${url}/${id}`, options);
    const data = await response.json();
    return data; // Ensure the correct structure is returned
  } catch (error) {
    console.error("Error fetching item data:", error);
  }
}

function renderCartItem(itemData, value) {
  const div = document.createElement("div");
  div.classList.add("order-item");
  div.setAttribute("cart-item-id", itemData.item.id);

  const h2 = document.createElement("h2");
  h2.innerHTML = `${itemData.item.name} <span class="dotts"></span> ${
    itemData.item.price * value
  } SEK`;

  const p = document.createElement("p");
  p.textContent = `${value} stycken`;

  // Create buttons for quantity modification
  const plusButton = createQuantityButton("plus", itemData.item.id, "increase");
  const minusButton = createQuantityButton(
    "minus",
    itemData.item.id,
    "decrease"
  );

  const container = document.createElement("div");
  container.append(plusButton, p, minusButton);
  div.append(h2, container);
  orderList.append(div);
}

// Create quantity buttons (with specific actions)
function createQuantityButton(type, itemId, action) {
  const button = document.createElement("button");
  const img = document.createElement("img");
  img.src = type === "plus" ? "images/Union.png" : "images/Rectangle 22.png";

  button.append(img);
  button.addEventListener("click", () => {
    if (action === "increase") {
      cart[itemId] += 1;
    } else if (action === "decrease" && cart[itemId] > 1) {
      cart[itemId] -= 1;
    } else if (cart[itemId] === 1) {
      delete cart[itemId];
    }

    updateCartNumber();
    updateTotalPrice();
    renderCartItems(); // Re-render the cart items
  });

  return button;
}

// Update cart number display
function updateCartNumber() {
  const totalItems = Object.values(cart).reduce(
    (sum, quantity) => sum + quantity,
    0
  );
  numberOfItemInCart.textContent = totalItems;
  numberOfItemInCart.classList.toggle("hide", totalItems === 0);
}

// Update total price display
async function updateTotalPrice() {
  let total = 0;

  // Calculate the total price based on the cart
  for (const [key, value] of Object.entries(cart)) {
    const itemData = await fetchMenuItemData(key);

    if (itemData && itemData.item && itemData.item.price) {
      total += itemData.item.price * value;
    }
  }

  // Update the total price in the cart view (cart-vy)
  const totalPriceElementCart = document.querySelector(
    ".cart-vy .order-price .price"
  );
  if (totalPriceElementCart) {
    totalPriceElementCart.textContent = `${total} SEK`; // Update the cart total price
  }

  // Update the total price in the receipt view (receipt-vy)
  const totalPriceElementReceipt = document.querySelector(
    ".receipt-vy .order-price .price"
  );
  if (totalPriceElementReceipt) {
    totalPriceElementReceipt.textContent = `${total} SEK`; // Update the receipt total price
  }
}

// Render receipt
async function renderReceipt() {
  const order = await fetchReceipt();
  const items = order.receipt.items;

  items.forEach((item) => {
    const container = document.createElement("div");
    container.classList.add("finish-order-item");

    const h2 = document.createElement("h2");
    h2.innerHTML = `${item.name} <span class="dots"></span> ${item.price} SEK`;

    const p = document.createElement("p");
    p.textContent = `${item.quantity} stycken`;

    container.append(h2, p);
    finishOrder.append(container);
  });
}

// Fetch receipt data
async function fetchReceipt() {
  const response = await fetch(
    `https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com/receipts/${getOrderId}`,
    options
  );
  return await response.json();
}

// Send the order
async function sendOrder() {
  const cartArray = cartToArray();
  const response = await fetch(
    `https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com/m3z7/orders`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-zocom": key,
      },
      body: JSON.stringify({ items: cartArray }),
    }
  );

  const orderData = await response.json();
  getOrderId = orderData.order.id;
  updateOrderID();
  const eta = etaTime(orderData.order.eta);
  document.querySelector(".eta-time").textContent = `ETA ${eta}`;
}

function updateOrderID() {
  document
    .querySelectorAll(".order-id")
    .forEach((order) => (order.textContent = `#${getOrderId}`));
}

function cartToArray() {
  return Object.entries(cart).flatMap(([key, value]) =>
    Array(value).fill(Number(key))
  );
}

// Calculate eta time
function etaTime(targetTime) {
  const currentTime = new Date();
  const etaTime = new Date(targetTime);
  const differenceInMs = etaTime - currentTime;

  const totalMinutes = Math.floor(differenceInMs / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return hours > 0
    ? `${hours} TIM ${minutes.toString().padStart(2, "0")} MIN`
    : `${minutes} MIN`;
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
