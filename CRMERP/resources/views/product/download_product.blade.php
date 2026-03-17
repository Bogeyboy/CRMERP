<table>
    <thead>
        <tr>
            <th width="auto">#</th>
            <th width="auto">ID</th>
            <th width="auto">Título del producto</th>
            <th width="auto">Categoria</th>
            <th width="auto">Precio General</th>
            <th width="auto">SKU</th>
            <th width="auto">Disponibilidad</th>
            <th width="auto">Tipo de impuesto</th>
            <th width="auto">Umbral</th>
            <th width="auto">Unidad de umbral</th>
            <th width="auto">Peso</th>
            <th width="auto">Ancho</th>
            <th width="auto">Alto</th>
            <th width="auto">Largo</th>
        </tr>
    </thead>
    <tbody>
        @foreach ($products as $key => $product)
            <tr>
                <td width="auto">{{$key + 1}}</td>
                <td width="auto">{{$product->id}}</td>
                <td width="auto">{{$product->title}}</td>
                <td width="auto">{{$product->product_categorie->name}}</td>
                <td width="auto">{{$product->price_general}}</td>
                <td width="auto">{{$product->sku}}</td>
                {{-- DISPONIBILIDAD --}}
                <td width="auto">
                    @php
                        $disponibilidad = "";
                        switch ($product->disponibilidad) {
                            case 1:
                                $disponibilidad = 'Vender los productos sin stock';
                                break;
                            case 2:
                                $disponibilidad = 'No Vender los productos sin stock';
                                break;
                            case 3:
                                $disponibilidad = 'Proyectar con los contratos que se tenga';
                                break;
                            default:
                                # code...
                                break;
                        }
                    @endphp
                    {{$disponibilidad}}
                </td>
                {{-- TIPO DE IMPUESTOS --}}
                <td width="auto">
                    @php
                        $type_tax_selected = "";
                        switch ($product->tax_selected) {
                            case 1:
                                $type_tax_selected = 'Libre de impouestos';
                                break;
                            case 2:
                                $type_tax_selected = 'Bienes gravables';
                                break;
                            case 3:
                                $type_tax_selected = 'Producto descargable';
                                break;
                            default:
                                # code...
                                break;
                        }
                    @endphp
                    {{$type_tax_selected}}
                </td>
                <td width="auto">{{$product->umbral ?? 0}} días</td>
                <td width="auto">{{$product->umbral_unit ? $product->umbral_unit->name : '---'}}</td>
                <td width="auto">{{$product->weight}}</td>
                <td width="auto">{{$product->width}}</td>
                <td width="auto">{{$product->height}}</td>
                <td width="auto">{{$product->length}}</td>
            </tr>
        @endforeach

    </tbody>
</table>
