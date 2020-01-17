const fs = require('fs');
const testDataPage = 'testdata/wordsy.json'

export const Word = {
    find() {        
        const rawdata = fs.readFileSync(`${testDataPage}`, "utf8");
        const words = JSON.parse(rawdata)
        return words
    }
}
