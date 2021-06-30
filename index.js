require("dotenv").config();
const axios = require("axios");
const cron = require("node-cron");
const nodemailer = require("nodemailer");

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
      .catch(() => {
        console.log(`Data Doesn't Exist!`);
        resolve(null);
      });
  });
}

const threshold = 30.5;

const transporter = nodemailer.createTransport({
  service: "gmail", // hostname
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PW,
  },
});

async function sendMail(mailOptions) {
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
        reject(err);
      } else resolve(`Send Mail To ${mailOptions.to}`);
    });
  });
}

cron.schedule("0 12 * * *", async () => {
  const exchange = await getExchangeRate();
  console.log(
    `${new Date().toLocaleString()}: Exchange Rate Today is ${exchange} THB to 1 USD`
  );
  if (exchange <= threshold && exchange) {
    const mailOptions = {
      to: process.env.RECEIVER,
      subject: `Exchange Rate Notification`,
      html: `${exchange} THB = 1 USD, Threshold = ${threshold}`,
    };
    console.log(await sendMail(mailOptions));
  }
});

testMail();

async function testMail() {
  const exchange = await getExchangeRate();
  const mailOptions = {
    to: "pholawat.tangsatit@gmail.com",
    subject: `Exchange Rate E-mail Test`,
    html: `${exchange} THB = 1 USD, Threshold = ${threshold}`,
  };
  console.log(`Test: ${await sendMail(mailOptions)}`);
}

console.log(new Date().toLocaleString());
