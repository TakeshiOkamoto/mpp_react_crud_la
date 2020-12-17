
// IE9,10,11対策用
//import 'react-app-polyfill/ie9'
//import 'react-app-polyfill/stable'

//IE11対策
import 'react-app-polyfill/ie11'
import 'react-app-polyfill/stable'

// React
import React from 'react'
import ReactDOM from 'react-dom'

// 日時操作
import {format} from 'date-fns'
import ja from 'date-fns/locale/ja'

// IEのFormData対策用
import 'formdata-polyfill'

// Ajax
import axios from 'axios'
    
class ReactCurdComponent extends React.Component {

  // ---------------------
  //  コンストラクタ
  // ---------------------
  constructor(props) {    
    super(props);
    
    this.state = {
      error    : null,   // エラー
      isLoaded : false,  // ローディングフラグ
      items    : [],     // アイテム
      mode     : [],     // アイテムのモード(表示 = false, 編集 = true)
      name     : '',     // 投稿 - 名前
      comment  : '',     // 投稿 - コメント 
      status   : 'ここに「Ajax」に関するメッセージが表示されます。' 
    };
  }
    
  // ---------------------
  //  Ajax通信(送信用)
  // ---------------------  
  run_ajax(method, url, data){
    
      axios({
        method  : method,
        baseURL : url,
        data    : data,
        headers : {
          // JSON
          'Content-Type': 'application/json',
          // CSRFトークン
          // ※AxiosはCookie(Laravelが自動生成)に「X-XSRF-TOKEN」があると、そのヘッダを自動的に送信するので以下は不要
          // https://readouble.com/laravel/6.x/ja/csrf.html 
          //'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content') 
        }
      })
      .then(response  => {
        
        this.setState((state) => {           
          state.status = "サーバーからのメッセージ(" + 
                         this.formatConversion(new Date())  + ") ：" + response.data.msg;   

          // 新規登録時のみIDなどが返却される
          if(response.data.id){
            
            // 失敗
            if(response.data.id == "error"){
              
              // エラー制御は行っていないので各自で。
              return { status: state.status }
              
            // 成功  
            }else{
              
              // 先頭にアイテムを追加する 
              state.items.unshift({id         : response.data.id,
                                   name       : response.data.name,
                                   comment    : response.data.comment,
                                   updated_at : response.data.updated_at}
                                 );    
              state.mode.unshift(false);
              return { status: state.status, items: state.items, mode: state.mode }
            }
            
          // 更新/削除
          }else{
             
            // エラー制御は行っていないので各自で。
            return { status: state.status }
          }                 
        });   
      }) 
      .catch(err => {
        this.setState((state) => {           
          state.status = err;     
          return { status: state.status }
        });  
      });
  }  

  // ---------------------
  //  日付操作 
  // ---------------------
  formatConversion(updated_at) {
    
    // IE11対策で日付形式をISO 8601に変換する
    // 変換前： 2019-01-01 00:00:00
    // 変換後： 2019-01-01T00:00:00.000Z
    if (typeof updated_at !== 'object' && updated_at.indexOf('T') === -1){
      const a = updated_at.slice(0,10);
      const b = 'T'
      const c = updated_at.slice(11);   
      const d = '.000Z'; 
      updated_at =  a + b + c + d;
    }
    
    return format(new Date(Date.parse(updated_at)), 'yyyy年MM月dd日(iiiii) HH:mm:ss', { locale: ja });
  }
  
  // ---------------------
  //  イベント(独自)
  // ---------------------
  
  // 投稿 - 名前
  handleNameChange(event){
    const value = event.target.value;
    
    this.setState((state) => {           
      state.name = value;     
      return { name: state.name }
    });    
  }

  // 投稿 - コメント
  handleCommentChange(event){
    const value = event.target.value;
    
    this.setState((state) => {           
      state.comment = value;     
      return { comment: state.comment }
    });   
  }
  
  // 表示モード/編集モードの切り替え
  handleModeChange(index, event) {
    
    this.setState((state) => {           
      state.mode[index] = !state.mode[index];      
      return { mode: state.mode }
    });    
    event.preventDefault();
  }  
  
  // データの登録
  handleInsert(event){    
    
    this.setState((state) => {      
      if (state.name && state.comment){

        // Ajax
        this.run_ajax("POST",
                      "http://localhost:8000/" ,
                      { name: state.name, comment: state.comment }
                     );
                                                  
        state.name = '';
        state.comment = '';
        
        return { items: state.items }
      }      
    });  
    
    event.preventDefault();    
  }
    
