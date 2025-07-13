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
├── script.js       # Web3 logic and contract interaction
├── tokenAAbi.js    # Token A ABI
├── tokenBAbi.js    # Token B ABI
├── abiSS.js        # SimpleSwap contract ABI
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

## 🔧 Prerequisites

- MetaMask installed and connected to the Sepolia Ethereum testnet
- Node.js & npm (for running tests)

---

## 🚀 How to Use

1. **Clone this repository** and open `/frontend/index.html` in your browser  
   _or deploy the frontend to your favorite static host._

2. **Connect your wallet:**  
   Click the **Connect Wallet** button (top right) to link your MetaMask account.

3. **Mint tokens:**  
   Use the "Mint Tokens" section to mint test TokenA (TKA) and TokenB (TKB) to your wallet.

4. **Swap tokens:**  
   - Enter an amount in "You send".
   - Use the center button to reverse swap direction.
   - Approve tokens if prompted, then execute the swap.
   - See your balances and the estimated output update in real time.

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

Contract ABIs are included in the `/frontend` folder.

---

## 🧪 Manual Testing

- Mint any amount of TokenA or TokenB
- Try swaps in both directions
- Check balances and price updates after each operation
- Test edge cases (e.g., insufficient balance, zero/negative values)

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
2. Run the tests:
   ```bash
   npx hardhat test
   ```
3. (Optional) Check coverage:
   ```bash
   npx hardhat coverage
   ```

---

## 📸 Screenshots

_Example UI:_



_Test output:_



---

## 📜 License

SPDX-License-Identifier: GPL-3.0  
This project is open-source and intended for educational and testing purposes only.  
**Not recommended for production/mainnet usage without audits.**

---

## 🙌 Credits

Created by **Federico S.**  
Thanks for visiting and testing