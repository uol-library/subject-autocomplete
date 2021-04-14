/**
 * @function onload
 * @desc Initialize the combobox examples once the page has loaded
 */
window.addEventListener('load', function () {
	var comboboxes = {};
	var callbacks = { 'fast': searchFAST, 'lcsh': searchLCSH };
	if (typeof cbs !== 'undefined') {
		cbs.forEach(box => {
			if (callbacks[box.keyword]) {
				comboboxes[box.keyword + box.index] = new aria.GridCombobox(
					document.getElementById(box.keyword + '-combobox' + box.index),
					document.getElementById(box.keyword + '-input' + box.index),
					document.getElementById(box.keyword + '-idinput' + box.index),
					document.getElementById(box.keyword + '-grid' + box.index),
					callbacks[box.keyword]
				);
			}
		});
	}
});
function uuid() {
	return ([1e7] + 1e3 + 4e3 + 8e3 + 1e11).replace(/[018]/g, c =>
		(c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
	);
}
function searchFAST(searchString) {
	searchString = searchString.replace(/\-|\(|\)|:/g, "");
	searchString = searchString.replace(/ /g, "%20");
	var fastUrl = 'https://fast.oclc.org/searchfast/fastsuggest?&queryIndex=suggest50&queryReturn=suggestall%2Cidroot%2Cauth%2Ctag%2Ctype%2Craw%2Cbreaker%2Cindicator&suggest=autoSubject&query=' + searchString;
	return getSearchPromise(fastUrl, formatFASTresults);
}
function searchLCSH(searchString) {
	searchString = searchString.replace(/\-|\(|\)|:/g, "");
	searchString = searchString.replace(/ /g, "%20");
	var lcshUrl = 'https://id.loc.gov/authorities/subjects/suggest2?q=' + searchString;
	return getSearchPromise(lcshUrl, formatLCSHresults);
}
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