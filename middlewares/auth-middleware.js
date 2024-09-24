const jwt = require("jsonwebtoken");

const verifyAuthToken = async (req, res, next) => {
  const cookies = req.cookies["authToken"];
  if (!cookies) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    jwt.verify(cookies, process.env.SECRET_KEY, (err, data) => {
      if (err) {
        return res.status(401).send("Invalid Token");
      }
      req.id = data._id;
      return next();
    });
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
};

module.exports = { verifyAuthToken };
