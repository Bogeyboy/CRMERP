declare let ClipboardJS: any;
declare namespace DataTables {
    interface Settings {
        // Aquí puedes añadir las propiedades que necesites
        [key: string]: any;
    }

    interface Api {
        // Métodos básicos
        ajax: {
            reload: () => void;
        };
        search: (value: string) => Api;
        draw: () => void;
        [key: string]: any;
    }
}
