const fs = require("fs");
const { listDirectoryFiles } = require("./awsFunctions");
const config = require("../config.json")

// handler
async function policyPage(event){
    let returnBody = {
        body: "",
        headers: {
            "Content-Type": "text/html"
        }
    }

    // Case I: Specific Policy by slug
    if(false) {
        // not in use
    // Case II: List All
    } else {
        returnBody.body = fs.readFileSync(`assets/html/policy.html`).toString();
        let policyHtml = "<p>Policies will open in new tab once clicked</p>\n<ul>";

        let directory = await listDirectoryFiles(config.buckets.content, `policy/`);
        
        directory.sort((a, b) => {
            const nameA = policySlugFormat(a).toLowerCase();
            const nameB = policySlugFormat(b).toLowerCase();
            return nameA.localeCompare(nameB);
        });
        
        for(let article of directory){
            let name = policySlugFormat(article)
            policyHtml += `<li><a href="https://${config.buckets.content}.s3.eu-west-2.amazonaws.com/policy/${article}.pdf" target="_blank">${name}</a></li>`
        }

        policyHtml += "</ul>"

        returnBody.body = returnBody.body.replace(/{{policies}}/g,policyHtml)
    }

    return returnBody
}
module.exports = { policyPage }

// policy slug pretifier
function policySlugFormat(slug){
    let slugSplit = slug.split("-")
    let number = parseInt(slugSplit[0])
    let name = slugSplit[1]
    let lapse = slugSplit[2]

    let officialNumber = `P/${String(number).padStart(3, '0')}`;

    return `${officialNumber}: ${name.replace(/_/g," ")}`
}