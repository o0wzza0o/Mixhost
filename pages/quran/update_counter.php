<?php
// إعدادات الملف
$file = 'data.json';

// التأكد من وجود الملف
if (!file_exists($file)) {
    file_put_contents($file, json_encode(['download_count' => 0]));
}

// قراءة البيانات الحالية
$data = json_decode(file_get_contents($file), true);

// زيادة العداد
$data['download_count'] = (int)$data['download_count'] + 1;

// حفظ البيانات الجديدة
if (file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT))) {
    header('Content-Type: application/json');
    echo json_encode(['status' => 'success', 'new_count' => $data['download_count']]);
} else {
    header('HTTP/1.1 500 Internal Server Error');
    echo json_encode(['status' => 'error', 'message' => 'Failed to write to file']);
}
?>
