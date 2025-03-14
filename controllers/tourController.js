//API'a gelen tur ile alakalı http isteklerine cevap gönderen bütün dosyalar bu dosya da yer alacak
const Tour = require("../models/tourModel.js");
const APIFeatures = require("../utils/apiFeatures.js");

exports.getAllTours = async (req, res) => {
  try {
    console.log("ORJINAL QUERY", req.query);
    console.log("MW GELEN FORMATLANMIŞ QUERY", req.formattedQuery);

    //1) turlar için sorgu oluştur
    const tourQuery = Tour.find(req.formattedQuery);

    // 2) eğer sort değeri varsa ona göre sırala yoksa en yeniyi en başa koy
    if (req.query.sort) {
      // mongodb dıralanacak fieldların arasına "," değil " " istediği için güncelledik
      tourQuery.sort(req.query.sort.split(",").join(" "));
    } else {
      tourQuery.sort("-createdAt");
    }
    //3) eğer fields parametresi varsa limitle
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      tourQuery.select(fields);
    }

    //4) pagination | sayfalama
    const page = Number(req.query.page) || 1; // mevcut sayfa sayısı
    const limit = Number(req.query.limit) || 10; // sayfa başına eleman sayısı
    const skip = (page - 1) * limit; //limit çalışmadan önce atlanıcak eleman sayısı

    tourQuery.skip(skip).limit(limit);

    //5) sorguyu çalıştır

    const tours = await tourQuery;

    //! selin bunu en son yap
    //! 1) API Features classından örnek al (geriye sorguyu oluşturup döndürür)
    /*
    const features = new APIFeatures(
    Tour.find(),
    req.query,
    req.formattedQuery
    ).filter().sort().limit().pagination()

    sorguyu çalıştır
     const tours = await features.query;


    
    */

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
