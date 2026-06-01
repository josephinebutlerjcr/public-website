// requirements
const fs = require("fs");
const config = require("./config.json");
const {getPage} = require("./commands/pageLoaders");

// maps
const extraMaps = config.extraMaps;

// main sequence
module.exports.handler = async (event) => {
    let pageCode = `${event.httpMethod}${event.path}`

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

    return returnBody;
}