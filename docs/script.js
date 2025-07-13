// script.js
// Connects to a deployed SimpleSwap smart contract and two ERC20 mock tokens
// Handles: wallet connection, token balance fetching, minting, token swap with approval, and adding liquidity.

// IMPORTANT: Update these addresses to your deployed contract and token addresses
const simpleSwapAddress = "0x57B8085092473392983D8f311903814ecd1ada62";
const tokenAAddress = "0xA142c536A58dc69584C1e345BfAD8c753c2a54C4";
const tokenBAddress = "0x5EBedce1861165D427BEa9D0fc27F99Aa8cD4284";

// Token ABIs (ERC20 standard interface) - copied from your provided code
const tokenAAbi = [ { "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "allowance", "type": "uint256" }, { "internalType": "uint256", "name": "needed", "type": "uint256" } ], "name": "ERC20InsufficientAllowance", "type": "error" }, { "inputs": [ { "internalType": "address", "name": "sender", "type": "address" }, { "internalType": "uint256", "name": "balance", "type": "uint256" }, { "internalType": "uint256", "name": "needed", "type": "uint256" } ], "name": "ERC20InsufficientBalance", "type": "error" }, { "inputs": [ { "internalType": "address", "name": "approver", "type": "address" } ], "name": "ERC20InvalidApprover", "type": "error" }, { "inputs": [ { "internalType": "address", "name": "receiver", "type": "address" } ], "name": "ERC20InvalidReceiver", "type": "error" }, { "inputs": [ { "internalType": "address", "name": "sender", "type": "address" } ], "name": "ERC20InvalidSender", "type": "error" }, { "inputs": [ { "internalType": "address", "name": "spender", "type": "address" } ], "name": "ERC20InvalidSpender", "type": "error" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "Transfer", "type": "event" }, { "inputs": [ { "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" } ], "name": "allowance", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "approve", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "account", "type": "address" } ], "name": "balanceOf", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "decimals", "outputs": [ { "internalType": "uint8", "name": "", "type": "uint8" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "mint", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "name", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "transfer", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "transferFrom", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" } ];
const tokenBAbi = [ { "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "allowance", "type": "uint256" }, { "internalType": "uint256", "name": "needed", "type": "uint256" } ], "name": "ERC20InsufficientAllowance", "type": "error" }, { "inputs": [ { "internalType": "address", "name": "sender", "type": "address" }, { "internalType": "uint256", "name": "balance", "type": "uint256" }, { "internalType": "uint256", "name": "needed", "type": "uint256" } ], "name": "ERC20InsufficientBalance", "type": "error" }, { "inputs": [ { "internalType": "address", "name": "approver", "type": "address" } ], "name": "ERC20InvalidApprover", "type": "error" }, { "inputs": [ { "internalType": "address", "name": "receiver", "type": "address" } ], "name": "ERC20InvalidReceiver", "type": "error" }, { "inputs": [ { "internalType": "address", "name": "sender", "type": "address" } ], "name": "ERC20InvalidSender", "type": "error" }, { "inputs": [ { "internalType": "address", "name": "spender", "type": "address" } ], "name": "ERC20InvalidSpender", "type": "error" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "Transfer", "type": "event" }, { "inputs": [ { "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" } ], "name": "allowance", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "approve", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "account", "type": "address" } ], "name": "balanceOf", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "decimals", "outputs": [ { "internalType": "uint8", "name": "", "type": "uint8" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" } ], "name": "mint", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "name", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "transfer", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" } ], "name": "transferFrom", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" } ];

