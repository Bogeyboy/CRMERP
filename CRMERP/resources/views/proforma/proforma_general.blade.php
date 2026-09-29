<table>
    <thead>
        <tr>
            <th width="auto">Nº Proforma</th>
            <th width="auto">Cliente</th>
            <th width="auto">Segmento de cliente</th>
            <th width="auto">Empresa/Persona</th>
            <th width="auto">Total</th>
            <th width="auto">Deuda</th>
            <th width="auto">Pagado</th>
            <th width="auto">Estado de la proforma</th>
            <th width="auto">Estado de pago</th>
            <th width="auto">Asesor</th>
            <th width="auto">Fecha de registro</th>
        </tr>
    </thead>
    <tbody>
        @foreach ($proformas as $key => $proforma)
            <tr>
                {{-- ID DE LA PROFORMA --}}
                <td width="auto">
                    {{ $proforma->id }}
                </td>
                {{-- NOMBRE DEL CLIENTE --}}
                <td width="auto">
                    {{-- {{ $proforma->client->full_name }} --}}
                    {{ $proforma->client?->full_name ?? 'Sin cliente' }}
                </td>
                {{-- SEGMENTO DE CLIENTE --}}
                <td width="auto">
                    {{-- {{ $proforma->client_segment->name }} --}}
                    {{ $proforma->client_segment?->name ?? 'Sin segmento' }}
                </td>
                {{-- TIPO DE CLIENTE --}}
                @if ($proforma->client?->type === 1)
                    <td width="auto"
                        style="background-color:#e3f2fd">
                        <span>Persona</span>
                    </td>
                @elseif ($proforma->client?->type === 2)
                    <td width="auto"
                        style="background-color: #fff3cd">
                        <span>Empresa</span>
                    </td>
                @else
                    <td width="auto"
                        style="background-color: #fff3cd">
                        <span>Sin tipo</span>
                    </td>
                @endif
                {{-- TOTAL DE LA PROFORMA --}}
                <td width="auto">
                    {{ $proforma->total }} €
                </td>
                {{-- CANTIDAD PENDIENTE DE LA PROFORMA --}}
                <td width="auto">
                    {{ $proforma->debt }} €
                </td>
                {{-- CANTIDAD PAGADA DE LA PROFORMA --}}
                <td width="auto">
                    {{ $proforma->paid_out }} €
                </td>
                {{-- ESTADO DE LA PROFORMA --}}
                @if ($proforma->client?->type === 1)
                    <td width="auto"
                        style="background-color:#e3f2fd">
                        <span>Cotización</span>
                    </td>
                @elseif ($proforma->client?->type === 2)
                    <td width="auto"
                        style="background-color: #98fb98">
                        <span>Contrato</span>
                    </td>
                @else
                    <td width="auto"
                        style="background-color: #ff4500">
                        <span>Pendiente</span>
                    </td>
                @endif
                {{-- ESTADO DEL PAGO DE LA PROFORMA --}}
                @switch ($proforma->state_payment)
                    @case (1)
                        <td width="auto" style="background-color: #ff4500">
                            <span>Pendiente</span>
                        </td>
                        @break
                    @case (2)
                        <td width="auto" style="background-color: #ffa500">
                            <span>Parcial</span>
                        </td>
                        @break
                    @case (3)
                        <td width="auto" style="background-color: #3cb371">
                            <span>Completo</span>
                        </td>
                        @break
                    @default
                        <td width="auto" style="background-color: #c0c0c0">
                            <span>Sin estado de pago</span>
                        </td>
                @endswitch
                {{-- ASESOR DE LA PROFORMA --}}
                <td width="auto">

                    @if ($proforma->asesor)
                        {{ $proforma->asesor->name . ' ' . $proforma->asesor->surname }}
                    @else
                        <span class="text-muted">Sin asesor</span>
                    @endif
                </td>
                {{-- FECHA DE REGISTRO DE LA PROFORMA --}}
                <td width="auto">
                    {{ $proforma->created_at->format('d:m:Y h:i:A') }}
                </td>
            </tr>
            {{Log::info('Exportando proforma: ' . $proforma);}}
        @endforeach

    </tbody>
</table>


