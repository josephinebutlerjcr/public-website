# Butler JCR Website

This is the light-weight system, running on Amazon AWS (Lambda, API Gateway - serverless architecture) for the main public part of the Josephine Butler College JCR website.

Although quite a bit of this is based on Ned Reid's version, I have chosen to use a serverless architecture to save costs. I am also not a fan of React whatsoever, given how weakly it performs when you don't have much internet speed (I have worked on this quite a bit on the train) - so for digital accessibility, I have chosen serverless.

I have also divided the website into a much lightweight public side, and then the private side, with much more data which is being protected behind this so-called password wall.

## Working On It

You must have node-js and npm installed. Node version 20, and npm version 10 onwards will work. 

1. Git pull this
2. To have functionality with the database, create a `.env` file in the root, and config it with the AWS keys:
```
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
AWS_REGION=eu-west-2
```
3. Install using `npm install`
4. Use `node .` to run. Noting that `local.js` is the endpoint we use to test the project locally and is ignored by Lambda - `index.js` is what AWS Lambda reads.

This project will auto-deploy on the `main` branch of the GitHub; use the `local.js`

Note that `aws-sdk` stuff is already available on Lambda, so installing any of this must be done by `npm install ... -save-dev` - everything
else by basic `npm install`. Express and dotnet are not used on there, and only for local testing.

## Notices
- Adapted from [Ned Reid's Version](https://github.com/NedReid/ButlerJCRWebsite)
- Complements [the intranet](https://github.com/premraghvani/butlerjcr-intranet/)

## Maintenance

This main website only contains basic information, so I have not put much effort in making it easy to change elements, like in the dynamic web pages
behind the intranet.

I anticipate you may have to change webpages. They are on the `/assets/html` bit - you only need to amend the HTML - and find the relevant section
to update. It should be fairly intuitive.

- The front page yearly. Please just upload the images to AWS S3 (bucket: `butler-jcr-public`) in the `sabbs` folder. I suggest you start off
each file name with the year of the sabb. Please pre-crop these to a square, and please please please convert to JPG and compress (makes it fast).
Do feel free to do some gardening with what gets sent over, e.g. adding `<br>` for line breaks and `<a href>` for links (e.g. Instagram, email mailtos)

- The welfare page at the request of the welfare committee - just because links can break, the sexual health supplies page may change, etc.

## Configuration

- Simply put, this is linked from API gateway (which provides the endpoint) to AWS Lambda. This code entirely lives within it, noting the `index.js` page must be in the root.

- It should be all good, and we can use the Lambda function suitably titled in the `eu-west-2` region - more info available privately