// SimpleSwap ABI - copied from your provided code
const abiSS = [ { "inputs": [ { "internalType": "address", "name": "_tokenA", "type": "address" }, { "internalType": "address", "name": "_tokenB", "type": "address" } ], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "provider", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amountA", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "amountB", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "liquidityMinted", "type": "uint256" } ], "name": "LiquidityAdded", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "provider", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amountA", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "amountB", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "liquidityBurned", "type": "uint256" } ], "name": "LiquidityRemoved", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "swapper", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "amountIn", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "amountOut", "type": "uint256" }, { "indexed": false, "internalType": "address", "name": "tokenIn", "type": "address" }, { "indexed": false, "internalType": "address", "name": "tokenOut", "type": "address" } ], "name": "TokensSwapped", "type": "event" }, { "inputs": [ { "internalType": "address", "name": "addTokenA", "type": "address" }, { "internalType": "address", "name": "addTokenB", "type": "address" }, { "internalType": "uint256", "name": "amountADesired", "type": "uint256" }, { "internalType": "uint256", "name": "amountBDesired", "type": "uint256" }, { "internalType": "uint256", "name": "amountAMin", "type": "uint256" }, { "internalType": "uint256", "name": "amountBMin", "type": "uint256" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" } ], "name": "addLiquidity", "outputs": [ { "internalType": "uint256", "name": "amountA", "type": "uint256" }, { "internalType": "uint256", "name": "amountB", "type": "uint256" }, { "internalType": "uint256", "name": "liquidity", "type": "uint256" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "amountIn", "type": "uint256" }, { "internalType": "uint256", "name": "amountA", "type": "uint256" }, { "internalType": "uint256", "name": "amountB", "type": "uint256" } ], "name": "getAmountOut", "outputs": [ { "internalType": "uint256", "name": "amountOut", "type": "uint256" } ], "stateMutability": "pure", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "_tokenA", "type": "address" }, { "internalType": "address", "name": "_tokenB", "type": "address" } ], "name": "getPrice", "outputs": [ { "internalType": "uint256", "name": "price", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "", "type": "address" } ], "name": "liquidityBalance", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "addTokenA", "type": "address" }, { "internalType": "address", "name": "addTokenB", "type": "address" }, { "internalType": "uint256", "name": "liquidity", "type": "uint256" }, { "internalType": "uint256", "name": "amountAMin", "type": "uint256" }, { "internalType": "uint256", "name": "amountBMin", "type": "uint256" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" } ], "name": "removeLiquidity", "outputs": [ { "internalType": "uint256", "name": "amountA", "type": "uint256" }, { "internalType": "uint256", "name": "amountB", "type": "uint256" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "reserveA", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "reserveB", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "amountIn", "type": "uint256" }, { "internalType": "uint256", "name": "amountOutMin", "type": "uint256" }, { "internalType": "address[]", "name": "path", "type": "address[]" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" } ], "name": "swapExactTokensForTokens", "outputs": [ { "internalType": "uint256[]", "name": "amounts", "type": "uint256[]" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "tokenA", "outputs": [ { "internalType": "contract IERC20", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "tokenB", "outputs": [ { "internalType": "contract IERC20", "name": "", "type": "address" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalLiquidity", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" } ];


let provider, signer, userAddress, simpleSwap, tokenA, tokenB;
let currentPrice = 0;
let reverseSwap = false; // Initialize reverseSwap state

// Expose functions to the global scope for HTML onclick attributes
window.toggleSwapDirection = toggleSwapDirection;
window.setValueTokenToSpend = setValueTokenToSpend;
window.updateSwapButton = updateSwapButton;
window.handleApproveOrSwap = handleApproveOrSwap;
window.connect = connect;
window.mintTokenA = mintTokenA;
window.mintTokenB = mintTokenB;
window.animateSwapButton = animateSwapButton;
window.addInitialLiquidity = addInitialLiquidity;

// Connect to MetaMask and initialize contracts
async function connect() {
    if (!window.ethereum) {
        alert("❌ MetaMask not detected. Please install MetaMask to use this dApp.");
        return;
    }

    try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });

        provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();
        userAddress = accounts[0]; // Use accounts[0] directly

        document.getElementById("account").innerText = userAddress;

        tokenA = new ethers.Contract(tokenAAddress, tokenAAbi, signer);
        tokenB = new ethers.Contract(tokenBAddress, tokenBAbi, signer);
        simpleSwap = new ethers.Contract(simpleSwapAddress, abiSS, signer);

        // Fetch reserves directly from SimpleSwap contract
        const reserveA = await simpleSwap.reserveA();
        const reserveB = await simpleSwap.reserveB();
        console.log("Reserves A: " + ethers.utils.formatUnits(reserveA, 18));
        console.log("Reserves B: " + ethers.utils.formatUnits(reserveB, 18));

        await fetchBalances();
        await getPrice(); // Attempt to get price immediately after connection
        await updateSwapButton(); // Update swap button state based on balances/liquidity

        // --- Enable UI elements after successful connection ---
        document.getElementById("mintAmountA").disabled = false;
        document.getElementById("mintAmountB").disabled = false;
        document.getElementById("mintButtonA").disabled = false;
        document.getElementById("mintButtonB").disabled = false;
        document.getElementById("addLiquidityButton").disabled = false; // Enable liquidity button
        document.querySelector('.IHAVE').disabled = false; // Enable "You send" input field
        document.getElementById("swap-reverse-btn").disabled = false; // Enable swap reverse button

    } catch (err) {
        console.error("❌ MetaMask connection error:", err);
        let errorMessage = "Error connecting to MetaMask.";
        if (err.code === 4001) {
            errorMessage = "Connection rejected by user.";
        } else if (err.message) {
            errorMessage += " " + err.message;
        }
        alert("❌ " + errorMessage);
        disableAllButtons(); // Disable all interaction buttons on error
        document.getElementById("connect").disabled = false; // Keep connect button enabled
    }
}

