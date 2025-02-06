// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Turing is ERC20 {
    address private owner;
    bool private isVotingOn = true;
    uint private conversion = 10000000000000000000;

    mapping(string => address) private registeredUsers;
    mapping(address => bool) private authorizedUsers;
    mapping(address => mapping(address => bool)) hasVoted;

    constructor() ERC20 ("Turing", "Turing"){
        authorizedUsers[0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266] = true;
        
        authorizedUsers[0x70997970C51812dc3A010C7d01b50e0d17dc79C8] = true;
        authorizedUsers[0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC] = true;
        authorizedUsers[0x90F79bf6EB2c4f870365E785982E1f101E93b906] = true;
        authorizedUsers[0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65] = true;
        authorizedUsers[0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc] = true;
        authorizedUsers[0x976EA74026E726554dB657fA54763abd0C3a0aa9] = true;
        authorizedUsers[0x14dC79964da2C08b23698B3D3cc7Ca32193d9955] = true;
        authorizedUsers[0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f] = true;

        registeredUsers["nome1"] = 0x70997970C51812dc3A010C7d01b50e0d17dc79C8;
        registeredUsers["nome2"] = 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC;
        registeredUsers["nome3"] = 0x90F79bf6EB2c4f870365E785982E1f101E93b906;
        registeredUsers["nome4"] = 0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65;
        registeredUsers["nome5"] = 0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc;
        registeredUsers["nome6"] = 0x976EA74026E726554dB657fA54763abd0C3a0aa9;
        registeredUsers["nome7"] = 0x14dC79964da2C08b23698B3D3cc7Ca32193d9955;
        registeredUsers["nome8"] = 0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f;

        owner = msg.sender;
    }

    modifier isSpecialUser(address senderAddress){
        require(senderAddress == owner || senderAddress == 0x502542668aF09fa7aea52174b9965A7799343Df7);
        _;
    }

    modifier onlyOnVotingOn(){
        require(isVotingOn);
        _;
    }

    modifier isAuthorizedUser(address senderAddress){
        require(authorizedUsers[senderAddress]);
        _;
    }

    function issueToken(address addrUser, uint qtdSaTuring) public isSpecialUser(msg.sender){
        _mint(addrUser, qtdSaTuring);
    }

    function vote(string memory userName, uint qtdSaTuring) public isAuthorizedUser(msg.sender) onlyOnVotingOn() {
        address addrUser = registeredUsers[userName];

        require(msg.sender != addrUser);
        require(!hasVoted[msg.sender][addrUser]);
        require(qtdSaTuring <= 2000000000000000000);

        _mint(addrUser, qtdSaTuring);
        _mint(msg.sender, 200000000000000000);
    }

    function votingOn() public isSpecialUser(msg.sender){
        isVotingOn = true;
    }

    function votingOff() public isSpecialUser(msg.sender){
        isVotingOn = false;
    }

    function addAthorizedUser(string memory codename, address userAddress) public isSpecialUser(msg.sender){
        authorizedUsers[userAddress] = true;
        registeredUsers[codename] = userAddress; 
    }


}