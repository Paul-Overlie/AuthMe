const express = require('express')
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateSignup = [
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Please provide a valid email.'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Please provide a username with at least 4 characters.'),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  handleValidationErrors
];

// Sign up
router.post(
    '/',
    validateSignup,
    async (req, res) => {
      const { email, password, username, firstName, lastName } = req.body;
      const hashedPassword = bcrypt.hashSync(password);
      
      let emailedUser = await User.unscoped().findOne({
        where: {email}
      })
      // console.log("email", email, "oldEmail", emailedUser)
      
      if(emailedUser&&emailedUser.email===email) {
        let err = {}
        res.status=500
        err.message="User already exists"
        err.errors={
        email:"User with that email already exists"}
        console.log(err)
        res.json(err)
      }

      let namedUser = await User.unscoped().findOne({
        where: {username}
      })
      console.log("username", username, "namedUsername", namedUser)

      if(namedUser.username===username) {
        let nameErr={}
        res.status=400
        nameErr.message = "Bad Request",
        nameErr.errors={
          email: "Invalid email",
          username: "Username is required",
          firstName: "First Name is required",
          lastName: "Last Name is required"
        }
        res.json(nameErr)
      }

      const user = await User.create({ firstName, lastName, email, username, hashedPassword });
  
      const safeUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
      };
  
      await setTokenCookie(res, safeUser);
  
      return res.json({
        user: safeUser
      });
    }
  );

module.exports = router;