const Token = artifacts.require("./DummyToken");
const Stake = artifacts.require("./Stake");

contract("Stake Contract", accounts => {
  it("Test contract deployment", async () => {
    const TokenInstance = await Token.deployed();
    const StakeInstance = await Stake.deployed();

   assert.notEqual(TokenInstance.address,"");
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
    await TokenInstance.approve(StakeInstance.address, amount, { from: user2 });
    await TokenInstance.approve(StakeInstance.address, amount, { from: user3 });

    await StakeInstance.deposit(amount, { from: user1 });
    await StakeInstance.deposit(amount, { from: user2 });
    await StakeInstance.deposit(amount, { from: user3 });

    let balance1_before = await TokenInstance.balanceOf(user1);
    balance1_before = balance1_before.toNumber();
    // let balance2 = await TokenInstance.balanceOf(user2);
    // balance2 = balance2.toNumber();
    // let balance3 = await TokenInstance.balanceOf(user3);
    // balance3 = balance3.toNumber();

    console.log(balance1_before);

    const balance = await TokenInstance.balanceOf(StakeInstance.address);
    console.log(balance.toNumber());
    await StakeInstance.multiSendToken({ from: owner});

    let balance1_after = await TokenInstance.balanceOf(user1);
    balance1_after = balance1_after.toNumber();
    // balance2 = await TokenInstance.balanceOf(user2);
    // balance2 = balance2.toNumber();
    // balance3 = await TokenInstance.balanceOf(user3);
    // balance3 = balance3.toNumber();

    console.log(balance1_after);

    assert.equal(balance1_before + 100 * (10 ** 18), balance1_after);
  });
});