  // データの更新
  handleUpdate(index, id, event){
    
    // フォームデータ
    // ※<input onChange={} />で状態管理を行うとキャンセルができないので<input defaultValue={} />とFormDataを使っています。
    const form_data = new FormData(event.target);

    this.setState((state) => {
      
      const txt_name = form_data.get('txt_name');
      const txt_comment = form_data.get('txt_comment');

      // 空または前回と同じ値でなければ      
      if (
          (txt_name && txt_comment) &&
          (!(state.items[index].name == txt_name && 
             state.items[index].comment == txt_comment))
         ){
          
        state.items[index].name = txt_name;
        state.items[index].comment = txt_comment;
        state.items[index].updated_at = new Date();
        
        // Ajax
        this.run_ajax("PUT",
                      "http://localhost:8000/"  + id ,
                      { name: txt_name, comment: txt_comment }
                     );
                     
        return { items: state.items }                     
      }     
    });  
       
    // 表示モードに変更する
    this.handleModeChange(index, event);
  }

  // データの削除
  handleDelete(index, id, event) {
    
    this.setState((state) => {
     
      state.items.splice(index, 1);
      state.mode.splice(index, 1);
      
      // Ajax
      this.run_ajax("DELETE",
                    "http://localhost:8000/"  + id ,
                    {}
                   );
            
      return { items: state.items, mode: state.mode }
    });    
            
    event.preventDefault();
  }  
  
  // ---------------------
  //  イベント(React)
  // --------------------- 

  // データの読み込み
  componentDidMount() {
    
    // JSONデータの取得
    const params = { format : 'json' };
    axios.get('http://localhost:8000/', { params })
      .then(response  => {
      
          if (response.status == 200){
            
            // モードの初期化(全て表示モード)
            const mode =  Array(response.data.length).fill(false);  
            
            this.setState({
              isLoaded : true,          // ローディングフラグ
              items    : response.data, // リストデータ    
              mode     : mode           // モード 
            });
                          
          }else{
            this.setState({
              isLoaded : true,
              error    : { message: '初期情報が読み込めませんでした。' }
            });
          }
      }) 
      .catch(err => {
          this.setState({
            isLoaded : true,
            error    : err
          });
      });
  }
  
  // ---------------------
  //  メイン
  // ---------------------
  render() {
    const { error, isLoaded, items, mode } = this.state;
    
    // エラー
    if (error) {
      
      return <div>Error: { error.message }</div>;
      
    // ローディング 
    } else if (!isLoaded) {
      
      return <div>Loading...</div>;
      
    // 正常動作  
    } else {
      return (
        <div>
          <p></p>
          <div className="fixed-bottom bg-dark text-white" style={{ opacity: 0.75 }}>
            <span>&nbsp;&nbsp;</span>
            <span>{ this.state.status }</span>
          </div>
          
          <h3>投稿</h3>
          <p></p>
          <form onSubmit={ this.handleInsert.bind(this) }>
            <input type="text" value={ this.state.name } name="txt_name" className="form-control" placeholder="名前" onChange={ this.handleNameChange.bind(this) } />
            <textarea value={ this.state.comment } name="txt_comment" className="form-control" rows="5" placeholder="コメントを入力します。" onChange={ this.handleCommentChange.bind(this) } />
            <input type="submit" value="登録" className="btn btn-primary" />
          </form>        
          <p></p>
          
          <h3>一覧</h3>
          <p></p>      
          <div className="card-columns">
          { items.map((item, index) => { 
                
                // 表示モード
                if (!mode[index]){                
                  return(
                    <div className="card" key={ index }> 
                      <div className="card-header">
                        { item.name } <br />{ this.formatConversion(item.updated_at) }
                      </div>
                      <div className="card-body">
                        { item.comment }
                        <br />
                        <br />
                        <form>
                          <div style={{ textAlign: "right" }}> 
                            <input type="submit" value="編集" className="btn btn-primary" onClick={ this.handleModeChange.bind(this, index) } />
                            &nbsp;&nbsp;
                            <input type="submit" value="削除" className="btn btn-danger" onClick={ this.handleDelete.bind(this, index, item.id) } />
                            &nbsp;&nbsp;
                          </div> 
                        </form>
                      </div>
                    </div>
                  );
                  
                // 編集モード  
                }else{
                  return(
                    <div className="card" key={ index }> 
                      <form onSubmit={ this.handleUpdate.bind(this, index, item.id) }>
                        <div className="card-header">
                          <input type="text" defaultValue={ item.name } name="txt_name" className="form-control" />
                        </div>
                        <div className="card-body">
                          <textarea defaultValue={ item.comment } name="txt_comment" className="form-control" rows="5" />                      
                        </div>
                        <div style={{ textAlign:"right" }}>
                          <input type="submit" value="キャンセル" className="btn btn-secondary" onClick={ this.handleModeChange.bind(this, index) } />
                          &nbsp;&nbsp;
                          <input type="submit" value="更新" className="btn btn-primary" />
                          &nbsp;&nbsp;
                        </div>
                        <p></p>
                      </form>
                    </div>
                  );
                }  
          })}
          </div>
        </div>
      );
    } // end if
  } // end render
}

export default ReactCurdComponent;

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <ReactCurdComponent />,
    document.getElementById('app')
  )
})
