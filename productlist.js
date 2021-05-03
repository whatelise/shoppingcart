const urlParams = new URLSearchParams(window.location.search);
const collectionFromUrl = urlParams.get("collection");
const categoryFromUrl = urlParams.get("category");
const bestsellerFromUrl = urlParams.get("bestseller");
const newarrivalFromUrl = urlParams.get("newarrival");

let url = "https://silfen-9520.restdb.io/rest/products";

if (categoryFromUrl) {
  url =
    "https://silfen-9520.restdb.io/rest/products" +
    '?q={"category":"' +
    categoryFromUrl +
    '"}';
  console.log(url);
}
if (collectionFromUrl) {
  url =
    'https://silfen-9520.restdb.io/rest/products?q={"collection":"' +
    collectionFromUrl +
    '"}';
  console.log(url);
}
if (bestsellerFromUrl) {
  url = 'https://silfen-9520.restdb.io/rest/products?q={"bestseller": true}';
  console.log(url);
}
if (newarrivalFromUrl) {
  url = 'https://silfen-9520.restdb.io/rest/products?q={"newarrival": true}';
  console.log(url);
}

function getData() {
  fetch(url, {
    method: "GET",
    mode: "cors",
    headers: {
      "x-apikey": "608278cf28bf9b609975a5b3",
    },
  })
    .then((res) => res.json())
    .then((response) => {
      showProducts(response);
      //   console.log(response);
    })
    .catch((err) => {
      console.error(err);
    });
}

getData();

function showProducts(products) {
  PRODUCTS = products;
  products.forEach((product) => {
    const template = document.querySelector(".product").content;
    const copy = template.cloneNode(true);
    copy.querySelector(".name").textContent = product.name;
    copy.querySelector(".productImage").src = product.imgurl1;
    copy.querySelector(".collection").textContent = product.collection;
    copy.querySelector(".colours").textContent = product.color;
    copy.querySelector(".OPrice span").textContent = product.price;
    copy.querySelector(".NewPrice span").textContent = product.newprice;
    copy.querySelector(".shop-button").dataset.id += product._id;
    copy.querySelector(".shop-button").setAttribute("data-id", product._id);
    copy.querySelector(".shop-button").addEventListener("click", addItem);
    copy.querySelector(
      ".viewProduct"
    ).href = `productview.html?products=${product._id}`;
    document.querySelector(".productList").appendChild(copy);
  });
}

/*CART DISPLAY*/

const CART = {
  KEY: "608278cf28bf9b609975a5b3",
  contents: [],
  init() {
    //check localStorage and initialize the contents of CART.contents
    let _contents = localStorage.getItem(CART.KEY);
    if (_contents) {
      CART.contents = JSON.parse(_contents);
    } else {
      //dummy test data
      CART.contents = [
        { _id: "3", img: "nonoe", qty: 3, name: "Hej there", price: 500 },
      ];
      CART.sync();
    }
  },
  async sync() {
    let _cart = JSON.stringify(CART.contents);
    await localStorage.setItem(CART.KEY, _cart);
  },
  find(id) {
    //find an item in the cart by it's id
    let match = CART.contents.filter((item) => {
      if (item._id == id) return true;
    });
    if (match && match[0]) return match[0];
  },
  add(id) {
    //add a new item to the cart
    //check that it is not in the cart already
    if (CART.find(id)) {
      CART.increase(id, 1);
    } else {
      let arr = PRODUCTS.filter((product) => {
        if (product._id == id) {
          return true;
        }
      });
      if (arr && arr[0]) {
        let obj = {
          id: arr[0]._id,
          name: arr[0].name,
          qty: 1,
          price: arr[0].price,
        };
        CART.contents.push(obj);
        //update localStorage
        CART.sync();
      } else {
        //product id does not exist in products data
        console.error("Invalid Product");
      }
    }
  },
  increase(id, qty = 1) {
    //increase the quantity of an item in the cart
    CART.contents = CART.contents.map((product) => {
      if (item._id === id) item.qty = item.qty + qty;
      return item;
    });
    //update localStorage
    CART.sync();
  },
  reduce(id, qty = 1) {
    //reduce the quantity of an item in the cart
    CART.contents = CART.contents.map((item) => {
      if (item._id === id) item.qty = item.qty - qty;
      return item;
    });
    CART.contents.forEach(async (item) => {
      if (item.id === id && item.qty === 0) await CART.remove(id);
    });
    //update localStorage
    CART.sync();
  },
  remove(id) {
    //remove an item entirely from CART.contents based on its id
    CART.contents = CART.contents.filter((item) => {
      if (item._id !== id) return true;
    });
    //update localStorage
    CART.sync();
  },
  empty() {
    //empty whole cart
    CART.contents = [];
    //update localStorage
    CART.sync();
  },
  sort(field = "name") {
    //sort by field - title, price
    //return a sorted shallow copy of the CART.contents array
    let sorted = CART.contents.sort((a, b) => {
      if (a[field] > b[field]) {
        return 1;
      } else if (a[field] < a[field]) {
        return -1;
      } else {
        return 0;
      }
    });
    return sorted;
    //NO impact on localStorage
  },
  logContents(prefix) {
    console.log(prefix, CART.contents);
  },
};

