# MarmotPath

## 環境構築
### フロントエンド 

1. ルートディレクトリに戻る
```commandline
cd ../
```
2. frontendディレクトリに移動
```commandline
cd frontend
```
3. 依存パッケージのインストール
```commandline
npm install
```
4. 追加パッケージのインストール
```commandline
npm install reactflow axios zustand
npm install -D tailwindcss@^3.3.6 postcss@^8.4.32 autoprefixer@^10.4.16
```
6. Tailwind CSSの初期化
```commandline
npx tailwindcss init -p
```

## 実行
1. バックエンドの起動
```commandline
cd backend
python run.py
```
2. フロントエンドの起動
```commandline
cd frontend
npm run dev
```