// Disables all interactive buttons/inputs when not connected or on error
function disableAllButtons() {
    document.getElementById("mintAmountA").disabled = true;
    document.getElementById("mintAmountB").disabled = true;
    document.getElementById("mintButtonA").disabled = true;
    document.getElementById("mintButtonB").disabled = true;
    document.getElementById("addLiquidityButton").disabled = true;
    document.querySelector('.IHAVE').disabled = true; // Disable "You send" input
    document.querySelector('.IWANT').value = ""; // Clear output field
    document.getElementById("swap-submit").disabled = true;
    document.getElementById("swap-reverse-btn").disabled = true; // Disable swap reverse button
    document.getElementById("precio").textContent = "0 TKB"; // Reset price display (using new ID)
}

// Show token balances
async function fetchBalances() {
    if (!userAddress || !tokenA || !tokenB) {
        document.getElementById("balanceA").innerText = "0";
        document.getElementById("balanceB").innerText = "0";
        return;
    }
    try {
        const balanceA = await tokenA.balanceOf(userAddress);
        const balanceB = await tokenB.balanceOf(userAddress);

        // Format balances for display
        document.getElementById("balanceA").innerText = ethers.utils.formatUnits(balanceA, 18);
        document.getElementById("balanceB").innerText = ethers.utils.formatUnits(balanceB, 18);

        // Update the displayed balance for the "send" side based on reverseSwap
        // The HTML uses balanceA and balanceB directly, not send-balance/receive-balance for the main balance display
        // The labels "You send (Token A)" and "You receive (Token B)" are updated in toggleSwapDirection
    } catch (err) {
        console.error("Error fetching balances:", err);
        document.getElementById("balanceA").innerText = "Error";
        document.getElementById("balanceB").innerText = "Error";
    }
}

// Get current exchange price between tokenA and tokenB
async function getPrice() {
    if (!simpleSwap || !tokenAAddress || !tokenBAddress) {
        document.getElementById("precio").innerText = "Not connected";
        return;
    }
    try {
        const price = await simpleSwap.getPrice(tokenAAddress, tokenBAddress);
        currentPrice = ethers.utils.formatUnits(price, 18);
        // Adjust price display based on swap direction
        document.getElementById("precio").innerText = currentPrice + (reverseSwap ? " TKA/TKB" : " TKB/TKA");
    } catch (err) {
        console.error("Error getting price:", err);
        // Specific check for "No liquidity available"
        if (err.message && err.message.includes("No liquidity available")) {
            document.getElementById("precio").innerText = "No liquidity";
        } else {
            document.getElementById("precio").innerText = "Error";
        }
    }
}

// Calculate output amount from input based on AMM formula
async function setValueTokenToSpend() {
    const inputElement = document.querySelector('.IHAVE');
    const outputInput = document.querySelector('.IWANT');
    const priceLabel = document.getElementById("precio");

    if (!simpleSwap || !tokenAAddress || !tokenBAddress || !userAddress) {
        outputInput.value = "Connect wallet";
        priceLabel.textContent = "Connect wallet";
        return;
    }

    const input = inputElement.value.trim();

    if (!input || isNaN(input) || parseFloat(input) <= 0) {
        outputInput.value = "";
        priceLabel.textContent = "0 " + (reverseSwap ? "TKA" : "TKB");
        await updateSwapButton(); // Still update button even if input is empty
        return;
    }

    try {
        // Parse input amount, assuming 18 decimals for ERC20 tokens
        const parsedAmount = ethers.utils.parseUnits(input, 18);

        // Get reserves directly from SimpleSwap contract
        const reserveA = await simpleSwap.reserveA();
        const reserveB = await simpleSwap.reserveB();

        let reserveIn, reserveOut, symbolOut;
        if (reverseSwap) {
            reserveIn = reserveB;
            reserveOut = reserveA;
            symbolOut = "TKA";
        } else {
            reserveIn = reserveA;
            reserveOut = reserveB;
            symbolOut = "TKB";
        }

        if (reserveIn.isZero() || reserveOut.isZero()) {
            outputInput.value = "No liquidity";
            priceLabel.textContent = "No liquidity";
            await updateSwapButton(); // Update button to reflect no liquidity
            return;
        }

        const outEstimate = await simpleSwap.getAmountOut(parsedAmount, reserveIn, reserveOut);
        outputInput.value = ethers.utils.formatUnits(outEstimate, 18); // Format for display
        priceLabel.textContent = `${ethers.utils.formatUnits(outEstimate, 18)} ${symbolOut}`;
        await updateSwapButton();
    } catch (err) {
        console.error("Error calculating output:", err);
        if (err.message && err.message.includes("No liquidity available")) {
             outputInput.value = "No liquidity";
             priceLabel.textContent = "No liquidity";
        } else {
            outputInput.value = "Error";
            priceLabel.textContent = "Error";
        }
        await updateSwapButton(); // Update button on error
    }
}

