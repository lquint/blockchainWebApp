import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { checkProperties } from 'ethers/lib/utils';
chai.use(chaiAsPromised)
const { expect, assert } = chai

var tokenTest = artifacts.require("tokenTest");

contract('Testing ERC721 contract', function(accounts) {
    it(' should be able to deploy and mint ERC721 token', async () => {

    token= tokenTest.new()
    expect(await tokenTest.getBalance("0xe8F93a2a3B260341bb0bD6d951478cDc56faa703")).to.equal(0)
    var id=await tokenTest.mintToken("0xe8F93a2a3B260341bb0bD6d951478cDc56faa703",'https://gateway.pinata.cloud/ipfs/QmaeGTRMp3XBZMyWbJTmLhYoCq7Mr9C29iRh1MFoNFs1K3')
    expect(id).to.equal(1)
    expect(await tokenTest.getBalance("0xe8F93a2a3B260341bb0bD6d951478cDc56faa703")).to.equal(1) 
    console.log(tokenTest.getBalance("0xe8F93a2a3B260341bb0bD6d951478cDc56faa703"))
    })

    it("please run a test", ()=>{
        expect(0).to.equal(0)
    })
})