# VELORA Store API Testing Script

$baseUrl = "http://127.0.0.1:5000"
$results = @()

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "VELORA Store API Testing Report" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test endpoints
$endpoints = @(
    @{ Name = "Home Page"; Method = "GET"; Path = "/" },
    @{ Name = "Shop Page"; Method = "GET"; Path = "/shop" },
    @{ Name = "Search"; Method = "GET"; Path = "/search?q=product" },
    @{ Name = "About"; Method = "GET"; Path = "/about" },
    @{ Name = "Features"; Method = "GET"; Path = "/features" },
    @{ Name = "Contact"; Method = "GET"; Path = "/contact" },
    @{ Name = "Help/FAQ"; Method = "GET"; Path = "/help" },
    @{ Name = "Login"; Method = "GET"; Path = "/login" },
    @{ Name = "Register"; Method = "GET"; Path = "/register" },
    @{ Name = "Cart (Protected)"; Method = "GET"; Path = "/cart" },
    @{ Name = "Wishlist (Protected)"; Method = "GET"; Path = "/wishlist" },
    @{ Name = "404 Error"; Method = "GET"; Path = "/nonexistent" }
)

$testNum = 1
foreach ($endpoint in $endpoints) {
    $fullUrl = "$baseUrl$($endpoint.Path)"
    Write-Host "Test $testNum : $($endpoint.Name)" -ForegroundColor Yellow
    
    try {
        $response = Invoke-WebRequest -Uri $fullUrl -Method $endpoint.Method -UseBasicParsing -TimeoutSec 5 -ErrorAction SilentlyContinue
        $statusCode = $response.StatusCode
        
        if ($statusCode -eq 200 -or $statusCode -eq 302 -or $statusCode -eq 404) {
            Write-Host "  Status: $statusCode - PASS" -ForegroundColor Green
            $results += [PSCustomObject]@{ 
                Test = $endpoint.Name
                Status = $statusCode
                Result = "PASS"
            }
        } else {
            Write-Host "  Status: $statusCode - FAIL" -ForegroundColor Red
            $results += [PSCustomObject]@{ 
                Test = $endpoint.Name
                Status = $statusCode
                Result = "FAIL"
            }
        }
    } catch {
        Write-Host "  ERROR: Connection failed" -ForegroundColor Red
        $results += [PSCustomObject]@{ 
            Test = $endpoint.Name
            Status = "ERROR"
            Result = "FAIL"
        }
    }
    
    $testNum++
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "TEST SUMMARY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$results | Format-Table -AutoSize Test, Status, Result

$passCount = ($results | Where-Object { $_.Result -eq "PASS" }).Count
$failCount = ($results | Where-Object { $_.Result -eq "FAIL" }).Count
$totalTests = $results.Count

Write-Host ""
Write-Host "Total Tests:    $totalTests" -ForegroundColor Cyan
Write-Host "Passed:         $passCount" -ForegroundColor Green
Write-Host "Failed:         $failCount" -ForegroundColor Red
Write-Host "Success Rate:   $(($passCount / $totalTests * 100).ToString('F2'))%" -ForegroundColor Cyan
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "DETAILED RESULTS:" -ForegroundColor Cyan
Write-Host ""

$passedTests = $results | Where-Object { $_.Result -eq "PASS" }
$failedTests = $results | Where-Object { $_.Result -eq "FAIL" }

if ($passedTests) {
    Write-Host "PASSED TESTS:" -ForegroundColor Green
    foreach ($test in $passedTests) {
        Write-Host "  Success: $($test.Test) [Status: $($test.Status)]" -ForegroundColor Green
    }
}

Write-Host ""

if ($failedTests) {
    Write-Host "FAILED TESTS:" -ForegroundColor Red
    foreach ($test in $failedTests) {
        Write-Host "  Failed: $($test.Test) [Status: $($test.Status)]" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
