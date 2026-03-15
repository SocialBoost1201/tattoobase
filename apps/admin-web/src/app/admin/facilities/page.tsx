'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type Facility = {
  id: string;
  name: string;
  slug: string;
  type: string;
  acceptanceLevel: string;
  tattooPolicy: string;
};

export default function AdminFacilitiesPage() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    type: 'ONSEN',
    acceptanceLevel: 'UNKNOWN',
    description: '',
    prefecture: '',
    city: '',
    address: '',
    tattooPolicy: '',
    websiteUrl: '',
    mediaUrl: ''
  });

  const fetchFacilities = async () => {
    try {
      const res = await fetch('http://localhost:3001/admin-api/facilities');
      if (res.ok) {
        const data = await res.json();
        setFacilities(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacilities();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      mediaUrls: formData.mediaUrl ? [formData.mediaUrl] : []
    };
    
    try {
      const res = await fetch('http://localhost:3001/admin-api/facilities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setFormData({
            name: '', slug: '', type: 'ONSEN', acceptanceLevel: 'UNKNOWN', description: '',
            prefecture: '', city: '', address: '', tattooPolicy: '',
            websiteUrl: '', mediaUrl: ''
        });
        fetchFacilities();
        alert('施設を追加しました');
      } else {
        alert('追加に失敗しました');
      }
    } catch (e) {
      alert('エラーが発生しました');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('本当に削除しますか？')) return;
    try {
      const res = await fetch(`http://localhost:3001/admin-api/facilities/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchFacilities();
      } else {
        alert('削除に失敗しました');
      }
    } catch (e) {
      alert('エラーが発生しました');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin: Facilities Management</h1>
          <Link href="/" className="text-blue-600 hover:underline text-sm">Dashboardへ戻る</Link>
        </div>

        {/* 施設追加フォーム */}
        <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">新規施設を追加</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold mb-1">施設名 *</label>
              <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border p-2 rounded text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">スラッグ (URL用) *</label>
              <input required value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full border p-2 rounded text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">カテゴリ</label>
              <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full border p-2 rounded text-sm bg-white">
                <option value="ONSEN">温泉</option>
                <option value="SENTO">銭湯</option>
                <option value="GYM">ジム・プール</option>
                <option value="HOTEL">ホテル・旅館</option>
                <option value="BEACH">海水浴場</option>
                <option value="OTHER">その他</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">受け入れレベル *</label>
              <select value={formData.acceptanceLevel} onChange={e => setFormData({...formData, acceptanceLevel: e.target.value})} className="w-full border p-2 rounded text-sm bg-white">
                <option value="UNKNOWN">不明・要確認</option>
                <option value="ALLOWED">全面許可</option>
                <option value="COVERED_ONLY">シール等で隠せば許可</option>
                <option value="PARTIAL_ONLY">ワンポイント等一部のみ可</option>
                <option value="BANNED">一切禁止 (入館不可等)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">タトゥーポリシー *</label>
              <input required value={formData.tattooPolicy} onChange={e => setFormData({...formData, tattooPolicy: e.target.value})} className="w-full border p-2 rounded text-sm" placeholder="シールなら可、全面OK等" />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">都道府県</label>
              <input value={formData.prefecture} onChange={e => setFormData({...formData, prefecture: e.target.value})} className="w-full border p-2 rounded text-sm" />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1">市区町村</label>
              <input value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full border p-2 rounded text-sm" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold mb-1">説明文</label>
              <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border p-2 rounded text-sm h-20" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold mb-1">画像URL</label>
              <input value={formData.mediaUrl} onChange={e => setFormData({...formData, mediaUrl: e.target.value})} className="w-full border p-2 rounded text-sm" placeholder="https://..." />
            </div>
            <div className="md:col-span-2 mt-2">
              <button type="submit" className="bg-[#0a0a0a] text-white px-6 py-2 rounded text-sm font-bold hover:bg-gray-800 transition">
                施設を追加
              </button>
            </div>
          </form>
        </section>

        {/* 登録済み施設一覧 */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">登録済み施設 ({facilities.length})</h2>
          </div>
          {loading ? (
            <div className="p-8 text-center text-gray-500">読み込み中...</div>
          ) : (
            <div className="overflow-x-auto">
              {facilities.length > 0 ? (
                <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 font-semibold text-gray-700">Name / Slug</th>
                      <th className="px-6 py-3 font-semibold text-gray-700">Type</th>
                      <th className="px-6 py-3 font-semibold text-gray-700">Level</th>
                      <th className="px-6 py-3 font-semibold text-gray-700">Policy</th>
                      <th className="px-6 py-3 font-semibold text-gray-700 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {facilities.map(f => (
                      <tr key={f.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4">
                          <p className="font-bold text-gray-900">{f.name}</p>
                          <p className="text-xs text-gray-500">{f.slug}</p>
                        </td>
                        <td className="px-6 py-4 text-gray-700">{f.type}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                            f.acceptanceLevel === 'ALLOWED' ? 'bg-green-100 text-green-800' :
                            f.acceptanceLevel === 'COVERED_ONLY' ? 'bg-yellow-100 text-yellow-800' :
                            f.acceptanceLevel === 'PARTIAL_ONLY' ? 'bg-blue-100 text-blue-800' :
                            f.acceptanceLevel === 'BANNED' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {f.acceptanceLevel}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-700 max-w-xs truncate">{f.tattooPolicy}</td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => handleDelete(f.id)} className="text-red-600 hover:underline font-medium ml-4">
                            削除
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-8 text-center text-gray-500">施設はまだ登録されていません</div>
              )}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
