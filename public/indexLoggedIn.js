//import { ethers } from "ethers";
const provider = new ethers.providers.Web3Provider(window.ethereum)
const signer = provider.getSigner();

const daiAddress = "0x77b60480d5d4dfa050De3C339267b768Cb56C699";

async function getABI(){
    return fetch('/tokenTest.json')
        .then(function(response) {
        return response.json();
        })  
}



const tokenDescription= document.getElementById("tokenDescription")
const tokenDisplay = document.getElementById("tokenDisplay")
const welcomeMessage= document.getElementById("welcomeMessage")
const dropdownUser = document.getElementById("dropdownUser")
const randomGuyAddress = document.getElementById("sendToRandom")
const transferAddress= document.getElementById("transferAddress")
let network = document.getElementById('networkId')
let chainId = document.getElementById('chainId')
let account = document.getElementById('accountId')
let balance = document.getElementById('balance')
const ethBalance = document.getElementById('ethBalance')
const mintSelect= document.getElementById('mintSelect')
window.onload=async function(){
    

    //var x=document.getElementById('myButton')
    //var y=document.getElementById('metaBtn')
    var tokenMint = document.getElementById('mintBtn')
    var tokenDelete = document.getElementById('deleteBtn')
    var tokenPrint = document.getElementById('printBtn')
    var tokenPrintURI = document.getElementById('printURIBtn')
    var tokenTransfer = document.getElementById('transferBtn')
    if(!ethereum.isConnected){
        console.log("not connected to metamask yet")
        welcomeMessage.innerHTML="<p>Please install and connect to Metamask to have access to your data</p>"
        dropdownUser.innerHTML=""
    } else {
        welcomeMessage.innerHTML=""//"<p>Connected to "+await getNetworkName()+"</p>"
    }
    
    
    // add click event listener on the connect button
    //x.addEventListener("click", metamaskInstalled)
    //y.addEventListener("click", getAccount)
    randomGuyAddress.addEventListener("click", async function(){
        try{
            console.log(transferAddress.getAttributeNames())
            transferAddress.setAttribute("value","0xA69E6a7FE3461961AC77a966A19228A9BD1A256e")
        } catch (err){
            console.log(err)
        }
       
    })
    tokenMint.addEventListener("click", function(){
        const tokenId=mintSelect.value
        console.log("select ID : "+tokenId)
        mintFirstNFT(tokenId)
    })
    tokenDelete.addEventListener("click", deleteUserNFT)
    tokenPrint.addEventListener("click", printTokenId)
    tokenPrintURI.addEventListener("click",printTokenURIs)
    tokenTransfer.addEventListener("click",function() { 
        console.log(transferAddress.getAttribute("value"))
        transferNFT(transferAddress.getAttribute("value")) 
        transferAddress.innerText=""
    })
    

    
}



// asks user to connect with metamask extension and returns account address
const getAccount =  async() => {
    try {
        let account= await ethereum.request({method: 'eth_requestAccounts'})
        return account[0]
    } catch (error) {
        alert("Please connect to Metamask")
        console.log('Error connecting to metamask account \n', error)
        return error
    }
}


async function getNetworkName(){
    const chainId=await getChainId()
    const networkId=await getNetworkId()
    console.log([chainId,networkId])
    switch (chainId,networkId) {
        case ('4','4'):
          return "Rinkeby"
        case ( '1','1'):
            return "Mainnet"
        default:
          return "default"
      }
}

// modify NFT property

async function mintFirstNFT(tokenId){

    
    await provider.send("eth_requestAccounts", []);
    // The Contract object
    
        var contractAbi
        getABI().then( async (contractAbi) =>{
            try {
                var tokenURI
            if(tokenId==0){
                tokenURI='metadata/nft-metadata.json'
            }
            if(tokenId==1){
                tokenURI='metadata/nft-metadata-darkC.json'
            }
            console.log("tu as lu mon affectation ?"+ tokenURI)
            console.log("CONTRACT ABI !" + contractAbi)
            const daiContract =  await new ethers.Contract(daiAddress, contractAbi.abi, signer);
            const tx =  daiContract.mintToken(await getAccount(),tokenURI)
            console.log(`Transaction hash: ${tx.hash}`);
            console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
            console.log(`Gas used: ${receipt.gasUsed.toString()}`);
             }catch (err){
                console.log(err)
                return err
            }
        
        
        })
       
}

async function deleteUserNFT(){
    
    await provider.send("eth_requestAccounts", []);
    getABI().then(async (contractABI)=>{
        const daiContract = await new ethers.Contract(daiAddress, contractABI.abi, signer);
        const tx =  daiContract.resetTokens(getAccount())
    })
    
}

