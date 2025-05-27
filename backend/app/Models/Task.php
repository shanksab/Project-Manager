<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'status',
        'project_id'
    ];

    protected $casts = [
        'status' => 'boolean'
    ];

    const STATUS_FINISHED = true;
    const STATUS_NOT_FINISHED = false;

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
} 