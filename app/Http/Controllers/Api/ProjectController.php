<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project; // Assurez-vous que Project est bien importé
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth; // Auth est toujours utile pour récupérer l'user_id lors de la création
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class ProjectController extends Controller
{
    use AuthorizesRequests;

    /**
     * Display a listing of the resource.
     * La policy 'viewAny' est vérifiée si vous utilisez $this->authorizeResource() dans le constructeur.
     * Pour l'instant, notre filtrage par Auth::id() et la protection de route par 'auth:sanctum' suffisent pour l'index.
     * Vous pourriez ajouter $this->authorize('viewAny', Project::class); ici si vous voulez être plus explicite.
     */
    public function index()
    {
        // Optionnel : $this->authorize('viewAny', Project::class);
        $projects = Project::where('user_id', Auth::id())
                            ->with('user') // Pour être optimal, vous pourriez faire ->with('user:id,name')
                            ->latest()
                            ->get(); // Pour être optimal, vous pourriez faire ->get(['id', 'name', ...colonnes nécessaires...])
        return response()->json($projects);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Utiliser la Policy pour vérifier si l'utilisateur peut créer un projet
        $this->authorize('create', Project::class);

        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'status' => 'sometimes|string|in:pending,active,completed,on_hold',
        ]);

        $projectData = array_merge($validatedData, ['user_id' => Auth::id()]);
        $project = Project::create($projectData);
        $project->load('user'); // Charger l'utilisateur pour une réponse cohérente

        return response()->json($project, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Project $project) // $project est injecté grâce au Route Model Binding
    {
        // Utiliser la Policy pour vérifier si l'utilisateur peut voir ce projet spécifique
        $this->authorize('view', $project);

        $project->load('user');
        return response()->json($project);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Project $project) // $project est injecté
    {
        // Utiliser la Policy pour vérifier si l'utilisateur peut mettre à jour ce projet
        $this->authorize('update', $project);

        // La vérification manuelle 'if (Auth::id() !== $project->user_id)' EST SUPPRIMÉE ICI

        $validatedData = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|nullable|string',
            'start_date' => 'sometimes|nullable|date',
            'end_date' => 'sometimes|nullable|date|after_or_equal:start_date',
            'status' => 'sometimes|required|string|in:pending,active,completed,on_hold',
        ]);

        $project->update($validatedData);
        $project->load('user');

        return response()->json($project);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project) // $project est injecté
    {
        // Utiliser la Policy pour vérifier si l'utilisateur peut supprimer ce projet
        $this->authorize('delete', $project);

        // La vérification manuelle 'if (Auth::id() !== $project->user_id)' EST SUPPRIMÉE ICI

        $project->delete();
        return response()->noContent();
    }
}