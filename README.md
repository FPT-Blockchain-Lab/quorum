FPT Blockchain Quorum is an Ethereum-based blockchain fork from GoQuorum
---

Difference between FPT Blockchain Quorum and GoQuorum

- Block time: 1 second
- Use empty block period feature to reduce storage usage
- ~~Latest go version~~
- Using QBFT consensus
- Pre-config networks for FPT Blockchain
- Default up to Berlin hardfork
- Default node type is all archive nodes (gcmode=archive syncmode=full)
- ~~Support domain in permission layer~~
- ~~Add more test cases for permission layers~~
- ~~Using threshold signature of validators to generate guardian account in permission contract~~

## Build from source

```bash
go version
# ...
make --version
# ...

make geth 
# you will see folder build/bin/geth
```

## Run from binary

Please checkout the steps in https://geth.ethereum.org/docs/fundamentals/private-network

Quick sum ups:
1. Create a genesis file
2. Create accounts
3. Initialize the network with all above components

## Run dev mode

Please checkout the steps in https://geth.ethereum.org/docs/developers/dapp-developer/dev-mode

We won't recommend test features of quorum with dev mode, because dev network can't use p2p and consensus features.

## Official Docker Containers
The official docker containers can be found under https://hub.docker.com/u/fptblockchainbot

## License

The go-ethereum library (i.e. all code outside of the `cmd` directory) is licensed under the
[GNU Lesser General Public License v3.0](https://www.gnu.org/licenses/lgpl-3.0.en.html), also
included in our repository in the `COPYING.LESSER` file.

The go-ethereum binaries (i.e. all code inside of the `cmd` directory) is licensed under the
[GNU General Public License v3.0](https://www.gnu.org/licenses/gpl-3.0.en.html), also included
in our repository in the `COPYING` file.

Any project planning to use the `crypto/secp256k1` sub-module must use the specific [secp256k1 standalone library](https://github.com/ConsenSys/goquorum-crypto-secp256k1) licensed under 3-clause BSD.