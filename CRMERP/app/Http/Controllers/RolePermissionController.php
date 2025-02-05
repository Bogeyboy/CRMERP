<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use App\Http\Controllers\Controller;

class RolePermissionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->get('search');
        
        $roles = Role::with(["permissions"])
            ->where("name","like","%".$search."%")
            ->orderBy('id','desc')
            ->paginate(25);

        return response()->json([
            "total" => $roles->total(),
            "roles" => $roles->map(function($rol)
            {
                $rol->permission_pluck = $rol->permissions->pluck("name");
                //$rol->created_at = $rol->created_at->format('d-m-Y h:i:s');
                $rol->created_format_at = $rol->created_at->format('d-m-Y h:i A');
                //$rol->created_at = $rol->created_at->format('Y-m-d h:i:s');
                return $rol;
            }),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $is_Role = Role::where("name",$request->name)->first();
        if($is_Role)
        {
            return response()->json([
                "message" => 403,
                "message_text" => "El rol ya existe",
            ]);
        }
        $rol = Role::create([
            'guard_name' => 'api',
            'name' => $request->name
        ]);
            /* 
            [
                ["id" => 1, "name" => "egreso"],
                ["id" => 1, "name" => "ingreso"],
                ["id" => 2, "name" => "close_caja"],
                ["id" => 3, "name" => "register_proforma"],
                ["id" => 4, "name" => "edit_proforma"],
                ["id" => 5, "name" => "delete_proforma"],
                ["id" => 6, "name" => "cronograma","comisiones"]
            ]
            */
        foreach($request->permissions as $key => $permission)
        {
            $rol->givePermissionTo($permission);
        }
        return response()->json([
            "message" => 200,
            "rol" => [
                "id" => $rol->id,
                "permission" => $rol->permissions,
                "permission_pluck" => $rol->permissions->pluck("name"),
                "created_format_at" => $rol->created_at->format('d-m-Y h:i A'),
                "name" => $rol->name,
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
        //$is_Role = Role::where("name", $request->name)->first();
        $is_Role = Role::where("name", $request->name)
            ->where("id","<>", $id)->first();

        if ($is_Role) {
            return response()->json([
                "message" => 403,
                "message_text" => "El rol ya existe",
            ]);
        }

        $rol = Role::findOrfail($id);
        $rol->update($request->all());
        /* 
            //Array asociativo
            [
                ["id" => 1, "name" => "egreso"],
                ["id" => 1, "name" => "ingreso"],
                ["id" => 2, "name" => "close_caja"],
                ["id" => 3, "name" => "register_proforma"],
                ["id" => 4, "name" => "edit_proforma"],
                ["id" => 5, "name" => "delete_proforma"],
                ["id" => 6, "name" => "cronograma","comisiones"]
            ]
            //Array Simple
            ["egreso","ingreso","close_caja","register_proforma","edit_proforma","delete_proforma","cronograma","comisiones"]
        */
        
        $rol->syncPermissions($request->permissions);

        return response()->json([
            "message" => 200,
            "rol" => [
                "id" => $rol->id,
                "permission" => $rol->permissions,
                "permission_pluck" => $rol->permissions->pluck("name"),
                "created_format_at" => $rol->created_at->format('d-m-Y h:i A'),
                "name" => $rol->name,
            ]
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $rol = Role::findOrfail($id);
        //Hay que hacer la validación para ver si el rol tiene usuarios asignados
        $rol->delete();

        return response()->json([
            "message" => 200,
            "message_text" => "El rol ha sido eliminado correctamente",
        ]);
    }
}
