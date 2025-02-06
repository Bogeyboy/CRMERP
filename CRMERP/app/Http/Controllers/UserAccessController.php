<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;

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

    public function config()
    {
        return response()->json([
            'roles' => Role::all(),
        ]);
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
            /* return response()->json([
                'message' => 'El correo electrónico ya se encuentra registrado',
            ], 403); */
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
    public function update(Request $request, string $id)
    {
        $USER_EXIST = User::where('email', $request->email)
                            ->where('id', '<>', $id)->first();
        //Comprobación de existencia del usuario a registrar
        if ($USER_EXIST) {
            /* return response()->json([
                'message' => 'El correo electrónico ya se encuentra registrado',
            ], 403); */
            return response()->json([
                'message' => 403,
                'message_text' => 'El correo electrónico ya se encuentra registrado, con lo que el usuario ya existe',
            ]);
        }
        //Comprobación de la contraseña
        /* if($request->password != $request->password_confirmation)
        {
            // return response()->json([
            //    'message' => 'Las contraseñas no coinciden',
            //], 403); 
            return response()->json([
                'message' => 403,
                'message_text' => 'Las contraseñas no coinciden',
            ]);
        } */
        //Seteamos la contraseña
        if ($request->password) {
            $request->request->add(['password' => bcrypt($request->password)]);
        }
        //Comprobación del tipo de archivo que se va a guardar, Se comprobará si es una imagen o no
        $user = User::findOrFail($id);
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
                'created_format_at' => $user->created_at->format('d/m/Y H:i:s')
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