<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;
use Illuminate\Support\Facades\Log; // <-- Add this

class VerifyCsrfToken extends Middleware
{
    /**
     * The URIs that should be excluded from CSRF verification.
     *
     * @var array<int, string>
     */
    protected $except = [
        '/login',
        '/register',
        '/forgot-password',
        '/reset-password',
    ];

    // Temporarily override this method for debugging
    protected function inExceptArray($request)
    {
        $requestPath = $request->path();
        Log::debug('CSRF Check - Request Path: ' . $requestPath);
        Log::debug('CSRF Check - Except Array: ', $this->except);

        foreach ($this->except as $except) {
            if ($except !== '/') {
                $except = trim($except, '/');
            }
            Log::debug("CSRF Check - Comparing '{$requestPath}' with exception pattern: '{$except}'");
            if ($request->is($except)) {
                Log::debug("CSRF Check - Path '{$requestPath}' IS IN except array (matches '{$except}').");
                return true;
            }
        }
        Log::debug("CSRF Check - Path '{$requestPath}' IS NOT in except array.");
        return false;
    }
}