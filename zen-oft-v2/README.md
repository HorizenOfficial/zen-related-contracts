# ZEN OFT

LayerZero V2 files (`contracts/oapp`, `contracts/oft` and `contracts/precrime`) are downloaded from the [official GitHub repository](https://github.com/LayerZero-Labs/LayerZero-v2), branch **main**, commit **943ce4a**, on 2024-11-29 10:44 CET

## Build
`npm install`
`npx hardhat compile`

## Deploy on two chains
Config *.env* file with required parameters, then launch

`npx hardhat run ./scripts/deploy-multichain.ts`


## Demo transfer
Config *.env* file with required parameters, then launch

`npx hardhat run ./scripts/demo-transfer.ts`

