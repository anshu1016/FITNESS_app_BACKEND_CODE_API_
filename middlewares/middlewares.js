const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || "Gangadhar Hi Shaktiman Hai";

function authenticateJWT(req, res, next) {
   console.log("MIDDLEWARE CALLED");
  const authHeader = req.headers['authorization'] || req.headers['Authorization']||"";

  

   const token = authHeader.split('Bearer ')[1]; 
 console.log(token)
   if (token) {
     console.log(token)
      jwt.verify(token, JWT_SECRET, (err, user) => {
         if (err) {
            console.error('Token verification failed', err);
            return res.status(403).send('Forbidden');
         }
         console.log('User from token:', user);
         req.user = user;
         next();
      });
   } else {
      console.error('Token not provided');
      return res.status(401).send('Unauthorized');
   }
}

module.exports = { authenticateJWT }