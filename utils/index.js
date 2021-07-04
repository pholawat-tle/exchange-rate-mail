const axios = require("axios");

function getTodaysDate() {
  const d = new Date();
  const date = isOneDigit(d.getDate()) ? `0${d.getDate()}` : d.getDate();
  const month = isOneDigit(d.getMonth())
    ? `0${d.getMonth() + 1}`
    : d.getMonth() + 1;
  const year = d.getFullYear();
  return `${year}-${month}-${date}`;
}

function getYesterdaysDate() {
  const td = new Date();
  const d = new Date();
  d.setDate(td.getDate() - 1);
  const date = isOneDigit(d.getDate()) ? `0${d.getDate()}` : d.getDate();
  const month = isOneDigit(d.getMonth())
    ? `0${d.getMonth() + 1}`
    : d.getMonth() + 1;
  const year = d.getFullYear();
  return `${year}-${month}-${date}`;
}

function isOneDigit(num) {
  return Math.floor(num / 10) == 0;
}

function getExchangeRate() {
  return new Promise((resolve, reject) => {
    axios
      .get(
        "https://apigw1.bot.or.th/bot/public/Stat-ExchangeRate/v2/DAILY_AVG_EXG_RATE/",
        {
          headers: {
            "x-ibm-client-id": process.env.SECRET,
          },
          params: {
            start_period: getYesterdaysDate(),
            end_period: getTodaysDate(),
            currency: "USD",
          },
        }
      )
      .then((res) => res.data.result.data)
      .then((data) => data.data_detail)
      .then((data) => resolve(data[0].mid_rate))
      .catch((err) => {
        if (err.response && err.response.data) {
          console.log(err.response.data);
        }
        console.log(`Data Doesn't Exist!`);
        resolve(null);
      });
  });
}

module.exports = {
  getExchangeRate,
};
