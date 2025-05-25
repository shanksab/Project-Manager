<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void // Ou public function up() si vous n'utilisez pas les types de retour PHP 7.4+
{
    Schema::create('projects', function (Blueprint $table) {
        $table->id(); // Crée une colonne ID auto-incrémentée (clé primaire)
        $table->string('name'); // Nom du projet
        $table->text('description')->nullable(); // Description du projet (peut être vide)

        // Clé étrangère pour lier le projet à l'utilisateur qui l'a créé (le Project Manager)
        $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
        // 'constrained('users')' lie à la table 'users'
        // 'onDelete('cascade')' signifie que si l'utilisateur est supprimé, ses projets le seront aussi.
        // Vous pourriez vouloir une autre logique ici, comme 'onDelete('set null')' si user_id peut être nullable.

        $table->date('start_date')->nullable(); // Date de début du projet
        $table->date('end_date')->nullable(); // Date de fin prévue du projet
        $table->string('status')->default('pending'); // Statut du projet (ex: pending, active, completed, on_hold)

        $table->timestamps(); // Crée les colonnes created_at et updated_at
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
