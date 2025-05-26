<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class ProjectController extends Controller
{
    public function index()
    {
        return response()->json(Project::all());
    }

    public function store(Request $request)
    {
        try {
            Log::info('Received project data:', $request->all());
            
            // Validate the request data
            $validator = Validator::make($request->all(), [
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'status' => 'required|string',
                'progress' => 'nullable|integer|min:0|max:100',
                'due_date' => 'required|date',
                'team_members' => 'nullable|array'
            ]);

            if ($validator->fails()) {
                Log::error('Validation failed:', $validator->errors()->toArray());
                return response()->json([
                    'error' => 'Validation failed',
                    'details' => $validator->errors()
                ], 422);
            }

            DB::beginTransaction();
            
            try {
                $project = Project::create([
                    'user_id' => 1, // Default user ID
                    'title' => $request->title,
                    'description' => $request->description,
                    'status' => $request->status,
                    'progress' => $request->progress ?? 0,
                    'due_date' => $request->due_date,
                    'team_members' => $request->team_members ?? []
                ]);

                DB::commit();
                Log::info('Project created successfully:', ['project' => $project]);
                return response()->json($project, 201);
            } catch (\Exception $e) {
                DB::rollBack();
                throw $e;
            }
        } catch (\Exception $e) {
            Log::error('Error creating project: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString(),
                'request_data' => $request->all()
            ]);
            
            return response()->json([
                'error' => 'Failed to create project',
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ], 500);
        }
    }

    public function show(Project $project)
    {
        return response()->json($project);
    }

    public function update(Request $request, Project $project)
    {
        $project->update($request->all());
        return response()->json($project);
    }

    public function destroy(Project $project)
    {
        $project->delete();
        return response()->json(['message' => 'Project deleted']);
    }
} 