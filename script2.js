document.addEventListener('DOMContentLoaded', function() {
    var cartItemsElement = document.getElementById('cartItems');
    var totalPriceElement = document.getElementById('totalPrice');
    var checkoutModal = document.getElementById('checkoutModal');
    var continueButton = document.getElementById('continueButton');
    var prepaymentInfo = document.getElementById('prepayment-info');
    var addressInput = document.getElementById('autocompleteAddress');
    var warehouseInput = document.getElementById('autocompleteWarehouse');
    var phoneInput = document.getElementById('phone');
    var paymentMethodSelect = document.getElementById('paymentMethod');

    // Показываем содержимое корзины при загрузке страницы
    displayCart();

    continueButton.addEventListener('click', function() {
        var address = addressInput.value.trim();
        var warehouse = warehouseInput.value.trim();
        var phone = phoneInput.value.trim();
        var paymentMethod = paymentMethodSelect.value;

        if (address === '' || phone === '' || paymentMethod === '') {
            alert('Будь ласка, заповніть усі поля для оформлення замовлення.');
            return;
        }

        // Моделируем отправку данных на сервер (закомментировано для примера)
        // $.ajax({
        //     url: 'process_order.php',
        //     method: 'POST',
        //     data: {
        //         address: address,
        //         warehouse: warehouse,
        //         phone: phone,
        //         paymentMethod: paymentMethod
        //     },
        //     success: function(response) {
        //         console.log('Заказ успешно оформлен');
        //         alert('Заказ успешно оформлен. Ми зв\'яжемось з вами для підтвердження замовлення.');
        //     },
        //     error: function(error) {
        //         console.error('Произошла ошибка при оформлении заказа', error);
        //         alert('Произошла ошибка при оформлении заказа. Пожалуйста, попробуйте еще раз или свяжитесь с нами напрямую.');
        //     }
        // });

        // Очистка корзины после оформления заказа (закомментировано для примера)
        // localStorage.removeItem('cart');
        // cartItemsElement.innerHTML = '';
        // totalPriceElement.textContent = '0.00';

        alert('Заказ успешно оформлен. Мы свяжемся с вами для подтверждения заказа.');
        checkoutModal.style.display = 'none'; // Закрываем модальное окно
    });

    paymentMethodSelect.addEventListener('change', function() {
        if (paymentMethodSelect.value === 'onDelivery') {
            prepaymentInfo.style.display = 'block';
        } else {
            prepaymentInfo.style.display = 'none';
        }
    });

    document.getElementById('showCheckoutModal').addEventListener('click', function() {
        checkoutModal.style.display = 'block';
        // При открытии модального окна загружаем список городов
        loadCities();
    });

    document.getElementsByClassName('close')[0].addEventListener('click', function() {
        checkoutModal.style.display = 'none';
    });

    window.addEventListener('click', function(event) {
        if (event.target == checkoutModal) {
            checkoutModal.style.display = 'none';
        }
    });

    // Загрузка списка городов для автозаполнения
    function loadCities() {
        var citiesData;
        $.ajax({
            url: "https://api.novaposhta.ua/v2.0/json/",
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({
                "apiKey": "030f1ad47639c0efc1b86643d624b74b",
                "modelName": "Address",
                "calledMethod": "getCities",
                "methodProperties": {}
            }),
            success: function(data) {
                if (data.success && data.data.length > 0) {
                    citiesData = data.data;
                    initializeAutocomplete(citiesData);
                }
            }
        });

        function initializeAutocomplete(data) {
            $("#autocompleteAddress").autocomplete({
                source: function(request, response) {
                    var filteredCities = data.filter(function(city) {
                        return city.Description.toLowerCase().includes(request.term.toLowerCase());
                    });
                    var limitedCities = filteredCities.slice(0, 10).map(function(city) {
                        return city.Description;
                    });
                    response(limitedCities);
                },
                minLength: 1,
                select: function(event, ui) {
                    event.preventDefault();
                    $("#autocompleteAddress").val(ui.item.label);
                    var selectedCity = ui.item.value;
                    var cityRef = citiesData.find(function(city) {
                        return city.Description === selectedCity;
                    }).Ref;
                    loadWarehouses(cityRef);
                }
            });
        }
    }

    // Загрузка списка отделений для выбранного города
    function loadWarehouses(cityRef) {
        var warehousesData;
        $.ajax({
            url: "https://api.novaposhta.ua/v2.0/json/",
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({
                "apiKey": "030f1ad47639c0efc1b86643d624b74b",
                "modelName": "AddressGeneral",
                "calledMethod": "getWarehouses",
                "methodProperties": {
                    "CityRef": cityRef
                }
            }),
            success: function(data) {
                if (data.success && data.data.length > 0) {
                    warehousesData = data.data;
                    initializeWarehouseAutocomplete(warehousesData);
                }
            }
        });

        function initializeWarehouseAutocomplete(data) {
            $("#autocompleteWarehouse").autocomplete({
                source: function(request, response) {
                    var filteredWarehouses = data.filter(function(warehouse) {
                        return warehouse.Description.toLowerCase().includes(request.term.toLowerCase());
                    });
                    var limitedWarehouses = filteredWarehouses.slice(0, 10).map(function(warehouse) {
                        return warehouse.Description;
                    });
                    response(limitedWarehouses);
                },
                minLength: 1
            });
        }
    }
});

// Функция для отображения содержимого корзины
function displayCart() {
    var cart = JSON.parse(localStorage.getItem('cart')) || [];
    var totalPrice = 0;
    var cartItemsList = document.getElementById('cartItems');
    var totalPriceElement = document.getElementById('totalPrice');

    // Очищаем список перед отображением
    cartItemsList.innerHTML = '';

    cart.forEach(function(item, index) {
        var li = document.createElement('li');
        li.textContent = item.name + ' - ₴' + item.price.toFixed(0); // Отображаем цену с двумя знаками после запятой

        // Кнопка удаления товара из корзины
        var removeButton = document.createElement('button');
        removeButton.textContent = 'Видалити';
        removeButton.addEventListener('click', function() {
            removeFromCart(index);
        });

        li.appendChild(removeButton);
        cartItemsList.appendChild(li);
        totalPrice += item.price;
    });

    // Отображаем общую сумму с двумя знаками после запятой
    totalPriceElement.textContent = 'Загальна сума: ₴' + totalPrice.toFixed(2);
}

// Функция для удаления товара из корзины
function removeFromCart(index) {
    var cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (index >= 0 && index < cart.length) {
        cart.splice(index, 1); // Удаляем товар из массива корзины по индексу
        localStorage.setItem('cart', JSON.stringify(cart)); // Обновляем localStorage
        displayCart(); // Перерисовываем корзину
    }
}
