'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Award, Target, ArrowRight, CheckCircle, Building2, Lightbulb } from 'lucide-react';
import Header from '@/components/Header';

export default function ResultsPage() {
  const [activeIndustry, setActiveIndustry] = useState("manufacturing");

  const statistics = [
    {
      value: 1500,
      suffix: "万+",
      label: "SNS動画再生回数",
      description: "バイラルコンテンツ制作実績",
      icon: TrendingUp
    },
    {
      value: 300,
      suffix: "件+",
      label: "プロジェクト実績",
      description: "幅広い業界での豊富な経験",
      icon: Award
    },
    {
      value: 94,
      suffix: "%",
      label: "顧客継続率",
      description: "信頼される長期パートナーシップ",
      icon: Users
    },
    {
      value: 10,
      suffix: "年+",
      label: "業界歴",
      description: "確かな技術と知見の蓄積",
      icon: CheckCircle
    }
  ];

  const achievements = [
    {
      title: "圧倒的なサポート力",
      description: "導入前の要件定義から運用開始後まで、専任担当者が一貫してサポート。「困った時にすぐ相談できる」安心感で、多くのお客様から高い評価をいただいています。",
      icon: Users,
      metrics: [
        { label: "顧客満足度", value: "96%" },
        { label: "平均対応時間", value: "24時間以内" },
        { label: "継続率", value: "94%" }
      ]
    },
    {
      title: "現場に根ざした提案力",
      description: "単なるシステム構築ではなく、お客様の業界特性や事業課題を深く理解した上での本質的な改善提案。「言われる前に気づいてくれる」提案力で真の課題解決を実現します。",
      icon: Target,
      metrics: [
        { label: "提案採用率", value: "87%" },
        { label: "業界実績", value: "10業種以上" },
        { label: "改善提案数", value: "年間200件以上" }
      ]
    },
    {
      title: "お客様に寄り添う伴走力",
      description: "プロジェクト完了がゴールではありません。お客様のビジネスの成長と変化に合わせて、システムも進化させ続ける。「一緒に成長していく」パートナーシップを大切にしています。",
      icon: TrendingUp,
      metrics: [
        { label: "長期契約率", value: "90%" },
        { label: "平均契約期間", value: "3年以上" },
        { label: "リピート率", value: "85%" }
      ]
    }
  ];

  const industries = [
    { id: "manufacturing", name: "製造業", icon: Building2 },
    { id: "service", name: "サービス業", icon: TrendingUp },
    { id: "healthcare", name: "医療", icon: Users },
    { id: "retail", name: "小売業", icon: TrendingUp },
    { id: "education", name: "教育", icon: Lightbulb }
  ];

  const industryContent: Record<string, { summary: string; cases: Array<{ title: string; challenge: string; achievements: string[]; duration: string; budget: string; tags: string[] }> }> = {
    manufacturing: {
      summary: "製造業向けデジタルマーケティング支援",
      cases: [
        {
          title: "甲賀忍者服工房 - ECサイト制作",
          challenge: "伝統的な忍者服の魅力を伝えるシンプルで直感的なECサイトの必要性",
          achievements: ["• 訪問者数・売上の順調な増加", "• 顧客満足度の向上", "• オンライン販売の強化"],
          duration: "6ヶ月",
          budget: "応相談",
          tags: ["EC構築", "フルスクラッチ", "シンプル設計"]
        },
        {
          title: "醸造業者 - 業務効率化・マーケティング",
          challenge: "在庫管理の非効率、顧客満足度向上、限られた資金でのマーケティング",
          achievements: ["• 業務効率の大幅向上", "• 在庫ロス減少", "• リピーター増加"],
          duration: "4ヶ月",
          budget: "応相談",
          tags: ["在庫管理システム", "Wi-Fi整備", "SNSマーケティング"]
        },
        {
          title: "大手食品メーカー - ITコンサルティング",
          challenge: "データドリブンマーケティング実施のためのシステム導入、ベンダー選定",
          achievements: ["• 最適なベンダー選定成功", "• 顧客データ分析強化", "• マーケティング精度向上"],
          duration: "8ヶ月",
          budget: "応相談",
          tags: ["要求定義", "ベンダー選定", "RFP作成"]
        }
      ]
    },
    retail: {
      summary: "小売業向けECサイト制作・ブランディング支援",
      cases: [
        {
          title: "Tomo工房 - ECサイト制作",
          challenge: "オフライン中心の販売からオンラインプレゼンスの強化、ブランドの独自性を活かしたサイト設計",
          achievements: ["• ブランド認知度の大幅向上", "• ECサイト経由での売上増加", "• 新規顧客の獲得成功"],
          duration: "6ヶ月",
          budget: "応相談",
          tags: ["EC企画設計", "写真撮影", "SEO対策"]
        },
        {
          title: "アパレルショップ - EC売上向上施策",
          challenge: "EC売上の伸び悩み、リピーター獲得の課題",
          achievements: ["• EC売上40%向上", "• リピート率25%改善", "• 顧客単価の向上"],
          duration: "5ヶ月",
          budget: "応相談",
          tags: ["CRM導入", "メールマーケティング", "EC最適化"]
        },
        {
          title: "雑貨店 - オムニチャネル戦略",
          challenge: "オンラインとオフラインの連携不足、在庫管理の課題",
          achievements: ["• O2O施策による来店数増加", "• 在庫管理の一元化", "• 顧客体験の向上"],
          duration: "7ヶ月",
          budget: "応相談",
          tags: ["オムニチャネル", "在庫管理", "アプリ開発"]
        }
      ]
    },
    healthcare: {
      summary: "医療機関向けマーケティング調査・LP構築支援",
      cases: [
        {
          title: "リハビリ業者 - マーケティング調査・LP構築",
          challenge: "脳疾患特化型リハビリの認知不足、Web集客の弱さ、コンバージョン率の低さ",
          achievements: ["• Web問い合わせ件数の大幅増加", "• コンバージョン率の着実な向上", "• 患者様の利用増加"],
          duration: "6ヶ月",
          budget: "応相談",
          tags: ["マーケティング調査", "LP構築", "SEO対策"]
        },
        {
          title: "整形外科クリニック - Web予約システム導入",
          challenge: "電話予約による業務負担の増加、新規患者獲得の課題",
          achievements: ["• Web予約率60%達成", "• 受付業務の効率化", "• 新規患者数30%増加"],
          duration: "4ヶ月",
          budget: "応相談",
          tags: ["予約システム", "業務効率化", "SEO対策"]
        },
        {
          title: "歯科医院 - 地域マーケティング強化",
          challenge: "地域での認知度不足、競合との差別化",
          achievements: ["• MEO対策で検索上位表示", "• 来院数20%増加", "• 口コミ評価の向上"],
          duration: "3ヶ月",
          budget: "応相談",
          tags: ["MEO対策", "口コミ施策", "地域広告"]
        }
      ]
    },
    service: {
      summary: "サービス業向けWeb制作・マーケティング支援",
      cases: [
        {
          title: "B-stretch Studio - コーポレートサイト制作",
          challenge: "新規開業に伴う限られた予算での集客と信頼性確立",
          achievements: ["• 集客力の大幅向上", "• リピーター獲得", "• 安定経営の実現"],
          duration: "3ヶ月",
          budget: "応相談",
          tags: ["UI/UX設計", "予算最適化", "包括サポート"]
        },
        {
          title: "株式会社ビーフォル - LP制作",
          challenge: "オンラインプレゼンスの欠如、サービスの簡便さを伝える手段の不足",
          achievements: ["• 見積もり依頼件数の増加", "• ブランド認知の拡大", "• 顧客満足度の向上"],
          duration: "2ヶ月",
          budget: "応相談",
          tags: ["LPデザイン", "直感的操作", "クリエイティブ"]
        },
        {
          title: "自動車塗装業者 - HP構築・マーケティング",
          challenge: "Web集客不足、ブランド認知度の低さ、既存HPの課題",
          achievements: ["• Web問い合わせ・来店数の大幅増加", "• ブランド認知度の向上", "• リピーター増加"],
          duration: "5ヶ月",
          budget: "応相談",
          tags: ["マーケティング戦略", "HP構築", "SEO対策"]
        }
      ]
    },
    education: {
      summary: "教育機関向けSNSマーケティング支援",
      cases: [
        {
          title: "デザインスクール - SNSコンサルティング",
          challenge: "Instagram活用による認知拡大、教育コンテンツのバイラル化、効果的な広告運用戦略の構築",
          achievements: ["• Instagram動画 1,600万回再生達成", "• 認知度の爆発的向上", "• 受講生獲得の大幅増加"],
          duration: "4ヶ月",
          budget: "応相談",
          tags: ["SNSコンサル", "動画企画", "Instagram広告"]
        },
        {
          title: "プログラミングスクール - Web集客強化",
          challenge: "競合との差別化、オンライン経由の受講生獲得強化",
          achievements: ["• Web経由の申込数3倍増加", "• 広告費用対効果の改善", "• ブランド認知度向上"],
          duration: "6ヶ月",
          budget: "応相談",
          tags: ["リスティング広告", "LP最適化", "コンテンツSEO"]
        },
        {
          title: "学習塾 - 地域マーケティング",
          challenge: "地域での生徒募集強化、保護者へのアプローチ改善",
          achievements: ["• 入塾者数35%増加", "• 体験授業申込の増加", "• 保護者満足度向上"],
          duration: "5ヶ月",
          budget: "応相談",
          tags: ["地域SEO", "チラシ×Web連携", "口コミ施策"]
        }
      ]
    }
  };

  const caseStudies = [
    {
      client: "B-stretch Studio",
      industry: "サービス業",
      challenge: "新規開業に伴う限られた予算での集客と信頼性確立",
      solution: "UI/UX設計とデザイン制作、予算最適化したコーポレートサイト構築、IT知識不足を補う包括的サポート",
      result: "集客力の大幅向上、リピーター獲得による安定経営の実現",
      image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
    },
    {
      client: "株式会社ビーフォル",
      industry: "サービス業",
      challenge: "オンラインプレゼンスの欠如、サービスの簡便さを伝える手段の不足",
      solution: "プロフェッショナルなLPデザイン、直感的な操作説明の実装、サービスの利便性を強調したクリエイティブ",
      result: "見積もり依頼件数の増加、ブランド認知の拡大、顧客満足度の向上",
      image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
    },
    {
      client: "甲賀忍者服工房",
      industry: "製造業",
      challenge: "伝統的な忍者服の魅力を伝えるシンプルで直感的なECサイトの必要性",
      solution: "フルスクラッチでのECサイト構築、商品に集中できるシンプル設計、高品質な商品写真を活かした構成",
      result: "訪問者数・売上の順調な増加、顧客満足度の向上、オンライン販売の強化",
      image: "https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
    },
    {
      client: "Tomo工房",
      industry: "小売業",
      challenge: "オフライン中心の販売からオンラインプレゼンスの強化、ブランドの独自性を活かしたサイト設計",
      solution: "ECサイトの企画・設計、プロカメラマンによる写真撮影、SEO対策を施したサイト構築",
      result: "ブランド認知度の大幅向上、ECサイト経由での売上増加、新規顧客の獲得成功",
      image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
    },
    {
      client: "リハビリ業者",
      industry: "医療",
      challenge: "脳疾患特化型リハビリの認知不足、Web集客の弱さ、コンバージョン率の低さ",
      solution: "マーケティング調査と戦略立案、信頼感を醸成するLP構築、SEO対策、継続的改善サイクル確立",
      result: "Web問い合わせ件数の大幅増加、コンバージョン率の着実な向上、患者様の利用増加",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
    },
    {
      client: "醸造業者",
      industry: "製造業",
      challenge: "在庫管理の非効率、顧客満足度向上のための環境整備、限られた資金でのマーケティング",
      solution: "在庫管理システム導入、店舗内Wi-Fi環境整備、低コストSNSマーケティング施策実施",
      result: "業務効率の大幅向上、在庫ロス減少、顧客満足度向上、リピーター増加、新規顧客獲得",
      image: "https://images.unsplash.com/photo-1579441407206-55f00de393a6?q=80&w=2370&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      client: "自動車塗装業者",
      industry: "サービス業",
      challenge: "Web集客不足、ブランド認知度の低さ、既存HPのユーザビリティ・デザイン面での課題",
      solution: "マーケティング戦略立案、地域密着型オンライン広告展開、HP構築とSEO対策、質の高いコンテンツ作成",
      result: "Web問い合わせ・来店数の大幅増加、ブランド認知度の向上、リピーター増加",
      image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
    },
    {
      client: "大手食品メーカー",
      industry: "製造業",
      challenge: "データドリブンマーケティング実施のためのシステム導入、適切なベンダー選定、RFP作成の専門知識不足",
      solution: "要求定義の策定、ベンダー調査・選定サポート、RFP作成と管理、技術的要件とビジネス要件の明確化",
      result: "最適なベンダー選定とシステム導入成功、顧客データ分析強化、マーケティング施策の精度向上",
      image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
    },
    {
      client: "デザインスクール",
      industry: "教育",
      challenge: "Instagram活用による認知拡大、教育コンテンツのバイラル化、効果的な広告運用戦略の構築",
      solution: "SNSコンサルティング、動画コンテンツ企画・ブラッシュアップ、Instagram広告戦略立案、クリエイティブ最適化サポート",
      result: "Instagram動画 1,600万回再生達成、認知度の爆発的向上、ブランディング強化、受講生獲得の大幅増加",
      image: "https://images.unsplash.com/photo-1611926653458-09294b3142bf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
    }
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

  function ImageWithFallback({ src, alt, className, ...rest }: { src: string; alt: string; className?: string; [key: string]: unknown }) {
    const [didError, setDidError] = useState(false);

    if (didError) {
      return (
        <div className={`inline-block bg-gray-100 text-center align-middle ${className ?? ''}`}>
          <div className="flex items-center justify-center w-full h-full">
            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      );
    }

    return (
      <img
        src={src}
        alt={alt}
        className={className}
        {...rest}
        onError={() => setDidError(true)}
      />
    );
  }

  return (
    <div className="font-sans text-gray-900 bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#334155] pt-32 pb-20">
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <motion.div
            className="max-w-4xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              実績・事例
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              数字で見る成果と、お客様の課題解決ストーリーをご紹介します
            </p>
          </motion.div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-gradient-to-r from-cyan-500 to-blue-600">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {statistics.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Icon className="w-12 h-12 text-white mx-auto mb-4" />
                  <CountUpNumber value={stat.value} suffix={stat.suffix} />
                  <div className="text-white/90 font-medium mb-1">{stat.label}</div>
                  <div className="text-white/70 text-sm">{stat.description}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-4">選ばれる理由</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              お客様満足度96%の手厚いサポートで、真のパートナーシップを築きます
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {achievements.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  className="bg-[#F8FAFC] rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mb-6">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#0F172A] mb-3">{item.title}</h3>
                  <p className="text-gray-600 mb-6">{item.description}</p>

                  <div className="space-y-3">
                    {item.metrics.map((metric, metricIndex) => (
                      <div key={metricIndex} className="flex justify-between items-center">
                        <span className="text-gray-700">{metric.label}</span>
                        <span className="text-cyan-600 font-bold">{metric.value}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Industry Solutions */}
      <section className="py-20 bg-[#1E293B]">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">業界別実績</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              お客様の課題解決と成果創出の実績をご紹介します
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {industries.map((industry) => {
              const Icon = industry.icon;
              return (
                <button
                  key={industry.id}
                  className={`px-6 py-3 rounded-full flex items-center ${
                    activeIndustry === industry.id
                      ? "bg-cyan-500 text-white"
                      : "bg-[#0F172A] text-gray-300 hover:bg-[#0F172A]/80"
                  } transition-colors`}
                  onClick={() => setActiveIndustry(industry.id)}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  {industry.name}
                </button>
              );
            })}
          </div>

          <div className="bg-[#0F172A] rounded-xl p-8 md:p-12">
            <div className="text-center mb-8">
              <div className="text-cyan-400 font-medium text-lg mb-2">
                {industryContent[activeIndustry].summary}
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {industryContent[activeIndustry].cases.map((caseItem, index: number) => (
                <div key={index} className="bg-[#1E293B] rounded-lg p-6 hover:bg-[#1E293B]/80 transition-colors">
                  <h4 className="text-white font-bold mb-3">{caseItem.title}</h4>
                  <p className="text-gray-400 text-sm mb-4">{caseItem.challenge}</p>

                  <div className="mb-4 space-y-2">
                    {caseItem.achievements.map((achievement, achievementIndex: number) => (
                      <div key={achievementIndex} className="flex items-center">
                        <span className="text-cyan-400 text-sm font-semibold">• {achievement}</span>
                      </div>
                    ))}
                  </div>

                  <div className="text-gray-500 text-xs mb-3">
                    <div>期間: {caseItem.duration}</div>
                    <div>予算: {caseItem.budget}</div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {caseItem.tags.map((tag, tagIndex: number) => (
                      <span key={tagIndex} className="bg-[#0F172A] text-cyan-400 text-xs px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link
                href="/contact"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-medium hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
              >
                自社ではどのようなことができるのか問い合わせる
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-4">成功事例</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              実際の導入企業様における課題解決と成果創出の事例をご紹介します
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {caseStudies.map((study, index) => (
              <motion.div
                key={index}
                className="bg-[#F8FAFC] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <div className="h-64 overflow-hidden">
                  <ImageWithFallback
                    src={study.image}
                    alt={study.client}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-8">
                  <div className="text-sm text-cyan-600 font-medium mb-2">{study.industry}</div>
                  <h3 className="text-2xl font-bold text-[#0F172A] mb-3">{study.client}</h3>

                  <div className="mb-4">
                    <div className="text-gray-700 font-medium">課題:</div>
                    <div className="text-gray-600">{study.challenge}</div>
                  </div>

                  <div className="mb-4">
                    <div className="text-gray-700 font-medium">ソリューション:</div>
                    <div className="text-gray-600">{study.solution}</div>
                  </div>

                  <div>
                    <div className="text-gray-700 font-medium">成果:</div>
                    <div className="text-cyan-600 font-semibold">{study.result}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-cyan-500 to-blue-600">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              あなたのビジネスも成果を出しませんか？
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-12">
              まずは30分の無料相談で、お客様の課題をお聞かせください
            </p>

            <a
              href="https://timerex.net/s/info_f990_429a/709e9191"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-4 bg-white text-[#0F172A] rounded-md font-medium hover:bg-gray-100 transition-colors"
            >
              無料相談を予約する
              <ArrowRight className="w-5 h-5 ml-2" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0F172A] py-12 border-t border-gray-800">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div>
              <div className="text-2xl font-bold text-white mb-4">DP-GUILD</div>
              <p className="text-gray-400 mb-6">
                マーケティング戦略の立案から実行まで<br />
                一気通貫でサポートするデジタルマーケティングエージェンシー
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">サイトマップ</h3>
              <ul className="space-y-3">
                {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                <li><a href="/#solutions" className="text-gray-400 hover:text-white transition-colors">ソリューション</a></li>
                <li><Link href="/results" className="text-gray-400 hover:text-white transition-colors">実績・事例</Link></li>
                <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">会社概要</Link></li>
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
