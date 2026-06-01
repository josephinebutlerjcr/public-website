// requirements
const fs = require("fs");
const config = require("./config.json")

// local testing only
const express = require("express");
const app = express();
const port = 3030;
require("dotenv").config();

const {getPage} = require("./commands/pageLoaders")

// maps
const extraMaps = config.extraMaps;


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

    let automated = await getPage(pageCode);

    if(automated != false) {
        // the pages editable in the exec pages
        returnBody = automated;

    } else if (Object.keys(extraMaps).includes(pageCode)) {
        // special pages
        returnBody.body = fs.readFileSync(extraMaps[pageCode].data).toString();
        returnBody.headers["Content-Type"] = extraMaps[pageCode].contentType;

    } else {
        // otherwise a 404!
        returnBody.body = fs.readFileSync(`assets/html/404.html`).toString();
    }

    // special cases!
    if (pageCode == "GET/groups/data") {
        // Student Group data JSON
        const { getData } = require("./commands/groupsData");
        let bodyTmp = await getData(event);
        returnBody = {
            body: JSON.stringify(bodyTmp),
            headers: {
                "Content-Type": "application/json"
            }
        }

    } else if (pageCode == "GET/") {
        // the front page
        const { frontPage } = require("./commands/frontPage");
        let bodyTmp = await frontPage();
        returnBody = {
            body: bodyTmp,
            headers: {
                "Content-Type": "text/html"
            }
        }

    } else if(pageCode == "GET/stash") {
        // the stash site
        const {stashPage} = require("./commands/stash");
        let bodyTmp = await stashPage();
        returnBody= bodyTmp

    } else if(pageCode == "GET/policy") {
        // jcr policies
        const {policyPage} = require("./commands/policy");
        let bodyTmp = await policyPage();
        returnBody= bodyTmp
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
