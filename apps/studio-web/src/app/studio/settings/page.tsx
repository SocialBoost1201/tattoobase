'use client';

import { useState } from 'react';
import { Save, Building2, MapPin, Receipt, Shield, Map } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');

  const inputClass = "w-full bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-brand-400 focus:ring-2 focus:ring-brand-100 rounded-lg px-4 py-2.5 text-sm outline-none transition-all";
  const labelClass = "block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wide";

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Settings</h1>
          <p className="text-sm text-neutral-500 mt-1">スタジオの基本情報、決済設定、運用ルールの管理</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-2 bg-neutral-900 text-white text-sm font-bold rounded-lg hover:bg-black transition-colors shadow-sm">
          <Save className="w-4 h-4" /> Save Changes
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* 左側：設定ナビゲーションメニュー */}
        <nav className="w-full md:w-56 flex flex-col gap-1 shrink-0">
          <button 
            onClick={() => setActiveTab('general')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors
              ${activeTab === 'general' ? 'bg-white shadow-sm border border-neutral-200 text-brand-600' : 'text-neutral-600 hover:bg-neutral-100'}`}
          >
            <Building2 className="w-4 h-4" /> Studio Profile
          </button>
          <button 
            onClick={() => setActiveTab('location')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors
              ${activeTab === 'location' ? 'bg-white shadow-sm border border-neutral-200 text-brand-600' : 'text-neutral-600 hover:bg-neutral-100'}`}
          >
            <MapPin className="w-4 h-4" /> Location
          </button>
          <button 
            onClick={() => setActiveTab('billing')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors
              ${activeTab === 'billing' ? 'bg-white shadow-sm border border-neutral-200 text-brand-600' : 'text-neutral-600 hover:bg-neutral-100'}`}
          >
            <Receipt className="w-4 h-4" /> Billing & Deposit
          </button>
          <button 
            onClick={() => setActiveTab('policy')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors
              ${activeTab === 'policy' ? 'bg-white shadow-sm border border-neutral-200 text-brand-600' : 'text-neutral-600 hover:bg-neutral-100'}`}
          >
            <Shield className="w-4 h-4" /> Tattoo Policy
          </button>
        </nav>

        {/* 右側：設定フォーム本体 */}
        <div className="flex-1 w-full space-y-6">
          
          {activeTab === 'general' && (
            <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-neutral-100 bg-neutral-50/50">
                <h2 className="text-base font-bold text-neutral-900">General Information</h2>
                <p className="text-xs text-neutral-500 mt-1">ユーザーPWAに表示される基本情報です</p>
              </div>
              <div className="p-6 space-y-5">
                <div>
                  <label className={labelClass}>Studio Name</label>
                  <input type="text" defaultValue="Demo Tattoo Studio" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Description / About Us</label>
                  <textarea rows={4} defaultValue="東京を拠点とするタトゥースタジオです。和彫りからワンポイントまで幅広いジャンルに対応します。" className={inputClass} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>Public Email</label>
                    <input type="email" defaultValue="contact@example.com" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Phone Number</label>
                    <input type="tel" defaultValue="03-1234-5678" className={inputClass} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'location' && (
            <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-neutral-100 bg-neutral-50/50">
                <h2 className="text-base font-bold text-neutral-900">Location Settings</h2>
                <p className="text-xs text-neutral-500 mt-1">スタジオの住所・エリア情報を設定します</p>
              </div>
              <div className="p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClass}>Prefecture</label>
                    <select className={inputClass} defaultValue="東京都">
                      <option value="東京都">東京都</option>
                      <option value="神奈川県">神奈川県</option>
                      <option value="大阪府">大阪府</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>City</label>
                    <input type="text" defaultValue="渋谷区" className={inputClass} />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Address Line</label>
                  <input type="text" defaultValue="神南1-2-3 XXビル 4F" className={inputClass} />
                </div>
                <div className="pt-4 border-t border-neutral-100">
                  <div className="bg-neutral-100 rounded-lg aspect-21/9 flex items-center justify-center text-neutral-400">
                     <Map className="w-8 h-8 opacity-50" />
                     <span className="ml-2 font-bold text-sm opacity-50">Map Preview (Mock)</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {(activeTab === 'billing' || activeTab === 'policy') && (
            <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden p-12 text-center">
               <Shield className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
               <h3 className="font-bold text-neutral-900 text-lg">Coming in next update</h3>
               <p className="text-neutral-500 text-sm mt-2">こちらの設定項目は現在準備中です。</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
