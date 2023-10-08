<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\Configuration;
use App\Models\Staff;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Mock user records
        User::factory(20)->create();

        // Mock admin record
        $this->createAdmin();

        // Mock staff records
        Staff::factory(10)->create();

        // Setup configurations
        $this->setupConfigurations();
    }

    private function createAdmin()
    {
        $admin = new Staff();
        $admin->name = "Admin";
        $admin->email = "email@admin.com";
        $admin->email_verified_at = now();
        $admin->password = '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi';
        $admin->remember_token = Str::random(10);
        $admin->phone = "0000000000";
        $admin->address = "Ha Noi, Viet Nam";
        $admin->date_of_birth = now();
        $admin->role = Staff::ROLE_ADMIN;
        $admin->save();
    }

    private function setupConfigurations()
    {
        $conf = new Configuration();
        $conf->key = Configuration::VERIFY_NEW_USER_KEY;
        $conf->value = Configuration::VERIFY_NEW_USER_ENABLE;
        $conf->save();

        $conf = new Configuration();
        $conf->key = Configuration::DEFAULT_STAFF_PASSWORD_KEY;
        $conf->value = 'password';
        $conf->save();

        $conf = new Configuration();
        $conf->key = Configuration::SPA_DOCUMENT_TITLE_KEY;
        $conf->value = 'Seat Management';
        $conf->save();

        $conf = new Configuration();
        $conf->key = Configuration::SPA_DOCUMENT_FAVICON_KEY;
        $conf->value = '/favicon.ico';
        $conf->save();
    }
}
