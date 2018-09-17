# Deployment Steps

# In the 2_deploy_contracts.js, you need to pass the bonus rate as second argument to the deployment of Stake contract and the token contract as first argument
```
module.exports = (deployer, networks, accounts) => {
    deployer.deploy(Token).then(() => {
        return deployer.deploy(Stake, Token.address, 10);
    })
}
```
Here, the bonus rate is set as 10 tokens and the token is a dummy token

## Deployment to Local Development Network
### Run this command in the root folder project
```
truffle migrate --network development
```

## Deployment to Ropsten Network
### Run this command in the root folder project
```
truffle migrate --network ropsten
```

## Deployment to Main Nerwork
### Run this command in the root folder project
```
truffle migrate --network mainnet
```