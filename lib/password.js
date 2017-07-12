const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const randomstring = require('randomstring');
const colors = require('colors');
const ncp = require('copy-paste');

class Password {
  constructor(service, username) {
    this.service = service;
    this.username = username;
  }

  /**
  * Return .passwords file path
  */
  file() {
    var directory = process.env.HOME || process.env.USERPROFILE;
    return `${directory}${path.sep}.passwords`
  }

  /**
  * Return salt string and create file .password if not exists
  */
  salt() {
    try{
      fs.accessSync(this.file(), fs.constants.R_OK | fs.constants.W_OK);
      return fs.readFileSync(this.file(), 'utf-8');
    }catch(e){
      fs.writeFileSync(this.file(), randomstring.generate(32), 'utf8')
      return this.salt();
    }
  }

  validate() {
    let response = true;
    if (this.service === 'default') {
      console.log(colors.red('✗ Service is required.'));
      response = false;
    }

    if (this.username === 'default') {
      console.log(colors.red('✗ Username is required.'));
      response = false;
    }

    return response;
  }

  /**
  * Return salt + string on md5
  */
  get() {
    if (this.validate()) {
      let string = `${this.salt()}_${this.service}_${this.username}`;
      let hash = crypto.createHash('md5').update(string).digest('hex');
      ncp.copy(hash, function () {
        console.log(colors.green('✓'));
        process.exit(0);
      });
    }
  }
}

module.exports = Password;
