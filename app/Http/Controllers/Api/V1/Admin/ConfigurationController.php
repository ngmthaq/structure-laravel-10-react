<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\V1\Admin\ConfigurationRequest;
use App\Models\Configuration;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ConfigurationController extends Controller
{
    protected Configuration $configuration;

    public function __construct()
    {
        $this->configuration = new Configuration();
    }

    public function get()
    {
        $configurations = $this->configuration->all();

        return response()->json($configurations);
    }

    public function set(ConfigurationRequest $request)
    {
        try {
            DB::beginTransaction();

            $this->configuration
                ->where("key", Configuration::DEFAULT_STAFF_PASSWORD_KEY)
                ->update(['value' => $request->input("default_password")]);

            $this->configuration
                ->where("key", Configuration::SPA_DOCUMENT_TITLE_KEY)
                ->update(['value' => $request->input("app_title")]);

            $this->configuration
                ->where("key", Configuration::SPA_NAME_KEY)
                ->update(['value' => $request->input("app_name")]);

            $this->configuration
                ->where("key", Configuration::ROOM_WIDTH_KEY)
                ->update(['value' => $request->input("room_width")]);

            $this->configuration
                ->where("key", Configuration::ROOM_HEIGHT_KEY)
                ->update(['value' => $request->input("room_height")]);

            $favicon = $request->file("app_favicon");
            if (isset($favicon)) {
                $hash = Str::random(16);
                $name = "favicon-$hash.ico";
                $path = "system/favicons";
                $full_path = Storage::disk("public")->putFileAs($path, $favicon, $name);
                $this->configuration
                    ->where("key", Configuration::SPA_DOCUMENT_FAVICON_KEY)
                    ->update(['value' => "/storage/" . $full_path]);
            }

            $logo = $request->file("app_logo");
            if (isset($logo)) {
                $hash = Str::random(16);
                $name = "logo-$hash.ico";
                $path = "system/logos";
                $full_path = Storage::disk("public")->putFileAs($path, $logo, $name);
                $this->configuration
                    ->where("key", Configuration::SPA_LOGO_KEY)
                    ->update(['value' => "/storage/" . $full_path]);
            }

            DB::commit();

            return response()->json([]);
        } catch (\Throwable $th) {
            DB::rollBack();

            return response()->json([
                "message" => __("custom.something-wrong"),
                "data" => $th->getMessage(),
                "trace" => $th->getTrace(),
            ], 500);
        }
    }
}
