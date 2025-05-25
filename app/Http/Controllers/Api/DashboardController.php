<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project; // Nous aurons besoin du modèle Project
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        $userId = Auth::id(); // Récupérer l'ID de l'utilisateur authentifié

        // Nombre total de projets créés par l'utilisateur
        $totalProjects = Project::where('user_id', $userId)->count();

        // Nombre de projets par statut (pour l'utilisateur authentifié)
        $projectsByStatus = Project::where('user_id', $userId)
                                    ->select('status', DB::raw('count(*) as total'))
                                    ->groupBy('status')
                                    ->pluck('total', 'status'); // Résultat: ['pending' => 5, 'active' => 3, ...]

        // 5 derniers projets créés par l'utilisateur
        $recentProjects = Project::where('user_id', $userId)
                                    ->with('user:id,name') // Charger uniquement l'ID et le nom du créateur
                                    ->latest() // Triés par date de création, le plus récent en premier
                                    ->take(5)  // Prendre les 5 premiers
                                    ->get(['id', 'name', 'created_at', 'user_id', 'status']); // Sélectionner les colonnes nécessaires

        // Préparer les données à retourner
        $dashboardData = [
            'total_projects' => $totalProjects,
            'projects_by_status' => $projectsByStatus,
            'recent_projects' => $recentProjects,
            // Nous pourrons ajouter plus de données ici plus tard (ex: statistiques sur les tâches)
        ];

        return response()->json($dashboardData);
    }
}
