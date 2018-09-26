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

    const TokenInstance = await Token.deployed();
    const StakeInstance = await Stake.deployed();

    const amount = 10000 * 10 ** 18;

    await TokenInstance.approve(StakeInstance.address, amount, { from: user1 });
    await StakeInstance.deposit(amount, { from: user1 });

    await TokenInstance.approve(StakeInstance.address, amount, { from: user1 });
    await StakeInstance.deposit(amount, { from: user1 });

    await TokenInstance.approve(StakeInstance.address, amount, { from: user2 });
    await StakeInstance.deposit(amount, { from: user2 });

    const balance = await TokenInstance.balanceOf(StakeInstance.address);

    assert.equal(balance.toNumber(), amount * 3);
  });


  // it("Test lock of tokens", async () => {
  //   const StakeInstance = await Stake.deployed();
  //   const amount = 1000 * 10 ** 18;
  //   const user1 = accounts[1];


  //   const result = await StakeInstance.getLockedTokens({from:user1});
  //   assert.equal(result.toNumber(), amount );

  // })

  it("Test Ether Multisend", async() => {
    const owner = accounts[0];
    const user1 = accounts[1];
    const user2 = accounts[2];

    const TokenInstance = await Token.deployed();
    const StakeInstance = await Stake.deployed();

    const amount = 10 * 10 ** 18;

    await StakeInstance.sendTransaction({from:owner, value:amount});
    await StakeInstance.setEthBonus(10, {from:owner});

    let balance1_before = await web3.eth.getBalance(user1);
    balance1_before = balance1_before.toNumber();

    let balance2_before = await web3.eth.getBalance(user2);
    balance2_before = balance2_before.toNumber();

    return new Promise((resolve, reject) => {
      setTimeout( async () => {
        await StakeInstance.multiSendEth({from:owner, gas: 900000});

        let balance1_after = await web3.eth.getBalance(user1);
        balance1_after = balance1_after.toNumber();

        balance2_after = await web3.eth.getBalance(user2);
        balance2_after = balance2_after.toNumber();


        console.log(balance1_before/10**18,balance1_after/10**18);
        console.log(balance2_before , balance2_after)
        resolve();
      }, 6000)
      
    })
    
    // assert.equal(balance1_before + 10 * 10 ** 18, balance1_after);
    // assert.equal(balance2_before + 5 * 10 ** 18, balance2_after);


    
  })

  // it("Test Token MultiSend", async () => {
  //   const owner = accounts[0];
  //   const user1 = accounts[1];
  //   const user2 = accounts[2];

  //   const TokenInstance = await Token.deployed();
  //   const StakeInstance = await Stake.deployed();

  //   const amount = 10000 * 10 ** 18;

  //   let balance1_before = await TokenInstance.balanceOf(user1);
  //   balance1_before = balance1_before.toNumber();

  //   let balance2_before = await TokenInstance.balanceOf(user2);
  //   balance2_before = balance2_before.toNumber();

  //   await StakeInstance.multiSendToken({ from: owner, gas:900000 });
  //   let balance11_after = await TokenInstance.balanceOf(user1);
  //   balance11_after = balance11_after.toNumber();
  //   console.log(balance1_before, balance11_after)

  //   return new Promise((resolve, reject) => {
  //     setTimeout(async() => {
  //       await StakeInstance.multiSendToken({ from: owner, gas:900000 });

  //       let balance1_after = await TokenInstance.balanceOf(user1);
  //       balance1_after = balance1_after.toNumber();

  //       balance2_after = await TokenInstance.balanceOf(user2);
  //       balance2_after = balance2_after.toNumber();


  //       console.log(balance1_before + 2000 * 10 ** 18, balance1_after)
  //       assert.equal(balance1_before + 2000 * 10 ** 18, balance1_after);
  //       assert.equal(balance2_before + 1000 * 10 ** 18, balance2_after);
  //       resolve();
  //     }, 8000);
  //   })
    
  // });

  // it("Test withdraw of Tokens", async () => {
  //   const owner = accounts[0];
  //   const user1 = accounts[1];
  //   const user2 = accounts[2];
  //   const user3 = accounts[3];

  //   const TokenInstance = await Token.deployed();
  //   const StakeInstance = await Stake.deployed();

  //   const amount = 800 * 10 ** 18;

  //   let balance1_before = await TokenInstance.balanceOf(user1);
  //   balance1_before = balance1_before.toNumber();

  //   await StakeInstance.withdrawTokens(amount, { from: user1 });

  //   let balance1_after = await TokenInstance.balanceOf(user1);
  //   balance1_after = balance1_after.toNumber();

  //   assert.equal(balance1_before + 800 * 10 ** 18, balance1_after);
  // });
});
