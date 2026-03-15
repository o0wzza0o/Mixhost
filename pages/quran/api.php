<?php
// Path to the data file
$dataFile = 'data.json';

// Initialize default data if file doesn't exist or is empty
if (!file_exists($dataFile)) {
    $data = ["download_count" => 0];
    file_put_contents($dataFile, json_encode($data));
} else {
    $json = file_get_contents($dataFile);
    $data = json_decode($json, true);
    if (!isset($data['download_count'])) {
        $data['download_count'] = 0;
    }
}

// Set headers for JSON response
header('Content-Type: application/json');

// Check the request method
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Increment the count
    $data['download_count']++;
    file_put_contents($dataFile, json_encode($data));
    echo json_encode(["success" => true, "download_count" => $data['download_count']]);
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Just return the current count
    echo json_encode(["success" => true, "download_count" => $data['download_count']]);
} else {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
}
?>
