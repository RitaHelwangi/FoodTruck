/*import { API_KEY, TENANT_ID, TENANT_NAME } from './config';

console.log("API Key:", API_KEY);
console.log("Tenant ID:", TENANT_ID);
console.log("Tenant Name:", TENANT_NAME);

const config = require('./config');*/

const key = "yum-7BTxHCyHhzIME5TI";

const tenant = {
	id: "m3z7",
	name: "Rita",
};

const options = {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    "x-zocom": key,
  },
};

let url = "https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com/menu";

fetchMenuItems()

async function fetchMenuItems() {
  try {

const wontonResponse = await fetch(url + "?type=wonton", options);
const wontonData = await wontonResponse.json();

const dipResponse = await fetch(url + "?type=dip", options);
const dipData = await dipResponse.json();

const drinkResponse = await fetch(url + "?type=drink", options);
const drinkData = await drinkResponse.json();


/*console.log(wontonData.items);
console.log(dipData.items);
console.log(drinkData.items);*/


const dipsBtn = document.querySelector(".dips-btn");
const drinksBtn = document.querySelector(".drinks-btn");
const cartBtn = document.querySelector(".cart-btn");
const menuVy = document.querySelector(".menu-vy");



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

cartBtn.addEventListener("click", () => {
  hideAllPages();
  menuVy.classList.remove("hide");
});
  } catch (error) {
    console.error("Error fetching menu data:", error);
  }
}
// menu items
function createMenuItem(food) {
  const menu = document.querySelector(".menu");

    if (!menu) {
    console.error("Menu container not found.");
    return;
  }


  let div = document.createElement("div");
  div.classList.add("item");
  
  let h2 = document.createElement("h2");
  h2.innerText = food.name;

  let span = document.createElement("span");
  span.classList.add("dots");

  div.appendChild(h2);
  div.appendChild(span);
  menu.appendChild(div);
}


function createDipOrDrinkList(item, parentElement) {
  if (!parentElement) {
    console.error("Parent element not found.");
    return;
  }

  let div = document.createElement("div");
  div.classList.add("item");
  div.innerText = item.name;

  parentElement.appendChild(div);
}