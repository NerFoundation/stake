const Token = artifacts.require("./DummyToken");
const Stake = artifacts.require("./Stake");

contract("Stake Contract", accounts => {
  it("Test contract deployment", async () => {
    const TokenInstance = await Token.deployed();
    const StakeInstance = await Stake.deployed();

    assert.notEqual(TokenInstance.address, "");
  });

  it("Test deposit", async () => {
    const owner = accounts[0];
    const user1 = accounts[1];
    const user2 = accounts[2];
    const user3 = accounts[3];

    const TokenInstance = await Token.deployed();
    const StakeInstance = await Stake.deployed();

    const amount = 1000 * 10 ** 18;

    await TokenInstance.approve(StakeInstance.address, amount, { from: user1 });
    await StakeInstance.deposit(amount, { from: user1 });

    await TokenInstance.approve(StakeInstance.address, amount, { from: user1 });
    await StakeInstance.deposit(amount, { from: user1 });

    await TokenInstance.approve(StakeInstance.address, amount, { from: user2 });
    await StakeInstance.deposit(amount, { from: user2 });

    await TokenInstance.approve(StakeInstance.address, amount, { from: user3 });
    await StakeInstance.deposit(amount, { from: user3 });

    const balance = await TokenInstance.balanceOf(StakeInstance.address);

    assert.equal(balance.toNumber(), amount * 4);
  });

  it("Test MultiSend", async () => {
    const owner = accounts[0];
    const user1 = accounts[1];
    const user2 = accounts[2];
    const user3 = accounts[3];

    const TokenInstance = await Token.deployed();
    const StakeInstance = await Stake.deployed();

    const amount = 1000 * 10 ** 18;

    let balance1_before = await TokenInstance.balanceOf(user1);
    balance1_before = balance1_before.toNumber();

    let balance2_before = await TokenInstance.balanceOf(user2);
    balance2_before = balance2_before.toNumber();

    let balance3_before = await TokenInstance.balanceOf(user3);
    balance3_before = balance3_before.toNumber();

    await StakeInstance.multiSendToken({ from: owner });

    let balance1_after = await TokenInstance.balanceOf(user1);
    balance1_after = balance1_after.toNumber();

    balance2_after = await TokenInstance.balanceOf(user2);
    balance2_after = balance2_after.toNumber();

    balance3_after = await TokenInstance.balanceOf(user3);
    balance3_after = balance3_after.toNumber();

    assert.equal(balance1_before + 200 * 10 ** 18, balance1_after);
    assert.equal(balance2_before + 100 * 10 ** 18, balance2_after);
    assert.equal(balance3_before + 100 * 10 ** 18, balance3_after);
  });

  it("Test withdraw of Tokens", async () => {
    const owner = accounts[0];
    const user1 = accounts[1];
    const user2 = accounts[2];
    const user3 = accounts[3];

    const TokenInstance = await Token.deployed();
    const StakeInstance = await Stake.deployed();

    const amount = 800 * 10 ** 18;

    let balance1_before = await TokenInstance.balanceOf(user1);
    balance1_before = balance1_before.toNumber();

    await StakeInstance.withdrawTokens(amount, { from: user1 });

    let balance1_after = await TokenInstance.balanceOf(user1);
    balance1_after = balance1_after.toNumber();

    assert.equal(balance1_before + 800 * 10 ** 18, balance1_after);
  });
});
