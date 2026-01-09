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
      <section className="min-h-[85vh] md:min-h-[90vh] flex items-center pt-20 pb-12 md:pb-16 px-5 md:px-8">
        <div className="max-w-6xl mx-auto w-full">
          <div className="max-w-3xl">
            <p className="text-xs md:text-sm text-gray-400 mb-4 md:mb-6 tracking-widest uppercase">
              Decision Support for SMBs
            </p>
            <h1 className="text-[28px] leading-[1.3] sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#0F172A] md:leading-[1.2] mb-6 md:mb-8">
              「何から手をつければ<br />いいかわからない」
            </h1>
            <p className="text-lg md:text-2xl text-[#0F172A] mb-8 md:mb-10">
              そんな中小企業のための会社です。
            </p>
            <div className="space-y-3 md:space-y-4 mb-8 md:mb-12">
              <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                WebもSNSもDXも、選択肢が多すぎて決められない。
                その状態から一緒に整理します。
              </p>
              <p className="text-sm md:text-base text-gray-500">
                施策が決まっていなくても大丈夫です。
                判断に必要な情報を、一緒に整理するところから始めます。
              </p>
            </div>
            <a
              href="https://timerex.net/s/info_f990_429a/709e9191"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 md:px-8 py-4 bg-[#0F172A] text-white rounded-lg font-medium hover:bg-[#1e293b] transition-colors text-sm md:text-base"
            >
              何から手をつけるべきか相談する
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2" />
            </a>
          </div>
        </div>
      </section>

      {/* ============================================
          2. 問題の再定義セクション
          ============================================ */}
      <section className="py-16 md:py-32 px-5 md:px-8 bg-[#F8FAFC]">
        <div className="max-w-6xl mx-auto">
          <div className="md:flex md:items-start md:gap-16">
            <div className="mb-6 md:mb-0 md:w-1/3">
              <p className="text-xs md:text-sm text-gray-400 tracking-widest uppercase mb-3 md:mb-4">The Real Problem</p>
              <div className="w-10 md:w-12 h-1 bg-[#0F172A]"></div>
            </div>
            <div className="md:w-2/3">
              <p className="text-base md:text-xl text-gray-500 mb-4 md:mb-6">
                問題は「施策が分からない」ことではありません。
              </p>
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-[#0F172A] mb-6 md:mb-10 leading-tight">
                「何が正解か」を<br />判断できていないことです。
              </h2>
              <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                情報は溢れている。でも、自社にとって何が正解かは誰も教えてくれない。
                だから「まず何からやるか」が決まらない。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          3. DP-GUILDの立ち位置セクション
          ============================================ */}
      <section className="py-16 md:py-32 px-5 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="md:flex md:items-start md:gap-16">
            <div className="mb-6 md:mb-0 md:w-1/3">
              <p className="text-xs md:text-sm text-gray-400 tracking-widest uppercase mb-3 md:mb-4">What We Do</p>
              <div className="w-10 md:w-12 h-1 bg-[#0F172A]"></div>
            </div>
            <div className="md:w-2/3">
              <p className="text-base md:text-xl text-gray-500 mb-4 md:mb-6">
                作る会社ではありません。
              </p>
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-[#0F172A] mb-6 md:mb-10 leading-tight">
                最初の判断を<br />一緒に決める会社です。
              </h2>
              <p className="text-base md:text-lg text-gray-600 mb-8 md:mb-12 leading-relaxed">
                やるべきか、やらないべきか。<br />
                その判断から一緒に考えます。
              </p>
              <div className="border-l-4 border-[#0F172A] pl-5 md:pl-8 py-3 md:py-4 bg-[#F8FAFC]">
                <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                  「とりあえずホームページを作る」ではなく、
                  「本当に今ホームページが必要か」から始めます。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          4. プロセスセクション
          ============================================ */}
      <section className="py-16 md:py-32 px-5 md:px-8 bg-[#0F172A]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <p className="text-xs md:text-sm text-gray-500 tracking-widest uppercase mb-3 md:mb-4">Process</p>
            <h2 className="text-2xl md:text-4xl font-bold text-white">
              支援の流れ
            </h2>
          </div>

          {/* ステップ - モバイル: 中央寄せ縦並び, デスクトップ: 横5列 */}
          <div className="grid grid-cols-2 gap-6 md:grid-cols-5 md:gap-4 mb-10 md:mb-16">
            {[
              { step: "01", title: "相談", desc: "現状と制約を整理" },
              { step: "02", title: "分析", desc: "優先度と実現性を見極める" },
              { step: "03", title: "判断", desc: "やること／やらないことを決める" },
              { step: "04", title: "実行", desc: "決めたことを形にする" },
              { step: "05", title: "改善", desc: "結果を見て次を判断する" },
            ].map((item, index) => (
              <div key={item.step} className={`text-center ${index === 4 ? "col-span-2 md:col-span-1" : ""}`}>
                <p className="text-3xl md:text-5xl font-bold text-white/20 mb-2 md:mb-4">{item.step}</p>
                <h3 className="text-base md:text-xl font-bold text-white mb-1 md:mb-3">{item.title}</h3>
                <p className="text-xs md:text-sm text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center max-w-md md:max-w-2xl mx-auto space-y-3 md:space-y-4 mb-8 md:mb-12">
            <p className="text-sm md:text-lg text-gray-300">
              施策は「判断」の結果として選ばれます。
            </p>
            <p className="text-sm md:text-lg text-white font-medium leading-relaxed">
              「何を相談すればいいか分からない」でOK。<br className="md:hidden" />そこから始めます。
            </p>
            <p className="text-xs md:text-base text-gray-500 leading-relaxed">
              判断は状況によって変わります。<br className="md:hidden" />決めきりではなく、一緒に整理し続けます。
            </p>
          </div>

          <div className="text-center">
            <a
              href="https://timerex.net/s/info_f990_429a/709e9191"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 md:px-8 py-4 bg-white text-[#0F172A] rounded-lg font-medium hover:bg-gray-100 transition-colors text-sm md:text-base"
            >
              何から手をつけるべきか相談する
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2" />
            </a>
          </div>
        </div>
      </section>

      {/* ============================================
          5. 判断の結果セクション
          ============================================ */}
      <section className="py-16 md:py-32 px-5 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="md:flex md:items-start md:gap-16">
            <div className="mb-6 md:mb-0 md:w-1/3">
              <p className="text-xs md:text-sm text-gray-400 tracking-widest uppercase mb-3 md:mb-4">What Happens</p>
              <div className="w-10 md:w-12 h-1 bg-[#0F172A]"></div>
            </div>
            <div className="md:w-2/3">
              <h2 className="text-xl md:text-3xl lg:text-4xl font-bold text-[#0F172A] mb-6 md:mb-8 leading-tight">
                判断の結果、<br className="md:hidden" />こうなることがあります
              </h2>
              <p className="text-base md:text-lg text-gray-600 mb-6 md:mb-8">
                相談の結果として、以下のような支援に進むことがあります。
              </p>
              <ul className="space-y-3 md:space-y-4 mb-8 md:mb-10">
                <li className="flex items-start">
                  <span className="text-[#0F172A] mr-3 md:mr-4 mt-0.5">•</span>
                  <span className="text-gray-700 leading-relaxed text-sm md:text-base">WebサイトやLPを作り直す判断をする</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#0F172A] mr-3 md:mr-4 mt-0.5">•</span>
                  <span className="text-gray-700 leading-relaxed text-sm md:text-base">SNSは今やらない、という判断をする</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#0F172A] mr-3 md:mr-4 mt-0.5">•</span>
                  <span className="text-gray-700 leading-relaxed text-sm md:text-base">社内で回せる仕組みを整える</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#0F172A] mr-3 md:mr-4 mt-0.5">•</span>
                  <span className="text-gray-700 leading-relaxed text-sm md:text-base">外注せず、自走する選択をする</span>
                </li>
              </ul>
              <p className="text-sm md:text-base text-gray-500 leading-relaxed">
                どれも「売っているサービス」ではなく、<br className="hidden md:block" />
                状況を整理した結果として選ばれる手段です。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          6. 向いている人 / 向いていない人セクション
          ============================================ */}
      <section className="py-16 md:py-32 px-5 md:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <p className="text-xs md:text-sm text-gray-400 tracking-widest uppercase mb-3 md:mb-4">Fit Check</p>
            <h2 className="text-xl md:text-4xl font-bold text-[#0F172A]">
              向いている方 / 向いていない方
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4 md:gap-8">
            {/* 向いている方 */}
            <div className="bg-[#F8FAFC] rounded-xl md:rounded-2xl p-6 md:p-10">
              <h3 className="text-lg md:text-xl font-bold text-[#0F172A] mb-5 md:mb-8 flex items-center">
                <span className="w-8 h-8 md:w-10 md:h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center mr-3 md:mr-4 text-base md:text-lg">○</span>
                向いている方
              </h3>
              <ul className="space-y-4 md:space-y-5">
                <li className="flex items-start">
                  <span className="text-green-500 mr-3 md:mr-4 mt-0.5 text-base md:text-lg">•</span>
                  <span className="text-gray-700 leading-relaxed text-sm md:text-base">WebやSNSに課題は感じているが、何から始めるべきか分からない</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3 md:mr-4 mt-0.5 text-base md:text-lg">•</span>
                  <span className="text-gray-700 leading-relaxed text-sm md:text-base">施策の前に、考え方や優先順位を整理したい</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-3 md:mr-4 mt-0.5 text-base md:text-lg">•</span>
                  <span className="text-gray-700 leading-relaxed text-sm md:text-base">単発ではなく、継続的に相談できる関係がほしい</span>
                </li>
              </ul>
            </div>

            {/* 向いていない方 */}
            <div className="bg-gray-50 rounded-xl md:rounded-2xl p-6 md:p-10">
              <h3 className="text-lg md:text-xl font-bold text-[#0F172A] mb-5 md:mb-8 flex items-center">
                <span className="w-8 h-8 md:w-10 md:h-10 bg-gray-200 text-gray-400 rounded-full flex items-center justify-center mr-3 md:mr-4 text-base md:text-lg">×</span>
                向いていない方
              </h3>
              <ul className="space-y-4 md:space-y-5">
                <li className="flex items-start">
                  <span className="text-gray-400 mr-3 md:mr-4 mt-0.5 text-base md:text-lg">•</span>
                  <span className="text-gray-500 leading-relaxed text-sm md:text-base">とにかく安く・早く作りたい</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-400 mr-3 md:mr-4 mt-0.5 text-base md:text-lg">•</span>
                  <span className="text-gray-500 leading-relaxed text-sm md:text-base">判断は自分でするから、言われた通りに作業してほしい</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 md:mt-12 text-center">
            <p className="text-base md:text-lg text-gray-600 leading-relaxed">
              私たちは「作る」ことより「決める」ことに時間をかけます。
              その進め方が合う方に選んでいただいています。
            </p>
          </div>
        </div>
      </section>

      {/* ============================================
          7. 実績セクション
          ============================================ */}
      <section className="py-16 md:py-32 px-5 md:px-8 bg-[#F8FAFC]">
        <div className="max-w-6xl mx-auto">
          <div className="md:flex md:items-start md:gap-16">
            <div className="mb-6 md:mb-0 md:w-1/3">
              <p className="text-xs md:text-sm text-gray-400 tracking-widest uppercase mb-3 md:mb-4">Track Record</p>
              <div className="w-10 md:w-12 h-1 bg-[#0F172A]"></div>
            </div>
            <div className="md:w-2/3">
              <div className="mb-6 md:mb-8">
                <p className="text-2xl md:text-3xl font-bold text-[#0F172A] leading-relaxed">
                  継続的な支援が前提
                </p>
              </div>
              <div className="space-y-3 md:space-y-4">
                <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                  Webサイト保守、SNS運用代行などの継続支援が中心です。
                  単発ではなく、判断と改善を繰り返す関係が多いのが特徴です。
                </p>
                <p className="text-base md:text-lg text-[#0F172A] font-medium">
                  だから、長く続いています。
                </p>
              </div>
              <div className="mt-6 md:mt-8">
                <Link
                  href="/results"
                  className="inline-flex items-center text-[#0F172A] font-medium hover:underline text-sm md:text-base"
                >
                  詳しい実績を見る
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          8. CTAセクション
          ============================================ */}
      <section className="py-16 md:py-32 px-5 md:px-8 bg-[#0F172A]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6 leading-tight">
            「何から相談すればいいか<br className="md:hidden" />分からない」
          </h2>
          <p className="text-lg md:text-2xl text-white/90 mb-6 md:mb-10">
            それで大丈夫です。
          </p>
          <p className="text-base md:text-lg text-white/60 mb-8 md:mb-12 leading-relaxed max-w-2xl mx-auto">
            相談の時点で施策が決まっている必要はありません。<br />
            現状を聞かせていただき、一緒に整理するところから始めます。
          </p>
          <a
            href="https://timerex.net/s/info_f990_429a/709e9191"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 md:px-10 py-4 md:py-5 bg-white text-[#0F172A] rounded-lg font-bold text-base md:text-lg hover:bg-gray-100 transition-colors"
          >
            まず状況を整理する相談をする
            <ArrowRight className="w-5 h-5 md:w-6 md:h-6 ml-2" />
          </a>
          <p className="text-white/50 text-sm mt-6">
            ※ 相談後に「今は何もしない」という結論になることもあります
          </p>
        </div>
      </section>

      {/* ============================================
          裏取り導線セクション
          ============================================ */}
      <section className="py-12 md:py-16 px-5 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
            <Link href="/about" className="group border border-gray-200 rounded-xl p-5 md:p-8 hover:border-[#0F172A] transition-colors">
              <h3 className="text-base md:text-lg font-bold text-[#0F172A] mb-1 md:mb-2 group-hover:underline">会社概要</h3>
              <p className="text-xs md:text-sm text-gray-500">どんな会社か詳しく見る</p>
            </Link>
            <Link href="/results" className="group border border-gray-200 rounded-xl p-5 md:p-8 hover:border-[#0F172A] transition-colors">
              <h3 className="text-base md:text-lg font-bold text-[#0F172A] mb-1 md:mb-2 group-hover:underline">実績・事例</h3>
              <p className="text-xs md:text-sm text-gray-500">これまでの支援内容を見る</p>
            </Link>
            <Link href="/blog" className="group border border-gray-200 rounded-xl p-5 md:p-8 hover:border-[#0F172A] transition-colors">
              <h3 className="text-base md:text-lg font-bold text-[#0F172A] mb-1 md:mb-2 group-hover:underline">ブログ</h3>
              <p className="text-xs md:text-sm text-gray-500">判断の考え方を読む</p>
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================
          フッター
          ============================================ */}
      <footer className="bg-[#0F172A] py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-8 md:mb-12">
            <div>
              <div className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">DP-GUILD</div>
              <p className="text-sm md:text-base text-gray-400 leading-relaxed">
                中小企業の「何から手をつけるか」を
                一緒に決める会社
              </p>
            </div>

            <div>
              <h3 className="text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider mb-3 md:mb-4">Site</h3>
              <ul className="space-y-2 md:space-y-3">
                <li><Link href="/about" className="text-sm md:text-base text-gray-300 hover:text-white transition-colors">会社概要</Link></li>
                <li><Link href="/results" className="text-sm md:text-base text-gray-300 hover:text-white transition-colors">実績・事例</Link></li>
                <li><Link href="/blog" className="text-sm md:text-base text-gray-300 hover:text-white transition-colors">ブログ</Link></li>
                <li><Link href="/contact" className="text-sm md:text-base text-gray-300 hover:text-white transition-colors">お問い合わせ</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider mb-3 md:mb-4">Company</h3>
              <ul className="space-y-2 md:space-y-3">
                <li className="text-sm md:text-base text-gray-300">株式会社DP-GUILD</li>
                <li className="text-gray-400 text-xs md:text-sm">
                  〒520-3333<br />
                  滋賀県甲賀市甲南町希望ケ丘3丁目12-9
                </li>
                <li>
                  <a href="mailto:info@dp-guild.com" className="text-gray-300 hover:text-white transition-colors text-xs md:text-sm">
                    info@dp-guild.com
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6 md:pt-8">
            <p className="text-center text-gray-500 text-xs md:text-sm">
              &copy; 2025 DP-GUILD. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
