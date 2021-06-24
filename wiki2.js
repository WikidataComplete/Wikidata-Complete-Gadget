/**
 * Recoin: Relative Completeness Indicator
 * 
 * Explanations module: Lists the most important missing attributes, which are used for computing the relative completeness indicator and adds a relative completeness indicator symbol to the page status indicators
 * 
 * Developers  : Vevake Balaraman (vevake.balaraman@gmail.com), Simon Razniewski (razniewski@inf.unibz.it), Albin Ahmeti (albin.ahmeti@gmail.com)
 * Inspired by : COOL-WD: COmpleteness toOL for WikiData (Fariz Darari)
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
function addtosuggestionsanswers(result1, labelsUL, entityID) {
var add = '';
//if (result.data_type=='wikibase-item')

	add = '<span class="wikibase-toolbarbutton wikibase-toolbar-item wikibase-toolbar-button wikibase-toolbar-button-add add_button"><a href=\"#\"><span class="wb-icon"/></a></span>' + '<span id = "add">' + '<a href=\"#\">Accept    </a>' + '<a href=\"#\">Reject</a></span>';
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



 
	var selection = $(this).prev('input').data('entityselector').selectedEntity();
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
	labelsParent = $('#wb-item-' + entityID + ' div.wikibase-entitytermsview-heading');
	if (labelsParent.length < 1) 
	{
		return;
	}	
	
	var labelsDOM = $('<div id="recoin-property" style="display:none;overflow:auto;max-height:400px"></div>');
	var labelsUL = $('<table id="props" frame="box" style="margin-left:30px"></table>');
	var tablehead = '<thead align="left"><tr bgcolor="#DCDCDC"><td>Property ID</td><td>Label</td><td>Relative</td><td>Add Claim</td></tr></thead>';
	labelsUL.append(tablehead);
	var labelsText = $('<div class="wikibase-entitytermsview-recoinproperty-toggler ui-toggler ui-toggler-toggle ui-state-default" id = "recoin-title" style="display:inline;"></div>');
	var translate_help = $('<span class="wikibase-entitytermsview-entitytermsforlanguagelistview-configure" id="translate"><a href="https://www.wikidata.org/wiki/Wikidata:Recoin/translation"> [Help with translations]</a></span>');
	var help = true;
	$.getJSON( 'https://www.wikidata.org/w/api.php?action=query&prop=extracts&titles=Wikidata:Recoin/translation&format=json', 
	   function ( result )
	   {
		   var desc = result.query.pages[pageid].extract;
		   desc = desc.replace(/<p>/g, "");
		   desc = desc.replace(/<\/p>/g, "");
		   desc = desc.split("\n");
		   for (var i=0; i< desc.length; i++)
		   {
			   var s = desc[i].split(";");
			   if (s[0]===lang && s.length>=7)
			   {
				infoText = s.slice(2,7).reverse();
				title = 'Recoin: ' +s[1];
				help = false;
				break;
			   }
		   }
		   var toggleSlider = $('<span class = "ui-toggler-icon ui-icon ui-icon-triangle-1-e" id = "status"></span>\
		<span class="ui-toggler-label">'+ title +'</span>');
		labelsText.append(toggleSlider);
		labelsParent.append(labelsText);
		   if (help==1)
		   {
			   labelsParent.append(translate_help);
		   }
	   });
	
	$.getJSON( 'https://tools.wmflabs.org/recoin/getmissingattributes.php?callback=?', 'subject=Q24034587' + '&lang=' + lang + '&n=20',
		   function ( result ) 
		   {
			for (var i=0; i< result.missing_properties.length; i++) 
			{
				addtosuggestions(result.missing_properties[i], labelsUL, entityID);
				setTimeout(loadentityselector, 100);
			}
			labelsDOM.append(labelsUL);
			labelsParent.append(labelsDOM);
		$("#recoin-title" ).click(function() {
		$( "#recoin-property" ).slideToggle();
		$("#status").toggleClass("ui-icon-triangle-1-e ui-icon-triangle-1-s ui-toggler-icon3dtrans");
		});
		
		var complete = result.completeness_level;
		var $link = $( '<a href="https://www.wikidata.org/wiki/Wikidata:Recoin">' ),
			$img = $( '<img>' ).css('margin-bottom',12+'px');
		
		if (infoText === '')
		{
			switch( complete ){
				case '5':
					infoText = 'This page provides very detailed information.';
				break;
				case '4':
					infoText = 'This page provides detailed information.';
				break;
				case '3':
					infoText = 'This page provides a fair amount of information.';
				break;
				case '2':
					infoText = 'This page provides basic information.';
				break;
				case '1':
					infoText = 'This page provides very basic information.';
				break;
			}
		}
		else
		{
			infoText = infoText[parseInt(complete)-1];
		}
		$img.attr( 'src', 'https://tools.wmflabs.org/recoin/progressbar/' + complete + '.png' );				
		$img.attr( 'title',  infoText);
		$img.attr( 'alt',  infoText);
		$link.append( $img ).prependTo( 'div.mw-indicators' )
	var labelsDOM1 = $('<div id="recoin2-property" style="display:none;overflow:auto;max-height:300px"></div>');
	var labelsUL1 = $('<table id="props1" frame="box" style="margin-left:30px"></table>');
	var tablehead1 = '<thead align="left"><tr bgcolor="#DCDCDC"><td>Property ID</td><td>Question</td><td>Answer</td><td>Accept/Reject</td></tr></thead>';
	labelsUL.append(tablehead1);
	//WikidataComplete
	$.getJSON('https://qanswer-svc3.univ-st-etienne.fr/facts/get?qid=Q24034587&format=json',
		function( result1 ){
		for (var i=0; i< result1.length; i++) 
			{
				//console.log(result1[i].property);
				addtosuggestionsanswers(result1[i], labelsUL, entityID);
				setTimeout(loadentityselector, 100);
				
			}
			labelsDOM.append(labelsUL);
			labelsParent.append(labelsDOM);
		}
		
	
	);
	});
			$.getJSON( 'https://www.wikidata.org/w/api.php?action=query&prop=extracts&titles=Wikidata:Recoin/translation&format=json', 
	   function ( result )
	   {
		   var desc = result.query.pages[pageid].extract;
		   desc = desc.replace(/<p>/g, "");
		   desc = desc.replace(/<\/p>/g, "");
		   desc = desc.split("\n");
		   for (var i=0; i< desc.length; i++)
		   {
			   var s = desc[i].split(";");
			   if (s[0]===lang && s.length>=7)
			   {
				infoText = s.slice(2,7).reverse();
				title = 'WikidataComplete: ' +s[1];
				help = false;
				break;
			   }
		   }
	   var toggleSlider = $('<span class = "ui-toggler-icon ui-icon ui-icon-triangle-1-e" id = "status"></span>\
		<span class="ui-toggler-label">'+ title +'</span>');
		labelsText.append(toggleSlider);
		labelsParent.append(labelsText);
		   if (help==1)
		   {
			   labelsParent.append(translate_help);
		   }
	   });
}

$( function () {
	// init();
	mw.hook( 'wikipage.content' ).add( init );
});

} ( mediaWiki, jQuery) );
