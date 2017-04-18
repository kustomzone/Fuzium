'use strict';

const Datastore = require('nedb');
const db = new Datastore({ filename: global.__app.dataPath + '/user-settings.db', autoload: true });

var UserSetting = {};

/**
 * reset user settings
 */
UserSetting.reset = function() {

};

/**
 * set a specific setting for a user
 *
 * @param settingKey
 * @param settingValue
 * @param callback
 */
UserSetting.set = function(settingKey, settingValue, callback) {
	db.update({
		settingKey: settingValue
	}, {
		upsert: true
	}, function() {
		console.log("setting complete");
	});
};

module.exports = UserSetting;