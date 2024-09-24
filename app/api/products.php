<?php

// Enable CORS (Cross-Origin Resource Sharing) to allow your Next.js app to access this API
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Define the list of products
$productList = [
    ["barcode" => "1001", "p_name" => "Bulad", "price" => 10],
    ["barcode" => "1002", "p_name" => "Mantika", "price" => 30],
    ["barcode" => "1003", "p_name" => "Noodles", "price" => 20],
    ["barcode" => "1004", "p_name" => "Sabon", "price" => 35],
    ["barcode" => "1005", "p_name" => "Shampoo", "price" => 15],
    ["barcode" => "1006", "p_name" => "Shabu", "price" => 15],
    ["barcode" => "4800488959878", "p_name" => "Wet Wipes", "price" => 50],
    ["barcode" => "4902505088933", "p_name" => "Felt Tip Pen", "price" => 69],
    ["barcode" => "6972661281583", "p_name" => "Fantech Venom II", "price" => 69],
];

// Convert products data to JSON format
echo json_encode($productList);

?>
