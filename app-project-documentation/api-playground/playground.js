// API Playground JavaScript
let currentMethod = null;
let mockQRCodeStudio = null;

// Method configurations
const methodConfigs = {
    scan: {
        title: 'scan(options?)',
        description: 'Start the QR code scanner with camera preview',
        parameters: {
            formats: ['QR_CODE', 'AZTEC', 'DATA_MATRIX'],
            prompt: 'Scan a QR code',
            showFlipCameraButton: true,
            showTorchButton: true,
            preferFrontCamera: false
        },
        mockResponse: {
            content: 'https://example.com',
            type: 'website',
            data: { url: 'https://example.com' },
            timestamp: new Date().toISOString()
        }
    },
    
    stopScan: {
        title: 'stopScan()',
        description: 'Stop the current scanning session',
        parameters: null,
        mockResponse: {}
    },
    
    scanFromFile: {
        title: 'scanFromFile()',
        description: 'Select an image file to scan for QR codes',
        parameters: null,
        mockResponse: {
            content: 'WIFI:T:WPA;S:MyNetwork;P:password123;;',
            type: 'wifi',
            data: {
                ssid: 'MyNetwork',
                password: 'password123',
                security: 'WPA',
                hidden: false
            },
            timestamp: new Date().toISOString()
        }
    },
    
    generate: {
        title: 'generate(options)',
        description: 'Generate a QR code with customization options',
        parameters: {
            type: 'WEBSITE',
            data: {
                url: 'https://example.com',
                title: 'Example Website'
            },
            options: {
                size: 300,
                foreground: '#000000',
                background: '#FFFFFF',
                errorCorrection: 'M',
                format: 'png',
                quality: 0.9
            }
        },
        mockResponse: {
            content: 'https://example.com',
            type: 'website',
            format: 'png',
            data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA...',
            size: { width: 300, height: 300 }
        }
    },
    
    checkPermissions: {
        title: 'checkPermissions()',
        description: 'Check current permission status for camera and photos',
        parameters: null,
        mockResponse: {
            camera: 'granted',
            photos: 'prompt'
        }
    },
    
    requestPermissions: {
        title: 'requestPermissions(options)',
        description: 'Request specific permissions from the user',
        parameters: {
            permissions: ['camera', 'photos']
        },
        mockResponse: {
            camera: 'granted',
            photos: 'granted'
        }
    },
    
    getHistory: {
        title: 'getHistory()',
        description: 'Get the scan and generation history',
        parameters: null,
        mockResponse: {
            items: [
                {
                    id: '1234-5678-9012',
                    content: 'https://example.com',
                    type: 'website',
                    source: 'scan',
                    timestamp: new Date(Date.now() - 3600000).toISOString()
                },
                {
                    id: '2345-6789-0123',
                    content: 'Hello World',
                    type: 'text',
                    source: 'generate',
                    timestamp: new Date(Date.now() - 7200000).toISOString()
                }
            ]
        }
    },
    
    clearHistory: {
        title: 'clearHistory()',
        description: 'Clear all scan and generation history',
        parameters: null,
        mockResponse: {}
    }
};

// Initialize playground
function initPlayground() {
    // Create mock QRCodeStudio object
    mockQRCodeStudio = {
        scan: (options) => simulateAsync(methodConfigs.scan.mockResponse),
        stopScan: () => simulateAsync(methodConfigs.stopScan.mockResponse),
        scanFromFile: () => simulateAsync(methodConfigs.scanFromFile.mockResponse),
        generate: (options) => simulateAsync(methodConfigs.generate.mockResponse),
        checkPermissions: () => simulateAsync(methodConfigs.checkPermissions.mockResponse),
        requestPermissions: (options) => simulateAsync(methodConfigs.requestPermissions.mockResponse),
        getHistory: () => simulateAsync(methodConfigs.getHistory.mockResponse),
        clearHistory: () => simulateAsync(methodConfigs.clearHistory.mockResponse)
    };
}

// Simulate async response
function simulateAsync(response) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(response), 500);
    });
}

// Select method
function selectMethod(method) {
    currentMethod = method;
    const config = methodConfigs[method];
    
    // Update UI
    document.getElementById('methodTitle').textContent = config.title;
    document.getElementById('methodDescription').textContent = config.description;
    
    // Show/hide parameters section
    const parametersSection = document.getElementById('parametersSection');
    const executeSection = document.getElementById('executeSection');
    
    if (config.parameters) {
        parametersSection.classList.remove('hidden');
        document.getElementById('parametersEditor').value = JSON.stringify(config.parameters, null, 2);
    } else {
        parametersSection.classList.add('hidden');
    }
    
    executeSection.classList.remove('hidden');
    
    // Hide results
    document.getElementById('resultsSection').classList.add('hidden');
    document.getElementById('errorSection').classList.add('hidden');
}

