export default function Nav({ active }: { active?: "blog" }) {
  return (
    <nav>
      <div />
      <a href="https://litflo.ai" className="nav-brand">LitFlo</a>
      <div className="nav-links">
        <a href="https://litflo.ai">Home</a>
        <span>|</span>
        <a href="https://litflo.ai/about.html">About</a>
        <span>|</span>
        <a href="https://litflo.ai/blog" className={active === "blog" ? "active" : ""}>Blog</a>
        <span>|</span>
        <a href="https://litflo.ai/account.html">Account</a>
      </div>
    </nav>
  );
}
