// モジュール 'vscode' には、VS Codeの拡張用APIが含まれている
// モジュールをインポートし、以下のコードではvscodeエイリアスで参照する
const vscode = require('vscode');

// このメソッドは、拡張機能が有効になったときに呼び出される
// 拡張機能が有効になるのは、コマンドが最初に実行されたとき

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// コンソールを使って診断情報（console.log）やエラー（console.error）を出力する
	// このコードの行は、拡張機能が有効化されたときに一度だけ実行される
	console.log('Congratulations, your extension "add-ruby" is now active!');

	// コマンドはpackage.jsonで定義される
	// registerCommandでコマンドの実装を提供する
	// commandIdパラメーターは、package.jsonのcommandフィールドと一致する必要がある
	let disposable = vscode.commands.registerCommand('add-ruby.place', function () {
		// ここに配置されたコードは、コマンドが実行されるたびに実行される

		let cursor = vscode.workspace.getConfiguration('add-ruby').cursorMovement; // カーソル移動に関する設定を取得
		let mode = vscode.workspace.getConfiguration('add-ruby').rubyMode; // ルビ記号に関する設定を取得
		let shift

		switch(mode){
			case "half":
				var rubyStart = new RegExp('\\|') // ルビ開始記号の「|」(半角)検索用
				var rubied_empty = new RegExp('(?<=\\|).*(?=《》)')	// 識別用の正規表現「|.*《》」
				var left = "|"
				var center = "《"
				var right = "》"
				shift = 1
				break;
			case "full":
				var rubyStart = new RegExp('｜') // ルビ開始記号の「｜」(全角)検索用
				var rubied_empty = new RegExp('(?<=｜).*(?=《》)')	// 識別用の正規表現「｜.*《》」
				var left = "｜"
				var center = "《"
				var right = "》"
				shift = 1
				break;
			case "pixiv":
				var rubyStart = new RegExp('\\[\\[rb:') // ルビ開始記号「[」検索用
				var rubied_empty = new RegExp('(?<=\\[\\[rb:).*(?=\ > \\]\\])')	// 識別用の正規表現「[[rb:.*《》」
				// [[rb:ルビを振りたい文字 > ]]
				var left = "[[rb:"
				var center = " > "
				var right = "]]"
				shift = 2
				break;
			case "html":
				var rubyStart = new RegExp('<ruby>') // ルビ開始記号「<ruby>」検索用
				var rubied_empty = new RegExp('(?<=<ruby>).*(?=<rt></rt></ruby>)')	// 識別用の正規表現「[[rb:.*《》」
				var left = "<ruby>"
				var center = "<rt>"
				var right = "</rt></ruby>"
				shift = 12
				break;
		}

		let editor = vscode.window.activeTextEditor;	// エディタ情報の取得
		let selection = editor.selection	// 選択範囲の情報を取得
		let text = editor.document.getText(selection)	// 選択範囲の情報をテキストに（選択範囲の文字列を取得）

		// “なろう”の挿絵用URLの場合、専用形式に置き換える
		let url = new RegExp('https.*')

		if(url.test(text)==true){ // URLの正規表現にマッチした場合
			vscode.window.showInformationMessage("挿絵URLを検出しました。専用形式に変換します。")
			let re_id = new RegExp('(?<=https://)[0-9]*')
			let re_icode = new RegExp('(?<=https://.*.mitemin.net/)[i0-9]*')
			let id=text.match(re_id)[0]	
			let icode=text.match(re_icode)[0]	
			let img=("<"+icode+"|"+id+">")
			str_length = img.length;
			shift = 0;
			editor.edit(builder => builder.replace(selection, img)) // 選択してた文字列を、newTextに置き換え（カッコを追加）	
		}else{// URLでない
			if(rubyStart.test(text)==true){	// ルビ開始記号が存在する
				if(rubied_empty.test(text)==true) { //記号は存在するが、ルビの内容が記述されていないとき（傍点付与）
					vscode.window.showInformationMessage("ルビの内容が記述されていません。傍点の付与を行います。")
					let rubied = text.match(rubied_empty)[0]	// rubied_emptyにマッチした文字列を取得
					let emphasis_Text=""
					for(let i=0; i<rubied.length; i++){	// 1文字ずつ処理
						emphasis_Text+=(left + rubied[i] + center + "・" + right);// emphasis_Text に結合（ループで繰り返されることで、文字列の1文字1文字にルビ記号と傍点が付与されるように）
					}
					editor.edit(builder => builder.replace(selection, emphasis_Text)) // 選択してた文字列を、newTextに置き換え（カッコを追加）
					str_length = emphasis_Text.length;
					shift = 0;	
				}else{
					vscode.window.showWarningMessage("ルビ記号が付与され、内容が記述されています。変更は行われません。")
				}
			}else{ // ルビ記号が見つからない場合（記号付与）
				vscode.window.showInformationMessage("ルビ記号の付与を行います。")
				let newText = (left +text+ center + right)	// newTextの定義（元文字列にカッコを付与したもの）
				editor.edit(builder => builder.replace(selection, newText)) // 選択してた文字列を、newTextに置き換え（カッコを追加）
				str_length = newText.length;

				if(text.length==0){	//文字列が選択されていない（選択文字列textの長さ==0の）場合
					switch(mode){
						case "half": shift = 2; break;
						case "full": shift = 2; break;
						case "pixiv": shift = 5; break;
						case "html": shift = 16; break;
					}
				}
			}
		}
		// カーソル移動処理
		if(cursor==true){
			let position = editor.selection.active // カーソル位置の取得
			let newPosition = position.with(position.line, (editor.selection.start.character+str_length-shift)); // 新しいカーソル位置の定義（文字列の選択開始位置までの文字数 + 選択範囲に記号を付与した文字数-shift）
			let newSelection = new vscode.Selection(newPosition, newPosition); // 新たな選択位置の定義（範囲が同じ位置,同じ位置 ＝カーソルが動くだけ）
			editor.selection = newSelection;	// 定義した選択位置を適用
		}
	});

	context.subscriptions.push(disposable);
}

// このメソッドは、拡張機能が無効化されたときに呼び出される
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
