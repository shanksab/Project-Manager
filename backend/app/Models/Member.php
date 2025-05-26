<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Member extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'role',
        'department',
        'skills',
        'status'
    ];

    protected $casts = [
        'skills' => 'array'
    ];

    public function teams()
    {
        return $this->belongsToMany(Team::class, 'team_member', 'member_id', 'team_id');
    }
} 