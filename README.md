
## Development

Steps to run the sample extension in Chrome:

1. Open `chrome://extensions`:

- In your Chrome browser, navigate to [chrome://extensions](chrome://extensions) (type it in the address bar).

2. Enable Developer Mode:

- In the top-right corner (or top-left in some Chrome versions), you’ll see a toggle or checkbox for Developer mode.
- Turn it on.

3. Load Unpacked:

- Click the Load unpacked button.
- Select the folder containing your `manifest.json` file (i.e., the root folder of your extension).
- Chrome will load your extension and show it as an icon in the extensions bar (usually in the top-right corner).

4. Test the Extension:

- Click on the extension’s icon to open the popup.
- You should see the UI defined in popup.html (Play/Pause/Stop buttons, Settings inputs, etc.).
- Enter your settings (e.g., an API key, voice, speed) and try pressing Play on an active webpage.
- Check the JavaScript console (press F12 or Cmd/Ctrl + Shift + I) if you run into any errors.


## Common Pitfalls

### `console.log()` Not Appearing

Make sure you’re looking in the right console:
- Popup scripts log to the popup DevTools.
- Content scripts log to the web page’s DevTools.
- Background/Service worker scripts log to the service worker DevTools in `chrome://extensions`.

### Extension Reload

When you update your code, go to `chrome://extensions` and click Reload under your extension to ensure the changes are applied.

### Popup Closes Automatically

By default, the popup will close if you click away or if the code takes too long (there are time limits for extension popups). For prolonged debugging, you can open the popup DevTools immediately, set breakpoints, and keep the popup window in focus.
