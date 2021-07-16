/**
 * WikidataComplete: A plugin for better editing of wikidata items.
 * 
 * Explanations module: Lists the best suggestions for editing wikidata items
 * 
 */
 function loadentityselector(){
    try {
        $( ".value_input input" ).entityselector( {
                url: 'https://www.wikidata.org/w/api.php',
                language: mw.config.get( 'wgUserLanguage' ),
            } );
    }
    catch(err) {
        setTimeout(loadentityselector, 100);
    }
}

function addanswer(qid, pid, snak) {
var api = new mw.Api();
api.get( { action: 'query', meta: 'tokens'}).then(
    function(aw) {
        token = aw.query.tokens.csrftoken;
        api.post( { 
            action: 'wbcreateclaim',
            entity: qid,
            property: pid,
            snaktype: 'value',
            value: snak,
            summary : "[Edited with Recoin] (Wikidata:Recoin)",
            token: token
            }).then(
                   function(aw){
                           console.log(aw);
                           if(aw.success == 1)
                             location.reload();
                        else
                            alert("Request failed. Please Check again.");
                   });       
            });
}
function createclaim(qid, pid,result1) {
var val = result1.text;
var api = new mw.Api();
api.get( { action: 'query', meta: 'tokens'}).then(
    function(aw) {
        token = aw.query.tokens.csrftoken;
        api.post( { 
            action: 'wbcreateclaim',
            entity: qid,
            property: pid,
            snaktype: 'value',
            value: JSON.stringify(val),
            summary : "[Edited with Recoin] (Wikidata:Recoin)",
            token: token
            }).then(
                   function(aw){
                           console.log(aw);
                           if(aw.success == 1)
                             location.reload();
                        else
                            alert("Request failed. Please Check again.");
                   });       
            });
}
function tables(result1,labelsParent,entityID){
console.log(result1.property);
var $wikitable = $( '<div class="wikibase-listview">' +
      '<div class="wikibase-snaklistview listview-item">' +
        '<div class="wikibase-snaklistview-listview">' +
          '<div class="wikibase-snakview listview-item">' +
            '<div class="wikibase-snakview-property-container">' +
              '<div class="wikibase-snakview-property" dir="auto">' +
                '<label><a href="https://www.wikidata.org/wiki/Property:'+ result1.property + '">' + 
        result1.question + '</a></label>'+
              '</div>' +
            '</div>' +
            '<div class="wikibase-snakview-value-container" dir="auto">' +
              '<div class="wikibase-snakview-typeselector"></div>' +
              '<div class="wikibase-snakview-value wikibase-snakview-variation-valuesnak" style="height: auto; width: 100%;">' +
                '<div class="valueview valueview-instaticmode" aria-disabled="false">' +
                  
                '</div>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<!-- wikibase-listview -->' +
        '</div>' +
      '</div>' +
    '</div>'+

    '<div class="wikibase-referenceview listview-item wikibase-toolbar-item new-source">' + // Remove wikibase-reference-d6e3ab4045fb3f3feea77895bc6b27e663fc878a wikibase-referenceview-d6e3ab4045fb3f3feea77895bc6b27e663fc878a
      '<div class="wikibase-referenceview-heading new-source">' +
        '<div class="wikibase-edittoolbar-container wikibase-toolbar-container">' +
          '<span class="wikibase-toolbar wikibase-toolbar-item wikibase-toolbar-container">' +
            '<span class="wikibase-toolbarbutton wikibase-toolbar-item wikibase-toolbar-button wikibase-toolbar-button-add">' +
              '<a class="f2w-button f2w-source f2w-approve" href="#" data-statement-id="{{statement-id}}" data-property="{{data-property}}" data-object="{{data-object}}" data-source="{{data-source}}" data-qualifiers="{{data-qualifiers}}"><span class="wb-icon"></span>approve reference</a>' +
            '</span>' +
          '</span>' +
          ' ' +
          /* TODO: Broken by the last changes.
          '<span class="wikibase-toolbar wikibase-toolbar-item wikibase-toolbar-container">' +
            '[' +
            '<span class="wikibase-toolbarbutton wikibase-toolbar-item wikibase-toolbar-button wikibase-toolbar-button-edit">' +
              '<a class="f2w-button f2w-source f2w-edit" href="#" data-statement-id="{{statement-id}}" data-property="{{data-property}}" data-object="{{data-object}}" data-source-property="{{data-source-property}}" data-source-object="{{data-source-object}}" data-qualifiers="{{data-qualifiers}}">edit</a>' +
            '</span>' +
            ']' +
          '</span>' +*/
          '<span class="wikibase-toolbar wikibase-toolbar-item wikibase-toolbar-container">' +
            '<span class="wikibase-toolbarbutton wikibase-toolbar-item wikibase-toolbar-button wikibase-toolbar-button-remove">' +
              '<a class="f2w-button f2w-source f2w-reject" href="#" data-statement-id="{{statement-id}}" data-property="{{data-property}}" data-object="{{data-object}}" data-source="{{data-source}}" data-qualifiers="{{data-qualifiers}}"><span class="wb-icon"></span>reject reference</a>' +
            '</span>' +
          '</span>' +
        '</div>' +
      '</div>' +
      '<div class="wikibase-referenceview-listview">' +
        '<div class="wikibase-snaklistview listview-item">' +
          '<div class="wikibase-snaklistview-listview">' +
             
            '<!-- wikibase-listview -->' +
          '</div>' +
        '</div>' +
        '<!-- [0,*] wikibase-snaklistview -->' +
      '</div>' +
    '</div>'+

    '<div class="wikibase-snakview listview-item">' +
      '<div class="wikibase-snakview-property-container">' +
        '<div class="wikibase-snakview-property" dir="auto">' +
        '</div>' +
      '</div>' +
      '<div class="wikibase-snakview-value-container" dir="auto">' +
        '<div class="wikibase-snakview-typeselector"></div>' +
        '<div class="wikibase-snakview-value wikibase-snakview-variation-valuesnak" style="height: auto;">' +
          '<div class="valueview valueview-instaticmode" aria-disabled="false">' +
            
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>'+
    '<div class="wikibase-statementview listview-item wikibase-toolbar-item new-object">' + // Removed class wikibase-statement-q31$8F3B300A-621A-4882-B4EE-65CE7C21E692
      '<div class="wikibase-statementview-rankselector">' +
        '<div class="wikibase-rankselector ui-state-disabled">' +
          '<span class="ui-icon ui-icon-rankselector wikibase-rankselector-normal" title="Normal rank"></span>' +
        '</div>' +
      '</div>' +
      '<div class="wikibase-statementview-mainsnak-container">' +
        '<div class="wikibase-statementview-mainsnak" dir="auto">' +
          '<!-- wikibase-snakview -->' +
          '<div class="wikibase-snakview">' +
            '<div class="wikibase-snakview-property-container">' +
              '<div class="wikibase-snakview-property" dir="auto">' +
                 
              '</div>' +
            '</div>' +
            '<div class="wikibase-snakview-value-container" dir="auto">' +
              '<div class="wikibase-snakview-typeselector"></div>' +
              '<div class="wikibase-snakview-value wikibase-snakview-variation-valuesnak" style="height: auto;">' +
                '<div class="valueview valueview-instaticmode" aria-disabled="false">' + '<a href="'+ result1.object[0].object + '">' + 
        result1.text + '</a>' + '</div>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="wikibase-statementview-qualifiers" style="background: #B0E0E6;">' +
          result1.evidence +
          '<!-- wikibase-listview -->' +
        '</div>' +
      '</div>' +
      '<!-- wikibase-toolbar -->' +
      '<span class="wikibase-toolbar-container wikibase-edittoolbar-container">' +
        '<span class="wikibase-toolbar-item wikibase-toolbar wikibase-toolbar-container">' +
          '<span class="wikibase-toolbarbutton wikibase-toolbar-item wikibase-toolbar-button wikibase-toolbar-button-add">' +
            '<a class="f2w-button f2w-property f2w-approve" href="#" data-statement-id="{{statement-id}}" data-property="{{data-property}}" data-object="{{data-object}}" data-qualifiers="{{data-qualifiers}}" data-sources="{{data-sources}}"><span class="wb-icon"></span>approve claim</a>' +
          '</span>' +
        '</span>' +
        ' ' +
        '<span class="wikibase-toolbar-item wikibase-toolbar wikibase-toolbar-container">' +
          '<span class="wikibase-toolbarbutton wikibase-toolbar-item wikibase-toolbar-button wikibase-toolbar-button-remove">' +
            '<a class="f2w-button f2w-property f2w-reject" href="#" data-statement-id="{{statement-id}}" data-property="{{data-property}}" data-object="{{data-object}}" data-qualifiers="{{data-qualifiers}}" data-sources="{{data-sources}}"><span class="wb-icon"></span>reject claim</a>' +
          '</span>' +
        '</span>' +
      '</span>' +
      '<div class="wikibase-statementview-references-container">' +
        '<div class="wikibase-statementview-references-heading">' +
          '<a class="ui-toggler ui-toggler-toggle ui-state-default">' + // Removed ui-toggler-toggle-collapsed
            '<span class="ui-toggler-icon ui-icon ui-icon-triangle-1-s ui-toggler-icon3dtrans"></span>' +
            '<span class="ui-toggler-label"></span>' +
          '</a>' +
        '</div>' +
        '<div class="wikibase-statementview-references wikibase-toolbar-item">' + // Removed style="display: none;"
          '<!-- wikibase-listview -->' +
          '<div class="wikibase-listview">' +
           
          '</div>' +
          '<div class="wikibase-addtoolbar-container wikibase-toolbar-container">' +
            '<!-- [' +
            '<span class="wikibase-toolbarbutton wikibase-toolbar-item wikibase-toolbar-button wikibase-toolbar-button-add">' +
              '<a href="#">add reference</a>' +
            '</span>' +
            '] -->' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>'+
    '<div class="wikibase-statementgroupview listview-item" id="{{property}}" style="border: #0000FF;">' +
      '<div class="wikibase-statementgroupview-property new-property">' +
        '<div class="wikibase-statementgroupview-property-label" dir="auto">' +
          
        '</div>' +
      '</div>' +
      '<!-- wikibase-statementlistview -->' +
      '<div class="wikibase-statementlistview wikibase-toolbar-item">' +
        '<div class="wikibase-statementlistview-listview">' +
          '<!-- [0,*] wikibase-statementview -->' +
          
        '</div>' +
        '<!-- [0,1] wikibase-toolbar -->' +
        '<span class="wikibase-toolbar-container"></span>' +
        '<span class="wikibase-toolbar-wrapper">' +
          '<div class="wikibase-addtoolbar-container wikibase-toolbar-container">' +
            '<!-- [' +
            '<span class="wikibase-toolbarbutton wikibase-toolbar-item wikibase-toolbar-button wikibase-toolbar-button-add">' +
              '<a href="#">add</a>' +
            '</span>' +
            '] -->' +
          '</div>' +
        '</span>' +
      '</div>' +
    '</div>');
            labelsParent.prepend($wikitable);
            //'<a class="f2w-button f2w-source f2w-approve" href="#" data-statement-id="{{statement-id}}" data-property="{{data-property}}" data-object="{{data-object}}" data-source="{{data-source}}" data-qualifiers="{{data-qualifiers}}"><span class="wb-icon"></span>approve reference</a>'
//$wikitable.('wikibase-snaklistview listview-item').css('background', '#ccc');
$wikitable.find('#f2w-approve a').on('click', function(e) {
//$insertElem.find(':text').val("Hello");
e.stopPropagation();
e.preventDefault();
condole.log("Hello");


 
    createclaim(entityID,result1.property,result1);
})
        }
