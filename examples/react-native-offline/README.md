# scorm-again React Native offline example

An Expo app that plays SCORM courses on iOS and Android with scorm-again, including offline support. It uses the shared bridge script from the [React Native guide](https://jcputney.github.io/scorm-again/docs/advanced/mobile/react-native).

The app:

- includes a small SCORM 2004 test course, and downloads the ADL Golf example courses from the Downloads tab
- serves the courses from a local HTTP server and plays them in a WebView
- commits to an LMS endpoint. While the device is offline, scorm-again queues the commits in localStorage and sends them when the device is back online.
- shows the network status, the last sync result, storage use and debug logs on the Settings tab

## Requirements

- Node.js 22, 24 or 26. Expo SDK 58 does not support Node 25.
- Xcode for iOS, or Android Studio for Android
- A development build. The app uses native modules, such as the local HTTP server and zip extraction, that Expo Go does not include.

## Run the app

1. Start the mock LMS from the repository root:

   ```bash
   npm ci
   npm run test:integration:server
   ```

   The mock LMS listens on port 3001. The first run also downloads the courses that the integration tests use. To see the commits it has received, open http://localhost:3001/lms/history.

2. In this folder, install the dependencies and start the app:

   ```bash
   npm ci
   npm run ios      # or: npm run android
   ```

`npm run ios`, `npm run android` and `npm start` run `npm run prepare-assets` first. That script packs three things into zips under `assets/`, which the app extracts on first launch:

- `dist/scorm-again.min.js` from the repository
- the bridge script, `docs-site/examples/mobile-bridge.js`
- the test course in `course/minimal-test/`

`dist/` is committed, so this works from a fresh clone. To try your own library changes, run `npm run build` in the repository root first. The app extracts a zip again whenever its contents change.

## LMS address

`LMS_COMMIT_URL` in `src/constants.ts` sets where commits go:

- iOS Simulator: `http://localhost:3001/lms/commit`
- Android emulator: `http://10.0.2.2:3001/lms/commit`. `10.0.2.2` is the emulator's address for your computer.
- A physical device: use your computer's address on the local network. Plain HTTP to a non-local address may need a cleartext or App Transport Security exception.

Every launch uses the learner id in `LEARNER_ID`, in the same file.

## Try offline support

1. Open Minimal Test Course from the Library tab. Tap **Set location**, then **Commit**. The commit appears in `/lms/history`.
2. Turn off the network, for example with airplane mode. Tap **Set location** and **Commit** again. The commit returns `true`, and scorm-again stores it in localStorage.
3. Turn the network back on. The app sends a network status event to the WebView, and scorm-again sends the queued commit. The sync icon in the header spins until the sync finishes, and the Settings tab shows the result.

If you close the course while offline, the queue stays on the device. The next launch of the same course restores the unsent data, and scorm-again sends it once the device is online.

## How it works

- `app/player/[courseId].tsx` reads the scorm-again bundle, the bridge script and the course's SCORM version. It builds `window.scormBridgeConfig` and runs all three with `injectedJavaScriptBeforeContentLoaded`.
- The WebView opens `player.html`, a host page that `StaticServerService` writes to the app's document folder. The host page loads the course in an iframe once the API exists. Many course wrappers declare their own global `API` variable, so the course cannot share a window with the scorm-again API.
- The player sends each NetInfo change to the WebView as a `scorm-again:network-status` event. It sends the current status again when the course calls `Initialize`.
- The bridge sends log lines, which the player prints to the Metro console, and sync events, which drive the header icon and the Settings tab.

The Settings tab has no "sync now" button. scorm-again has no public method to start a sync. It syncs by itself on `Initialize`, `Commit` and `Terminate`, and when the device comes back online.

## Project layout

```
app/(tabs)/              Library, Downloads and Settings tabs
app/player/[courseId].tsx  the course player
course/minimal-test/     source of the built-in test course
scripts/prepare-assets.mjs
src/constants.ts         LMS address, learner id, download URL
src/services/            course storage, downloads, local HTTP server, sync log
```

## Troubleshooting

- **Metro cannot resolve `scorm-again.zip` or `minimal-test.zip`.** Run `npm run prepare-assets`. Starting Expo with `npx expo start` skips it.
- **Commits fail.** Check that the mock LMS is running and that `LMS_COMMIT_URL` uses an address the device can reach. The Android emulator cannot reach `localhost` on your computer.
- **The course cannot find the API.** Turn on debug logging in the Settings tab, open the course again, and read the `[scorm-again]` lines in the Metro console. The [mobile troubleshooting notes](https://jcputney.github.io/scorm-again/docs/advanced/mobile/react-native#troubleshooting) cover the common causes.

## Testing

CI builds the asset zips, type-checks the app, checks its Expo dependencies, and bundles its JavaScript for Android and iOS with `expo export`. It does not build the native apps or run them on a device or emulator. The bridge script itself runs in Chromium and Firefox in the library's integration tests (`test/integration/MobileBridge.spec.ts`).
