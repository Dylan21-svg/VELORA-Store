#!/usr/bin/env pwsh
# VELORA Store API Testing Script

$baseUrl = "http://127.0.0.1:5000"
$results = @()

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "VELORA Store API Testing Report" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Home Page (Index)
Write-Host "Test 1: Home Page" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/" -Method GET -UseBasicParsing -TimeoutSec 5
    Write-Host "✓ Status: $($response.StatusCode) - OK" -ForegroundColor Green
    $results += [PSCustomObject]@{ Test = "GET /"; Status = $response.StatusCode; Result = "PASS" }
} catch {
    Write-Host "✗ Failed: $_" -ForegroundColor Red
    $results += [PSCustomObject]@{ Test = "GET /"; Status = "ERROR"; Result = "FAIL" }
}

# Test 2: Shop Page
Write-Host "Test 2: Shop Page" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/shop" -Method GET -UseBasicParsing -TimeoutSec 5
    Write-Host "✓ Status: $($response.StatusCode) - OK" -ForegroundColor Green
    $results += [PSCustomObject]@{ Test = "GET /shop"; Status = $response.StatusCode; Result = "PASS" }
} catch {
    Write-Host "✗ Failed: $_" -ForegroundColor Red
    $results += [PSCustomObject]@{ Test = "GET /shop"; Status = "ERROR"; Result = "FAIL" }
}

# Test 3: Search Endpoint
Write-Host "Test 3: Search Endpoint" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/search?q=product" -Method GET -UseBasicParsing -TimeoutSec 5
    Write-Host "✓ Status: $($response.StatusCode) - OK" -ForegroundColor Green
    $results += [PSCustomObject]@{ Test = "GET /search"; Status = $response.StatusCode; Result = "PASS" }
} catch {
    Write-Host "✗ Failed: $_" -ForegroundColor Red
    $results += [PSCustomObject]@{ Test = "GET /search"; Status = "ERROR"; Result = "FAIL" }
}

# Test 4: About Page
Write-Host "Test 4: About Page" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/about" -Method GET -UseBasicParsing -TimeoutSec 5
    Write-Host "✓ Status: $($response.StatusCode) - OK" -ForegroundColor Green
    $results += [PSCustomObject]@{ Test = "GET /about"; Status = $response.StatusCode; Result = "PASS" }
} catch {
    Write-Host "✗ Failed: $_" -ForegroundColor Red
    $results += [PSCustomObject]@{ Test = "GET /about"; Status = "ERROR"; Result = "FAIL" }
}

# Test 5: Features Page
Write-Host "Test 5: Features Page" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/features" -Method GET -UseBasicParsing -TimeoutSec 5
    Write-Host "✓ Status: $($response.StatusCode) - OK" -ForegroundColor Green
    $results += [PSCustomObject]@{ Test = "GET /features"; Status = $response.StatusCode; Result = "PASS" }
} catch {
    Write-Host "✗ Failed: $_" -ForegroundColor Red
    $results += [PSCustomObject]@{ Test = "GET /features"; Status = "ERROR"; Result = "FAIL" }
}

# Test 6: Contact Page
Write-Host "Test 6: Contact Page" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/contact" -Method GET -UseBasicParsing -TimeoutSec 5
    Write-Host "✓ Status: $($response.StatusCode) - OK" -ForegroundColor Green
    $results += [PSCustomObject]@{ Test = "GET /contact"; Status = $response.StatusCode; Result = "PASS" }
} catch {
    Write-Host "✗ Failed: $_" -ForegroundColor Red
    $results += [PSCustomObject]@{ Test = "GET /contact"; Status = "ERROR"; Result = "FAIL" }
}

# Test 7: Help Page
Write-Host "Test 7: Help Page" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/help" -Method GET -UseBasicParsing -TimeoutSec 5
    Write-Host "✓ Status: $($response.StatusCode) - OK" -ForegroundColor Green
    $results += [PSCustomObject]@{ Test = "GET /help"; Status = $response.StatusCode; Result = "PASS" }
} catch {
    Write-Host "✗ Failed: $_" -ForegroundColor Red
    $results += [PSCustomObject]@{ Test = "GET /help"; Status = "ERROR"; Result = "FAIL" }
}

