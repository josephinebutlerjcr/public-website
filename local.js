// requirements
const fs = require("fs");
const config = require("./config.json")

// local testing only
const express = require("express");
const path = require("path");
const app = express();
const port = 3000;
require("dotenv").config();

// maps
const pageMaps = config.pageMaps;
const extraMaps = config.extraMaps;

// Special JSON route
app.get("/groups/data", async (req, res) => {
    let event = buildLambdaEvent(req)

    const { getData } = require("./commands/groupsData");
    const data = await getData(event); // In Lambda, this would be the `event`
    res.set("Content-Type", "application/json");
    res.send(JSON.stringify(data));
});

// main sequence, translated for this use.
app.use(async (req, res) => {
    const event = buildLambdaEvent(req)

    const pageCode = `${req.method}${req.path}`;

    let returnBody = {
        body: "",
        headers: {
            "Content-Type": "text/html"
        }
    }

    if (Object.keys(pageMaps).includes(pageCode)) {
        returnBody.body = fs.readFileSync(`assets/html/${pageMaps[pageCode]}`).toString();
    } else if (Object.keys(extraMaps).includes(pageCode)) {
        returnBody.body = fs.readFileSync(extraMaps[pageCode].data).toString();
        returnBody.headers["Content-Type"] = extraMaps[pageCode].contentType;
    } else {
        returnBody.body = fs.readFileSync(`assets/html/404.html`).toString();
    }

    if (pageCode == "GET/groups/data") {
        const { getData } = require("./commands/groupsData");
        let bodyTmp = await getData(event);
        returnBody = {
            body: JSON.stringify(bodyTmp),
            headers: {
                "Content-Type": "application/json"
            }
        }
    }

    // how we handle the returns here for express only:
    try {
        res.set("Content-Type", returnBody.headers["Content-Type"]);
        //if(!!returnBody.headers["Set-Cookie"]){res.set("Set-Cookie", returnBody.headers["Set-Cookie"])}
        res.send(returnBody.body);
    } catch (err) {
        res.status(500).send("Internal Server Error");
        console.error(err);
    }
});

app.listen(port, () => {
    console.log(`Local server running at http://localhost:${port}`);
});

// function to mimick the AWS Lambda event, from the express request
function buildLambdaEvent(req) {
    return {
        httpMethod: req.method,
        path: req.path,
        queryStringParameters: req.query,
        headers: req.headers,
        body: req.body ? JSON.stringify(req.body) : null,
        isBase64Encoded: false,
        pathParameters: req.params || {},
        requestContext: {
            identity: {
                sourceIp: req.ip
            }
        }
    };
}
