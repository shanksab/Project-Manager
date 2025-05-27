<?php

namespace App\Http\Controllers;

use App\Models\CalendarEvent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class CalendarEventController extends Controller
{
    public function index()
    {
        try {
            $events = CalendarEvent::where('user_id', Auth::id())
                ->orderBy('start_time', 'asc')
                ->get();

            return response()->json($events);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch events: ' . $e->getMessage()], 500);
        }
    }

    public function store(Request $request)
    {
        try {
            \Log::info('Received calendar event creation request', [
                'request_data' => $request->all(),
                'headers' => $request->headers->all(),
                'user_id' => Auth::id(),
                'auth_check' => Auth::check()
            ]);

            if (!Auth::check()) {
                \Log::error('User not authenticated', [
                    'token' => $request->bearerToken(),
                    'headers' => $request->headers->all()
                ]);
                return response()->json(['error' => 'User not authenticated'], 401);
            }

            $validator = Validator::make($request->all(), [
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'start_time' => 'required|date',
                'end_time' => 'required|date|after:start_time',
                'color' => 'required|string|in:blue,red,green,purple,yellow',
            ]);

            if ($validator->fails()) {
                \Log::error('Validation failed', [
                    'errors' => $validator->errors(),
                    'input' => $request->all()
                ]);
                return response()->json(['errors' => $validator->errors()], 422);
            }

            try {
                $event = CalendarEvent::create([
                    'title' => $request->title,
                    'description' => $request->description,
                    'start_time' => $request->start_time,
                    'end_time' => $request->end_time,
                    'color' => $request->color,
                    'user_id' => Auth::id(),
                ]);

                \Log::info('Calendar event created successfully', [
                    'event_id' => $event->id,
                    'event_data' => $event->toArray()
                ]);

                return response()->json($event, 201);
            } catch (\Exception $e) {
                \Log::error('Database error while creating event', [
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString(),
                    'sql' => $e instanceof \Illuminate\Database\QueryException ? $e->getSql() : null
                ]);
                throw $e;
            }
        } catch (\Exception $e) {
            \Log::error('Failed to create calendar event', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'request_data' => $request->all()
            ]);
            return response()->json(['error' => 'Failed to create event: ' . $e->getMessage()], 500);
        }
    }

    public function show(CalendarEvent $event)
    {
        try {
            if ($event->user_id !== Auth::id()) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }

            return response()->json($event);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch event: ' . $e->getMessage()], 500);
        }
    }

    public function update(Request $request, CalendarEvent $event)
    {
        try {
            if ($event->user_id !== Auth::id()) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }

            $validator = Validator::make($request->all(), [
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'start_time' => 'required|date',
                'end_time' => 'required|date|after:start_time',
                'color' => 'required|string|in:blue,red,green,purple,yellow',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $event->update($request->all());

            return response()->json($event);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update event: ' . $e->getMessage()], 500);
        }
    }

    public function destroy(CalendarEvent $event)
    {
        try {
            if ($event->user_id !== Auth::id()) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }

            $event->delete();

            return response()->json(null, 204);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to delete event: ' . $e->getMessage()], 500);
        }
    }
} 