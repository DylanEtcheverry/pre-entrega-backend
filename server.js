import envConfig from './src/config/env.config.js';
import app from './src/app.js';

app.listen(envConfig.PORT, () => {
  console.log(`Server running on http://localhost:${envConfig.PORT}`);
});
