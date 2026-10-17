// サービスページのデータ。器は components/service/ServicePage.tsx の1枚だけ。
// ページを増やすときは lib/services/<slug>.ts を1ファイル足して、下の一覧に1行足す。
// 決定・出典・公開の条件の記録は、リポジトリの外（~/Projects/HP_DP-GUILD/サービスページの決定メモ.md）に置く
import type { Service } from './types';
import { service as snsManagement } from './sns-management';
import { service as snsManagementRecruit } from './sns-management-recruit';
import { service as website } from './website';
import { service as landingPage } from './landing-page';
import { service as onlineStore } from './online-store';
import { service as mobileApp } from './mobile-app';
import { service as businessSystem } from './business-system';

export type * from './types';

// 7本（2026-10-01 代表決定）。Instagram初期構築は単体ページをやめ、sns-management／sns-management-recruit の「立ち上げだけ」プランに統合した
const list: Service[] = [
  snsManagement,
  snsManagementRecruit,
  website,
  landingPage,
  onlineStore,
  mobileApp,
  businessSystem,
];

// 文字数の上限（開発中だけ確かめる。超えると低い画面で送信ボタンが下に押し出される・FVの行が増える）
const LIMITS = { pitchTitle: 20, pitchItems: 5, pitchItem: 30, factUnit: 12 };
if (process.env.NODE_ENV !== 'production') {
  for (const s of list) {
    const warn = (m: string) => console.warn(`[services/${s.slug}] ${m}`);
    if (s.docPitch.title.length > LIMITS.pitchTitle)
      warn(`docPitch.title が${LIMITS.pitchTitle}字を超えています（${s.docPitch.title.length}字）`);
    if (s.docPitch.items.length > LIMITS.pitchItems)
      warn(`docPitch.items が${LIMITS.pitchItems}個を超えています（${s.docPitch.items.length}個）`);
    s.docPitch.items.forEach((x) => {
      if (x.length > LIMITS.pitchItem) warn(`docPitch.items の1項目が${LIMITS.pitchItem}字を超えています：${x}`);
    });
    s.facts.forEach((f) => {
      if (f.unit.length > LIMITS.factUnit) warn(`facts「${f.k}」の unit が${LIMITS.factUnit}字を超えています（${f.unit.length}字）`);
    });
  }
}

export const services: Record<string, Service> = Object.fromEntries(list.map((s) => [s.slug, s]));

export const serviceSlugs = list.map((s) => s.slug);

export function getService(slug: string): Service | undefined {
  return services[slug];
}
