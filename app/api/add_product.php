<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

class Product
{
    function save($json)
    {
        include 'conn-pdo.php';
        $json = json_decode($json, true);

        // Ensure proper sanitization and validation of input
        $prod_name = htmlspecialchars($json['name']);
        $prdo_code = htmlspecialchars($json['code']);
        $prod_price = htmlspecialchars($json['price']);

        $sql = "INSERT INTO centrio (prod_name, prod_code, prod_price)
                VALUES (:name, :code, :price)";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':name', $json['name']);
        $stmt->bindParam(':code', $json['code']);
        $stmt->bindParam(':price', $json['price']);
        $stmt->execute();
        $returnValue = $stmt->rowCount() > 0 ? 1 : 0;

        if ($returnValue) {
            http_response_code(200); // Success
        } else {
            http_response_code(500); // Failure
        }

        return json_encode($returnValue);
    }

    function getproduct()
    {
        include 'conn-pdo.php';

        // Prepare the SQL query to select all records
        $sql = "SELECT * FROM centrio ORDER BY prod_code";
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $returnValue = $stmt->fetchAll(PDO::FETCH_ASSOC);
        unset($conn);
        unset($stmt);
        return json_encode($returnValue);
    }
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $operation = $_POST['operation'];
    $json = $_POST['json'];

    $product = new Product();
    switch ($operation) {
        case 'save':
            echo $product->save($json);
            break;
        case 'getproduct':
            echo $product->getproduct();
            break;
        default:
            http_response_code(400); // Bad request if the operation is not recognized
            echo json_encode(0); // Operation not found
            break;
    }
}
?>