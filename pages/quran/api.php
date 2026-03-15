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

// Initialize data array
$data = ["download_count" => 0];

// Read existing data if the file exists
if (file_exists($dataFile)) {
    $json = file_get_contents($dataFile);
    if ($json) {
        $decoded = json_decode($json, true);
        if ($decoded && isset($decoded['download_count'])) {
            $data['download_count'] = (int)$decoded['download_count'];
        }
    }
} else {
    // Attempt to create the initial file
    if (!@file_put_contents($dataFile, json_encode($data))) {
        http_response_code(500);
        echo json_encode(["error" => "Cannot create data.json. Check folder permissions."]);
        exit();
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Increment the count safely using file locking
    $fp = fopen($dataFile, 'c+');
    
    if ($fp) {
        if (flock($fp, LOCK_EX)) {  // Acquire an exclusive lock
            // Read current data
            $size = filesize($dataFile);
            $json = $size > 0 ? fread($fp, $size) : '';
            $decoded = json_decode($json, true);
            
            $currentCount = 0;
            if ($decoded && isset($decoded['download_count'])) {
                $currentCount = (int)$decoded['download_count'];
            }
            
            // Increment
            $currentCount++;
            
            // Write new data
            ftruncate($fp, 0);      // Truncate file
            rewind($fp);           // Go back to the beginning
            fwrite($fp, json_encode(["download_count" => $currentCount]));
            fflush($fp);            // Flush output
            flock($fp, LOCK_UN);    // Release the lock
            
            echo json_encode(["success" => true, "download_count" => $currentCount]);
        } else {
            http_response_code(500);
            echo json_encode(["error" => "Could not lock the file for writing."]);
        }
        fclose($fp);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Cannot open data.json for writing. Check permissions."]);
    }
    
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Return current count
    echo json_encode(["success" => true, "download_count" => $data['download_count']]);
} else {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
}
?>
