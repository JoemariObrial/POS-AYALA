<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

class Auth
{
    function login($json)
    {
        include 'conn-pdo.php';

        $json = json_decode($json, true);

        // Ensure proper sanitization and validation of input
        $username = htmlspecialchars($json['username']);
        $password = htmlspecialchars($json['password']);
        $role = htmlspecialchars($json['role']);

        $sql = "SELECT * FROM ayala WHERE username = :username AND pword = :password AND role = :role";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':username', $username);
        $stmt->bindParam(':password', $password);
        $stmt->bindParam(':role', $role);
        $stmt->execute();

        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        unset($conn);
        unset($stmt);

        if ($user) {
            return json_encode($user); // Return user data if found
        } else {
            return json_encode([]); // Return empty array if no match
        }
    }
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $operation = $data['operation'];
    $json = $data['json'];

    // Create an instance of the Auth class and handle the login operation
    $auth = new Auth();
    switch ($operation) {
        case "login":
            echo $auth->login($json);
            break;
    }
}
?>