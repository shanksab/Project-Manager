<?php

namespace App\Policies;

use App\Models\Project;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization; // Pour Laravel 10+

class ProjectPolicy
{
    use HandlesAuthorization; // Si vous utilisez Laravel 10+ et que ce trait a été généré, gardez-le. Sinon, vous pouvez l'omettre et les méthodes retourneront juste true/false.

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        // Un utilisateur authentifié peut tenter de voir la liste des projets.
        // Le filtrage pour ne voir que SES projets est dans la méthode index() du contrôleur.
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Project $project): bool
    {
        // L'utilisateur peut voir le projet si son ID correspond à user_id du projet.
        return $user->id === $project->user_id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        // Tout utilisateur authentifié peut créer un projet.
        return true;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Project $project): bool
    {
        // L'utilisateur peut mettre à jour le projet si son ID correspond à user_id du projet.
        return $user->id === $project->user_id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Project $project): bool
    {
        // L'utilisateur peut supprimer le projet si son ID correspond à user_id du projet.
        return $user->id === $project->user_id;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Project $project): bool
    {
        // Si vous n'utilisez pas SoftDeletes, cette méthode n'est pas cruciale.
        // Mais si vous l'implémentez, la logique serait similaire :
        // return $user->id === $project->user_id;
        return false; // Ou la logique appropriée si vous utilisez SoftDeletes
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Project $project): bool
    {
        // Si vous n'utilisez pas SoftDeletes, cette méthode n'est pas cruciale.
        // return $user->id === $project->user_id;
        return false; // Ou la logique appropriée si vous utilisez SoftDeletes
    }
}