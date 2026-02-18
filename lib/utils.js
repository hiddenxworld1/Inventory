import jwt from "jsonwebtoken"


JWT_SECRET_ADMIN="helloworld"

export function adminToken(userId, res){
  const token = jwt.sign({ userId }, JWT_SECRET_ADMIN, {
    expiresIn: "7d",
  });

  res.cookie("admin", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });

  return token;
};

JWT_SECRET_USER="helloworld"

export function userToken(userId, res){
  const token = jwt.sign({ userId }, JWT_SECRET_USER, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });

  return token;
};
