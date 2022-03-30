// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract tokenData {

    
    struct Token{
        address mintedBy;
        uint64 mintedAt;
    }

    Token[] tokenList;
    mapping (address => string[] ) tokenCollection;
    mapping ( uint256 => string ) tokenURIs; // mapping id token => URI du token
    mapping ( uint256 => address ) tokenOwner; //mapping id token => adresse du propriétaire
    mapping ( address => uint64 ) tokenBalance; // mapping addresse propriétaire => nombre de tokens possédés
    mapping (uint => address) tokenApprovals; // mapping id token => adresse approuvée
    mapping ( address => mapping( address => bool)) operatorApprovals; // mapping de propriétaire à l'opérator approval pour les adresses des autres
}