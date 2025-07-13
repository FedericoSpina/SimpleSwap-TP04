// script.js
// Connects to a deployed SimpleSwap smart contract and two ERC20 mock tokens
// Handles: wallet connection, token balance fetching, minting, token swap with approval

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

// Token ABIs (ERC20 standard interface) and SimpleSwap ABI
import tokenAAbi from "./tokenAAbi.js";
import tokenBAbi from "./tokenBAbi.js";
import abiSS from "./abiSS.js";


let provider, signer, userAddress, simpleSwap, tokenA, tokenB;
let currentPrice = 0;
let reverseSwap = false;

// Connect to MetaMask and initialize contracts
async function connect() {
    try {
        if (typeof window.ethereum !== "undefined") {
            await window.ethereum.request({ method: "eth_requestAccounts" });

            provider = new ethers.BrowserProvider(window.ethereum); signer = provider.getSigner();
            userAddress = await signer.getAddress();
            document.getElementById("account").innerText = userAddress;

            tokenA = new ethers.Contract(tokenAAddress, tokenAAbi, signer);
            tokenB = new ethers.Contract(tokenBAddress, tokenBAbi, signer);
            simpleSwap = new ethers.Contract(simpleSwapAddress, abiSS, signer);

            await fetchBalances();
            await getPrice();

            document.getElementById("mintAmountA").disabled = false;
            document.getElementById("mintAmountB").disabled = false;
            document.getElementById("mintButtonA").disabled = false;
            document.getElementById("mintButtonB").disabled = false;
        } else {
            alert("❌ MetaMask not detected");
        }
    } catch (err) {
        console.error(err);
        alert("❌ Error connecting to MetaMask");
        disableMintButtons();
    }
}

function disableMintButtons() {
    document.getElementById("mintAmountA").disabled = true;
    document.getElementById("mintAmountB").disabled = true;
    document.getElementById("mintButtonA").disabled = true;
    document.getElementById("mintButtonB").disabled = true;
}

// Show token balances
async function fetchBalances() {
    const balanceA = await tokenA.balanceOf(userAddress);
    const balanceB = await tokenB.balanceOf(userAddress);
    document.getElementById("balanceA").innerText = balanceA.toString();
    document.getElementById("balanceB").innerText = balanceB.toString();
}

// Get current exchange price between tokenA and tokenB
async function getPrice() {
    const price = await simpleSwap.getPrice(tokenAAddress, tokenBAddress);
    currentPrice = ethers.utils.formatUnits(price, 18);
    document.getElementById("price").innerText = currentPrice;
}

// Calculate output amount from input based on AMM formula
async function setValueTokenToSpend() {
    try {
        const input = document.querySelector('.IHAVE').value;
        const outputInput = document.querySelector('.IWANT');
        const priceLabel = document.getElementById("price");

        if (!input || isNaN(input) || parseFloat(input) <= 0) {
            outputInput.value = "";
            priceLabel.textContent = reverseSwap ? "0 TKA" : "0 TKB";
            return;
        }

        const parsedAmount = ethers.BigNumber.from(input);
        let reserveIn, reserveOut, symbolOut;

        if (reverseSwap) {
            reserveIn = await simpleSwap.reserveB();
            reserveOut = await simpleSwap.reserveA();
            symbolOut = "TKA";
        } else {
            reserveIn = await simpleSwap.reserveA();
            reserveOut = await simpleSwap.reserveB();
            symbolOut = "TKB";
        }

        if (reserveIn.isZero() || reserveOut.isZero()) {
            outputInput.value = "No liquidity";
            priceLabel.textContent = "No liquidity";
            return;
        }

        const outEstimate = await simpleSwap.getAmountOut(parsedAmount, reserveIn, reserveOut);
        outputInput.value = outEstimate.toString();

        // Format output amount
        priceLabel.textContent = `${ethers.utils.formatUnits(outEstimate, 18)} ${symbolOut}`;

        await updateSwapButton();
    } catch (err) {
        console.error("Error calculating output:", err);
        document.querySelector('.IWANT').value = "Error";
        document.getElementById("price").textContent = "Error";
    }
}

// Mint Token A to the user
async function mintTokenA() {
    await mintToken(tokenA, "mintAmountA", "Token A");
}

// Mint Token B to the user
async function mintTokenB() {
    await mintToken(tokenB, "mintAmountB", "Token B");
}

// Generic mint function
async function mintToken(tokenContract, inputId, tokenName) {
    try {
        const amount = parseInt(document.getElementById(inputId).value);
        if (isNaN(amount) || amount <= 0) {
            alert(`❌ Enter a valid amount for ${tokenName}`);
            return;
        }
        showSpinner();
        const tx = await tokenContract.mint(userAddress, amount);
        await tx.wait();
        alert(`✅ Minted ${amount} ${tokenName}\nTx Hash: ${tx.hash}`);
        hideSpinner();
        document.getElementById(inputId).value = "0";
        await fetchBalances();
    } catch (err) {
        console.error(err);
        hideSpinner();
        alert(`❌ Error minting ${tokenName}`);
    }
}

