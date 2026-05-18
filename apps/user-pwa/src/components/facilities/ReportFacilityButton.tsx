'use client';

import { useState } from 'react';
import ReportFacilityModal from './ReportFacilityModal';

export default function ReportFacilityButton({ facilityId, facilityName }: { facilityId: string; facilityName: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="w-full flex items-center justify-center gap-2 glass border border-white/10 hover:border-white/20 text-white/50 hover:text-white/80 font-medium py-3 px-4 rounded-2xl transition-all text-sm"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></svg>
        情報を報告・タレコミする
      </button>

      <ReportFacilityModal 
        facilityId={facilityId} 
        facilityName={facilityName} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}
