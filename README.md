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

### Double-click executable MacOS

Create `<filename>.command` (`.command` extension is important here) with the following content:
```bash
#!/bin/bash
cd "$(dirname "$0")" 

node register.js

# Keep the tab open until user input. 
# Necessary to see the output of the script.
# Otherwise iTerm closes the window automatically.
echo "Click enter to exit"
read
```

Add execute permissions to the script with `chmod +x <filename>.command`

You can double-click the file, and it will be executed by the Terminal.app.

## Debugging

The log level can be set with the LOG_LEVEL environment variable.

`LOG_LEVEL=debug node register.js`
