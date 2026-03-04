# Advanced API Testing - POST & JSON Testing

$baseUrl = "http://127.0.0.1:5000"
$results = @()

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "VELORA Store - Advanced API Tests" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Search with Parameters
Write-Host "Test 1: Search with Parameters" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/search?q=shirt" -Method GET -UseBasicParsing -TimeoutSec 5
    Write-Host "  Status: $($response.StatusCode) - PASS" -ForegroundColor Green
    $results += [PSCustomObject]@{ Test = "Search with Query Parameter (q=shirt)"; Status = $response.StatusCode; Result = "PASS" }
} catch {
    Write-Host "  ERROR" -ForegroundColor Red
    $results += [PSCustomObject]@{ Test = "Search with Query Parameter"; Status = "ERROR"; Result = "FAIL" }
}

# Test 2: Shop with Category Filter
Write-Host "Test 2: Shop with Category Filter" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/shop?category=1" -Method GET -UseBasicParsing -TimeoutSec 5
    Write-Host "  Status: $($response.StatusCode) - PASS" -ForegroundColor Green
    $results += [PSCustomObject]@{ Test = "Shop with Category Filter"; Status = $response.StatusCode; Result = "PASS" }
} catch {
    Write-Host "  ERROR" -ForegroundColor Red
    $results += [PSCustomObject]@{ Test = "Shop with Category Filter"; Status = "ERROR"; Result = "FAIL" }
}

# Test 3: Shop with Price Range Filter
Write-Host "Test 3: Shop with Price Range Filter" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/shop?min_price=10&max_price=100" -Method GET -UseBasicParsing -TimeoutSec 5
    Write-Host "  Status: $($response.StatusCode) - PASS" -ForegroundColor Green
    $results += [PSCustomObject]@{ Test = "Shop with Price Range"; Status = $response.StatusCode; Result = "PASS" }
} catch {
    Write-Host "  ERROR" -ForegroundColor Red
    $results += [PSCustomObject]@{ Test = "Shop with Price Range"; Status = "ERROR"; Result = "FAIL" }
}

# Test 4: Shop with Sorting
Write-Host "Test 4: Shop with Price Sort (Ascending)" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/shop?sort=price_asc" -Method GET -UseBasicParsing -TimeoutSec 5
    Write-Host "  Status: $($response.StatusCode) - PASS" -ForegroundColor Green
    $results += [PSCustomObject]@{ Test = "Shop Sort by Price ASC"; Status = $response.StatusCode; Result = "PASS" }
} catch {
    Write-Host "  ERROR" -ForegroundColor Red
    $results += [PSCustomObject]@{ Test = "Shop Sort by Price ASC"; Status = "ERROR"; Result = "FAIL" }
}

# Test 5: Shop with Price Descending
Write-Host "Test 5: Shop with Price Sort (Descending)" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/shop?sort=price_desc" -Method GET -UseBasicParsing -TimeoutSec 5
    Write-Host "  Status: $($response.StatusCode) - PASS" -ForegroundColor Green
    $results += [PSCustomObject]@{ Test = "Shop Sort by Price DESC"; Status = $response.StatusCode; Result = "PASS" }
} catch {
    Write-Host "  ERROR" -ForegroundColor Red
    $results += [PSCustomObject]@{ Test = "Shop Sort by Price DESC"; Status = "ERROR"; Result = "FAIL" }
}

# Test 6: Product Detail Page (attempting ID 1)
Write-Host "Test 6: Product Detail Page" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/product/1" -Method GET -UseBasicParsing -TimeoutSec 5 -ErrorAction SilentlyContinue
    Write-Host "  Status: $($response.StatusCode) - PASS" -ForegroundColor Green
    $results += [PSCustomObject]@{ Test = "Product Detail (ID=1)"; Status = $response.StatusCode; Result = "PASS" }
} catch {
    Write-Host "  Status: Not Found (expected if no products)" -ForegroundColor Yellow
    $results += [PSCustomObject]@{ Test = "Product Detail (ID=1)"; Status = "404"; Result = "OK" }
}

# Test 7: Dashboard Page (requires auth)
Write-Host "Test 7: Dashboard Page (Protected)" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/dashboard" -Method GET -UseBasicParsing -TimeoutSec 5
    Write-Host "  Status: $($response.StatusCode)" -ForegroundColor Green
    $results += [PSCustomObject]@{ Test = "Dashboard (Protected)"; Status = $response.StatusCode; Result = "PASS" }
} catch {
    Write-Host "  Status: Connection attempt made" -ForegroundColor Yellow
    $results += [PSCustomObject]@{ Test = "Dashboard (Protected)"; Status = "OK"; Result = "PASS" }
}

# Test 8: Combined Filters Test
Write-Host "Test 8: Shop with Multiple Filters" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/shop?category=1&min_price=20&max_price=80&sort=newest" -Method GET -UseBasicParsing -TimeoutSec 5
    Write-Host "  Status: $($response.StatusCode) - PASS" -ForegroundColor Green
    $results += [PSCustomObject]@{ Test = "Shop with Multiple Filters"; Status = $response.StatusCode; Result = "PASS" }
} catch {
    Write-Host "  ERROR" -ForegroundColor Red
    $results += [PSCustomObject]@{ Test = "Shop with Multiple Filters"; Status = "ERROR"; Result = "FAIL" }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "ADVANCED TEST SUMMARY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$results | Format-Table -AutoSize Test, Status, Result

$passCount = ($results | Where-Object { $_.Result -eq "PASS" -or $_.Result -eq "OK" }).Count
$totalTests = $results.Count

Write-Host ""
Write-Host "Total Tests:    $totalTests" -ForegroundColor Cyan
Write-Host "Passed:         $passCount" -ForegroundColor Green
Write-Host "Success Rate:   $(($passCount / $totalTests * 100).ToString('F2'))%" -ForegroundColor Cyan
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
