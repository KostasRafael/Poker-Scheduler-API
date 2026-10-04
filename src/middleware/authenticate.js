import jwt from "jsonwebtoken";
import { isTokenRevoked } from "../services/auth.service.js";

const invalidToken = (res) => {
  return res.status(401).json({
    error: {
      code: "INVALID_TOKEN",
      message: "Invalid or expired token",
    },
  });
};

// Requires a valid, non-revoked "Authorization: Bearer <token>" header
// and exposes the authenticated user's id as req.user.id
export const authenticate = async (req, res, next) => {
  const [scheme, token] = (req.headers.authorization || "").split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({
      error: {
        code: "UNAUTHORIZED",
        message: "Authentication required",
      },
    });
  }

  let payload;

  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return invalidToken(res);
  }

  if (!payload.jti || (await isTokenRevoked(payload.jti))) {
    return invalidToken(res);
  }

  req.user = {
    id: payload.sub,
    tokenId: payload.jti,
    tokenExpiresAt: new Date(payload.exp * 1000),
  };

  next();
};
