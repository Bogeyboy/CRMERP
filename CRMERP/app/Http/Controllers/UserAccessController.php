<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Role;

class UserAccessController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->get('search');
        $users = User::where('name', 'like', "%$search%")->orderBy('id', 'desc')->paginate(25);
            /* ->orWhere('email', 'like', "%$search%")
            ->orWhere('phone', 'like', "%$search%")
            ->orWhere('document', 'like', "%$search%")
            ->orWhere('type_document', 'like', "%$search%")
            ->orWhere('address', 'like', "%$search%"); */
        return response()->json([
            'total' => $users->total(),
            'users' => $users->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'surname' => $user->surname,
                    'full_name' => $user->name . ' ' . $user->surname,
                    'email' => $user->email,
                    'phone' => $user->phone,
                    'rol_id' => $user->rol_id,
                    'rol' => $user->rol,
                    'roles' => $user->roles,
                    'sucursal_id' => $user->sucursal_id,
                    'document' => $user->document,
                    'type_document' => $user->type_document,
                    'address' => $user->address,
                    'gender' => $user->gender,
                    'avatar' => $user->avatar ? env('APP_URL') . 'storage/' . $user->avatar : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
                    'created_format_at' => $user->created_at->format('d/m/Y H:i:s')
                ];
            })
        ]);
    }
    public function config(Request $request)
    {
        try {
            $user = auth()->user();

            // Si es Super-Admin, mostrar todos los roles
            if ($user->hasRole('Super-Admin')) {
                $roles = Role::all();
            } else {
                // Si no es Super-Admin, mostrar solo roles que no sean Super-Admin
                $roles = Role::where('name', '!=', 'Super-Admin')->get();
            }

            return response()->json([
                'roles' => $roles,
                'success' => true
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error en la configuración',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function listRoles(Request $request)
    {
        try {
            // Obtener todos los roles (excepto Super-Admin si quieres restringirlo)
            $roles = Role::where('name', '!=', 'Super-Admin')->get();

            return response()->json([
                'roles' => $roles,
                'success' => true
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener roles',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $USER_EXIST = User::where('email', $request->email)->first();
        //Comprobación de existencia del usuario a registrar
        if ($USER_EXIST)
        {
            return response()->json([
                'message' => 403,
                'message_text' => 'El correo electrónico ya se encuentra registrado, con lo que el usuario ya existe',
            ]);
        }

        //Seteamos la contraseña
        if($request->password)
        {
                $request->request->add(['password' => bcrypt($request->password)]);
        }
        //Comprobación del tipo de archivo que se va a guardar
        //Se comprobará si es una imagen o no
        if($request->hasFile('imagen'))
        {
            //$path = Storage::putFile('users', $request->file('imagen'));
            $path = Storage::putFile('public/users', $request->file('imagen'));
            $request->request->add(['avatar' => $path]);
        }
        //Finalmente creamos el usuario
        $rol = Role::findOrFail($request->rol_id);
        $user = User::create($request->all());
        $user->assignRole($rol);

        return response()->json([
            'message' => 200,
            'message_text' => 'Usuario creado correctamente',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'surname' => $user->surname,
                'full_name' => $user->name . ' ' . $user->surname,
                'email' => $user->email,
                'phone' => $user->phone,
                'rol_id' => $user->rol_id,
                'rol' => $user->rol,
                'roles' => $user->roles,
                'sucursal_id' => $user->sucursal_id,
                'document' => $user->document,
                'type_document' => $user->type_document,
                'address' => $user->address,
                'gender' => $user->gender,
                'avatar' => $user->avatar ? env('APP_URL') . 'storage/' . $user->avatar : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
            ]
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    /* public function update(Request $request, string $id)
    {
        $USER_EXIST = User::where('email', $request->email)
                            ->where('id', '<>', $id)->first();
        //Comprobación de existencia del usuario a registrar
        if ($USER_EXIST) {
            return response()->json([
                'message' => 403,
                'message_text' => 'El correo electrónico ya se encuentra registrado, con lo que el usuario ya existe',
            ]);
        }

        //Seteamos la contraseña
        if ($request->password) {
            $request->request->add(['password' => bcrypt($request->password)]);
        }
        //Comprobación del tipo de archivo que se va a guardar, Se comprobará si es una imagen o no
        $user = User::findOrFail($id);
        if ($request->has('role'))
        {
            $user->syncRoles([$request->role]);
        }
        // O si usas 'rol_id'
        if ($request->has('rol_id'))
        {
            $user->syncRoles([$request->rol_id]);
        }

        if ($request->hasFile('imagen'))
        {
            if($user->avatar)
            {
                Storage::delete($user->avatar);
            }
            $path = Storage::putFile('public/users', $request->file('imagen'));
            $request->request->add(['avatar' => $path]);
        }

        if($request->rol_id != $user->rol_id)
        {
            //PARA EL VIEJO ROL
            $rol_old = Role::findOrFail($user->rol_id);
            $user->removeRole($rol_old);
            //PARA EL NUEVO ROL
            $rol = Role::findOrFail($request->rol_id);
            $user->assignRole($rol);
            //$user->syncRoles($rol);
        }
        //Finalmente actualizamos el usuario
        $user->update($request->all());
        Log::info('Datos recibidos:', $request->all());

        return response()->json([
            'message' => 200,
            'message_text' => 'Usuario creado correctamente',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'surname' => $user->surname,
                'full_name' => $user->name . ' ' . $user->surname,
                'email' => $user->email,
                'phone' => $user->phone,
                'rol_id' => $user->rol_id,
                'rol' => $user->rol,
                'roles' => $user->roles,
                'sucursal_id' => $user->sucursal_id,
                'document' => $user->document,
                'type_document' => $user->type_document,
                'address' => $user->address,
                'gender' => $user->gender,
                'avatar' => $user->avatar ? env('APP_URL') . 'storage/' . $user->avatar : null,
                'created_format_at' => $user->created_at->format('d/m/Y H:i:s'),
                'user' => $user->load('roles')
            ]
        ]);
    } */
    /**
 * Update the specified resource in storage.
 */
    /* public function update(Request $request, string $id)
    {
        // Verificar si el email ya existe en otro usuario
        $USER_EXIST = User::where('email', $request->email)
                            ->where('id', '<>', $id)->first();

        if ($USER_EXIST) {
            return response()->json([
                'message' => 403,
                'message_text' => 'El correo electrónico ya se encuentra registrado',
            ]);
        }

        $user = User::findOrFail($id);

        // Crear array con los datos a actualizar
        $dataToUpdate = $request->only([
            'name', 'surname', 'email', 'phone',
            'gender', 'type_document', 'document', 'address'
        ]);

        // Manejar rol_id si viene en la petición
        if ($request->has('rol_id')) {
            $dataToUpdate['rol_id'] = $request->rol_id;
        }

        // También aceptar 'role' o 'role_id' como alternativas
        if ($request->has('role_id')) {
            $dataToUpdate['rol_id'] = $request->role_id;
        }
        if ($request->has('role')) {
            $dataToUpdate['rol_id'] = $request->role;
        }

        // Manejar contraseña
        if ($request->has('password') && $request->password) {
            $dataToUpdate['password'] = bcrypt($request->password);
        }

        // Manejar imagen
        if ($request->hasFile('imagen')) {
            if ($user->avatar) {
                Storage::delete($user->avatar);
            }
            $path = Storage::putFile('public/users', $request->file('imagen'));
            // Quitar 'public/' del path para guardar
            $dataToUpdate['avatar'] = str_replace('public/', '', $path);
        }

        // Actualizar datos básicos
        $user->update($dataToUpdate);

        // Manejar roles con Spatie Permission
        if (isset($dataToUpdate['rol_id']) && $dataToUpdate['rol_id']) {
            try {
                $rol = Role::findOrFail($dataToUpdate['rol_id']);
                // syncRoles reemplaza todos los roles actuales por el nuevo
                $user->syncRoles([$rol->name]);
            } catch (\Exception $e) {
                Log::error('Error asignando rol: ' . $e->getMessage());
            }
        }

        Log::info('Usuario actualizado:', ['id' => $id, 'data' => $dataToUpdate]);

        // Recargar el usuario con sus relaciones
        $user->refresh();
        $user->load('roles');

        return response()->json([
            'message' => 200,
            'message_text' => 'Usuario actualizado correctamente',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'surname' => $user->surname,
                'full_name' => $user->name . ' ' . $user->surname,
                'email' => $user->email,
                'phone' => $user->phone,
                'rol_id' => $user->rol_id,
                'roles' => $user->roles,
                'sucursal_id' => $user->sucursal_id,
                'document' => $user->document,
                'type_document' => $user->type_document,
                'address' => $user->address,
                'gender' => $user->gender,
                'avatar' => $user->avatar ? env('APP_URL') . 'storage/' . $user->avatar : null,
                'created_format_at' => $user->created_at ? $user->created_at->format('d/m/Y H:i:s') : null,
            ]
        ]);
    } */
    /**
 * Update the specified resource in storage.
 */
    public function update(Request $request, string $id)
    {
        // LOG PARA DEPURAR - Ver qué está llegando
        Log::info('Método:', ['method' => $request->method()]);
        Log::info('Todos los datos del request:', $request->all());
        Log::info('Inputs:', $request->input());
        Log::info('Request content:', ['content' => $request->getContent()]);

        // Para FormData, necesitamos obtener los datos manualmente
        $data = [];

        // Obtener campos comunes
        if ($request->has('name')) $data['name'] = $request->input('name');
        if ($request->has('surname')) $data['surname'] = $request->input('surname');
        if ($request->has('email')) $data['email'] = $request->input('email');
        if ($request->has('phone')) $data['phone'] = $request->input('phone');
        if ($request->has('rol_id')) $data['rol_id'] = $request->input('rol_id');
        if ($request->has('gender')) $data['gender'] = $request->input('gender');
        if ($request->has('type_document')) $data['type_document'] = $request->input('type_document');
        if ($request->has('document')) $data['document'] = $request->input('document');
        if ($request->has('address')) $data['address'] = $request->input('address');

        Log::info('Datos procesados:', $data);

        // Verificar si el email ya existe en otro usuario
        if (isset($data['email'])) {
            $USER_EXIST = User::where('email', $data['email'])
                                ->where('id', '<>', $id)->first();
            if ($USER_EXIST) {
                return response()->json([
                    'message' => 403,
                    'message_text' => 'El correo electrónico ya se encuentra registrado',
                ]);
            }
        }

        $user = User::findOrFail($id);

        // Manejar contraseña
        if ($request->has('password') && $request->input('password')) {
            $data['password'] = bcrypt($request->input('password'));
        }

        // Manejar imagen
        if ($request->hasFile('imagen')) {
            if ($user->avatar) {
                Storage::delete('public/' . $user->avatar);
            }
            $path = $request->file('imagen')->store('users', 'public');
            $data['avatar'] = $path;
        }

        // Si hay datos para actualizar
        if (!empty($data)) {
            $user->update($data);
            Log::info('Usuario actualizado con datos:', $data);
        } else {
            Log::warning('No hay datos para actualizar');
        }

        // Manejar roles con Spatie Permission
        if (isset($data['rol_id']) && $data['rol_id']) {
            try {
                $rol = Role::findOrFail($data['rol_id']);
                $user->syncRoles([$rol->name]);
                Log::info('Rol asignado:', ['rol_id' => $data['rol_id'], 'rol_name' => $rol->name]);
            } catch (\Exception $e) {
                Log::error('Error asignando rol: ' . $e->getMessage());
            }
        }

        // Recargar el usuario con sus relaciones
        $user->refresh();
        $user->load('roles');

        return response()->json([
            'message' => 200,
            'message_text' => 'Usuario actualizado correctamente',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'surname' => $user->surname,
                'full_name' => $user->name . ' ' . $user->surname,
                'email' => $user->email,
                'phone' => $user->phone,
                'rol_id' => $user->rol_id,
                'roles' => $user->roles,
                'sucursal_id' => $user->sucursal_id,
                'document' => $user->document,
                'type_document' => $user->type_document,
                'address' => $user->address,
                'gender' => $user->gender,
                'avatar' => $user->avatar ? env('APP_URL') . 'storage/' . $user->avatar : null,
                'created_format_at' => $user->created_at ? $user->created_at->format('d/m/Y H:i:s') : null,
            ]
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = User::findOrFail($id);
        if ($user->avatar) {//Eliimina el avatar del usuario
            Storage::delete($user->avatar);
        }
        $user->delete();

        return response()->json([
            'message' => 200,
            'message_text' => 'Usuario eliminado correctamente',
        ]);
    }
}