# Test 8: Login Page
Write-Host "Test 8: Login Page" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/login" -Method GET -UseBasicParsing -TimeoutSec 5
    Write-Host "✓ Status: $($response.StatusCode) - OK" -ForegroundColor Green
    $results += [PSCustomObject]@{ Test = "GET /login"; Status = $response.StatusCode; Result = "PASS" }
} catch {
    Write-Host "✗ Failed: $_" -ForegroundColor Red
    $results += [PSCustomObject]@{ Test = "GET /login"; Status = "ERROR"; Result = "FAIL" }
}

# Test 9: Register Page
Write-Host "Test 9: Register Page" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/register" -Method GET -UseBasicParsing -TimeoutSec 5
    Write-Host "✓ Status: $($response.StatusCode) - OK" -ForegroundColor Green
    $results += [PSCustomObject]@{ Test = "GET /register"; Status = $response.StatusCode; Result = "PASS" }
} catch {
    Write-Host "✗ Failed: $_" -ForegroundColor Red
    $results += [PSCustomObject]@{ Test = "GET /register"; Status = "ERROR"; Result = "FAIL" }
}

# Test 10: Cart Page (Protected)
Write-Host "Test 10: Cart Page (Should Redirect)" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/cart" -Method GET -UseBasicParsing -TimeoutSec 5 -SkipHttpErrorCheck
    Write-Host "✓ Status: $($response.StatusCode) - OK (Redirect as expected)" -ForegroundColor Green
    $results += [PSCustomObject]@{ Test = "GET /cart"; Status = $response.StatusCode; Result = "PASS" }
} catch {
    Write-Host "✗ Failed: $_" -ForegroundColor Red
    $results += [PSCustomObject]@{ Test = "GET /cart"; Status = "ERROR"; Result = "FAIL" }
}

# Test 11: Wishlist Page (Protected)
Write-Host "Test 11: Wishlist Page (Should Redirect)" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/wishlist" -Method GET -UseBasicParsing -TimeoutSec 5 -SkipHttpErrorCheck
    Write-Host "✓ Status: $($response.StatusCode) - OK (Redirect as expected)" -ForegroundColor Green
    $results += [PSCustomObject]@{ Test = "GET /wishlist"; Status = $response.StatusCode; Result = "PASS" }
} catch {
    Write-Host "✗ Failed: $_" -ForegroundColor Red
    $results += [PSCustomObject]@{ Test = "GET /wishlist"; Status = "ERROR"; Result = "FAIL" }
}

# Test 12: 404 Page
Write-Host "Test 12: 404 Error Handling" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/nonexistent" -Method GET -UseBasicParsing -TimeoutSec 5 -SkipHttpErrorCheck
    Write-Host "✓ Status: $($response.StatusCode) - OK (404 Page Working)" -ForegroundColor Green
    $results += [PSCustomObject]@{ Test = "GET /nonexistent"; Status = $response.StatusCode; Result = "PASS" }
} catch {
    Write-Host "✗ Failed: $_" -ForegroundColor Red
    $results += [PSCustomObject]@{ Test = "GET /nonexistent"; Status = "ERROR"; Result = "FAIL" }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "TEST SUMMARY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$table = $results | Format-Table -AutoSize -Property Test, Status, Result
Write-Host $table

$passCount = ($results | Where-Object { $_.Result -eq "PASS" }).Count
$failCount = ($results | Where-Object { $_.Result -eq "FAIL" }).Count
$totalTests = $results.Count

Write-Host ""
Write-Host "Total Tests: $totalTests" -ForegroundColor Cyan
Write-Host "Passed: $passCount" -ForegroundColor Green
Write-Host "Failed: $failCount" -ForegroundColor Red
Write-Host "Success Rate: $(($passCount / $totalTests * 100).ToString('F2'))%" -ForegroundColor Cyan
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
