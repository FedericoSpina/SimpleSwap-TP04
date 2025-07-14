# 🔃 SimpleSwap DApp

A simple and modern web application to interact with an ERC-20 token swap contract deployed on the Sepolia Ethereum testnet.  
Built with HTML, TailwindCSS, and JavaScript (Ethers.js), with MetaMask integration and automated smart contract tests using Hardhat.

---

## 🌐 Overview

This project allows you to:

- **Connect your MetaMask wallet**
- **View balances** of two custom tokens (Token A and Token B)
- **Swap tokens** using the SimpleSwap contract
- **See real-time exchange rates**
- **Mint both tokens** directly from the interface

Ideal for learning and testing a minimal decentralized exchange (DEX) environment with custom contracts.

---

## 📁 Project Structure

```
/frontend
│
├── index.html      # Main user interface (TailwindCSS)
├── script.js       # Web3 logic and contract interaction, and ABIs
│
/test
├── SimpleSwap.js   # Hardhat automated contract tests
```

---

## ⚙️ Technologies Used

- HTML5 / TailwindCSS / JavaScript
- [Ethers.js](https://docs.ethers.org/)
- [MetaMask](https://metamask.io/)
- Solidity (SimpleSwap contract)
- Hardhat (for testing)

---

## 🚀 How to Use
1. ** Clone this repository and open /frontend/index.html in your browser **
or deploy the frontend to your favorite static host.

2. **Connect your wallet:**
Click the Connect Wallet button (top right) to link your MetaMask account.

3. **Mint tokens:**
Use the "Mint Tokens & Liquidity" section to mint test TokenA (TKA) and TokenB (TKB) to your wallet. You'll need some tokens to add liquidity.

4. **Add Initial Liquidity:**
After minting tokens, use the "Add Initial Liquidity" button in the "Mint Tokens & Liquidity" section. This will populate the swap pool, allowing swaps to function.

5. **Swap tokens:**

- Enter an amount in "You send".

- Use the center button to reverse swap direction.

- Approve tokens if prompted, then execute the swap.

- See your balances and the estimated output update in real time.

---

## 🔧 Prerequisites

- MetaMask installed and connected to the Sepolia Ethereum testnet
- Node.js & npm (for running tests)

---


## 🔄 Features

- **Live balances** and price updates
- **Animated swap direction button** for intuitive UX
- **Token minting** directly from the UI
- **Approve & Swap** flow with clear feedback
- **Error handling** for invalid inputs, insufficient balance, and expired deadlines

---

## 🧪 Contracts Used

The frontend is configured for the following contracts on Sepolia:

- **SimpleSwap:** `0xAB17AD9076268185f98D6408e066819E2Bd9d04E`
- **TokenA:** `0xF5868801cf665b60821FBD26e0846326BfCCbD79`
- **TokenB:** `0x4c55a1C8606B53d4c26FBc75433C1698F546f48e`


---

## ✅ Automated Testing with Hardhat

Automated tests for the SimpleSwap contract are included in `/test/SimpleSwap.js`.  
Tests cover:

- **Contract deployment and token minting**
- **Liquidity management** (add/remove liquidity)
- **Price and output calculations**
- **Token swaps and event emission**
- **Reverts and validations** (e.g., expired deadlines, insufficient liquidity)

### ▶️ Running the Tests

1. Install dependencies:
   ```bash
   npm install
   ```
2. Install hardhat toolbox:
   ```bash
   npm install --save-dev @nomicfoundation/hardhat-toolbox
   ```
3. Run the tests:
   ```bash
   npx hardhat test
   ```
4. Check coverage:
   ```bash
   npx hardhat coverage
   ```

---

## 📸 Screenshots

_Example UI:_

<img width="295" height="525" alt="chrome-capture-2025-07-13" src="https://github.com/user-attachments/assets/8c735cc7-8294-494c-b699-0b9906b172ec" />


_Test output:_

<img width="546" height="614" alt="(2) Testing Hardhat - simpleswap" src="https://github.com/user-attachments/assets/f88849d7-2fc5-4c4e-8229-5189df9da205" />


---

## 📜 License

SPDX-License-Identifier: GPL-3.0  
This project is open-source and intended for educational and testing purposes only.  
**Not recommended for production/mainnet usage without audits.**

---

## 🙌 Credits

Created by **Federico S.**  
Thanks for visiting and testing
