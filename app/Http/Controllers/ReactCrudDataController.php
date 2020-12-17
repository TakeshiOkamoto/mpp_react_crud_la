<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

// 追加分
use App\ReactCrudData;
use Illuminate\Support\Facades\DB;

class ReactCrudDataController extends Controller
{
    // 全て初期化
    public function init()
    {
        // 高速削除
        DB::statement('TRUNCATE TABLE react_crud_data;');
        // 高速挿入
        DB::statement('INSERT INTO react_crud_data SELECT * FROM react_crud_data_bk;');

        return redirect(url('/'));
    }
    
    public function index(Request $request)
    {   
        // JSON
        if ($request->format == 'json'){
            $items = ReactCrudData::orderBy('updated_at', 'DESC')->get();
            
            // JSONを返す
            return $items->toArray();
           
            // JSONは次のような形式となる
            //
            //  [
            //    {"id": 1, "name": "プチモンテ"}
            //    {"id": 2, "name": "プチラボ"  }
            //    {"id": 3, "name": "@ゲーム"   }        
            //  ]    
            
        // HTML        
        }else{
            return view('index');
        }       
    }

    public function store(Request $request)
    {
        // パラメータ
        $param = [
            'name'     => $request->name,  
            'comment'  => $request->comment,  
        ];
        
        // トランザクション
        DB::beginTransaction();
        try { 
            // 成功
            $reactcruddata = new ReactCrudData;
            if ($reactcruddata->fill($param)->save()){
                DB::commit();
                return response()->json(['msg'  => 'Ajaxによるデータの登録が成功しました。', 
                                         'id'   => $reactcruddata->id,
                                         'name' => $reactcruddata->name,
                                         'comment'    => $reactcruddata->comment,
                                         'updated_at' => $reactcruddata->updated_at,
                                         ]);                
            }
        } catch (\Exception $e) {
        }  
        
        // エラー時
        DB::rollback();
        return response()->json(['msg' => 'Ajaxによるデータの登録が失敗しました。', 
                                 'id'  => 'error',
                                ]);        
    }

    public function update(Request $request, $id)
    {
        // パラメータ
        $param = [
            'name'     => $request->name,  
            'comment'  => $request->comment,  
        ];

        // トランザクション
        DB::beginTransaction();
        try { 
            // 成功
            if (ReactCrudData::where('id', $id)->update($param) === 1){
                DB::commit();
                return response()->json(['msg' => 'Ajaxによるデータの更新が成功しました。']);                
            }
        } catch (\Exception $e) {
        }  
        
        // エラー時
        DB::rollback();
        return response()->json(['msg' => 'Ajaxによるデータの更新が失敗しました。']);      
    }

    public function destroy($id)
    {        
        // トランザクション
        DB::beginTransaction();
        try { 
            // 成功
            if (ReactCrudData::where('id', $id)->delete() === 1){
                DB::commit();
                return response()->json(['msg' => 'Ajaxによるデータの削除が成功しました。']);                
            }
        } catch (\Exception $e) {
        }  
        
        // エラー時
        DB::rollback();
        return response()->json(['msg' => 'Ajaxによるデータの削除が失敗しました。']);  
    }
}
