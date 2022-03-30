
//import { ethers } from "ethers";
const provider = new ethers.providers.Web3Provider(window.ethereum)
const signer = provider.getSigner();

/*
let contract
var request = new XMLHttpRequest();
request.open("GET", "tokenTest.json", false);
request.send(null);
request.onreadystatechange = function() {
  if ( request.readyState === 4 && request.status === 200 ) {
    contract = JSON.parse(request.responseText);
    console.log(contract);
  }
}
*//*
var contract
var request = new XMLHttpRequest();
request.open("GET", "tokenTest.json", true);
request.send(null)
console.log(request.responseText)
console.log(request)
request.onreadystatechange = function() {
if ( request.readyState === 4 && request.status === 200 ) {
    contract = JSON.parse(request.responseText);
    console.log(contract)
}
}
console.log(contract)*/




  

const daiAddress = "0x4dabdd79fef74fe226362df3963af50be6cd4ace";
const myContractABI= [
    "function mintToken(address to, string memory tokenURI) external returns (uint tokenId)",
    "function deleteToken(address to) public",
    "function balanceOf(address _owner) public view returns (uint256)",
    "function getTokenID() public view returns (uint256)",
  ]

async function getABI(){
    return fetch('/tokenTest.json')
.then(function(response) {
  return response.json().abi;
})
    
}





const network = document.getElementById('networkId')
const chainId = document.getElementById('chainId')
const account = document.getElementById('accountId')
const balance = document.getElementById('balance')
const ethBalance = document.getElementById('ethBalance')

window.onload=function(){
    
    var x=document.getElementById('myButton')
    var y=document.getElementById('metaBtn')
    var connect = document.getElementById('connectToWallet')
    var tokenMint = document.getElementById('mintBtn')
    var tokenDelete = document.getElementById('deleteBtn')
    var tokenPrint = document.getElementById('printBtn')
    // add click event listener on the connect button

    x.addEventListener("click", metamaskInstalled)
    y.addEventListener("click", getAccount)
    tokenMint.addEventListener("click", mintFirstNFT)
    tokenDelete.addEventListener("click", deleteFirstNFT)
    tokenPrint.addEventListener("click", printTokenId)
    connect.addEventListener('click', async (e) => {
        e.preventDefault()
    
        let getAccountAddress = await getAccount()
        if (getAccountAddress.length < 1) {
            getAccountAddress = await getAccount()
            account.innerHTML = getAccountAddress
            balance.innerHTML = await getBalance()
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
        return account
    } catch (error) {
        console.log('Error connecting to metamask account \n', error)
        return error
    }
}

getABI().then((abi) =>{
    console.log(abi)

})

async function mintFirstNFT(){

    
    await provider.send("eth_requestAccounts", []);
    // The Contract object
    
        var contractAbi
        getABI().then( async (contractAbi) =>{
            try {
            console.log("CONTRACT ABI !" + contractAbi)
            const daiContract = await new ethers.Contract(daiAddress, myContractABI, signer);
            const tx =  daiContract.mintToken("0xe8F93a2a3B260341bb0bD6d951478cDc56faa703",'https://gateway.pinata.cloud/ipfs/QmaeGTRMp3XBZMyWbJTmLhYoCq7Mr9C29iRh1MFoNFs1K3')
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

async function deleteFirstNFT(){
    
    await provider.send("eth_requestAccounts", []);
    getABI().then(async (contractABI)=>{
        const daiContract = await new ethers.Contract(daiAddress, contractABI, signer);
        const tx =  daiContract.deleteToken("0xe8F93a2a3B260341bb0bD6d951478cDc56faa703")
    })
    
}

async function printTokenId(){
    const daiContract = await new ethers.Contract(daiAddress, myContractABI, signer);
    daiContract.balanceOf("0xe8F93a2a3B260341bb0bD6d951478cDc56faa703").then((balance) =>{
        console.log("print")
        console.log(balance)
    })
    daiContract.getTokenID().then((tokenID) => {
        console.log(tokenID._hex)
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
    ethBalance.innerText =  await getBalance()
    console.log(chainId)
    console.log('Metamask Connected:', ethereum.isConnected())
})

// event triggered when metamask is disconnected from chain and can not make rpc request
ethereum.on('disconnect', (chainId) => {
    console.log(chainId)
    console.log('Metamask Connected:', ethereum.isConnected())
    alert('Metamask is not connected to ethereum network. Retry!')
})
