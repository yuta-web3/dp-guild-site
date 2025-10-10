'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Building2, MapPin, User, Mail, ArrowRight, CheckCircle, TrendingUp, Users, Code, Lightbulb, Calendar, ChevronRight } from 'lucide-react';

export default function AboutPage() {
  const [activeStep, setActiveStep] = useState(0);

  const companyInfo = [
    { label: "会社名", value: "株式会社DP-GUILD", icon: Building2 },
    { label: "法人番号", value: "5160001021495", icon: Building2 },
    { label: "所在地", value: "〒520-3333 滋賀県甲賀市甲南町希望ケ丘3丁目12-9", icon: MapPin },
    { label: "設立", value: "2019年2月19日", icon: Calendar },
    { label: "代表者", value: "代表取締役 石井 勇多", icon: User },
    { label: "従業員数", value: "10名（業務委託含む）", icon: Users },
  ];

  const businessContent = [
    {
      title: "デジタルマーケティング",
      description: "SNS戦略・運用、コンテンツ制作、オンライン広告、データ分析",
      icon: TrendingUp,
      color: "from-cyan-500 to-blue-600",
      metrics: "SNS動画1500万再生達成"
    },
    {
      title: "Web制作・開発",
      description: "LP／EC／採用／コーポレート／オウンドメディア、WordPress・CMS構築",
      icon: Code,
      color: "from-cyan-500 to-blue-600",
      metrics: "300件以上の制作実績"
    },
    {
      title: "システム・アプリ開発",
      description: "要件定義〜開発・運用保守、AI活用、クラウド基盤構築",
      icon: Building2,
      color: "from-cyan-500 to-blue-600",
      metrics: "官公庁級セキュリティ対応"
    },
    {
      title: "ITコンサルティング",
      description: "プロジェクトマネジメント、DX推進支援、業務効率化",
      icon: Lightbulb,
      color: "from-cyan-500 to-blue-600",
      metrics: "顧客継続率94%"
    }
  ];

  const workProcess = [
    {
      phase: "01. 要件定義",
      title: "課題の言語化",
      description: "お客様の本質的な課題を見極め、最適なソリューションを設計",
      items: ["ヒアリング", "課題分析", "要件整理", "提案書作成"]
    },
    {
      phase: "02. 設計・企画",
      title: "戦略立案",
      description: "データと創造性を組み合わせた実現可能な戦略を構築",
      items: ["戦略設計", "KPI設定", "スケジュール策定", "体制構築"]
    },
    {
      phase: "03. 実装・開発",
      title: "確実な実行",
      description: "速く、破綻なく、品質の高い実装で価値を形に",
      items: ["開発・制作", "品質管理", "進捗報告", "調整・改善"]
    },
    {
      phase: "04. 成長・運用",
      title: "継続的改善",
      description: "データに基づいた改善サイクルで成果を最大化",
      items: ["効果測定", "改善提案", "運用支援", "成長戦略"]
    }
  ];

  const achievements = [
    { value: 1500, suffix: "万+", label: "SNS動画再生回数", description: "バイラルコンテンツ制作実績" },
    { value: 300, suffix: "件+", label: "プロジェクト実績", description: "幅広い業界での豊富な経験" },
    { value: 94, suffix: "%", label: "顧客継続率", description: "信頼される長期パートナーシップ" },
    { value: 10, suffix: "年+", label: "業界経験", description: "確かな技術と知見の蓄積" }
  ];

  const [selectedIndustry, setSelectedIndustry] = useState("すべて");

  // 実績がある主要対応業界
  const industriesData = [
    {
      id: "manufacturing",
      title: "製造業",
      hasResults: true,
      description: "ECサイト構築から業務効率化、ITコンサルティングまで幅広く対応",
      examples: [
        "忍者服工房のフルスクラッチECサイト制作",
        "醸造業者の在庫管理システム導入",
        "大手食品メーカーのベンダー選定支援"
      ],
      achievements: [
        "訪問者数・売上の順調な増加",
        "業務効率の大幅向上",
        "最適なシステム導入成功"
      ],
      tags: ["EC構築", "在庫管理", "ITコンサル", "業務効率化"],
      icon: Building2
    },
    {
      id: "service",
      title: "サービス業",
      hasResults: true,
      description: "コーポレートサイトからLP、マーケティング戦略まで総合支援",
      examples: [
        "新規開業ストレッチスタジオのサイト構築",
        "ビジネスサービス企業のLP制作",
        "自動車塗装業者のHP構築・マーケティング"
      ],
      achievements: [
        "集客力の大幅向上とリピーター獲得",
        "見積もり依頼件数の増加",
        "Web問い合わせ・来店数の大幅増加"
      ],
      tags: ["HP構築", "LP制作", "マーケティング戦略", "SEO対策"],
      icon: Users
    },
    {
      id: "healthcare",
      title: "医療・ヘルスケア",
      hasResults: true,
      description: "専門性を活かしたマーケティング調査とLP構築で患者獲得を支援",
      examples: [
        "脳疾患特化型リハビリ施設のマーケティング調査",
        "専門クリニックのLP構築とSEO対策"
      ],
      achievements: [
        "Web問い合わせ件数の大幅増加",
        "コンバージョン率の着実な向上",
        "患者様の利用増加"
      ],
      tags: ["マーケティング調査", "LP構築", "SEO対策", "信頼設計"],
      icon: Users
    },
    {
      id: "retail",
      title: "小売業",
      hasResults: true,
      description: "ECサイト制作とブランディングでオンライン販売を強化",
      examples: [
        "工房ECサイトの企画・設計・制作",
        "商品写真撮影とSEO対策"
      ],
      achievements: [
        "ブランド認知度の大幅向上",
        "ECサイト経由での売上増加",
        "新規顧客の獲得成功"
      ],
      tags: ["EC企画設計", "写真撮影", "SEO対策", "ブランディング"],
      icon: TrendingUp
    },
    {
      id: "education",
      title: "教育",
      hasResults: true,
      description: "SNSマーケティングで認知拡大と受講生獲得を実現",
      examples: [
        "デザインスクールのSNSコンサルティング",
        "Instagram動画企画・広告戦略立案"
      ],
      achievements: [
        "Instagram動画1,600万回再生達成",
        "認知度の爆発的向上",
        "受講生獲得の大幅増加"
      ],
      tags: ["SNSコンサル", "動画企画", "Instagram広告", "認知拡大"],
      icon: Lightbulb
    }
  ];

  // その他対応可能な業界
  const otherIndustries = [
    { title: "金融・保険", icon: TrendingUp },
    { title: "不動産", icon: Building2 },
    { title: "フィットネス", icon: Users },
    { title: "美容・サロン", icon: Users },
    { title: "飲食業", icon: TrendingUp },
    { title: "建設・住宅", icon: Building2 }
  ];

  const filterOptions = ["すべて", "製造業", "サービス業", "医療・ヘルスケア", "小売業", "教育"];

  const filteredIndustries = selectedIndustry === "すべて"
    ? industriesData
    : industriesData.filter(ind => ind.title === selectedIndustry);

  const storyTimeline = [
    { year: "2019", title: "創業", description: "滋賀県甲賀市で創業。地域に根ざしたITサービスを開始" },
    { year: "2020", title: "サービス拡張", description: "デジタルマーケティング領域への本格参入" },
    { year: "2021", title: "全国展開", description: "オンラインを活用した全国対応サービスを確立" },
    { year: "2022", title: "技術革新", description: "AI・自動化技術を活用したソリューション開発" },
    { year: "2024", title: "現在", description: "300件超の実績と共に、次世代のデジタル変革を支援" }
  ];

  // CountUp component
  function CountUpNumber({ value, suffix }: { value: number; suffix: string }) {
    const [count, setCount] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        },
        { threshold: 0.3 }
      );

      if (elementRef.current) {
        observer.observe(elementRef.current);
      }

      return () => {
        if (elementRef.current) {
          observer.unobserve(elementRef.current);
        }
      };
    }, []);

    useEffect(() => {
      if (!isVisible) return;

      const duration = 2000;
      const steps = 60;
      const stepValue = value / steps;
      const stepDuration = duration / steps;
      let currentStep = 0;

      const timer = setInterval(() => {
        currentStep++;
        if (currentStep <= steps) {
          setCount(Math.floor(stepValue * currentStep));
        } else {
          setCount(value);
          clearInterval(timer);
        }
      }, stepDuration);

      return () => clearInterval(timer);
    }, [isVisible, value]);

    return (
      <div ref={elementRef} className="text-4xl md:text-5xl font-bold text-white mb-2">
        {count}{suffix}
      </div>
    );
  }

  return (
    <div className="font-sans text-gray-900 bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm py-5 border-b border-gray-100">
        <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-[#0F172A]">
              DP-GUILD
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/#solutions" className="text-[#7F7F7F] hover:text-[#0F172A] transition-colors">ソリューション</a>
            <Link href="/results" className="text-[#7F7F7F] hover:text-[#0F172A] transition-colors">実績・事例</Link>
            <Link href="/about" className="text-[#7F7F7F] hover:text-[#0F172A] transition-colors">会社概要</Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Link
              href="/contact"
              className="hidden md:flex items-center px-5 py-2 bg-cyan-500 text-white rounded-md font-medium hover:bg-cyan-600 transition-colors"
            >
              無料相談
            </Link>
            <button className="md:hidden text-[#7F7F7F]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section with Visual Impact */}
      <section className="relative min-h-[70vh] flex items-center bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#334155] pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-20">
            <div className="w-full h-full bg-gradient-to-br from-gray-600/5 to-gray-400/5"></div>
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <motion.div
            className="max-w-4xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              頼れるITパートナーとして
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              滋賀から始まる全国展開。確かなデジタル化と業務効率化を実現し、
              お客様のビジネス成長を技術の力で加速します。
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#contact"
                className="inline-flex items-center px-8 py-4 bg-cyan-500 text-white rounded-md font-medium hover:bg-cyan-600 transition-all transform hover:scale-105"
              >
                まずは課題をご相談
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
              <a
                href="#story"
                className="inline-flex items-center px-8 py-4 bg-white/10 backdrop-blur text-white border border-white/30 rounded-md font-medium hover:bg-white/20 transition-all"
              >
                私たちのストーリー
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Impact Numbers - Visual Data */}
      <section className="py-16 bg-gradient-to-r from-cyan-500 to-blue-600">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {achievements.map((item, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <CountUpNumber value={item.value} suffix={item.suffix} />
                <div className="text-white/90 font-medium mb-1">{item.label}</div>
                <div className="text-white/70 text-sm">{item.description}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Timeline */}
      <section id="story" className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-4">
              私たちのストーリー
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              地域に根ざし、全国へ。意思の積み重ねが作る成長の軌跡
            </p>
          </motion.div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-cyan-500 to-blue-600"></div>
            {storyTimeline.map((item, index) => (
              <motion.div
                key={index}
                className={`relative flex items-center mb-12 ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <div className="flex-1"></div>
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold z-10">
                  {item.year.slice(2)}
                </div>
                <div className={`flex-1 ${index % 2 === 0 ? "pl-8 text-left" : "pr-8 text-right"}`}>
                  <div className="bg-[#F8FAFC] p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="text-2xl font-bold text-[#0F172A] mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission/Vision - Z-Layout */}
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
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              私たちが大切にする価値観と目指す未来
            </p>
          </motion.div>

          <div className="space-y-20">
            {/* Mission - Left Text, Right Visual */}
            <motion.div
              className="flex flex-col md:flex-row items-center gap-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex-1">
                <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-transparent bg-clip-text text-sm font-bold mb-2">MISSION</div>
                <h3 className="text-3xl font-bold text-[#0F172A] mb-6">
                  確かな技術で、ビジネスの成長を加速
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  クライアントと伴走し、課題に応じた最適解でデジタル化と業務効率化を実現。
                  単なる技術提供者ではなく、お客様の成功を共に創り上げる「頼れるITパートナー」として、
                  真に価値あるソリューションを提供し続けます。
                </p>
                <div className="flex items-start space-x-4">
                  <CheckCircle className="w-6 h-6 text-cyan-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-[#0F172A] mb-2">お客様と共に</h4>
                    <p className="text-gray-600">課題の本質を見極め、最適な解決策を共創</p>
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <div className="rounded-2xl overflow-hidden shadow-lg">
                  <img
                    src="/images/team/benjamin-child-GWe0dlVD9e0-unsplash.jpg"
                    alt="お客様と共に"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </motion.div>

            {/* Vision - Right Text, Left Visual */}
            <motion.div
              className="flex flex-col md:flex-row-reverse items-center gap-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex-1">
                <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-transparent bg-clip-text text-sm font-bold mb-2">VISION</div>
                <h3 className="text-3xl font-bold text-[#0F172A] mb-6">
                  地域から世界へ、革新的なデジタル体験を
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  滋賀から始まる全国展開。地域密着型のアプローチで培った信頼と実績を基に、
                  質の高いITソリューションを全国、そして世界へと広げていきます。
                  テクノロジーの力で、あらゆるビジネスの可能性を最大化します。
                </p>
                <div className="flex items-start space-x-4">
                  <TrendingUp className="w-6 h-6 text-purple-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-[#0F172A] mb-2">持続的な成長</h4>
                    <p className="text-gray-600">地域に根ざしながら、グローバルな視点で価値創造</p>
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <div className="rounded-2xl overflow-hidden shadow-lg">
                  <img
                    src="/images/team/village-7702981_1920.jpg"
                    alt="地域から世界へ"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services - 4 Grid Visual */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-4">
              サービスの顔
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              4つの領域で、お客様のデジタル変革を包括的にサポート
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {businessContent.map((service, index) => (
              <motion.div
                key={index}
                className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
                <div className="relative p-8">
                  <div className={`w-16 h-16 bg-gradient-to-br ${service.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <service.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#0F172A] mb-3">{service.title}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <div className={`inline-flex items-center text-sm font-medium bg-gradient-to-r ${service.color} text-transparent bg-clip-text`}>
                    {service.metrics}
                    <ArrowRight className="w-4 h-4 ml-1 text-current" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Work Process - Visual Steps */}
      <section className="py-20 bg-[#0F172A]">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              仕事の進め方
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              再現性のある4つのステップで、確実に成果を創出
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6">
            {workProcess.map((step, index) => (
              <motion.div
                key={index}
                className={`relative bg-[#1E293B] rounded-xl p-6 hover:bg-[#1E293B]/80 transition-all cursor-pointer ${
                  activeStep === index ? "ring-2 ring-cyan-500" : ""
                }`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => setActiveStep(index)}
              >
                <div className="text-cyan-400 font-bold mb-2">{step.phase}</div>
                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{step.description}</p>
                <div className="space-y-2">
                  {step.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center text-gray-500 text-sm">
                      <CheckCircle className="w-4 h-4 mr-2 text-cyan-500/50" />
                      {item}
                    </div>
                  ))}
                </div>
                {index < workProcess.length - 1 && (
                  <div className="hidden md:block absolute -right-3 top-1/2 transform -translate-y-1/2 text-cyan-500">
                    <ChevronRight className="w-6 h-6" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Information - Refined */}
      <section className="py-20 bg-white">
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
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              透明性と信頼性を大切にする企業データ
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-xl overflow-hidden">
              {companyInfo.map((item, index) => (
                <motion.div
                  key={index}
                  className="flex items-center p-8 border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50 transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mr-6">
                    <item.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <dt className="text-sm font-medium text-gray-500 mb-1">{item.label}</dt>
                    <dd className="text-xl text-[#0F172A] font-medium">{item.value}</dd>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Industries with Glassmorphism */}
      <section className="py-20 bg-[#0B1220] relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B1220] via-[#0F172A] to-[#1E293B] opacity-80"></div>

        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#E6EBF5] mb-4">
              主要対応業界
            </h2>
            <p className="text-xl text-[#9AA6BF] max-w-3xl mx-auto">
              実績に基づく確かなサポート
            </p>
          </motion.div>

          {/* Filter Pills */}
          <motion.div
            className="flex flex-wrap justify-center gap-3 mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            {filterOptions.map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedIndustry(filter)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedIndustry === filter
                    ? "bg-gradient-to-r from-[#60A5FA] to-[#5EEAD4] text-white shadow-lg shadow-cyan-500/25"
                    : "bg-white/5 backdrop-blur-sm text-[#CBD5E1] hover:bg-white/10 border border-white/10"
                }`}
                aria-pressed={selectedIndustry === filter}
              >
                {filter}
              </button>
            ))}
          </motion.div>

          {/* Industry Cards - 1カラム表示 */}
          <div className="max-w-4xl mx-auto space-y-6">
            {filteredIndustries.map((industry, index) => {
              const Icon = industry.icon;

              return (
                <motion.article
                  key={industry.id}
                  className="group relative"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="block h-full">
                    {/* Glassmorphism Card */}
                    <div className="relative h-full bg-white/[0.06] backdrop-blur-xl rounded-2xl border border-white/[0.18] p-8 hover:bg-white/[0.08] transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-cyan-500/10 overflow-hidden">
                      {/* Gradient overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-br from-[#60A5FA]/5 to-[#5EEAD4]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                      {/* Content */}
                      <div className="relative z-10">
                        {/* Header with Icon and Badge */}
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#60A5FA]/20 to-[#5EEAD4]/20 flex items-center justify-center">
                              <Icon className="w-7 h-7 text-[#60A5FA]" />
                            </div>
                            <div>
                              <h3 className="text-[#E6EBF5] font-bold text-2xl">
                                {industry.title}
                              </h3>
                              <p className="text-[#CBD5E1] text-sm mt-1">
                                {industry.description}
                              </p>
                            </div>
                          </div>
                          <span className="bg-gradient-to-r from-[#60A5FA] to-[#5EEAD4] text-white text-xs px-3 py-1.5 rounded-full font-medium flex-shrink-0">
                            実績あり
                          </span>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          {/* Examples */}
                          <div>
                            <div className="text-[#9AA6BF] text-sm font-semibold mb-3">主な実績</div>
                            <ul className="space-y-2">
                              {industry.examples.map((example, exampleIndex) => (
                                <li key={exampleIndex} className="text-[#CBD5E1] text-sm flex items-start">
                                  <CheckCircle className="w-4 h-4 text-[#5EEAD4] mr-2 mt-0.5 flex-shrink-0" />
                                  <span>{example}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Achievements */}
                          <div>
                            <div className="text-[#9AA6BF] text-sm font-semibold mb-3">成果</div>
                            <div className="space-y-2">
                              {industry.achievements.map((achievement, achIndex) => (
                                <div
                                  key={achIndex}
                                  className="text-[#5EEAD4] text-sm bg-white/5 px-3 py-2 rounded-md flex items-start"
                                >
                                  <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                                  <span>{achievement}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mt-6">
                          {industry.tags.map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="text-sm text-[#9AA6BF] px-3 py-1.5 rounded-md bg-white/5 border border-white/10"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>

          {/* その他対応可能業界 */}
          <motion.div
            className="mt-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-[#E6EBF5] mb-3">
                その他の対応可能業界
              </h3>
              <p className="text-[#9AA6BF]">
                上記以外の業界にも幅広く対応可能です。お気軽にご相談ください。
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
              {otherIndustries.map((industry, index) => {
                const Icon = industry.icon;
                return (
                  <motion.div
                    key={index}
                    className="bg-white/[0.04] backdrop-blur-sm rounded-xl border border-white/[0.12] p-4 hover:bg-white/[0.06] hover:border-white/[0.24] transition-all duration-300 text-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-[#60A5FA]/10 to-[#5EEAD4]/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Icon className="w-5 h-5 text-[#9AA6BF]" />
                    </div>
                    <div className="text-[#CBD5E1] text-sm font-medium">
                      {industry.title}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Bottom CTA */}
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/#contact"
              className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-[#60A5FA] to-[#5EEAD4] text-white rounded-full font-medium hover:shadow-lg hover:shadow-cyan-500/25 transition-all transform hover:scale-105"
            >
              無料相談を予約する
              <ArrowRight className="w-5 h-5 ml-2" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Representative Message - Enhanced */}
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
                      src="/images/team/代表取締役写真.jpg"
                      alt="代表取締役 石井 勇多"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-center md:text-left">
                    <h3 className="text-3xl font-bold text-white mb-2">石井 勇多</h3>
                    <p className="text-cyan-400 font-medium">代表取締役</p>
                  </div>
                </div>

                <blockquote className="relative">
                  <div className="absolute -top-4 -left-2 text-6xl text-cyan-500/20 font-serif">&ldquo;</div>
                  <p className="text-lg md:text-xl text-gray-300 leading-relaxed italic mb-6">
                    私たちDP-GUILDは、お客様にとって&ldquo;頼れるITパートナー&rdquo;でありたいと考えています
                  </p>
                  <p className="text-lg md:text-xl text-gray-300 leading-relaxed italic mb-6">
                    技術的な解決策を提供するだけでなく、お客様と共に課題に向き合い、
                    真に価値のあるソリューションを共創することを大切にしています
                  </p>
                  <p className="text-lg md:text-xl text-gray-300 leading-relaxed italic">
                    滋賀という地域から始まった私たちの挑戦を、全国のお客様に届け、
                    共に成長していく。それが私たちの使命です
                  </p>
                  <div className="absolute -bottom-8 right-0 text-6xl text-cyan-500/20 font-serif rotate-180">&rdquo;</div>
                </blockquote>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA - Enhanced */}
      <section id="contact" className="py-20 bg-gradient-to-r from-cyan-500 to-blue-600">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              まずは課題の言語化から
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-12">
              どんな小さな課題でも、お気軽にご相談ください。
              30分の無料相談で、解決への第一歩を踏み出しましょう。
            </p>

            <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto mb-12">
              <motion.div
                whileHover={{ scale: 1.05 }}
              >
                <Link
                  href="/#contact"
                  className="bg-white hover:bg-gray-50 text-[#0F172A] p-8 rounded-2xl flex flex-col items-center transition-all group block"
                >
                  <Mail className="w-12 h-12 mb-4 text-cyan-500 group-hover:scale-110 transition-transform" />
                  <div className="text-xl font-semibold mb-2">フォームで相談</div>
                  <div className="text-gray-600 mb-4">24時間受付中</div>
                  <div className="inline-flex items-center text-cyan-500 font-bold">
                    相談フォームへ
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </div>
                </Link>
              </motion.div>

              <motion.a
                href="mailto:info@dp-guild.com"
                className="bg-white/10 backdrop-blur hover:bg-white/20 text-white p-8 rounded-2xl flex flex-col items-center transition-all group"
                whileHover={{ scale: 1.05 }}
              >
                <Mail className="w-12 h-12 mb-4 group-hover:scale-110 transition-transform" />
                <div className="text-xl font-semibold mb-2">メールで相談</div>
                <div className="text-white/80 mb-4">24時間受付中</div>
                <div className="inline-flex items-center font-bold">
                  info@dp-guild.com
                </div>
              </motion.a>
            </div>

            <p className="text-white/80 text-sm">
              ※ 課題が明確でなくても大丈夫です。一緒に整理するところから始めましょう。
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}