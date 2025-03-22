const User = require("../models/userModel.js");
const jwt = require("jsonwebtoken");

exports.signUp = async (req, res) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    //jwt tokeni oluştur
    const token = jwt.sign(
      { id: newUser._id, role: "admin" },
      //"bu-metin-@@benim!!!çok-gizliiii-!@##şifrem",
      process.env.JWT_SECRET,
      {
        //"30d"
        expiresIn: process.env.JWT_EXP,
      }
    );

    res.status(200).json({
      message: "Hesabınız başarıyla oluşturuldu",
      data: newUser,
      token: token,
    });
  } catch (error) {
    res.status(500).json({
      message: "Hesap oluşturulurken bir hata meydana geldi",
      data: error.message,
    });
  }
};

exports.login = () => {};

exports.logout = () => {};
