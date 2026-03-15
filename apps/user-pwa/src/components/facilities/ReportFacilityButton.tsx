'use client';

import { useState } from 'react';
import ReportFacilityModal from './ReportFacilityModal';

export default function ReportFacilityButton({ facilityId, facilityName }: { facilityId: string; facilityName: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="w-full flex items-center justify-center gap-2 border border-[#e0e0e0] hover:bg-[#f5f5f5] text-[#3b3b3b] font-medium py-2 px-4 rounded-md transition-colors text-sm"
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
