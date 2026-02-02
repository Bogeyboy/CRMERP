<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class AuthController extends \Illuminate\Routing\Controller
{
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login', 'register']]);
    }

    /**
     * Registrar un usuario
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users',
            'password' => 'required|min:8',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => bcrypt($request->password),
        ]);

        return response()->json($user, 201);
    }

    /**
     * Login y generar JWT
     */
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (! $token = auth('api')->attempt($credentials))
        {
            return response()->json(['error' => 'Credenciales inválidas'], 401);
        }

        return $this->respondWithToken($token);
    }


    /**
     * Usuario autenticado
     */
    /* public function me()
    {
        $user = auth('api')->user();
        if (!$user) {
            return response()->json(['error' => 'No autenticado'], 401);
        }

        return response()->json($this->formatUser($user));
    } */
   public function me()
    {
        $user = auth('api')->user();

        if (!$user) {
            return response()->json(['error' => 'No autenticado'], 401);
        }

        $isSuper = $user->hasRole('Super-Admin');
        $permissions = $isSuper ? ['*'] : $user->getAllPermissions()->pluck('name')->toArray();

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'username' => $user->email,
            'firstName' => $user->name,
            'lastName' => '',
            'fullname' => $user->name,
            'occupation' => 'Administrador',
            'companyName' => 'Company',
            'phone' => '',
            'roles' => $user->getRoleNames()->toArray(),
            'is_super' => $isSuper,
            'permissions' => $permissions,
            'pic' => $user->avatar
                ? env('APP_URL').'storage/'.$user->avatar
                : 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
            'logo' => $user->avatar
                ? env('APP_URL').'storage/'.$user->avatar
                : 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
        ]);
    }

    /**
     * Logout
     */
    public function logout()
    {
        auth('api')->logout();
        return response()->json(['message' => 'Sesión cerrada correctamente']);
    }

    /**
     * Refrescar token
     */
    public function refresh()
    {
        $token = auth('api')->refresh();
        $user = auth('api')->user();
        return response()->json([
            'access_token' => $token,
            'token_type'   => 'bearer',
            'expires_in'   => auth('api')->factory()->getTTL() * 60,
            'user'         => $this->formatUser($user),
        ]);
    }

    /**
     * Formatear usuario para frontend
     */
    protected function formatUser(User $user)
    {
        $permissions = $user->hasRole('Super-Admin')
            ? ['all-access']   // Super-Admin tiene acceso total
            : $user->getAllPermissions()->pluck('name')->toArray();

        return [
            'id'          => $user->id,
            'name'        => $user->name,
            'email'       => $user->email,
            'avatar'      => $user->avatar
                                ? env('APP_URL').'storage/'.$user->avatar
                                : 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
            'roles'       => $user->getRoleNames(),
            'is_super'    => $user->hasRole('Super-Admin'),
            /* 'permissions' => $permissions, */
            'permissions'=> $user->hasRole('Super-Admin')
                ? [] // NO se usan
                : $user->getAllPermissions()->pluck('name'),
        ];
    }

    /**
     * Responder con token
     */
    /* protected function respondWithToken($token)
    {
        $user = auth('api')->user();

        return response()->json([
            'access_token' => $token,
            'token_type'   => 'bearer',
            'expires_in'   => auth('api')->factory()->getTTL() * 60,
            'user'         => $this->formatUser($user),
        ]);
    } */
    /* protected function respondWithToken($token)
    {
        $user = auth('api')->user();
        $isSuperAdmin = $user->hasRole('Super-Admin');

        return response()->json([
            'access_token' => $token,
            'token_type'   => 'bearer',
            'expires_in'   => auth('api')->factory()->getTTL() * 60,
            'user' => [
                'id'          => $user->id,
                'name'        => $user->name,
                'email'       => $user->email,
                'roles'       => $user->getRoleNames(),
                'is_super'    => $isSuperAdmin,
                'permissions' => $isSuperAdmin
                    ? [] // el frontend NO debe usarlos
                    : $user->getAllPermissions()->pluck('name'),
            ],
        ]);
    } */

    /* protected function respondWithToken($token)
    {
        $user = auth('api')->user();
        $isSuper = $user->hasRole('Super-Admin');

        $permissions = [];

        if ($user->hasRole('Super-Admin')) {
            $permissions = ['*'];
        } else {
            $permissions = $user->getAllPermissions()->pluck('name');
        }

        return response()->json([
            'access_token' => $token,
            'token_type'   => 'bearer',
            'expires_in'   => auth('api')->factory()->getTTL() * 60,
            'user' => [
                'id'          => $user->id,
                'name'        => $user->name,
                'email'       => $user->email,
                'roles'       => $user->getRoleNames()->toArray(),
                'is_super'    => $isSuper,

                // 🔥 CLAVE PARA METRONIC
                //'permissions' => $isSuper ? ['*'] : $user->getAllPermissions()->pluck('name')->toArray(),
                'permissions' => $permissions,
            ]
        ]);
    } */

    protected function respondWithToken($token)
{
    $user = auth('api')->user();
    $isSuper = $user->hasRole('Super-Admin');

    // Asegurar que permissions sea un array
    $permissions = $isSuper ? ['*'] : $user->getAllPermissions()->pluck('name')->toArray();

    // Asegurar que roles sea un array
    $roles = $user->getRoleNames()->toArray();

    return response()->json([
        'access_token' => $token,
        'token_type' => 'bearer',
        'expires_in' => auth('api')->factory()->getTTL() * 60,
        'user' => [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            // Campos que sidebar necesita
            'roles' => $roles,
            'is_super' => $isSuper,
            'permissions' => $permissions,
            // Campos adicionales para compatibilidad
            'rol_name' => $isSuper ? 'Super-Admin' : (count($roles) > 0 ? $roles[0] : ''),
        ]
    ]);
}

}
