//API'a gelen tur ile alakalı http isteklerine cevap gönderen bütün dosyalar bu dosya da yer alacak
const Tour = require("../models/tourModel.js");
const APIFeatures = require("../utils/apiFeatures.js");

// zorluğa göre istatistikleri hesapla
exports.getTourStats = async (req, res, next) => {
  // Aggregation Pipeline
  // Raporlama Adımları
  const stats = await Tour.aggregate([
    // 1.Adım ) ratingi 4 ve üzeri olan turları al
    {
      $match: { ratingsAverage: { $gte: 4.0 } },
    },
    // 2.Adım ) zorluklarına göre gruplandır ve ortalam değerlerini hesapla
    {
      $group: {
        _id: "$difficulty",
        count: { $sum: 1 },
        avgRating: { $avg: "$ratingsAverage" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" },
      },
    },
    // 3.Adım ) gruplanan veriyi fiyata göre artan sırala
    { $sort: { avgPrice: 1 } },
    // 4.Adım ) fiyatı 400den küçük olan zorlukları kaldır
    { $match: { avgPrice: { $gte: 500 } } },
  ]);

  res.status(200).json({
    message: "Rapor oluşturuldu",
    stats,
  });
};

// yıla göre istastikleri hesapla
exports.getMonthlyPlan = async (req, res, next) => {
  // parametre olarak gelen yılı al
  const year = Number(req.params.year);

  // raporlama adımları
  const stats = await Tour.aggregate([
    {
      $unwind: {
        path: "$startDates",
      },
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: {
          $month: "$startDates",
        },
        count: {
          $sum: 1,
        },
        tours: {
          $push: "$name",
        },
      },
    },
    {
      $addFields: {
        month: "$_id",
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: {
        month: 1,
      },
    },
  ]);

  res.status(200).json({
    message: `${year} yılı için aylık plan oluşturuldu`,
    stats,
  });
};

// günün fırsatları için gerekli filtrelemeyi ayarlar
exports.aliasTopTours = async (req, res, next) => {
  req.query.sort = "-ratingsAverage,-ratingsQuantity";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  req.query["price[lte]"] = 1200;
  req.query.limit = 5;

  next();
};

exports.getAllTours = async (req, res) => {
  try {
    //! 1) API Features classından örnek al (geriye sorguyu oluşturup döndürür)

    const features = new APIFeatures(Tour.find(), req.query, req.formattedQuery)
      .filter()
      .sort()
      .limit()
      .pagination();

    //sorguyu çalıştır
    const tours = await features.query;

    res.status(200).json({
      message: "Bütün turlar alınıdı",
      results: tours.length,
      tours,
    });
  } catch (error) {
    res.status(400).json({ message: "Bir hata oluştu", error: error.message });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({ message: "Yeni tur oluşturuldu", tour: newTour });
  } catch (error) {
    res.status(400).json({ message: "Bir hata oluştu", error: error.message });
  }
};

// id'sine göre bir tur alır
exports.getTour = async (req, res) => {
  console.log(req.params);
  console.log(req.params.id);
  try {
    const tour = await Tour.findById(req.params.id);

    res.status(200).json({ message: "Bir tur alındı", tour });
  } catch (error) {
    res.status(400).json({ message: "Bir hata oluştu", error: error.message });
  }
};

//id'sine göre bir turu güncelle
exports.updateTour = async (req, res) => {
  try {
    const updateTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json({ message: "Tur Güncellendi", tour: updateTour });
  } catch (error) {
    res.status(400).json({ message: "Bir hata oluştu", error: error.message });
  }
};

//id'sine göre bir turu sil
exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({ message: "Tur silindi" });
  } catch (error) {
    res.status(400).json({ message: "Bir hata oluştu", error: error.message });
  }
};
