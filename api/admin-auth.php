<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

session_start();

$adminFile = '../assets/data/admin.json';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    $action = $input['action'] ?? '';
    
    if ($action === 'login') {
        $username = $input['username'] ?? '';
        $password = $input['password'] ?? '';
        
        $jsonData = file_get_contents($adminFile);
        $data = json_decode($jsonData, true);
        
        foreach ($data['admins'] as $admin) {
            if ($admin['username'] === $username && $admin['password'] === $password) {
                $_SESSION['admin_logged_in'] = true;
                $_SESSION['admin_username'] = $username;
                echo json_encode(['success' => true]);
                exit;
            }
        }
        
        echo json_encode(['success' => false, 'error' => 'Invalid credentials']);
        
    } elseif ($action === 'check') {
        echo json_encode(['loggedIn' => isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in']]);
        
    } elseif ($action === 'logout') {
        session_destroy();
        echo json_encode(['success' => true]);
    }
}
?>
