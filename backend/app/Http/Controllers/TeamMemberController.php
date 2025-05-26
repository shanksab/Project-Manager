<?php

namespace App\Http\Controllers;

use App\Models\Member;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TeamMemberController extends Controller
{
    public function index()
    {
        return Member::all();
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'role' => 'required|string|max:255',
            'department' => 'required|string|max:255',
            'skills' => 'nullable|array'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $member = Member::create([
            'name' => $request->name,
            'email' => $request->email,
            'role' => $request->role,
            'department' => $request->department,
            'skills' => $request->skills ?? [],
            'status' => 'active'
        ]);

        return response()->json(['member' => $member], 201);
    }

    public function show(Member $member)
    {
        return $member;
    }

    public function update(Request $request, Member $member)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|max:255',
            'role' => 'sometimes|required|string|max:255',
            'department' => 'sometimes|required|string|max:255',
            'skills' => 'nullable|array',
            'status' => 'sometimes|required|string|in:active,inactive'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $member->update($request->all());
        return response()->json(['member' => $member]);
    }

    public function destroy(Member $member)
    {
        $member->delete();
        return response()->json(null, 204);
    }
} 