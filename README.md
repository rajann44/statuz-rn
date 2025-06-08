# Quote Generator App

A React Native app that generates beautiful quote images with customizable backgrounds. Built with Expo and TypeScript.

## Features

- Random background images from picsum.photos
- Inspirational quotes from quotable.io API
- Category-based quote selection
- Export images to device gallery
- Modern and clean UI

## Prerequisites

- Node.js (v14 or newer)
- npm or yarn
- Expo CLI
- iOS Simulator (for Mac) or Android Emulator

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd statuz-rn
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on your preferred platform:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app on your physical device

## Usage

1. Select a quote category from the dropdown menu
2. Click the refresh button to get a new quote
3. Use "Change Background" to get a new random background image
4. Click "Export" to save the image to your device's gallery

## Dependencies

- expo
- react-native-view-shot
- react-native-picker-select
- expo-media-library
- @react-native-async-storage/async-storage

## License

MIT 