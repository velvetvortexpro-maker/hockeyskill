import { NavLink, Outlet } from "react-router-dom";

const primaryNav = [
  { to: "/", label: "Dashboard", icon: "🏠" },
  { to: "/logga", label: "Logga", icon: "✏️" },
  { to: "/stats", label: "Stats", icon: "📊" },
  { to: "/badges", label: "Badges", icon: "🏅" },
  { to: "/installningar", label: "Inställningar", icon: "⚙️" },
];

const secondaryNav = [
  { to: "/drills", label: "Drills", icon: "📚" },
  { to: "/program", label: "Program", icon: "📋" },
  { to: "/tester", label: "Tester", icon: "🔬" },
  { to: "/match", label: "Match", icon: "🏒" },
  { to: "/mental", label: "Mental", icon: "🧠" },
];

export function Layout() {
  return (
    <div className="min-h-screen pb-28 sm:pb-6 sm:pt-20">
      {/* top nav — desktop */}
      <header className="hidden sm:block fixed top-0 left-0 right-0 z-40 backdrop-blur-md bg-ice-950/80 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-display text-xl">
            <span className="text-2xl">🏒</span>
            <span className="text-white">
              Hockey<span className="text-neon-cyan">Skills</span>
            </span>
          </div>
          <nav className="flex items-center gap-1" aria-label="Primär navigation">
            {primaryNav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === "/"}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-xl text-sm font-medium transition
                  ${isActive ? "bg-neon-cyan/15 text-neon-cyan" : "text-white/70 hover:text-white hover:bg-white/5"}`
                }
              >
                <span className="mr-1.5">{n.icon}</span>
                {n.label}
              </NavLink>
            ))}
            <div className="w-px h-5 bg-white/10 mx-1" />
            {secondaryNav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-xl text-sm font-medium transition
                  ${isActive ? "bg-neon-gold/15 text-neon-gold" : "text-white/50 hover:text-white hover:bg-white/5"}`
                }
              >
                <span className="mr-1">{n.icon}</span>
                {n.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      {/* top header — mobile */}
      <header className="sm:hidden sticky top-0 z-40 backdrop-blur-md bg-ice-950/80 border-b border-white/5">
        <div className="px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 font-display text-lg">
            <span className="text-xl">🏒</span>
            <span className="text-white">
              Hockey<span className="text-neon-cyan">Skills</span>
            </span>
          </div>
          {/* secondary nav mobile scroll */}
          <nav className="flex items-center gap-1 overflow-x-auto" aria-label="Extra sidor">
            {secondaryNav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                className={({ isActive }) =>
                  `shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-medium transition
                  ${isActive ? "text-neon-gold" : "text-white/50"}`
                }
              >
                {n.icon}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-4 sm:pt-0">
        <Outlet />
      </main>

      {/* bottom nav — mobile (primary 5 routes) */}
      <nav
        className="sm:hidden fixed bottom-0 left-0 right-0 z-40 backdrop-blur-md bg-ice-950/90 border-t border-white/10"
        aria-label="Primär navigation"
      >
        <div className="grid grid-cols-5">
          {primaryNav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === "/"}
              className={({ isActive }) =>
                `py-2.5 text-center text-[11px] font-medium
                ${isActive ? "text-neon-cyan" : "text-white/60"}`
              }
            >
              <div className="text-lg leading-none">{n.icon}</div>
              <div className="mt-1">{n.label}</div>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