async function mintTokenA() {
    await mintToken(tokenA, "mintAmountA", "Token A");
}

async function mintTokenB() {
    await mintToken(tokenB, "mintAmountB", "Token B");
}

async function mintToken(tokenContract, inputId, tokenName) {
    if (!userAddress || !tokenContract) {
        alert("Please connect your wallet first.");
        return;
    }
    try {
        const amount = document.getElementById(inputId).value; // Get value as string
        if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
            alert(`❌ Enter a valid amount for ${tokenName}`);
            return;
        }
        // Parse to wei (BigNumber) assuming 18 decimals
        const parsedAmount = ethers.utils.parseUnits(amount, 18);

        showSpinner();
        const tx = await tokenContract.mint(userAddress, parsedAmount);
        await tx.wait();
        alert(`✅ Minted ${amount} ${tokenName}\nTx Hash: ${tx.hash}`);
        hideSpinner();
        document.getElementById(inputId).value = ""; // Clear input after mint
        await fetchBalances();
    } catch (err) {
        console.error(err);
        hideSpinner();
        alert(`❌ Error minting ${tokenName}: ${err.reason || err.message}`);
    }
}

async function handleApproveOrSwap() {
    const input = document.querySelector('.IHAVE').value.trim();
    const button = document.getElementById("swap-submit");

    if (!input || isNaN(input) || parseFloat(input) <= 0) {
        alert("❌ Enter a valid amount first.");
        return;
    }

    if (!userAddress || !simpleSwap || !tokenA || !tokenB) {
        alert("Please connect your wallet.");
        return;
    }

    try {
        // Parse input amount, assuming 18 decimals for ERC20 tokens
        const parsedAmount = ethers.utils.parseUnits(input, 18);

        const tokenToSpend = reverseSwap ? tokenB : tokenA; // Determine which token to spend
        const tokenToReceive = reverseSwap ? tokenA : tokenB; // Determine which token to receive
        const allowance = await tokenToSpend.allowance(userAddress, simpleSwapAddress);

        showSpinner();
        button.disabled = true; // Disable button during operation

        if (allowance.lt(parsedAmount)) {
            console.log(`Approving ${reverseSwap ? 'Token B' : 'Token A'}...`);
            const tx = await tokenToSpend.approve(simpleSwapAddress, parsedAmount);
            await tx.wait();
            alert(`✅ Approved Token\nTx Hash: ${tx.hash}`);
        } else {
            console.log("Performing swap...");
            const path = reverseSwap ? [tokenBAddress, tokenAAddress] : [tokenAAddress, tokenBAddress];
            const deadline = Math.floor(Date.now() / 1000) + 600; // 10 minutes from now

            const tx = await simpleSwap.swapExactTokensForTokens(
                parsedAmount,
                0, // amountOutMin: Set to 0 for simplicity, consider user input for slippage control
                path,
                userAddress,
                deadline
            );
            const receipt = await tx.wait();

            // Check for TokensSwapped event if available in the ABI
            const event = receipt.events?.find((e) => e.event === "TokensSwapped");

            if (event && event.args) {
                const { swapper, amountIn, amountOut, tokenIn, tokenOut } = event.args;
                // Format event arguments for display
                const formattedIn = ethers.utils.formatUnits(amountIn, 18);
                const formattedOut = ethers.utils.formatUnits(amountOut, 18);

                alert(
                    `✅ Swap realizado con éxito\n📄 Tx Hash: ${tx.hash}\n\n` +
                    `👤 Swapper: ${swapper}\n` +
                    `💸 Cantidad enviada: ${formattedIn}\n` +
                    `💰 Cantidad recibida: ${formattedOut}\n` +
                    `🔁 From: ${tokenIn}\n` +
                    `➡️ To: ${tokenOut}`
                );
            } else {
                alert(`✅ Swap realizado con éxito\n📄 Tx Hash: ${tx.hash}\nℹ️ (No se encontró el evento en logs)`);
            }

            document.querySelector('.IHAVE').value = "";
            document.querySelector('.IWANT').value = "";

            await fetchBalances();
            await getPrice(); // Re-fetch price as reserves changed
        }
    } catch (err) {
        console.error("❌ Swap error:", err);
        let errorMessage = "Operation failed.";
        if (err.reason) {
            errorMessage += " Reason: " + err.reason;
        } else if (err.message) {
            errorMessage += " Message: " + err.message;
        }
        alert("❌ " + errorMessage);
    } finally {
        hideSpinner();
        button.disabled = false; // Re-enable button
        await updateSwapButton(); // Update button state after operation
    }
}