// Handle token approval or swap
async function handleApproveOrSwap() {
    const input = document.querySelector('.IHAVE').value;
    const button = document.getElementById("swap-submit");

    if (!input || isNaN(input) || parseFloat(input) <= 0) {
        alert("❌ Enter a valid amount first");
        return;
    }

    try {
        const parsedAmount = ethers.BigNumber.from(input);
        const allowance = await tokenA.allowance(userAddress, simpleSwapAddress);
        showSpinner();
        button.disabled = true;

        if (allowance.lt(parsedAmount)) {
            const tx = await tokenA.approve(simpleSwapAddress, parsedAmount);
            await tx.wait();
            alert(`✅ Approved Token\nTx Hash: ${tx.hash}`);
        } else {
            const path = [tokenAAddress, tokenBAddress];
            const deadline = Math.floor(Date.now() / 1000) + 600; // 10 min

            const tx = await simpleSwap.swapExactTokensForTokens(
                parsedAmount, 0, path, userAddress, deadline
            );
            const receipt = await tx.wait();

            const event = receipt.events.find(e => e.event === "TokensSwapped");

            if (event && event.args) {
                const { amountIn, amountOut } = event.args;
                alert(`✅ Swapped\nIn: ${amountIn.toString()}\nOut: ${amountOut.toString()}`);
            } else {
                alert(`✅ Swap succeeded but no event found\nTx Hash: ${tx.hash}`);
            }

            document.querySelector('.IHAVE').value = "";
            document.querySelector('.IWANT').value = "";
            await fetchBalances();
            await getPrice();
        }
    } catch (err) {
        console.error("❌ Swap error:", err);
        alert("❌ Operation failed");
    } finally {
        hideSpinner();
        button.disabled = false;
        await updateSwapButton();
    }
}

// Update Swap button text and state
async function updateSwapButton() {
    const inputAmount = document.querySelector('.IHAVE').value.trim();
    const button = document.getElementById("swap-submit");

    if (!inputAmount || isNaN(inputAmount) || parseFloat(inputAmount) <= 0) {
        button.disabled = true;
        return;
    }

    const parsedAmount = ethers.BigNumber.from(inputAmount);
    const allowance = await tokenA.allowance(userAddress, simpleSwapAddress);
    const balance = await tokenA.balanceOf(userAddress);
    const reserveA = await simpleSwap.reserveA();

    if (balance.lt(parsedAmount)) {
        button.innerText = "Insufficient balance";
        button.disabled = true;
    } else if (reserveA.lt(parsedAmount)) {
        button.innerText = "Low liquidity";
        button.disabled = true;
    } else if (allowance.gte(parsedAmount)) {
        button.innerText = "Swap";
        button.disabled = false;
    } else {
        button.innerText = "Approve";
        button.disabled = false;
    }
}

// Toggle swap direction between Token A and Token B
function toggleSwapDirection() {
    reverseSwap = !reverseSwap;

    const sendLabel = document.getElementById("send-label");
    const receiveLabel = document.getElementById("receive-label");
    const priceLabel = document.getElementById("price");
    const sendBalance = document.getElementById("send-balance");

    if (reverseSwap) {
        sendLabel.textContent = "You send (Token B)";
        receiveLabel.textContent = "You receive (Token A)";
        priceLabel.textContent = "0 TKA";
        // Actualiza el balance mostrado
        tokenB && userAddress && tokenB.balanceOf(userAddress).then(bal => {
            sendBalance.textContent = bal.toString();
        });
    } else {
        sendLabel.textContent = "You send (Token A)";
        receiveLabel.textContent = "You receive (Token B)";
        priceLabel.textContent = "0 TKB";
        // Actualiza el balance mostrado
        tokenA && userAddress && tokenA.balanceOf(userAddress).then(bal => {
            sendBalance.textContent = bal.toString();
        });
    }

    updateSwapButton();
    setValueTokenToSpend();
}

function showSpinner() {
    document.getElementById("spinner").style.display = "block";
}

function hideSpinner() {
    document.getElementById("spinner").style.display = "none";
}

// Animate the swap button when clicked
function animateSwapButton() {
    const icon = document.getElementById('swap-reverse-icon');
    if (!icon) return;
    icon.classList.remove('swap-animate'); // Remove the class if it's already there
    void icon.offsetWidth; // Trigger reflow to restart the animation
    icon.classList.add('swap-animate'); // Re-add the class
}
