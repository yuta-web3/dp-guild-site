# DP-GUILD デザインルール

## 作成日: 2026-01-08
## 目的: 判断LPの思想を壊さないためのデザイン指針

---

# 基本思想

> **「判断を邪魔しないデザイン」**

- 目立たせない
- 説明しすぎない
- 気取らない
- 余白を恐れない

---

# カラーパレット（固定）

## 使っていい色

| 用途 | 色 | Tailwind |
|------|-----|----------|
| メインテキスト | #0F172A | `text-[#0F172A]` |
| サブテキスト | #4B5563 | `text-gray-600` |
| 薄いテキスト | #6B7280 | `text-gray-500` |
| 背景（白） | #FFFFFF | `bg-white` |
| 背景（グレー） | #F8FAFC | `bg-[#F8FAFC]` |
| ボタン背景 | #0F172A | `bg-[#0F172A]` |
| ボタンホバー | #1e293b | `hover:bg-[#1e293b]` |
| 向いている人 | #22C55E | `text-green-500` |
| 向いていない人 | #9CA3AF | `text-gray-400` |

## 使っちゃダメな色

- グラデーション全般
- 派手な青（#0EA5E9等のcyan系）
- 赤・オレンジ（警告以外）
- 原色全般

---

# タイポグラフィ（固定）

## フォント

```css
font-family: var(--font-geist-sans), Arial, Helvetica, sans-serif;
```

**変更禁止。** デザインフォント導入NG。

## サイズスケール

| 用途 | サイズ | Tailwind |
|------|--------|----------|
| ヒーロー見出し | 48px (mobile: 30px) | `text-3xl md:text-5xl` |
| セクション見出し | 36px (mobile: 24px) | `text-2xl md:text-4xl` |
| 小見出し | 24px (mobile: 20px) | `text-xl md:text-2xl` |
| 本文 | 18px | `text-lg` |
| 補足テキスト | 16px | `text-base` |
| 注釈 | 14px | `text-sm` |

## 太字の使用

- 見出しのみ `font-bold`
- 本文中の強調は **1セクション1箇所まで**
- 乱用禁止

---

# 余白・スペーシング（固定）

## セクション間

| 箇所 | 値 | Tailwind |
|------|-----|----------|
| セクション上下 | 96px (mobile: 96px) | `py-24 md:py-32` |
| コンテンツ最大幅 | 768px | `max-w-3xl` |
| 広めのコンテンツ | 896px | `max-w-4xl` |

## 要素間

| 箇所 | 値 | Tailwind |
|------|-----|----------|
| 見出し下 | 32px | `mb-8` |
| 段落間 | 16-24px | `mb-4` ~ `mb-6` |
| リスト項目間 | 16px | `space-y-4` |

**余白を減らす変更は原則禁止。**

---

# ボタン・CTA（固定）

## スタイル

```jsx
// 標準CTA
className="inline-flex items-center px-8 py-4 bg-[#0F172A] text-white rounded-lg font-medium hover:bg-[#1e293b] transition-colors"

// 大きいCTA（最下部用）
className="inline-flex items-center px-10 py-5 bg-white text-[#0F172A] rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors"
```

## 禁止事項

- 影（box-shadow）追加
- グラデーション
- アニメーション（hover以外）
- 常時追従（sticky/fixed）
- 派手な色

## アイコン

- `ArrowRight` のみ使用可
- サイズは `w-5 h-5` または `w-6 h-6`
- 他のアイコン追加は要検討

---

# カード・ボックス（固定）

## 背景ボックス

```jsx
className="bg-[#F8FAFC] rounded-xl p-8"
```

## 禁止事項

- 影（shadow-md以上）
- ボーダー装飾
- グラデーション背景

---

# 画像・イラスト

## 使っていいもの

- 代表者写真（/aboutページのみ）
- 実績の実物スクリーンショット（/resultsページのみ）

## 使っちゃダメなもの

- ストックフォト
- イラスト・アイコンセット
- 3D・アニメーション
- 背景パターン
- ヒーローセクションの画像

**トップページは画像なしが正解。**

---

# ナビゲーション

## 現状の構成

```
ソリューション / 実績・事例 / 会社概要 / ブログ / 無料相談
```

## 推奨変更

```
会社概要 / 実績 / ブログ / 相談する
```

- 「ソリューション」削除（判断会社に不要）
- 「無料相談」→「相談する」（無料を消す）

---

# 禁止パターン（コード例）

## NG: グラデーションボタン

```jsx
// ダメ
className="bg-gradient-to-r from-cyan-500 to-blue-600"
```

## NG: 派手な影

```jsx
// ダメ
className="shadow-xl shadow-cyan-500/50"
```

## NG: アニメーション

```jsx
// ダメ
className="animate-pulse"
className="animate-bounce"
```

## NG: 過剰な装飾

```jsx
// ダメ
className="border-2 border-cyan-500 rounded-2xl shadow-lg"
```

---

# OKパターン（コード例）

## OK: シンプルなセクション

```jsx
<section className="py-24 md:py-32 px-4">
  <div className="max-w-3xl mx-auto text-center">
    <h2 className="text-2xl md:text-4xl font-bold text-[#0F172A] mb-8">
      見出し
    </h2>
    <p className="text-lg text-gray-600">
      本文テキスト
    </p>
  </div>
</section>
```

## OK: 背景色切り替え

```jsx
// 白背景
<section className="py-24 md:py-32 px-4">

// グレー背景
<section className="py-24 md:py-32 px-4 bg-[#F8FAFC]">

// ダーク背景（CTAセクションのみ）
<section className="py-24 md:py-32 px-4 bg-[#0F172A]">
```

---

# 変更時チェックリスト

デザイン変更前に確認：

- [ ] 色はパレット内か
- [ ] フォントは変更していないか
- [ ] 余白は減っていないか
- [ ] 影・グラデーション・アニメーションを追加していないか
- [ ] 画像・イラストを追加していないか
- [ ] CTAが派手になっていないか
- [ ] 情報量が増えていないか

**1つでもNGなら、その変更はしない。**

---

# 例外を許可する場合

以下の場合のみ、ルール外の変更を検討可：

1. A/Bテストで明確に効果が出た場合
2. ユーザーからの具体的なフィードバックがあった場合
3. 問い合わせ数が明らかに減少した場合

**「なんとなくダサいから」は変更理由にならない。**

---

# 更新履歴

| 日付 | 内容 |
|------|------|
| 2026-01-08 | 初版作成 |
| 2026-01-08 | 具体的なコード例・数値を追加 |

---

作成者: DP-GUILD
