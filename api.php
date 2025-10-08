<?php
// api.php - Secure Geoapify Proxy for Saudi Tourism Map
header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: *"); // Allow your frontend domain (restrict in production!)
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");

// Your Geoapify API Key (KEEP THIS SECRET!)
define('GEOAPIFY_API_KEY', '636790d9734f4bf2af3a9f2393bdcc1d');

// Only allow specific endpoints
$allowed_endpoints = ['places', 'geocode'];

// Get endpoint from URL: /api.php/places or /api.php/geocode
$request_uri = $_SERVER['REQUEST_URI'];
$path_parts = explode('/', trim(parse_url($request_uri, PHP_URL_PATH), '/'));

// Extract endpoint (e.g., "places")
$endpoint = isset($path_parts[1]) ? $path_parts[1] : null;

if (!$endpoint || !in_array($endpoint, $allowed_endpoints)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid or missing endpoint. Use /places or /geocode']);
    exit;
}

// Validate and sanitize input parameters
function getQueryParam($key, $default = null, $maxLength = 200) {
    $value = $_GET[$key] ?? $default;
    if ($value === null) return null;
    $value = trim($value);
    if (strlen($value) > $maxLength) {
        return substr($value, 0, $maxLength);
    }
    return $value;
}

// Build query parameters
$query_params = [];

if ($endpoint === 'places') {
    $categories = getQueryParam('categories');
    $rect = getQueryParam('rect'); // Expected: "west,south,east,north"
    $limit = min((int)getQueryParam('limit', 100), 100); // Max 100
    $offset = (int)getQueryParam('offset', 0);

    if (!$categories || !$rect) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing required parameters: categories and rect']);
        exit;
    }

    // Validate rect format: 4 comma-separated numbers
    $coords = explode(',', $rect);
    if (count($coords) !== 4) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid rect format. Use: west,south,east,north']);
        exit;
    }

    foreach ($coords as $c) {
        if (!is_numeric($c)) {
            http_response_code(400);
            echo json_encode(['error' => 'Rect coordinates must be numeric']);
            exit;
        }
    }

    $query_params = [
        'categories' => urlencode($categories),
        'filter' => 'rect:' . implode(',', array_map('floatval', $coords)),
        'limit' => $limit,
        'offset' => $offset,
        'apiKey' => GEOAPIFY_API_KEY
    ];

    $url = 'https://api.geoapify.com/v2/places?' . http_build_query($query_params);

} elseif ($endpoint === 'geocode') {
    $text = getQueryParam('text');
    $countrycode = getQueryParam('countrycode', 'sa'); // Default to Saudi Arabia
    $limit = min((int)getQueryParam('limit', 10), 10);

    if (!$text) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing required parameter: text']);
        exit;
    }

    $query_params = [
        'text' => urlencode($text),
        'filter' => 'countrycode:' . $countrycode,
        'limit' => $limit,
        'apiKey' => GEOAPIFY_API_KEY
    ];

    $url = 'https://api.geoapify.com/v1/geocode/search?' . http_build_query($query_params);
}

// Make request to Geoapify
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 10);
curl_setopt($ch, CURLOPT_USERAGENT, 'SaudiTourismMap/1.0');
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);

$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

if ($error) {
    http_response_code(500);
    echo json_encode(['error' => 'Proxy request failed', 'details' => $error]);
    exit;
}
//test
// Return Geoapify's response as-is (with proper status code)
http_response_code($http_code);
echo $response;
?>

