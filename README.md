# dbl-click-select-inside-brackets package

Lots of code editors ship with an option to double-click a brace/bracket/paren (I refer to them collectively as "brackets" here), which selects everything up to its closing bracket.

Atom currently can do this via the ctrl-cmd-m key combination and "Select Inside Brackets" menu option. Those are provided by the excellent [bracket-matcher](https://atom.io/packages/bracket-matcher) package, but I missed the double-click so much that I wrote a plugin to add it.

This package currently only supports double-click on the _opening_ bracket. I hope to add support for double-clicks on closing brackets in the near future.

Enjoy!
