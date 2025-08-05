// requirements
const fs = require("fs");
const config = require("./config.json")

// maps
const pageMaps = config.pageMaps;
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
    
    if(Object.keys(pageMaps).includes(pageCode)){
        returnBody.body = fs.readFileSync(`assets/html/${pageMaps[pageCode]}`).toString();
    } else if(Object.keys(extraMaps).includes(pageCode)){
        returnBody.body = fs.readFileSync(extraMaps[pageCode].data).toString();
        returnBody.headers["Content-Type"] = extraMaps[pageCode].contentType;
    } else {
        returnBody.body = fs.readFileSync(`assets/html/404.html`).toString();
    }

    if(pageCode == "GET/groups/data"){
        const { getData } = require("./commands/groupsData");
        let bodyTmp = await getData(event);
        returnBody = {
            body: JSON.stringify(bodyTmp),
            headers: {
                "Content-Type": "application/json"
            }
        }
    } else if (pageCode == "GET/") {
        const { frontPage } = require("./commands/frontPage");
        let bodyTmp = await frontPage();
        returnBody = {
            body: bodyTmp,
            headers: {
                "Content-Type": "text/html"
            }
        }
    }

    return returnBody;
}