async function transferNFT(to){
    
    await provider.send("eth_requestAccounts", []);
    getABI().then(async (contractABI)=>{
        try{
            const daiContract = await new ethers.Contract(daiAddress, contractABI.abi, signer);
            const tx =  await daiContract.transferFrom(getAccount(),to,1)
        }
        catch (err){
            if(err.code==4001){
                alert("You canceled the transaction")
            }
            else{alert("Invalid Address")}
            
        }
    })
    
}

async function printTokenId(){
    getABI().then(async (contractABI)=>{
       const daiContract = await new ethers.Contract(daiAddress, contractABI.abi, signer);
        daiContract.balanceOf("0xe8F93a2a3B260341bb0bD6d951478cDc56faa703").then((balance) =>{
            console.log(parseInt(balance._hex, 16))
        })
        daiContract.getTokenID().then((tokenID) => {
            console.log(tokenID._hex)
        })

    })
    
}

async function printVersion(){
    getABI().then(async (contractABI)=>{
        const daiContract = await new ethers.Contract(daiAddress, contractABI.abi, signer);
        daiContract.getVersion().then((version)=>{
            console.log("Version : "+ version)
        })
    })
}


async function getTokenBalance(user){
    return getABI().then(async function(contractABI){
        const daiContract = await new ethers.Contract(daiAddress, contractABI.abi, signer);
        return daiContract.balanceOf(user)
    })
    .then(function(balance) {
            console.log("BALANCE MEC !" +balance)
            balanceInt= parseInt(balance._hex, 16)
            console.log(balanceInt)
            return balanceInt
        })
}


async function printTokenURIs(){
    getABI().then(async (contractABI)=>{
        const daiContract = await new ethers.Contract(daiAddress, contractABI.abi, signer);
        console.log(await daiContract.getURIList("0xe8F93a2a3B260341bb0bD6d951478cDc56faa703"))
        return await daiContract.getURIList("0xe8F93a2a3B260341bb0bD6d951478cDc56faa703")
    })
}

//transform to getTokenName, for more generic use
async function setTokenName(){
    getABI().then(async (contractABI)=>{
        const daiContract = await new ethers.Contract(daiAddress, contractABI.abi, signer);
        const url= await daiContract.getURIList("0xe8F93a2a3B260341bb0bD6d951478cDc56faa703")
        const json = await (await fetch(url[0])).json()
        return await json.name
    })
}


// checks if user has metamask extension (logs msg atm)
function metamaskInstalled(){
    var isMetaMaskInstalled = () => ethereum.isMetaMaskInstalled
    if (isMetaMaskInstalled){
        return true
    } else {
        //alert('Install Metamask extension to interact with our application')
        return false
    }
}

console.log("Metamask installé ? : "+metamaskInstalled())


// function to get metamask chainID
const getChainId = async () => {
    return parseInt(await ethereum.request({method: 'eth_chainId'}),16)
}

// function to get metamask networkId
const getNetworkId = async () => {
    return await ethereum.request({method: 'net_version'})
}


// get the balance of the connected account
const getBalance = async () => {
    try {
        let account = await getAccount()
        if (account.length === 0) {
            return 'Connect to account first !'
        }
        let balance= await signer.getBalance()
        return ethers.utils.formatEther(balance).substring(0,5) + 'ETH'

    } catch (error) {
        console.log('Error getting balance \n', error)
        return error
    }

}



// event triggered when account is changed in metamask
ethereum.on('accountsChanged', async (accounts) => {
    console.log('Account changed from', account)
    account.innerHTML = await getAccount()
    balance.innerHTML = await getBalance()
})

// event triggered when metamask is connected to chain and can make rpc request
ethereum.on('connect', async () => {
    dropdownUser.innerHTML="<div class=\"dropdown\"><a id=\"connected\" class=\"btn btn-secondary dropdown-toggle\" href=\"#\" role=\"button\" id=\"dropdownMenuLink\" data-bs-toggle=\"dropdown\" aria-expanded=\"false\">Connected to "+await getNetworkName()+"</a><ul class=\"dropdown-menu\" aria-labelledby=\"dropdownMenuLink\"><li><p>Network ID: "+await getNetworkId()+"</p></li><li><p>Chain ID: "+await getChainId()+"</p></li><li><p>Account: "+await getAccount()+"</p></li><li><p>Balance:"+await getBalance()+"</p></li></ul></div>"//"<p>Connected to "+await getNetworkName()+"</p>"
    ethBalance.innerText =  await getBalance()
    const address =  await getAccount()
    setTokenDisplay(address)
    //setTokenDisplay("0xA69E6a7FE3461961AC77a966A19228A9BD1A256e")
    console.log(chainId)
    console.log('Metamask Connected:', ethereum.isConnected())
    printVersion()
})

// event triggered when metamask is disconnected from chain and can not make rpc request
ethereum.on('disconnect', (chainId) => {
    console.log(chainId)
    console.log('Metamask Connected:', ethereum.isConnected())
    alert('Metamask is not connected to ethereum network. Retry!')
})


