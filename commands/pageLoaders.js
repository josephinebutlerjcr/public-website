const config = require("../config.json")
const { getS3Item } = require("./awsFunctions")
const MarkdownIt = require("markdown-it");
const md = new MarkdownIt();
const fs = require("fs");

// editable pages. 
const pages = ["welfare","freshers","college","contact","events","acknowledgements"]
// "stash" is an exception of a page!!
// YOU MUST ALSO UPDATE THIS IN THE INTRANET


// get page contents
async function getPage(pageCode){
    let pageName = pageCode.split("/")[1]
    if(pages.includes(pageName) == false){
        return false;
    } else {
        // get the markdown
        let inputMarkdown = "";
        try {
            let tmpHash = await getS3Item(config.buckets.operational, `pages/${pageName}.md`);
            inputMarkdown = tmpHash.toString();
        } catch(err){
            console.log(err)
            return false;
        }

        // render
        let inputHtml = md.render(inputMarkdown)
            .replace(/&lt;/g,"<")
            .replace(/&gt;/g,">")
            .replace(/&quot;/g,"\"");

        // friendly page name
        let pageNameFriendly = friendly(pageName)

        // input into template
        let returnBody = {
            body: "",
            headers: {
                "Content-Type": "text/html"
            }
        }
        returnBody.body = fs.readFileSync("./assets/html/template.html").toString().replace(/{{pageName}}/g,pageNameFriendly).replace(/{{content}}/g,inputHtml);
        
        return returnBody;
    }
}


// friendly names
function friendly(str) {
    return str
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/\b\w/g, c => c.toUpperCase());
}

// export
module.exports = {getPage}