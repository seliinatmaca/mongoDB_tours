const { Schema, model } = require("mongoose");

const validator = require("validator");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

// kullanıcı şema
const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "Kullanıcı isim değerine sahip olmalıdır"],
  },

  email: {
    type: String,
    required: [true, "Kullanıcı email değerine sahip olmalıdır"],
    unique: [true, "Bu eposta adresine ait kayıtlı bir hesap bulunmaktadır"],
    validate: [validator.isEmail, "Lütfen geçerli bir email giriniz"],
  },

  photo: {
    type: String,
    default: "defaultpic.webp",
  },
  password: {
    type: String, //
    required: [true, "Kullanıcı şifre değerine sahip olmalıdır"],
    minLength: [8, "Şifre en az 8 karakter içermeli"],
    validate: [validator.isStrongPassword, "Şifreniz yeterince güçlü değil"],
  },

  passwordConfirm: {
    type: String,
    required: [true, "Lütfen şifrenizi onaylayın"],
    validate: {
      validator: function (value) {
        return value === this.password;
      },
      message: "Onay şifreniz eşleşmiyor",
    },
  },

  role: {
    type: String,
    enum: ["user", "guide", "lead-guide", "admin"],
    default: "user",
  },

  active: {
    type: Boolean,
    default: true,
  },
});

// 1) Veritabanına kullanıcıyı kaydetmeden önce
// * password alanını şifreleme algoritmalarından geçir.
// * passwordConfirm alanını kaldır
userSchema.pre("save", async function (next) {
  // daha önce parola hashlendiyse aşağıdaki adımları atla
  if (!this.isModified("password")) return next();

  // şifreyi hashle ve saltla
  this.password = await bcrypt.hash(this.password, 12);

  // onay şifreisni kaldır
  this.passwordConfirm = undefined;
});

//kullanıcı modeli
const User = model("User", userSchema);

module.exports = User;
