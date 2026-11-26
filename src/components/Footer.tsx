"use client";

import { GitBranch, Send, Users, MessageCircle, Mail, ChevronRight, Sparkles, Terminal } from "lucide-react";

const footerLinks = {
  product: [
    { label: "Capabilities", href: "#features" },
    { label: "Engagements", href: "#pricing" },
    { label: "Case studies", href: "#testimonials" },
    { label: "Documentation", href: "#docs" },
    { label: "API reference", href: "#api" },
    { label: "Changelog", href: "#changelog" },
  ],
  company: [
    { label: "About", href: "#about" },
    { label: "Blog", href: "#blog" },
    { label: "Careers", href: "#careers" },
    { label: "Contact", href: "#contact" },
  ],
  resources: [
    { label: "Community", href: "#community" },
    { label: "Templates", href: "#templates" },
    { label: "Guides", href: "#guides" },
    { label: "Discord", href: "#discord" },
  ],
  legal: [
    { label: "Privacy", href: "#privacy" },
    { label: "Terms", href: "#terms" },
    { label: "Security", href: "#security" },
    { label: "Compliance", href: "#compliance" },
  ],
};

const socialLinks = [
  { icon: GitBranch, href: "https://github.com", label: "GitHub" },
  { icon: Send, href: "https://twitter.com", label: "Twitter" },
  { icon: Users, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: MessageCircle, href: "https://discord.com", label: "Discord" },
];

export default function Footer() {
  return (
    <footer className="bg-[var(--bg)] text-[var(--fg-muted)] border-t border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-10 lg:py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-7 lg:gap-8">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-[var(--radius-lg)] bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hover)] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-[var(--fg)]">AgentFlow</span>
            </div>
            <p className="text-[var(--fg-muted)] text-sm mb-5 max-w-xs leading-relaxed">
              Agent runtime for teams that ship. Build, deploy, and operate autonomous agents.
            </p>
            <div className="flex gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-[var(--radius-md)] bg-[var(--bg-elevated)]/50 text-[var(--fg-subtle)] hover:bg-[var(--bg-subtle)] hover:text-[var(--fg)] transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <nav aria-label="Product">
            <h4 className="font-medium text-[var(--fg)] mb-2 text-sm">Product</h4>
            <ul className="space-y-1.5" role="list">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-[var(--fg-subtle)] hover:text-[var(--fg)] transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Company */}
          <nav aria-label="Company">
            <h4 className="font-medium text-[var(--fg)] mb-2 text-sm">Company</h4>
            <ul className="space-y-1.5" role="list">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-[var(--fg-subtle)] hover:text-[var(--fg)] transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Resources */}
          <nav aria-label="Resources">
            <h4 className="font-medium text-[var(--fg)] mb-2 text-sm">Resources</h4>
            <ul className="space-y-1.5" role="list">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-[var(--fg-subtle)] hover:text-[var(--fg)] transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-6 border-t border-[var(--border)]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            {/* Legal */}
            <nav aria-label="Legal" className="flex flex-wrap items-center justify-center md:justify-start gap-5">
              {footerLinks.legal.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-xs text-[var(--fg-subtle)] hover:text-[var(--fg)] transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Copyright + Version */}
            <div className="flex flex-col md:flex-row items-center gap-3 text-xs text-[var(--fg-subtle)]">
              <span>© 2026 AgentFlow</span>
              <span className="flex items-center gap-1 font-mono">
                <Terminal className="w-3 h-3" />
                v2.1.0
              </span>
            </div>

            {/* Newsletter — minimal */}
            <form className="w-full md:w-64" action="#newsletter" method="POST">
              <label htmlFor="email-footer" className="sr-only">Email</label>
              <div className="relative">
                <input
                  type="email"
                  id="email-footer"
                  name="email"
                  placeholder="Updates"
                  className="w-full px-4 py-2 rounded-[var(--radius-md)] bg-[var(--bg-elevated)]/50 border border-[var(--border)] text-[var(--fg)] placeholder-[var(--fg-subtle)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-[var(--fg-subtle)] hover:text-[var(--fg)] transition-colors"
                  aria-label="Subscribe"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </footer>
  );
}