const config = require("../config.json")
const { getS3Item } = require("./awsFunctions")
const fs = require("fs");

// handler
async function techHireGet(event){

    // beginning - the time and return body
    const timeNow = new Date();
    let returnBody = {
        body: "",
        headers: {
            "Content-Type": "text/html"
        }
    }

    // insert code here
    let htmlContent = "";

    // appends to standard body template
    returnBody.body = fs.readFileSync(`assets/html/template.html`).toString()
        .replace(/{{pageName}}/g,"Tech Hire")
        .replace(/{{content}}/g,htmlContent);

    return returnBody
}
module.exports = { techHireGet }