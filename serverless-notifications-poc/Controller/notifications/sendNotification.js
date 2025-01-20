const axios = require("axios");
const { mongoConnect } = require("../../database/mongoConnect");

const getNotification = async (city) => {
  try {
    const options = {
      method: "GET",
      url: process.env.EXTERNALAPI,
      params: {
        query: `events in ${city}`,
        date: "month",
        start: "0",
      },
      headers: {
        "X-RapidAPI-Key": process.env.KEY,
        "X-RapidAPI-Host": process.env.HOST,
      },
    };

    let eventsResults = [];
    const result = await axios.request(options);
    result.data.data.forEach(e => {
       eventsResults.push({
         eventName: e.name,
         eventDescription: e.description,
         link: e.link,
         startDate: e.start_time,
         endDate: e.end_time,
       });
    })
    return eventsResults;
  } catch (error) {
    throw new Error(error);
  }
};

async function sendNotification(event, context) {
  try {
    const location = event.pathParameters.location;
    const result = await getNotification(location);
    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        msg: "Some error occured",
        err: error,
      }),
    };
  }
}

module.exports.handler = sendNotification;
