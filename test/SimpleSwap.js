// SimpleSwap.test.ts
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time, loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("SimpleSwap", function () {
  async function deployFixture() {
    const [owner, user1, user2] = await ethers.getSigners();

    // Deploy Mock Tokens
    const MockToken = await ethers.getContractFactory("MockERC20");
    const tokenA = await MockToken.deploy("Token A", "TKA", { gasLimit: 10_000_000 });
    const tokenB = await MockToken.deploy("Token B", "TKB", { gasLimit: 10_000_000 });

    // Mint tokens
    await tokenA.mint(owner.address, ethers.parseEther("1000"), { gasLimit: 1_000_000 });
    await tokenB.mint(owner.address, ethers.parseEther("1000"), { gasLimit: 1_000_000 });
    await tokenA.mint(user1.address, ethers.parseEther("500"), { gasLimit: 1_000_000 });
    await tokenB.mint(user2.address, ethers.parseEther("500"), { gasLimit: 1_000_000 });

    // Deploy SimpleSwap
    const SimpleSwap = await ethers.getContractFactory("SimpleSwap");
    const swap = await SimpleSwap.deploy({ gasLimit: 10_000_000 });

    // Add initial liquidity
    await tokenA.connect(owner).approve(swap.target, ethers.parseEther("100"), { gasLimit: 500_000 });
    await tokenB.connect(owner).approve(swap.target, ethers.parseEther("100"), { gasLimit: 500_000 });

    await swap.connect(owner).addLiquidity(
      tokenA.target,
      tokenB.target,
      ethers.parseEther("100"),
      ethers.parseEther("100"),
      0,
      0,
      owner.address,
      (await time.latest()) + 60,
      { gasLimit: 5_000_000 }
    );

    return { swap, tokenA, tokenB, owner, user1, user2 };
  }

  it("should allow token swap from tokenA to tokenB", async function () {
    const { swap, tokenA, tokenB, user1 } = await loadFixture(deployFixture);

    await tokenA.connect(user1).approve(swap.target, ethers.parseEther("10"), { gasLimit: 500_000 });
    await swap.connect(user1).swapExactTokensForTokens(
      ethers.parseEther("10"),
      1,
      [tokenA.target, tokenB.target],
      user1.address,
      (await time.latest()) + 60,
      { gasLimit: 5_000_000 }
    );

    const outBalance = await tokenB.balanceOf(user1.address);
    expect(outBalance).to.be.gt(0);
  });

  it("should allow removing liquidity and return tokens", async function () {
    const { swap, tokenA, tokenB, owner } = await loadFixture(deployFixture);

    const lpAmount = await swap.balanceOf(owner.address);
    await swap.connect(owner).approve(swap.target, lpAmount, { gasLimit: 500_000 });

    const balA = await tokenA.balanceOf(owner.address);
    const balB = await tokenB.balanceOf(owner.address);

    await swap.removeLiquidity(
      tokenA.target,
      tokenB.target,
      lpAmount,
      0,
      0,
      owner.address,
      (await time.latest()) + 60,
      { gasLimit: 5_000_000 }
    );

    expect(await tokenA.balanceOf(owner.address)).to.be.gt(balA);
    expect(await tokenB.balanceOf(owner.address)).to.be.gt(balB);
  });

  it("should return correct price", async function () {
    const { swap, tokenA, tokenB } = await loadFixture(deployFixture);
    const price = await swap.getPrice(tokenA.target, tokenB.target);
    expect(price).to.equal(ethers.parseUnits("1", 18));
  });

  it("should revert swap if deadline expired", async function () {
    const { swap, tokenA, tokenB, user1 } = await loadFixture(deployFixture);

    await tokenA.connect(user1).approve(swap.target, ethers.parseEther("10"), { gasLimit: 500_000 });

    await expect(
      swap.connect(user1).swapExactTokensForTokens(
        ethers.parseEther("10"),
        1,
        [tokenA.target, tokenB.target],
        user1.address,
        (await time.latest()) - 1,
        { gasLimit: 5_000_000 }
      )
    ).to.be.revertedWith("Transaction expired");
  });
});
