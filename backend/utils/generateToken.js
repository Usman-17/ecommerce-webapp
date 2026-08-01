import jwt from "jsonwebtoken";

// Function to generate a user token and set it in a user-specific cookie
export const generateToken = (userId, res, rememberMe = false) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: rememberMe ? "30d" : "15d",
  });

  const maxAge = rememberMe
    ? 30 * 24 * 60 * 60 * 1000
    : 15 * 24 * 60 * 60 * 1000;

  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge,
    sameSite: "strict",
  });
};
