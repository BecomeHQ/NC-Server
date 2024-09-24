const { google } = require("googleapis");
const spreadsheetId = "1_zUiTWDgaKhnyznPZ_F83rV7v-7lwI76k5BBhTrKXmo";

const auth = new google.auth.GoogleAuth({
  keyFile: "credentials.json",
  scopes: "https://www.googleapis.com/auth/spreadsheets",
});

const getFormData = async (req, res) => {
  const client = await auth.getClient();

  const googleSheets = await google.sheets({ version: "v4", auth: client });

  const allRows = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: "Form-responses!A2:AX",
  });

  const data = {};
  allRows.data.values.map((row) => {
    if (row.length > 0) {
      const currentData = {
        Timestamp: row[0],
        "Your Name": row[1],
        "Your Email": row[2],
        "What are we naming?": row[3],
        "Which sector does your product / service belong to?": row[4],
        "Mention the Trademark classes your product/service belongs to?":
          row[5],
        "Describe your Product/Service?": row[6],
        "Your favourite go to place for peace?": row[7],
        "What need does your product / service cater to?": row[8],
        "What do you think is the differentiating value you provide / What is your USP?":
          row[9],
        "What price segment does your product/service fall in?": row[10],
        "What are the cities/regions you're planning to focus on?": row[11],
        "Do you see yourself expanding to other cities/regions in future? If yes, where?":
          row[12],
        "If your product / service were a person, list the values or beliefs it will always stand by?":
          row[13],
        "What is the ultimate impact you want to create with your product / service? Or WHY does your product / service exist?":
          row[14],
        "How do you think your product / service can achieve the above?":
          row[15],
        "If your product / service were a person, what kind of impact it would want to create?":
          row[16],
        "What is the color of the dress you wore yesterday?": row[17],
        "If your product / service were a person, how would you definitely like it to come across as?":
          row[18],
        "If your product / service were a person, how would you definitely not like it to come across as?":
          row[19],
        "What was the object you last took a photo of?": row[20],
        "What is the age bracket of your Target Audience Group (TG)?": row[21],
        "Which gender of TG is your product / service for?": row[22],
        "What occupation your TG may have?": row[23],
        "How often do you think your product will be purchased?": row[24],
        "Where will your TG find your product / service?": row[25],
        "For what values you want your TG to choose you over the competitor?":
          row[26],
        "How do want your customers to remember you as": row[27],
        "Do you have any additional information about your TG?": row[28],
        "A hero you look upto?": row[29],
        "Clever / Straightforward": row[30],
        "Global / Local": row[31],
        "Formal / Friendly": row[32],
        "Modern / Traditional": row[33],
        "Emotional / Logical": row[34],
        "Scientific / General": row[35],
        "Whimsical / Serious": row[36],
        "Mature / Youthful": row[37],
        "List your competitors (mention website links if available)": row[38],
        "Competitor/other brand names you like": row[39],
        "Competitor/other brand names you dislike": row[40],
        "Choose one OR write the order of priority of what meaning-association would you prefer for the name?":
          row[41],
        "Choose one OR write the order of priority of what meaning-association would you prefer for the name?":
          row[42],
        "What appeal do you want the name to have?": row[43],
        "Emotions or ideas you want the name to evoke?": row[44],
        "Connotations or ideas you want to completely avoid?": row[45],
        "Imagine you're painting. You have no reference and you're in an empty room with no window. What will you draw on your canvas?":
          row[46],
        Pricing: row[47],
        "Name Given": row[48],
        Captured: row[49],
      };
      data[currentData["Your Email"]] = currentData;
    }
  });

  res.send(data);
};

const setFormData = async (req, res) => {
  const { data } = req.body;
  const client = await auth.getClient();

  const googleSheets = google.sheets({
    version: "v4",
    auth: client,
  });
  const response = await googleSheets.spreadsheets.values.append({
    auth,
    spreadsheetId,
    range: "Form-responses",
    valueInputOption: "USER_ENTERED",
    resource: {
      values: [data],
    },
  });
  res.send("done");
};

const updateFormData = async (req, res) => {};

const getFeedbackData = async (req, res) => {
  const client = await auth.getClient();

  const googleSheets = await google.sheets({
    version: "v4",
    auth: client,
  });

  const allRows = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: "Feedback-Sheet!A2:Q",
  });
  const data = {};
  allRows.data.values.map((row) => {
    if (row.length > 0) {
      const currentData = {
        Name: row[0],
        Email: row[1],
        "How aligned are you on our Observation": row[2],
        Comments: row[3],
        "Hear it First - Voice One": row[4],
        "Hear it First - Voice Two": row[5],
        "Hear it First - Voice Three": row[6],
        "Name set One Rating": row[7],
        "Name set Two Rating": row[8],
        "Name set Three Rating": row[9],
        "Name Set One - Suggestion/Feedback": row[10],
        "Name Set Two - Suggestion/Feedback": row[11],
        "Name Set Three - Suggestion/Feedback": row[12],
        "Which naming set you like the most": row[13],
        "Are you completely satisfied with the name?": row[14],
        "Do you prefer another round?": row[15],
        Elaborate: row[16],
      };
      data[currentData["Email"]] = currentData;
    }
  });

  res.send(data);
};

const setFeedbackData = async (req, res) => {
  const { data } = req.body;
  const client = await auth.getClient();

  const googleSheets = google.sheets({
    version: "v4",
    auth: client,
  });

  const allRows = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: "Feedback-Sheet!A2:Q",
  });

  let targetRowIndex = -1;
  if (allRows.data.values) {
    for (let i = 0; i < allRows.data.values.length; i++) {
      const row = allRows.data.values[i];
      if (row.includes(data[1])) {
        targetRowIndex = i;
        break;
      }
    }
  }

  if (targetRowIndex !== -1) {
    return res.send("done");
  }

  const response = googleSheets.spreadsheets.values.append({
    auth,
    spreadsheetId,
    range: "Feedback-Sheet",
    valueInputOption: "USER_ENTERED",
    resource: {
      values: [data],
    },
  });
  res.send("done");
};

const updateFeedbackData = async (req, res) => {
  const { email, columnToUpdate, value } = req.body;
  const client = await auth.getClient();

  const googleSheets = google.sheets({
    version: "v4",
    auth: client,
  });

  const allRows = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: "Feedback-Sheet!A2:Q",
  });

  let targetRowIndex = -1;
  if (allRows.data.values) {
    for (let i = 0; i < allRows.data.values.length; i++) {
      const row = allRows.data.values[i];
      if (row.includes(email)) {
        targetRowIndex = i;
        break;
      }
    }
  }
  if (targetRowIndex !== -1) {
    const updateRequest = await googleSheets.spreadsheets.values.update({
      auth,
      spreadsheetId,
      range: `Feedback-Sheet!${columnToUpdate}${targetRowIndex + 2}`,
      valueInputOption: "USER_ENTERED",
      resource: {
        values: [value],
      },
    });

    res.send(updateRequest.data);
  } else {
    res.send("Row with value 'noothan' not found");
  }
};

module.exports = {
  getFormData,
  updateFormData,
  setFormData,
  getFeedbackData,
  updateFeedbackData,
  setFeedbackData,
};
