<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\Configuration;
use App\Models\Staff;
use App\Models\Table;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
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

        // Mock tables
        $this->createTables();
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

        $conf = new Configuration();
        $conf->key = Configuration::SPA_LOGO_KEY;
        $conf->value = '/apple-touch-icon.png';
        $conf->save();

        $conf = new Configuration();
        $conf->key = Configuration::SPA_NAME_KEY;
        $conf->value = 'SEAT MANAGEMENT';
        $conf->save();

        $conf = new Configuration();
        $conf->key = Configuration::ROOM_WIDTH_KEY;
        $conf->value = 20;
        $conf->save();

        $conf = new Configuration();
        $conf->key = Configuration::ROOM_HEIGHT_KEY;
        $conf->value = 20;
        $conf->save();
    }

    private function createTables()
    {
        $configs = [
            [100, 100, Table::TABLE_TYPE_CIRCLE, Table::TABLE_DIR_HORIZONTAL, 4],
            [100, 300, Table::TABLE_TYPE_CIRCLE, Table::TABLE_DIR_HORIZONTAL, 4],
            [100, 500, Table::TABLE_TYPE_CIRCLE, Table::TABLE_DIR_HORIZONTAL, 4],
            [100, 700, Table::TABLE_TYPE_CIRCLE, Table::TABLE_DIR_HORIZONTAL, 4],
            [100, 900, Table::TABLE_TYPE_CIRCLE, Table::TABLE_DIR_HORIZONTAL, 4],
            [100, 1100, Table::TABLE_TYPE_CIRCLE, Table::TABLE_DIR_HORIZONTAL, 4],
            [100, 1300, Table::TABLE_TYPE_CIRCLE, Table::TABLE_DIR_HORIZONTAL, 4],
            [100, 1500, Table::TABLE_TYPE_CIRCLE, Table::TABLE_DIR_HORIZONTAL, 4],

            [300, 100, Table::TABLE_TYPE_SQUARE, Table::TABLE_DIR_VERTICAL, 4],
            [300, 300, Table::TABLE_TYPE_SQUARE, Table::TABLE_DIR_VERTICAL, 4],
            [300, 500, Table::TABLE_TYPE_SQUARE, Table::TABLE_DIR_VERTICAL, 4],
            [300, 700, Table::TABLE_TYPE_SQUARE, Table::TABLE_DIR_VERTICAL, 4],
            [300, 900, Table::TABLE_TYPE_SQUARE, Table::TABLE_DIR_VERTICAL, 4],
            [300, 1100, Table::TABLE_TYPE_SQUARE, Table::TABLE_DIR_VERTICAL, 4],
            [300, 1300, Table::TABLE_TYPE_SQUARE, Table::TABLE_DIR_VERTICAL, 4],
            [300, 1500, Table::TABLE_TYPE_SQUARE, Table::TABLE_DIR_VERTICAL, 4],

            [500, 100, Table::TABLE_TYPE_SQUARE, Table::TABLE_DIR_HORIZONTAL, 8],
            [500, 350, Table::TABLE_TYPE_SQUARE, Table::TABLE_DIR_HORIZONTAL, 8],
            [500, 600, Table::TABLE_TYPE_SQUARE, Table::TABLE_DIR_HORIZONTAL, 8],
            [500, 850, Table::TABLE_TYPE_SQUARE, Table::TABLE_DIR_HORIZONTAL, 8],
            [500, 1100, Table::TABLE_TYPE_SQUARE, Table::TABLE_DIR_HORIZONTAL, 8],
            [500, 1350, Table::TABLE_TYPE_SQUARE, Table::TABLE_DIR_HORIZONTAL, 8],

            [700, 100, Table::TABLE_TYPE_SQUARE, Table::TABLE_DIR_VERTICAL, 6],
            [700, 300, Table::TABLE_TYPE_SQUARE, Table::TABLE_DIR_VERTICAL, 6],
            [700, 500, Table::TABLE_TYPE_SQUARE, Table::TABLE_DIR_VERTICAL, 6],
            [700, 700, Table::TABLE_TYPE_SQUARE, Table::TABLE_DIR_VERTICAL, 6],
            [700, 900, Table::TABLE_TYPE_SQUARE, Table::TABLE_DIR_VERTICAL, 6],
            [700, 1100, Table::TABLE_TYPE_SQUARE, Table::TABLE_DIR_VERTICAL, 6],
            [700, 1300, Table::TABLE_TYPE_SQUARE, Table::TABLE_DIR_VERTICAL, 6],
            [700, 1500, Table::TABLE_TYPE_SQUARE, Table::TABLE_DIR_VERTICAL, 6],
        ];

        try {
            DB::beginTransaction();

            foreach ($configs as $config) {
                $table = new Table();
                $table->position_x = $config[0];
                $table->position_y = $config[1];
                $table->is_block = false;
                $table->type = $config[2];
                $table->direction = $config[3];
                $table->save();

                for ($i = 0; $i < $config[4]; $i++) {
                    $table->seats()->create([]);
                }
            }

            DB::commit();
        } catch (\Throwable $th) {
            DB::rollBack();
            return 0;
        }
    }
}
