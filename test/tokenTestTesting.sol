pragma solidity ^0.8.0;

import "truffle/DeployedAddresses.sol";
import "truffle/Assert.sol";
import "../contracts/tokenData.sol";
import "../contracts/tokenTest.sol";

contract tokenTestTesting{
    function testInit() public{
  
  
        tokenTest token= tokenTest(DeployedAddresses.tokenTest());
        Assert.equal(token.mintToken(0xe8F93a2a3B260341bb0bD6d951478cDc56faa703,"https://gateway.pinata.cloud/ipfs/QmaeGTRMp3XBZMyWbJTmLhYoCq7Mr9C29iRh1MFoNFs1K3"),1);
        Assert.equal(token.getURIs("0xe8F93a2a3B260341bb0bD6d951478cDc56faa703")==[""]);
    }

}