// tour verisinin backendde yönetimi için schema ve model dosya da tanımlanacak

const { Schema, model } = require("mongoose");

// veritabanına kaydedilecek olan verilerin  kısıtlamalarını yazıcaz
const tourSchema = new Schema({
  name: {
    type: String,
    unique: [true, "İsim değeri benzersiz olmalı"],
    required: [true, "Tur isim değerine sahip olmalı"],
  },
  duration: {
    type: Number,
    required: [true, "Tur süre değerine sahip olmalıdır"],
  },
  maxGroupSize: {
    type: Number,
    required: [true, "Tur max kişi sayısı değerine sahip olmalı"],
  },
  difficulty: {
    type: String,
    required: [true, "Tur zorluk değerine sahip olmalı"],
    enum: ["easy", "medium", "hard", "difficult"],
  },
  ratingsAverage: {
    type: Number,
    min: [1, "Rating 1'den küçük olamaz"],
    max: [5, "Rating 5'den büyük olamaz"],
    default: 4.0,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },

  price: {
    type: Number,
    required: [true, "Tur fiyat değerine sahip olmalı"],
  },

  summary: {
    type: String,
    maxLength: [200, "Özet alanı 200 karakteri geçemez"],
    trim: true,
    required: [true, "Tur özet değerine sahip olmalı"],
  },

  description: {
    type: String,
    maxLength: [1000, "Özet alanı 200 karakteri geçemez"],
    trim: true,
    required: [true, "Tur açıklama değerine sahip olmalı"],
  },
  imageCover: {
    type: String,
    required: [true, "Tur resim değerine sahip olmalı"],
  },
  images: {
    type: [String],
  },
  startDates: {
    type: [Date],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

//model oluştur (veritanaınd akş tur verisini yönetmek için kullanacağız)
const Tour = model("Tour", tourSchema);

module.exports = Tour;
