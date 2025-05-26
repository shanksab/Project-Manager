<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'description',
        'status',
        'progress',
        'due_date',
        'team_members'
    ];

    protected $casts = [
        'team_members' => 'array',
        'due_date' => 'date'
    ];
} 