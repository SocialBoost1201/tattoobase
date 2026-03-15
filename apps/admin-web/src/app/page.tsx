import React from "react";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen flex bg-dark-900 text-dark-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-dark-950 border-r border-dark-800 hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-dark-800">
          <span className="font-heading font-bold text-lg text-brand-500">TattooBase Admin</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1">
          <a href="#" className="flex items-center gap-3 px-3 py-2 bg-dark-800/50 text-brand-400 rounded-lg">
            Platform Overview
          </a>
          <a href="/admin/studios" className="flex items-center gap-3 px-3 py-2 text-dark-400 hover:text-white hover:bg-dark-800/50 rounded-lg transition-colors">
            Studios & Verification
          </a>
          <a href="/admin/facilities" className="flex items-center gap-3 px-3 py-2 text-dark-400 hover:text-white hover:bg-dark-800/50 rounded-lg transition-colors">
            Tattoo-Friendly Facilities
          </a>
          <a href="/facilities/reports" className="flex items-center gap-3 px-3 py-2 text-dark-400 hover:text-white hover:bg-dark-800/50 rounded-lg transition-colors flex justify-between">
            <span>UGC Reports</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 text-dark-400 hover:text-white hover:bg-dark-800/50 rounded-lg transition-colors flex justify-between">
            <span>KYC Review Queue</span>
            <span className="bg-red-500/20 text-red-400 text-[10px] font-bold px-2 py-0.5 rounded-full">12</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 text-dark-400 hover:text-white hover:bg-dark-800/50 rounded-lg transition-colors">
            Financials & Payouts
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2 text-dark-400 hover:text-white hover:bg-dark-800/50 rounded-lg transition-colors">
            Audit Logs
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <header className="h-16 border-b border-dark-800 flex items-center px-8 bg-dark-950/50 backdrop-blur-sm sticky top-0 z-10">
          <h1 className="text-xl font-bold">System Health & Metrics</h1>
          <div className="ml-auto flex items-center gap-4">
            <span className="text-sm text-dark-300">Super Admin</span>
            <div className="w-8 h-8 rounded-full bg-dark-700 border border-dark-600"></div>
          </div>
        </header>

        <div className="p-8 flex-1 overflow-auto animate-fade-in space-y-8">

          {/* Headline Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-dark-800/50 border border-dark-700 p-5 rounded-lg">
              <h3 className="text-xs text-dark-400 font-semibold uppercase mb-1">Total GMV (Month)</h3>
              <div className="text-2xl font-bold text-white">¥12,450,000</div>
              <div className="mt-2 text-xs text-green-400">↑ 14% vs last month</div>
            </div>
            <div className="bg-dark-800/50 border border-dark-700 p-5 rounded-lg">
              <h3 className="text-xs text-dark-400 font-semibold uppercase mb-1">Active Studios</h3>
              <div className="text-2xl font-bold text-white">124</div>
              <div className="mt-2 text-xs text-green-400">↑ 3 new onboarding</div>
            </div>
            <div className="bg-dark-800/50 border border-dark-700 p-5 rounded-lg">
              <h3 className="text-xs text-dark-400 font-semibold uppercase mb-1">Stripe Webhooks</h3>
              <div className="text-2xl font-bold text-white">100%</div>
              <div className="mt-2 text-xs text-green-400">0 locked/failed events</div>
            </div>
            <div className="bg-dark-800/50 border border-red-900/30 p-5 rounded-lg">
              <h3 className="text-xs text-red-400 font-semibold uppercase mb-1">Action Required</h3>
              <div className="text-2xl font-bold text-white">12</div>
              <div className="mt-2 text-xs text-red-400">Pending KYC documents</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Urgent Tasks */}
            <div className="bg-dark-800/30 border border-dark-700 rounded-lg flex flex-col">
              <div className="px-6 py-4 border-b border-dark-700">
                <h2 className="font-bold text-lg">KYC Review Queue</h2>
              </div>
              <div className="flex-1 p-0 overflow-auto max-h-80">
                <table className="w-full text-left text-sm">
                  <thead className="bg-dark-800/50 text-dark-400 sticky top-0">
                    <tr>
                      <th className="px-6 py-3 font-semibold">User</th>
                      <th className="px-6 py-3 font-semibold">Submitted</th>
                      <th className="px-6 py-3 font-semibold">Type</th>
                      <th className="px-6 py-3 font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-700">
                    {[
                      { user: 'u_8f72a...', date: '10m ago', type: 'Passport' },
                      { user: 'u_92bc4...', date: '1h ago', type: 'Driver License' },
                      { user: 'u_112df...', date: '3h ago', type: 'National ID' }
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-dark-800/50 transition-colors">
                        <td className="px-6 py-4 font-mono text-xs text-dark-300">{row.user}</td>
                        <td className="px-6 py-4 text-dark-200">{row.date}</td>
                        <td className="px-6 py-4 text-dark-200">{row.type}</td>
                        <td className="px-6 py-4">
                          <button className="text-brand-500 hover:text-brand-300 font-semibold">Review</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* System Logs */}
            <div className="bg-dark-800/30 border border-dark-700 rounded-lg flex flex-col">
              <div className="px-6 py-4 border-b border-dark-700">
                <h2 className="font-bold text-lg">Recent Audit Logs</h2>
              </div>
              <div className="flex-1 p-4 space-y-3 max-h-80 overflow-auto">
                {[
                  { actor: 'StripeWebhook', action: 'STATE_CHANGED_TO_CONFIRMED', target: 'Booking b_123', time: 'Just now' },
                  { actor: 'System', action: 'PAYMENT_CREATED', target: 'Payment pi_39f', time: 'Just now' },
                  { actor: 'Admin_Super', action: 'STUDIO_VERIFIED', target: 'Studio s_99a', time: '2 hrs ago' },
                  { actor: 'User_44', action: 'CONSENT_SIGNED', target: 'Document d_22b', time: '5 hrs ago' }
                ].map((log, i) => (
                  <div key={i} className="flex gap-4 p-3 rounded bg-dark-900/50 border border-dark-800 font-mono text-xs">
                    <div className="text-dark-400 w-16">{log.time}</div>
                    <div className="flex-1">
                      <span className="text-brand-400 font-semibold">{log.action}</span>
                      <span className="text-dark-300 mx-2">on</span>
                      <span className="text-white">{log.target}</span>
                    </div>
                    <div className="text-dark-400">by {log.actor}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
