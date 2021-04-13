/**
 * @namespace aria
 */
var aria = aria || {};
/**
 * @desc
 *  Key code constants
 */
aria.KeyCode = {
    BACKSPACE: 8,
    TAB: 9,
    RETURN: 13,
    ESC: 27,
    SPACE: 32,
    PAGE_UP: 33,
    PAGE_DOWN: 34,
    END: 35,
    HOME: 36,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    DELETE: 46
};

aria.Utils = aria.Utils || {};

// Polyfill src https://developer.mozilla.org/en-US/docs/Web/API/Element/matches
aria.Utils.matches = function (element, selector) {
    if (!Element.prototype.matches) {
        Element.prototype.matches =
            Element.prototype.matchesSelector ||
            Element.prototype.mozMatchesSelector ||
            Element.prototype.msMatchesSelector ||
            Element.prototype.oMatchesSelector ||
            Element.prototype.webkitMatchesSelector ||
            function (s) {
                var matches = element.parentNode.querySelectorAll(s);
                var i = matches.length;
                while (--i >= 0 && matches.item(i) !== this) { }
                return i > -1;
            };
    }

    return element.matches(selector);
};

aria.Utils.remove = function (item) {
    if (item.remove && typeof item.remove === 'function') {
        return item.remove();
    }
    if (item.parentNode &&
        item.parentNode.removeChild &&
        typeof item.parentNode.removeChild === 'function') {
        return item.parentNode.removeChild(item);
    }
    return false;
};

aria.Utils.isFocusable = function (element) {
    if (element.tabIndex > 0 || (element.tabIndex === 0 && element.getAttribute('tabIndex') !== null)) {
        return true;
    }

    if (element.disabled) {
        return false;
    }

    switch (element.nodeName) {
        case 'A':
            return !!element.href && element.rel != 'ignore';
        case 'INPUT':
            return element.type != 'hidden' && element.type != 'file';
        case 'BUTTON':
        case 'SELECT':
        case 'TEXTAREA':
            return true;
        default:
            return false;
    }
};

aria.Utils.getAncestorBySelector = function (element, selector) {
    if (!aria.Utils.matches(element, selector + ' ' + element.tagName)) {
        // Element is not inside an element that matches selector
        return null;
    }

    // Move up the DOM tree until a parent matching the selector is found
    var currentNode = element;
    var ancestor = null;
    while (ancestor === null) {
        if (aria.Utils.matches(currentNode.parentNode, selector)) {
            ancestor = currentNode.parentNode;
        }
        else {
            currentNode = currentNode.parentNode;
        }
    }

    return ancestor;
};

aria.Utils.hasClass = function (element, className) {
    return (new RegExp('(\\s|^)' + className + '(\\s|$)')).test(element.className);
};

aria.Utils.addClass = function (element, className) {
    if (!aria.Utils.hasClass(element, className)) {
        element.className += ' ' + className;
    }
};

aria.Utils.removeClass = function (element, className) {
    var classRegex = new RegExp('(\\s|^)' + className + '(\\s|$)');
    element.className = element.className.replace(classRegex, ' ').trim();
};

aria.Utils.bindMethods = function (object /* , ...methodNames */) {
    var methodNames = Array.prototype.slice.call(arguments, 1);
    methodNames.forEach(function (method) {
        object[method] = object[method].bind(object);
    });
};

/**
 * @constructor
 *
 * @desc
 *  Combobox object representing the state and interactions for a combobox
 *  widget
 *
 * @param comboboxNode
 *  The DOM node pointing to the combobox
 * @param input
 *  The input node
 * @param grid
 *  The grid node to load results in
 * @param searchFn
 *  The search function. The function accepts a search string and returns an
 *  array of results.
 */
aria.GridCombobox = function (
    comboboxNode,
    input,
    idinput,
    grid,
    searchFn
) {
    this.combobox = comboboxNode;
    this.input = input;
    this.idinput = idinput;
    this.grid = grid;
    this.searchFn = searchFn;
    this.activeRowIndex = -1;
    this.rowsCount = 0;
    this.gridFocused = false;
    this.shown = false;
    this.selectionCol = 0;

    this.setupEvents();
};