// Execute method
async function executeMethod() {
    if (!currentMethod) return;
    
    try {
        // Get parameters
        let params = null;
        const config = methodConfigs[currentMethod];
        
        if (config.parameters) {
            const paramsText = document.getElementById('parametersEditor').value;
            params = JSON.parse(paramsText);
        }
        
        // Show loading state
        document.getElementById('resultsSection').classList.remove('hidden');
        document.getElementById('resultJson').textContent = 'Executing...';
        
        // Execute method
        const result = await mockQRCodeStudio[currentMethod](params);
        
        // Show results
        showResults(result);
        
    } catch (error) {
        showError(error.message || 'An error occurred');
    }
}

// Show results
function showResults(result) {
    // Show response
    document.getElementById('resultJson').textContent = JSON.stringify(result, null, 2);
    
    // Generate code example
    generateCodeExample();
    
    // Show preview if applicable
    if (currentMethod === 'generate' && result.data) {
        showQRPreview(result.data);
    }
    
    // Show results section
    document.getElementById('resultsSection').classList.remove('hidden');
    document.getElementById('errorSection').classList.add('hidden');
    
    // Highlight JSON
    highlightJSON();
}

// Show error
function showError(message) {
    document.getElementById('errorMessage').textContent = message;
    document.getElementById('errorSection').classList.remove('hidden');
    document.getElementById('resultsSection').classList.add('hidden');
}

// Show result tab
function showResultTab(tab) {
    // Update tab buttons
    ['response', 'preview', 'code'].forEach(t => {
        const tabButton = document.getElementById(t + 'Tab');
        const tabContent = document.getElementById(t + 'Content');
        
        if (t === tab) {
            tabButton.classList.add('tab-active');
            tabContent.classList.remove('hidden');
        } else {
            tabButton.classList.remove('tab-active');
            tabContent.classList.add('hidden');
        }
    });
    
    // Re-highlight code if showing code tab
    if (tab === 'code') {
        Prism.highlightAll();
    }
}

// Generate code example
function generateCodeExample() {
    const config = methodConfigs[currentMethod];
    let code = '';
    
    if (config.parameters) {
        const params = document.getElementById('parametersEditor').value;
        code = `import { QRCodeStudio } from 'qrcode-studio';

try {
  const result = await QRCodeStudio.${currentMethod}(${params});
  console.log('Result:', result);
} catch (error) {
  console.error('Error:', error);
}`;
    } else {
        code = `import { QRCodeStudio } from 'qrcode-studio';

try {
  const result = await QRCodeStudio.${currentMethod}();
  console.log('Result:', result);
} catch (error) {
  console.error('Error:', error);
}`;
    }
    
    document.getElementById('codeExample').textContent = code;
}

// Show QR preview
function showQRPreview(dataUrl) {
    const preview = document.getElementById('qrPreview');
    
    if (dataUrl.startsWith('data:image')) {
        preview.innerHTML = `
            <img src="${dataUrl}" alt="Generated QR Code" class="mx-auto border rounded-lg shadow-lg">
            <p class="mt-4 text-sm text-gray-600">Right-click to save image</p>
        `;
    } else {
        // Create a mock QR code for demonstration
        preview.innerHTML = `
            <div class="bg-white p-8 rounded-lg shadow-lg inline-block">
                <div class="bg-gray-200 w-64 h-64 flex items-center justify-center">
                    <span class="text-gray-500">QR Code Preview</span>
                </div>
            </div>
            <p class="mt-4 text-sm text-gray-600">Actual QR code would appear here</p>
        `;
    }
}

// Highlight JSON
function highlightJSON() {
    const jsonElement = document.getElementById('resultJson');
    const text = jsonElement.textContent;
    
    try {
        const obj = JSON.parse(text);
        const highlighted = syntaxHighlight(JSON.stringify(obj, null, 2));
        jsonElement.innerHTML = highlighted;
    } catch (e) {
        // Not valid JSON, leave as is
    }
}

// Simple JSON syntax highlighter
function syntaxHighlight(json) {
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        let cls = 'text-gray-800';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'text-blue-600 font-medium';
            } else {
                cls = 'text-green-600';
            }
        } else if (/true|false/.test(match)) {
            cls = 'text-purple-600';
        } else if (/null/.test(match)) {
            cls = 'text-gray-500';
        } else {
            cls = 'text-orange-600';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

// Initialize on load
document.addEventListener('DOMContentLoaded', initPlayground);