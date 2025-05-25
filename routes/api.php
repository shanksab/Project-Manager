<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProjectController; // Pour vos routes de projets
use App\Http\Controllers\Api\DashboardController;
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

// Inclure les routes d'authentification définies dans routes/auth.php
require __DIR__.'/auth.php';

// Groupe pour les routes qui nécessitent une authentification Sanctum
Route::middleware(['auth:sanctum'])->group(function () {
    // Votre route existante pour /user
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Les routes pour les ressources "projects"
    Route::apiResource('projects', ProjectController::class);
       
    Route::get('/dashboard', [DashboardController::class, 'index']); // Nous appellerons la méthode 'index'
    // Vous pourrez ajouter d'autres routes protégées ici plus tard si besoin
});
