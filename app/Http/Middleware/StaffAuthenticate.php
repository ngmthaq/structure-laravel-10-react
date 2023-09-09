<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class StaffAuthenticate
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $staff = $request->user('staff');
        if (empty($staff)) {
            if ($request->wantsJson()) {
                return response()->json([
                    "message" => __("custom.unauthorized"),
                ], 401);
            }

            return abort('401');
        }

        return $next($request);
    }
}
