const key = "yum-7BTxHCyHhzIME5TI";
const options = {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    "x-zocom": key,
  },
};
const url = "https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com/menu";

// Fetch data from API
export async function fetchMenuData(type) {
  const response = await fetch(`${url}?type=${type}`, options);
  return await response.json();
}

export async function fetchMenuItemData(id) {
  try {
    const response = await fetch(`${url}/${id}`, options);
    const data = await response.json();
    return data; // Ensure the correct structure is returned
  } catch (error) {
    console.error("Error fetching item data:", error);
  }
}

export async function fetchReceipt(orderId) {
  const response = await fetch(
    `https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com/receipts/${orderId}`,
    options
  );
  return await response.json();
}

export async function sendOrder(cart) {
  const cartArray = cartToArray(cart);
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
  return orderData;
}

function cartToArray(cart) {
  return Object.entries(cart).flatMap(([key, value]) =>
    Array(value).fill(Number(key))
  );
}
