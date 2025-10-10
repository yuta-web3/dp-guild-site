"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Send, Loader2, CheckCircle, AlertCircle, TrendingUp, Code, Building2, Lightbulb } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactFormData } from "@/lib/contact-schema";

// Spline fallback component
const SplineFallback: React.FC = () => (
  <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
  </div>
);

// SplineViewer component - Using iframe approach
function SplineViewer({ scene, className = '' }: { scene: string; className?: string }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    console.log('Spline iframe loaded successfully');
    setIsLoaded(true);
  };

  const handleError = () => {
    console.error('Spline iframe error');
    setHasError(true);
  };

  return (
    <div className={`relative ${className}`}>
      <iframe
        src={scene}
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'auto'
        }}
        onLoad={handleLoad}
        onError={handleError}
        allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        title="3D Scene"
      />

      {!isLoaded && !hasError && <SplineFallback />}

      {hasError && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="text-2xl mb-4">3D Scene Loading...</div>
            <div className="text-sm opacity-75">Error loading Spline scene</div>
          </div>
        </div>
      )}
    </div>
  );
}

// Image fallback component for Next.js
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

// CountUpCard component with animation
function CountUpCard({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000; // 2秒
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
    <div ref={cardRef} className="bg-white p-6 rounded-lg shadow-sm">
      <div className="text-3xl font-bold text-[#0F172A] mb-2">
        {count}{suffix}
      </div>
      <div className="text-gray-600">{label}</div>
    </div>
  );
}