async function updateSwapButton() {
    const inputAmount = document.querySelector('.IHAVE').value.trim();
    const button = document.getElementById("swap-submit");

    if (!userAddress || !simpleSwap || !tokenA || !tokenB) {
        button.innerText = "Connect Wallet";
        button.disabled = true;
        return;
    }

    if (!inputAmount || isNaN(inputAmount) || parseFloat(inputAmount) <= 0) {
        button.innerText = "Enter amount";
        button.disabled = true;
        return;
    }

    try {
        // Parse input amount, assuming 18 decimals for ERC20 tokens
        const parsedAmount = ethers.utils.parseUnits(inputAmount, 18);

        const tokenToSpend = reverseSwap ? tokenB : tokenA;
        const balance = await tokenToSpend.balanceOf(userAddress);

        // Get reserves directly from SimpleSwap contract
        const reserveA = await simpleSwap.reserveA();
        const reserveB = await simpleSwap.reserveB();

        let reserveIn;
        if (reverseSwap) {
            reserveIn = reserveB;
        } else {
            reserveIn = reserveA;
        }

        const allowance = await tokenToSpend.allowance(userAddress, simpleSwapAddress);


        if (balance.lt(parsedAmount)) {
            button.innerText = `Insufficient ${reverseSwap ? 'Token B' : 'Token A'} balance`;
            button.disabled = true;
        } else if (reserveIn.isZero()) {
            button.innerText = "No liquidity";
            button.disabled = true;
        } else if (parsedAmount.gt(reserveIn)) { // Check if input amount exceeds pool reserve
            button.innerText = "Insufficient pool liquidity";
            button.disabled = true;
        } else if (allowance.gte(parsedAmount)) {
            button.innerText = "Swap";
            button.disabled = false;
        } else {
            button.innerText = "Approve";
            button.disabled = false;
        }
    } catch (err) {
        console.error("Error updating swap button:", err);
        button.innerText = "Error";
        button.disabled = true;
    }
}

function toggleSwapDirection() {
    reverseSwap = !reverseSwap;

    const sendLabel = document.getElementById("send-label");
    const receiveLabel = document.getElementById("receive-label");
    const inputElement = document.querySelector('.IHAVE');
    const outputElement = document.querySelector('.IWANT');

    // Clear inputs and reset price display when toggling
    inputElement.value = "";
    outputElement.value = "";
    document.getElementById("precio").textContent = "0 " + (reverseSwap ? "TKA" : "TKB");


    if (reverseSwap) {
        sendLabel.textContent = "You send (Token B)";
        receiveLabel.textContent = "You receive (Token A)";
    } else {
        sendLabel.textContent = "You send (Token A)";
        receiveLabel.textContent = "You receive (Token B)";
    }

    // Update balances based on new direction
    fetchBalances();
    // Update price and swap button after direction change
    getPrice();
    updateSwapButton();
}

function showSpinner() {
    document.getElementById("spinner").style.display = "block";
}

function hideSpinner() {
    document.getElementById("spinner").style.display = "none";
}

function animateSwapButton() {
    const icon = document.getElementById('swap-reverse-icon');
    if (!icon) return;
    icon.classList.remove('swap-animate');
    void icon.offsetWidth; // Trigger reflow
    icon.classList.add('swap-animate');
}


