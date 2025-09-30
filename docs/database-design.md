# データベース設計 - にじユニットDB

## 概要

にじユニットDBは、にじさんじVTuberのコラボレーションユニット情報を管理するデータベースシステムです。
多層データソース管理とリアルタイムデータ統合を特徴とする設計になっています。

## 論理設計

### エンティティ関係図 (ERD)

```mermaid
erDiagram
    UNIT {
        string id PK "ユニット識別子"
        string name "ユニット名"
        string nameReading "読み方"
        string nameEnglish "英語名"
        number memberCount "メンバー数"
        UnitCategory category "カテゴリ"
        UnitStatus status "活動状況"
        string description "説明"
        string createdAt "作成日"
        string firstStream "初配信日"
        string lastActivity "最終活動日"
        string logo "ロゴURL"
        string[] colors "テーマカラー"
        string[] hashtags "ハッシュタグ"
        number popularity "人気度"
        string[] relatedUnits "関連ユニット"
        string[] tags "タグ"
        string lastUpdated "最終更新日"
        string[] sources "情報源URL"
        string[] games "プレイゲーム"
        Platform[] platforms "配信プラットフォーム"
    }

    MEMBER {
        string name PK "メンバー名"
        string nameReading "読み方"
        string generation "期生"
        Branch branch "ブランチ"
        string role "役割"
        string joinDate "参加日"
        MemberStatus status "活動状況"
    }

    ACTIVITY {
        string id PK "活動ID"
        ActivityType type "活動種別"
        string title "タイトル"
        string date "日付"
        string url "URL"
        string unitId FK "ユニットID"
    }

    QUIZ_QUESTION {
        string id PK "問題ID"
        QuizType type "問題種別"
        string question "問題文"
        string[] options "選択肢"
        string correctAnswer "正解"
        string explanation "解説"
        string unitId FK "ユニットID"
    }

    SEARCH_FILTER {
        string query "検索クエリ"
        number[] memberCount "メンバー数フィルタ"
        UnitCategory[] category "カテゴリフィルタ"
        UnitStatus[] status "ステータスフィルタ"
        Branch[] branch "ブランチフィルタ"
        string[] tags "タグフィルタ"
    }

    %% リレーションシップ
    UNIT ||--o{ MEMBER : "has_members"
    UNIT ||--o{ ACTIVITY : "has_activities"
    UNIT ||--o{ QUIZ_QUESTION : "generates"
    UNIT }o--|| SEARCH_FILTER : "filtered_by"
```

### データソース管理アーキテクチャ

```mermaid
graph TD
    subgraph "データソース層"
        A[units.curated.json<br/>手動キュレーション<br/>高品質データ] 
        B[units.scraped.json<br/>自動スクレイピング<br/>網羅的データ]
        C[status-overrides.json<br/>手動上書き<br/>例外データ]
        D[units.json<br/>レガシー互換<br/>旧システム]
    end

    subgraph "データ処理層"
        E[getUnits関数]
        F[normalizeName関数]
        G[applyOverrides関数]
        H[deriveUnitStatus関数]
    end

    subgraph "アプリケーション層"
        I[メインページ<br/>ユニット一覧]
        J[クイズページ<br/>問題生成]
        K[検索機能<br/>フィルタリング]
    end

    subgraph "UI層"
        L[UnitCard<br/>ユニット表示]
        M[SearchFilters<br/>検索UI]
        N[QuizComponent<br/>クイズUI]
    end

    %% データフロー
    A --> E
    B --> E
    C --> E
    D -.-> J

    E --> F
    E --> G
    E --> H

    E --> I
    E --> J
    E --> K

    I --> L
    K --> M
    J --> N

    %% 優先度（太さで表現）
    A -.->|優先度: 最高| E
    B -.->|優先度: 中| E
    C -.->|優先度: 上書き| E
```

## 型定義

### 列挙型 (Enums)

```mermaid
classDiagram
    class Branch {
        <<enumeration>>
        jp : にじさんじ
        en : NIJISANJI_EN
        id : NIJISANJI_ID
        kr : NIJISANJI_KR
        ex : 卒業済み
    }

    class UnitStatus {
        <<enumeration>>
        active : 活動中
        inactive : 活動休止
        unknown : 不明
    }

    class UnitCategory {
        <<enumeration>>
        gaming : ゲーミング
        music : 音楽
        variety : バラエティ
        collaboration : コラボ
        other : その他
    }

    class MemberStatus {
        <<enumeration>>
        active : 活動中
        graduated : 卒業
        hiatus : 活動休止
    }

    class ActivityType {
        <<enumeration>>
        stream : 配信
        song : 楽曲
        event : イベント
        collab : コラボ
    }

    class Platform {
        <<enumeration>>
        youtube : YouTube
        twitter : Twitter
        discord : Discord
        other : その他
    }
```

## データ統合ロジック

### データマージング処理フロー

