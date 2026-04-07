<?php

use App\Jobs\DeleteOldShipmentsJob;
use Illuminate\Support\Facades\Schedule;

Schedule::command('queue:flush')->daily()
->at('00:00');

Schedule::job(new DeleteOldShipmentsJob())->daily()
->at('00:00');
