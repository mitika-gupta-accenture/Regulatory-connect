
const xlsx = require('node-xlsx');

var domains = ['fake-website', 'another-fake-website'];

var protocols = ['www.', 'https://', 'http://', 'https://www.', 'http://www.'];

var topLevelDomain = ['.org', '.co.uk', '.monster', '.com'];

var num = 1;

var dataSheets = [[],[],[]];

const pickRandom = arr => arr[Math.floor(Math.random() * arr.length)];

const processDataSheet = (sheet, amount) => {
   while (sheet.length < amount) {
        const protocol = num % 3 === 0 ? pickRandom(protocols) : '';
        const randomUrl = `${protocol}${pickRandom(domains)}${num}${pickRandom(topLevelDomain)}`;
        const anotherRandomUrl =  `${protocol}${pickRandom(domains)}${num}${pickRandom(topLevelDomain)}`;
        sheet.push([num % 10 === 0 ? `${randomUrl} (now redirects to ${anotherRandomUrl})` : randomUrl]);
        num++;
   }
   return sheet;
};

const sheetsBuffer = dataSheets.map((sheet, index) => {
    return { name: `suspicious_websites_${index + 1}`, data: processDataSheet(sheet, 50000) };
});

const buffer = xlsx.build(sheetsBuffer);

fs.writeFile('test_website_data.xlsx', buffer, console.error);
