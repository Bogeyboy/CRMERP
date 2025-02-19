<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use App\Http\Controllers\Controller;
//use Illuminate\Auth\Access\Gate;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Traits\HasRoles;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
//use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Validator;
//use Validator;


class AuthController extends \Illuminate\Routing\Controller
{
    /**
     * Create a new AuthController instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login', 'register']]);
        //$this->middleware('auth', ['except'=> ['login', 'register']]);
    }


    /**
     * Register a User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function register()
    {
        //$this->authorize('create', User::class);
        //Gate::authorize('create', User::class);
        //auth('api')->user()->can('create', User::class);
        $validator = Validator::make(request()->all(), [
            'name' => 'required',
            'email' => 'required|email|unique:users',
            //'password' => 'required|confirmed|min:8',//se elimina para la creación del usuario con postman
            'password' => 'required|min:8',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors()->toJson(), 400);
        }

        $user = new User;
        $user->name = request()->name;
        $user->email = request()->email;
        $user->password = bcrypt(request()->password);
        $user->save();

        return response()->json($user, 201);
    }


    /**
     * Get a JWT via given credentials.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        //$credentials = request(['email', 'password']);
        $credentials = $request->only('email', 'password');

        /* if (! $token = auth()->attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        } */
        /* if (! $token = Auth::attempt($credentials)) {
            //dd(response()->json([]));
            return response()->json(['error' => 'Unauthorized'], 401);
        } */
        if (!$token = JWTAuth::attempt($credentials)) {
            return response()->json(['error' => 'Credenciales inválidas'], 401);
        }

        return $this->respondWithToken($token);
    }

    /**
     * Get the authenticated User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function me()
    {
        //return response()->json(auth()->user());
        return response()->json(Auth::user());
    }

    /**
     * Log the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout()
    {
        //auth()->logout();
        Auth::logout();

        /* return response()->json(['message' => 'Successfully logged out']); */
        return response()->json(['message' => 'Correctamente desconectado']);
    }

    /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh()
    {
        //return $this->respondWithToken(auth()->refresh());
        return response()->json([
            'status' => 'success',
            'user' => Auth::user(),
            'Authorization' => [
                'token' => Auth::refresh(),
                'type' => 'bearer'
            ]
        ]);
    }

    /**
     * Get the token array structure.
     *
     * @param  string $token
     *
     * @return \Illuminate\Http\JsonResponse
     */
    protected function respondWithToken($token)
    {
        $permissions = Auth::user()->getAllPermissions()->map(function($perm){
            return $perm->name;
        });

        /* $user = Auth::user();
        $permissions = $user->permission->map(function ($perm) {
            return $perm->name;
        }); */

        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => JWTAuth::factory()->getTTL() * 60,
            //'expires_in' => auth('api')->factory()->getTTL() * 60,

            'user' =>[
                'name' => Auth::user()->name . ' ' . Auth::user()->surname,
                'email' => Auth::user()->email,
                'avatar' => Auth::user()->avatar ? env('APP_URL') . 'storage/' . Auth::user()->avatar : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
                'rol_name' => Auth::user()->rol->name,
                'permissions' => $permissions
                /* 'name' => auth("api")->user()->name,
                'email' => auth("api")->user()->email  */
            ]
        ]);
    }
}