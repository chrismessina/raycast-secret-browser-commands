import { Application, Color, getApplications, Icon, Image } from "@raycast/api";
import { basename } from "path";
import { Browser, SUPPORTED_BROWSERS } from "../types/browsers";

/** Browser key → absolute path of the installed application bundle. */
export type InstalledBrowsers = Record<string, string>;

const normalize = (name: string) => name.toLowerCase().replace(/\.(app|exe)$/, "");

/**
 * Locate which of our supported browsers are actually installed.
 *
 * Preference order per browser: a verified bundle identifier, then the exact `appName` this
 * extension already hands to `open -a`, then `localizedName` (a localized install reports a
 * translated `name`), then the bundle's own filename. No bundle identifier is guessed — a browser
 * without one simply falls back to name matching.
 */
export async function findInstalledBrowsers(): Promise<InstalledBrowsers> {
  const apps: Application[] = await getApplications();
  const installed: InstalledBrowsers = {};

  // Search per browser, strongest signal first, rather than folding every installed app into one
  // name-keyed map. That map let an unrelated app whose name normalised the same way overwrite a
  // real match — and "Arc", "Dia" and "Comet" are generic enough for that to happen on a real Mac.
  for (const browser of SUPPORTED_BROWSERS) {
    const wanted = browser.appName ? normalize(browser.appName) : undefined;
    const match =
      (browser.bundleId ? apps.find((app) => app.bundleId === browser.bundleId) : undefined) ??
      (wanted
        ? (apps.find((app) => normalize(app.name) === wanted) ??
          apps.find((app) => app.localizedName && normalize(app.localizedName) === wanted) ??
          apps.find((app) => normalize(basename(app.path)) === wanted))
        : undefined);

    if (match) installed[browser.key] = match.path;
  }
  return installed;
}

/**
 * The icon to show for a browser.
 *
 * An installed browser gets its real application icon — the exact app the action will launch, with
 * no network call and nothing to keep in sync when a vendor rebrands.
 *
 * The three states are deliberately distinct. `installed` being `undefined` means discovery has not
 * answered yet, which is NOT the same as "absent" and must not be drawn as though it were — a plain
 * globe stands in until we know. A browser we have confirmed is missing gets a muted globe, which
 * is honest: the row is still selectable as reference, but nothing will open.
 *
 * Deliberately NOT `getFavicon`: it resolves on hostname alone, so google.com would return Google's
 * logo rather than Chrome's, and microsoft.com Microsoft's rather than Edge's.
 */
export function browserIcon(browser: Browser, installed: InstalledBrowsers | undefined): Image.ImageLike {
  if (!installed) return Icon.Globe;
  const path = installed[browser.key];
  return path ? { fileIcon: path } : { source: Icon.Globe, tintColor: Color.SecondaryText };
}
