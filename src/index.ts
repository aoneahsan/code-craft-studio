import { registerPlugin } from '@capacitor/core';

import type { QRCodeStudioPlugin } from './definitions';

const QRCodeStudio = registerPlugin<QRCodeStudioPlugin>('QRCodeStudio', {
  web: () => import('./web').then(m => new m.QRCodeStudioWeb()),
});

export * from './definitions';
export * from './components';
export { QRCodeStudio };