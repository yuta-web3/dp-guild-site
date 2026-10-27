'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SiteHeader from '@/components/SiteHeader';
import { SiteFooterNav, useServiceNav } from '@/components/SiteNav';
import { company } from '@/lib/top-cases';
import { markFormStart, markLead } from '@/lib/clarity';

// お問い合わせ。フォームだけの簡単なページ。
// 送信先は /api/contact。必須は連絡先だけ。用件は選ぶだけ・内容は任意（打たなくても送れる）
export default function ContactClient() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  // 用件はサービスの一覧から選ぶ（複数可）。打たなくても伝わるようにする
  const topics = [...useServiceNav().map((s) => s.label), 'まだ決まっていない・その他'];
  const [picked, setPicked] = useState<string[]>([]);
  const toggle = (t: string) => setPicked((p) => (p.includes(t) ? p.filter((x) => x !== t) : [...p, t]));

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
    honeypot: '',
    timestamp: 0,
  });

  useEffect(() => {
    setFormData((prev) => ({ ...prev, timestamp: Date.now() }));
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.company.trim()) newErrors.company = '会社名を入れてください（個人事業の方は、屋号またはお名前で大丈夫です）';
    if (!formData.name.trim()) newErrors.name = 'お名前を入れてください';
    if (!formData.email.trim()) {
      newErrors.email = 'メールアドレスを入れてください';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'メールアドレスの形を確かめてください';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || !validateForm()) return;
    setIsSubmitting(true);
    setSubmitError(false);

    const content = [
      picked.length ? `【ご用件】${picked.join('／')}` : '',
      formData.message.trim() ? `【ご相談内容】\n${formData.message.trim()}` : '',
    ]
      .filter(Boolean)
      .join('\n\n');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          company: formData.company,
          content,
          honeypot: formData.honeypot,
          timestamp: formData.timestamp,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'エラーが発生しました');
      markLead('contact');
      router.push('/contact/thanks');
    } catch (error) {
      console.error('Submit error:', error);
      setSubmitError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  return (
    <div className="lp contact">
      <SiteHeader here="お問い合わせ" />

      <div className="shell">
        <main className="body">
          <h1 className="ttl">お問い合わせ</h1>
          <p className="guide">1営業日以内に、メールでご連絡します。</p>

          <form className="card" onSubmit={handleSubmit} onFocus={() => markFormStart('contact')} noValidate>
            <div className="bd">
              <input
                type="text"
                name="honeypot"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="hp"
                value={formData.honeypot}
                onChange={handleChange}
              />
              <div className="fld">
                <label htmlFor="ct-company">
                  会社名 <span className="rq">必須</span>
                </label>
                <input id="ct-company" name="company" type="text" autoComplete="organization" placeholder="株式会社◯◯" value={formData.company} onChange={handleChange} />
                <p className="hint">個人事業の方は、屋号またはお名前で大丈夫です。</p>
                {errors.company && <p className="err">{errors.company}</p>}
              </div>
              <div className="fld">
                <label htmlFor="ct-name">
                  お名前 <span className="rq">必須</span>
                </label>
                <input id="ct-name" name="name" type="text" autoComplete="name" placeholder="山田 太郎" value={formData.name} onChange={handleChange} />
                {errors.name && <p className="err">{errors.name}</p>}
              </div>
              <div className="fld">
                <label htmlFor="ct-email">
                  メールアドレス <span className="rq">必須</span>
                </label>
                <input id="ct-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} />
                {errors.email && <p className="err">{errors.email}</p>}
              </div>
              <div className="fld">
                <span className="lbl">
                  ご用件 <span className="op">任意・いくつでも</span>
                </span>
                <div className="chips" role="group" aria-label="ご用件">
                  {topics.map((t) => (
                    <button
                      key={t}
                      type="button"
                      className="chip"
                      aria-pressed={picked.includes(t)}
                      onClick={() => toggle(t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="fld">
                <label htmlFor="ct-message">
                  ご相談内容 <span className="op">任意</span>
                </label>
                <textarea
                  id="ct-message"
                  name="message"
                  rows={4}
                  placeholder="一言でも大丈夫です"
                  value={formData.message}
                  onChange={handleChange}
                />
              </div>

              <button className="sub" type="submit" disabled={isSubmitting}>
                <span>{isSubmitting ? '送信中…' : '送信する'}</span>
              </button>
              {submitError && (
                <p className="err">
                  送れませんでした。お手数ですが、メール（{company.email}）でお送りください。
                </p>
              )}
              <p className="fnote">
                ご入力の内容は、ご相談への返信にのみ使います。メールでも受け付けています（
                <a href={`mailto:${company.email}`}>{company.email}</a>）。
              </p>
            </div>
          </form>
        </main>
      </div>

      <footer className="lpfoot">
        <div className="inner">
          <div className="co">
            <b>{company.name}</b>
            <span>
              {company.zip} {company.address}
            </span>
            <span>
              <a href={`mailto:${company.email}`}>{company.email}</a>
            </span>
          </div>
          <SiteFooterNav />
          <p className="cp">&copy; 2026 DP-GUILD. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
