'use client';

import { useEffect, useState } from 'react';

const API = 'http://localhost:3000';

type Report = {
  id: string;
  facility: {
    name: string;
    type: string;
    acceptanceLevel: string;
  };
  reportedLevel: string;
  evidenceText: string;
  evidenceUrl: string;
  createdAt: string;
};

export default function FacilityReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchReports = async () => {
    try {
      const res = await fetch(`${API}/admin-api/facility-reports/pending`);
      if (!res.ok) throw new Error('タレコミデータの取得に失敗しました');
      const data = await res.json();
      setReports(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleProcess = async (id: string, action: 'APPROVE' | 'REJECT') => {
    if (!window.confirm(`この報告を ${action === 'APPROVE' ? '承認' : '却下'} しますか？`)) return;

    setProcessingId(id);
    try {
      const res = await fetch(`${API}/admin-api/facility-reports/${id}/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });

      if (!res.ok) throw new Error('処理に失敗しました');
      
      // 更新成功したら一覧から削除
      setReports((prev) => prev.filter((r) => r.id !== id));
      alert(`${action === 'APPROVE' ? '承認' : '却下'}しました。`);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setProcessingId(null);
    }
  };

  const getLevelLabel = (level: string) => {
    switch (level) {
      case 'ALLOWED': return '全面許可';
      case 'COVERED_ONLY': return 'シール隠し等で許可';
      case 'PARTIAL_ONLY': return 'ワンポイントのみ可';
      case 'BANNED': return '一切禁止 (入館不可)';
      default: return '不明';
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">施設タレコミ管理</h1>
        <div className="text-sm border border-gray-300 px-3 py-1 rounded bg-white">
          承認待ち: <span className="font-bold text-red-600">{reports.length}</span> 件
        </div>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded mb-6">{error}</div>}

      {loading ? (
        <div className="text-center py-10 text-gray-500">読み込み中...</div>
      ) : reports.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded border border-dashed border-gray-300">
          <p className="text-gray-500">現在、未処理のタレコミ報告はありません。</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reports.map((report) => (
            <div key={report.id} className="bg-white border rounded-lg shadow-sm overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold">{report.facility.name}</h2>
                  <p className="text-sm text-gray-500 flex gap-4 mt-1">
                    <span>申請日時: {new Date(report.createdAt).toLocaleString()}</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 mb-1">現在の登録ステータス</p>
                  <span className="inline-block px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded-sm font-bold">
                    {getLevelLabel(report.facility.acceptanceLevel)}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-gray-500 mb-2 uppercase tracking-wider">申告された受け入れステータス</h3>
                    <div className="text-xl font-bold text-amber-600 mb-6 flex items-center gap-2">
                       {getLevelLabel(report.reportedLevel)}
                    </div>

                    <h3 className="text-sm font-bold text-gray-500 mb-2 uppercase tracking-wider">体験談・目撃情報</h3>
                    <div className="bg-gray-50 p-4 rounded text-gray-800 whitespace-pre-wrap">
                      {report.evidenceText}
                    </div>

                    {report.evidenceUrl && (
                      <div className="mt-4">
                        <h3 className="text-sm font-bold text-gray-500 mb-2 uppercase tracking-wider">参考URL</h3>
                        <a href={report.evidenceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
                          {report.evidenceUrl}
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="w-full md:w-64 flex flex-col justify-center gap-3 border-t md:border-t-0 md:border-l pt-6 md:pt-0 md:pl-6">
                    <button
                      onClick={() => handleProcess(report.id, 'APPROVE')}
                      disabled={processingId === report.id}
                      className="w-full bg-black text-white py-3 rounded font-bold hover:bg-gray-800 disabled:opacity-50 transition-colors"
                    >
                      {processingId === report.id ? '処理中...' : '承認して反映する'}
                    </button>
                    <button
                      onClick={() => handleProcess(report.id, 'REJECT')}
                      disabled={processingId === report.id}
                      className="w-full bg-white border border-gray-300 text-red-600 py-3 rounded font-bold hover:bg-red-50 disabled:opacity-50 transition-colors"
                    >
                      却下する
                    </button>
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      「承認」すると、施設のステータスが直ちに更新されます。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
