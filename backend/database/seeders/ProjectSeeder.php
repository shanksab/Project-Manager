<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProjectSeeder extends Seeder
{
    public function run(): void
    {
        $projects = [
            [
                'title' => 'Website Redesign',
                'description' => 'Complete overhaul of company website with modern design',
                'status' => 'In Progress',
                'progress' => 65,
                'due_date' => now()->addMonths(2),
                'team_members' => json_encode(['John Smith', 'Sarah Johnson', 'Mike Wilson']),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Mobile App Development',
                'description' => 'New mobile application for iOS and Android',
                'status' => 'Not Started',
                'progress' => 0,
                'due_date' => now()->addMonths(3),
                'team_members' => json_encode(['Alex Brown', 'Emma Davis']),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'Database Migration',
                'description' => 'Migrate legacy database to new cloud infrastructure',
                'status' => 'Completed',
                'progress' => 100,
                'due_date' => now()->subDays(5),
                'team_members' => json_encode(['David Miller', 'Lisa Anderson']),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'E-commerce Platform',
                'description' => 'Build new online shopping platform',
                'status' => 'In Progress',
                'progress' => 30,
                'due_date' => now()->addMonths(4),
                'team_members' => json_encode(['John Smith', 'Sarah Johnson', 'Mike Wilson']),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'API Integration',
                'description' => 'Integrate third-party services with existing systems',
                'status' => 'In Progress',
                'progress' => 45,
                'due_date' => now()->addMonths(1),
                'team_members' => json_encode(['Alex Brown', 'Emma Davis']),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('projects')->insert($projects);
    }
} 