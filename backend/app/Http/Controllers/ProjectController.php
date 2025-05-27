<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class ProjectController extends Controller
{
    public function index()
    {
        return Project::with('tasks')->get();
    }

    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'status' => 'required|string|in:not_started,in_progress,completed,on_hold',
                'progress' => 'nullable|integer|min:0|max:100',
                'team_members' => 'nullable|array',
                'deadline_date' => 'nullable|date',
                'tasks' => 'nullable|array'
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            DB::beginTransaction();

            // Create the project
            $project = Project::create([
                'title' => $request->title,
                'description' => $request->description,
                'status' => $request->status,
                'progress' => $request->progress ?? 0,
                'team_members' => $request->team_members,
                'deadline_date' => $request->deadline_date
            ]);

            // Create tasks if provided
            if ($request->has('tasks') && is_array($request->tasks)) {
                foreach ($request->tasks as $task) {
                    if (isset($task['text'])) {
                        Task::create([
                            'project_id' => $project->id,
                            'title' => $task['text'],
                            'status' => false
                        ]);
                    }
                }
            }

            DB::commit();

            return response()->json($project->load('tasks'), 201);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error creating project: ' . $e->getMessage());
            return response()->json(['message' => 'Error creating project', 'error' => $e->getMessage()], 500);
        }
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
            'team_members' => 'nullable|array'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $project->update($request->all());
        return response()->json($project->load('tasks'));
    }

    public function destroy(Project $project)
    {
        $project->delete();
        return response()->json(null, 204);
    }
} 