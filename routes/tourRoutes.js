//turlar ile alaklaı API'da tanımlanacak bütün endpointleri / route'ları bu dosyada tanımlanır.

const express = require("express");
const {
  getAllTours,
  createTour,
  updateTour,
  deleteTour,
  getTour,
} = require("../controllers/tourController.js");

const router = express.Router();

// ------------ yollar -------------
router.route("/api/tours").get(getAllTours).post(createTour);

router
  .route("/api/tours/:id")
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

module.exports = router;
