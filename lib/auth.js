import jwt from 'jsonwebtoken';

const generate_access_token = (user) => {
    return jwt.sign(
        { id: String(user.id), email: String(user.email),name:String(user.name) },  // Ensure values are strings
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_LIFETIME }
    );
};

const generate_refresh_token = (user) => {
    return jwt.sign(
        { id: String(user.id), email: String(user.email) ,name:String(user.name)},  // Ensure values are strings
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_LIFETIME }
    );
};




export { generate_access_token, generate_refresh_token };
