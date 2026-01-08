import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Header from "@/components/Header";

// ============================================
// 判断LP - 新トップページ
// 設計書: /Users/yutaishii/Desktop/TOPPAGE_REDESIGN_SPEC.md
// ============================================

export default function JudgmentLP() {
  return (
    <div className="font-sans text-gray-900 bg-white">
      <Header />

      {/* ============================================
          1. ヒーローセクション（共感）
          ============================================ */}
      <section className="min-h-screen flex items-center justify-center pt-20 pb-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-[#0F172A] leading-tight mb-8">
            「何から手をつければいいかわからない」
          </h1>
          <p className="text-xl md:text-2xl text-[#0F172A] mb-8">
            そんな中小企業のための会社です。
          </p>
          <p className="text-lg text-gray-600 mb-6 leading-relaxed">
            WebもSNSもDXも、選択肢が多すぎて決められない。<br />
            その状態から一緒に整理します。
          </p>
          <p className="text-base text-gray-500 mb-12">
            施策が決まっていなくても大丈夫です。<br />
            状況を整理するところから始めます。
          </p>
          <a
            href="https://timerex.net/s/info_f990_429a/709e9191"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-8 py-4 bg-[#0F172A] text-white rounded-lg font-medium hover:bg-[#1e293b] transition-colors"
          >
            何から手をつけるべきか相談する
            <ArrowRight className="w-5 h-5 ml-2" />
          </a>
        </div>
      </section>

      {/* ============================================
          2. 問題の再定義セクション
          ============================================ */}
      <section className="py-24 md:py-32 px-4 bg-[#F8FAFC]">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-lg md:text-xl text-gray-600 mb-6">
            問題は「施策が分からない」ことではありません。
          </p>
          <h2 className="text-2xl md:text-4xl font-bold text-[#0F172A] mb-8">
            「何が正解か」を判断できていないことです。
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            情報は溢れている。でも、自社にとって何が正解かは誰も教えてくれない。<br />
            だから「まず何からやるか」が決まらない。
          </p>
        </div>
      </section>

      {/* ============================================
          3. DP-GUILDの立ち位置セクション
          ============================================ */}
      <section className="py-24 md:py-32 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-lg md:text-xl text-gray-600 mb-4">
            作る会社ではありません。
          </p>
          <h2 className="text-2xl md:text-4xl font-bold text-[#0F172A] mb-8">
            最初の判断を一緒に決める会社です。
          </h2>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            やるべきか、やらないべきか。<br />
            まずそこから一緒に考えます。
          </p>
          <div className="bg-[#F8FAFC] rounded-xl p-8 text-left max-w-xl mx-auto">
            <p className="text-gray-700 leading-relaxed">
              「とりあえずホームページを作る」ではなく、<br />
              「本当に今ホームページが必要か」から始めます。
            </p>
          </div>
        </div>
      </section>

      {/* ============================================
          4. プロセスセクション
          ============================================ */}
      <section className="py-24 md:py-32 px-4 bg-[#F8FAFC]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-[#0F172A] text-center mb-16">
            支援の流れ
          </h2>

          <div className="space-y-8">
            {[
              { step: "1", title: "相談", desc: "現状と制約を整理" },
              { step: "2", title: "分析", desc: "優先度と実現性を見極める" },
              { step: "3", title: "判断", desc: "やること／やらないことを決める" },
              { step: "4", title: "実行", desc: "決めたことを形にする" },
              { step: "5", title: "改善", desc: "結果を見て次を判断する" },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-[#0F172A] text-white rounded-full flex items-center justify-center font-bold text-lg">
                  {item.step}
                </div>
                <div className="pt-2">
                  <h3 className="text-xl font-bold text-[#0F172A] mb-1">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-lg text-gray-600 mb-2">
              施策は「判断」の結果として選ばれます。
            </p>
            <p className="text-lg text-[#0F172A] font-medium">
              「何を相談すればいいか分からない」でOK。そこから始めます。
            </p>
          </div>

          <div className="mt-12 text-center">
            <a
              href="https://timerex.net/s/info_f990_429a/709e9191"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-4 bg-[#0F172A] text-white rounded-lg font-medium hover:bg-[#1e293b] transition-colors"
            >
              何から手をつけるべきか相談する
              <ArrowRight className="w-5 h-5 ml-2" />
            </a>
          </div>
        </div>
      </section>

      {/* ============================================
          5. 向いている人 / 向いていない人セクション
          ============================================ */}
      <section className="py-24 md:py-32 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-[#0F172A] text-center mb-16">
            向いている方 / 向いていない方
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* 向いている方 */}
            <div className="bg-[#F8FAFC] rounded-xl p-8">
              <h3 className="text-xl font-bold text-[#0F172A] mb-6 flex items-center">
                <span className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-3 text-lg">○</span>
                向いている方
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-green-500 mr-3 mt-1">•</span>
                  <span className="text-gray-700">WebやSNSに課題は感じているが、何から始めるべきか分からない</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3 mt-1">•</span>
                  <span className="text-gray-700">施策の前に、考え方や優先順位を整理したい</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3 mt-1">•</span>
                  <span className="text-gray-700">単発ではなく、継続的に相談できる関係がほしい</span>
                </li>
              </ul>
            </div>

            {/* 向いていない方 */}
            <div className="bg-gray-50 rounded-xl p-8">
              <h3 className="text-xl font-bold text-[#0F172A] mb-6 flex items-center">
                <span className="w-8 h-8 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center mr-3 text-lg">×</span>
                向いていない方
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="text-gray-400 mr-3 mt-1">•</span>
                  <span className="text-gray-600">とにかく安く・早く作りたい</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-400 mr-3 mt-1">•</span>
                  <span className="text-gray-600">判断は自分でするから、言われた通りに作業してほしい</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-lg text-gray-600">
              私たちは「作る」ことより「決める」ことに時間をかけます。<br />
              その進め方が合う方に選んでいただいています。
            </p>
          </div>
        </div>
      </section>

      {/* ============================================
          6. CTAセクション
          ============================================ */}
      <section className="py-24 md:py-32 px-4 bg-[#0F172A]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-6">
            「何から相談すればいいか分からない」
          </h2>
          <p className="text-xl text-white/90 mb-8">
            それで大丈夫です。
          </p>
          <p className="text-lg text-white/70 mb-12 leading-relaxed">
            相談の時点で施策が決まっている必要はありません。<br />
            現状を聞かせていただき、一緒に整理するところから始めます。
          </p>
          <a
            href="https://timerex.net/s/info_f990_429a/709e9191"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-10 py-5 bg-white text-[#0F172A] rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors"
          >
            何から手をつけるべきか相談する
            <ArrowRight className="w-6 h-6 ml-2" />
          </a>
        </div>
      </section>

      {/* ============================================
          7. 実績セクション（補足・裏取り）
          ============================================ */}
      <section className="py-24 md:py-32 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mb-12">
            <p className="text-lg text-gray-600 mb-2">継続契約の解約</p>
            <p className="text-5xl md:text-6xl font-bold text-[#0F172A]">0<span className="text-2xl md:text-3xl ml-1">件</span></p>
          </div>

          <p className="text-lg text-gray-600 mb-4 leading-relaxed">
            Webサイト保守、SNS運用代行など、継続型の契約において<br />
            これまで解約はありません。
          </p>
          <p className="text-lg text-[#0F172A] font-medium mb-12 leading-relaxed">
            判断と改善を繰り返す関係だから、続いています。
          </p>

          <Link
            href="/results"
            className="inline-flex items-center text-[#0F172A] font-medium hover:underline"
          >
            詳しい実績を見る
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>

      {/* ============================================
          裏取り導線セクション
          ============================================ */}
      <section className="py-16 px-4 bg-[#F8FAFC]">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <Link href="/about" className="bg-white rounded-xl p-6 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-bold text-[#0F172A] mb-2">会社概要</h3>
              <p className="text-sm text-gray-600">どんな会社か詳しく見る</p>
            </Link>
            <Link href="/results" className="bg-white rounded-xl p-6 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-bold text-[#0F172A] mb-2">実績・事例</h3>
              <p className="text-sm text-gray-600">これまでの支援内容を見る</p>
            </Link>
            <Link href="/blog" className="bg-white rounded-xl p-6 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-bold text-[#0F172A] mb-2">ブログ</h3>
              <p className="text-sm text-gray-600">判断の考え方を読む</p>
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================
          フッター
          ============================================ */}
      <footer className="bg-[#0F172A] py-12 border-t border-gray-800">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div>
              <div className="text-2xl font-bold text-white mb-4">DP-GUILD</div>
              <p className="text-gray-400 mb-6">
                中小企業の「何から手をつけるか」を<br />
                一緒に決める会社
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">サイトマップ</h3>
              <ul className="space-y-3">
                <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">会社概要</Link></li>
                <li><Link href="/results" className="text-gray-400 hover:text-white transition-colors">実績・事例</Link></li>
                <li><Link href="/blog" className="text-gray-400 hover:text-white transition-colors">ブログ</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">お問い合わせ</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">会社情報</h3>
              <ul className="space-y-3">
                <li className="text-gray-400">
                  <div className="font-medium text-white">株式会社DP-GUILD</div>
                </li>
                <li className="text-gray-400">
                  <div className="text-sm">〒520-3333</div>
                  <div className="text-sm">滋賀県甲賀市甲南町希望ケ丘3丁目12-9</div>
                </li>
                <li className="text-gray-400">
                  <a href="mailto:info@dp-guild.com" className="text-sm hover:text-white transition-colors">info@dp-guild.com</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <div className="text-center text-gray-500">
              &copy; 2025 DP-GUILD. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
