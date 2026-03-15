<?php
// Handle CORS (Cross-Origin Resource Sharing)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Handle OPTIONS preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Absolute path to the data file in the same directory
$dataFile = __DIR__ . '/data.json';

// Function to get current data safely
function getCurrentData($file) {
    if (!file_exists($file)) return ["download_count" => 0];
    
    $json = file_get_contents($file);
    if (!$json) return ["download_count" => 0];
    
    $decoded = json_decode($json, true);
    if ($decoded && isset($decoded['download_count'])) {
        return ["download_count" => (int)$decoded['download_count']];
    }
    
    return ["download_count" => 0];
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = getCurrentData($dataFile);
    $data['download_count']++; // Increment
    
    // Save new data using LOCK_EX to prevent write collisions
    if (file_put_contents($dataFile, json_encode($data), LOCK_EX) !== false) {
        echo json_encode(["success" => true, "download_count" => $data['download_count']]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Cannot write to data.json. Check folder permissions."]);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $data = getCurrentData($dataFile);
    echo json_encode(["success" => true, "download_count" => $data['download_count']]);
} else {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
}
?>
