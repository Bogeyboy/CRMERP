<?php

namespace App\Console\Commands\Client;

use App\Models\Client\Client;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Mail;
use App\Mail\BirthdayClient as BirthdayClientMail;
use Illuminate\Support\Facades\Log;

class BirthdayClient extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'client:birthday';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Correo de cumpleaños para clientes';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        /* $clients = Client::where('state', 1)
                    ->whereNotNull('birthdate')
                    ->whereRaw('MONTH(birthdate) = MONTH(CURDATE()) AND DAY(birthdate) = DAY(CURDATE())')
                    ->orderBy('id', 'desc')
                    ->get(); */
        date_default_timezone_set('Europe/Madrid');
        $clients = Client::where('state', 1)
                    ->whereMonth('birthdate', today())
                    ->whereDay('birthdate', today())
                    //->whereRaw('MONTH(birthdate) = MONTH(CURDATE()) AND DAY(birthdate) = DAY(CURDATE())')
                    ->orderBy('id', 'desc')
                    ->get();
        foreach ($clients as $key => $client)
        {
            // Aquí puedes enviar el correo electrónico al cliente
            if ($client->email) {
                Mail::to($client->email)->send(new BirthdayClientMail($client));
            }
            // También puedes registrar en el log que se envió el correo
        }
    }
}
