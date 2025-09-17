# Daily Quran Verse Widget

A beautiful, responsive web widget that displays daily Quran verses with Arabic text and English translations. The widget automatically refreshes every 24 hours and provides a clean, distraction-free interface for daily reflection.

## Features

- 🌙 **Daily Verse Display**: Shows a random Quran verse with Arabic text and English translation
- ⏰ **Smart Caching**: Automatically caches verses for 24 hours to reduce API calls
- 🔄 **Manual Refresh**: Click the refresh button or press `Space` to get a new verse
- 📱 **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- 🎨 **Beautiful Animations**: Smooth moon animation and hover effects
- ⌨️ **Keyboard Shortcuts**: Press `Space` to refresh the verse
- 🔄 **Offline Support**: Shows cached verses when internet connection is unavailable
- 🎯 **Error Handling**: Graceful error handling with fallback to cached content

## How to Use

1. **Open the Widget**: Simply open `index.html` in any modern web browser
2. **View Daily Verse**: The widget automatically loads and displays a Quran verse
3. **Refresh Verse**: 
   - Click the refresh button (🔄)
   - Press the `Space` key on your keyboard
4. **Automatic Updates**: The verse automatically refreshes every 24 hours

## Technical Details

### API Integration
- Uses the [AlQuran Cloud API](https://alquran.cloud/api) for fetching verses
- Fetches both Arabic text and English translation (Sahih International)
- Implements proper error handling and fallback mechanisms

### Caching Strategy
- Stores verses in browser's localStorage
- 24-hour cache duration to balance freshness and performance
- Graceful fallback to cached content when API is unavailable

### Browser Compatibility
- Works in all modern browsers (Chrome, Firefox, Safari, Edge)
- Uses standard web APIs (Fetch, localStorage, ES6+ features)
- No external dependencies except for Google Fonts and Font Awesome icons

## File Structure

```
quran-verse-widget/
├── index.html          # Main application file
├── moon.png           # Moon icon for the widget
├── icon-1.png         # Alternative icon (unused)
├── icon-2.png         # Alternative icon (unused)
├── icon-3.png         # Alternative icon (unused)
├── icon-4.png         # Alternative icon (unused)
├── icon-5.png         # Alternative icon (unused)
├── favicon.ico        # Browser favicon
└── README.md          # This documentation file
```

## Customization

### Changing the Cache Duration
Modify the `CACHE_DURATION` constant in the JavaScript section:
```javascript
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
```

### Styling
The widget uses inline CSS for simplicity. You can customize:
- Colors and fonts
- Animation timing
- Layout and spacing
- Button styles

### API Configuration
The widget uses the AlQuran Cloud API. You can modify the `API_URL` constant to use different translations or endpoints.

## Browser Support

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

## License

This project is open source and available under the [MIT License](LICENSE).

## Contributing

Contributions are welcome! Please feel free to submit issues, feature requests, or pull requests.

## Acknowledgments

- [AlQuran Cloud API](https://alquran.cloud/api) for providing the Quran data
- [Google Fonts](https://fonts.google.com/) for the beautiful typography
- [Font Awesome](https://fontawesome.com/) for the icons