function addtosuggestionsanswers(result1, labelsUL, entityID) {
var add = '';
//if (result.data_type=='wikibase-item')

    add = '<span class="wikibase-toolbarbutton wikibase-toolbar-item wikibase-toolbar-button wikibase-toolbar-button-add add_button"><a href=\"#\"><span class="wb-icon"/></a></span>' + '<span id="add" class="value_input" style="display:none"><input type = "text" value = "" />&nbsp;' + '<a href=\"#\">Accept    </a>' + '<a href=\"#\">Reject</a></span>';
console.log(result1.object[0].object);
console.log(result1.property);
    console.log(result1.object);
var $insertElem = $('<tr><td> ' +
        '<label><a href="https://www.wikidata.org/wiki/Property:'+ result1.property + '">' + 
        result1.property + '</a></td><td>' + result1.question + '</td><td>' + '<a href="'+ result1.object[0].object + '">' + 
        result1.text + '</a></td><td>' + ' '+ 
        '</label></td><td>' + add +'</td></tr>');
labelsUL.append($insertElem);

$insertElem.find('.add_button a').on('click', function(e) {
    e.stopPropagation();
    e.preventDefault(); 
    $insertElem.find('#add').slideToggle("fast");
    $insertElem.find('.add_button a').hide();
    $insertElem.find('.input').focus();
    $insertElem.find(':text').val(result1.text);
    //$insertElem.find('.input').prop("","Hello");
});

$(document).click(function(e) {
        
        e.stopPropagation();
        $insertElem.find('.add_button a').show();
        $insertElem.find("#add").hide();
        //$insertElem.find(':text').val("Hello");
});

$insertElem.find("#add").click(function(e) {
    //$insertElem.find(':text').val("Hello");
  e.stopPropagation();
});

$insertElem.find('#add a').on('click', function(e) {
//$insertElem.find(':text').val("Hello");
e.stopPropagation();
e.preventDefault();



 
    var selection = $(this).prev('input').data('entityselector').selectedEntity();
    console.log("Hello");
    console.log(selection.id);
    
    //console.log(selection.id);
    var snak = JSON.stringify({ "entity-type": 'item', "numeric-id": selection.id.substring(1) });
    addanswer(entityID, result1, snak);
});
}
function addtosuggestionsanswers(result1, labelsUL, entityID) {
var add = '';
//if (result.data_type=='wikibase-item')

    add = '<span class="wikibase-toolbarbutton wikibase-toolbar-item wikibase-toolbar-button wikibase-toolbar-button-add add_button"><a href=\"#\"><span class="wb-icon"/></a></span>' + '<span id="add" class="value_input" style="display:none"><input type = "text" value = "" />&nbsp;' + '<a href=\"#\">Accept    </a>' + '<a href=\"#\">Reject</a></span>';
console.log(result1.object[0].object);
console.log(result1.property);
    console.log(result1.object);
var $insertElem = $('<tr><td> ' +
        '<label><a href="https://www.wikidata.org/wiki/Property:'+ result1.property + '">' + 
        result1.property + '</a></td><td>' + result1.question + '</td><td>' + '<a href="'+ result1.object[0].object + '">' + 
        result1.text + '</a></td><td>' + ' '+ 
        '</label></td><td>' + add +'</td></tr>');
labelsUL.append($insertElem);

$insertElem.find('.add_button a').on('click', function(e) {
    e.stopPropagation();
    e.preventDefault(); 
    $insertElem.find('#add').slideToggle("fast");
    $insertElem.find('.add_button a').hide();
    $insertElem.find('.input').focus();
    $insertElem.find(':text').val(result1.text);
    //$insertElem.find('.input').prop("","Hello");
});

$(document).click(function(e) {
        
        e.stopPropagation();
        $insertElem.find('.add_button a').show();
        $insertElem.find("#add").hide();
        //$insertElem.find(':text').val("Hello");
});

$insertElem.find("#add").click(function(e) {
    //$insertElem.find(':text').val("Hello");
  e.stopPropagation();
});

$insertElem.find('#add a').on('click', function(e) {
//$insertElem.find(':text').val("Hello");
e.stopPropagation();
e.preventDefault();



 
    var selection = $(this).prev('input').data('entityselector').selectedEntity();
    console.log("Hello");
    console.log(selection.id);
    
    //console.log(selection.id);
    var snak = JSON.stringify({ "entity-type": 'item', "numeric-id": selection.id.substring(1) });
    addanswer(entityID, result1, snak);
});
}


