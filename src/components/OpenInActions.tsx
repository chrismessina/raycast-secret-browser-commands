import { Action, Icon, ActionPanel } from "@raycast/api";
import { Browser, SUPPORTED_BROWSERS } from "../types/browsers";
import { browserIcon, InstalledBrowsers } from "../utils/browserApps";
import { openUrlInBrowser } from "../utils/openUrlInBrowser";

interface OpenInBrowserSubmenuProps {
  commandPath: string; // Just the path, e.g., "settings"
  currentBrowser: string; // The 'key' of the currently selected browser
  /** Browser keys that actually serve this URL. */
  supportedBrowsers: string[];
  /**
   * Browser key → installed app path. `undefined` while discovery is still running, which is not
   * the same as "nothing installed" — see the optimism note below.
   */
  installedBrowsers: InstalledBrowsers | undefined;
}

export function OpenInBrowserSubmenu({
  commandPath,
  currentBrowser,
  supportedBrowsers,
  installedBrowsers,
}: OpenInBrowserSubmenuProps) {
  // Find the current browser object
  const selectedBrowser = SUPPORTED_BROWSERS.find((b) => b.key === currentBrowser);

  // Only browsers we can actually hand a URL to, i.e. those with an appName
  const isLaunchable = (browser: Browser): browser is Browser & { appName: string } => Boolean(browser.appName);
  // Offering a browser that does not serve this URL just opens an error page, and contradicts the
  // Supported Browsers row in the same detail pane.
  const serves = (browser: Browser) => supportedBrowsers.includes(browser.key);
  // A browser you do not have cannot open anything, so it does not belong in a menu whose only job
  // is to open something. While discovery is still running we assume yes: hiding entries on a slow
  // first launch reads as a broken menu, and a launch that does fail says so in a toast.
  const isInstalled = (browser: Browser) => !installedBrowsers || browser.key in installedBrowsers;

  const menuBrowsers = SUPPORTED_BROWSERS.filter(
    (browser) => browser.key !== currentBrowser && serves(browser) && isInstalled(browser),
  ).filter(isLaunchable);
  const showSelected = selectedBrowser && isLaunchable(selectedBrowser) && isInstalled(selectedBrowser);

  // An empty submenu is a dead end. Render nothing rather than a menu with no items.
  if (!showSelected && menuBrowsers.length === 0) return null;

  // Helper to build the full URL with the correct scheme
  const getFullUrl = (browserScheme: string, path: string): string => {
    // If the path already contains a scheme (like chrome-untrusted://), return it as-is
    if (path.includes("://")) {
      return path;
    }
    return `${browserScheme}${path}`;
  };

  return (
    <ActionPanel.Submenu title="Open in…" icon={Icon.Globe}>
      {showSelected && (
        <Action
          title={selectedBrowser.title}
          icon={browserIcon(selectedBrowser, installedBrowsers)}
          onAction={() => openUrlInBrowser(selectedBrowser.appName, getFullUrl(selectedBrowser.scheme, commandPath))}
        />
      )}

      {menuBrowsers.map((browser) => (
        <Action
          key={browser.key}
          title={browser.title}
          icon={browserIcon(browser, installedBrowsers)}
          onAction={() => openUrlInBrowser(browser.appName, getFullUrl(browser.scheme, commandPath))}
        />
      ))}
    </ActionPanel.Submenu>
  );
}
