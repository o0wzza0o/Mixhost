<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$file = 'data.json';

// Initialize file if it doesn't exist
if (!file_exists($file)) {
    file_put_contents($file, json_encode(['download_count' => 0]));
}

$data = json_decode(file_get_contents($file), true);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Increment download count
    $data['download_count']++;
    file_put_contents($file, json_encode($data));
}

// Return the current or updated count
echo json_encode(['download_count' => $data['download_count']]);
?>
