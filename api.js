const key = "yum-7BTxHCyHhzIME5TI";

const tenant = {
  id: "m3z7",
  name: "Rita",
};

const options = {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
    "x-zocom": key,
  },
};

const url = "https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com/menu";

async function fetchWontonData() {
  const wontonResponse = await fetch(`${url}?type=wonton`, options);
  return await wontonResponse.json();
}

async function fetchDipData() {
  const dipResponse = await fetch(`${url}?type=dip`, options);
  return await dipResponse.json();
}

async function fetchDrinkData() {
  const drinkResponse = await fetch(`${url}?type=drink`, options);
  return await drinkResponse.json();
}

export { key, tenant, options, fetchWontonData, fetchDipData, fetchDrinkData };
