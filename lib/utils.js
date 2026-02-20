import jwt from "jsonwebtoken"

export function adminToken(userId, res){
  const token = jwt.sign({ userId }, process.env.JWT_SECRET_ADMIN, {
    expiresIn: "7d",
  });

  // configure cookie differently based on environment
  const cookieOptions = {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
  };

  res.cookie("admin", token, cookieOptions);

  return token;
};



export function userToken(userId, res){
  const token = jwt.sign({ userId }, process.env.JWT_SECRET_USER, {
    expiresIn: "7d",
  });

  const cookieOptions = {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
  };

  res.cookie("jwt", token, cookieOptions);

  return token;
};
