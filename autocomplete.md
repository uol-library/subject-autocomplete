---
layout: default
---

[Subject field experiments]({% link index.md %}): Autocompletion
================================================================

The following examples use external services to perform lookups of subject authorities which are then used to autocomplete fields (with a subject authority text and ID in separate inputs).

Javascript used in this example is adapted from the [ARIA 1.1 Combobox with Grid Popup Example](https://www.w3.org/TR/wai-aria-practices/examples/combobox/aria1.1pattern/grid-combo.html) on the Web Accessibility Initiative site. You should be able to navigate the page using a keyboard and use arrow keys to move between the different suggestions.

FAST Autocomplete examples
--------------------------

{% include subject-input.html keyword="fast" index="1" label="FAST Subject" callback="searchFAST" %}
{% include subject-input.html keyword="fast" index="2" label="FAST Subject" callback="searchFAST" %}

LCSH Autocomplete examples
--------------------------

{% include subject-input.html keyword="lcsh" index="1" label="LCSH Subject" callback="searchLCSH" %}
{% include subject-input.html keyword="lcsh" index="2" label="LCSH Subject" callback="searchLCSH" %}