# SCORM Again - React Native Offline Example

A React Native Expo application demonstrating offline SCORM content delivery using the scorm-again library. This example shows how to download, store, and play SCORM courses locally on mobile devices with full offline support.

## Features

- Download SCORM courses for offline viewing
- Local course library management
- WebView-based SCORM player with scorm-again integration
- Progress tracking and synchronization
- **Comprehensive Settings Screen** with:
  - Real-time network status monitoring
  - Manual sync controls
  - Storage management
  - Debug logging and log viewer
  - Quick access to documentation
- Works on both iOS and Android

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Expo CLI** (will be installed via npx)
- **iOS Simulator** (Mac only, via Xcode)
- **Android Studio** (for Android Emulator)
- **Xcode** (Mac only, for iOS development)

## Project Structure

```
examples/react-native-offline/
├── app/
│   ├── (tabs)/               # Bottom tab navigation
│   │   ├── _layout.tsx       # Tab navigator configuration
│   │   ├── library.tsx       # Course library screen
│   │   ├── downloads.tsx     # Downloaded courses screen
│   │   └── settings.tsx      # Settings screen
│   ├── player/
│   │   └── [courseId].tsx    # SCORM player screen (dynamic route)
│   └── _layout.tsx           # Root layout
├── src/
│   ├── services/             # Business logic services
│   │   ├── SyncManager.ts    # Sync orchestration and logging
│   │   ├── StorageService.ts # File system operations
│   │   └── index.ts          # Service exports
│   ├── contexts/             # React contexts
│   │   ├── SyncContext.tsx   # Sync state management
│   │   └── index.ts          # Context exports
│   ├── components/           # Reusable UI components
│   └── constants.ts          # App constants (ADL download URL, etc.)
├── assets/
│   ├── scorm-again/          # scorm-again library files
│   └── courses/              # Downloaded SCORM courses
├── app.json                  # Expo configuration
├── package.json              # Dependencies
└── tsconfig.json             # TypeScript configuration
```

## Setup

### 1. Install Dependencies

```bash
cd examples/react-native-offline
npm install
```

Key dependencies include:
- `@react-native-async-storage/async-storage` - Persistent storage for settings and logs
- `@react-native-community/netinfo` - Network status monitoring
- `expo-file-system` - File operations for course storage
- `react-native-webview` - SCORM content rendering
- `react-native-zip-archive` - Course package extraction

Note: If you encounter npm cache permission issues, you may need to fix npm cache ownership:

```bash
sudo chown -R $(whoami) ~/.npm
```

Or use yarn as an alternative:

```bash
yarn install
```

### 2. Prebuild Native Projects

Generate the native iOS and Android projects:

```bash
npx expo prebuild
```

This will create `ios/` and `android/` directories with the necessary native code.

To clean and regenerate:

```bash
npx expo prebuild --clean
```

### 3. Copy SCORM Library

Copy the scorm-again library into the assets folder:

```bash
# From the root of the scorm-again repository
npm run build
cp dist/scorm-again.js examples/react-native-offline/assets/scorm-again/
```

## Running the App

### iOS

```bash
npm run ios
```

Or specify a simulator:

```bash
npx expo run:ios --device "iPhone 15 Pro"
```

### Android

```bash
npm run android
```

Or specify an emulator:

```bash
npx expo run:android --device emulator-5554
```

### Development Mode

Start the development server:

```bash
npm start
```

Then press:
- `i` for iOS
- `a` for Android
- `r` to reload
- `m` for menu

## How It Works

### 1. Course Library

The library screen displays available SCORM courses from a remote catalog. Users can browse and download courses for offline viewing.

### 2. Downloads

The downloads screen shows all locally stored courses and their completion status. Users can launch courses, view progress, and manage storage.

### 3. SCORM Player

The player uses React Native WebView to display SCORM content. The scorm-again library provides the SCORM API implementation that the content communicates with.

Key features:
- Offline-first architecture using expo-file-system
- SCORM 1.2 and SCORM 2004 support
- Progress tracking and resume functionality
- Network-aware synchronization

### 4. Settings Screen

The settings screen provides comprehensive app management:
- **Network Status**: Real-time online/offline indicator with connection type
- **Sync Management**: Manual sync trigger, pending items count, last sync timestamp
- **Storage Controls**: Display total storage used, clear all courses with confirmation
- **Debug Tools**: Toggle debug logging, view color-coded logs with timestamps, clear logs
- **About Section**: Links to GitHub repository and documentation

For detailed documentation, see [SETTINGS_SCREEN.md](./SETTINGS_SCREEN.md).

### 5. Offline Storage

Courses are downloaded as ZIP files, extracted to the device filesystem, and served locally. The app uses:
- **expo-file-system** for file operations
- **react-native-zip-archive** for ZIP extraction
- **@react-native-community/netinfo** for network detection
- **AsyncStorage** for metadata, settings, and progress tracking
- **SyncManager** for coordinating sync operations across screens
- **StorageService** for calculating and managing course storage

## Configuration

### Constants

Edit `src/constants.ts` to configure:

```typescript
export const ADL_DOWNLOAD_URL = "https://cdn.noverant.com/AllGolfExamples.zip";
```

### App Settings

Edit `app.json` to configure:
- App name and slug
- Bundle identifiers (iOS/Android)
- Icon and splash screen
- Permissions

## Development

### TypeScript

The project uses TypeScript throughout. Type checking:

```bash
npx tsc --noEmit
```

### File-Based Routing

This project uses Expo Router for navigation. Routes are automatically generated from the `app/` directory structure:

- `app/(tabs)/library.tsx` → `/library` (tab)
- `app/(tabs)/downloads.tsx` → `/downloads` (tab)
- `app/(tabs)/settings.tsx` → `/settings` (tab)
- `app/player/[courseId].tsx` → `/player/123` (dynamic route)

### Adding Native Dependencies

After adding any native dependency:

```bash
npx expo prebuild --clean
npm run ios  # or npm run android
```

## Testing SCORM Content

### Sample Course

A minimal test course is included in `assets/courses/`. To test with real content:

1. Download ADL sample courses from the configured URL
2. Extract to `assets/courses/`
3. Update the course metadata in the app

### Course Structure

Each course should follow this structure:

```
assets/courses/my-course/
├── imsmanifest.xml
├── index.html
└── ... (course files)
```

## Troubleshooting

### iOS Build Issues

If you encounter code signing issues:

1. Open `ios/reactnativeoffline.xcworkspace` in Xcode
2. Select your development team
3. Update the bundle identifier if needed

### Android Build Issues

If you encounter build failures:

```bash
cd android
./gradlew clean
cd ..
npx expo run:android
```

### Metro Bundler Issues

Clear the cache:

```bash
npx expo start --clear
```

### Native Module Issues

If native modules aren't linking:

```bash
npx expo prebuild --clean
cd ios && pod install && cd ..
npm run ios
```

## Additional Documentation

- [Settings Screen Details](./SETTINGS_SCREEN.md) - Complete guide to the Settings screen features and services
- [Player Integration Guide](./PLAYER_INTEGRATION_EXAMPLE.md) - How to integrate sync functionality with the SCORM player

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)
- [React Native Documentation](https://reactnative.dev/)
- [scorm-again Documentation](https://github.com/jcputney/scorm-again)
- [SCORM Specifications](https://adlnet.gov/projects/scorm/)

## License

This example is part of the scorm-again project and follows the same license.
