import { fetchMenuItemData } from "./api.js";

export function updateCartNumber(cart) {
  const totalItems = Object.values(cart).reduce(
    (sum, quantity) => sum + quantity,
    0
  );
  const numberOfItemInCart = document.querySelector(".note-cart");
  numberOfItemInCart.textContent = totalItems;
  numberOfItemInCart.classList.toggle("hide", totalItems === 0);
}

export async function updateTotalPrice(cart) {
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
    totalPriceElementCart.textContent = `${total} SEK`;
  }

  // Update the total price in the receipt view (receipt-vy)
  const totalPriceElementReceipt = document.querySelector(
    ".receipt-vy .order-price .price"
  );
  if (totalPriceElementReceipt) {
    totalPriceElementReceipt.textContent = `${total} SEK`;
  }
}

export async function renderCartItems(cart) {
  for (const [key, value] of Object.entries(cart)) {
    let itemElement = document.querySelector(`[cart-item-id="${key}"]`);
    if (!itemElement) {
      const itemData = await fetchMenuItemData(key);
      renderCartItem(itemData, value);
    }
  }
}

export function renderCartItem(itemData, value) {
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
  document.querySelector(".order-list").append(div);
}

function createQuantityButton(type, itemId, action) {
  const button = document.createElement("button");
  const img = document.createElement("img");
  img.src = type === "plus" ? "images/Union.png" : "images/Rectangle 22.png";
  button.append(img);

  button.addEventListener("click", async () => {
    if (action === "increase") {
      cart[itemId] += 1;
    } else if (action === "decrease" && cart[itemId] > 1) {
      cart[itemId] -= 1;
    } else if (cart[itemId] === 1) {
      delete cart[itemId];
      document.querySelector(`[cart-item-id="${itemId}"]`).remove();
    }

    updateCartNumber(cart);
    updateTotalPrice(cart);
  });

  return button;
}
