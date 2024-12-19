import { fetchReceipt } from "./api.js";

export async function renderReceipt() {
  const order = await fetchReceipt(getOrderId);
  const items = order.receipt.items;

  items.forEach((item) => {
    const container = document.createElement("div");
    container.classList.add("finish-order-item");

    const h2 = document.createElement("h2");
    h2.innerHTML = `${item.name} <span class="dots"></span> ${item.price} SEK`;

    const p = document.createElement("p");
    p.textContent = `${item.quantity} stycken`;

    container.append(h2, p);
    document.querySelector(".finish-order").append(container);
  });
}
