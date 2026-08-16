const router = require("express").Router();
const {
  registerUser,
  loginUser,
  refreshTokens,
  logoutUser,
  getCurrentUser,
} = require("../controllers/auth");
const authMiddleware = require("../middlewares/authMiddleware");
const validate = require("../middlewares/validate");
const { registerSchema, loginSchema } = require("../validators/auth");

router.post("/register", validate(registerSchema), registerUser);

router.post("/login", validate(loginSchema), loginUser);

router.post("/refresh", refreshTokens);

router.post("/logout", logoutUser);

router.use(authMiddleware);

router.get("/me", getCurrentUser);

module.exports = router;
