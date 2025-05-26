<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\Request;
use Carbon\Carbon;

class StatisticsController extends Controller
{
    public function index(Request $request)
    {
        try {
            $projects = Project::with('tasks')->get();
            
            // Project Progress Over Time
            $projectProgress = [
                'labels' => $projects->pluck('title'),
                'datasets' => [
                    [
                        'label' => 'Completed Projects',
                        'data' => $projects->pluck('progress'),
                        'borderColor' => 'rgb(59, 130, 246)',
                        'backgroundColor' => 'rgba(59, 130, 246, 0.1)',
                        'fill' => true,
                        'tension' => 0.4,
                    ]
                ]
            ];

            // Task Distribution by Department
            $taskDistribution = [
                'labels' => ['Development', 'Design', 'Marketing', 'Operations', 'Management'],
                'datasets' => [
                    [
                        'data' => [
                            $projects->sum(fn($p) => $p->tasks->where('department', 'Development')->count()),
                            $projects->sum(fn($p) => $p->tasks->where('department', 'Design')->count()),
                            $projects->sum(fn($p) => $p->tasks->where('department', 'Marketing')->count()),
                            $projects->sum(fn($p) => $p->tasks->where('department', 'Operations')->count()),
                            $projects->sum(fn($p) => $p->tasks->where('department', 'Management')->count()),
                        ],
                        'backgroundColor' => [
                            'rgb(59, 130, 246)',
                            'rgb(99, 102, 241)',
                            'rgb(139, 92, 246)',
                            'rgb(168, 85, 247)',
                            'rgb(217, 70, 239)',
                        ],
                        'borderWidth' => 0,
                    ]
                ]
            ];

            // Team Performance Metrics
            $teamPerformance = [
                'labels' => ['Productivity', 'Quality', 'Timeliness', 'Collaboration', 'Innovation'],
                'datasets' => [
                    [
                        'label' => 'Current Performance',
                        'data' => [85, 90, 75, 88, 82],
                        'backgroundColor' => 'rgba(59, 130, 246, 0.2)',
                        'borderColor' => 'rgb(59, 130, 246)',
                        'pointBackgroundColor' => 'rgb(59, 130, 246)',
                        'pointBorderColor' => '#fff',
                    ]
                ]
            ];

            // Monthly Task Completion
            $lastSixMonths = collect(range(5, 0))->map(function ($month) {
                return Carbon::now()->subMonths($month)->format('M Y');
            });

            $taskCompletion = [
                'labels' => $lastSixMonths,
                'datasets' => [
                    [
                        'label' => 'Completed Tasks',
                        'data' => [12, 15, 8, 10, 14, 9],
                        'backgroundColor' => 'rgba(59, 130, 246, 0.8)',
                    ],
                    [
                        'label' => 'New Tasks',
                        'data' => [8, 10, 12, 9, 11, 13],
                        'backgroundColor' => 'rgba(99, 102, 241, 0.8)',
                    ]
                ]
            ];

            return response()->json([
                'projectProgress' => $projectProgress,
                'taskDistribution' => $taskDistribution,
                'teamPerformance' => $teamPerformance,
                'taskCompletion' => $taskCompletion
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch statistics'], 500);
        }
    }
} 