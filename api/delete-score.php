<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

session_start();

$dataFile = '../assets/data/quiz-scores.json';

// Check if admin is logged in
if (!isset($_SESSION['admin_logged_in']) || !$_SESSION['admin_logged_in']) {
    echo json_encode(['success' => false, 'error' => 'Unauthorized']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $scoreId = $input['id'] ?? '';
    
    if (empty($scoreId)) {
        echo json_encode(['success' => false, 'error' => 'Missing score ID']);
        exit;
    }
    
    // Read existing data
    $jsonData = file_get_contents($dataFile);
    $data = json_decode($jsonData, true);
    
    // Find and remove the score
    $found = false;
    $data['scores'] = array_filter($data['scores'], function($score) use ($scoreId, &$found) {
        if ($score['id'] === $scoreId) {
            $found = true;
            return false;
        }
        return true;
    });
    
    // Re-index array
    $data['scores'] = array_values($data['scores']);
    $data['lastUpdated'] = date('Y-m-d H:i:s');
    
    if ($found && file_put_contents($dataFile, json_encode($data, JSON_PRETTY_PRINT))) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Score not found or failed to delete']);
    }
}
?>
