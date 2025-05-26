<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        try {
            $projects = Project::all();
            
            return response()->json([
                'projects' => $projects,
                'total_projects' => $projects->count(),
                'not_started' => $projects->where('status', 'Not Started')->count(),
                'in_progress' => $projects->where('status', 'In Progress')->count(),
                'completed' => $projects->where('status', 'Completed')->count()
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch dashboard data'], 500);
        }
    }
}