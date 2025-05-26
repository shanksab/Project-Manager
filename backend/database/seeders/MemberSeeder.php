<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MemberSeeder extends Seeder
{
    public function run(): void
    {
        $members = [
            [
                'name' => 'John Smith',
                'email' => 'john.smith@example.com',
                'role' => 'Team Lead',
                'department' => 'Development',
                'projects' => json_encode([]),
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Sarah Johnson',
                'email' => 'sarah.j@example.com',
                'role' => 'Senior Developer',
                'department' => 'Development',
                'projects' => json_encode([]),
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Mike Wilson',
                'email' => 'mike.w@example.com',
                'role' => 'UI/UX Designer',
                'department' => 'Design',
                'projects' => json_encode([]),
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Alex Brown',
                'email' => 'alex.b@example.com',
                'role' => 'Team Lead',
                'department' => 'Development',
                'projects' => json_encode([]),
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Emma Davis',
                'email' => 'emma.d@example.com',
                'role' => 'Mobile Developer',
                'department' => 'Development',
                'projects' => json_encode([]),
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'David Miller',
                'email' => 'david.m@example.com',
                'role' => 'Team Lead',
                'department' => 'Development',
                'projects' => json_encode([]),
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Lisa Anderson',
                'email' => 'lisa.a@example.com',
                'role' => 'Database Administrator',
                'department' => 'Development',
                'projects' => json_encode([]),
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('members')->insert($members);
    }
} 