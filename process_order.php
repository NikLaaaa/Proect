<?php
// Получаем данные заказа из POST-запроса
$address = $_POST['address'];
$warehouse = $_POST['warehouse'];
$phone = $_POST['phone'];
$paymentMethod = $_POST['paymentMethod'];

// Здесь можно выполнить необходимую логику (например, сохранение в базу данных)

// Пример отправки уведомления на электронную почту о заказе
$to = 'nikita@euro-net.com.ua';
$subject = 'Новый заказ на NikLaStore';
$message = "Получен новый заказ с адресом: $address, отделением: $warehouse, телефоном: $phone. Способ оплаты: $paymentMethod";
$headers = 'From: webmaster@example.com' . "\r\n" .
    'Reply-To: webmaster@example.com' . "\r\n" .
    'X-Mailer: PHP/' . phpversion();

mail($to, $subject, $message, $headers);

// Возвращаем успешный ответ клиенту (можно использовать JSON для более сложных структур ответа)
echo json_encode(['success' => true]);
?>
