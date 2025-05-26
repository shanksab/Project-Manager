<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\ProjectController;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\TeamsController;
use App\Http\Controllers\ProjectsController;
use App\Http\Controllers\DashboardController;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Test route
Route::get('/test', function() {
    return response()->json(['message' => 'API is working']);
});

// Simple registration route without any middleware
Route::post('/register', function(Request $request) {
    $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|string|email|max:255|unique:users',
        'password' => 'required|string|min:6',
    ]);

    $user = \App\Models\User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => \Illuminate\Support\Facades\Hash::make($request->password),
    ]);

    return response()->json([
        'message' => 'User registered successfully',
        'user' => $user
    ], 201);
});

// Simple login route without any middleware
Route::post('/login', function(Request $request) {
    $request->validate([
        'email' => 'required|string|email',
        'password' => 'required|string',
    ]);

    if (Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
        $user = Auth::user();
        return response()->json([
            'message' => 'Login successful',
            'user' => $user
        ]);
    }

    return response()->json([
        'message' => 'Invalid credentials'
    ], 401);
});

// Projects routes
Route::get('/projects', [ProjectsController::class, 'index']);
Route::post('/projects', [ProjectsController::class, 'store']);
Route::get('/projects/{project}', [ProjectsController::class, 'show']);
Route::put('/projects/{project}', [ProjectsController::class, 'update']);
Route::delete('/projects/{project}', [ProjectsController::class, 'destroy']);

// Team routes
Route::get('/teams', [TeamsController::class, 'index']);
Route::post('/teams', [TeamsController::class, 'store']);
Route::get('/teams/{team}', [TeamsController::class, 'show']);
Route::put('/teams/{team}', [TeamsController::class, 'update']);
Route::delete('/teams/{team}', [TeamsController::class, 'destroy']);
Route::get('/team-members', [TeamsController::class, 'getMembers']);
Route::post('/team-members', [TeamsController::class, 'addMember']);

// Dashboard route
Route::get('/dashboard', [DashboardController::class, 'index']); 