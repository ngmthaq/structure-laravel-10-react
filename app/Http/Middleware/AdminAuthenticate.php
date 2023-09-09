<?php

namespace App\Http\Middleware;

use App\Models\Staff;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminAuthenticate
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $admin = $request->user('staff');
        if (empty($admin)) {
            if ($request->wantsJson()) {
                return response()->json([
                    "message" => __("custom.unauthorized"),
                ], 401);
            }

            return abort('401');
        } else if (isset($admin) && $admin->role !== Staff::ROLE_ADMIN) {
            if ($request->wantsJson()) {
                return response()->json([
                    "message" => __("custom.forbidden"),
                ], 403);
            }

            return abort('403');
        }

        return $next($request);
    }
}
