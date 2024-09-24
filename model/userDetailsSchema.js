const { Schema, model } = require("mongoose");

const userDetails = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  accessNamingSet: {
    type: Boolean,
    default: false,
  },
  accessSecondRound: {
    type: Boolean,
    default: false,
  },
  accessedPages: {
    type: Object,
    properties: {
      forms: {
        type: Boolean,
        default: false,
      },
      auditPage: {
        type: Boolean,
        default: false,
      },
      namingSet: {
        type: Boolean,
        default: false,
      },
      firstName: {
        type: Boolean,
        default: false,
      },
      secondName: {
        type: Object,
        properties: {
          isRequired: {
            type: Boolean,
            default: false,
          },
          hasSeen: {
            type: Boolean,
            default: false,
          },
        },
      },
      selectedName: {
        type: Boolean,
        default: false,
      },
    },
  },
});

const UserSchema = model("userDetails", userDetails);

module.exports = UserSchema;
