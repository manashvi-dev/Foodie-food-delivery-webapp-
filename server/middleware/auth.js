const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const reqhead = req.header("Authorization");

  if (!reqhead)
    return res.status(401).json({ msg: "No token, access denied" });

  const [bearer, token] = reqhead.split(" ");

  if (bearer !== "Bearer" || !token)
    return res.status(401).json({ msg: "Invalid token format" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err){
      return res.status(401).json({ msg: err });
    }
    req.user = user;
    next();
  });
};