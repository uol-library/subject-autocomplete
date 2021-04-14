---
layout: default
---

Subject field autocompletion
============================

The following examples use external services to perform lookups of subject authorities which are then used to autocomplete fields (with a subject authority text and ID in separate inputs).

Javascript used in this example is adapted from the [ARIA 1.1 Combobox with Grid Popup Example](https://www.w3.org/TR/wai-aria-practices/examples/combobox/aria1.1pattern/grid-combo.html) on the Web Accessibility Initiative site. You should be able to navigate the page using a keyboard and use arrow keys to move between the different suggestions.

Faceted Application of Subject Terminology (FAST)
-------------------------------------------------

This example uses <abbr title="Faceted Application of Subject Terminology">FAST</abbr> which is derived from <abbr title="Library of Congress Subject Headings">LCSH</abbr> and published by the <abbr title="Online Computer Library Center">OCLC</abbr>.

* [FAST overview](https://www.oclc.org/research/areas/data-science/fast.html)
* [assignFAST](http://experimental.worldcat.org/fast/assignfast/) example of autocompletionon the OCLC research site
* [FAST API documentation](https://www.oclc.org/developer/develop/web-services/fast-api.en.html)

### Autocomplete examples

<div class="subject-wrapper">
    <label for="fast-input1" id="fast-label1" class="combobox-label">
        FAST Subject 1
    </label>
    <div class="combobox-wrapper">
        <div role="combobox" aria-expanded="false" aria-owns="fast-grid" aria-haspopup="grid" id="fast-combobox1">
            <input type="text" aria-autocomplete="list" aria-controls="fast-grid1" id="fast-input1"
                placeholder="Start typing for suggestions">
        </div>
        <div aria-labelledby="fast-label1" role="grid" id="fast-grid1" class="grid hidden">
        </div>
    </div>
    <label for="fast-idinput1" id="fast-idlabel1" class="combobox-label right-inline">
        FAST ID
    </label>
    <div class="input-wrapper">
        <input type="text" id="fast-idinput1" readonly="readonly">
    </div>
</div>
<div class="subject-wrapper">
    <label for="fast-input2" id="fast-label2" class="combobox-label">
        FAST Subject 2
    </label>
    <div class="combobox-wrapper">
        <div role="combobox" aria-expanded="false" aria-owns="fast-grid" aria-haspopup="grid" id="fast-combobox2">
            <input type="text" aria-autocomplete="list" aria-controls="fast-grid2" id="fast-input2"
                placeholder="Start typing for suggestions">
        </div>
        <div aria-labelledby="fast-label2" role="grid" id="fast-grid2" class="grid hidden">
        </div>
    </div>
    <label for="fast-idinput2" id="fast-idlabel2" class="combobox-label right-inline">
        FAST ID
    </label>
    <div class="input-wrapper">
        <input type="text" id="fast-idinput2" readonly="readonly">
    </div>
</div>

Library of Congress Subject Headings (LCSH)
===========================================

Library of Congress Subject Headings (LCSH) has been actively maintained since 1898 to catalog materials held at the Library of Congress.

* [Library of Congress Linked Data Service](https://id.loc.gov/)
* [Technical details of the suggest service](https://id.loc.gov/techcenter/searching.html)

### Autocomplete examples

<div class="subject-wrapper">
    <label for="lcsh-input1" id="lcsh-label1" class="combobox-label">
        LCSH Subject 1
    </label>
    <div class="combobox-wrapper">
        <div role="combobox" aria-expanded="false" aria-owns="lcsh-grid" aria-haspopup="grid" id="lcsh-combobox1">
            <input type="text" aria-autocomplete="list" aria-controls="lcsh-grid1" id="lcsh-input1"
                placeholder="Start typing for suggestions">
        </div>
        <div aria-labelledby="lcsh-label1" role="grid" id="lcsh-grid1" class="grid hidden">
        </div>
    </div>
    <label for="lcsh-idinput1" id="lcsh-idlabel1" class="combobox-label right-inline">
        LCSH ID
    </label>
    <div class="input-wrapper">
        <input type="text" id="lcsh-idinput1" readonly="readonly">
    </div>
</div>
<div class="subject-wrapper">
    <label for="lcsh-input2" id="lcsh-label2" class="combobox-label">
        LCSH Subject 2
    </label>
    <div class="combobox-wrapper">
        <div role="combobox" aria-expanded="false" aria-owns="lcsh-grid" aria-haspopup="grid" id="lcsh-combobox2">
            <input type="text" aria-autocomplete="list" aria-controls="lcsh-grid2" id="lcsh-input2"
                placeholder="Start typing for suggestions">
        </div>
        <div aria-labelledby="lcsh-label2" role="grid" id="lcsh-grid2" class="grid hidden">
        </div>
    </div>
    <label for="lcsh-idinput2" id="lcsh-idlabel2" class="combobox-label right-inline">
        LCSH ID
    </label>
    <div class="input-wrapper">
        <input type="text" id="lcsh-idinput2" readonly="readonly">
    </div>
</div>