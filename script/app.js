/**
 * @author russo and dariel
 */
YUI().use('aquinama-datacontroller','aquinama-revolretrieve','aquinama-literal', 'aquinama-search', 'aquinama-list','aquinama-searchlist', 'aquinama-tools', function(Y){				
			


	var App = {};

	
	//Variables de configuration

	App.tree = appTree;

	App.model = App.tree;

	
	

	// Manejadores de eventos
	App.Search = function(e){
		Y.one('#yui3-aquinama-news').addClass('yui3-aquinama-hidden');
		Y.one('#yui3-aquinama-list').removeClass('yui3-aquinama-hidden');
		App.list.changeMoreTex('Ver mas resultados');
		App.list.clearList();
		App.list.showLoad();
		Y.log(e.filter);
		App.datacontroller.getData(e.filter);

		App.interest.deselect();
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

		App.list.set('atotal', App.datacontroller.get('search.total'));

		Y.log('esto es lo que ahi');
		Y.log(App.datacontroller.get('search.total'));

		App.list.set('emodellist', e.data);

		App.filter.set('source', App.list.source());


		//le pido a datacontroller que me de los tags de una categoria
		var tags = {};

		tags = App.datacontroller.tags(App.search.get('aselect'));


		//Le paso estos tags a la lista TODO: La lista no tiene porke tener estos tags
		//con el id le basta
		App.list.set('tags',tags);

		App.filter.set('tags',tags);

		//seteo los active filters 
		App.filter.set('afilter',{});

		



		Y.log(App.datacontroller.get('search.total'));

		

		//App.filter.sendRequest('led nuevo');
		//App.filter.sendRequest('nuevo');
	
	};


	App.tagsHandle = function(e){

		//active filter update
		App.filter.afilterPopulate(e.data);


		Y.log(App.filter.get('afilter'));

		//mando un request con el valor de lo que halla en el campo
		App.filter.sendRequest(App.filter.get('value'));

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

		App.interest.set('acount', App.datacontroller.get('interest').size());
		

		


	}

	App.NoInterestMe = function(e){
		App.datacontroller.notInterest(e.model);
		
		App.interest.set('acount', App.datacontroller.get('interest').size());
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
		retrieve: {RevolRetrieve:App.revolRetrieve},
		literal: App.literal
	});



	//modulo list
	App.list = new Y.AquiNaMa.List({
		boundingBox: '#yui3-aquinama-list'
	});

	App.list.render('#yui3-aquinama-left');

	App.interest = new Y.AquiNaMa.Interest({
		acount: App.datacontroller.get('interest').size(),
		boundingBox: Y.one('.yui3-aquinama-interest'),
		contentBox: Y.one('.yui3-aquinama-interest')
	});

	App.interest.render();


		//modulo de filtar
	App.filter = new Y.AquiNaMa.Filter({
			    inputNode: App.search.get('contentBox').one('.yui3-aquinama-search-filter'),
			    minQueryLength: 0,
			    queryDelay: 300,
			    resultTextLocator: 'tags',
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

	Y.on('aquinama-item:no-interest', App.NoInterestMe); 
	
	Y.on('aquinama-articlemodel:articleData', App.articleData); 

	Y.on('aquinama-list:more', App.moreListHandle); 

	Y.on('aquinama-search:clear', function(e){
		App.list.get('boundingBox').addClass('yui3-aquinama-hidden');
		Y.one('#yui3-aquinama-news').removeClass('yui3-aquinama-hidden');
		App.interest.deselect();
	});






	Y.one('.yui3-aquinama-interest').on('click', function(e){
		Y.one('#yui3-aquinama-news').addClass('yui3-aquinama-hidden');
		Y.one('#yui3-aquinama-list').removeClass('yui3-aquinama-hidden');
		App.list.showLoad();
		App.list.set('emodellist', App.datacontroller.get('interest'));
		App.filter.set('source', App.list.source());

		App.search.setCategory('Me Interesan');
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
