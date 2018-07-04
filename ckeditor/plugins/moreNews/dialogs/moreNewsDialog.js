function isValidURL(url) {
    if (url != undefined && url != null && url.trim().length > 0) {
        var regexp = new RegExp("^" +

            // protocol identifier
            "(?:(?:https?|ftp)://)" +
            // user:pass authentication
            "(?:\\S+(?::\\S*)?@)?" +
            "(?:" +
            // IP address exclusion, private & local networks
            "(?!(?:10|127)(?:\\.\\d{1,3}){3})" +
            "(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})" +
            "(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})" +
            // IP address dotted notation octets, excludes loopback network 0.0.0.0, excludes reserved space >= 224.0.0.0, excludes network & broacast addresses, (first & last IP address of each class)
            "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
            "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
            "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
            "|" +
            // host name
            "(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)" +
            // domain name
            "(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*" +
            // TLD identifier
            "(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))" +
            // TLD may end with dot
            "\\.?" +
            ")" +
            // port number
            "(?::\\d{2,5})?" +
            // resource path
            "(?:[/?#]\\S*)?" +
            "$", "i"
        );

        if (!regexp.test(url)) {
            return false;
        } else {
            return true;
        }
    } else {
        return false;
    }
}

function getElement(editor,index){
    return{
        type: "hbox",
        id: "hbox"+index,
        widths: ["50%", "50%"],
        children: [{
            id: "url"+index,
            type: "text",
            label: "URL "+index,
            getFieldValue: function(){
                return this.getValue();
            },
            commit: function(dataArr, dialog) {
                var text=dialog.getContentElement('tab-more-news', 'text'+index);
                dataArr.push({"url":this.getValue(),"text": text.getValue()});
            },
            onChange : function () {
                this.validate();
            },
            validate : function () {
                if (this.getValue().trim().length >0 && !isValidURL(this.getValue().trim())) {
                        alert("Invalid url. Please enter correct url.");
                        this.focus();
                        return false;
                }
            }
        }, {
            id: "text"+index,
            type: "text",
            label: "Text "+index,
            getFieldValue: function(){
                return this.getValue();
            },
        }]
    };
}

CKEDITOR.dialog.add( 'moreNewsDialog', function( editor ) {
    return {
        title: 'More News',
        minWidth: 400,
        minHeight: 200,

        contents: [
            {
                id: 'tab-more-news',
                label: 'More News',
                elements: [getElement(editor,1),getElement(editor,2),getElement(editor,3),getElement(editor,4),getElement(editor,5)]
            }
        ],

        onShow: function() {
            var selection = editor.getSelection();
            var element = selection.getStartElement();

            if ( element )
                element = element.getAscendant( 'div', true );

            if ( !element || element.getId() != 'moreNews' ) {
                element = editor.document.createElement( 'div' );
                element.setAttribute("id", "moreNews");
                this.insertMode = true;
            }
            else{
                this.insertMode = false;
            }

            this.element = element;
            if ( !this.insertMode )
                setupContent( this.element, this );
        },

        onOk: function() {
            var dialog = this;
            var div = this.element;
            div.setAttribute("class", "more-news-in-article");
            var dataArr=[];
            this.commitContent(dataArr, dialog);
            var atleastOneFilled=false;
            for(var i=0;i<dataArr.length;i++){
                var url=dataArr[i].url;
                var text=dataArr[i].text;
                if(url!="" && text!=""){
                    if(!isValidURL(url)){
                        alert("Invalid url.");
                        return false;
                    }
                    atleastOneFilled=true;
                }else{
                    if(!(url=="" && text=="")){
                        if(url==""){
                            alert("Url field can not be empty where text is specified.");
                            return false;
                        }
                        if(text==""){
                            alert("Text field can not be empty where url is specified.");
                            return false;
                        }
                    }
                }
            }
            if(!atleastOneFilled){
                alert("Please fill atleast one row with valid data.");
                return false;
            }
            div.setHtml("");
            var heading = editor.document.createElement('h3');
            heading.setHtml('এই বিষয়ে অন্যান্য খবর');
            div.append(heading);
            var ul=editor.document.createElement('ul');
            ul.setAttribute("id", "more-news-ul");
            var counter=0;
            for(var i=0;i<dataArr.length;i++){
                if(dataArr[i].url!="" && dataArr[i].text!=""){
                    var li = editor.document.createElement('li');
                    li.setAttribute("id", "more-news-ul-li-"+(++counter));

                    var a = editor.document.createElement('a');
                    a.setAttribute("id","more-news-ul-li-"+counter+"-url"+counter);
                    a.setAttribute("href",dataArr[i].url);
                    a.setAttribute("displayString",dataArr[i].text);
                    a.setHtml(dataArr[i].text);
                    li.append(a);

                    ul.append(li);
                }
            }

            div.append(ul);
            div.appendBogus(true);
            if(dialog.insertMode)
                editor.insertElement( div );
        }
    };
});
function validateData(dataArr){
    var result=true;
    for(var i=0;i<dataArr.length;i++){
        var url=dataArr[i].url;
        var text=dataArr[i].text;
        if(!(url=="" && text=="")){
            if(isValidURL(url)){
                if(text==""){
                    result= false;
                    break;
                }else{
                    dataArr[i].isValid=true;
                }
            }else{
                result= false;
                break;
            }
        }
    }
    return result;
}
function setupContent(element, dialog){
    if(element.getChildren() && element.getChildren()!=undefined && element.getChildren()!=null && element.getChildren().count()>1){
        var ul=element.getChildren().getItem(1);
        if(ul && ul!=undefined && ul!=null && ul.getAttribute("id")=="more-news-ul"){
            if(ul.getChildren() && ul.getChildren()!=undefined && ul.getChildren()!=null && ul.getChildren().count()>0){
                var counter=1;
                for(i=0;i<ul.getChildren().count();i++){
                    var li=ul.getChildren().getItem(i);
                    if(li.getChildren() && li.getChildren()!=undefined && li.getChildren()!=null && li.getChildren().count()>0){
                        var a=li.getChildren().getItem(0);
                        var url=dialog.getContentElement('tab-more-news', 'url'+counter);
                        var text=dialog.getContentElement('tab-more-news', 'text'+counter);

                        url.setValue(a.getAttribute("href"));
                        text.setValue(a.getAttribute("displayString"));
                        counter++;
                    }

                }
            }
        }
    }
}