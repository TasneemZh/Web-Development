<?php
header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Headers: Content-Type');
$rest_json = file_get_contents("php://input");
$_POST = json_decode($rest_json, true);

$message = $_POST['message'];

$serverName = "localhost";
$username = "root";
$password = "root";
$databaseName = "my_app";
$usertable = "my_app_tb";

$conn = mysqli_connect($serverName, $username, $password, $databaseName);

$query = "INSERT INTO $usertable (texts) VALUES ('{$message}')";

if (mysqli_query($conn, $query)) {
  echo nl2br("Data has been added to the query!\n\n");

  //Setup our query
  $query = "SELECT * FROM $usertable";

  //Run the Query
  $result = mysqli_query($conn, $query);
}

if ($_POST){
echo json_encode(
    [
       "sent" => true,
       "message" => 'Success!'
    ]
);
}
?>
