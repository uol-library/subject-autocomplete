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
