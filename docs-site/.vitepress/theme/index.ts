import type { Theme } from "vitepress";
import DefaultTheme from "vitepress/theme";
import { installUmamiTracking, trackAnchorView, trackNotFoundIfApplicable } from "./umamiTracking";
import "./custom.css";

export default {
  extends: DefaultTheme,
  enhanceApp({ router }) {
    if (typeof window !== "undefined") {
      installUmamiTracking();
      // Track hash navigations (anchor-view) and 404s on client-side route changes.
      router.onAfterRouteChange = (to) => {
        try {
          const url = new URL(to, window.location.origin);
          trackAnchorView(url.pathname, url.hash);
          trackNotFoundIfApplicable(url.pathname);
        } catch {
          /* noop */
        }
      };
    }
  },
} satisfies Theme;
