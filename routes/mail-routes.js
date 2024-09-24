const router = require("../utils/router-instance");
const { sendMail, notifyUser } = require("../controllers/mail-controllers");

router.post("/send-mail", sendMail);
router.post("/notify", notifyUser);

module.exports = router;
