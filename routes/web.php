<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', 'ReactCrudDataController@index');
Route::post('/', 'ReactCrudDataController@store');
Route::put('/{id}', 'ReactCrudDataController@update');
Route::delete('/{id}', 'ReactCrudDataController@destroy');

Route::get('init', 'ReactCrudDataController@init');