// ***** NEW FUNCTION: ADD LIQUIDITY *****
async function addInitialLiquidity() {
    if (!signer || !userAddress || !simpleSwap || !tokenA || !tokenB) {
        alert("Please connect your wallet first.");
        return;
    }

    // Define initial amounts for liquidity. You can make these dynamic later if needed.
    // Assuming 18 decimals for tokens
    const amountAToAdd = ethers.utils.parseUnits("1000", 18); // Example: 1000 Token A
    const amountBToAdd = ethers.utils.parseUnits("1000", 18); // Example: 1000 Token B

    try {
        showSpinner();
        document.getElementById("addLiquidityButton").disabled = true; // Disable button during operation

        // --- Approve Token A ---
        console.log("Checking Token A allowance for SimpleSwap...");
        const allowanceA = await tokenA.allowance(userAddress, simpleSwapAddress);
        if (allowanceA.lt(amountAToAdd)) {
            console.log("Approving Token A...");
            const txA_approve = await tokenA.approve(simpleSwapAddress, amountAToAdd);
            await txA_approve.wait();
            console.log("Token A approved:", txA_approve.hash);
            alert("✅ Token A approved for SimpleSwap!");
        } else {
            console.log("Token A already approved.");
        }

        // --- Approve Token B ---
        console.log("Checking Token B allowance for SimpleSwap...");
        const allowanceB = await tokenB.allowance(userAddress, simpleSwapAddress);
        if (allowanceB.lt(amountBToAdd)) {
            console.log("Approving Token B...");
            const txB_approve = await tokenB.approve(simpleSwapAddress, amountBToAdd);
            await txB_approve.wait();
            console.log("Token B approved:", txB_approve.hash);
            alert("✅ Token B approved for SimpleSwap!");
        } else {
            console.log("Token B already approved.");
        }

        // --- Add Liquidity ---
        console.log("Adding liquidity to SimpleSwap...");
        const deadline = Math.floor(Date.now() / 1000) + 600; // 10 minutes from now (standard practice)

        const txAddLiquidity = await simpleSwap.addLiquidity(
            tokenAAddress,
            tokenBAddress,
            amountAToAdd,
            amountBToAdd,
            0, // amountAMin: Minimum amount of Token A to add (for slippage protection). Set to 0 for initial add.
            0, // amountBMin: Minimum amount of Token B to add. Set to 0 for initial add.
            userAddress, // The address to receive LP tokens (usually the liquidity provider's address)
            deadline
        );
        const receipt = await txAddLiquidity.wait();
        console.log("Liquidity added transaction hash:", receipt.hash);
        alert(`✅ Liquidity successfully added!\nTx Hash: ${txAddLiquidity.hash}`);

        // Update UI after adding liquidity
        await fetchBalances();
        await getPrice(); // This should now successfully fetch a price
        await setValueTokenToSpend(); // Recalculate output if input is present
        await updateSwapButton(); // Re-evaluate swap button state

    } catch (err) {
        console.error("❌ Error adding liquidity:", err);
        let errorMessage = "Failed to add liquidity.";
        if (err.reason) {
            errorMessage += " Reason: " + err.reason;
        } else if (err.message) {
            errorMessage += " Message: " + err.message;
        }
        alert("❌ " + errorMessage);
    } finally {
        hideSpinner();
        document.getElementById("addLiquidityButton").disabled = false; // Re-enable button
    }
}

// Initial state setup for buttons when script loads (before connection)
document.addEventListener('DOMContentLoaded', () => {
    disableAllButtons();
    // Re-enable connect button as it's the entry point
    document.getElementById("connect").disabled = false;
});

// Listener for account changes and network changes
if (window.ethereum) {
    window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
            console.log("Account changed to:", accounts[0]);
            connect(); // Re-connect to refresh UI with new account
        } else {
            console.log("Disconnected from MetaMask.");
            userAddress = null;
            document.getElementById("account").innerText = "-";
            disableAllButtons();
            document.getElementById("connect").disabled = false; // Re-enable connect button
            document.getElementById("balanceA").innerText = "0";
            document.getElementById("balanceB").innerText = "0";
            document.getElementById("precio").innerText = "0 TKB";
            document.querySelector('.IHAVE').value = "";
            document.querySelector('.IWANT').value = "";
        }
    });

    window.ethereum.on('chainChanged', (chainId) => {
        console.log("Network changed to:", chainId);
        window.location.reload(); // Reload the page on network change to ensure correct contract instances
    });
}
