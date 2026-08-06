<?php

namespace App\Exports\Client;

use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\FromView;

class ExportClient implements FromView
{
    protected $clients;
    public function __construct($clients) {
        $this->clients = $clients;
    }
    /**
    * @return \Illuminate\Support\Collection
    */
    public function view(): View
    {
        return view("client.export_client", [
            "clients" => $this->clients,
        ]);
    }
}
