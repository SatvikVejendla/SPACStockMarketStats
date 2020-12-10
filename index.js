const puppeteer = require('puppeteer');
const fs = require('fs');
const http = require('http')
const cheerio = require('cheerio');
const csv = require('csv');
const pm2 = require('pm2');


var obj = csv();

async function name(){
        console.log("Reading local file...")
        fs.readFile('../spac.html', function (err, html) {
            if(err){
                console.log(err);
            } else {
                console.log("Server created on localhost:8000...")
            }
            http.createServer(function(req, res) {  
                res.writeHeader(200, {"Content-Type": "text/html"});  
                res.write(html);  
                res.end();  
            }).listen(8000);
        })
        const browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--disable-setuid-sandbox'
            ],
            defaultViewport: null
        });
        
        
        
        const page = await browser.newPage();
        const url2 = "http://localhost:8000/"
        await page.goto(url2, { waitUntil: 'networkidle0' });
        console.log("Browser launched...")
        const content = await page.content();
        const $ = cheerio.load(content);
        var array = [[]];

        console.log("Scraping content...")
        $('tr').each(function(idx, elem) {
            const val = [];
            $('td', this).each(function() {
                val.push($(this).text())
            });
            array.push(val);
        });

        browser.close();

        obj.from.array(array).to.path('../data.csv');
        console.log("Success. Data saved to data.csv");
        //process.exit(1);

}
name();