const config = require("../config.json")
const { getS3Item } = require("./awsFunctions")
const MarkdownIt = require("markdown-it");
const md = new MarkdownIt();
const fs = require("fs");

// handler
async function stashPage(event){
    const timeNow = new Date();
    
    let returnBody = {
        body: "",
        headers: {
            "Content-Type": "text/html"
        }
    }

    // load the markdown file
    let inputMarkdown = "";
    try {
        let tmpHash = await getS3Item(config.buckets.operational, `pages/stash.md`);
        inputMarkdown = tmpHash.toString();
    } catch(err){
        console.log(err)
        return false;
    }

    // get the parameters
    const lines = inputMarkdown.split("\n");
    const openParam = lines[0].substring("!open=".length).trim();
    const closeParam = lines[1].substring("!close=".length).trim();

    // remove the metadata lines
    inputMarkdown = lines.slice(2).join("\n");
    
    // null parameters
    if(!openParam){openParam = "Jan 01, 1970 00:00:00"}
    if(!closeParam){closeParam = "Jan 01, 1970 00:00:00"}

    // parameterisation
    const openTime = new Date(openParam);
    const closeTime = new Date(closeParam);

    // null
    if (isNaN(openTime.getTime())) {
        openTime = new Date("Jan 01, 1970 00:00:00");
        openParam = "Jan 01, 1970 00:00:00"
    }
    if (isNaN(closeTime.getTime())) {
        closeTime = new Date("Jan 01, 1970 00:00:00");
        closeParam = "Jan 01, 1970 00:00:00"
    }
    
    // template setup
    returnBody.body = fs.readFileSync(`assets/html/template.html`).toString();

    // determination of view
    if(openTime.getTime() <= timeNow.getTime() && closeTime.getTime() >= timeNow.getTime()){
        // operating window - inject markdown
        
        // render
        let inputHtml = md.render(inputMarkdown)
            .replace(/&lt;/g,"<")
            .replace(/&gt;/g,">")
            .replace(/&quot;/g,"\"");

        returnBody.body = returnBody.body.replace(/{{content}}/g,inputHtml);

    } else {
        // closed window - no stash!
        returnBody.body = returnBody.body.replace(/{{content}}/g,`<p>
                <b>Remark.</b> The stash ordering is currently closed.
                <br><br>
                Open: {{openDate}} (UTC+0)<br>
                Closed: {{closeDate}} (UTC+0)
            </p>`);
    }

    // appends parameters
    returnBody.body = returnBody.body.replace(/{{openDate}}/g,openParam);
    returnBody.body = returnBody.body.replace(/{{closeDate}}/g,closeParam);

    // appends name
    returnBody.body = returnBody.body.replace(/{{pageName}}/g,"Stash");

    return returnBody
}
module.exports = { stashPage }