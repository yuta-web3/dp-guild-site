'use client';

import { useState, useEffect } from 'react';
import { Mail, Calendar, Send, Loader2, CheckCircle, AlertCircle, MapPin, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Link from 'next/link';

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // フォームの状態
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    problem: '',      // 困っていること
    currentState: '', // 現状
    question: '',     // 確認したいこと
    honeypot: '',
    timestamp: 0
  });

  useEffect(() => {
    setFormData(prev => ({ ...prev, timestamp: Date.now() }));
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'お名前は必須です';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'メールアドレスは必須です';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '有効なメールアドレスを入力してください';
    }
    if (!formData.problem.trim()) {
      newErrors.problem = '困っていること・気になっていることは必須です';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');

    // 3つの質問を1つのcontentに結合
    const contentParts = [];
    if (formData.problem.trim()) {
      contentParts.push(`【困っていること・気になっていること】\n${formData.problem.trim()}`);
    }
    if (formData.currentState.trim()) {
      contentParts.push(`【現状について】\n${formData.currentState.trim()}`);
    }
    if (formData.question.trim()) {
      contentParts.push(`【相談して確認したいこと】\n${formData.question.trim()}`);
    }
    const content = contentParts.join('\n\n');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          company: formData.company,
          content: content,
          honeypot: formData.honeypot,
          timestamp: formData.timestamp
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'エラーが発生しました');
      }

      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        company: '',
        problem: '',
        currentState: '',
        question: '',
        honeypot: '',
        timestamp: Date.now()
      });

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // エラーをクリア
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="font-sans text-gray-900 bg-white">
      <Header />

      {/* Hero Section */}
      <section className="bg-[#0F172A] pt-32 pb-20 px-5 md:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-6">
            相談する
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-4">
            「何から相談すればいいか分からない」
          </p>
          <p className="text-lg md:text-xl text-white/70">
            それで大丈夫です。
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 md:py-20 px-5 md:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            <a
              href="mailto:info@dp-guild.com"
              className="group bg-[#F8FAFC] rounded-xl p-6 md:p-8 hover:bg-gray-100 transition-colors"
            >
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-4 border border-gray-200">
                <Mail className="w-6 h-6 text-[#0F172A]" />
              </div>
              <h3 className="text-xl font-bold text-[#0F172A] mb-2">メールで相談</h3>
              <p className="text-gray-600 mb-3">24時間受付</p>
              <p className="text-[#0F172A] font-medium group-hover:underline">info@dp-guild.com</p>
            </a>

            <a
              href="https://timerex.net/s/info_f990_429a/709e9191"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-[#F8FAFC] rounded-xl p-6 md:p-8 hover:bg-gray-100 transition-colors"
            >
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-4 border border-gray-200">
                <Calendar className="w-6 h-6 text-[#0F172A]" />
              </div>
              <h3 className="text-xl font-bold text-[#0F172A] mb-2">相談を予約</h3>
              <p className="text-gray-600 mb-3">まず30分、状況を整理します</p>
              <p className="text-[#0F172A] font-medium group-hover:underline flex items-center">
                予約カレンダーへ
                <ArrowRight className="w-4 h-4 ml-1" />
              </p>
            </a>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="form" className="py-16 md:py-20 px-5 md:px-8 bg-[#F8FAFC]">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-[#0F172A] mb-4">状況を教えてください</h2>
            <p className="text-base md:text-lg text-gray-600">
              施策が決まっていなくても大丈夫です。<br className="hidden md:block" />
              現状を聞かせていただき、一緒に整理します。
            </p>
          </div>

          <div className="bg-white p-6 md:p-10 rounded-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* ハニーポット（非表示） */}
              <input
                type="text"
                name="honeypot"
                value={formData.honeypot}
                onChange={handleChange}
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
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-[#0F172A] focus:border-transparent`}
                  placeholder="山田 太郎"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  メールアドレス <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-[#0F172A] focus:border-transparent`}
                  placeholder="yamada@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  会社名・屋号（任意）
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0F172A] focus:border-transparent"
                  placeholder="株式会社サンプル"
                />
              </div>

              <div className="border-t border-gray-200 pt-6">
                <p className="text-sm text-gray-500 mb-6">以下の内容を分かる範囲で教えてください</p>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      今、困っていること・気になっていること <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="problem"
                      value={formData.problem}
                      onChange={handleChange}
                      rows={4}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.problem ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-[#0F172A] focus:border-transparent`}
                      placeholder="例：何から手をつければいいか分からない / SNSをやるべきか迷っている / ホームページを作るべきか判断できない"
                    ></textarea>
                    {errors.problem && (
                      <p className="mt-1 text-sm text-red-500 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.problem}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      現状について（任意）
                    </label>
                    <textarea
                      name="currentState"
                      value={formData.currentState}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0F172A] focus:border-transparent"
                      placeholder="例：ホームページはあるが更新していない / SNSは未着手 / 過去に制作会社に依頼したことがある"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      相談して確認したいこと（任意）
                    </label>
                    <textarea
                      name="question"
                      value={formData.question}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0F172A] focus:border-transparent"
                      placeholder="例：自社に合う施策を知りたい / 優先順位を整理したい / 今やるべきかどうか判断したい"
                    ></textarea>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full flex items-center justify-center py-4 rounded-lg font-medium text-lg transition-colors ${
                    isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed text-gray-200'
                      : 'bg-[#0F172A] hover:bg-[#1e293b] text-white'
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
                      相談内容を送る
                    </>
                  )}
                </button>
              </div>

              {/* 成功メッセージ - 次に何が起きるかを明確に */}
              {submitStatus === 'success' && (
                <div className="p-5 bg-[#F8FAFC] border border-gray-200 rounded-lg">
                  <p className="text-[#0F172A] font-medium mb-3 flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                    ありがとうございます
                  </p>
                  <div className="text-sm text-gray-600 space-y-2 ml-7">
                    <p className="font-medium text-gray-700">2営業日以内に、以下の流れでご連絡します：</p>
                    <ol className="list-decimal list-inside space-y-1 text-gray-600">
                      <li>いただいた内容を整理し、状況を確認します</li>
                      <li>必要に応じて、選択肢をお伝えします</li>
                      <li>「今はやらない」も含め、判断をお手伝いします</li>
                    </ol>
                  </div>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 flex items-start">
                    <AlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                    <span>
                      エラーが発生しました。<br />
                      お手数ですが、メール（info@dp-guild.com）でお問い合わせください。
                    </span>
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Company Info */}
      <section className="py-16 md:py-20 px-5 md:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-[#0F172A] mb-8">会社情報</h2>

          <div className="bg-[#F8FAFC] rounded-xl p-6 md:p-8">
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mr-4 flex-shrink-0 border border-gray-200">
                  <MapPin className="w-5 h-5 text-[#0F172A]" />
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">所在地</div>
                  <div className="text-[#0F172A]">〒520-3333 滋賀県甲賀市甲南町希望ケ丘3丁目12-9</div>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mr-4 flex-shrink-0 border border-gray-200">
                  <Mail className="w-5 h-5 text-[#0F172A]" />
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">メール</div>
                  <div className="text-[#0F172A]">info@dp-guild.com</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
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
