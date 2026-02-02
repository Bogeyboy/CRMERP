<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class PermissionsDemoSeeder extends Seeder
{
    /**
     * Create the initial roles and permissions.
     *
     * @return void
     */
    public function run()
    {
        // Reset cached roles and permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // create permissions
        Permission::create(['guard_name' => 'api', 'name' => 'register_role']);
        Permission::create(['guard_name' => 'api', 'name' => 'edit_role']);
        Permission::create(['guard_name' => 'api', 'name' => 'delete_role']);

        Permission::create(['guard_name' => 'api', 'name' => 'register_user']);
        Permission::create(['guard_name' => 'api', 'name' => 'edit_user']);
        Permission::create(['guard_name' => 'api', 'name' => 'delete_user']);

        Permission::create(['guard_name' => 'api', 'name' => 'register_product']);
        Permission::create(['guard_name' => 'api', 'name' => 'edit_product']);
        Permission::create(['guard_name' => 'api', 'name' => 'list_product']);
        Permission::create(['guard_name' => 'api', 'name' => 'delete_product']);

        Permission::create(['guard_name' => 'api', 'name' => 'show_wallet_price_product']);
        Permission::create(['guard_name' => 'api', 'name' => 'register_wallet_price_product']);
        Permission::create(['guard_name' => 'api', 'name' => 'edit_wallet_price_product']);
        Permission::create(['guard_name' => 'api', 'name' => 'delete_wallet_price_product']);

        Permission::create(['guard_name' => 'api', 'name' => 'register_clientes']);
        Permission::create(['guard_name' => 'api', 'name' => 'edit_clientes']);
        Permission::create(['guard_name' => 'api', 'name' => 'delete_clientes']);

        Permission::create(['guard_name' => 'api', 'name' => 'valid_payments']);
        Permission::create(['guard_name' => 'api', 'name' => 'reports_caja']);
        Permission::create(['guard_name' => 'api', 'name' => 'record_contract_process']);
        Permission::create(['guard_name' => 'api', 'name' => 'egreso']);

        Permission::create(['guard_name' => 'api', 'name' => 'ingreso']);
        Permission::create(['guard_name' => 'api', 'name' => 'close_caja']);
        Permission::create(['guard_name' => 'api', 'name' => 'register_proforma']);
        Permission::create(['guard_name' => 'api', 'name' => 'edit_proforma']);

        Permission::create(['guard_name' => 'api', 'name' => 'delete_proforma']);
        Permission::create(['guard_name' => 'api', 'name' => 'cronograma']);
        Permission::create(['guard_name' => 'api', 'name' => 'comisiones']);
        Permission::create(['guard_name' => 'api', 'name' => 'register_compra']);

        Permission::create(['guard_name' => 'api', 'name' => 'edit_compra']);
        Permission::create(['guard_name' => 'api', 'name' => 'delete_compra']);
        Permission::create(['guard_name' => 'api', 'name' => 'register_transporte']);
        Permission::create(['guard_name' => 'api', 'name' => 'edit_transporte']);

        Permission::create(['guard_name' => 'api', 'name' => 'delete_transporte']);
        Permission::create(['guard_name' => 'api', 'name' => 'despacho']);
        Permission::create(['guard_name' => 'api', 'name' => 'movimientos']);
        Permission::create(['guard_name' => 'api', 'name' => 'kardex']);
        // create roles and assign existing permissions
        // $role1 = Role::create(['guard_name' => 'api','name' => 'writer']);
        // $role1->givePermissionTo('edit articles');
        // $role1->givePermissionTo('delete articles');

        //$role2 = Role::create(['guard_name' => 'api','name' => 'admin']);
        // $role2->givePermissionTo('publish articles');
        // $role2->givePermissionTo('unpublish articles');

        $role3 = Role::create(['guard_name' => 'api', 'name' => 'Super-Admin']);
        // gets all permissions via Gate::before rule; see AuthServiceProvider

        // create demo users
        // $user = \App\Models\User::factory()->create([
        //     'name' => 'Example User',
        //     'email' => 'test@example.com',
        //     'password' => bcrypt("12345678"),
        // ]);
        // $user->assignRole($role1);

        $user = \App\Models\User::factory()->create([
            'name' => 'Super Admin',
            'email' => 'admin@admin.com',
            'password' => bcrypt("Namoa2208"),
        ]);
        $user->assignRole($role3);
    }
   /* public function run()
    {
        // Limpiar cache de Spatie
        app(PermissionRegistrar::class)->forgetCachedPermissions();

        $permissions = [
            'register_role',
            'edit_role',
            'delete_role',
            'register_user',
            'edit_user',
            'delete_user',
            'register_product',
            'edit_product',
            'list_product',
            'delete_product',
            'show_wallet_price_product',
            'register_wallet_price_product',
            'edit_wallet_price_product',
            'delete_wallet_price_product',
            'register_clientes',
            'edit_clientes',
            'delete_clientes',
            'valid_payments',
            'reports_caja',
            'record_contract_process',
            'egreso',
            'ingreso',
            'close_caja',
            'register_proforma',
            'edit_proforma',
            'delete_proforma',
            'cronograma',
            'comisiones',
            'register_compra',
            'edit_compra',
            'delete_compra',
            'register_transporte',
            'edit_transporte',
            'delete_transporte',
            'despacho',
            'movimientos',
            'kardex',
        ];

        // Crear permisos sin duplicar
        foreach ($permissions as $permission) {
            Permission::firstOrCreate(
                ['name' => $permission, 'guard_name' => 'api']
            );
        }

        // Crear roles
        $adminRole = Role::firstOrCreate(
            ['name' => 'admin', 'guard_name' => 'api']
        );

        $superAdminRole = Role::firstOrCreate(
            ['name' => 'Super-Admin', 'guard_name' => 'api']
        );

        // Super-Admin tiene TODOS los permisos
        $superAdminRole->syncPermissions(Permission::all());

        // Crear o recuperar usuario Super Admin
        $user = \App\Models\User::firstOrCreate(
            [
                'email' => 'admin@admin.com'
            ],
            [
                'name' => 'Super Admin',
                'password' => bcrypt('Namoa2208'),
            ]
        );

        // Quitar roles previos y asignar Super-Admin
        $user->syncRoles([$superAdminRole]);
    } */
}