//  DISPLAY ELEMENTS //
//displays NFTs as card elements (note : add scrollable, max height etc ..)
async function setTokenDisplay(user){
    console.log(favoriteList)
    return getABI().then(async (contractABI)=>{
        var html=""
        var printed 
        const daiContract = await new ethers.Contract(daiAddress, contractABI.abi, signer);
        const uriList= await daiContract.getURIList(user)
        const tokenBalance=await getTokenBalance(user)
        //look through all our token to check if there are favorites
        for (let i=0;i< uriList.length; i++){
            if(uriList[i]!=""){
                printed=false
                const json = await (await fetch(uriList[i])).json()
                console.log(await json.name)
                console.log("favorite List :"+favoriteList.length)
                // go through user's favorite tokens
                for(let j=0;j<favoriteList.length;j++){
                    console.log("tokenId"+json.tokenId)
                    console.log("fav tokenId"+favoriteList[j].tokenId)
                    if(favoriteList[j].tokenId==json.tokenId){
                        printed=true
                        html +=  "<div id=\"cardContainer\" class=\"card\" style=\"order:-1000; width: 18rem; \" > <img src= \""+json.image+"\" class=\"card-img-top\" alt=\"...\"> <div class=\"card-body\"> <h5 class=\"card-title\">"+json.name+"</h5><p class=\"card-text\">" + json.description + "<div class=\"minicontainer\"><button type=\"submit\" value=\"Favorite\" id=\"fav-btn\" name=\"submit\" class=\"active\"><img id=\"star\" src=\"img/star.png\"></button></div></div></div>"
                    } 
                }      
                if(printed==false) {
                    html +=  "<div id=\"cardContainer\" class=\"card\" style=\"width: 18rem; \" > <img src= \""+json.image+"\" class=\"card-img-top\" alt=\"...\"> <div class=\"card-body\"> <h5 class=\"card-title\">"+json.name+"</h5><p class=\"card-text\">" + json.description + "<div class=\"minicontainer\"><button type=\"submit\" value=\"Favorite\" id=\"fav-btn\" name=\"submit\" class=\"\"><img id=\"star\" src=\"img/unactive_star.png\"></button></div></div></div>"
                }          
            }   
        }
        html="<div id=\"displayContainer\" class=\"d-flex flex-row flex-wrap\"><button id=\"tokenBalanceUser\" type=\"button\" class=\"btn btn-primary btn-sm\">"+await getTokenBalance(getAccount())+"NFT</button>" + html + "</div>"
        tokenDisplay.innerHTML= html
        const favButtons = document.querySelectorAll("#fav-btn")
        console.log("fav length"+favButtons.length)
        for(let i=0;i<favButtons.length;i++){
            const json = await (await fetch(uriList[i])).json()
            favButtons[i].addEventListener("click", async function() {
                return fetch("/indexLoggedIn/favUpdate", {
     
                    // Adding method type
                    method: "POST",
                    mode: 'cors',
                    // Adding body or contents to send
                    body: JSON.stringify({
                        contractAddress : daiAddress,
                        tokenId : json.tokenId
                    }),
                     
                    // Adding headers to the request
                    headers: {
                        "Content-type": "application/json"
                    }
                })
                    .then(async function(response) {
                        
                        const favList=await response.json()
                        for( var i = 0; i < uriList.length; i++){ 
                            let json = await (await fetch(uriList[i])).json()
                            let favorited = false
                            for(var j=0;j<favList.length;j++){
                                console.log("fav list :"+JSON.stringify(favList))
                                console.log("uri list :"+JSON.stringify(json))
                                if ( json.tokenId === favList[j].tokenId) { 
                                    console.log("ETOILE JAUNE !")
                                    favButtons[i].firstChild.setAttribute("src","img/star.png")
                                    favButtons[i].parentElement.parentElement.parentElement.setAttribute("style","order:-1000; width: 18rem; ")
                                    favorited=true
                                }
                            }
                            if (favorited==false){
                                favButtons[i].firstChild.setAttribute("src","img/unactive_star.png")
                                favButtons[i].parentElement.parentElement.parentElement.setAttribute("style","order:1000; width: 18rem; ")
                            }
                        }

                    })  
                /*favButtons[i].classList.toggle("active");
                if(favButtons[i].getAttribute("class")=="active"){
                    favButtons[i].innerHTML="<img src=\"img/star.png\">"
                    favButtons[i].parentElement.parentElement.parentElement.parentElement.setAttribute("style","order:-1000; width: 18rem; ")
                } else {
                    favButtons[i].innerHTML="<img src=\"img/unactive_star.png\">"
                    console.log(favButtons[i].parentElement.parentElement.parentElement.parentElement.getAttribute("style"))
                    favButtons[i].parentElement.parentElement.parentElement.parentElement.setAttribute("style","order:1000; width: 18rem; ")
                }*/
            })
        }
    })
}
