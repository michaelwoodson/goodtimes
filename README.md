# GoodTimes

A simple node script that automatically claims your GoodDollar basic income every day.

## Why?

It takes 30 seconds to claim GoodDollars every day. That doesn't sound like much, but it works out to 3 hours a year! For a developer interested in the project, that is time better spent finding ways to contribute to the project.

The code is also designed to show how to script the GoodDollar dDapp. All the work on the blockchain is transparently shown in `cli.js`.

Also, converting G$ to fuse for gas is a great way to learn more about how G$ works.

## Who can use it?

* Must have a verified GoodDollar wallet.
* Must be comfortable installing node and using the command line on your computer.
* Must be able to convert some of your G$ to fuse for gas money.
* Should have access to a server that is always running, otherwise you will waste energy and lose money running this.

## Limitations

* No notification when you need to reverify your ID.
* Converting G$ to fuse for gas money reduces daily income.
* Doesn't check for enough gas before sending transaction.

## Running

Must have a recent version of nodejs installed (with `npx`).

```npx goodtimes@1.0.4```

I would recommend reviewing the code on `npmjs.com` before running since the program needs access to your private key. (That means theoretically it could send your G$ and anything in your account anywhere.) Including the version number in the invocation will protect you from running a different version than the one you review.

## How to buy gas

1. Add the Fuse network to MetaMask. ([Directions here](https://docs.fuse.io/the-fuse-studio/getting-started/how-to-add-fuse-to-your-metamask))
2. Add the G$ Custom Token, the contract address for G$ is: `0x495d133B938596C9984d462F007B676bDc57eCEC` on the Fuse network.
3. "Export Wallet" from the GoodDollar Wallet and "Import Account" to MetaMask.
4. Go to [fuseswap](https://fuseswap.com) and trade some G$ for FUSE. (Around 10 G$ should last a few months, exchange rates and gas prices vary.)

## Support

There is no fee for using this service, if you like it, consider sending some G$/Fuse/ETH to:
`0x764d62b23Edf7b0d9BECf159B8877bDdEfb747A4`

Or just star the project and let the GoodTimes roll!
