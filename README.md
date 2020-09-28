<p align="center">
  <a href="https://github.com/pooltogether/pooltogether--brand-assets">
    <img src="https://github.com/pooltogether/pooltogether--brand-assets/blob/977e03604c49c63314450b5d432fe57d34747c66/logo/pooltogether-logo--purple-gradient.png?raw=true" alt="PoolTogether Brand" style="max-width:100%;" width="200">
  </a>
</p>

<br />

## PoolTogether v3 - Reference Frontend.

The newest UI for communicating with the (unreleased) v3 PoolTogether protocol. 

A demo of this app is live [here](https://reference-app.pooltogether.com).

To run the project against a local node you can use the [pooltogether-contracts](https://github.com/pooltogether/pooltogether-contracts/tree/version-3). With those contracts you can bootstrap a local Buidler EVM instance with test data so that you can develop the app locally.

#### Setup

Install dependencies:

```bash
$ yarn
```

Make sure you have `direnv` installed and copy `.envrc.example` to `.envrc`:

```bash
$ cp .envrc.example .envrc
```

Fill in your own values for `.envrc`, then run:

```bash
$ direnv allow
```

To run the local server, run:

```
$ yarn dev
```
