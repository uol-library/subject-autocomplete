Subject field autocompletion
============================

This repository contains code which accesses external services to perform lookups of subject authorities which are then used to autocomplete HTML input fields (with a subject authority text and ID in separate inputs).

The Javascript is based on the [ARIA 1.1 Combobox with Grid Popup Example](https://www.w3.org/TR/wai-aria-practices/examples/combobox/aria1.1pattern/grid-combo.html) on the Web Accessibility Initiative site. You should be able to navigate the page using a keyboard and use arrow keys to move between the different suggestions.

You can try out the autocomplete fields on the repository GitHub pages:

https://uol-library.github.io/subject-autocomplete/

Subjects in the examples are taken from Faceted Application of Subject Terminology (FAST) and the Library of Congress Subject Headings (LCSH). The code should be extensible to other services.

Changelog
---------

### 0.0.1 (14.04.2021)

* Initial release on GitHub with jekyll based examples
