import { Link, useRouterState } from "@tanstack/react-router";

const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/properties", label: "Properties" },
  { to: "/tenants", label: "Tenants" },
  { to: "/maintenance", label: "Maintenance" },
  { to: "/finances", label: "Finances" },
] as const;

export function Navbar() {
  const { location } = useRouterState();
  const isLanding = location.pathname === "/";

  return (
    <div className="px-6 md:px-12 lg:px-16 pt-6 relative z-20">
      <nav className="liquid-glass rounded-xl px-4 py-2 flex items-center justify-between">
        <Link to="/" className="text-2xl font-semibold tracking-tight px-2">
          Landyflow
        </Link>
        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => {
            const active = location.pathname.startsWith(l.to);
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                  active ? "text-white bg-white/10" : "text-gray-300 hover:text-white"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </div>
        <div className="flex items-center gap-2">
          {isLanding ? (
            <Link to="/signup" className="btn-primary btn-sm">
              Get Started
            </Link>
          ) : (
            <Link to="/login" className="btn-glass btn-sm">
              Sign Out
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
}
