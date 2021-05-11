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
