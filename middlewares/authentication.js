const { validateToken } = require("../authentication/auth");

function checkForAuthenticationCookie(cookieName){
    return (req, res, next)=>{
        const tokenCookieValue = req.cookies[cookieName]

        if(!tokenCookieValue) return next();

        try{
            const userPayLoad = validateToken(tokenCookieValue)
            req.user = userPayLoad
        }catch(err) {}
        return next();
    }   
}

module.exports = {checkForAuthenticationCookie}