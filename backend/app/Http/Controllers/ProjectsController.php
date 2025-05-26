<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ProjectsController extends Controller
{
    public function index()
    {
        try {
            $projects = Project::all();
            return response()->json($projects);
        } catch (\Exception $e) {
            Log::error('Error fetching projects: ' . $e->getMessage());
            return response()->json(['message' => 'Error fetching projects'], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'status' => 'required|string',
                'progress' => 'required|integer|min:0|max:100',
                'due_date' => 'nullable|date',
                'team_members' => 'nullable|array',
                'tasks' => 'nullable|array'
            ]);

            $project = Project::create($validated);
            
            Log::info('Project created successfully', ['project_id' => $project->id]);
            return response()->json([
                'message' => 'Project created successfully',
                'project' => $project
            ], 201);
        } catch (\Exception $e) {
            Log::error('Error creating project: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error creating project',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show(Project $project)
    {
        return response()->json($project);
    }

    public function update(Request $request, Project $project)
    {
        try {
            $validated = $request->validate([
                'title' => 'sometimes|required|string|max:255',
                'description' => 'nullable|string',
                'status' => 'sometimes|required|string',
                'progress' => 'sometimes|required|integer|min:0|max:100',
                'due_date' => 'nullable|date',
                'team_members' => 'nullable|array',
                'tasks' => 'nullable|array'
            ]);

            $project->update($validated);
            
            Log::info('Project updated successfully', ['project_id' => $project->id]);
            return response()->json([
                'message' => 'Project updated successfully',
                'project' => $project
            ]);
        } catch (\Exception $e) {
            Log::error('Error updating project: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error updating project',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy(Project $project)
    {
        try {
            $project->delete();
            Log::info('Project deleted successfully', ['project_id' => $project->id]);
            return response()->json(['message' => 'Project deleted successfully']);
        } catch (\Exception $e) {
            Log::error('Error deleting project: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error deleting project',
                'error' => $e->getMessage()
            ], 500);
        }
    }
} 