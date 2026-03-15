<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$dataFile = 'data.json';

// Ensure the file exists
if (!file_exists($dataFile)) {
    file_put_contents($dataFile, json_encode(['download_count' => 0]));
}

// Read current data
$data = json_decode(file_get_contents($dataFile), true);

// Check if it's a POST request to increment the count
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data['download_count']++;
    file_put_contents($dataFile, json_encode($data));
}

// Return the current/updated count
echo json_encode(['download_count' => $data['download_count']]);
?>
