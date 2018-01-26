<?php
header('Content-Type: application/json');

// database settings
$server = 'localhost';
$database = 'yoga';
$user = 'root';
$pass = 'root';

// connect to database
$mysqli = new mysqli($server, $user, $pass, $database);
if($mysqli->connect_errno) {
  http_response_code(500);
  exit();
}
$mysqli->set_charset("utf8");

// -------------------------------
// CONTROLLER
// -------------------------------

// process only POST requests
if($_SERVER['REQUEST_METHOD'] == 'POST') {

  $data = json_decode(file_get_contents('php://input'), true);

  if(array_key_exists('function', $data)) {
    call_user_func($data['function'], $data['data']); // turns string into function call
  } else {
    http_response_code(500);
    exit();
  }

} else {
  http_response_code(500);
  exit();
}

// -------------------------------
// MODEL
// -------------------------------

// get all notes or a single note if id is present
function get($data) {
  global $mysqli;

  $t = date("Y-m-d H:i:s");

  if (array_key_exists('instructor', $data) && $data['instructor'] != '') {
    $instructor = $mysqli->real_escape_string($data['instructor']);

    $sql = "SELECT * FROM `classes` WHERE `instructor` = '$instructor' AND `date` >= '$t'";
  } else {
    $sql = "SELECT * FROM `classes` WHERE `date` >= '$t' ORDER BY `date`";
  }

  // echo $sql;

  $json = array();
  if($result = $mysqli->query($sql)) {

    while($row = $result->fetch_array(MYSQLI_ASSOC)) {
      $json[] = $row;
    }

    echo json_encode($json);
  }
}

// updates existing note
function reserve($data) {
  global $mysqli;

  if (array_key_exists('email', $data) && array_key_exists('email', $data)) {

    $id = filter_var($data['id'], FILTER_VALIDATE_INT);
    $email = filter_var($data['email'], FILTER_VALIDATE_EMAIL);

    $errors = array();

    if (!$id) {
      $errors['id'] = "Invalid ID";
    }

    if (!$email) {
      $errors['email'] = "Invalid Email";
    }

    if (sizeof($errors) > 0) {
      http_response_code(422);
      echo json_encode($errors);
      exit();
    }

    $sql = "INSERT INTO `reservations` (`class_id`, `email`) VALUES ('$id', '$email')";
    $mysqli->query($sql);

    echo "{}";

  } else {
    // 422 code
    http_response_code(422);
    exit();
  }
}

// updates existing note
function create($data) {
  global $mysqli;

  if (array_key_exists('date', $data) && array_key_exists('duration', $data) && array_key_exists('style', $data) && array_key_exists('instructor', $data)) {

    $date = date("Y-m-d H:i:s", $data['date']);
    $duration = $data['duration'];
    $style = $mysqli->real_escape_string($data['style']);
    $instructor = $mysqli->real_escape_string($data['instructor']);

    $sql = "INSERT INTO `classes` (`date`, `duration`, `style`, `instructor`) VALUES ('$date', $duration, '$style', '$instructor')";
    $mysqli->query($sql) or die(mysqli_error($mysqli));

    echo "{}";

  } else {
    // 422 code
    http_response_code(422);
    exit();
  }
}

// deletes a note
function remove($data) {
  global $mysqli;

  if (array_key_exists('id', $data)) {

    $id = $mysqli->real_escape_string($data['id']);

    $sql = "DELETE FROM `classes` WHERE `id` = '$id'";
    $mysqli->query($sql);

    echo "{}";

  } else {
    // 422 code
    http_response_code(422);
    exit();
  }
}

// deletes a note
function login($data) {
  global $mysqli;

  if (array_key_exists('email', $data) && array_key_exists('password', $data)) {

    // echo json_encode($data);

    $email = $mysqli->real_escape_string($data['email']);

    $sql = "SELECT * FROM `users` WHERE `email` = '$email' AND `is_admin` = TRUE";
    // echo $sql;
    $result = $mysqli->query($sql);

    $row = $result->fetch_array(MYSQLI_ASSOC);

    if (!row) {
      http_response_code(422);
      echo '{}';
      exit();
    }

    if (password_verify( $data['password'] , $row['password'] )) {
      echo '{}';
      exit();
    }

    http_response_code(422);
    echo '{}';
    exit();

  } else {
    // 422 code
    http_response_code(422);
    exit();
  }
}

// deletes a note
function markfull($data) {
  global $mysqli;

  if (array_key_exists('id', $data)) {

    $id = $mysqli->real_escape_string($data['id']);
    $value = $mysqli->real_escape_string($data['value']);

    $sql = "UPDATE `classes` SET `full` = '$value' WHERE `id` = '$id'";
    $mysqli->query($sql);

    echo "{}";

  } else {
    // 422 code
    http_response_code(422);
    exit();
  }
}

?>
