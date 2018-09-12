const Token = artifacts.require("./DummyToken.sol");
const Stake = artifacts.require("./Stake.sol");

module.exports = (deployer, networks, accounts) => {
    deployer.deploy(Token).then(() => {
        return deployer.deploy(Stake, Token.address, 10);
    })
}