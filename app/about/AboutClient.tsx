'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Building2, MapPin, User, Mail, ArrowRight, CheckCircle, TrendingUp, Users, Calendar } from 'lucide-react';
import Header from '@/components/Header';

export default function AboutClient() {
  const companyInfo = [
    { label: "会社名", value: "株式会社DP-GUILD", icon: Building2 },
    { label: "法人番号", value: "5160001021495", icon: Building2 },
    { label: "所在地", value: "〒520-3333 滋賀県甲賀市甲南町希望ケ丘3丁目12-9", icon: MapPin },
    { label: "設立", value: "2019年2月19日", icon: Calendar },
    { label: "代表者", value: "代表取締役 石井 勇多", icon: User },
    { label: "従業員数", value: "10名（業務委託含む）", icon: Users },
  ];

  return (
    <div className="font-sans text-gray-900 bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#334155] pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-5"></div>
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <motion.div
            className="max-w-4xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              「何から手をつけるか」を<br className="hidden md:block" />一緒に決める
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              施策を売る会社ではありません。<br />
              判断を支援し、その結果として最適な施策を一緒に実行します。
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="https://timerex.net/s/info_f990_429a/709e9191"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-4 bg-white text-[#0F172A] rounded-md font-medium hover:bg-gray-100 transition-all"
              >
                相談する
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Story - 3行で十分 */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 md:px-8 max-w-3xl">
          <div className="text-center">
            <p className="text-base md:text-lg text-gray-600 leading-relaxed">
              2019年、滋賀県甲賀市で創業。<br />
              地域の中小企業に向き合う中で「施策より判断」の重要性に気づき、<br />
              「何から手をつけるか」を一緒に決める会社として活動しています。
            </p>
          </div>
        </div>
      </section>

      {/* Mission/Vision */}
      <section className="py-20 bg-[#F8FAFC]">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-4">
              ミッション・ビジョン
            </h2>
            <p className="text-xl text-gray-600">
              私たちが大切にする価値観と目指す未来
            </p>
          </motion.div>

          <div className="space-y-20">
            {/* Mission */}
            <motion.div
              className="max-w-3xl mx-auto text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="text-[#0F172A] font-semibold text-sm mb-2">MISSION</div>
              <h3 className="text-2xl md:text-3xl font-bold text-[#0F172A] mb-6">
                判断を支援し、<br className="md:hidden" />成果に近づける
              </h3>
              <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-8">
                施策ありきではなく、<br className="md:hidden" />「今、何をやるべきか」の判断から伴走する。<br className="hidden md:block" />
                判断の精度を上げることで、<br className="md:hidden" />無駄な投資を減らし、成果に近づける。
              </p>
              <div className="inline-flex items-center justify-center space-x-3 text-gray-600">
                <CheckCircle className="w-5 h-5" />
                <span>施策は判断の結果として選ばれる</span>
              </div>
            </motion.div>

            {/* Vision */}
            <motion.div
              className="max-w-3xl mx-auto text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="text-[#0F172A] font-semibold text-sm mb-2">VISION</div>
              <h3 className="text-2xl md:text-3xl font-bold text-[#0F172A] mb-6 leading-tight">
                「何から手をつけるか」を<br />一緒に決める
              </h3>
              <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-8">
                施策は無数にある。<br />
                でも、今やるべきことは限られている。<br />
                「作る」前に「決める」を大切にします。
              </p>
              <div className="inline-flex items-center justify-center space-x-3 text-gray-600">
                <TrendingUp className="w-5 h-5" />
                <span>判断の質が、成果の質を決める</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 判断の結果 - ケース形式 */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-4xl font-bold text-[#0F172A] mb-4 leading-tight">
              判断の結果、<br className="md:hidden" />こうなることがあります
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              「作る会社」ではなく<br className="md:hidden" />「決める会社」です。
            </p>
          </motion.div>

          <div className="space-y-8">
            {/* Case 1 */}
            <motion.div
              className="border-l-4 border-[#0F172A] pl-6 py-2"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-sm text-gray-500 mb-2">ケース①</p>
              <h3 className="text-lg font-bold text-[#0F172A] mb-2">
                SNSを「やる」と判断した場合
              </h3>
              <p className="text-gray-600">
                → 広告や運用代行ではなく、投稿設計と社内で回せる体制づくりから始めます
              </p>
            </motion.div>

            {/* Case 2 */}
            <motion.div
              className="border-l-4 border-[#0F172A] pl-6 py-2"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <p className="text-sm text-gray-500 mb-2">ケース②</p>
              <h3 className="text-lg font-bold text-[#0F172A] mb-2">
                Webサイトを「今は作らない」と判断した場合
              </h3>
              <p className="text-gray-600">
                → 既存資産を活かし、別の選択肢を検討します。作らないことも立派な判断です
              </p>
            </motion.div>

            {/* Case 3 */}
            <motion.div
              className="border-l-4 border-[#0F172A] pl-6 py-2"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-sm text-gray-500 mb-2">ケース③</p>
              <h3 className="text-lg font-bold text-[#0F172A] mb-2">
                システム化が必要だと判断した場合
              </h3>
              <p className="text-gray-600">
                → 要件定義だけを行い、開発は別会社に任せる選択をすることもあります
              </p>
            </motion.div>

            {/* Case 4 */}
            <motion.div
              className="border-l-4 border-[#0F172A] pl-6 py-2"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-sm text-gray-500 mb-2">ケース④</p>
              <h3 className="text-lg font-bold text-[#0F172A] mb-2">
                外注せず自走すると判断した場合
              </h3>
              <p className="text-gray-600">
                → 必要なスキルや仕組みを整え、社内で完結できる状態を一緒に作ります
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Company Information */}
      <section className="py-20 bg-[#F8FAFC]">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-4">
              会社情報
            </h2>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {companyInfo.map((item, index) => (
                <motion.div
                  key={index}
                  className="flex items-center p-6 md:p-8 border-b border-gray-100 last:border-b-0"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <div className="w-12 h-12 bg-[#0F172A] rounded-xl flex items-center justify-center mr-6">
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <dt className="text-sm font-medium text-gray-500 mb-1">{item.label}</dt>
                    <dd className="text-lg text-[#0F172A] font-medium">{item.value}</dd>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Representative Message */}
      <section className="py-20 bg-gradient-to-br from-[#0F172A] to-[#1E293B]">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
                代表メッセージ
              </h2>

              <div className="bg-white/5 backdrop-blur rounded-3xl p-8 md:p-12 border border-white/10">
                <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
                  <div className="w-32 h-32 rounded-full overflow-hidden">
                    <img
                      src="/images/team/ceo-photo.jpg"
                      alt="代表取締役 石井 勇多"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-center md:text-left">
                    <h3 className="text-3xl font-bold text-white mb-2">石井 勇多</h3>
                    <p className="text-gray-400 font-medium">代表取締役</p>
                  </div>
                </div>

                <blockquote className="relative">
                  <div className="absolute -top-4 -left-2 text-6xl text-[#0F172A]/20 font-serif">&ldquo;</div>
                  <p className="text-lg md:text-xl text-gray-300 leading-relaxed italic mb-6">
                    私たちDP-GUILDは、「何から手をつけるか」を一緒に決める会社です
                  </p>
                  <p className="text-lg md:text-xl text-gray-300 leading-relaxed italic mb-6">
                    施策を売るのではなく、判断を支援する。
                    その判断の結果として、最適な施策を一緒に実行します
                  </p>
                  <p className="text-lg md:text-xl text-gray-300 leading-relaxed italic">
                    滋賀という地域から始まった私たちの挑戦を、全国のお客様に届け、
                    共に成長していく。それが私たちの使命です
                  </p>
                  <div className="absolute -bottom-8 right-0 text-6xl text-[#0F172A]/20 font-serif rotate-180">&rdquo;</div>
                </blockquote>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section id="contact" className="py-20 bg-[#0F172A]">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              まずは状況を整理するところから
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-12">
              施策が決まっていなくても大丈夫です。<br />
              まず30分、一緒に整理します。
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://timerex.net/s/info_f990_429a/709e9191"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-[#0F172A] rounded-md font-medium hover:bg-gray-100 transition-all"
              >
                <Calendar className="w-5 h-5 mr-2" />
                相談を予約する
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-white/10 text-white border border-white/30 rounded-md font-medium hover:bg-white/20 transition-all"
              >
                <Mail className="w-5 h-5 mr-2" />
                フォームで問い合わせ
              </Link>
            </div>

            <p className="text-white/60 text-sm mt-8">
              ※ 課題が明確でなくても大丈夫です。一緒に整理するところから始めましょう。
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
