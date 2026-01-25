const window = require("../STASHWINDOW.json") 
const fs = require("fs");

// handler
async function stashPage(event){
    const openTime = new Date(window.open);
    const closeTime = new Date(window.close);
    const timeNow = new Date();
    
    let returnBody = {
        body: "",
        headers: {
            "Content-Type": "text/html"
        }
    }

    if(openTime.getTime() <= timeNow.getTime() && closeTime.getTime() >= timeNow.getTime()){
        // open case
        returnBody.body = fs.readFileSync(`assets/html/stash.html`).toString();
    } else {
        // closed case
        returnBody.body = fs.readFileSync(`assets/html/stashClosed.html`).toString();
    }

    // appends current data
    returnBody.body = returnBody.body.replace(/{{openDate}}/g,window.open)
    returnBody.body = returnBody.body.replace(/{{closeDate}}/g,window.close)

    return returnBody
}
module.exports = { stashPage }