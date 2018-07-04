CKEDITOR.plugins.add( 'highlight', {
    icons: 'highlight',
    init: function( editor ) {
        editor.addCommand( 'highlight', new CKEDITOR.dialogCommand( 'highlightDialog' ) );
        editor.ui.addButton( 'Highlight', {
            label: 'Insert Highlight',
            command: 'highlight',
            toolbar: 'insert,0'
        });
        //editor.addContentsCss(this.path + 'styles/highlight.css');
        if (editor.contextMenu ) {
            editor.addMenuGroup( 'highlightGroup' );
            editor.addMenuItem( 'highlightItem', {
                label: 'Edit Content of Highlight',
                icon: this.path + 'icons/highlight.png',
                command: 'highlight',
                group: 'highlightGroup'
            });
            editor.contextMenu.addListener( function( element, selection ) {
                if ( element.getAscendant( 'div', true ) && element.getId() == 'highlight') {
                    return { highlightItem: CKEDITOR.TRISTATE_OFF };
                }
            });
        }
        editor.on('doubleclick', function(event) {
                var element = event.data.element;
                if (element.is('div') && element.getAttribute("id")=="highlight") {
                    event.data.dialog = 'highlightDialog';
                }
            }
        );
        CKEDITOR.dialog.add( 'highlightDialog', this.path + 'dialogs/highlightDialog.js' );
    }
});