"use client";

export default function StudioHeader() {
  return (
    <header
      className="h-16 sticky top-0 z-30 flex items-center px-6 md:px-8 gap-4"
      style={{
        background: "rgba(10, 15, 30, 0.75)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      {/* Mobile logo */}
      <div className="md:hidden flex items-center gap-2">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-xs"
          style={{ background: "linear-gradient(135deg, #6366f1, #4f46e5)" }}
        >
          T
        </div>
        <span className="text-white font-bold text-sm" style={{ fontFamily: "var(--font-heading)" }}>
          TattooBase
        </span>
      </div>

      {/* Studio name (desktop) */}
      <div className="hidden md:block">
        <span className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.5)" }}>
          Tokyo Ink Studio
        </span>
      </div>

      <div className="ml-auto flex items-center gap-3">
        {/* Notification bell */}
        <button
          className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
          aria-label="通知"
        >
          <svg
            className="w-5 h-5"
            style={{ color: "rgba(255,255,255,0.7)" }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
            />
          </svg>
          {/* Badge */}
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
            style={{ background: "#f43f5e" }}
          />
        </button>

        {/* Avatar */}
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white cursor-pointer transition-opacity hover:opacity-80"
          style={{
            background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
          }}
        >
          TI
        </div>
      </div>
    </header>
  );
}
