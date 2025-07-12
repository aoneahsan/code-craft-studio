# QRCode Studio API Playground

An interactive web-based tool for testing and exploring the QRCode Studio API methods.

## Features

- **Interactive Testing**: Test all API methods with customizable parameters
- **Live Preview**: See generated QR codes instantly
- **Code Examples**: Get ready-to-use code snippets for each method
- **Mock Responses**: Realistic API responses for development
- **Parameter Editor**: JSON editor with syntax highlighting
- **Error Handling**: See how errors are returned

## Usage

### Local Development

1. Open `index.html` in a web browser:
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server -p 8000

# Then open http://localhost:8000/index.html
```

### Integration with Documentation Site

Add to your Docusaurus site:

```jsx
// In a documentation page
import BrowserOnly from '@docusaurus/BrowserOnly';

export default function APIPlayground() {
  return (
    <BrowserOnly>
      {() => (
        <iframe
          src="/api-playground/index.html"
          width="100%"
          height="800px"
          frameBorder="0"
          title="API Playground"
        />
      )}
    </BrowserOnly>
  );
}
```

## Available Methods

### Scanner Methods
- `scan()` - Start QR code scanning
- `stopScan()` - Stop current scan
- `scanFromFile()` - Scan from image file

### Generator Methods
- `generate()` - Generate QR code with options

### Permission Methods
- `checkPermissions()` - Check permission status
- `requestPermissions()` - Request permissions

### History Methods
- `getHistory()` - Get scan/generate history
- `clearHistory()` - Clear all history

## Customization

### Adding New Methods

Edit `playground.js`:

```javascript
const methodConfigs = {
  newMethod: {
    title: 'newMethod(options)',
    description: 'Description of the method',
    parameters: {
      // Default parameters
      param1: 'value1',
      param2: true
    },
    mockResponse: {
      // Mock response data
      success: true,
      data: {}
    }
  }
};
```

### Styling

The playground uses Tailwind CSS. Customize styles in `index.html`:

```html
<style>
  /* Custom styles */
  .method-card {
    /* Your styles */
  }
</style>
```

### Mock Data

Update mock responses in `playground.js`:

```javascript
mockQRCodeStudio = {
  yourMethod: (options) => simulateAsync({
    // Your mock response
  })
};
```

## Features in Detail

### Parameter Editor
- JSON syntax highlighting
- Auto-formatting
- Validation before execution
- Default parameter templates

### Response Viewer
- Formatted JSON output
- Syntax highlighting
- Copy-to-clipboard functionality
- Response time display

### Code Examples
- TypeScript/JavaScript examples
- Import statements included
- Error handling demonstrated
- Copy-ready snippets

### QR Preview
- Visual preview for generated QR codes
- Download functionality
- Multiple format support
- Size indicators

## API Response Format

All methods return promises that resolve to specific formats:

```typescript
// Scan response
{
  content: string;
  type: string;
  data: object;
  timestamp: string;
}

// Generate response
{
  content: string;
  type: string;
  format: string;
  data: string; // Base64 encoded image
  size: {
    width: number;
    height: number;
  };
}

// Permission response
{
  camera: 'granted' | 'denied' | 'prompt';
  photos: 'granted' | 'denied' | 'prompt';
}
```

## Development

### Dependencies
- Tailwind CSS (via CDN)
- Prism.js for syntax highlighting
- No framework dependencies

### File Structure
```
api-playground/
├── index.html      # Main playground interface
├── playground.js   # Playground logic
└── README.md      # This file
```

### Testing
1. Test all methods work correctly
2. Verify parameter validation
3. Check responsive design
4. Test error scenarios

## Deployment

### Static Hosting
Can be deployed to any static hosting:
- GitHub Pages
- Netlify
- Vercel
- S3 + CloudFront

### CORS Considerations
If integrating with real API:
- Configure CORS headers
- Use appropriate origins
- Handle preflight requests

## Future Enhancements

1. **Real API Integration**
   - Toggle between mock and real API
   - API key configuration
   - Rate limiting display

2. **Advanced Features**
   - Request history
   - Save/load parameter sets
   - Export test cases
   - Performance metrics

3. **Collaboration**
   - Share playground links
   - Embed in documentation
   - Export as curl commands

---

*The API Playground is designed to help developers quickly understand and test the QRCode Studio API without writing code.*