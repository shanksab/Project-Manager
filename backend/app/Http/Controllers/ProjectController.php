<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class ProjectController extends Controller
{
    public function index()
    {
        return Project::with('tasks')->get();
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|string|in:not_started,in_progress,completed,on_hold',
            'progress' => 'nullable|integer|min:0|max:100',
            'team_members' => 'nullable|array',
            'team_members.*' => 'string',
            'deadline_date' => 'nullable|date'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Log the incoming request data
        \Log::info('Creating project with data:', $request->all());

        $project = Project::create([
            'title' => $request->title,
            'description' => $request->description,
            'status' => $request->status,
            'progress' => $request->progress ?? 0,
            'team_members' => $request->team_members,
            'deadline_date' => $request->deadline_date ? date('Y-m-d', strtotime($request->deadline_date)) : null
        ]);

        // Log the created project
        \Log::info('Created project:', $project->toArray());

        return response()->json($project, 201);
    }

    public function show(Project $project)
    {
        return $project->load('tasks');
    }

    public function update(Request $request, Project $project)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'sometimes|required|string|in:not_started,in_progress,completed,on_hold',
            'progress' => 'nullable|integer|min:0|max:100',
            'team_members' => 'nullable|array',
            'team_members.*' => 'string'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $project->update($request->all());
        return response()->json($project);
    }

    public function destroy(Project $project)
    {
        $project->delete();
        return response()->json(null, 204);
    }
} 