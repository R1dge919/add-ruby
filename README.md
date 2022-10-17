# add-ruby

VSCodeで、選択した文字列にルビ記号を付与する拡張機能

## 使用方法

- コマンドパレットから「ルビ振り」を選択
- エディタ右上のアイコンをクリック
- 文字列選択中、右クリックのメニューから「ルビ振り」を選択

## 動作
> `cursorMovement`を有効にしていると、カーソルはIの位置に移動する
> 無効の場合、文字列選択は維持される
- 何もないところでコマンドを実行すると、ルビ記号を配置する
    ```
    「」→「｜I《》」
    ```
- 文字列選択中に実行すると、それを囲むようにルビ記号を配置する
    ```
    「文字列」→「｜文字列《I》」
    ```
- ルビ文字が記述されていないルビ記号に対して実行すると、傍点を記述する
    ```
    「｜文字列《》」→「｜文《・》｜字《・》｜列《・》I」
    ```
- `convertIllust`有効時
    - 『小説家になろう』の挿絵用URLを選択すると、専用形式に変換する
        ```
            「https://23.mitemin.net/i3724/」→「<i3724|23>I」
        ```

## 設定

- `add-ruby.cursorMovement`
    - 選択範囲に処理を行った後に、カーソルを移動する（デフォルト有効）
- `add-ruby.convertIllust`
    - 『小説家になろう』の挿絵用URLを選択すると、専用形式に変換する（デフォルト有効）
- `add-ruby.rubyMode`
    - ルビ記号のモード切替
        モード    | 説明 | 例
        ---------   |---------- |---
        `half`      | なろう／カクヨム記法（開始記号が半角）        | \|文字《ルビ》
        `full`      | なろう／カクヨム記法（開始記号が全角）      | ｜文字《ルビ》
        `pixiv`     | pixiv記法       | [[rb:文字 > ルビ]]6
        `html`      | HTMLタグ          | <ruby>文字<rt>ルビ</rt></ruby>
- `add-ruby.emphasisMode`（新機能）
    - 傍点のモード切替
        モード    | 説明 | 
        ---------   |---------- 
        `・`        | 中点：『小説家になろう』の入力補助機能で使われているもの。       
        `﹅`        | ゴマ(SESAME DOT)：W3C『日本語組版処理の要件（日本語版）』によると、一般に縦組で使用    
        `•`         | ビュレット(BULLET)：W3C『日本語組版処理の要件（日本語版）』によると、一般に横組で使用

## あとがき（過去Ver使用者向け）
- 類似機能を持ちつつ、他の機能も兼ね備えた拡張機能があったため、こちらは約1年前に公開停止していた……
    - 何件か、この拡張機能についてTwitterで投稿されていたり、記事で紹介されていたのが嬉しくて、機能拡張とともに再公開しました
    - **主に設定切り替え機能の追加を行いました**

## Release Notes
### 1.0.0
リリース
### 1.1.0
傍点のモード切替を実装
---