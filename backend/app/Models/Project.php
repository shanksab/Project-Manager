<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'status',
        'progress',
        'team_members',
        'deadline_date'
    ];

    protected $casts = [
        'team_members' => 'array',
        'progress' => 'integer',
        'deadline_date' => 'date'
    ];

    public function tasks(): HasMany
    {
        return $this->hasMany(Task::class);
    }
} 