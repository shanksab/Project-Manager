<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Team;
use App\Models\Member;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        // Get all data needed for dashboard
        $data = [
            'projects' => Project::all(),
            'teams' => Team::all(),
            'members' => Member::all(),
            'stats' => [
                'total_projects' => Project::count(),
                'total_tasks' => Project::sum('progress'),
                'completion_rate' => Project::avg('progress'),
                'total_members' => Member::count(),
            ]
        ];

        return response()->json($data);
    }
} 