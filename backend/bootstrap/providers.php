<?php

$providers = [
    App\Providers\AppServiceProvider::class,
];

// Only register Filament provider if Filament is installed
if (class_exists(\Filament\PanelProvider::class)) {
    $providers[] = App\Providers\Filament\AdminPanelProvider::class;
}

return $providers;
