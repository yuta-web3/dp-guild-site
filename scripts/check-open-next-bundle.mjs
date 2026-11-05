// 本番に出す組み立ての検査。OpenNext は組み立てた場所の .env* を Worker に埋め込み、
// NEXT_PUBLIC_* も画面のコードに入れるため、手元の値（localhost の設定・テスト用の鍵）が入った物を出さない。値は表示しない
// node scripts/check-open-next-bundle.mjs before … 組み立ての前に .env* が無いことを見る
// node scripts/check-open-next-bundle.mjs after  … 組み立てた物に .env の値が埋め込まれていないことを見る
import { existsSync, readFileSync, readdirSync } from 'node:fs'

const stage = process.argv[2]
const problems = []
if (stage === 'before') {
  const envFiles = readdirSync('.').filter((f) => /^\.env/.test(f) && f !== '.env.example')
  if (envFiles.length) problems.push(`手元の設定ファイルがある: ${envFiles.join(', ')}`)
} else if (stage === 'after') {
  const path = '.open-next/cloudflare/next-env.mjs'
  if (!existsSync(path)) problems.push(`${path} が無い（組み立てが終わっていない）`)
  else {
    const names = [...new Set([...readFileSync(path, 'utf8').matchAll(/"([A-Z0-9_]+)":/g)].map((m) => m[1]))]
    if (names.length) problems.push(`.env の値が埋め込まれている: ${names.join(', ')}`)
  }
} else {
  problems.push('before か after を指定する')
}

if (problems.length) {
  console.error('本番に出せない組み立てです。.env* の無い場所で組み立ててください。\n' + problems.map((p) => '- ' + p).join('\n'))
  process.exit(1)
}
console.log(`組み立ての検査（${stage}）: 問題なし`)
