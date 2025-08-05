// premble
const fs = require("fs");
const { getS3Item } = require("./awsFunctions");
const MarkdownIt = require("markdown-it");
const md = new MarkdownIt();
const config = require("../config.json")

// main
async function frontPage(){
    // gets bios
    let biographies = {}; let ranks = {};
    try {
        biographies = await getS3Item(config.buckets.operational, `executive/biographies.json`);
        biographies = JSON.parse(biographies)
        ranks = await getS3Item(config.buckets.operational, `executive/roles.json`);
        ranks = JSON.parse(ranks)
    } catch(err) {}

    // finds president and facso
    let president = {bio:"",avatar:false,name:"Not Available",cis:""}; let facso = {bio:"",avatar:false,name:"Not Available",cis:""}
    if(!!ranks.main){
        if(!!ranks.main["President"]){
            let presidentCis = ranks.main["President"]
            president = biographies[presidentCis] ? biographies[presidentCis] : president;
            president.cis = presidentCis;
        }
        if(!!ranks.main["FACSO"]){
            let facsoCis = ranks.main["FACSO"]
            facso = biographies[facsoCis] ? biographies[facsoCis] : facso;
            facso.cis = facsoCis;
        }
    }

    let body = fs.readFileSync(`assets/html/frontPage.html`).toString()
        .replace(/{{presidentName}}/g,president.name)
        .replace(/{{facsoName}}/g,facso.name)
        .replace(/{{presidentBio}}/g,md.render(president.bio).replace(/\n/g,"<br>").replace(/<p>/g,"").replace(/<\/p>/g,""))
        .replace(/{{facsoBio}}/g,md.render(facso.bio).replace(/\n/g,"<br>").replace(/<p>/g,"").replace(/<\/p>/g,""))
        .replace(/{{presidentAvatar}}/g,president.avatar ? `https://butler-jcr-public.s3.eu-west-2.amazonaws.com/avatars/${president.cis}.jpg` : "https://butler-jcr-public.s3.eu-west-2.amazonaws.com/sabbs/0Unknown.jpg")
        .replace(/{{facsoAvatar}}/g,facso.avatar ? `https://butler-jcr-public.s3.eu-west-2.amazonaws.com/avatars/${facso.cis}.jpg` : "https://butler-jcr-public.s3.eu-west-2.amazonaws.com/sabbs/0Unknown.jpg");

    return body;
}

module.exports = { frontPage }