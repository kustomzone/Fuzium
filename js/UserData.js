'use strict';

const Datastore = require('nedb');
const db = new Datastore({ filename: global.__app.dataPath + '/user-data.db', autoload: true });

var UserData = {};

module.exports = UserData;