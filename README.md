# Exchange Rate E-mail Notification

Node.js Application that sends e-mail when THB/USD drops below a certain threshold using node-cron and nodemailer

## Prerequisites

- Node.js
- Docker and Docker Compose
- Bank of Thailand API Key

## Getting Started

1. Clone the repository

```sh
git clone https://github.com/pholawat-tle/exchage-rate-mail
cd exchage-rate-mail
```

2. Install Dependencies

```sh
npm install
```

3. Set environment variables

```sh
mv .env.sample .env
# Edit variables value in .env file
```

4. Run the command below to start the application

```sh
docker-compose up --build
```
