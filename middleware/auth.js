import jwt from 'jsonwebtoken';

const config = process.env;

// This middleware checks if a valid token is provided.
// If valid, it decodes it and attaches the decoded payload to req.user.
// Works for both user and admin tokens.
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  console.log(token)
  if (!token) {
    return res.status(403).send('A token is required for authentication');
  }

  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send('Invalid Token');
  }

  return next();
};

// This middleware checks if the user is an admin by inspecting req.user.
// It should be used *after* verifyToken. If req.user.adminType exists
// and is one of the allowed admin roles, access is granted.
const verifyAdmin = (req, res, next) => {
  const allowedTypes = ['SUPER_ADMIN', 'ADMIN', 'MODERATOR'];
  console.log(req.user, allowedTypes)
  if (!req.user || !allowedTypes.includes(req.user.adminType)) {
    return res.status(403).send('Admin access required');
  }

  return next();
};

export { verifyToken, verifyAdmin };




// import jwt from 'jsonwebtoken';

// const config = process.env;

// const verifyToken = (req, res, next) => {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];
//   if (!token) {
//     return res.status(403).send('A token is required for authentication');
//   }

//   try {
//     const decoded = jwt.verify(token, config.TOKEN_KEY);
//     req.user = decoded;
//   } catch (err) {
//     return res.status(401).send('Invalid Token');
//   }

//   return next();
// };

// export default verifyToken;
