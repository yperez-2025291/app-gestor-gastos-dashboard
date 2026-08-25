import app from './app.js';
import { ENV } from './config/environment.js';

app.listen(ENV.PORT, () => {
  console.log(`🚀 Servidor ejecutándose en http://localhost:${ENV.PORT}`);
  console.log(`📡 Estado API: http://localhost:${ENV.PORT}/api/health`);
  console.log(`🔧 Modo: ${ENV.NODE_ENV}`);
});