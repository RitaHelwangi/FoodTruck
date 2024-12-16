/*import { API_KEY, TENANT_ID, TENANT_NAME } from './config';

console.log("API Key:", API_KEY);
console.log("Tenant ID:", TENANT_ID);
console.log("Tenant Name:", TENANT_NAME);

const config = require('./config');*/

import { fetchWontonData, fetchDipData, fetchDrinkData } from "./api.js";

let cart = {};
let getOrder = "";

// Fetch data from API
const wontonData = await fetchWontonData();
const dipData = await fetchDipData();
const drinkData = await fetchDrinkData();

const dipsBtn = document.querySelector(".dips-btn");
const drinksBtn = document.querySelector(".drinks-btn");
const menuVy = document.querySelector(".menu-vy");
const cartBtn = document.querySelector(".cart-btn");
const etaVy = document.querySelector(".eta-vy");
const receiptVy = document.querySelector(".receipt-vy");
const orderList = document.querySelector(".order-list");
const numberOfItemInCart = document.querySelector(".note-cart");
const SendOrder = document.querySelector("send-order");



// Create and display menu items
wontonData.items.forEach((item) => {
  createMenuItem(item);
});

dipData.items.forEach((item) => {
  createDipOrDrinkList(item, dipsBtn);
});

drinkData.items.forEach((item) => {
  createDipOrDrinkList(item, drinksBtn);
});

document.querySelector(".cart-btn").addEventListener("click", ()=> {
	hideAllPages();
	cartVy.classList.remove("hide");

	for (const [key, value] of Object.entries(cart)) {
		renderOrderCart(key, value);
		updateTotalPrice();
	}
});

document.querySelector(".home").addEventListener("click", ()=> {
	hideAllPages();
	menuVy.classList.remove("hide");
	orderList.innerHTML = "";
});

document.querySelector("#order").addEventListener("click", () => {
if (Object.keys(cart).length ===0) {
	return
}
else {
	hideAllPages();
	etaVy.classList.remove("hide");
	SendOrder();
}
});

document.querySelector(".menu").addEventListener("click", (event) => {
	if (event.target.closest(".item")) {
		const item = event.target.closest(".item");
		updateCart(item.getAttribute("orderId"));
	}
	updateCartNumber();
});

document.querySelector(".dips-btn").addEventListener("click", (event) =>{
	if (event.currentTarget.closest("button")) {
		const item = event.target.closest("button");

		updateCart(item.getAttribute("orderId"));
		updateCartNumber();
	}
});

document.querySelector(".drinks-btn").addEventListener("click", (event) =>{
	if (event.currentTarget.closest("button")) {
		const item = event.target.closest("button");
		
		updateCart(item.getAttribute("orderId"));
		updateCartNumber();
	}
});

document.querySelector(".fade-btn")("click" , () => {
	hideAllPages();
	receiptVy.classList.remove("hide");
	renderOutReceipt();
});

document.querySelectorAll(".new-order").forEach((button) =>{
	button.addEventListener("click", () => {
		hideAllPages();
		menuVy.classList.remove("hide");
		orderResetHandler();
	});
});

function orderResetHandler() {
	const item = document.querySelectorAll("[orderId]");
	cart = {};
	orderList.innerHTML = "";
	SendOrder.innerHTML =""
	updateCartNumber();
	updateTotalPrice();

	const orderId =document.querySelectorAll(".order-id");
	orderId.forEach((order) => {
		order.innerText = "";
	});
}


// menu items
function createMenuItem(food) {
  const menu = document.querySelector(".menu");

  let div = document.createElement("div");
  div.classList.add("item");
  div.setAttribute("orderId", food.id);

  let span = document.createElement("span");
  span.classList.add("dots");
  let h2 = document.createElement("h2");
  h2.innerText = food.name;
  h2.append(span);
  h2.append(`${food.price} SEK`);
  let p = document.createElement("p");

  food.ingredients.forEach((type) => {
    p.innerText += `${type}, `;
  });

  p.innerText = p.innerText.slice(0, -2);

  div.append(h2, p);
  menu.append(div);
}

//dips n drinks
function createDipOrDrinkList(type, sort) {
 let button = document.createElement("button");
 button.setAttribute("orderId", type.id);
 button.innerText = type.name;

 sort.append(button);
}

 //hide vy
 function hideAllPages() {
	cartBtn.classList.add("hide");
	etaVy.classList.add("hide");
	receiptVy.classList.add("hide");
	menuVy.classList.add("hide");
 }