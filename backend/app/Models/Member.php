<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Member extends Model
{
    protected $fillable = [
        'name',
        'email',
        'role',
        'department',
        'projects',
        'status'
    ];

    protected $casts = [
        'projects' => 'array'
    ];

    public function teams()
    {
        return $this->belongsToMany(Team::class, 'team_member', 'member_id', 'team_id');
    }
} 