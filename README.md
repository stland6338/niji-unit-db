# にじユニットDB

にじさんじのコラボ・ユニット情報をまとめたデータベースサイトです。

## 特徴

- 📋 **ユニット一覧**: にじさんじライバーのコラボ・ユニット情報を網羅
- 🔍 **高度な検索**: ユニット名、メンバー名、カテゴリでの絞り込み
- 🎮 **クイズ機能**: ユニットに関するクイズで楽しく学習
- 📱 **レスポンシブ**: モバイル・デスクトップ両対応
- ⚡ **高速**: Next.js 14 + TypeScriptで最適化

## 技術スタック

- **フレームワーク**: Next.js 14 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **検索**: Fuse.js
- **デプロイ**: Vercel

## 開発開始

```bash
# 依存関係のインストール
npm install

# 開発サーバー起動
npm run dev
```

[http://localhost:3000](http://localhost:3000) でサイトを確認できます。

## プロジェクト構造

```
src/
├── app/              # Next.js App Router
├── components/       # UIコンポーネント
│   ├── ui/          # 基本UIコンポーネント
│   └── features/    # 機能固有コンポーネント
├── lib/             # ユーティリティ関数
├── types/           # TypeScript型定義
└── data/            # JSONデータファイル
```

## データ形式

ユニットデータは `src/data/units.json` で管理されています。新しいユニットを追加する場合は、既存のデータ形式に従ってください。

## 貢献

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/new-feature`)
3. 変更をコミット (`git commit -am 'Add new feature'`)
4. ブランチをプッシュ (`git push origin feature/new-feature`)
5. Pull Requestを作成

## ライセンス

MIT License
