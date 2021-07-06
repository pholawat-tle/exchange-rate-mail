require("dotenv").config();

const cron = require("node-cron");
const nodemailer = require("nodemailer");
const { getExchangeRate } = require("./utils");

const threshold = process.env.THRESHOLD;

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
  if (exchange <= threshold && exchange) {
    console.log(
      `${new Date().toLocaleString()}: Exchange Rate Today is ${exchange} THB to 1 USD`
    );
    const mailOptions = {
      to: process.env.RECEIVER,
      subject: `Exchange Rate Notification`,
      html: `${exchange} THB = 1 USD, Threshold = ${threshold}`,
    };
    console.log(await sendMail(mailOptions));
  }
});

async function testExchangeRate() {
  const exchange = await getExchangeRate();
  if (exchange) {
    console.log(
      new Date().toLocaleString() +
        ": Application has been started. Today's Exchange Rate is " +
        exchange +
        " THB to 1 USD"
    );
  } else {
    console.log(
      new Date().toLocaleString() +
        ": Application has been started. Today's Exchange Rate is not available"
    );
  }
}

testExchangeRate();
