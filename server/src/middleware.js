import rateLimit from "express-rate-limit";

// Rate limiter: 20 messages per minute per user/IP
export const chatLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20, // limit each IP to 20 requests per windowMs
  message: "Too many messages. Please wait before sending another.",
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  keyGenerator: (req, res) => {
    // Use userId if available, otherwise use IP
    return req.body?.userId || req.ip;
  },
});
