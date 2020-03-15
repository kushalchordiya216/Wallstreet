document.getElementById("submitForm").onsubmit = function(){
    console.log("Hello World")
    selectString = document.getElementById("company").value
    bidRange = parseInt(document.getElementById("bidRange").innerHTML)
    bidRange = bidRange / 100
    currentPrice = ""
    totalShares = ""

    for(let i = selectString.length - 1;selectString[i]!=".";i--){
        currentPrice = selectString[i]+currentPrice
    }
    for(let i = selectString.length - 1;selectString[i]!="-";i--){
        totalShares = selectString[i]+totalShares
    }

    currentPrice = parseInt(currentPrice)
    totalShares = parseInt(totalShares)
    bidPrice = parseInt(document.getElementById("bidPrice").value)
    quantity = parseInt(document.getElementById("quantity").value)
    cash = parseInt(document.getElementById("cash").innerHTML)

    if(isNaN(bidPrice) || isNaN(quantity) || bidPrice<=0 || quantity<=0 || quantity>totalShares || bidPrice<((1-bidRange)*currentPrice) || bidPrice>((1+bidRange)*currentPrice)){
        document.getElementById("validation").style = "color:red"
        document.getElementById("cashValidation").style = "display:none"
    }
    else if(cash<=0 || cash<=(quantity*bidPrice*1.01)){
        document.getElementById("cashValidation").style = "color:red"
        document.getElementById("validation").style = "display:none"
    }
    else{
        document.getElementById("submitForm").click()
    }
}
