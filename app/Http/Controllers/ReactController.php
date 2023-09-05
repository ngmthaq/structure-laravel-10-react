<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\File;

class ReactController extends Controller
{
    public function index()
    {
        $translations = json_encode($this->getI18n());
        return response()->view('react', compact("translations"));
    }

    private function getI18n()
    {
        $files = collect(File::allFiles(lang_path(App::getLocale())));
        return $files->flatMap(function ($file) {
            return [($translation = $file->getBasename('.php')) => trans($translation)];
        })->toJson();
    }
}