export default function DPGuildWebsite() {
  const [activeIndustry, setActiveIndustry] = useState("manufacturing");
  const clientLogosRef = useRef<HTMLDivElement | null>(null);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  // Contact form states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      honeypot: '',
      timestamp: 0
    }
  });

  const animationSpeed = 1;

  // Handle URL parameter filtering for cases section
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get('cat');
    setFilterCategory(cat);
  }, []);

  // Contact form timestamp setup
  useEffect(() => {
    const ts = Date.now();
    setValue('timestamp', ts);
  }, [setValue]);

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'エラーが発生しました');
      }

      setSubmitStatus('success');
      reset();
      const newTs = Date.now();
      setValue('timestamp', newTs);

      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
    } catch (error) {
      console.error('Submit error:', error);
      setSubmitStatus('error');
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Client logos animation
  useEffect(() => {
    if (!clientLogosRef.current) return;

    const scrollLogos = () => {
      if (clientLogosRef.current) {
        const scrollWidth = clientLogosRef.current.scrollWidth;
        const containerWidth = clientLogosRef.current.offsetWidth;

        if (scrollWidth > containerWidth) {
          const currentScroll = clientLogosRef.current.scrollLeft;
          if (currentScroll >= scrollWidth - containerWidth) {
            clientLogosRef.current.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            clientLogosRef.current.scrollTo({
              left: currentScroll + 1,
              behavior: 'auto'
            });
          }
        }
      }
    };

    const interval = setInterval(scrollLogos, 30);
    return () => clearInterval(interval);
  }, []);

  // Mock data
  const achievements = [
    {
      title: "圧倒的なサポート力",
      description: "導入前の要件定義から運用開始後まで、専任担当者が一貫してサポート。「困った時にすぐ相談できる」安心感で、多くのお客様から高い評価をいただいています。",
      icon: ""
    },
    {
      title: "現場に根ざした提案力",
      description: "単なるシステム構築ではなく、お客様の業界特性や事業課題を深く理解した上での本質的な改善提案。「言われる前に気づいてくれる」提案力で真の課題解決を実現します。",
      icon: ""
    },
    {
      title: "お客様に寄り添う伴走力",
      description: "プロジェクト完了がゴールではありません。お客様のビジネスの成長と変化に合わせて、システムも進化させ続ける。「一緒に成長していく」パートナーシップを大切にしています。",
      icon: ""
    }
  ];

  const industries = [
    { id: "manufacturing", name: "製造業", icon: "" },
    { id: "service", name: "サービス業", icon: "" },
    { id: "healthcare", name: "医療", icon: "" },
    { id: "retail", name: "小売業", icon: "" },
    { id: "education", name: "教育", icon: "" }
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
      category: "web",
      challenge: "新規開業に伴う限られた予算での集客と信頼性確立",
      solution: "UI/UX設計とデザイン制作、予算最適化したコーポレートサイト構築、IT知識不足を補う包括的サポート",
      result: "集客力の大幅向上、リピーター獲得による安定経営の実現",
      image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
    },
    {
      client: "株式会社ビーフォル",
      industry: "サービス業",
      category: "web",
      challenge: "オンラインプレゼンスの欠如、サービスの簡便さを伝える手段の不足",
      solution: "プロフェッショナルなLPデザイン、直感的な操作説明の実装、サービスの利便性を強調したクリエイティブ",
      result: "見積もり依頼件数の増加、ブランド認知の拡大、顧客満足度の向上",
      image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
    },
    {
      client: "甲賀忍者服工房",
      industry: "製造業",
      category: "web",
      challenge: "伝統的な忍者服の魅力を伝えるシンプルで直感的なECサイトの必要性",
      solution: "フルスクラッチでのECサイト構築、商品に集中できるシンプル設計、高品質な商品写真を活かした構成",
      result: "訪問者数・売上の順調な増加、顧客満足度の向上、オンライン販売の強化",
      image: "https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
    },
    {
      client: "Tomo工房",
      industry: "小売業",
      category: "web",
      challenge: "オフライン中心の販売からオンラインプレゼンスの強化、ブランドの独自性を活かしたサイト設計",
      solution: "ECサイトの企画・設計、プロカメラマンによる写真撮影、SEO対策を施したサイト構築",
      result: "ブランド認知度の大幅向上、ECサイト経由での売上増加、新規顧客の獲得成功",
      image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
    },
    {
      client: "リハビリ業者",
      industry: "医療",
      category: "marketing",
      challenge: "脳疾患特化型リハビリの認知不足、Web集客の弱さ、コンバージョン率の低さ",
      solution: "マーケティング調査と戦略立案、信頼感を醸成するLP構築、SEO対策、継続的改善サイクル確立",
      result: "Web問い合わせ件数の大幅増加、コンバージョン率の着実な向上、患者様の利用増加",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
    },
    {
      client: "醸造業者",
      industry: "製造業",
      category: "consulting",
      challenge: "在庫管理の非効率、顧客満足度向上のための環境整備、限られた資金でのマーケティング",
      solution: "在庫管理システム導入、店舗内Wi-Fi環境整備、低コストSNSマーケティング施策実施",
      result: "業務効率の大幅向上、在庫ロス減少、顧客満足度向上、リピーター増加、新規顧客獲得",
      image: "https://images.unsplash.com/photo-1579441407206-55f00de393a6?q=80&w=2370&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      client: "自動車塗装業者",
      industry: "サービス業",
      category: "marketing",
      challenge: "Web集客不足、ブランド認知度の低さ、既存HPのユーザビリティ・デザイン面での課題",
      solution: "マーケティング戦略立案、地域密着型オンライン広告展開、HP構築とSEO対策、質の高いコンテンツ作成",
      result: "Web問い合わせ・来店数の大幅増加、ブランド認知度の向上、リピーター増加",
      image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
    },
    {
      client: "大手食品メーカー",
      industry: "製造業",
      category: "consulting",
      challenge: "データドリブンマーケティング実施のためのシステム導入、適切なベンダー選定、RFP作成の専門知識不足",
      solution: "要求定義の策定、ベンダー調査・選定サポート、RFP作成と管理、技術的要件とビジネス要件の明確化",
      result: "最適なベンダー選定とシステム導入成功、顧客データ分析強化、マーケティング施策の精度向上",
      image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
    },
    {
      client: "デザインスクール",
      industry: "教育",
      category: "marketing",
      challenge: "Instagram活用による認知拡大、教育コンテンツのバイラル化、効果的な広告運用戦略の構築",
      solution: "SNSコンサルティング、動画コンテンツ企画・ブラッシュアップ、Instagram広告戦略立案、クリエイティブ最適化サポート",
      result: "Instagram動画 1,600万回再生達成、認知度の爆発的向上、ブランディング強化、受講生獲得の大幅増加",
      image: "https://images.unsplash.com/photo-1611926653458-09294b3142bf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
    }
  ];

  // Filter and sort case studies based on category parameter
  const filteredCaseStudies = filterCategory
    ? [
        ...caseStudies.filter(c => c.category === filterCategory),
        ...caseStudies.filter(c => c.category !== filterCategory)
      ]
    : caseStudies;

  const clearFilter = () => {
    setFilterCategory(null);
    window.history.pushState({}, '', window.location.pathname);
  };

  return (
    <div className="font-sans text-gray-900 bg-white">
      {/* Fixed CTA Button */}
      <Link
        href="/contact"
        className="fixed right-0 top-1/2 -translate-y-1/2 z-50 bg-gradient-to-b from-cyan-500 to-blue-600 text-white px-8 py-6 rounded-l-2xl font-bold text-lg shadow-2xl hover:from-cyan-600 hover:to-blue-700 transition-all hover:shadow-cyan-500/50 hover:px-10 animate-pulse"
        style={{ writingMode: 'vertical-rl', letterSpacing: '0.1em' }}
      >
        無料相談
      </Link>

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

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <SplineViewer
            scene="https://my.spline.design/r4xbot-sRfRFTSBMab2EeAj0BOf0RhM/"
            className="w-full h-full"
          />
        </div>

      </section>

      {/* Solutions Section */}
      <section id="solutions" className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-4">解決できること（ソリューション）</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              &ldquo;成果が出る&rdquo;デジタル実装を、戦略と現場で最後まで伴走します
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* デジタルマーケティング */}
            <motion.div
              className="bg-[#F8FAFC] rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                  <TrendingUp className="w-6 h-6 text-gray-600" />
                </div>
                <h3 className="text-2xl font-bold text-[#0F172A]">デジタルマーケティング</h3>
              </div>
              <p className="text-gray-600 mb-6">
                認知〜再訪の配分を&ldquo;数字&rdquo;で最適化。広告・SNS・SEOを横断運用
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">CPA -30〜45%</span>
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">CVR +15〜35%</span>
              </div>
              <div>
                {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                <a href="/#cases" className="text-cyan-600 font-medium hover:text-cyan-700 transition-colors">
                  成功事例を見る
                </a>
              </div>
            </motion.div>

            {/* Web・EC制作 */}
            <motion.div
              className="bg-[#F8FAFC] rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                  <Code className="w-6 h-6 text-gray-600" />
                </div>
                <h3 className="text-2xl font-bold text-[#0F172A]">Web・EC制作</h3>
              </div>
              <p className="text-gray-600 mb-6">
                CV動線に直結する情報設計で&ldquo;売れる&rdquo;LP/EC/採用サイトを最短構築
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">CVR +15〜40%</span>
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">離脱率 -10〜25%</span>
              </div>
              <div>
                {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                <a href="/#cases" className="text-cyan-600 font-medium hover:text-cyan-700 transition-colors">
                  成功事例を見る
                </a>
              </div>
            </motion.div>

            {/* システム・アプリ開発 */}
            <motion.div
              className="bg-[#F8FAFC] rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                  <Building2 className="w-6 h-6 text-gray-600" />
                </div>
                <h3 className="text-2xl font-bold text-[#0F172A]">システム・アプリ開発</h3>
              </div>
              <p className="text-gray-600 mb-6">
                要件→設計→実装→保守までワンストップ。AI/クラウドも現実解で導入
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">運用工数 -20〜35%</span>
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">障害件数 -30%+</span>
              </div>
              <div>
                {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                <a href="/#cases" className="text-cyan-600 font-medium hover:text-cyan-700 transition-colors">
                  成功事例を見る
                </a>
              </div>
            </motion.div>

            {/* ITコンサル・PM */}
            <motion.div
              className="bg-[#F8FAFC] rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                  <Lightbulb className="w-6 h-6 text-gray-600" />
                </div>
                <h3 className="text-2xl font-bold text-[#0F172A]">ITコンサル・PM</h3>
              </div>
              <p className="text-gray-600 mb-6">
                &ldquo;実装される計画&rdquo;で意思決定を加速。進捗とKPIで成果を可視化
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">MQL→SQL +25〜50%</span>
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">回収期間 -1.5〜3ヶ月</span>
              </div>
              <div>
                {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                <a href="/#cases" className="text-cyan-600 font-medium hover:text-cyan-700 transition-colors">
                  成功事例を見る
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 bg-[#F8FAFC]">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-semibold text-[#1E293B] mb-2">数字で見る成果</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <CountUpCard value={1500} suffix="万+" label="SNS動画再生回数" />
            <CountUpCard value={300} suffix="件+" label="プロジェクト実績" />
            <CountUpCard value={94} suffix="%" label="顧客継続率" />
            <CountUpCard value={10} suffix="年+" label="業界歴" />
          </div>

          <div className="flex flex-wrap justify-center items-center gap-6 mt-12">
            <div className="bg-white p-3 rounded-md shadow-sm">
              <div className="text-sm font-medium text-gray-600">AWS官公庁級基盤構築</div>
            </div>
            <div className="bg-white p-3 rounded-md shadow-sm">
              <div className="text-sm font-medium text-gray-600">Google Cloud活用実績</div>
            </div>
            <div className="bg-white p-3 rounded-md shadow-sm">
              <div className="text-sm font-medium text-gray-600">生成AI企業導入支援</div>
            </div>
            <div className="bg-white p-3 rounded-md shadow-sm">
              <div className="text-sm font-medium text-gray-600">エンタープライズ対応</div>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section id="achievements" className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-4">選ばれる理由</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              お客様満足度96%の手厚いサポートで、真のパートナーシップを築きます
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {achievements.map((item, index) => (
              <motion.div
                key={index}
                className="bg-[#F8FAFC] rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 * animationSpeed, delay: index * 0.1 * animationSpeed }}
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-2xl font-bold text-[#0F172A] mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Solutions */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-4">実績・事例</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              お客様の課題解決と成果創出の実績をご紹介します
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {industries.map((industry) => (
              <button
                key={industry.id}
                className={`px-6 py-3 rounded-full flex items-center ${
                  activeIndustry === industry.id
                    ? "bg-cyan-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                } transition-colors`}
                onClick={() => setActiveIndustry(industry.id)}
              >
                <span className="mr-2">{industry.icon}</span>
                {industry.name}
              </button>
            ))}
          </div>

          <div className="bg-[#F8FAFC] rounded-xl p-8 md:p-12">
            {/* 平均実績サマリー */}
            <div className="text-center mb-8">
              <div className="text-cyan-600 font-medium text-lg mb-2">
                {industryContent[activeIndustry].summary}
              </div>
            </div>

            {/* 実績カード */}
            <div className="grid md:grid-cols-3 gap-6">
              {industryContent[activeIndustry].cases.map((caseItem, index: number) => (
                <div key={index} className="bg-white rounded-lg p-6 hover:shadow-md transition-shadow border border-gray-200">
                  <h4 className="text-[#0F172A] font-bold mb-3">{caseItem.title}</h4>
                  <p className="text-gray-600 text-sm mb-4">{caseItem.challenge}</p>

                  {/* 成果・実績 */}
                  <div className="mb-4 space-y-2">
                    {caseItem.achievements.map((achievement, achievementIndex: number) => (
                      <div key={achievementIndex} className="flex items-center">
                        <span className="text-cyan-600 text-sm font-semibold">• {achievement}</span>
                      </div>
                    ))}
                  </div>

                  {/* 期間と予算 */}
                  <div className="text-gray-500 text-xs mb-3">
                    <div>期間: {caseItem.duration}</div>
                    <div>予算: {caseItem.budget}</div>
                  </div>

                  {/* 施策タグ */}
                  <div className="flex flex-wrap gap-2">
                    {caseItem.tags.map((tag, tagIndex: number) => (
                      <span key={tagIndex} className="bg-cyan-50 text-cyan-700 text-xs px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* 全体CTA */}
            <div className="text-center mt-8">
              <a
                href="#contact"
                className="inline-flex items-center px-6 py-3 bg-cyan-500 text-white rounded-md font-medium hover:bg-cyan-600 transition-colors"
              >
                自社ではどのようなことができるのか問い合わせる
                <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section id="cases" className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-4">成功事例</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              実際の導入企業様における課題解決と成果創出の事例をご紹介します
            </p>
          </div>

          {filterCategory && (
            <div className="flex justify-center mb-8">
              <button
                onClick={clearFilter}
                className="inline-flex items-center px-6 py-2 bg-gray-100 text-gray-700 rounded-full font-medium hover:bg-gray-200 transition-colors"
              >
                絞り込み解除
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-12">
            {filteredCaseStudies.map((study, index) => (
              <div
                key={index}
                className="bg-[#F8FAFC] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
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
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <a
              href="#contact"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-medium hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
            >
              あなたのビジネスでも同じ成果を出しませんか？
              <ArrowRight className="w-5 h-5 ml-2" />
            </a>
          </div>
        </div>
      </section>

      {/* Company Overview Short */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-4">私たちについて</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              滋賀から始まる全国展開。確かなデジタル化と業務効率化を実現し、お客様のビジネス成長を技術の力で加速します
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center mb-12">
              <div>
                <div className="rounded-2xl overflow-hidden">
                  <img
                    src="/images/team/代表取締役写真.jpg"
                    alt="代表取締役 石井 勇多"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-[#0F172A] mb-4">代表取締役 石井 勇多</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  私たちDP-GUILDは、お客様にとって&ldquo;頼れるITパートナー&rdquo;でありたいと考えています。
                  技術的な解決策を提供するだけでなく、お客様と共に課題に向き合い、
                  真に価値のあるソリューションを共創することを大切にしています
                </p>
                <Link
                  href="/about"
                  className="inline-flex items-center text-cyan-600 font-medium hover:text-cyan-700 transition-colors"
                >
                  会社概要を見る
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section id="contact" className="py-20 bg-[#0F172A]">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              まずは課題の言語化から
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-12">
              30分の無料相談で、お客様の課題をお聞かせください
            </p>

            <div className="flex justify-center mb-16">
              <Link
                href="/contact"
                className="inline-flex items-center px-8 py-4 bg-white text-[#0F172A] rounded-md font-medium hover:bg-gray-100 transition-colors"
              >
                無料相談を予約する
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>

            <div className="bg-white/10 backdrop-blur p-8 rounded-xl">
              <div className="text-xl font-semibold text-white mb-6">お急ぎの方はフォームから</div>
              <form onSubmit={handleSubmit(onSubmit)} className="grid md:grid-cols-2 gap-4">
                {/* ハニーポット（非表示） */}
                <input
                  type="text"
                  {...register('honeypot')}
                  tabIndex={-1}
                  autoComplete="off"
                  style={{
                    position: 'absolute',
                    left: '-9999px',
                    width: '1px',
                    height: '1px',
                    overflow: 'hidden'
                  }}
                />

                <div>
                  <input
                    type="text"
                    {...register('name')}
                    placeholder="お名前 *"
                    className={`w-full px-4 py-3 rounded-md bg-[#0F172A] border text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 ${
                      errors.name ? 'border-red-500' : 'border-gray-700'
                    }`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-400 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div>
                  <input
                    type="email"
                    {...register('email')}
                    placeholder="メールアドレス *"
                    className={`w-full px-4 py-3 rounded-md bg-[#0F172A] border text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 ${
                      errors.email ? 'border-red-500' : 'border-gray-700'
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-400 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <input
                    type="text"
                    {...register('company')}
                    placeholder="会社名"
                    className={`w-full px-4 py-3 rounded-md bg-[#0F172A] border text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 ${
                      errors.company ? 'border-red-500' : 'border-gray-700'
                    }`}
                  />
                  {errors.company && (
                    <p className="mt-1 text-sm text-red-400 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.company.message}
                    </p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <textarea
                    {...register('content')}
                    placeholder="ご相談内容 *"
                    rows={4}
                    className={`w-full px-4 py-3 rounded-md bg-[#0F172A] border text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 ${
                      errors.content ? 'border-red-500' : 'border-gray-700'
                    }`}
                  ></textarea>
                  {errors.content && (
                    <p className="mt-1 text-sm text-red-400 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.content.message}
                    </p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full flex items-center justify-center py-3 rounded-md font-medium transition-colors ${
                      isSubmitting
                        ? 'bg-gray-600 cursor-not-allowed text-gray-300'
                        : 'bg-cyan-500 hover:bg-cyan-600 text-white'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        送信中...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        送信する
                      </>
                    )}
                  </button>
                </div>

                {/* 成功・エラーメッセージ */}
                {submitStatus === 'success' && (
                  <div className="md:col-span-2 p-4 bg-green-900/50 border border-green-500 rounded-lg">
                    <p className="text-green-300 flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      お問い合わせありがとうございます。2営業日以内にご連絡させていただきます。
                    </p>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="md:col-span-2 p-4 bg-red-900/50 border border-red-500 rounded-lg">
                    <p className="text-red-300 flex items-center">
                      <AlertCircle className="w-5 h-5 mr-2" />
                      エラーが発生しました。お手数ですが、メール（info@dp-guild.com）でお問い合わせください。
                    </p>
                  </div>
                )}
              </form>
            </div>
          </div>
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
