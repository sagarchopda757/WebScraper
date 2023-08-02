const puppeteer = require('puppeteer')
const fs = require('fs');
const nodemailer = require("nodemailer");
const path = require('path');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

const getEmail = () => {
    return new Promise(resolve => {
        readline.question('Enter your email address: ', email => {
        readline.close();
        resolve(email);
        });
    });
}


const run = async () => {
    const email = await getEmail();
    console.log('email outside readline', email);
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: false,
        userDataDir: './tmp',
        // slowMo:500 ,
        //devtools: true
    });

    const page = await browser.newPage();
    const url = 'https://www.amazon.in/s?i=nowstore&crid=E1JB0WQO9UND&sprefix=%2Cnowstore%2C459&ref=nb_sb_noss'

    //'https://www.amazon.in/s?rh=n%3A1374357031&fs=true&ref=lp_1374357031_sar'

    console.log('browser opened');


    let nextPageUrl = url

    let counter = 0
    let pageNumber = 1;
    const payload = []
    while (nextPageUrl && counter < 3) {
        console.log('Scraping url :', nextPageUrl)
        await page.goto(nextPageUrl, { waitUntil: "load" });
        await page.screenshot({ path: `./public/images/page_${pageNumber}.png`, fullPage: true })
        const products = await page.evaluate(() => {
            const productElements = document.querySelectorAll('.s-result-item');
            const products = [];
            for (const productElement of productElements) {
                const titleElement = productElement.querySelector('h2 a span.a-size-base-plus.a-color-base.a-text-normal');
                const ratingElement = productElement.querySelector('a i span.a-icon-alt')
                const priceElement = productElement.querySelector('a span.a-price span.a-offscreen')
                const imageElement = productElement.querySelector('div.a-section.aok-relative.s-image-square-aspect img.s-image')
                const bestSellerElement = productElement.querySelector('div.a-row.a-badge-region span.a-badge-label span.a-badge-text')
                const bestSellerElem = productElement.querySelector('div.a-row.a-badge-region span.a-badge span.a-badge-supplementary-text.a-text-ellipsis')
                const dealElement = productElement.querySelector('div.s-price-instructions-style  span.a-badge-text')



                if (titleElement || ratingElement) {
                    const title = titleElement.innerText;
                    const rating = ratingElement ? ratingElement.innerText : null;
                    const price = priceElement ? priceElement.innerText : null;
                    const image = imageElement ? imageElement.src : null;
                    const bestSeller = bestSellerElement ? bestSellerElem.innerText : null;
                    const deal = dealElement ? dealElement.innerText : null
                    products.push({ title, rating, price, image, bestSeller, deal });
                }
            }
            return products;
        });

        payload.push({ page: pageNumber, data: products })

        nextPageUrl = await page.evaluate(() =>
            document.querySelector('div.s-pagination-container a.s-pagination-next')
                ? document.querySelector('div.s-pagination-container a.s-pagination-next').href
                : null
        );

        pageNumber++;
        counter++;

    }


    browser.close()

    fs.writeFileSync('data.json', JSON.stringify(payload), (err) => {
        if (err) throw err;
        console.log('file Saved');
    })



    async function sendmail(to) {
        console.log('sending mail');

        let Mail = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: 'sagardemo1234@gmail.com',
                pass: 'hocvswshhkweiaza', // generated ethereal password 
            },
        })


        const jsonFilePath = './data.json'; // Update the path
        const jsonData = fs.readFileSync(jsonFilePath);

        // Define the path to the folder you want to attach
        const folderPath = './public/images'; // Update the path
        // Read the contents of the folder
        const folderContents = fs.readdirSync(folderPath);


        console.log('Uploding Files...');
        let getstatus = await Mail.sendMail({
            from: '"Web Scraper" <sagardemo1234@gmail.com>',
            to: to,
            subject: `Scraped data from Amazon Website`,
            html: 'this is demo data not used for commercial purpose',
            attachments: [
                {
                    filename: 'data1.json',    // Name of the JSON file
                    content: jsonData,        // Content of the JSON file
                },
                ...folderContents.map(file => ({
                    filename: file,                        // Name of each file in the folder
                    path: path.join(folderPath, file),     // Full path to the file
                })),
            ]
        });
        console.log('Files uploaded successfully');
        return getstatus
    }
    const mail = await sendmail(email)
    if (mail) {
        console.log("Mail Sent Successfully");
    }

    return
}
run();





