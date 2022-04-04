
//import { ethers } from "ethers";
const provider = new ethers.providers.Web3Provider(window.ethereum)
const signer = provider.getSigner();

const daiAddress = "0x6e4873A6ea59d4Af91EC6ef32307300F8D4728D9";

async function getABI(){
    return fetch('/tokenTest.json')
        .then(function(response) {
        return response.json();
        })  
}



const network = document.getElementById('networkId')
const chainId = document.getElementById('chainId')
const account = document.getElementById('accountId')
const balance = document.getElementById('balance')
const ethBalance = document.getElementById('ethBalance')
const tokenName= document.getElementById("tokenName")
const tokenDescription= document.getElementById("tokenDescription")
const tokenDisplay = document.getElementById("tokenDisplay")


window.onload=function(){
    var x=document.getElementById('myButton')
    var y=document.getElementById('metaBtn')
    var connect = document.getElementById('connectToWallet')
    var tokenMint = document.getElementById('mintBtn')
    var tokenDelete = document.getElementById('deleteBtn')
    var tokenPrint = document.getElementById('printBtn')
    var tokenPrintURI = document.getElementById('printURIBtn')
    var tokenTransfer = document.getElementById('transferBtn')
    // add click event listener on the connect button
    x.addEventListener("click", metamaskInstalled)
    y.addEventListener("click", getAccount)
    tokenMint.addEventListener("click", mintFirstNFT)
    tokenDelete.addEventListener("click", deleteUserNFT)
    tokenPrint.addEventListener("click", printTokenId)
    tokenPrintURI.addEventListener("click",printTokenURIs)
    tokenTransfer.addEventListener("click",function() { transferNFT("0xA69E6a7FE3461961AC77a966A19228A9BD1A256e") } )
    connect.addEventListener('click', async (e) => {
        e.preventDefault()
    
        let getAccountAddress = await getAccount()
        if (getAccountAddress.length < 1) {
            console.log("Incorrect Address")
        } else {
            console.log( getAccountAddress)
            account.innerHTML = getAccountAddress
            balance.innerHTML = await getBalance()
            network.innerHTML = await getNetworkId()
            chainId.innerHTML = await getChainId()
        }
        console.log(getAccountAddress)
    })

    
}



// asks user to connect with metamask extension and returns account address
const getAccount =  async() => {
    try {
        let account= await ethereum.request({method: 'eth_requestAccounts'})
        return account[0]
    } catch (error) {
        console.log('Error connecting to metamask account \n', error)
        return error
    }
}



// modify NFT property

async function mintFirstNFT(){

    
    await provider.send("eth_requestAccounts", []);
    // The Contract object
    
        var contractAbi
        getABI().then( async (contractAbi) =>{
            try {
            console.log("CONTRACT ABI !" + contractAbi)
            const daiContract =  await new ethers.Contract(daiAddress, contractAbi.abi, signer);
            const tx =  daiContract.mintToken("0xe8F93a2a3B260341bb0bD6d951478cDc56faa703",'metadata/nft-metadata-darkC.json')
            console.log(`Transaction hash: ${tx.hash}`);

            const receipt = await tx.wait();
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
        const daiContract = await new ethers.Contract(daiAddress, contractABI.abi, signer);
        const tx =  daiContract.transferFrom(getAccount(),to,1)
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

async function setTokenName(){
    getABI().then(async (contractABI)=>{
        const daiContract = await new ethers.Contract(daiAddress, contractABI.abi, signer);
        const url= await daiContract.getURIList("0xe8F93a2a3B260341bb0bD6d951478cDc56faa703")
        const json = await (await fetch(url[0])).json()
        tokenName.innerText= await json.name
        return await json.name
    })
}


// checks if user has metamask extension (logs msg atm)
function metamaskInstalled(){
    var isMetaMaskInstalled = () => ethereum.isMetaMaskInstalled
    if (isMetaMaskInstalled){
        console.log('Metamask is installed !')
    } else {
        alert('Install Metamask extension to interact with our application')
    }
}



// function to get metamask chainID
const getChainId = async () => {
    return await ethereum.request({method: 'eth_chainId'})
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
ethereum.on('connect', async (chainId) => {
    var name = await setTokenName()
    ethBalance.innerText =  await getBalance()
    const address =  getAccount()
    setTokenDisplay( await address)
    //setTokenDisplay("0xA69E6a7FE3461961AC77a966A19228A9BD1A256e")
    console.log(chainId)
    console.log('Metamask Connected:', ethereum.isConnected())
})

// event triggered when metamask is disconnected from chain and can not make rpc request
ethereum.on('disconnect', (chainId) => {
    console.log(chainId)
    console.log('Metamask Connected:', ethereum.isConnected())
    alert('Metamask is not connected to ethereum network. Retry!')
})


//  DISPLAY ELEMENTS //
//displays NFTs as card elements (note : add scrollable, max height etc ..)
function setTokenDisplay(user){
    getABI().then(async (contractABI)=>{
        var html=""
        const daiContract = await new ethers.Contract(daiAddress, contractABI.abi, signer);
        const uriList= await daiContract.getURIList(user)
        const tokenBalance=await getTokenBalance(user)
        for (let i=0;i< tokenBalance; i++){
            if(uriList[i]!=""){
                const json = await (await fetch(uriList[i])).json()
                console.log(await json.name)
                html += await "<div class=\"card\" style=\"width: 18rem; \" > <img src= \""+json.image+"\" class=\"card-img-top\" alt=\"...\"> <div class=\"card-body\"> <h5 class=\"card-title\">"+json.name+"</h5><p class=\"card-text\">" + json.description + "<div class=\"minicontainer\"><form action=\"/indexLoggedIn\" method=\"post\"><input type=\"hidden\" name=\"contractAddress\" id=\"contractAddress\" value=\""+daiAddress+"\"><input type=\"hidden\" name=\"tokenId\" id=\"tokenId\" value=\""+i+"\"><button type=\"submit\" value=\"Favorite\" id=\"fav-btn\" name=\"submit\" class=\"\"><img id=\"star\" src=\"img/unactive_star.png\"></button></form></div></div></div>"
                
            }
            
        }
        html="<p>You have "+tokenBalance +" NFT<div id=\"displayContainer\" class=\"d-flex flex-row flex-wrap\">" + html + "</div>"
        tokenDisplay.innerHTML=await html
        const favButtons =await document.querySelectorAll("#fav-btn")
        console.log(favButtons.length)
        for(let i=0;i<favButtons.length;i++){
            favButtons[i].addEventListener("click",function() {
                favButtons[i].classList.toggle("active");
                if(favButtons[i].getAttribute("class")=="active"){
                    favButtons[i].innerHTML="<img src=\"img/star.png\">"
                    favButtons[i].parentElement.parentElement.parentElement.parentElement.setAttribute("style","order:-1000; width: 18rem; ")
                } else {
                    favButtons[i].innerHTML="<img src=\"img/unactive_star.png\">"
                    console.log(favButtons[i].parentElement.parentElement.parentElement.parentElement.getAttribute("style"))
                    favButtons[i].parentElement.parentElement.parentElement.parentElement.setAttribute("style","order:1000; width: 18rem; ")
                }
            })
        }
    })
}
