/**
 * @author russo and dariel
 */
YUI().use('aquinama-datacontroller','aquinama-revolretrieve','aquinama-literal', 'aquinama-search', 'aquinama-list','aquinama-searchlist','transition', function(Y){				
			


	var App = {};

	
	//Variables de configuration

	App.tree = appTree;

	App.model = App.tree;

	
	

	// Manejadores de eventos
	App.Search = function(e){
		Y.one('#yui3-aquinama-news').addClass('yui3-aquinama-hidden');
		Y.one('#yui3-aquinama-list').removeClass('yui3-aquinama-hidden');
		App.list.changeMoreTex('Ver mas resultados');
		App.list.showLoad();
		Y.log(e.filter);
		App.datacontroller.getData(e.filter);
	};


	App.Error = function(e){
		Y.log('Escuche un error');
		Y.log(e.data.error);

		if(e.data.error === 'No fueron encontrados mas resultados'){
			App.list.changeMoreTex('No mas resultados para '+App.filter.get('query')+' '+App.list.getActiveTags() +' en ' + App.search.get('aselect'));
			App.list.hideLoad();



		}
	};
	
	App.categoryRetrieve = function(e){

		App.list.set('emodellist', e.data);
		App.filter.set('source', App.list.source());

		//aki agarro al tipo y le creo sus filtros   
		
		var tags = [];

		var obj = App.literal.getAttr(App.search.get('aselect'));

		App.filter.set('afilter',{});


		tags = App.literal.walkToRoot(obj,tags,'tags');


		App.list.set('tags',tags);

		//App.filter.sendRequest('led nuevo');
		//App.filter.sendRequest('nuevo');
	
	};


	App.tagsHandle = function(e){

		//active filter update
		App.filter.afilterPopulate(e.data);


		Y.log(App.filter.get('afilter'));

		//mando un request con el valor de lo que halla en el campo
		App.filter.sendRequest(App.filter.get('value'));


		
		/*var temp = e.data.split(',');

		App.filter.get('query');
		temp.push(App.filter.get('query'));

		//App.filter.set('resultFilters',customFilter);
		//App.filter.set('resultHighlighter',customHighlighter);


		App.filter.sendRequest(temp);*/
		//App.filter.sendRequest('new nuevo');
	};


	App.moreDataControllerHandle = function(e){

		App.list.set('emodellist', e.data);
		App.filter.set('source', App.list.source());
		App.filter.sendRequest(App.filter.get('query'));
		
	};


	App.Filter = function(e){
		App.list.set('evisiblelist', e.results);
	};

	App.Sort = function(e){
		App.filter.set('source', App.list.source());
	};

	App.InterestMe = function(e){
		App.datacontroller.addInterest(e.model);
		Y.log(App.datacontroller.get('interest'));
	}

	App.articleData = function(e){

		App.datacontroller.getData(e.data);
	}



	App.moreListHandle = function(e){

		App.datacontroller.more();

	}




	//Init diferent component
	App.search = new Y.AquiNaMa.Search({
		boundingBox: '#yui3-aquinama-search',
		acategorys: App.tree
	});
	App.search.render();


	//Modulos de datos
	App.literal = new Y.AquiNaMa.Literal({
		model: App.model
	});

	App.revolRetrieve = new Y.AquiNaMa.RevolRetrieve({
		model: App.literal
	});

	App.datacontroller = new Y.AquiNaMa.DataController({
		retrieve: {RevolRetrieve:App.revolRetrieve}
	});



	//modulo list
	App.list = new Y.AquiNaMa.List({
		boundingBox: '#yui3-aquinama-list'
	});

	App.list.render('#yui3-aquinama-left');




		// Simple example of a case-insensitive phrase matching custom
	// filter.
	function customFilter(query, results){
		Y.log('my custom filter');

		var temps;

		//Hacer un subword match con la query que venga
		temps = Y.AutoCompleteFilters.subWordMatch(query,results); 



		//Hacer para cada active filter un orFilter
		Y.each(App.filter.get('afilter'),function(i){
			if(i){
				temps = orFilter(i, temps);
			}
		});

		return temps;
	}



	function orFilter(query, results) {
	  Y.log('my or filter');

	  var temp,inside,hello;


	  temp =  Y.Array.filter(results, function (result) {
	  	//inside = result.text.toLowerCase().indexOf(query[0]);
	  	inside = false;
		  if(Y.Lang.isArray(query)){
			  		  	for (var i = 0 ; i < query.length ; i++){
		  		hello = result.text.toLowerCase().indexOf(query[i]);
		  		if(hello !== -1){
		  			inside = true;
		  			break;
		  		} 
		  	}

		  	return inside;
		  }else{
    		return result.text.toLowerCase().indexOf(query) !== -1;
	
		  }


	   	//return inside !== -1;
	  });

	  return temp;
	}

	function customHighlighter(query, results) {
		var temp,inside,myquery;
		Y.log('customHighlighter');

		//query = ['nuevo','new'];
		//la query va a ser la concatenacion de los active filters + la query que viene
		myquery = App.filter.concatAll(query);

  		temp =  Y.Array.map(results, function (result) {
    		inside =  Y.Highlight.all(result.text, myquery);
    		return inside;
 		 });

 		return temp; 
}


	//modulo de filtar
	App.filter = new Y.AquiNaMa.Filter({
			    inputNode: App.search.get('contentBox').one('.yui3-aquinama-search-filter'),
			    minQueryLength: 0,
			    queryDelay: 300,
			    resultTextLocator: 'tags',
			    //resultHighlighter: 'subWordMatch',
			    resultHighlighter : customHighlighter,
			  	//resultFilters: 'subWordMatch',
			  	resultFilters : customFilter

	});
	App.filter.set('source', App.list.source());

	Y.log('El filter');
	Y.log(App.search);

	// Listener 
	Y.on('aquinama-search:search', App.Search);

	App.filter.on('results', App.Filter);	
	
	Y.on('aquinama-list:sort', App.Sort);	

	Y.on('aquinama-list:tags', App.tagsHandle);
	
	Y.on('aquinama-datacontroller:categoryRetrieve', App.categoryRetrieve);

	Y.on('aquinama-datacontroller:more', App.moreDataControllerHandle);

	Y.on('aquinama-datacontroller:error', App.Error);  
	
	Y.on('aquinama-item:interest', App.InterestMe); 
	
	Y.on('aquinama-articlemodel:articleData', App.articleData); 

	Y.on('aquinama-list:more', App.moreListHandle); 

	Y.on('aquinama-search:clear', function(e){
		App.list.get('boundingBox').addClass('yui3-aquinama-hidden');
		Y.one('#yui3-aquinama-news').removeClass('yui3-aquinama-hidden');
	});







	Y.one('.yui3-aquinama-interest').on('click', function(e){
		Y.one('#yui3-aquinama-news').addClass('yui3-aquinama-hidden');
		Y.one('#yui3-aquinama-list').removeClass('yui3-aquinama-hidden');
		App.list.showLoad();
		App.list.set('emodellist', App.datacontroller.get('interest'));
		App.filter.set('source', App.list.source());
	});


	Y.one('.yui3-aquinama-laster').on('click', function(e){
		Y.one('#yui3-aquinama-news').addClass('yui3-aquinama-hidden');
		Y.one('#yui3-aquinama-list').removeClass('yui3-aquinama-hidden');
		App.list.showLoad();
		App.list.set('emodellist', App.datacontroller.get('latestSearch').getSearch(0));
		App.filter.set('source', App.list.source());

	});
			    
	
	Y.log(App.datacontroller.get('interest'));





});
