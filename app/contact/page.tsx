'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Calendar, Send, Loader2, CheckCircle, AlertCircle, MapPin } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactSchema, type ContactFormData } from '@/lib/contact-schema';

export default function ContactPage() {
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

  const contactMethods = [
    {
      icon: Mail,
      title: "メールで相談",
      description: "24時間受付中",
      detail: "info@dp-guild.com",
      href: "mailto:info@dp-guild.com"
    },
    {
      icon: Calendar,
      title: "相談を予約",
      description: "30分無料相談",
      detail: "予約カレンダーへ",
      href: "https://timerex.net/s/info_f990_429a/709e9191"
    }
  ];

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
            <a
              href="https://timerex.net/s/info_f990_429a/709e9191"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center px-5 py-2 bg-cyan-500 text-white rounded-md font-medium hover:bg-cyan-600 transition-colors"
            >
              無料相談
            </a>
            <button className="md:hidden text-[#7F7F7F]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

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
              お問い合わせ
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              あなたのビジネス課題に合わせた最適なマーケティング戦略をご提案します。
              まずはお気軽にご相談ください。
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-4">お問い合わせ方法</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              お客様のご都合に合わせた方法でご連絡ください
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {contactMethods.map((method, index) => {
              const Icon = method.icon;
              return (
                <motion.a
                  key={index}
                  href={method.href}
                  className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="relative">
                    <div className="w-16 h-16 bg-[#F8FAFC] rounded-xl flex items-center justify-center mb-6 group-hover:bg-cyan-50 transition-colors">
                      <Icon className="w-8 h-8 text-[#0F172A] group-hover:text-cyan-600 transition-colors" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#0F172A] mb-2">{method.title}</h3>
                    <p className="text-gray-600 mb-4">{method.description}</p>
                    <div className="text-lg font-bold text-cyan-600">
                      {method.detail}
                    </div>
                  </div>
                </motion.a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="form" className="py-20 bg-[#F8FAFC]">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-4">お問い合わせフォーム</h2>
              <p className="text-xl text-gray-600">
                以下のフォームよりお気軽にお問い合わせください
              </p>
            </div>

            <div className="bg-white p-8 md:p-12 rounded-2xl shadow-lg">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    お名前 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('name')}
                    className={`w-full px-4 py-3 rounded-md border ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                    placeholder="山田 太郎"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    メールアドレス <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    {...register('email')}
                    className={`w-full px-4 py-3 rounded-md border ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                    placeholder="yamada@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    会社名
                  </label>
                  <input
                    type="text"
                    {...register('company')}
                    className={`w-full px-4 py-3 rounded-md border ${
                      errors.company ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                    placeholder="株式会社サンプル"
                  />
                  {errors.company && (
                    <p className="mt-1 text-sm text-red-500 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.company.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ご相談内容 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    {...register('content')}
                    rows={6}
                    className={`w-full px-4 py-3 rounded-md border ${
                      errors.content ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-cyan-500`}
                    placeholder="お問い合わせ内容をご記入ください"
                  ></textarea>
                  {errors.content && (
                    <p className="mt-1 text-sm text-red-500 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.content.message}
                    </p>
                  )}
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full flex items-center justify-center py-4 rounded-md font-medium text-lg transition-colors ${
                      isSubmitting
                        ? 'bg-gray-400 cursor-not-allowed text-gray-200'
                        : 'bg-cyan-500 hover:bg-cyan-600 text-white'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                        送信中...
                      </>
                    ) : (
                      <>
                        <Send className="w-6 h-6 mr-2" />
                        送信する
                      </>
                    )}
                  </button>
                </div>

                {/* 成功・エラーメッセージ */}
                {submitStatus === 'success' && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-700 flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      お問い合わせありがとうございます。2営業日以内にご連絡させていただきます。
                    </p>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 flex items-center">
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

      {/* Company Info */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-4">会社情報</h2>
            </div>

            <div className="bg-[#F8FAFC] rounded-2xl p-8 md:p-12">
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mr-4 flex-shrink-0 border border-gray-200">
                    <MapPin className="w-6 h-6 text-[#0F172A]" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-1">所在地</div>
                    <div className="text-lg text-[#0F172A] font-medium">〒520-3333 滋賀県甲賀市甲南町希望ケ丘3丁目12-9</div>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mr-4 flex-shrink-0 border border-gray-200">
                    <Mail className="w-6 h-6 text-[#0F172A]" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-1">メール</div>
                    <div className="text-lg text-[#0F172A] font-medium">info@dp-guild.com</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
