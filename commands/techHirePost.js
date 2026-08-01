const config = require("../config.json")
const { putItem, sendEmail, getItem } = require("./awsFunctions")
const fs = require("fs");

// handler
async function techHirePost(event){

    // beginning - the time and return body
    const timeNow = new Date();
    let returnBody = {
        body: "",
        headers: {
            "Content-Type": "application/json"
        }
    }

    // insert code here
    let finalJson = {};

    // to send email: await sendEmail(to,from,htmlBody,subject,replyTo)
    // use config.fromEmail - replyTo either config.replytoEmail or just use "tech@butlerjcr.com"
    // to retrieve from database: await getItem(table,key)
    // where table is config.tables.tech and for key you specify {id: [INSERT ID HERE]} - specifically in this object format
    // to put item to database: await putItem(table,item)
    // again,table is config.tables.tech, and item is an object with key "id" being present

    // appends to standard body template
    returnBody.body = JSON.stringify(finalJson);
    return returnBody
}
module.exports = { techHirePost }