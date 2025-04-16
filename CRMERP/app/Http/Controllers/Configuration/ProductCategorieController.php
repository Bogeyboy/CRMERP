<?php

namespace App\Http\Controllers\Configuration;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use App\Models\Configuration\ProductCategorie;
use App\Models\Configuration\product_categorie;

class ProductCategorieController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->get('search');

        $categories = ProductCategorie::where('name', 'like', "%" . $search . "%")
            //->orWhere('address', 'like', "%" . $search . "%")
            ->orderBy('id', 'desc')
            ->paginate(25);

        return response()->json([
            'total' => $categories->total(),
            'categories' => $categories->map(function ($categorie) {
                return [
                    'id' => $categorie->id,
                    'name' => $categorie->name,
                    'state' => $categorie->state,
                    'imagen' => $categorie->imagen ? env('APP_URL') . 'storage/' . $categorie->imagen : null,
                    //'imagen' => $categorie->imagen ? env('APP_URL') . 'storage/' . $categorie->imagen : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
                    'created_at' => $categorie->created_at->format('d-m-Y H:i:s'),
                ];
            })
        ]);
    }
    /**
     * Almacenamos los registros de la tabla
     */
    public function store(Request $request)
    {
        $if_exists_categorie = ProductCategorie::where('name', $request->name)->first();
        if ($if_exists_categorie) {
            return response()->json([
                'message' => 403,
                'message_text' => 'Ya existe una categoría con ese nombre.',
            ]);
        }

        if($request->hasFile('categorie_imagen'))
        {
            $file = $request->file('imagen');
            $path = Storage::putFile("categories",$request->file('categorie_imagen'));

            $request->request->add(['imagen' => $path]);
        }

        $categorie = ProductCategorie::create($request->all());
        return response()->json([
            'message' => 200,
            'categorie' => [
                'id' => $categorie->id,
                'name' => $categorie->name,
                'state' => $categorie->state ?? 1,
                'imagen' => $categorie->imagen ? env('APP_URL') . 'storage/' . $categorie->imagen : null,
                'created_at' => $categorie->created_at->format('d-m-Y H:i:s'),
            ],
            'message_text' => 'La categoría se ha creado correctamente.'
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
     * Actuialización de los registros de la tabla
     */
    public function update(Request $request, string $id)
    {
        $if_exists_categorie = ProductCategorie::where('name', $request->name)
            ->where('id', '<>', $id)
            ->first();
        if ($if_exists_categorie) {
            return response()->json([
                'message' => 403,
                'message_text' => 'Ya existe una categoría con ese nombre.',
            ]);
        };

        $categorie = ProductCategorie::findOrFail($id);

        if ($request->hasFile('categorie_imagen'))
        {
            if($categorie->imagen)
            {
                Storage::delete($categorie->imagen);
            }
            $file = $request->file('imagen');
            $path = Storage::putFile("categories", $request->file('categorie_imagen'));

            $request->request->add(['imagen' => $path]);
        }

        $categorie->update($request->all());

        return response()->json([
            'message' => 200,
            'categorie' => [
                'id' => $categorie->id,
                'name' => $categorie->name,
                'state' => $categorie->state,
                'imagen' => $categorie->imagen ? env('APP_URL') . 'storage/' . $categorie->imagen : null,
                'created_at' => $categorie->created_at->format('d-m-Y H:i:s'),
            ],
            'message_text' => 'La categoría se ha actualizado correctamente.',
        ]);
    }

    /**
     * Eliminación de los registros de la tabla
     */
    public function destroy(string $id)
    {
        $categorie = ProductCategorie::findOrFail($id);
        //VALIDACIÓN PRO PRODUCTO
        $categorie->delete();
        return response()->json([
            'message' => 200,
            'message_text' => 'Categoría eliminado correctamente.',
        ]);
    }
}
