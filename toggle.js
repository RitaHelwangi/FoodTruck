// Navigation Functions
const menuVy = document.querySelector(".menu-vy");
const cartVy = document.querySelector(".cart-vy");
const etaVy = document.querySelector(".eta-vy");
const receiptVy = document.querySelector(".receipt-vy");

export function hideAllPages() {
  [cartVy, etaVy, receiptVy, menuVy].forEach((page) =>
    page.classList.add("hide")
  );
}

export function openPage(page) {
  hideAllPages();
  page.classList.remove("hide");
}
