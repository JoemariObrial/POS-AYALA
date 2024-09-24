<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

class Auth
{
    function login($json)
    {
        // Include the cashier list array
        $cashierList = [
            ["id" => 1, "c_name" => "Pitok Batolata", "c_password" => '12345'],
            ["id" => 2, "c_name" => "Kulas D. Malas", "c_password" => '54321'],
            ["id" => 3, "c_name" => "Mirah Aguilar", "c_password" => '123'],
        ];

        // Decode the JSON input
        $json = json_decode($json, true);

        // Initialize the return value
        $returnValue = ["success" => false, "message" => "Invalid credentials"];

        // Iterate through the cashier list to find a match
        foreach ($cashierList as $cashier) {
            if ($cashier['id'] == $json['cashierId']) {
                if ($cashier['c_password'] == $json['password']) {
                    $returnValue = ["success" => true, "cashier" => $cashier];
                } else {
                    $returnValue["message"] = "Incorrect password";
                }
                break;
            }
        }

        // Return the result as JSON
        return json_encode($returnValue);
    }
}

// Check if JSON and operation are set in the POST request
$json = isset($_POST['json']) ? $_POST['json'] : "";
$operation = isset($_POST['operation']) ? $_POST['operation'] : "";

// Create an instance of the Auth class and handle the login operation
$auth = new Auth();
switch ($operation) {
    case "login":
        echo $auth->login($json);
        break;
}
