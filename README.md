# mc-pass

Generate an encrypted password for your accounts on the internet.

[![travis-ci](https://travis-ci.org/paulomcnally/mc-pass.svg)](https://travis-ci.org/paulomcnally/mc-pass)

[![travis-ci](https://nodei.co/npm/mc-pass.png)](https://www.npmjs.com/package/mc-pass)

## Install

    $ npm install mc-pass -g

## Example

    $ pass facebook zuck

> The result will be ready in clipboard.

## Test

Create .env file with:

    PASS_RETURN=true
    PASS_DEFAULT=bfb106205382c679eaacc2d6a502edac

And run:

    $ npm test

To show salt:

    $ cat $HOME/.password

Tow show accounts log

    $ cat $HOME/.password-accounts.json

**Tested on ubuntu.**
