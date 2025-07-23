const config = require("../config.json")
const { getItem, scanItems } = require("./awsFunctions")

// handler
async function getData(event){
    if(!event.queryStringParameters){
        return {};
    }
    if(!!event.queryStringParameters.mode){
        if(event.queryStringParameters.mode == "list"){
            return await getList();
        }
    } else if(!!event.queryStringParameters.id){
        return await getSociety(event.queryStringParameters.id);
    }
    return {};
}
module.exports = { getData }

// gets list
async function getList(){
    let groupsUnfiltered = await scanItems(config.tables.groups,"NOT(id = :erroneous)",{":erroneous":"x"},undefined);
    let finalList = [];

    for(let group of groupsUnfiltered){
        if(!!group.socials.whatsapp){group.socials.whatsapp = undefined};
        finalList.push({
            id: group.id,
            name: group.name,
            category: group.category,
            socials: group.socials,
            avatar: group.avatar
        })
    }

    return finalList;
}

// gets society: almost a copy from main, except some items were removed, and society is fetched
async function getSociety(societyId){
    let society = await getItem(config.tables.groups, {id:societyId});
    if(society.error || society.id != societyId){return{body:"An error has occurred, it seems that this group may not exist. Please try again later."}}

    let socials = ""; let logo = `<img src="https://placehold.co/400?text=${society.category}" alt="No Logo">`; let societyAwards = "";

    // social medias
    if(!!society.socials.instagram){socials += `<a href="https://instagram.com/${society.socials.instagram}" target="_blank"><i class="fab fa-instagram"></i></a>`}

    // logo
    if(society.avatar){logo = `<img src="https://butler-jcr-public.s3.eu-west-2.amazonaws.com/societylogo/${society.id}.jpg">`}

    // awards
    if(!!society.awards){
        for(let award of society.awards){
            societyAwards += `<span class="tag">${award}</span>`
        }
    }

    let body =  `
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" rel="stylesheet">
        <div class="groupSummary">
        <div class="logo">
            ${logo}
        </div>

        <div class="details">
            <div class="name">${society.name}</div>
            <div class="description">
            ${society.description}
            </div>
            <div class="tags">
            <span class="tag">${society.category}</span>
            ${societyAwards}
            </div>
            <div class="socials">
            ${socials}
            </div>
        </div>
        </div>
    `;

    return {body}
}