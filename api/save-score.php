<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET');
header('Access-Control-Allow-Headers: Content-Type');

$dataFile = '../assets/data/quiz-scores.json';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['name']) || !isset($input['score']) || !isset($input['quiz'])) {
        echo json_encode(['success' => false, 'error' => 'Missing required fields']);
        exit;
    }
    
    // Read existing data
    $jsonData = file_exists($dataFile) ? file_get_contents($dataFile) : '{"scores":[]}';
    $data = json_decode($jsonData, true);
    
    // Add new score
    $newScore = [
        'id' => uniqid(),
        'name' => htmlspecialchars($input['name']),
        'score' => intval($input['score']),
        'total' => intval($input['total']),
        'percentage' => round(($input['score'] / $input['total']) * 100),
        'quiz' => $input['quiz'],
        'date' => date('Y-m-d H:i:s'),
        'ip' => $_SERVER['REMOTE_ADDR']
    ];
    
    $data['scores'][] = $newScore;
    $data['lastUpdated'] = date('Y-m-d H:i:s');
    
    // Save back to file
    if (file_put_contents($dataFile, json_encode($data, JSON_PRETTY_PRINT))) {
        echo json_encode(['success' => true, 'id' => $newScore['id']]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Failed to save']);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Return all scores sorted by score desc
    $jsonData = file_exists($dataFile) ? file_get_contents($dataFile) : '{"scores":[]}';
    $data = json_decode($jsonData, true);
    
    // Sort by score descending
    usort($data['scores'], function($a, $b) {
        return $b['score'] - $a['score'];
    });
    
    echo json_encode($data);
}
?>