```mermaid
flowchart TD
    Start([開始]) --> LoadData[データソース読み込み]
    
    LoadData --> ParseCurated[Curated データ解析]
    LoadData --> ParseScraped[Scraped データ解析]
    LoadData --> ParseOverrides[Overrides データ解析]
    
    ParseCurated --> NormalizeCurated[名前正規化]
    ParseScraped --> NormalizeScraped[名前正規化]
    
    NormalizeCurated --> BuildSignals[スクレイピング信号マップ構築]
    NormalizeScraped --> BuildSignals
    
    BuildSignals --> ProcessCurated{Curated データ処理}
    
    ProcessCurated --> EnrichMembers[メンバー情報エンリッチ]
    EnrichMembers --> ApplyOverrides[上書き適用]
    ApplyOverrides --> StoreCurated[Curatedユニット保存]
    
    StoreCurated --> ProcessScraped{Scraped データ処理}
    ProcessScraped --> CheckExists{既存チェック}
    
    CheckExists -->|存在しない| AddScraped[Scrapedユニット追加]
    CheckExists -->|存在する| Skip[スキップ]
    
    AddScraped --> DeriveStatus[ユニット状況推定]
    Skip --> DeriveStatus
    
    DeriveStatus --> End([完了])

    %% スタイル
    classDef processBox fill:#e1f5fe
    classDef decisionBox fill:#fff3e0
    classDef dataBox fill:#f3e5f5
    
    class LoadData,ParseCurated,ParseScraped,ParseOverrides,EnrichMembers,ApplyOverrides,DeriveStatus processBox
    class ProcessCurated,ProcessScraped,CheckExists decisionBox
    class StoreCurated,AddScraped dataBox
```

### ステータス統合ルール

```mermaid
graph LR
    subgraph "メンバーステータス"
        MA[Active]
        MG[Graduated] 
        MH[Hiatus]
    end

    subgraph "統合ルール"
        R1[全員卒業 → inactive]
        R2[誰も活動していない → inactive]
        R3[一人でも活動中 → active]
        R4[不明 → unknown]
    end

    subgraph "ユニットステータス"
        UA[active]
        UI[inactive]
        UU[unknown]
    end

    MA --> R3
    MG --> R1
    MG --> R2
    MH --> R2
    
    R1 --> UI
    R2 --> UI
    R3 --> UA
    R4 --> UU
```

## 検索・フィルタリング設計

### 検索アーキテクチャ

```mermaid
graph TB
    subgraph "検索入力"
        Q[テキストクエリ]
        F[フィルタ条件]
    end

    subgraph "検索エンジン"
        FuseJS[Fuse.js<br/>ファジー検索]
        MultiFilter[多次元フィルタ]
    end

    subgraph "検索対象フィールド"
        N1[ユニット名 重み:0.3]
        N2[読み方 重み:0.3]
        N3[英語名 重み:0.2]
        M[メンバー名 重み:0.2]
        T[タグ 重み:0.1]
        D[説明 重み:0.05]
    end

    subgraph "フィルタ種別"
        FC[カテゴリ]
        FS[ステータス]
        FB[ブランチ]
        FMC[メンバー数]
        FT[タグ]
    end

    Q --> FuseJS
    F --> MultiFilter

    FuseJS --> N1
    FuseJS --> N2
    FuseJS --> N3
    FuseJS --> M
    FuseJS --> T
    FuseJS --> D

    MultiFilter --> FC
    MultiFilter --> FS
    MultiFilter --> FB
    MultiFilter --> FMC
    MultiFilter --> FT

    N1 --> Results[検索結果]
    N2 --> Results
    N3 --> Results
    M --> Results
    T --> Results
    D --> Results
    FC --> Results
    FS --> Results
    FB --> Results
    FMC --> Results
    FT --> Results
```

## クイズシステム設計

### クイズ生成ロジック

```mermaid
flowchart TD
    Units[ユニットデータ] --> QuizGen[クイズ生成器]
    
    QuizGen --> Q1[ユニット名→メンバー]
    QuizGen --> Q2[メンバー→ユニット名]
    QuizGen --> Q3[メンバー数クイズ]
    
    Q1 --> Validate1{バリデーション<br/>メンバー2人以上？}
    Q2 --> Validate2{バリデーション<br/>他ユニット3つ以上？}
    Q3 --> Validate3{バリデーション<br/>異なるメンバー数3つ以上？}
    
    Validate1 -->|Yes| Generate1[選択肢生成]
    Validate2 -->|Yes| Generate2[選択肢生成]
    Validate3 -->|Yes| Generate3[選択肢生成]
    
    Validate1 -->|No| Skip1[スキップ]
    Validate2 -->|No| Skip2[スキップ]
    Validate3 -->|No| Skip3[スキップ]
    
    Generate1 --> Shuffle[ランダムシャッフル]
    Generate2 --> Shuffle
    Generate3 --> Shuffle
    
    Shuffle --> QuizPool[クイズプール]
    QuizPool --> Select10[10問選択]
    Select10 --> QuizStart[クイズ開始]
```

## パフォーマンス考慮事項

### データ読み込み最適化

```mermaid
graph LR
    subgraph "現在のアーキテクチャ"
        A[全データ読み込み<br/>~100,000行]
        B[クライアント処理<br/>重い]
        C[同期処理<br/>ブロッキング]
    end

    subgraph "最適化案"
        D[仮想化<br/>React Window]
        E[遅延読み込み<br/>Lazy Loading]
        F[インデックス化<br/>Search Index]
        G[ページネーション<br/>50件ずつ]
    end

    A -.->|改善| D
    B -.->|改善| E
    C -.->|改善| F
    C -.->|改善| G
```

## 今後の拡張計画

### フェーズ1: パフォーマンス改善
- 仮想スクロール実装
- 検索インデックス最適化
- 遅延読み込み

### フェーズ2: リアルタイム化
- WebSocket通知
- 増分更新システム
- キャッシュ戦略

### フェーズ3: API化
- REST API実装
- データベース統合
- 認証システム

---

**作成日**: 2024年1月15日  
**最終更新**: 2024年1月15日  
**バージョン**: 1.0  