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
   * Return .passwords file path
   */
  file() {
    if (process.env.PASS_DEFAULT) {
      return path.join('./test/', '.passwords');
    } else {
      const directory = process.env.HOME || process.env.USERPROFILE;
      return path.join(directory, '.passwords');
    }
  }

  /**
   * Return salt string and create file .password if not exists
   */
  salt() {
    try {
      fs.accessSync(this.file(), fs.constants.R_OK | fs.constants.W_OK);
    } catch (err) {
      fs.writeFileSync(this.file(), randomstring.generate(32), 'utf8');
    }

    return fs.readFileSync(this.file(), 'utf-8');
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