aria.GridCombobox.prototype.setupEvents = function () {
    document.body.addEventListener('click', this.checkHide.bind(this));
    this.input.addEventListener('keyup', this.checkKey.bind(this));
    this.input.addEventListener('keydown', this.setActiveItem.bind(this));
    this.input.addEventListener('focus', this.checkShow.bind(this));
    this.grid.addEventListener('click', this.clickItem.bind(this));
};

aria.GridCombobox.prototype.checkKey = function (evt) {
    var key = evt.which || evt.keyCode;

    switch (key) {
        case aria.KeyCode.UP:
        case aria.KeyCode.DOWN:
        case aria.KeyCode.ESC:
        case aria.KeyCode.RETURN:
            evt.preventDefault();
            return;
        default:
            this.updateResults();
    }
};

aria.GridCombobox.prototype.updateResults = function() {
    var searchString = this.input.value;
    searchString = searchString.replace(/\-|\(|\)|:/g, "");
    searchString = searchString.replace(/ /g, "%20");
    if (searchString.length > 2) {
        this.searchFn(searchString).then(results => {
            this.hideResults();
            this.rowsCount = results.length;
            if (this.rowsCount) {
                for (var row = 0; row < this.rowsCount; row++) {
                    var resultRow = document.createElement('div');
                    resultRow.className = 'result-row';
                    resultRow.setAttribute('role', 'row');
                    resultRow.setAttribute('id', 'result-row-' + row);

                    var resultTitle = document.createElement('div');
                    resultTitle.className = 'result-cell';
                    resultTitle.setAttribute('role', 'gridcell');
                    resultTitle.setAttribute('id', 'result-item-' + row);
                    var authTitle = document.createElement('span');
                    authTitle.setAttribute('class', 'authTitle');
                    authTitle.setAttribute('data-termid', results[row].id);
                    authTitle.innerText = results[row].auth;
                    if (results[row].type === 'auth') {
                        resultTitle.appendChild(authTitle);
                    } else {
                        var altTitle = document.createElement('span');
                        altTitle.setAttribute('class', 'altTitle');
                        altTitle.innerText = results[row].alt;
                        var useAuth = document.createElement('span');
                        useAuth.setAttribute('class', 'useAuth');
                        useAuth.innerText = ' USE ';
                        resultTitle.appendChild(altTitle);
                        resultTitle.appendChild(useAuth);
                        resultTitle.appendChild(authTitle);
                    }
                    resultRow.append(resultTitle)
                    this.grid.appendChild(resultRow);
                }
                aria.Utils.removeClass(this.grid, 'hidden');
                this.combobox.setAttribute('aria-expanded', 'true');
                this.shown = true;
            }

        });
    } else {
        this.hideResults();
    }
};

aria.GridCombobox.prototype.getRowIndex = function (key) {
    var activeRowIndex = this.activeRowIndex;

    switch (key) {
        case aria.KeyCode.UP:
            if (activeRowIndex <= 0) {
                activeRowIndex = this.rowsCount - 1;
            }
            else {
                activeRowIndex--;
            }
            break;
        case aria.KeyCode.DOWN:
            if (activeRowIndex === -1 || activeRowIndex >= this.rowsCount - 1) {
                activeRowIndex = 0;
            }
            else {
                activeRowIndex++;
            }
    }

    return activeRowIndex;
};

aria.GridCombobox.prototype.setActiveItem = function (evt) {
    var key = evt.which || evt.keyCode;
    var activeRowIndex = this.activeRowIndex;

    if (key === aria.KeyCode.ESC) {
        if (this.gridFocused) {
            this.gridFocused = false;
            this.removeFocusCell(this.activeRowIndex);
            this.activeRowIndex = -1;
            this.input.setAttribute(
                'aria-activedescendant',
                ''
            );
        }
        else {
            this.hideResults();
            setTimeout((function () {
                // On Firefox, input does not get cleared here unless wrapped in
                // a setTimeout
                this.input.value = '';
            }).bind(this), 1);
        }
        return;
    }

    if (this.rowsCount < 1) {
        return;
    }

    var prevActive = this.getItemAt(activeRowIndex);
    var activeItem;

    switch (key) {
        case aria.KeyCode.UP:
            this.gridFocused = true;
            activeRowIndex = this.getRowIndex(key);
            evt.preventDefault();
            break;
        case aria.KeyCode.DOWN:
            this.gridFocused = true;
            activeRowIndex = this.getRowIndex(key);
            evt.preventDefault();
            break;
        case aria.KeyCode.RETURN:
            activeItem = this.getItemAt(activeRowIndex);
            this.selectItem(activeItem);
            this.gridFocused = false;
            return;
        case aria.KeyCode.TAB:
            this.hideResults();
            return;
        default:
            return;
    }


    if (prevActive) {
        this.removeFocusCell(this.activeRowIndex);
        prevActive.setAttribute('aria-selected', 'false');
    }

    activeItem = this.getItemAt(activeRowIndex);
    this.activeRowIndex = activeRowIndex;

    if (activeItem) {
        this.input.setAttribute(
            'aria-activedescendant',
            'result-item-' + activeRowIndex
        );
        this.focusCell(activeRowIndex);
        var selectedItem = this.getItemAt(activeRowIndex);
        selectedItem.setAttribute('aria-selected', 'true');
    }
    else {
        this.input.setAttribute(
            'aria-activedescendant',
            ''
        );
    }
};

