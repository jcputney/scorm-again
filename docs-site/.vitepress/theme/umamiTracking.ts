// Umami click tracking, ported from the ratchet docs site. Targets the
// classes VitePress emits (.copy on code blocks, .VPSidebarItem in the
// sidebar, .VPButton inside .VPHero for the home page CTAs).

declare global {
  interface Window {
    umami?: {
      track: (name: string, data?: Record<string, unknown>) => void;
    };
  }
}

let installed = false;

export function installUmamiTracking() {
  if (typeof window === "undefined" || installed) return;
  installed = true;

  document.addEventListener("click", (e) => {
    const el = e.target as Element | null;
    if (!el) return;

    // Code-block copy button: VitePress renders <button class="copy">
    // inside a <div class="language-java"> (or similar).
    const copyBtn = el.closest<HTMLButtonElement>("button.copy");
    if (copyBtn) {
      const block = copyBtn.closest<HTMLElement>('[class*="language-"]');
      const langClass = Array.from(block?.classList ?? []).find((c) => c.startsWith("language-"));
      const language = langClass?.replace("language-", "") ?? "unknown";
      window.umami?.track("code-copy", {
        language,
        path: window.location.pathname,
      });
      return;
    }

    const link = el.closest("a[href]") as HTMLAnchorElement | null;
    if (!link) return;
    const href = link.getAttribute("href");
    if (!href) return;

    // Hero CTA buttons. VitePress's home frontmatter doesn't expose
    // data-attributes, so we infer the event target from the link href.
    if (link.classList.contains("VPButton") && link.closest(".VPHero")) {
      const target = inferHeroCtaTarget(href);
      window.umami?.track("cta-click", {
        location: "hero",
        target,
        path: window.location.pathname,
      });
      return;
    }

    // Sidebar click: VitePress sidebar links sit inside .VPSidebarItem
    if (link.closest(".VPSidebarItem")) {
      window.umami?.track("sidebar-click", {
        target: href,
        path: window.location.pathname,
      });
      return;
    }

    if (!/^https?:\/\//i.test(href)) return;
    try {
      const url = new URL(href);
      if (url.host === window.location.host) return;
      window.umami?.track("outbound-click", {
        host: url.host,
        target: url.host + url.pathname,
        path: window.location.pathname,
      });
    } catch {
      // malformed absolute URL — skip silently
    }
  });
}

function inferHeroCtaTarget(href: string): string {
  // Hero links are rendered with the site base prefixed (/scorm-again/...),
  // so match on the path segment rather than the start of the string.
  if (href.includes("/docs/getting-started/")) return "get-started";
  if (href.includes("github.com/")) return "github";
  return "unknown";
}

// Anchor-view tracking via VitePress route hash changes.
// Called from theme/index.ts inside a NavigationGuard-style mounted hook.
let lastAnchor = "";
let lastPath = "";
export function trackAnchorView(path: string, hash: string) {
  if (typeof window === "undefined") return;
  if (!hash) return;
  if (path === lastPath && hash === lastAnchor) return;
  lastPath = path;
  lastAnchor = hash;
  window.umami?.track("anchor-view", {
    path,
    anchor: hash.replace(/^#/, ""),
  });
}

// 404 tracking. VitePress shows its built-in NotFound layout when no route
// matches, so we detect it via the class VitePress sets on the 404 page.
let lastNotFoundPath = "";
export function trackNotFoundIfApplicable(path: string) {
  if (typeof window === "undefined") return;
  // Defer to next tick so VitePress has applied page metadata + classes.
  setTimeout(() => {
    const isNotFound =
      document.body.classList.contains("NotFound") || document.querySelector(".NotFound") !== null;
    if (!isNotFound) return;
    if (path === lastNotFoundPath) return;
    lastNotFoundPath = path;
    window.umami?.track("not-found", { path });
  }, 0);
}
