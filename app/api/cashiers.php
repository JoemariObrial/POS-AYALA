<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Define the list of cashiers without passwords for security reasons
$cashierList = [
    ["id" => 1, "c_name" => "Pitok Batolata", "c_password" => '12345'],
    ["id" => 2, "c_name" => "Kulas D. Malas", "c_password" => '54321'],
    ["id" => 3, "c_name" => "Bob Cut", "c_password" => '123'],
];

echo json_encode($cashierList);
?>