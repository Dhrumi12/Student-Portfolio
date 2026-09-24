export default function requestLogger(req, _res, next) {
  console.log(`${req.method} ${req.originalUrl} - ${new Date().toISOString()}`)
  next()
}