function addstatement(qid, pid, snak) {
var api = new mw.Api();
api.get( { action: 'query', meta: 'tokens'}).then(
    function(aw) {
        token = aw.query.tokens.csrftoken;
        api.post( { 
            action: 'wbcreateclaim',
            entity: qid,
            property: pid,
            snaktype: 'value',
            value: snak,
            summary : "[Edited with Recoin] (Wikidata:Recoin)",
            token: token
            }).then(
                   function(aw){
                           console.log(aw);
                           if(aw.success == 1)
                             location.reload();
                        else
                            alert("Request failed. Please Check again.");
                   });       
            });
}	
function addtosuggestions(result, labelsUL, entityID) {
var add = '';
if (result.data_type=='wikibase-item')
{
    add = '<span class="wikibase-toolbarbutton wikibase-toolbar-item wikibase-toolbar-button wikibase-toolbar-button-add add_button"><a href=\"#\"><span class="wb-icon"/></a></span><span id="add" class="value_input" style="display:none"><input/>&nbsp;' + '<a href=\"#\">Publish</a></span>';
}

var $insertElem = $('<tr><td> ' +
        '<label><a href="https://www.wikidata.org/wiki/Property:'+ result.property + '">' + 
        result.property + '</a></td><td>' + result.label + '</td><td>' + result.base_frequency + ' '+ 
        '</label></td><td>' + add +'</td></tr>');
labelsUL.append($insertElem);

$insertElem.find('.add_button a').on('click', function(e) {
    e.stopPropagation();
    e.preventDefault(); 
    $insertElem.find('#add').slideToggle("fast");
    $insertElem.find('.add_button a').hide();
    $insertElem.find('.input').focus();
});

$(document).click(function(e) {
        // e.stopPropagation();
        $insertElem.find('.add_button a').show();
        $insertElem.find("#add").hide();
});

$insertElem.find("#add").click(function(e) {
  e.stopPropagation();
});

$insertElem.find('#add a').on('click', function(e) {
e.stopPropagation();
e.preventDefault();

if (result.data_type=='wikibase-item')
{
    var selection = $(this).prev('input').data('entityselector').selectedEntity();
    console.log("Hello");
    console.log(selection.id);
    var snak = JSON.stringify({ "entity-type": 'item', "numeric-id": selection.id.substring(1) });
    addstatement(entityID, result.property, snak);
}
});
}
( function( mw, $ ) {

'use strict';

console.log('recoin-plugin loaded');
/**
 * Check if we're viewing an item
 */
var entityID = mw.config.get( 'wbEntityId' );

var lang = mw.config.get( 'wgUserLanguage' );
var pageid = "48139757";
var infoText ='';
var title = "Most relevant properties which are absent";

//var ids = $('.wikibase-statementgrouplistview').append();
//console.log(ids);
if ( !entityID ) 
{
    return;
}

/**
 * holds the DOM input element for the label
 */
var labelsParent;

function init() 
{
    
    // Element into which to add the missing attributes
    //labelsParent = $('#wb-item-' + entityID + ' div.wikibase-entitytermsview-heading');
    labelsParent = $('#wb-item-' + entityID + ' div.wikibase-statementgrouplistview');
   
   
   
    if (labelsParent.length < 1) 
    {
        return;
    }	
    

    $.getJSON('https://qanswer-svc3.univ-st-etienne.fr/facts/get?qid=Q24034587&format=json',
        function( result1 ){
        for (var i=0; i< result1.length; i++) 
            {
                //console.log(result1[i].property);
                tables(result1[i],labelsParent,entityID);
                //tables2(result1[i]);
                //addtosuggestionsanswers(result1[i], labelsUL, entityID);
                setTimeout(loadentityselector, 100);
                
            }
           // labelsDOM.append(labelsUL);
            //labelsParent.append(labelsDOM);
        
        }
        
    

    );
    

}
$( function () {
    // init();
    mw.hook( 'wikipage.content' ).add( init );
});

} ( mediaWiki, jQuery) );
