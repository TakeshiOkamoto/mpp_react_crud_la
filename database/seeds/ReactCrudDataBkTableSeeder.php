<?php

use Illuminate\Database\Seeder;

class ReactCrudDataBkTableSeeder extends Seeder
{
    public function run()
    {   
        // データインポート
        DB::transaction(function (){  
        
            // 全削除
            DB::table('react_crud_data_bk')->truncate();
            
            DB::table('react_crud_data_bk')->insert([
                'id'           => 1,
                'name'         => "プチモンテ",
                'comment'      => "Ubuntu16.04にLazarusをインストールする [RADによる開発環境]", 
                'created_at'   => "2020-02-26 04:37:12",
                'updated_at'   => "2020-02-26 04:37:12",
            ]);
            
            DB::table('react_crud_data_bk')->insert([
                'id'           => 2,
                'name'         => "プチモンテ",
                'comment'      => "青色申告決算書 & 仕訳帳システム", 
                'created_at'   => "2020-02-27 11:00:12",
                'updated_at'   => "2020-02-27 11:00:12",
            ]);  
            
            DB::table('react_crud_data_bk')->insert([
                'id'           => 3,
                'name'         => "プチモンテ",
                'comment'      => "Rails6プロジェクトの各種初期設定", 
                'created_at'   => "2020-02-27 20:30:12",
                'updated_at'   => "2020-02-27 20:30:12",
            ]);  
            
            DB::table('react_crud_data_bk')->insert([
                'id'           => 4,
                'name'         => "プチモンテ",
                'comment'      => "NginxにRoundcubeのWebメールシステムを導入する [CentOS]", 
                'created_at'   => "2020-03-01 03:45:56",
                'updated_at'   => "2020-03-01 03:45:56",
            ]);  
            
            DB::table('react_crud_data_bk')->insert([
                'id'           => 5,
                'name'         => "プチモンテ",
                'comment'      => "ネットワークカメラを用いた顔認識及び人物特定システムの構築 [防犯カメラの自作]", 
                'created_at'   => "2020-03-02 09:22:08",
                'updated_at'   => "2020-03-02 09:22:08",
            ]);  
            
            DB::table('react_crud_data_bk')->insert([
                'id'           => 6,
                'name'         => "プチモンテ",
                'comment'      => "Android App Bundle(*.aab)でゲームをアップロード [Unity]", 
                'created_at'   => "2020-03-03 13:28:00",
                'updated_at'   => "2020-03-03 13:28:00",
            ]);  
            
            DB::table('react_crud_data_bk')->insert([
                'id'           => 7,
                'name'         => "プチモンテ",
                'comment'      => "収縮と膨張によるノイズ除去のサンプルコード(2値画像用)", 
                'created_at'   => "2020-03-03 14:30:11",
                'updated_at'   => "2020-03-03 14:30:11",
            ]);                                                                          
            
            
            DB::table('react_crud_data_bk')->insert([
                'id'           => 8,
                'name'         => "プチモンテ",
                'comment'      => "JavaScriptでC/C++コードを実行してネイティブアプリのように高速にする [WebAssembly]", 
                'created_at'   => "2020-03-03 14:47:52",
                'updated_at'   => "2020-03-03 14:47:52",
            ]);    
             
        });
        
    }}
