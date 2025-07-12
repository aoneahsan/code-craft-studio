#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

console.log();
log('🎉 Thank you for installing QRCode Studio!', 'bright');
console.log();

log('📚 Quick Start:', 'blue');
console.log('   1. Run setup: npx qrcode-studio-setup');
console.log('   2. Import components: import { QRStudio } from "qrcode-studio"');
console.log('   3. Start building your QR code app!');
console.log();

log('📖 Resources:', 'blue');
console.log('   - Documentation: https://github.com/aoneahsan/qrcode-studio#readme');
console.log('   - Examples: Check qrcode-studio-examples.tsx after setup');
console.log('   - Issues: https://github.com/aoneahsan/qrcode-studio/issues');
console.log();

log('💡 Tip:', 'yellow');
console.log('   For a complete app setup, run: npx qrcode-studio-setup');
console.log();