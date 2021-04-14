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

{% include subject-input.html keyword="fast" index="1" label="FAST Subject" callback="searchFAST" %}
{% include subject-input.html keyword="fast" index="2" label="FAST Subject" callback="searchFAST" %}

Library of Congress Subject Headings (LCSH)
-------------------------------------------

Library of Congress Subject Headings (LCSH) has been actively maintained since 1898 to catalog materials held at the Library of Congress.

* [Library of Congress Linked Data Service](https://id.loc.gov/)
* [Technical details of the suggest service](https://id.loc.gov/techcenter/searching.html)

### Autocomplete examples

{% include subject-input.html keyword="lcsh" index="1" label="LCSH Subject" callback="searchLCSH" %}
{% include subject-input.html keyword="lcsh" index="2" label="LCSH Subject" callback="searchLCSH" %}
