require('dotenv').config();
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const chalk = require('chalk');
const ncp = require('copy-paste');
const randomstring = require('randomstring');

class Password {
  constructor(service, username) {
    this.service = service;
    this.username = username;
  }

  /**
   * Return .accounts.json file path
   */
  accountsFile() {
    const directory = process.env.HOME || process.env.USERPROFILE;
    return path.join(directory, '.password-accounts.json');
  }

  /**
   * Return .passwords file path
   */
  passwordFile() {
    if (process.env.PASS_DEFAULT) {
      return path.join('./test/', '.password-test');
    } else {
      const directory = process.env.HOME || process.env.USERPROFILE;
      return path.join(directory, '.password');
    }
  }

  /**
   * Return salt string and create file .password if not exists
   */
  salt() {
    try {
      fs.accessSync(this.passwordFile(), fs.constants.R_OK | fs.constants.W_OK);
    } catch (err) {
      fs.writeFileSync(this.passwordFile(), randomstring.generate(32), 'utf8');
    }

    return fs.readFileSync(this.passwordFile(), 'utf-8');
  }

  /**
   * Return salt string and create file .password-accounts.json if not exists
   */
  accountsPassword() {
    // create file if not exists
    try {
      fs.accessSync(this.accountsFile(), fs.constants.R_OK | fs.constants.W_OK);
    } catch (err) {
      fs.writeFileSync(this.accountsFile(), '{}', 'utf8');
    }

    // read json file
    let obj = JSON.parse(fs.readFileSync(this.accountsFile(), 'utf-8'));

    // set new property
    obj[this.service] = this.username;

    // write new file
    fs.writeFileSync(this.accountsFile(), JSON.stringify(obj), 'utf8');
  }

  validate() {
    let response = true;

    if (this.service === 'default') {
      console.log(chalk`{red ✗} Service is required.`);

      response = false;
    }

    if (this.username === 'default') {
      console.log(chalk`{red ✗} Username is required.`);

      response = false;
    }

    return response;
  }

  /**
   * Return salt + string on md5
   */
  get() {
    if (!this.validate()) {
      return;
    }

    // to store new data
    this.accountsPassword();

    const string = `${this.salt()}_${this.service}_${this.username}`;
    const hash = crypto.createHash('md5').update(string).digest('hex');

    if (process.env.PASS_RETURN) {
      console.log(hash);
    } else {
      ncp.copy(hash, () => {
        console.log(chalk`{green ✓} Copied password to clipboard!`);

        process.exit(0); // eslint-disable-line unicorn/no-process-exit
      });
    }
  }
}

module.exports = Password;
