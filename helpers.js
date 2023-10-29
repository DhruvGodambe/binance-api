

function printCurrentBalance(balances) {
    let iterator = 0;
    while(balances[iterator].asset != "USDT"){
        iterator++;
    }
    console.log("------------------------------------------------------------------------------------------------------------")
    console.log(`Your current USDT Balance: \n Free: ${balances[iterator].free} USDT \n Locked: ${balances[iterator].locked} USDT`)
    console.log("------------------------------------------------------------------------------------------------------------")
}

module.exports = {
    printCurrentBalance
}