let PRODUCTS = [];

document.addEventListener("DOMContentLoaded", () => {
  //when the page is ready
  getData(showProducts, errorMessage);
  //get the cart items from localStorage
  CART.init();
  //load the cart items
  showCart();
});

function showCart() {
  let cartproduct = CART.sort("qty");
  cartproduct.forEach((item) => {
    const carttemplate = document.querySelector(".cart-item-template").content;
    const clone = carttemplate.cloneNode(true);
    clone.querySelector("label").textContent = item.name;
    clone.querySelector(".minus").innerHTML = "-";
    clone.querySelector("#fid-").textContent = item.qty;
    clone.querySelector(".plus").innerHTML = "+";
    clone.querySelector(".price-row span").textContent = item.price;
    clone.querySelector(".price-each span").textContent = item.newprice;
    document.querySelector(".cart-item").appendChild(clone);
  });
}

// let cartSection = document.getElementById("cart-item-template");
// cart.innerHTML = "";
// let s = CART.sort("qty");
// s.forEach((item) => {
//   let cartitem = document.createElement("div");
//   cartitem.className = "cart-item";

//   let title = document.createElement("h3");
//   title.textContent = item.title;
//   title.className = "title";
//   cartitem.appendChild(title);

//   let controls = document.createElement("div");
//   controls.className = "controls";
//   cartitem.appendChild(controls);

//   let plus = document.createElement("span");
//   plus.textContent = "+";
//   plus.setAttribute("data-id", item.id);
//   controls.appendChild(plus);
//   plus.addEventListener("click", incrementCart);

//   let qty = document.createElement("span");
//   qty.textContent = item.qty;
//   controls.appendChild(qty);

//   let minus = document.createElement("span");
//   minus.textContent = "-";
//   minus.setAttribute("data-id", item.id);
//   controls.appendChild(minus);
//   minus.addEventListener("click", decrementCart);

//   let price = document.createElement("div");
//   price.className = "price";
//   let cost = new Intl.NumberFormat("en-CA", {
//     style: "currency",
//     currency: "CAD",
//   }).format(item.qty * item.itemPrice);
//   price.textContent = cost;
//   cartitem.appendChild(price);

//   cartSection.appendChild(cartitem);

function incrementCart(ev) {
  ev.preventDefault();
  let id = parseInt(ev.target.getAttribute("data-id"));
  CART.increase(id, 1);
  let controls = ev.target.parentElement;
  let qty = controls.querySelector("span:nth-child(2)");
  let item = CART.find(id);
  if (item) {
    qty.textContent = item.qty;
  } else {
    document.getElementById("cart").removeChild(controls.parentElement);
  }
}

function decrementCart(ev) {
  ev.preventDefault();
  let id = parseInt(ev.target.getAttribute("data-id"));
  CART.reduce(id, 1);
  let controls = ev.target.parentElement;
  let qty = controls.querySelector("span:nth-child(2)");
  let item = CART.find(id);
  if (item) {
    qty.textContent = item.qty;
  } else {
    document.getElementById("cart").removeChild(controls.parentElement);
  }
}

function addItem(ev) {
  ev.preventDefault();
  let id = parseInt(ev.target.getAttribute("data-id"));
  console.log("add to cart item", id);
  CART.add(id, 1);
  showCart();
}

function errorMessage(err) {
  //display the error message to the user
  console.error(err);
}
