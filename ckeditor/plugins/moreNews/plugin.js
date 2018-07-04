CKEDITOR.plugins.add( 'moreNews', {
    icons: 'moreNews',
    init: function( editor ) {
        editor.addCommand( 'moreNews', new CKEDITOR.dialogCommand( 'moreNewsDialog' ) );
        editor.ui.addButton( 'MoreNews', {
            label: 'Insert More News',
            command: 'moreNews',
            toolbar: 'insert,0'
        });
        //editor.addContentsCss(this.path + 'styles/more-news-in-article.css');
        if (editor.contextMenu ) {
            editor.addMenuGroup( 'moreNewsGroup' );
            editor.addMenuItem( 'moreNewsItem', {
                label: 'Edit Content of More News',
                icon: this.path + 'icons/moreNews.png',
                command: 'moreNews',
                group: 'moreNewsGroup'
            });
            editor.contextMenu.addListener( function( element, selection ) {
                if ( element.getAscendant( 'div', true ) && element.getId() == 'moreNews') {
                    return { moreNewsItem: CKEDITOR.TRISTATE_OFF };
                }
            });
        }
        editor.on('doubleclick', function(event) {
                var element = event.data.element;
                if (element.is('div') && element.getAttribute("id")=="moreNews") {
                    event.data.dialog = 'moreNewsDialog';
                }
            }
        );
        CKEDITOR.dialog.add( 'moreNewsDialog', this.path + 'dialogs/moreNewsDialog.js' );
    }
});