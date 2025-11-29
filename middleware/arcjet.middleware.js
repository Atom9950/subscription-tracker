import aj from "../config/arcjet.js";

const arcjetMiddleware = async (req, res, next) => {
    try {
        const decision = await aj.protect(req, {requested:1});
        
        if(decision.isDenied()){
            // Check rate limit first and RETURN immediately
            if(decision.reason.isRateLimit){
                return res.status(429).json({ message: "Rate limit exceeded" });
            }
            
            // Check bot and RETURN immediately
            if(decision.reason.isBot){
                return res.status(403).json({ message: "Bot detected" });
            }

            // Default denial response
            return res.status(403).json({ message: "Access denied" });
        }
        
        // Only proceed if not denied
        next();
    } catch (error) {
        console.error(`Arcjet Middleware Error:`, error);
        // Return error response and don't call next()
        return res.status(500).json({ message: "Security check failed" });
    }
}

export default arcjetMiddleware;