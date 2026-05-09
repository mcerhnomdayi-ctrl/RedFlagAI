import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Sign up — Landyflow" }] }),
  component: SignupPage,
});

function SignupPage() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6 page-fade">
      <div className="liquid-glass border border-white/20 rounded-2xl p-8 w-full max-w-md">
        <Link to="/" className="text-2xl font-semibold tracking-tight block mb-1">Landyflow</Link>
        <p className="text-sm text-gray-300 mb-6">Create your account in under a minute.</p>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label className="text-xs text-gray-300">Full name</label>
            <input placeholder="Jane Landlord" />
          </div>
          <div>
            <label className="text-xs text-gray-300">Email</label>
            <input type="email" placeholder="you@example.com" />
          </div>
          <div>
            <label className="text-xs text-gray-300">Password</label>
            <input type="password" placeholder="At least 8 characters" />
          </div>
          <button className="btn-primary w-full" type="submit">Create Account</button>
        </form>
        <p className="text-sm text-gray-300 mt-6 text-center">
          Already have an account? <Link to="/login" className="text-white underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
