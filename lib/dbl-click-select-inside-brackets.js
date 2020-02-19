'use babel';

import DblClickSelectInsideBracketsView from './dbl-click-select-inside-brackets-view';
import { CompositeDisposable } from 'atom';

export default {
  subscriptions: null,

  activate(state) {
    this.subscriptions = new CompositeDisposable();
    this.dblClickSelectInsideBrackets();
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  dblClickSelectInsideBrackets() {
    let opening_chars = '{[(<';
    let closing_chars = '}])>';
    let editor;

    if (editor = atom.workspace.getActiveTextEditor()) {
      atom.views.getView(editor).addEventListener('dblclick', function(e) {
        // Convert double-click position to an Atom text buffer position
        dbl_click_screen_pos = atom.views.getView(editor).component.screenPositionForMouseEvent(e);
        dbl_click_buffer_pos = editor.bufferPositionForScreenPosition(dbl_click_screen_pos);

        // Get the target character for the double-click
        dbl_clicked_char = editor.getTextInBufferRange([
          dbl_click_buffer_pos.translate([0, -1]),
          dbl_click_buffer_pos
        ]);

        // Bail out if we don't recognize the target character as a bracket
        if (!opening_chars.includes(dbl_clicked_char) && !closing_chars.includes(dbl_clicked_char)) {
          return false;
        }

        // Track nesting depth so we get the correct closing bracket
        nesting = 0;
        forward_search = opening_chars.includes(dbl_clicked_char);

        // Find the matching bracket
        if (forward_search) {
          search_char = closing_chars[ opening_chars.indexOf(dbl_clicked_char) ]
          search_text = editor.getBuffer().getTextInRange([
            dbl_click_buffer_pos,
            editor.getBuffer().getEndPosition()
          ]);

          for (var i = 0; i < search_text.length; i++) {
            if (nesting == 0 && search_text.charAt(i) == search_char) {
              break;
            }

            if (search_text.charAt(i) == dbl_clicked_char) {
              nesting++;
            }
            else if (search_text.charAt(i) == search_char) {
              nesting--;
            }
          }
        }
        else {
          search_char = opening_chars[ closing_chars.indexOf(dbl_clicked_char) ]
          search_text = editor.getBuffer().getTextInRange([
            editor.getBuffer().getFirstPosition(),
            dbl_click_buffer_pos.translate([0,-1])
          ]);

          for (var i = 1; i < search_text.length; i++) {
            if (nesting == 0 && search_text.charAt(search_text.length - i) == search_char) {
              break;
            }

            if (search_text.charAt(search_text.length - i) == dbl_clicked_char) {
              nesting++;
            }
            else if (search_text.charAt(search_text.length - i) == search_char) {
              nesting--;
            }
          }
        }

        // If we never found a matching bracket, do nothing
        if (search_text.length == i) {
          return false;
        }

        // If a matching bracket was found, set the selection
        if (forward_search) {
          editor.setCursorBufferPosition(dbl_click_buffer_pos);
          editor.selectRight(i)
        }
        else {
          editor.setCursorBufferPosition(dbl_click_buffer_pos.translate([0,-1]));
          editor.selectLeft(i-1)
        }
      })
    }
  }
};
