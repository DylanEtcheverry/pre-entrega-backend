export default function createHealthController(envConfig) {
  return function getHealth(req, res) {
    res.json({ status: 'ok', env: envConfig.NODE_ENV });
  };
}