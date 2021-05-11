/**
 * Unique ID generator
 * @returns {string} comprising of random alphanumeric characters to be used in JSONP requests
 */
function uuid() {
	return ([1e7] + 1e3 + 4e3 + 8e3 + 1e11).replace(/[018]/g, c =>
		(c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
	);
}
/**
 * Searches the FAST subjects for subjects matching the given string
 * @param {string} searchString 
 * @returns {Promise}
 */
function searchFAST(searchString) {
	searchString = searchString.replace(/\-|\(|\)|:/g, "");
	searchString = searchString.replace(/ /g, "%20");
	var fastUrl = 'https://fast.oclc.org/searchfast/fastsuggest?&queryIndex=suggest50&queryReturn=suggestall%2Cidroot%2Cauth%2Ctag%2Ctype%2Craw%2Cbreaker%2Cindicator&suggest=autoSubject&query=' + searchString;
	return getSearchPromise(fastUrl, formatFASTresults);
}
/**
 * Searches the LCSH subjects for subjects matching the given string
 * @param {string} searchString 
 * @returns {Promise}
 */
 function searchLCSH(searchString) {
	searchString = searchString.replace(/\-|\(|\)|:/g, "");
	searchString = searchString.replace(/ /g, "%20");
	var lcshUrl = 'https://id.loc.gov/authorities/subjects/suggest2?q=' + searchString;
	return getSearchPromise(lcshUrl, formatLCSHresults);
}
/**
 * Gets a JavaScript Promise for a JSONP request, and accepts a callback function to process data returned
 * @param {string} url URL of service which returns results (including search string)
 * @param {string} datacb callback for data when is is returned
 * @returns {Promise}
 */
function getSearchPromise(url, datacb) {
	/* load data using JSONP and return using a promise */
	return new Promise(rs => {
		const script = document.createElement('script');
		const name = 'jsonp_' + uuid();

		if (url.match(/\?/)) {
			url += '&callback=' + name;
		} else {
			url += '?callback=' + name;
		}

		script.src = url;
		window[name] = json => {
			rs(datacb(json));
			script.remove();
			delete window[name];
		};
		document.body.appendChild(script);
	});
}
/**
 * 
 * @param {Object} results 
 * @returns 
 */
function formatFASTresults(results) {
	var ret = [];
	if (results && results.response && results.response.numFound && results.response.numFound > 0) {
		for (var i = 0; i < results.response.docs.length; i++) {
			ret.push({
				'id': results.response.docs[i].idroot,
				'auth': results.response.docs[i].auth,
				'type': results.response.docs[i].type,
				'alt': results.response.docs[i].suggestall.join(', '),
			});
		}
	}
	return ret;
}
function formatLCSHresults(results) {
	var ret = [];
	if (results && results.count > 0) {
		for (var i = 0; i < results.hits.length; i++) {
			ret.push({
				'id': results.hits[i].token,
				'auth': results.hits[i].aLabel,
				'type': (results.hits[i].vLabel === '' ? 'auth' : 'alt'),
				'alt': results.hits[i].vLabel,
			});
		}
	}
	return ret;
}