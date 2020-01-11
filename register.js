require('dotenv').config();
const axios = require('axios');
const winston = require('winston');

// Configure logger
logLevel = process.env.LOG_LEVEL || "info";
const logger = winston.createLogger({
    level: logLevel,
    format: winston.format.simple(),
    transports: [
        new winston.transports.Console()
    ]
});

// Get variables from the environment
plateNumber = process.argv[2] || process.env.PLATE_NUMBER;
kioskAgentId = process.env.KIOSK_AGENT_ID;
password = process.env.PASSWORD;
parkingProductId = process.env.PARKING_PRODUCT_ID;
logger.info(`Parking car...`, {plateNumber: plateNumber, kioskAgentId: kioskAgentId, parkingProductId: parkingProductId});

axios.post(
    'https://pservice-permit.giantleap.no/api/kiosk-v2/authenticate.json',
    {userName: kioskAgentId, password: password}
).then((resAuth) => {
    let token;
    if (resAuth.data.resultCode === "SUCCESS") {
        logger.info('Successfully authenticated.');
        logger.debug("", resAuth.data);
        token = resAuth.data.token;
        axios.post(
            'https://pservice-permit.giantleap.no/api/kiosk-v2/parking/register.json',
            {
                plateNumber: plateNumber,
                kioskAgentId: kioskAgentId,
                productId: parkingProductId,
                qualificationForm: [],
                termsAccepted: false
            },
            {headers: {"X-Token": token}}
        ).then((res) => {
            if (res.data.resultCode === "SUCCESS") {
                logger.info(`Successfully added ${res.data.parking.licencePlateNumber} to the parking app.`);
                logger.debug("", res.data)
            } else {
                logger.error(`Failed to add ${plateNumber}!!!`, res.data);
                logger.debug("", res);
                process.exit(1);
            }
        }).catch((error) => {
            logger.error("", error);
            process.exit(1);
        })
    } else {
        logger.error(`Failed to authenticate!!!`, resAuth.data);
        logger.debug("", resAuth);
        process.exit(1);
    }
}).catch((error) => {
    logger.error("", error);
    process.exit(1);
});

