/*********************************************************************************************
* This gadget completes the properties of the item.                                          *
*                                                                                            *                                                           
*                                                                                            *
**********************************************************************************************/

(function(mw, $, wb) {
    "use strict";

    if (mw.config.get('wgNamespaceNumber') !== 0 || !mw.config.exists('wbEntityId')) {
        return;
    }

    var lang = mw.config.get('wgUserLanguage');
    var messages, entityid = mw.config.get('wbEntityId'), api = new mw.Api();

    messages = (function () {
        var translations = {
            de: {
                'title': 'Anweisungen aktualisieren',
                'more': 'mehr',
                'inverse': 'invers',
                'show-inverse': 'geholte Anweisungen anzeigen',
                'no-result': 'kein Ergebnis',
                'loading': 'laden...'
            },
            en: {
                'title': 'Update Statements',
                'more': 'more',
                'inverse': 'inverse',
                'show-inverse': 'show fetched statements',
                'no-result': 'no result',
                'loading': 'loading...'
            },
            fr: {
                'title': 'Mettre à jour les relevés',
                'more': 'plus',
                'inverse': 'inverse',
                'show-inverse': 'afficher les déclarations récupérées',
                'no-result': 'pas de résultats',
                'loading': 'chargement...'
           },
           'zh-hans': {
                'title': '更新声明',
                'more': '更多',
                'inverse': '反向',
                'show-inverse': '显示获取的语句',
                'no-result': '无结果',
                'loading': '加载中...'
            },
            es:{
                'title': 'Actualizar declaraciones',
                'more': 'más',
                'inverse': 'inverso',
                'show-inverse': 'mostrar declaraciones recuperadas',
                'no-result': 'sin resultados',
                'loading': 'cargando...'

            },           
        },
        chain = mw.language.getFallbackLanguageChain(),
        len = chain.length,
        ret = {},
        i = len - 1;
        while (i >= 0) {
            if (translations.hasOwnProperty(chain[i])) {
                $.extend(ret, translations[chain[i]]);
            }
            i = i - 1;
        }
        return ret;
    }());
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
		
	var newitem = {};
    $.ajax({
        url: "https://qanswer-svc3.univ-st-etienne.fr/fact/get?id=EMPTY&category=EMPTY&property=EMPTY",
        async: false,
        dataType: 'json',
        success: function(data) {
            newitem = data.wikidataLink;
        }
    });
    
    var html = '\
        <h2 class="wb-section-heading section-heading wikibase-statements" dir="auto"><span id="inverseclaims" class="mw-headline"></span></h2>\
        <div class="wikibase-statementgrouplistview" id="inversesection" > \
             <div class="wikibase-listview"></div> \
             <div class="wikibase-showinverse" style="padding:10px;overflow:hidden;"></div> \
             <div class="wikibase-addtoolbar wikibase-toolbar-item wikibase-toolbar wikibase-addtoolbar-container wikibase-toolbar-container"><span class="wikibase-toolbarbutton wikibase-toolbar-item wikibase-toolbar-button wikibase-toolbar-button-add"><a href="'+ newitem +'" title="Find a new item"><span class="wb-icon"></span>New Item</a></span></div>\
        </div>';

        function addqualifier(data){
            
                
                var api = new mw.Api();
                var token = mw.user.tokens.values.csrfToken;
                console.log(token);
                console.log(data.claim.id);
                

        return   api.post({

            action: 'wbsetqualifier',
            claim: data.claim.id,
            value: "hello",
            snaktype: 'value',
            token: token,
            summary: "WIKIDATA_API_COMMENT"
            })
            
        }

        function createclaim(qid, pid,snak,sourceSnaks,snaksorder){
            
            console.log(snak);
            console.log(qid);
            console.log(pid);
            
            var api = new mw.Api();
            api.get( { action: 'query', meta: 'tokens'}).then(
                function(aw) {
                    var token = aw.query.tokens.csrftoken;
                 return  api.post( { 
                        action: 'wbcreateclaim',
                        entity: qid,
                        property: pid,
                        snaktype: 'value',
                        value: snak,
                        summary : "[Edited with Recoin] (Wikidata:Recoin)",
                        token: token
                        }).then(
                        function(data){
                            addqualifier(data);
							console.log(sourceSnaks);
                            var api = new mw.Api();
                            var token = mw.user.tokens.values.csrfToken;
                            console.log(token);
                            console.log(data.claim.id);
                            console.log(snaksorder);

                    return   api.post({

						action: 'wbsetreference',
						statement: data.claim.id,
						snaks: JSON.stringify(sourceSnaks),
                        snaksorder: JSON.stringify(snaksorder),
                        token: token,
						summary: "WIKIDATA_API_COMMENT"
						})
						}).then(
                               function(data2){
                                       console.log(data2);
                                       if(data2.success == 1)
                                         location.reload();
                                    //else
                                      //  alert("Request failed. Please Check again.");
                               });       
                        });
            }
    function loaditems() {
        $('span#inverseclaims').text(messages.title);
        $('#inversesection').find('.wikibase-showinverse').html(messages.loading);
        $.getJSON('https://qanswer-svc3.univ-st-etienne.fr/facts/get?qid=Q24034587&format=json',
        function( result1 ){
        for (var i=0; i< result1.length; i++){ 
                    var prop = result1[i].property;
                    var string = result1[i].text;
                    //console.log(prop);
        	        var statementgroup = '\
	                        <div id="' + result1[i].property + '" class="wikibase-statementgroupview listview-item" style = "border:5px solid #8F00FF;"> \
	                            <div class="wikibase-statementgroupview-property"> \
	                                <div class="wikibase-statementgroupview-property-label" dir="auto"> \
                                    <a href="https://www.wikidata.org/wiki/Property:' + result1[i].property + '">' + result1[i].question + '</a>\
	                                </div> \
	                            </div> \
	                            <div class="wikibase-statementlistview"> \
	                                <div class="wikibase-statementlistview-listview"> \
	                                </div> \
	                            </div> \
	                        </div>';
					$('#inversesection').find('.wikibase-listview').parent().append(statementgroup);
					//stid = pid;
                
                var statement = '<div class="wikibase-statementview wb-normal listview-item wikibase-toolbar-item"> \
					<div class="wikibase-statementview-rankselector"><div class="wikibase-rankselector ui-state-disabled"> \
						<span class="ui-icon ui-icon-rankselector wikibase-rankselector-' + 'Normal Rank' + '"></span> \
					</div></div>  \
                    <div class="wikibase-statementview-mainsnak-container"> \
                        <div class="wikibase-statementview-mainsnak" dir="auto"> \
                            <div class="wikibase-snakview"> \
                                <div class="wikibase-snakview-property-container"> \
                                    <div class="wikibase-snakview-property" dir="auto"> \
                                    </div> \
                                </div> \
                                <div class="wikibase-snakview-value-container" dir="auto"> \
                                    <div class="wikibase-snakview-value wikibase-snakview-variation-valuesnak"> \
                                        <a href="' + result1[i].object[0].object + '" >' + result1[i].text + '</a>\
                                    </div> \
                                </div> \
                            </div> \
                        </div> \
                    </div> \
                    <span class="wikibase-toolbar-container wikibase-edittoolbar-container">\
                    <span class="wikibase-toolbar-item wikibase-toolbar wikibase-toolbar-container"><span class="wikibase-toolbar-item wikibase-toolbar wikibase-toolbar-container"><span class="wikibase-toolbarbutton wikibase-toolbar-item wikibase-toolbar-button wikibase-toolbar-button-add"><a class = "f2w-button f2w-property f2w-approve" href="#" title="" text-id = "' + result1[i].text + '" data-id = "'+ result1[i].property +'" url-id = "' + result1[i].object[0].object + '"><span class="wb-icon"></span>approve </a></span></span></span>\
                    <span class="wikibase-toolbar-item wikibase-toolbar wikibase-toolbar-container"><span class="wikibase-toolbar-item wikibase-toolbar wikibase-toolbar-container"><span class="wikibase-toolbarbutton wikibase-toolbar-item wikibase-toolbar-button wikibase-toolbar-button-remove"><a href="f2w-button f2w-property f2w-reject" href = "#" title=""><span class="wb-icon"></span>reject</a></span></span></span>\
                    </span> \
                    <div class = wikibase-statementview-references-container>\
                        <div class = wikibase-statementview-references-heading>\
                            <a class="ui-toggler ui-toggler-toggle ui-state-default">\
                            <span class="ui-toggler-icon ui-icon ui-icon-triangle-1-s ui-toggler-icon3dtrans"></span>\
                            <span class="ui-toggler-label">1 reference</span>\
                            </a>\
                            <div class="wb-tr-app"><!----></div>\
                            </div>\
                            <div class="wikibase-statementview-references wikibase-initially-collapsed" style="display: block;"><div class="wikibase-listview2"><div class="wikibase-referenceview wikibase-referenceview-d5847b9b6032aa8b13dae3c2dfd9ed5d114d21b3">\
<div class="wikibase-referenceview-heading"></div>\
<div class="wikibase-referenceview-listview"><div class="wikibase-snaklistview">\
<div class="wikibase-snaklistview-listview"><div class="wikibase-snakview wikibase-snakview-5a343e7e758a4282a01316d3e959b6e653b767fc">\
<div class="wikibase-snakview-property-container">\
<div class="wikibase-snakview-property" dir="auto"><a title="Property:P143" href="/wiki/Property:P143">imported from Wikimedia project</a></div>\
</div>\
<div class="wikibase-snakview-value-container" dir="auto">\
<div class="wikibase-snakview-typeselector"></div>\
<div class="wikibase-snakview-body">\
<div class="wikibase-snakview-value wikibase-snakview-variation-valuesnak"><a title="Q11920" href="/wiki/Q11920">' + result1[i].wikipediaLink + '</a></div>\
<div class="wikibase-snakview-indicators"></div>\
</div>\
</div>\
</div></div>\
</div></div>\
</div></div><div class="wikibase-addtoolbar wikibase-toolbar-item wikibase-toolbar wikibase-addtoolbar-container wikibase-toolbar-container"><span class="wikibase-toolbarbutton wikibase-toolbar-item wikibase-toolbar-button wikibase-toolbar-button-add"><a href="#" title=""><span class="wb-icon"></span>add reference</a></span></div></div>\
                        </div>\
                    </div>';
                $('.f2w-approve').on('click',function(e){
                    e.preventDefault();
                    e.stopPropagation();
                    let arg1 = e.target.getAttribute('data-id');
                    let arg2 = e.target.getAttribute('text-id');
                    let arg3 = e.target.getAttribute('url-id');
                    //var url = 'https://www.wikidata.org/wiki/Q1760610';
                    var snak = JSON.stringify({ "entity-type": 'item', "numeric-id": arg3.substring(32) });
                    var snaksorder = ["P143"];
                    var sourceSnaks = {"P143": [
                        {
                            "snaktype": "value",
                            "property": "P143", // source of info
                            "datavalue": {
                                "value": {
                                    "entity-type": "item",
                                    "numeric-id": "52",
                                },
                                "type": "wikibase-entityid"
                            }
                        }
                    ]};
                    console.log(arg1);
                    console.log(arg2);
                    createclaim(entityid, arg1,snak,sourceSnaks,snaksorder);
                    setTimeout(loadentityselector, 100);
                })    
                $('.wikibase-statementgroupview').last().find('.wikibase-statementlistview-listview').append(statement);
            }

            $('#inversesection').find('.wikibase-showinverse').html('<a href="https://www.wikidata.org/w/index.php?title=Special:WhatLinksHere&target=' + entityid + '&namespace=0">' + messages.more + '</a>');
        });
    }
    function init() {
        $('.wikibase-entityview-main').append(html);
        $('#inversesection').find('.wikibase-showinverse').append(
            $( '<a>' )
            .attr( 'href', '#' )
            .attr( 'style', 'border:2px solid #8F00FF;padding:10px 80px;' )
            .text( messages['show-inverse'] )
            .click( function ( event ) {
                event.preventDefault();
                loaditems();
            })
        );
    }

    $(init);

}(mediaWiki, jQuery, wikibase));
