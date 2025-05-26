<?php

namespace App\Http\Controllers;

use App\Models\Team;
use App\Models\Member;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TeamsController extends Controller
{
    public function index()
    {
        $teams = Team::with('members')->get();
        return response()->json($teams);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'members' => 'array'
            ]);

            // Create the team with just name and members
            $team = Team::create([
                'name' => $validated['name'],
                'members' => $validated['members'] ?? [],
                'projects' => [],
                'lead_id' => null
            ]);

            return response()->json([
                'message' => 'Team created successfully',
                'team' => $team
            ], 201);

        } catch (\Exception $e) {
            Log::error('Team creation failed: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error creating team',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show(Team $team)
    {
        return response()->json($team->load('members'));
    }

    public function update(Request $request, Team $team)
    {
        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'members' => 'sometimes|required|array',
            'projects' => 'sometimes|nullable|array'
        ]);

        DB::beginTransaction();
        try {
            $team->update($request->only(['name', 'members', 'projects']));

            // Sync team members if provided
            if ($request->has('members')) {
                $team->members()->sync($request->members);
            }

            DB::commit();
            return response()->json([
                'message' => 'Team updated successfully',
                'team' => $team->load('members')
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Error updating team',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy(Team $team)
    {
        try {
            $team->delete();
            return response()->json([
                'message' => 'Team deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error deleting team',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getMembers()
    {
        $members = Member::select('id', 'name', 'email', 'role', 'department', 'status')
            ->get();
        return response()->json($members);
    }

    public function addMember(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|max:255|unique:members',
                'role' => 'required|string|max:255',
                'department' => 'required|string|max:255'
            ]);

            $member = Member::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'role' => $validated['role'],
                'department' => $validated['department'],
                'projects' => [],
                'status' => 'active'
            ]);

            return response()->json([
                'message' => 'Member added successfully',
                'member' => $member
            ], 201);

        } catch (\Exception $e) {
            Log::error('Member creation failed: ' . $e->getMessage());
            return response()->json([
                'message' => 'Error adding member',
                'error' => $e->getMessage()
            ], 500);
        }
    }
} 