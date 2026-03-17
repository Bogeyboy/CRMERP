<?php

namespace App\Http\Controllers\Configuration;

use App\Http\Controllers\Controller;
//use App\Models\Configuration\product_categorie;
use App\Models\Configuration\ProductCategorie;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ProductCategorieController extends Controller
{
    public function show(string $id)
    {
        //
    }
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
                    /* 'imagen' => $categorie->imagen ? env('APP_URL') . 'storage/' . $categorie->imagen : null, */
                    'imagen' => $categorie->imagen = asset('storage/') .'/'. $categorie->imagen,
                    //'imagen' => $categorie->imagen ? env('APP_URL') . 'storage/' . $categorie->imagen : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
                    'created_at' => $categorie->created_at->format('d-m-Y H:i:s'),
                ];
            })
        ]);
    }
    /**
    * Almacenamos los registros de la tabla
    */
    /* public function store(Request $request)
    {
        
        try {
            // DEBUG: Ver qué datos llegan
            Log::info('Datos completos de la request:', [
                'all' => $request->all(),
                'json' => $request->json()->all(),
                'input' => $request->input(),
                'name_input' => $request->input('name'),
                'method' => $request->method(),
                'content_type' => $request->header('Content-Type')
            ]);
            
            // Validar que name sea requerido
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'nullable|string'
            ]);
            
            Log::info('Datos validados:', $validated);
            
            $category = ProductCategorie::create($validated);
            
            return response()->json([
                'success' => true,
                'message' => 'Categoría creada correctamente',
                'data' => $category
            ]);
            
        }
        catch (\Illuminate\Validation\ValidationException $e)
        {
            Log::error('Error de validación:', $e->errors());
            return response()->json([
                'success' => false,
                'errors' => $e->errors()
            ], 422);
        }
        catch (\Exception $e)
        {
            Log::error('Error al crear categoría: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage()
            ], 500);
        }

        $if_exists_categorie = ProductCategorie::where('name', $request->name)->first();

        if ($if_exists_categorie) {
            return response()->json([
                'message' => 403,
                'message_text' => 'Ya existe una categoría con ese nombre.',
            ]);
        }

        if ($request->hasFile('categorie_imagen')) {
            $path = $request->file('categorie_imagen')
                ->store('categories', 'public'); // ✅ DISCO PUBLIC
            $request->merge(['imagen' => $path]);
        }

        $categorie = ProductCategorie::create($request->all());

        return response()->json([
            'message' => 200,
            'categorie' => [
                'id' => $categorie->id,
                'name' => $categorie->name,
                'state' => $categorie->state ?? 1,
                'imagen' => $categorie->imagen ? asset('storage/' . $categorie->imagen) : null,
                'created_at' => $categorie->created_at->format('d-m-Y H:i:s'),
            ],
            'message_text' => 'La categoría se ha creado correctamente.'
        ]);
    } */
    public function store(Request $request)
    {
        try {
            // DEBUG: Ver qué datos llegan
            Log::info('=== INICIO STORE CATEGORÍA ===');
            Log::info('Datos completos:', [
                'all' => $request->all(),
                'files' => $request->allFiles(),
                'name' => $request->input('name'),
                'has_file' => $request->hasFile('categorie_imagen'),
                'file_info' => $request->hasFile('categorie_imagen') ? [
                    'name' => $request->file('categorie_imagen')->getClientOriginalName(),
                    'size' => $request->file('categorie_imagen')->getSize(),
                    'mime' => $request->file('categorie_imagen')->getMimeType()
                ] : null,
                'method' => $request->method(),
                'content_type' => $request->header('Content-Type')
            ]);

            // Validar si ya existe la categoría
            $exists = ProductCategorie::where('name', $request->name)->first();
            if ($exists) {
                return response()->json([
                    'message' => 403,
                    'message_text' => 'Ya existe una categoría con ese nombre.',
                ]);
            }

            // Validar los datos
            $request->validate([
                'name' => 'required|string|max:255',
                'categorie_imagen' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048'
            ]);

            // Procesar la imagen
            $imagePath = null;
            if ($request->hasFile('categorie_imagen')) {
                $imagePath = $request->file('categorie_imagen')
                    ->store('categories', 'public');
                Log::info('Imagen guardada en:', ['path' => $imagePath]);
            }

            // Crear la categoría
            $categorie = ProductCategorie::create([
                'name' => $request->name,
                'imagen' => $imagePath,
                'state' => 1 // Estado por defecto activo
            ]);

            Log::info('Categoría creada:', ['id' => $categorie->id]);

            return response()->json([
                'message' => 200,
                'categorie' => [
                    'id' => $categorie->id,
                    'name' => $categorie->name,
                    'state' => $categorie->state,
                    'imagen' => $categorie->imagen ? asset('storage/' . $categorie->imagen) : null,
                    'created_at' => $categorie->created_at->format('d-m-Y H:i:s'),
                ],
                'message_text' => 'La categoría se ha creado correctamente.'
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Error de validación:', $e->errors());
            return response()->json([
                'success' => false,
                'message' => 422,
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error al crear categoría: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 500,
                'message_text' => 'Error interno: ' . $e->getMessage()
            ], 500);
        }
    }
    /**
     * Actualización de los registros de la tabla
     */
    /* public function update(Request $request, string $id)
    {
        $if_exists_categorie = ProductCategorie::where('name', $request->name)
            ->where('id', '<>', $id)
            ->first();

        if ($if_exists_categorie) {
            return response()->json([
                'message' => 403,
                'message_text' => 'Ya existe una categoría con ese nombre.',
            ]);
        }

        $categorie = ProductCategorie::findOrFail($id);

        if ($request->hasFile('categorie_imagen')) {

            // 🔥 borrar imagen antigua (DISCO PUBLIC)
            if ($categorie->imagen) {
                Storage::disk('public')->delete($categorie->imagen);
            }

            // 🔥 guardar nueva imagen
            $path = $request->file('categorie_imagen')
                ->store('categories', 'public');

            $request->merge(['imagen' => $path]);
        }

        $categorie->update($request->all());

        return response()->json([
            'message' => 200,
            'categorie' => [
                'id' => $categorie->id,
                'name' => $categorie->name,
                'state' => $categorie->state,
                'imagen' => $categorie->imagen
                    ? asset('storage/' . $categorie->imagen)
                    : null,
                'created_at' => $categorie->created_at->format('d-m-Y H:i:s'),
            ],
            'message_text' => 'La categoría se ha actualizado correctamente.',
        ]);
    } */

    public function update(Request $request, string $id)
    {
        try {
            $categorie = ProductCategorie::findOrFail($id);

            // Validar si ya existe otra categoría con el mismo nombre
            $exists = ProductCategorie::where('name', $request->name)
                ->where('id', '<>', $id)
                ->first();

            if ($exists) {
                return response()->json([
                    'message' => 403,
                    'message_text' => 'Ya existe una categoría con ese nombre.',
                ]);
            }

            // Validar los datos
            $rules = [
                'name' => 'required|string|max:255',
            ];
            
            if ($request->hasFile('categorie_imagen')) {
                $rules['categorie_imagen'] = 'image|mimes:jpeg,png,jpg,gif|max:2048';
            }
            
            $request->validate($rules);

            $data = ['name' => $request->name];

            // Procesar la imagen si se subió una nueva
            if ($request->hasFile('categorie_imagen')) {
                // Borrar imagen antigua
                if ($categorie->imagen) {
                    Storage::disk('public')->delete($categorie->imagen);
                }

                // Guardar nueva imagen
                $path = $request->file('categorie_imagen')
                    ->store('categories', 'public');
                
                $data['imagen'] = $path;
            }

            // Actualizar la categoría
            $categorie->update($data);

            return response()->json([
                'message' => 200,
                'categorie' => [
                    'id' => $categorie->id,
                    'name' => $categorie->name,
                    'state' => $categorie->state,
                    'imagen' => $categorie->imagen ? asset('storage/' . $categorie->imagen) : null,
                    'created_at' => $categorie->created_at->format('d-m-Y H:i:s'),
                ],
                'message_text' => 'La categoría se ha actualizado correctamente.',
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 422,
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error al actualizar categoría: ' . $e->getMessage());
            return response()->json([
                'message' => 500,
                'message_text' => 'Error interno del servidor'
            ], 500);
        }
    }
    
    /**
     * Eliminación de los registros de la tabla
     */
    /* public function destroy(string $id)
    {
        $categorie = ProductCategorie::findOrFail($id);
        //VALIDACIÓN PRO PRODUCTO
        $categorie->delete();
        return response()->json([
            'message' => 200,
            'message_text' => 'Categoría eliminado correctamente.',
        ]);
    } */
    public function destroy(string $id)
    {
        try {
            $categorie = ProductCategorie::findOrFail($id);
            
            // Borrar la imagen si existe
            if ($categorie->imagen) {
                Storage::disk('public')->delete($categorie->imagen);
            }
            
            $categorie->delete();
            
            return response()->json([
                'message' => 200,
                'message_text' => 'Categoría eliminada correctamente.',
            ]);
            
        } catch (\Exception $e) {
            Log::error('Error al eliminar categoría: ' . $e->getMessage());
            return response()->json([
                'message' => 500,
                'message_text' => 'Error al eliminar la categoría'
            ], 500);
        }
    }
}