aria.GridCombobox.prototype.getItemAt = function (rowIndex) {
    return document.getElementById('result-item-' + rowIndex);
};

aria.GridCombobox.prototype.clickItem = function (evt) {
    if (!evt.target) {
        return;
    }

    var row;
    if (evt.target.getAttribute('role') === 'row') {
        row = evt.target;
    }
    else if (evt.target.getAttribute('role') === 'gridcell') {
        row = evt.target.parentNode;
    }
    else if (evt.target.parentElement.getAttribute('role') === 'gridcell') {
        row = evt.target.parentElement.parentElement;
    }
    else {
        return;
    }

    var selectItem = row.querySelector('.result-cell');
    this.selectItem(selectItem);
};

aria.GridCombobox.prototype.selectItem = function (item) {
    if (item) {
        this.input.value = item.querySelector('.authTitle').textContent;
        this.idinput.value = item.querySelector('.authTitle').getAttribute('data-termid');
        this.hideResults();
    }
};

aria.GridCombobox.prototype.checkShow = function (evt) {
    this.updateResults();
};

aria.GridCombobox.prototype.checkHide = function (evt) {
    if (evt.target === this.input || this.combobox.contains(evt.target)) {
        return;
    }
    this.hideResults();
};

aria.GridCombobox.prototype.hideResults = function () {
    this.gridFocused = false;
    this.shown = false;
    this.activeRowIndex = -1;
    this.grid.innerHTML = '';
    aria.Utils.addClass(this.grid, 'hidden');
    this.combobox.setAttribute('aria-expanded', 'false');
    this.rowsCount = 0;
    this.input.setAttribute(
        'aria-activedescendant',
        ''
    );
};

aria.GridCombobox.prototype.removeFocusCell = function (rowIndex) {
    var row = this.getItemAt(rowIndex);
    aria.Utils.removeClass(row, 'focused');
};

aria.GridCombobox.prototype.focusCell = function (rowIndex, colIndex) {
    var row = this.getItemAt(rowIndex);
    aria.Utils.addClass(row, 'focused');
};

/**
 * @function onload
 * @desc Initialize the combobox examples once the page has loaded
 */
window.addEventListener('load', function () {
    var fast1Combobox = new aria.GridCombobox(
        document.getElementById('fast-combobox1'),
        document.getElementById('fast-input1'),
        document.getElementById('fast-idinput1'),
        document.getElementById('fast-grid1'),
        searchFAST
    );
    var fast2Combobox = new aria.GridCombobox(
        document.getElementById('fast-combobox2'),
        document.getElementById('fast-input2'),
        document.getElementById('fast-idinput2'),
        document.getElementById('fast-grid2'),
        searchFAST
    );
    var lcsh1Combobox = new aria.GridCombobox(
        document.getElementById('lcsh-combobox1'),
        document.getElementById('lcsh-input1'),
        document.getElementById('lcsh-idinput1'),
        document.getElementById('lcsh-grid1'),
        searchLCSH
    );
    var lcsh2Combobox = new aria.GridCombobox(
        document.getElementById('lcsh-combobox2'),
        document.getElementById('lcsh-input2'),
        document.getElementById('lcsh-idinput2'),
        document.getElementById('lcsh-grid2'),
        searchLCSH
    );
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
                'type': (results.hits[i].vLabel===''?'auth':'alt'),
                'alt': results.hits[i].vLabel,
            });
        }
    }
    return ret;
}