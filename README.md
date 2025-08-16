# Roblox Community Wealth Tracker

A Google Chrome extension that tracks Roblox community members by wealth based on limited item ownership.

## Features

- **Community Link Parsing**: Automatically extracts community ID from Roblox community links (2025 format)
- **Member Wealth Tracking**: Fetches and ranks community members by wealth
- **Limited Item Filtering**: Only counts limited items worth more than 10,000 Robux
- **Real-time Refresh**: Update member lists without re-entering community links
- **Modern UI**: Beautiful, responsive interface with progress tracking
- **Data Persistence**: Saves community data locally for quick access

## Installation

### Method 1: Load Unpacked Extension (Development)

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the extension folder
5. The extension should now appear in your extensions list

### Method 2: Chrome Web Store (Future)

Once published, the extension will be available on the Chrome Web Store for easy installation.

## Usage

### Basic Operation

1. **Click the extension icon** in your Chrome toolbar
2. **Enter a Roblox community link** in the format:
   ```
   https://www.roblox.com/communities/35461612/Z9-Market#!/about
   ```
3. **Click "Search for List"** to fetch community members
4. **View results** ranked by wealth (highest to lowest)
5. **Use the Refresh button** to update data without re-entering the link

### Community Link Format

The extension supports the new Roblox 2025 community link format:
- **Valid**: `https://www.roblox.com/communities/35461612/Z9-Market#!/about`
- **Extracted ID**: `35461612`
- **Supported**: Any valid Roblox community ID (numeric)

### Wealth Calculation

- **Limited Items Only**: Only Roblox limited items are counted
- **Minimum Value**: Items must be worth more than 10,000 Robux
- **Real-time Pricing**: Uses current market values for accurate calculations
- **Total Wealth**: Sum of all qualifying limited items per user

## Technical Details

### Architecture

- **Manifest V3**: Modern Chrome extension architecture
- **Service Worker**: Background processing and data management
- **Content Scripts**: Page integration and data extraction
- **Local Storage**: Data persistence and caching

### API Integration

The extension integrates with Roblox's systems to:
- Fetch community member lists
- Retrieve user inventory data
- Calculate limited item values
- Handle pagination for large communities

### Security Features

- **Host Permissions**: Limited to Roblox domains only
- **Data Validation**: Input sanitization and validation
- **Rate Limiting**: Prevents API abuse
- **Local Storage**: No external data transmission

## File Structure

```
roblox-community-wealth-tracker/
├── manifest.json          # Extension configuration
├── popup.html            # Main popup interface
├── popup.css             # Popup styling
├── popup.js              # Popup logic and UI handling
├── content.js            # Content script for Roblox pages
├── background.js         # Background service worker
├── icon16.png            # Extension icon (16x16)
├── icon48.png            # Extension icon (48x48)
├── icon128.png           # Extension icon (128x128)
└── README.md             # This file
```

## Development

### Prerequisites

- Google Chrome browser
- Basic knowledge of HTML, CSS, and JavaScript
- Understanding of Chrome extension development

### Local Development

1. Make changes to the source files
2. Go to `chrome://extensions/`
3. Click the refresh icon on your extension
4. Test changes in the popup

### Building for Production

1. Ensure all files are properly configured
2. Test thoroughly on various Roblox community pages
3. Package the extension for distribution

## Troubleshooting

### Common Issues

**Extension not loading:**
- Check that all files are present
- Verify manifest.json syntax
- Ensure Developer mode is enabled

**Community ID not extracted:**
- Verify link format matches expected pattern
- Check that the community ID is numeric
- Ensure the link is a valid Roblox community URL

**No results displayed:**
- Check internet connection
- Verify community ID is valid
- Try refreshing the data

**Performance issues:**
- Large communities may take time to process
- Use the progress bar to monitor status
- Consider breaking large requests into smaller chunks

### Debug Mode

Enable debug logging by:
1. Opening Chrome DevTools
2. Going to the Console tab
3. Looking for extension-related messages

## Limitations

- **API Rate Limits**: Roblox may limit request frequency
- **Community Size**: Very large communities may timeout
- **Item Availability**: Limited items must be publicly visible
- **Market Volatility**: Item values change frequently

## Future Enhancements

- **Export Functionality**: Save results to CSV/JSON
- **Historical Tracking**: Monitor wealth changes over time
- **Advanced Filtering**: Filter by item type, rarity, etc.
- **Notifications**: Alert when significant wealth changes occur
- **Mobile Support**: Responsive design for mobile devices

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support or questions:
- Create an issue on GitHub
- Check the troubleshooting section
- Review the technical documentation

## Disclaimer

This extension is not affiliated with Roblox Corporation. Use at your own risk and in accordance with Roblox's Terms of Service.