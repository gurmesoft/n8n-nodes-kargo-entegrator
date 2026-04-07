<?php

// Read the current DISTRICTS data and convert it to proper PHP format
$file = file_get_contents('web/app/Services/ValidateAddress/Client.php');

// Extract all district entries with regex
preg_match_all('/\{ id: "(\d+)", cityId: "(\d+)", name: "([^"]+)" \}/', $file, $matches, PREG_SET_ORDER);

// Group districts by cityId
$districts_by_city = [];
foreach ($matches as $match) {
    $cityId = $match[2];
    $name = $match[3];

    if (!isset($districts_by_city[$cityId])) {
        $districts_by_city[$cityId] = [];
    }
    $districts_by_city[$cityId][] = $name;
}

// Sort by city ID
ksort($districts_by_city);

// Generate the new PHP array format
$output = "    private const DISTRICTS = [\n";
foreach ($districts_by_city as $cityId => $districts) {
    $output .= "        '$cityId' => [\n";
    foreach ($districts as $district) {
        $output .= "            '$district',\n";
    }
    $output .= "        ],\n";
}
$output .= "    ];\n";

// Write the converted format to a file
file_put_contents('districts_converted.txt', $output);

echo "Conversion completed. Check districts_converted.txt for the result.\n";
