<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo; // Pour la relation avec User
use Illuminate\Database\Eloquent\Relations\HasMany;   // Pour la relation avec Tasks (plus tard)

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'start_date',
        'end_date',
        'status',
        'user_id', // Très important d'ajouter user_id ici !
    ];

    // Relation: Un projet appartient à un utilisateur (créateur)
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Relation: Un projet peut avoir plusieurs tâches (nous ajouterons cela plus tard)
    // public function tasks(): HasMany
    // {
    //     return $this->hasMany(Task::class);
    // }
}