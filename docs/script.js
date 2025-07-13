// script.js
// Connects to a deployed SimpleSwap smart contract and two ERC20 mock tokens
// Handles: wallet connection, token balance fetching, minting, token swap with approval, and adding liquidity.

const simpleSwapAddress = "0xAB17AD9076268185f98D6408e066819E2Bd9d04E";
const tokenAAddress = "0xF5868801cf665b60821FBD26e0846326BfCCbD79";
const tokenBAddress = "0x4c55a1C8606B53d4c26FBc75433C1698F546f48e";


window.toggleSwapDirection = toggleSwapDirection;
window.setValueTokenToSpend = setValueTokenToSpend;
window.updateSwapButton = updateSwapButton;
window.handleApproveOrSwap = handleApproveOrSwap;
window.connect = connect;
window.mintTokenA = mintTokenA;
window.mintTokenB = mintTokenB;
window.animateSwapButton = animateSwapButton;
window.addInitialLiquidity = addInitialLiquidity; // Expose new function

// Token ABIs (ERC20 standard interface) and SimpleSwap ABI
const tokenAAbi = [{"inputs":[{"internalType":"uint256","name":"initialSupply","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"allowance","type":"uint256"},{"internalType":"uint256","name":"needed","type":"uint256"}],"name":"ERC20InsufficientAllowance","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"uint256","name":"balance","type":"uint256"},{"internalType":"uint256","name":"needed","type":"uint256"}],"name":"ERC20InsufficientBalance","type":"error"},{"inputs":[{"internalType":"address","name":"approver","type":"address"}],"name":"ERC20InvalidApprover","type":"error"},{"inputs":[{"internalType":"address","name":"receiver","type":"address"}],"name":"ERC20InvalidReceiver","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"}],"name":"ERC20InvalidSender","type":"error"},{"inputs":[{"internalType":"address","name":"spender","type":"address"}],"name":"ERC20InvalidSpender","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}]
const tokenBAbi = [{"inputs":[{"internalType":"uint256","name":"initialSupply","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"allowance","type":"uint256"},{"internalType":"uint256","name":"needed","type":"uint256"}],"name":"ERC20InsufficientAllowance","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"uint256","name":"balance","type":"uint256"},{"internalType":"uint256","name":"needed","type":"uint256"}],"name":"ERC20InsufficientBalance","type":"error"},{"inputs":[{"internalType":"address","name":"approver","type":"address"}],"name":"ERC20InvalidApprover","type":"error"},{"inputs":[{"internalType":"address","name":"receiver","type":"address"}],"name":"ERC20InvalidReceiver","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"}],"name":"ERC20InvalidSender","type":"error"},{"inputs":[{"internalType":"address","name":"spender","type":"address"}],"name":"ERC20InvalidSpender","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"stateMutability":"payable","type":"receive"}]
const abiSS = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"allowance","type":"uint256"},{"internalType":"uint256","name":"needed","type":"uint256"}],"name":"ERC20InsufficientAllowance","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"uint256","name":"balance","type":"uint256"},{"internalType":"uint256","name":"needed","type":"uint256"}],"name":"ERC20InsufficientBalance","type":"error"},{"inputs":[{"internalType":"address","name":"approver","type":"address"}],"name":"ERC20InvalidApprover","type":"error"},{"inputs":[{"internalType":"address","name":"receiver","type":"address"}],"name":"ERC20InvalidReceiver","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"}],"name":"ERC20InvalidSender","type":"error"},{"inputs":[{"internalType":"address","name":"spender","type":"address"}],"name":"ERC20InvalidSpender","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint256","name":"amountADesired","type":"uint256"},{"internalType":"uint256","name":"amountBDesired","type":"uint256"},{"internalType":"uint256","name":"amountAMin","type":"uint256"},{"internalType":"uint256","name":"amountBMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"addLiquidity","outputs":[{"internalType":"uint256","name":"amountASent","type":"uint256"},{"internalType":"uint256","name":"amountBSent","type":"uint256"},{"internalType":"uint256","name":"liquidity","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"reserveIn","type":"uint256"},{"internalType":"uint256","name":"reserveOut","type":"uint256"}],"name":"getAmountOut","outputs":[{"internalType":"uint256","name":"amountOut","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"}],"name":"getPrice","outputs":[{"internalType":"uint256","name":"price","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"pairPools","outputs":[{"internalType":"uint256","name":"reserveA","type":"uint256"},{"internalType":"uint256","name":"reserveB","type":"uint256"},{"internalType":"uint256","name":"totalLiquidity","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"tokenA","type":"address"},{"internalType":"address","name":"tokenB","type":"address"},{"internalType":"uint256","name":"liquidity","type":"uint256"},{"internalType":"uint256","name":"amountAMin","type":"uint256"},{"internalType":"uint256","name":"amountBMin","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"removeLiquidity","outputs":[{"internalType":"uint256","name":"amountASent","type":"uint256"},{"internalType":"uint256","name":"amountBSent","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amountIn","type":"uint256"},{"internalType":"uint256","name":"amountOutMin","type":"uint256"},{"internalType":"address[]","name":"path","type":"address[]"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"deadline","type":"uint256"}],"name":"swapExactTokensForTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]

let provider, signer, userAddress, simpleSwap, tokenA, tokenB;
let currentPrice = 0;
let reverseSwap = false;

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
        userAddress = accounts[0];

        document.getElementById("account").innerText = userAddress;

        tokenA = new ethers.Contract(tokenAAddress, tokenAAbi, signer);
        tokenB = new ethers.Contract(tokenBAddress, tokenBAbi, signer);
        simpleSwap = new ethers.Contract(simpleSwapAddress, abiSS, signer);

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
    document.getElementById("price").textContent = "0 TKB"; // Reset price display
}

// Show token balances
async function fetchBalances() {
    if (!userAddress || !tokenA || !tokenB) {
        document.getElementById("send-balance").innerText = "0";
        document.getElementById("receive-balance").innerText = "0";
        return;
    }
    try {
        const balanceA = await tokenA.balanceOf(userAddress);
        const balanceB = await tokenB.balanceOf(userAddress);

        // Format balances for display
        document.getElementById("send-balance").innerText = reverseSwap ? ethers.utils.formatUnits(balanceB, 18) : ethers.utils.formatUnits(balanceA, 18);
        document.getElementById("receive-balance").innerText = reverseSwap ? ethers.utils.formatUnits(balanceA, 18) : ethers.utils.formatUnits(balanceB, 18);
    } catch (err) {
        console.error("Error fetching balances:", err);
        document.getElementById("send-balance").innerText = "Error";
        document.getElementById("receive-balance").innerText = "Error";
    }
}

// Get current exchange price between tokenA and tokenB
async function getPrice() {
    if (!simpleSwap || !tokenAAddress || !tokenBAddress) {
        document.getElementById("price").innerText = "Not connected";
        return;
    }
    try {
        const price = await simpleSwap.getPrice(tokenAAddress, tokenBAddress);
        currentPrice = ethers.utils.formatUnits(price, 18);
        // Adjust price display based on swap direction
        document.getElementById("price").innerText = currentPrice + (reverseSwap ? " TKA/TKB" : " TKB/TKA");
    } catch (err) {
        console.error("Error getting price:", err);
        // Specific check for "No liquidity available"
        if (err.message && err.message.includes("No liquidity available")) {
            document.getElementById("price").innerText = "No liquidity";
        } else {
            document.getElementById("price").innerText = "Error";
        }
    }
}

// Calculate output amount from input based on AMM formula
async function setValueTokenToSpend() {
    const inputElement = document.querySelector('.IHAVE');
    const outputInput = document.querySelector('.IWANT');
    const priceLabel = document.getElementById("price");

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
        const parsedAmount = ethers.utils.parseUnits(input, 18);
        const pairId = ethers.utils.solidityKeccak256(["address", "address"], [tokenAAddress, tokenBAddress]);
        const reserves = await simpleSwap.pairPools(pairId);

        let reserveIn, reserveOut, symbolOut;

        if (reverseSwap) {
            reserveIn = reserves.reserveB;
            reserveOut = reserves.reserveA;
            symbolOut = "TKA";
        } else {
            reserveIn = reserves.reserveA;
            reserveOut = reserves.reserveB;
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
        const amount = document.getElementById(inputId).value; // Keep as string for parseUnits
        if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
            alert(`❌ Enter a valid amount for ${tokenName}`);
            return;
        }
        const parsedAmount = ethers.utils.parseUnits(amount, 18); // Parse to wei

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
        const parsedAmount = ethers.utils.parseUnits(input, 18); // Amount to swap

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

            // The SimpleSwap contract ABI doesn't have a TokensSwapped event,
            // so we'll just confirm the transaction went through.
            alert(`✅ Swap succeeded!\nTx Hash: ${tx.hash}`);

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
        const parsedAmount = ethers.utils.parseUnits(inputAmount, 18);
        const tokenToSpend = reverseSwap ? tokenB : tokenA;
        // const tokenToReceive = reverseSwap ? tokenA : tokenB; // Not directly used here

        const allowance = await tokenToSpend.allowance(userAddress, simpleSwapAddress);
        const balance = await tokenToSpend.balanceOf(userAddress);

        const pairId = ethers.utils.solidityKeccak256(["address", "address"], [tokenAAddress, tokenBAddress]);
        const reserves = await simpleSwap.pairPools(pairId);

        let reserveIn;
        if (reverseSwap) {
            reserveIn = reserves.reserveB;
        } else {
            reserveIn = reserves.reserveA;
        }

        if (balance.lt(parsedAmount)) {
            button.innerText = `Insufficient ${reverseSwap ? 'Token B' : 'Token A'} balance`;
            button.disabled = true;
        } else if (reserveIn.isZero()) {
            button.innerText = "No liquidity";
            button.disabled = true;
        } else {
            // Check if the amount to swap exceeds the available reserve
            // This is a common check to prevent transactions from failing due to insufficient liquidity in the pool
            if (parsedAmount.gt(reserveIn)) {
                button.innerText = "Insufficient pool liquidity";
                button.disabled = true;
            } else if (allowance.gte(parsedAmount)) {
                button.innerText = "Swap";
                button.disabled = false;
            } else {
                button.innerText = "Approve";
                button.disabled = false;
            }
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
    // const sendBalanceElement = document.getElementById("send-balance"); // Not directly used here
    // const receiveBalanceElement = document.getElementById("receive-balance"); // Not directly used here
    const inputElement = document.querySelector('.IHAVE');
    const outputElement = document.querySelector('.IWANT');

    // Clear inputs and reset price display when toggling
    inputElement.value = "";
    outputElement.value = "";
    document.getElementById("price").textContent = "0 " + (reverseSwap ? "TKA" : "TKB");


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
            document.getElementById("send-balance").innerText = "0";
            document.getElementById("receive-balance").innerText = "0";
            document.getElementById("price").innerText = "0 TKB"; // Reset price
            document.querySelector('.IHAVE').value = "";
            document.querySelector('.IWANT').value = "";
        }
    });

    window.ethereum.on('chainChanged', (chainId) => {
        console.log("Network changed to:", chainId);
        window.location.reload(); // Reload the page on network change to ensure correct contract instances
    });
}
