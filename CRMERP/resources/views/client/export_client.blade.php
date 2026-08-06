<table>
    <thead>
        <tr>
            <th width="auto">nombre</th>
            <th width="auto">apellido</th>
            <th width="auto">razon_social</th>
            <th width="auto">tipo_de_cliente</th>
            <th width="auto">telefono</th>
            <th width="auto">correo</th>
            <th width="auto">origen</th>
            <th width="auto">tipo_documento</th>
            <th width="auto">numero_documento</th>
            <th width="auto">region</th>
            <th width="auto">provincia</th>
            <th width="auto">distrito</th>
            <th width="auto">direccion</th>
            <th width="auto">sucursal</th>
            <th width="auto">asesor</th>
        </tr>
    </thead>
    <tbody>
        @foreach ($clients as $key => $client)
            <tr>
                <td width="auto">{{$client->name}}</td>
                <td width="auto">{{$client->surname}}</td>
                <td width="auto">{{$client->full_name}}</td>
                <td width="auto">{{$client->client_segment->name}}</td>
                <td width="auto">{{$client->phone}}</td>
                <td width="auto">{{$client->email}}</td>
                <td width="auto">{{$client->origen}}</td>
                <td width="auto">{{$client->type_document}}</td>
                <td width="auto">{{$client->n_document}}</td>
                <td width="auto">{{Str::transliterate(Str::upper($client->region))}}</td>
                <td width="auto">{{Str::transliterate(Str::upper($client->provincia))}}</td>
                <td width="auto">{{Str::transliterate(Str::upper($client->distrito))}}</td>
                <td width="auto">{{$client->address}}</td>
                <td width="auto">{{$client->sucursale->name ?? '---'}}</td>
                <td width="auto">{{$client->asesor->email ?? '---'}}</td>
                <td width="auto">{{$client->asesor->name ?? '---'}}</td>
            </tr>
            {{Log::info('Exportando cliente: ' . $client);}}
        @endforeach

    </tbody>
</table>
