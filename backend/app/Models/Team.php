<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Team extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'members'
    ];

    protected $casts = [
        'members' => 'array'
    ];

    public function lead()
    {
        return $this->belongsTo(User::class, 'lead_id');
    }

    public function members()
    {
        return $this->belongsToMany(Member::class, 'team_member', 'team_id', 'member_id');
    }
} 