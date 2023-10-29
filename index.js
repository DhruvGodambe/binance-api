const { Spot } = require("@binance/connector")
const { printCurrentBalance } = require("./helpers")
const {api_key, secret_key, baseURL} = require("./config");
const fs = require("fs")

const client = new Spot(api_key, secret_key, { baseURL })
const wssClient = new Spot(', ');

let lowestPriceArr = [];
let highestPriceArr = [];
let lastHighPrice, lastLowPrice, highestPrice, lowestPrice;
const storableArrayLength = 100;

const receiveMsg = (data) => {

    console.log(`start at: ${Date.now()}\n`)
    const parsedData = JSON.parse(data);
    console.log(`Lowest: ${lowestPrice} \t Highest: ${highestPrice} \t`)

    //////////////////////////////////// MAIN ALGO ///////////////////////////////////////
    let currentLowPrice = parseInt(parsedData.k.l);
    let currentHighPrice = parseInt(parsedData.k.h);

    if(lowestPriceArr.length > 100) {
        const removableLowestPrice = lowestPriceArr.shift();
        const removableHighestPrice = highestPriceArr.shift();
        lowestPriceArr.push(currentLowPrice);
        highestPriceArr.push(currentHighPrice);

        // configure lowest price
        if(lowestPrice == removableLowestPrice){
            // find lowest price in entire array and set it
            let nextLowestPrice = 10000000
            for(const price of lowestPriceArr){
                if(price < nextLowestPrice) nextLowestPrice = price
            }
            lowestPrice = nextLowestPrice;
            console.log("Lowest Price set to: ", lowestPrice)
        }
        
        if(lowestPrice >= currentLowPrice){
            lowestPrice = currentLowPrice;
            console.log("BUY")
        }




        if(highestPrice == removableHighestPrice){
            // find lowest price in entire array and set it
            let nextHighestPrice = 0
            for(const price of highestPriceArr){
                if(price > nextHighestPrice) nextHighestPrice = price
            }
            highestPrice = nextHighestPrice;
            // nextHighestPrice = getHighestPrice(highestPriceArr);
            console.log("Highest Price set to: ", highestPrice)
        }
        
        if(highestPrice <= currentHighPrice){
            highestPrice = currentHighPrice;
            console.log("SHORT")
        }


    } else {
        //first data entry for lowest and highest prices
        if(lowestPriceArr.length < 1){
            lowestPrice = currentLowPrice;
            highestPrice = currentHighPrice;
        } else {
            // second time and more data entry for lowest and highest price
            if(lowestPrice > currentLowPrice) lowestPrice = currentLowPrice
            if(highestPrice < currentHighPrice) highestPrice = currentHighPrice
        }
        lowestPriceArr.push(currentLowPrice);
        highestPriceArr.push(currentHighPrice);
        console.log("Just storing price, current price array length: ", lowestPriceArr.length)
        // console.log(priceArr)
    }

    lastLowPrice = currentLowPrice;
    lastHighPrice = currentHighPrice;
    ///////////////////////////////////////////////////////////////////////////////////////

    console.log(`End at: ${Date.now()}\n`)
    return null;
    // return wssClient.logger.log(`Pair: ${parsedData.k.s} \t Open Price: ${parsedData.k.o} \t CLose Price: ${parsedData.k.c} \t High Price: ${parsedData.k.h} \t Low Price: ${parsedData.k.l}`)
    // return wssClient.logger.log(`Pair: ${parsedData.s} \t Open Price: ${parsedData.o} \t CLose Price: ${parsedData.c} \t High Price: ${parsedData.h} \t Low Price: ${parsedData.l}`)
    // return wssClient.logger.log(`Pair: ${parsedData.s} \t Price: ${parsedData.p} \t Quantity: ${parsedData.q}`)
}

const callbacks = {
    open: () => wssClient.logger.log('open'),
    close: () => wssClient.logger.log('closed'),
    message: receiveMsg
}

async function main() {
    const response = await client.account();
    const balances = response.data.balances;
    
    printCurrentBalance(balances);
    
    // const wssRef = wssClient.klineWS('btcusdt', '1s', callbacks)

    console.log(client.newOCOOrder)

    // console.log(`Pair: ${aggTrade.s} \t Price: ${aggTrade.p} \t Quantity: ${aggTrade.q}`);

    // new Promise(resolve => setTimeout(() => wssClient.unsubscribe(wssRef), 10000))

}

main().catch(console.log)