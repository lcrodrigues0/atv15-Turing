// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Turing is ERC20 {
    address private owner;
    address private teacher; 

    bool private isVotingOn = true;

    mapping(string => address) private registeredUsers;
    mapping(address => bool) private authorizedUsers;
    mapping(address => mapping(address => bool)) hasVoted;
    mapping(string => uint256) balances;

    event BalancesChanged(address userAddress);
    event VotingOn();
    event VotingOff();

    address[8] userAddresses = [
        0x70997970C51812dc3A010C7d01b50e0d17dc79C8,
        0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC,
        0x90F79bf6EB2c4f870365E785982E1f101E93b906,
        0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65,
        0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc,
        0x976EA74026E726554dB657fA54763abd0C3a0aa9,
        0x14dC79964da2C08b23698B3D3cc7Ca32193d9955,
        0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f 
    ];

    string[8] userNames = [
        "nome1", 
        "nome2", 
        "nome3", 
        "nome4", 
        "nome5", 
        "nome6", 
        "nome7", 
        "nome8"
    ];

    constructor() ERC20 ("Turing", "Turing"){       
        for (uint256 i = 0; i < userNames.length; i++){
            authorizedUsers[userAddresses[i]] = true;
            registeredUsers[userNames[i]] = userAddresses[i];
            balances[userNames[i]] = 0;
        }   

        owner = msg.sender;
        // owner = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266;
        teacher = 0x502542668aF09fa7aea52174b9965A7799343Df7;
    }

    modifier isSpecialUser(address senderAddress){
        require(senderAddress == owner || senderAddress == teacher, "User isn't a special user");
        _;
    }

    modifier onlyOnVotingOn(){
        require(isVotingOn, "Voting is off");
        _;
    }

    modifier isAuthorizedUser(address senderAddress){
        require(authorizedUsers[senderAddress], "User isn't an authorized user");
        _;
    }

    function issueToken(string memory codename, uint qtdSaTuring) public isSpecialUser(msg.sender){
        address addrUser = registeredUsers[codename];
        _mint(addrUser, qtdSaTuring);

        balances[codename] = balanceOf(addrUser);

        emit BalancesChanged(msg.sender);
    }

    function vote(string memory codename, uint qtdSaTuring) public isAuthorizedUser(msg.sender) onlyOnVotingOn() {
        address addrUser = registeredUsers[codename];

        require(registeredUsers[codename] == address(0));
        require(msg.sender != addrUser, "User can't vote for itself");
        require(!hasVoted[msg.sender][addrUser], "User has already voted for this user");
        require(qtdSaTuring <= 2000000000000000000, "Maximum SaTurings");

        _mint(addrUser, qtdSaTuring);
        _mint(msg.sender, 200000000000000000);
        hasVoted[msg.sender][addrUser] = true;

        balances[codename] = balanceOf(addrUser);

        emit BalancesChanged(msg.sender);
    }

    function votingOn() public isSpecialUser(msg.sender){
        isVotingOn = true;
        emit VotingOn();
    }

    function votingOff() public isSpecialUser(msg.sender){
        isVotingOn = false;
        emit VotingOff();
    }

    function addAthorizedUser(string memory codename, address userAddress) public isSpecialUser(msg.sender){
        authorizedUsers[userAddress] = true;
        registeredUsers[codename] = userAddress; 
    }

    function getUserInfos() public view returns(string[8] memory, uint256[8] memory){
        uint256[8] memory userBalances;

        for (uint256 i = 0; i < userNames.length; i++){
            userBalances[i] = balances[userNames[i]];
        }   

        return (userNames, userBalances);
    }

    function getSpecialUsers() public view returns (address[2] memory){
        return [owner, teacher];
    }

    function getAuthorizedUsers() public view returns (address[8] memory){
        return userAddresses;
    }

    function ifHasVoted(address userAdress, string memory username) public view returns (bool){
        address otherAddress = registeredUsers[username];

        return (hasVoted[userAdress][otherAddress]);
    }

    function getUserAddress (string memory userName) public view returns (address){
        address userAddress = registeredUsers[userName];
        return userAddress;
    }

    function getIsVotingOn() public view returns (bool){
        return isVotingOn;
    }
}