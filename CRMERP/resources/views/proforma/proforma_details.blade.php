<table>
    <thead>
        <tr>
            <th width="auto">Nº Proforma</th>
            <th width="auto">Producto</th>
            <th width="auto">Categoria de producto</th>
            <th width="auto">Unidad</th>
            <th width="auto">Precio unitario</th>
            <th width="auto">Descuento</th>
            <th width="auto">Subtotal</th>
            <th width="auto">Impuesto</th>
            <th width="auto">Total</th>
            <th width="auto">Cantidad</th>
            <th width="auto">Descripción</th>
            <th width="auto">Fecha de creación</th>
        </tr>
    </thead>
    <tbody>
        @foreach ($proforma_details as $key => $proforma_detail)
            <tr>
                {{-- ID DE LA PROFORMA --}}
                <td width="auto">
                    {{ $proforma_detail->proforma->id }}
                </td>
                {{-- NOMBRE DEL PRODUCTO --}}
                <td width="auto">
                    {{-- {{ $proforma_detail->product->title }} --}}
                    {{ $proforma_detail->product?->title ?? 'Sin producto' }}
                </td>
                {{-- CATEGORIA DEL PRODUCTO --}}
                <td width="auto">
                    {{-- {{ $proforma_detail->product_categorie->name }} --}}
                    {{ $proforma_detail->product_categorie?->name ?? 'Sin categoría' }}
                </td>
                {{-- TIPO DE UNIDAD DEL PRODUCTO --}}
                <td width="auto">
                    {{-- {{ $proforma_detail->unit->name }} --}}
                    {{ $proforma_detail->unit->name }}
                </td>
                {{-- PRECIO UNITARIO DEL PRODUCTO --}}
                <td width="auto">
                    {{ $proforma_detail->price }} €
                </td>
                {{-- DESCUENTO UNITARIO DEL PRODUCTO --}}
                <td width="auto">
                    {{ $proforma_detail->discount }} €
                </td>
                {{-- SUBTOTAL DEL PRODUCTO --}}
                <td width="auto">
                    {{ $proforma_detail->subtotal }} €
                </td>
                {{-- IMPUESTO DEL PRODUCTO --}}
                <td width="auto">
                    {{ $proforma_detail->impuesto * 100 }} %
                </td>
                {{-- TOTAL DEL PRODUCTO --}}
                <td width="auto">
                    {{ $proforma_detail->total }} €
                </td>
                {{-- CANTIDAD DEL PRODUCTO --}}
                <td width="auto">
                    {{ $proforma_detail->quantity }}
                </td>
                {{-- DESCRIPCIÓN DEL PRODUCTO --}}
                <td width="auto">
                    {{ $proforma_detail->description }}
                </td>
                {{-- FECHA DE AÑADIDO --}}
                <td width="auto">
                    {{ $proforma_detail->created_at->format('d:m:Y h:i:A') }}
                </td>
            </tr>
            {{Log::info('Exportando proforma_detail: ' . $proforma_detail);}}
        @endforeach

    </tbody>
</table>
