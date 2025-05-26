<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\StatisticsController;
use App\Http\Controllers\TeamsController;
use App\Http\Controllers\TeamMemberController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Projects routes
Route::get('/projects', [ProjectController::class, 'index']);
Route::post('/projects', [ProjectController::class, 'store']);
Route::get('/projects/{project}', [ProjectController::class, 'show']);
Route::put('/projects/{project}', [ProjectController::class, 'update']);
Route::delete('/projects/{project}', [ProjectController::class, 'destroy']);

// Dashboard route
Route::get('/dashboard', [DashboardController::class, 'index']);

// Statistics route
Route::get('/statistics', [StatisticsController::class, 'index']);

// Simple test route
Route::get('/test', function() {
    return response()->json(['message' => 'API is working']);
});

// Simple login route
Route::post('/login', function(Request $request) {
    $request->validate([
        'email' => 'required|string|email',
        'password' => 'required|string',
    ]);

    $user = \App\Models\User::where('email', $request->email)->first();
    
    if (!$user || !\Illuminate\Support\Facades\Hash::check($request->password, $user->password)) {
        return response()->json(['message' => 'Invalid credentials'], 401);
    }

    return response()->json([
        'message' => 'Login successful',
        'user' => $user
    ]);
});

// Simple registration route
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

// Teams routes
Route::get('/teams', [TeamsController::class, 'index']);
Route::post('/teams', [TeamsController::class, 'store']);
Route::get('/teams/{team}', [TeamsController::class, 'show']);
Route::put('/teams/{team}', [TeamsController::class, 'update']);
Route::delete('/teams/{team}', [TeamsController::class, 'destroy']);

// Team members routes
Route::get('/team-members', [TeamMemberController::class, 'index']);
Route::post('/team-members', [TeamMemberController::class, 'store']);
Route::get('/team-members/{member}', [TeamMemberController::class, 'show']);
Route::put('/team-members/{member}', [TeamMemberController::class, 'update']);
Route::delete('/team-members/{member}', [TeamMemberController::class, 'destroy']); 