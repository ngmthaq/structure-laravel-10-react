<?php

namespace App\Http\Controllers;

use App\Models\Configuration;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\File;

class ReactController extends Controller
{
    protected Configuration $configuration;

    public function __construct()
    {
        $this->configuration = new Configuration();
    }

    public function index()
    {
        $configurations = $this->configuration->all();
        $translations = json_encode($this->getI18n());
        $title = $configurations->firstWhere("key", Configuration::SPA_DOCUMENT_TITLE_KEY)->value;
        $favicon = $configurations->firstWhere("key", Configuration::SPA_DOCUMENT_FAVICON_KEY)->value;

        return response()->view("react", compact("translations", "configurations", "title", "favicon"));
    }

    private function getI18n()
    {
        $files = collect(File::allFiles(lang_path(App::getLocale())));

        return $files->flatMap(function ($file) {
            return [($translation = $file->getBasename(".php")) => trans($translation)];
        })->toJson();
    }
}
