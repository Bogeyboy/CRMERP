<?php

namespace App\Exports\Product;

use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterSheet;

class DownloadProduct implements FromView,ShouldAutoSize, WithEvents
{

    protected $products;
    public function __construct($products) {
        $this->products = $products;
    }
    /**
    * @return \Illuminate\Support\Collection
    */
    public function view(): View
    {
        return view("product.download_product", [
            "products" => $this->products,
        ]);
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function(AfterSheet $event) {
                // Auto-size todas las columnas
                $sheet = $event->sheet->getDelegate();
                
                $highestColumn = $sheet->getHighestColumn();
                $highestColumnIndex = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::columnIndexFromString($highestColumn);
                
                for ($col = 1; $col <= $highestColumnIndex; $col++) {
                    $sheet->getColumnDimensionByColumn($col)->setAutoSize(true);
                }
            },
        ];
    }
}
