import { execFile } from "child_process";
import { promisify } from "util";
import { showHUD, showToast, Toast } from "@raycast/api";
import { failToast, getErrorMessage, showError } from "@chrismessina/raycast-kit";

const execFileAsync = promisify(execFile);

// macOS `open` emits this when -a names an application it cannot resolve.
// Verified 2026-09-09: `open -a Nonexistent chrome://settings` →
// "Unable to find application named 'Nonexistent'". It does NOT say "Application not found".
const APP_NOT_FOUND = "unable to find application named";

async function revealAppInFinder(appName: string) {
  try {
    // -R takes ONE operand, the thing to select. Passing `/Applications -R "X.app"` resolves
    // "X.app" against the CWD instead of /Applications, and reveals nothing.
    await execFileAsync("/usr/bin/open", ["-R", `/Applications/${appName}.app`]);
  } catch (error) {
    await showError(error, {
      title: "Couldn't Reveal the App",
      message: `${appName} is not in your Applications folder.`,
      copyContext: `appName=${appName}`,
    });
  }
}

/**
 * Opens a URL in a specific browser via macOS `open -a`.
 *
 * macOS only — `/usr/bin/open` does not exist on Windows.
 *
 * @param appName - The application name (e.g., "Google Chrome", "Arc").
 * @param url - The full URL to open (e.g., "chrome://settings").
 * @param options.showSuccess - Show a success HUD. Defaults to true.
 */
export async function openUrlInBrowser(
  appName: string,
  url: string,
  { showSuccess = true }: { showSuccess?: boolean } = {},
): Promise<void> {
  // A Toast, not a HUD. showHUD closes the Raycast window, and a failure raised afterwards has
  // nowhere to render its Copy Error action — the user gets a bare HUD and no way to report it.
  // The toast still fires before the async work, so the UI never looks idle.
  const toast = await showToast({ style: Toast.Style.Animated, title: `Opening in ${appName}…` });

  try {
    // execFile, not exec: no shell, so nothing in appName or url is ever word-split, expanded,
    // or interpreted. `open -a` foregrounds by default — do NOT add -F, which means "fresh"
    // and discards the browser's restored windows.
    await execFileAsync("/usr/bin/open", ["-a", appName, url]);
  } catch (error) {
    if (getErrorMessage(error).toLowerCase().includes(APP_NOT_FOUND)) {
      failToast(toast, error, {
        title: "Application Not Found",
        message: `Could not find ${appName}.`,
        action: { title: "Reveal in Finder", onAction: () => revealAppInFinder(appName) },
        copyContext: `appName=${appName} url=${url}`,
      });
    } else {
      failToast(toast, error, {
        title: "Couldn't Open URL",
        message: `Could not open ${url} in ${appName}.`,
        copyContext: `appName=${appName} url=${url}`,
      });
    }
    return;
  }

  await toast.hide();
  if (showSuccess) {
    // Only now — the HUD dismisses Raycast, which is the right ending for a successful hand-off.
    await showHUD(`Opened in ${appName}`);
  }
}
