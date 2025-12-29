# MarmotPath

## 環境構築
### フロントエンド 

1. ルートディレクトリに戻る
```commandline
cd ../
```
2. Viteを使ってReactプロジェクトを作成
```commandline
npm create vite@latest frontend -- --template react-ts
```
3. rontendディレクトリに移動
```commandline
cd frontend
```
4. 依存パッケージのインストール
```commandline
npm install
```
5. 追加パッケージのインストール
```commandline
npm install reactflow axios zustand
npm install -D tailwindcss@^3.3.6 postcss@^8.4.32 autoprefixer@^10.4.16
```
6. Tailwind CSSの初期化
```commandline
npx tailwindcss init -p
```