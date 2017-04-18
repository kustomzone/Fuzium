'use strict';

const Datastore = require('nedb');
const path = require('path');
const navigationHistoryDb = new Datastore({ 
	filename: path.join(global.__app.dataPath, 'navigation-history.db'), 
	autoload: true 
});
const autoCompleteDb = new Datastore({ 
	filename: path.join(global.__app.dataPath, 'auto-complete-entries.db'), 
	autoload: true 
}); 

const logger = global.__app.logger; 

var NavigationHistory = {};

NavigationHistory.addNavigationHistory = function(navigationInfo, callback) {
	// add navigation history timestamp
	navigationInfo.date = new Date();

	let completeCount = 0; 
	let jobCount = 2; 

	navigationHistoryDb.insert(navigationInfo, function(err, newDoc) {
		if (err) {
			callback(err);
		} else {
			completeCount++; 
			if (completeCount >= jobCount) {
				callback(); 
			}
		}
	});

	autoCompleteDb.update({
		url: navigationInfo.url
	}, 
	{
		$inc: { visitCount: 1 }, 
		$set: {
			date: navigationInfo.date, 
			title: navigationInfo.title
		}
	}, 
	{
		upsert: true
	}, 
	function(err, numAffected, affectedDocuments, upsert) {
		if (err) {
			callback(err); 
		} else {
			completeCount++; 
			if (completeCount >= jobCount) {
				callback(); 
			}
		}
	}); 
};

/**
 * Clears history
 *
 * @param callback function to be called when all documents are removed (function(err, numRemoved))
 */
NavigationHistory.clearNavigationHistory = function(callback) {
	navigationHistoryDb.remove({}, callback);
};

NavigationHistory.getAutoCompleteList = function(searchTerm, callback) {
	// Escape RegEx characters inside search term
	searchTerm = searchTerm.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
	var searchRegEx = new RegExp(searchTerm);

	// Find a matching domain
	autoCompleteDb.find({
		url: searchRegEx
	})
		.limit(10)
		.sort({ 
			visitCount: -1, 
			date: -1
		})
		.exec(function(err, autoCompleteEntries) {
			callback(autoCompleteEntries);
		});
};

module.exports = NavigationHistory;