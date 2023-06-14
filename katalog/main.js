// Утилиты

function toNum(str) {
    const num = Number(str.replace(/ /g, ""));
    return num;
  }
  
  function toCurrency(num) {
    const format = new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      minimumFractionDigits: 0,
    }).format(num);
    return format;
  }
  
  // Корзина

  const cardAddArr = Array.from(document.querySelectorAll(".card__add"));
  const cartNum = document.querySelector("#cart_num");
  const CartNum1 = document.querySelector("#cart_num1");
  if((localStorage.auth)){
    CartNum1.textContent = JSON.parse(localStorage.auth);}
  const cart = document.querySelector("#cart");
  const cart1 = document.querySelector("#cart1");
  const cart2 = document.querySelector("#cart2");
  class Cart {
    products;
    constructor() {
      this.products = [];
    }
    get count() {
      return this.products.length;
    }
    addProduct(product) {
      this.products.push(product);
    }
    removeProduct(index) {
      this.products = this.products.filter(function(f,a) { return a !== index });
    }
    get cost() {
      const prices = this.products.map((product) => {
        return toNum(product.price);
      });
      const sum = prices.reduce((acc, num) => {
        return acc + num;
      }, 0);
      return sum;
    }
    get costDiscount() {
      const prices = this.products.map((product) => {
        return toNum(product.priceDiscount);
      });
      const sum = prices.reduce((acc, num) => {
        return acc + num;
      }, 0);
      return sum;
    }
    get discount() {
      return this.cost - this.costDiscount;
    }
  }
  
  class Product {
    imageSrc;
    name;
    price;
    priceDiscount;
    constructor(card) {
      this.imageSrc = card.querySelector(".card__image").children[0].src;
      this.name = card.querySelector(".card__title").innerText;
      this.price = card.querySelector(".card__price--common").innerText;
      this.priceDiscount = card.querySelector(".card__price--discount").innerText;
    }
  }
  
  const myCart = new Cart();
  
  if (localStorage.getItem("cart") == null) {
    localStorage.setItem("cart", JSON.stringify(myCart));
  }  
  const savedCart = JSON.parse(localStorage.getItem("cart"));
  myCart.products = savedCart.products;
  
  
  myCart.products = cardAddArr.forEach((cardAdd) => {
    cardAdd.addEventListener("click", (e) => {
      e.preventDefault();
      const card = e.target.closest(".card");
      const product = new Product(card);
      const savedCart = JSON.parse(localStorage.getItem("cart"));
      myCart.products = savedCart.products;
      myCart.addProduct(product);
      localStorage.setItem("cart", JSON.stringify(myCart));

    });
  });
  
  // Попап
  const popup = document.querySelector(".popup");
  const popupClose = document.querySelector("#popup_close");
  const form_auth_block_close = document.querySelector("#form_auth_block_close");
  const form_reg_block_close = document.querySelector("#form_reg_block_close");
  const header = document.querySelector(".header");
  const headerclose = document.querySelector(".header_close");
  const body = document.body;
  const form_auth_block = document.querySelector('.form_auth_block')
  const form_reg_block = document.querySelector('.form_reg_block')
  const popupContainer = document.querySelector("#popup_container");
  const popupProductList = document.querySelector("#popup_product_list");
  const popupCost = document.querySelector("#popup_cost");
  const popupDiscount = document.querySelector("#popup_discount");
  const popupCostDiscount = document.querySelector("#popup_cost_discount");
  
  cart.addEventListener("click", (e) => {
    e.preventDefault();
    header.classList.remove("header")
    header.classList.add("header_close")
    popup.classList.add("popup--open");
    body.classList.add("lock");
    popupContainerFill();
  });
  cart1.addEventListener("click", (e) => {
    e.preventDefault();
    header.classList.remove("header")
    header.classList.add("header_close")
    form_auth_block.classList.add("form_auth_block-open");
    body.classList.add("lock");
    popupContainerFill();
  });
  cart2.addEventListener("click", (e) => {
    e.preventDefault();
    header.classList.remove("header")
    form_auth_block.classList.remove("form_auth_block-open");
    header.classList.add("header_close")
    form_reg_block.classList.add("form_reg_block-open");
    body.classList.add("lock");
    popupContainerFill();
  });
  
  function popupContainerFill() {
    popupProductList.innerHTML = null;
    const savedCart = JSON.parse(localStorage.getItem("cart"));
    myCart.products = savedCart.products;
    const productsHTML = myCart.products.map((product) => {
      const productItem = document.createElement("div");
      productItem.classList.add("popup__product");
  
      const productWrap1 = document.createElement("div");
      productWrap1.classList.add("popup__product-wrap");
      const productWrap2 = document.createElement("div");
      productWrap2.classList.add("popup__product-wrap");
  
      const productImage = document.createElement("img");
      productImage.classList.add("popup__product-image");
      productImage.setAttribute("src", product.imageSrc);
  
      const productTitle = document.createElement("h2");
      productTitle.classList.add("popup__product-title");
      productTitle.innerHTML = product.name;
  
      const productPrice = document.createElement("div");
      productPrice.classList.add("popup__product-price");
      productPrice.innerHTML = toCurrency(toNum(product.priceDiscount));
  
      const productDelete = document.createElement("button");
      productDelete.classList.add("popup__product-delete");
      productDelete.innerHTML = "&#10006;";
  
      productDelete.addEventListener("click", () => {
        myCart.removeProduct(myCart.products.indexOf(product));
        localStorage.setItem("cart", JSON.stringify(myCart));
        popupContainerFill();
      });
  
      productWrap1.appendChild(productImage);
      productWrap1.appendChild(productTitle);
      productWrap2.appendChild(productPrice);
      productWrap2.appendChild(productDelete);
      productItem.appendChild(productWrap1);
      productItem.appendChild(productWrap2);
  
      return productItem;
    });
  
    productsHTML.forEach((productHTML) => {
      popupProductList.appendChild(productHTML);
    });
  
    popupCost.value = toCurrency(myCart.cost);
    popupDiscount.value = toCurrency(myCart.discount);
    popupCostDiscount.value = toCurrency(myCart.costDiscount);
  }
  
  popupClose.addEventListener("click", (e) => {
    e.preventDefault();
    header.classList.remove("header_close");
    header.classList.add("header");
    popup.classList.remove("popup--open");
    body.classList.remove("lock");
  });
  form_auth_block_close.addEventListener("click", (e) => {
    e.preventDefault();
    header.classList.remove("header_close");
    header.classList.add("header");
    form_auth_block.classList.remove("form_auth_block-open");
    body.classList.remove("lock");
  });
  form_reg_block_close.addEventListener("click", (e) => {
    e.preventDefault();
    header.classList.remove("header_close");
    header.classList.add("header");
    form_reg_block.classList.remove("form_reg_block-open");
    body.classList.remove("lock");
  });
  function check3(){
    if(localStorage.auth){
      localStorage.removeItem('auth');
      CartNum1.textContent ='ВХОД'
    }
    else{
      alert('вы не авторизованы');
    }
  }
  function check2(){
    
    var now = JSON.parse(localStorage.getItem('cart'));
    
    if(!localStorage.auth){
      alert('Авторизуйтесь')
    }
    else if (now.products.length ==0){
      alert('Выберите товар');
    }
    else{
      alert('Заказ оформлен');
    }
  }
  function check(){


    var userName = document.getElementById('userName');
    var userPw = document.getElementById('userPw');
    var userRemember = document.getElementById("rememberMe");
    var storedUsers = JSON.parse(localStorage.getItem('storedUsers'));
    
    if(userName.value in storedUsers && userPw.value == storedUsers[userName.value]){
        alert('You are logged in.');
        localStorage.setItem('auth', JSON.stringify(userName.value));

    }else{
        alert('Error on login');
    }
}
var users= {};
  function store(){

    var name = document.getElementById('name');
    var pw = document.getElementById('pw');
    var lowerCaseLetters = /[a-z]/g;
    var upperCaseLetters = /[A-Z]/g;
    var numbers = /[0-9]/g;

    if(name.value.length == 0){
        alert('Please fill in email');

    }else if(pw.value.length == 0){
        alert('Please fill in password');

    }else if(name.value.length == 0 && pw.value.length == 0){
        alert('Please fill in email and password');

    }else if(pw.value.length > 8){
        alert('Max of 8');

    }else if(!pw.value.match(numbers)){
        alert('please add 1 number');

    }else if(!pw.value.match(upperCaseLetters)){
        alert('please add 1 uppercase letter');

    }else if(!pw.value.match(lowerCaseLetters)){
        alert('please add 1 lovercase letter');

    }else{
      if(window.localStorage.getItem('storedUsers') != null){
      users = JSON.parse(window.localStorage.getItem('storedUsers'))
      users[name.value] = pw.value;
      localStorage.setItem('storedUsers',JSON.stringify(users));}
      else{
        users[name.value] = pw.value;
        localStorage.setItem('storedUsers',JSON.stringify(users));
      }
        alert('Your account has been created');
    }
}
// проверяем, есть ли у пользователя куки с ключом "ageVerified"

  document.getElementById("age-verification").style.display = "block";


// обработчик отправки формы
document.querySelector("#age-verification form").addEventListener("submit", function(event) {
  event.preventDefault(); // отменяем стандартное поведение формы

  var age = document.getElementById("age-input").value;
  age = parseInt(age);

  if (age >= 18) {
    // закрываем модальное окно и устанавливаем куки на 30 дней
    document.getElementById("age-verification").style.display = "none";
   
  } else {
    // показываем ошибку
    document.getElementById("age-input").setCustomValidity("Вы должны быть старше 18 лет");
    document.getElementById("age-input").reportValidity();
    window.location.href = 'https://www.detmir.ru/';
  }
});

// функции для работы с куками




//checking




