const router = require("../utils/router-instance");
const {
  getFormData,
  updateFormData,
  setFormData,
  getFeedbackData,
  updateFeedbackData,
  setFeedbackData,
} = require("../controllers/excel-controllers");

router.get("/get-form-data", getFormData);
router.post("/set-form-data", setFormData);
router.patch("/update-form-data", updateFormData);

router.get("/get-feedback-data", getFeedbackData);
router.post("/set-feedback-data", setFeedbackData);
router.patch("/update-feedback-data", updateFeedbackData);

module.exports = router;
