import {
  signupUser,
  loginUser,
  logoutUser,
  getUserById,
} from "../services/auth.service.js";

export const signup = async (req, res, next) => {
  try {
    const { user, token } = await signupUser(req.body);

    res.status(201).json({ user, token });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { user, token } = await loginUser(req.body);

    res.status(200).json({ user, token });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    await logoutUser(req.user);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    const user = await getUserById(req.user.id);

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
