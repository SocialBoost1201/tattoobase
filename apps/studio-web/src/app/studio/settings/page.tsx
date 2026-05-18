"use client";

import React, { useState } from "react";

const PAYMENT_PROVIDERS = [
  { value: "stripe", label: "Stripe", desc: "グローバル決済リーダー" },
  { value: "payjp", label: "Pay.jp", desc: "日本向け決済" },
  { value: "square", label: "Square", desc: "POS & オンライン対応" },
  { value: "link", label: "Link by Stripe", desc: "ワンクリック決済" },
  { value: "stera", label: "Stera", desc: "国内多機能決済端末" },
];

export default function SettingsPage() {
  const [studioName, setStudioName] = useState("Tokyo Ink Studio");
  const [description, setDescription] = useState(
    "東京・渋谷のプロフェッショナルタトゥースタジオ。ジャパニーズスタイルからウォーターカラーまで幅広く対応します。"
  );
  const [address, setAddress] = useState("東京都渋谷区神南1-1-1 タトゥービル3F");
  const [phone, setPhone] = useState("03-1234-5678");
  const [email, setEmail] = useState("info@tokyo-ink-studio.jp");
  const [paymentProvider, setPaymentProvider] = useState("stripe");
  const [requiresDeposit, setRequiresDeposit] = useState(true);
  const [depositAmount, setDepositAmount] = useState("10000");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto pb-24 md:pb-8">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-1">設定</h1>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.875rem" }}>
          スタジオプロフィールと支払い設定
        </p>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-6">

        {/* Studio profile section */}
        <section className="glass p-6">
          <h2
            className="text-base font-bold text-white mb-5 pb-3"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
          >
            スタジオプロフィール
          </h2>

          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: "rgba(255,255,255,0.6)" }}>
                スタジオ名
              </label>
              <input
                className="input-glass"
                value={studioName}
                onChange={(e) => setStudioName(e.target.value)}
                placeholder="スタジオ名を入力"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: "rgba(255,255,255,0.6)" }}>
                スタジオ説明
              </label>
              <textarea
                className="input-glass resize-none"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="スタジオの説明を入力"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: "rgba(255,255,255,0.6)" }}>
                住所
              </label>
              <input
                className="input-glass"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="住所を入力"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: "rgba(255,255,255,0.6)" }}>
                  電話番号
                </label>
                <input
                  className="input-glass"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="03-XXXX-XXXX"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: "rgba(255,255,255,0.6)" }}>
                  メールアドレス
                </label>
                <input
                  className="input-glass"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="info@studio.jp"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Payment section */}
        <section className="glass p-6">
          <h2
            className="text-base font-bold text-white mb-5 pb-3"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
          >
            決済設定
          </h2>

          <div className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-semibold mb-3" style={{ color: "rgba(255,255,255,0.6)" }}>
                デフォルト決済プロバイダー
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {PAYMENT_PROVIDERS.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setPaymentProvider(p.value)}
                    className="flex items-center gap-3 p-3 rounded-xl text-left transition-all"
                    style={{
                      background: paymentProvider === p.value
                        ? "rgba(99,102,241,0.15)"
                        : "rgba(255,255,255,0.04)",
                      border: paymentProvider === p.value
                        ? "1px solid rgba(99,102,241,0.4)"
                        : "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0"
                      style={{
                        background: paymentProvider === p.value
                          ? "rgba(99,102,241,0.3)"
                          : "rgba(255,255,255,0.07)",
                        color: paymentProvider === p.value ? "#a5b4fc" : "rgba(255,255,255,0.5)",
                      }}
                    >
                      {p.label.charAt(0)}
                    </div>
                    <div>
                      <div
                        className="text-sm font-semibold"
                        style={{ color: paymentProvider === p.value ? "#ffffff" : "rgba(255,255,255,0.7)" }}
                      >
                        {p.label}
                      </div>
                      <div className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
                        {p.desc}
                      </div>
                    </div>
                    {paymentProvider === p.value && (
                      <svg
                        className="w-4 h-4 ml-auto flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        style={{ color: "#818cf8" }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Deposit section */}
        <section className="glass p-6">
          <h2
            className="text-base font-bold text-white mb-5 pb-3"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
          >
            デポジット設定
          </h2>

          <div className="flex flex-col gap-4">
            {/* Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-white mb-0.5">デポジットを必須にする</div>
                <div className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
                  予約時にデポジットの支払いを求めます
                </div>
              </div>
              <button
                type="button"
                onClick={() => setRequiresDeposit((v) => !v)}
                className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0"
                style={{
                  background: requiresDeposit
                    ? "rgba(99,102,241,0.8)"
                    : "rgba(255,255,255,0.12)",
                }}
                role="switch"
                aria-checked={requiresDeposit}
              >
                <span
                  className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow"
                  style={{
                    transform: requiresDeposit ? "translateX(1.375rem)" : "translateX(0.25rem)",
                  }}
                />
              </button>
            </div>

            {/* Deposit amount */}
            {requiresDeposit && (
              <div className="animate-slide-up">
                <label className="block text-sm font-semibold mb-2" style={{ color: "rgba(255,255,255,0.6)" }}>
                  デポジット金額 (円)
                </label>
                <div className="relative">
                  <span
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold"
                    style={{ color: "rgba(255,255,255,0.4)" }}
                  >
                    ¥
                  </span>
                  <input
                    className="input-glass pl-8"
                    type="number"
                    min="0"
                    step="1000"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    placeholder="10000"
                  />
                </div>
                <p className="mt-1.5 text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
                  予約確定時にこの金額が顧客に請求されます
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Save button */}
        <div className="flex items-center justify-end gap-4">
          {saved && (
            <span className="text-sm font-semibold animate-fade-in" style={{ color: "#34d399" }}>
              ✓ 設定を保存しました
            </span>
          )}
          <button type="submit" className="btn-primary px-8">
            保存する
          </button>
        </div>
      </form>
    </div>
  );
}
