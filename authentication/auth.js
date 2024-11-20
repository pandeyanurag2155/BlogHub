const jwt = require("jsonwebtoken");
const secret = 'Haseeb$123@'

function createToken(user) {
    const payload = {
        _id: user._id,
        name: user.fullName,
        email: user.email,
        profileImageURL: user.profileImageURL,
        role: user.role
    };
    
    // creating a token

    // sign(payload, 'secret_key')
    // secret_key act as a stamp on a original currency
    // use to verify whether a random user object is for this cookie or not 

    const token =  jwt.sign(payload, secret)
    return token
}

function validateToken(token) {
    if(!token) return null;
    try{
        const payload =  jwt.verify(token, secret);
        return payload;
    }catch(error){
        return null;
    }
}

module.exports = {
    createToken,
    validateToken
}