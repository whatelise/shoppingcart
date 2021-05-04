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
  products.forEach((product) => {
    const template = document.querySelector(".product").content;
    const copy = template.cloneNode(true);
    copy.querySelector(".name").textContent = product.name;
    copy.querySelector(".productImage").src = product.imgurl1;
    copy.querySelector(".collection").textContent = product.collection;
    copy.querySelector(".colours").textContent = product.color;
    copy.querySelector(".OPrice span").textContent = product.price;
    copy.querySelector(".NewPrice span").textContent = product.newprice;
    // copy.querySelector(".shop-button").dataset.id += product._id;
    copy.querySelector(".shop-button").setAttribute("data-id", product._id);
    copy.querySelector(".shop-button").addEventListener("click", () => {
      CART.add(product);
    });
    copy.querySelector(
      ".viewProduct"
    ).href = `productview.html?products=${product._id}`;
    document.querySelector(".productList").appendChild(copy);
  });
}

/*CART DISPLAY*/

const CART = {
  KEY: "basket",
  contents: [],
  init() {
    let _contents = localStorage.getItem(CART.KEY);
    if (_contents) {
      CART.contents = JSON.parse(_contents);
    } else {
      //   CART.contents = [
      //     { _id: "3", img: "none", qty: 3, name: "Cookies", price: 500 },
      //     { _id: "5", img: "none", qty: 5, name: "kowabunga", price: 600 },
      //   ];
    }
    CART.sync();
  },
  sync() {
    let _cart = JSON.stringify(CART.contents);
    localStorage.setItem(CART.KEY, _cart);
    CART.updateDOM();
  },
  updateDOM() {
    const cartcontentEl = document.querySelector(".cart-content");
    cartcontentEl.innerHTML = "";

    if (CART.contents.length === 0) {
      cartcontentEl.innerHTML = "<h4> THE CART IS EMPTY</h4>";
    } else {
      CART.contents.forEach((element) => {
        console.log(element);

        const tempItem = document.querySelector(".cart-item-template").content;
        const itemCopy = tempItem.cloneNode(true);

        const id = element._id;
        const labelEl = itemCopy.querySelector(".label");
        labelEl.textContent = element.name;
        labelEl.setAttribute("for", "fid-" + id);

        const minusBtn = itemCopy.querySelector(".minus");
        minusBtn.addEventListener("click", () => {
          CART.minusOne(id);
        });

        const plusBtn = itemCopy.querySelector(".plus");
        plusBtn.addEventListener("click", () => {
          CART.plusOne(id);
        });

        const inputEl = itemCopy.querySelector("input");
        inputEl.id += id;
        inputEl.name += id;
        inputEl.value = element.qty;

        inputEl.addEventListener("change", () => {
          const itemQty = inputEl.valueAsNumber;
          element.qty = itemQty;
          console.log("element");
          console.log(element.qty);
          CART.update(element);
        });
        inputEl.addEventListener("focus", (e) => {
          e.target.select();
        });
        const priceEL = itemCopy.querySelector(".price-each span");
        priceEL.textContent = element.price;

        cartcontentEl.appendChild(itemCopy);
      });
    }
  },
  add(obj) {
    const index = CART.contents.findIndex((element) => element._id == obj._id);
    if (index == -1) {
      console.log(obj);
      obj.qty = 1;
      console.log(CART.contents);
      CART.contents.push(obj);
    } else {
      CART.contents[index].qty += 1;
    }
    this.sync();
  },
  update(obj) {
    const index = CART.contents.findIndex((element) => element._id == obj._id);
    if (obj.qty === 0) {
      CART.contents.splice(index, 1);
    } else {
      CART.contents[index].qty = obj.qty;
    }

    // const inputEl = document.querySelector("#fid-" + obj._id);
    // CART.contents[index].qty = inputEl.valueAsNumber;

    CART.sync();
  },

  minusOne(id) {
    const indexObj = CART.contents.find((element) => element._id == id);
    indexObj.qty--;
    console.log(indexObj);
    CART.update(indexObj);
  },
  plusOne(id) {
    const indexObj = CART.contents.find((element) => element._id == id);
    indexObj.qty++;
    CART.update(indexObj);
  },
};

CART.init();
