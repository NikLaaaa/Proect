function toggleOptions(element) {
  var options = element.nextElementSibling; // Отримати сусідній елемент з опціями кольору
  if (options.style.display === 'none') {
      options.style.display = 'block';
  } else {
      options.style.display = 'none';
  }
}





document.addEventListener('DOMContentLoaded', function() {
      var contactLink = document.querySelector('nav ul li a[href="#footer"]');


      contactLink.addEventListener('click', function(event) {
          event.preventDefault();
          var footer = document.getElementById('footer'); // Отримання елемента футера
          var footerTop = footer.offsetTop; // Отримання верхньої позиції футера


          window.scrollTo({
              top: footerTop,
              behavior: 'smooth'
          });
      });
  });

document.addEventListener("DOMContentLoaded", function() {
  // Удаление оверлея после загрузки страницы
  const overlay = document.querySelector('.transition-overlay');
  if (overlay) {
    overlay.addEventListener('animationend', function() {
      overlay.parentNode.removeChild(overlay);
    });
  }
});



var cartItems = [];
var totalPrice = 0;


function addToCart(name, price) {
   cartItems.push({ name: name, price: price });
   totalPrice += price;
   updateCart();
}


function updateCart() {
   var cartItemsList = document.getElementById("cartItems");
   var totalElement = document.getElementById("totalPrice");


   cartItemsList.innerHTML = "";
   cartItems.forEach(function(item) {
       var li = document.createElement("li");
       li.textContent = item.name + "" + item.price;
   });


   totalElement.textContent = totalPrice;
}

// Функция для добавления товара в корзину
function addToCart(productName, price) {
    // Логика добавления товара в корзину
    var totalPriceElement = document.getElementById('totalPrice');
    var totalPrice = parseFloat(totalPriceElement.textContent);
    totalPrice += price;
    totalPriceElement.textContent = totalPrice.toFixed(0);


    // Сохранение товара в локальное хранилище
    var cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push({ name: productName, price: price });
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Настройка ссылки "Подивитися кошик"
document.getElementById('viewCartLink').addEventListener('click', function(event) {
    event.preventDefault(); // Предотвращаем стандартное действие ссылки (переход по адресу)

    // Переход на страницу "2.html"
    window.location.href = 'cart.html';
});




