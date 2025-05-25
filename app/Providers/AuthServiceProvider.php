<?php

namespace App\Providers;

// use Illuminate\Support\Facades\Gate; // Décommentez si vous utilisez des Gates
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use App\Models\Project;       // <--- Ajoutez cette ligne pour importer votre modèle Project
use App\Policies\ProjectPolicy; // <--- Ajoutez cette ligne pour importer votre ProjectPolicy

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        // 'App\Models\Model' => 'App\Policies\ModelPolicy', // Ligne d'exemple par défaut
        Project::class => ProjectPolicy::class, // <--- C'EST LA LIGNE À AJOUTER OU À MODIFIER
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();

        // Si vous utilisez des Gates, vous les définiriez ici
        // Gate::define('edit-settings', function (User $user) {
        //     return $user->isAdmin;
        // });
    }
}