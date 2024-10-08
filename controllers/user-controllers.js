const userDetails = require("../model/userDetailsSchema");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");

const userLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await userDetails.findOne({ email });
    if (!user) {
      return res.status(400).send("User not found");
    }
    const isValidPassword = user.password === password;
    if (!isValidPassword) {
      return res.status(401).json({ message: "invalid credentials" });
    }
    const authToken = jwt.sign({ _id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "15hr",
    });

    res.cookie("authToken", authToken, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 60 * 60 * 1000 * 15,
    });

    const userData = {
      email: user.email,
      name: user.name,
      accessPages: user.accessPages,
    };

    return res.status(200).send({ user: { ...userData }, isValid: true });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: "Internal server error",
      user: { userData },
      isValid: true,
    });
  }
};

const handleVerifyAuth = async (req, res) => {
  try {
    const user = await userDetails.findById(req.id, "-password");
    if (!user) {
      return res.status(404).send({ user: {}, isValid: false });
    }
    return res.status(200).send({ user: user, isValid: true });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal server error");
  }
};

const handleAddNewUser = async (req, res) => {
  try {
    const { userEmail, userPassword, userName } = req.body;
    const data = {
      name: userName,
      email: userEmail,
      password: userPassword,
      accessNamingSet: false,
      accessSecondRound: false,
      accessedPages: {
        forms: false,
        auditPage: false,
        namingSet: false,
        firstName: false,
        secondName: {
          isRequired: false,
          hasSeen: false,
        },
        selectedName: false,
      },
    };
    const user = new userDetails(data);
    await user.save();
    return res.status(200).send("successfully added new user");
  } catch (error) {
    console.log("error while adding new User", error);
    return res.status(500).send("Internal server error");
  }
};

const userLogout = (req, res) => {
  res.clearCookie("authToken");
  return res.status(200).send({ message: "Successfully logged out" });
};

const updateNaming = async (req, res) => {
  const { data, email, name, userMailMessage } = req.body;
  try {
    const user = await userDetails.updateOne(
      { email },
      {
        [data]: true,
      }
    );
    if (!user) {
      return res.status(404).send({ user: {}, isValid: false });
    } else {
      let service = {
        service: "gmail",
        auth: {
          user: process.env.FROM_ADMIN_MAIL,
          pass: process.env.MAIL_PASS_KEY,
        },
      };

      const transport = nodemailer.createTransport(service);
      let MailGenerator = new Mailgen({
        theme: "default",
        product: {
          name: "Become",
          link: "https://mailgen.js/",
        },
      });

      const userMessage = {
        body: {
          name: name, // it will show Hi with this name as heading
          intro: userMailMessage, // message after heading
          outro:
            "Need help, or have questions? Just ask your query to this mail ink@become.team, sam@become.team", // end it will be written like this
        },
      };

      const userMail = await MailGenerator.generate(userMessage);
      const userMailOptions = {
        from: userMail,
        to: email,
        subject: "Nomencapture", // main title before opening the mail
        html: userMail,
      };

      transport
        .sendMail(userMailOptions)
        .then(async (response) => {
          return res.status(200).send({
            msg: "Messages sent successfully",
          });
        })
        .catch((err) => {
          console.log(err);
          return res.status(500).send({
            msg: "Messages could not be sent",
          });
        });
    }
  } catch (error) {
    console.log("error while updating naming", error);
    return res.status(500).send("Internal server error");
  }
};

module.exports = {
  userLogin,
  handleVerifyAuth,
  handleAddNewUser,
  userLogout,
  updateNaming,
};
