require('dotenv').config();
const _ = require('lodash');
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
logger.info(`Parking car...`, {
    plateNumber: plateNumber,
    kioskAgentId: kioskAgentId,
    parkingProductId: parkingProductId
});

const pserviceKioskV2BaseUrl = "https://pservice-permit.giantleap.no/api/kiosk-v2";
axios.post(
    `${pserviceKioskV2BaseUrl}/authenticate.json`,
    {userName: kioskAgentId, password: password}
).then((resAuth) => {
    let token;
    if (resAuth.data.resultCode === "SUCCESS") {
        logger.info('Successfully authenticated.');
        logger.debug("", resAuth.data);
        token = resAuth.data.token;
        axios.post(
            `${pserviceKioskV2BaseUrl}/parking/register.json`,
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
                logger.info(
                    `Successfully parked.`,
                    _.pick(
                        res.data.parking,
                        [
                            'licencePlateNumber',
                            'startTime',
                            'endTime',
                            'agentId',
                            'productId',
                            'zoneName'
                        ]
                    )
                )
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

