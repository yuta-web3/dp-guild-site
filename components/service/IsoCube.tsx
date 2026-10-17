// ロゴの不可能立体。トップページ（components/top/TopPage.tsx）と同じ図形・同じ描き順。
// 線が1本ずつ引かれて組み上がる（CSSだけ。pathLength=1 で長さを固定し、JSを待たない）。
// 広い画面ではスクロールで面ごとに分解して飛んでいく（動きは ServicePage 側）。
// 飾りなので読み上げない。

export default function IsoCube() {
  return (
    <div className="cubewrap" aria-hidden="true">
      <svg className="cube" viewBox="0 0 500 530">
        <defs>
          <linearGradient id="svcCubeG" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#0FBFB0" />
            <stop offset="42%" stopColor="#3560E0" />
            <stop offset="74%" stopColor="#7A45E8" />
            <stop offset="100%" stopColor="#C267F0" />
          </linearGradient>
        </defs>
        <g className="face" data-fx="0" data-fy="-1">
          <path pathLength={1} className="draw d1" d="M250 60 L423.2 160 L250 260 L76.8 160 Z" />
          <path pathLength={1} className="draw d4 thin" d="M250 102 L350.5 160 L250 218 L149.5 160 Z" />
        </g>
        <g className="face" data-fx="-0.87" data-fy="0.5">
          <path pathLength={1} className="draw d2" d="M76.8 160 L250 260 L250 460 L76.8 360 Z" />
          <path pathLength={1} className="draw d5 thin" d="M113.2 223 L213.6 281 L213.6 397 L113.2 339 Z" />
        </g>
        <g className="face" data-fx="0.87" data-fy="0.5">
          <path pathLength={1} className="draw d3" d="M250 260 L423.2 160 L423.2 360 L250 460 Z" />
          <path pathLength={1} className="draw d6 thin" d="M286.4 281 L386.8 223 L386.8 339 L286.4 397 Z" />
        </g>
        <g className="face" data-fx="0" data-fy="1.4">
          <path className="hide" d="M250 218 L250 302" />
          <path pathLength={1} className="draw d7 thin" d="M250 218 L250 302" />
          <path className="hide" d="M213.6 281 L250 302 L286.4 281" />
          <path pathLength={1} className="draw d8 thin" d="M213.6 281 L250 302 L286.4 281" />
        </g>
        <g className="face" data-fx="0" data-fy="-1">
          <path className="hide" d="M330 172 L250 218 L170 172" />
          <path pathLength={1} className="draw d9 thin" d="M330 172 L250 218 L170 172" />
        </g>
      </svg>
    </div>
  );
}
