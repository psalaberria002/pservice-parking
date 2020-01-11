# P-Service parking

Automate the tedious job of registering a car in https://pservice-permit.giantleap.no/visitor.html.

## Installing

`npm install`

## How to run the script?

Execute `node register.js`.

The script will look for variables in `.env`. See required variables below:
```bash
PLATE_NUMBER="XX11111"
KIOSK_AGENT_ID="1234"
PASSWORD="supersecret"
PARKING_PRODUCT_ID="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

The license plate can also be provided to the script as an argument.
The argument takes precedence over the environment variable.

`node register.js <PLATE_NUMBER>`.

## Debugging

The log level can be set with the LOG_LEVEL environment variable.

`LOG_LEVEL=debug node register.js`
