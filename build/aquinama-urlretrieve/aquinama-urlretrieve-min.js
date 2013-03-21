YUI.add("aquinama-urlretrieve",function(D){D.namespace("AquiNaMa");var C='select * from html where url="',Q="_categoryRetrieve",N="_articleRetrieve",H="name",R="model",B="urlBase",P="totalPages",M="actualPage",T="actualUrl",S="globalConfig",O="more",F="No mas resultados",G="globalConfig",E=D.Base.create("aquinama-urlretrieve",D.AquiNaMa.Retrieve,[],{initializer:function(X){var U=this,W=U.get("name"),V=U.get(R).getAttr(W).url[W];V=V.substring(0,V.length-1);U.set(B,V);U._urlBind();},_urlBind:function(){var U=this;U.after("_bind",function(){U.after("actualUrlChange",function(V){U.set("actualPage",1);U.set("totalArticle",0);},U);},U);},retrieveData:function(W){var U=this,b=W.query,a=W.eventPrefix,Z,V,Y={msg:"",code:null},X=W.repeat;Z=D.YQL(b,{allowCache:false,timeout:2000000,on:{success:function(c){V=U.get(R).getAttr(F,c);if(V){if(!U.againRetrieveData(X,W)){}}else{if(c.query.results){U.fire(a,{data:{result:c.query.results,filter:W.filter}});}else{if(!U.againRetrieveData(X,W)){Y.code=1;U.fire(F,{data:{error:Y}});}}}},failure:function(c){if(!U.againRetrieveData(X,W)){Y.code=0;U.fire(N,{data:{error:Y}});}}}});},getCategory:function(U,V){if(U){this.categoryRetrieve(U,V);}else{return false;}},categoryRetrieve:function(W,X){var U=this,V=U.get(H),a=retrieves[V].querys,Y=[C,W,a.categoryBase],Z;Y=Y.join("");if(test){D.later(U.get(G).test.responseTime,D,function(b){U.fire(Q,{data:{result:appTest[V].category.query.results,filter:X}});});}else{if(!U.get("more")){Z=[Y,a.categoryFirst];Y=Z.join("");}else{Z=[Y,a.categoryMore];Y=Z.join("");}U.retrieveData({query:Y,eventPrefix:Q,filter:X,repeat:{max:3,actual:0}});}},getArticle:function(V){var U=this;U.articleRetrieve(V);},articleRetrieve:function(X){var U=this,Y,W=U.get(H),V=X[0].value;if(test){D.later(U.get(G).test.responseTime,U,function(){U.fire(N,{data:{result:appTest[W].article.query.results,filter:X}});});}else{Y=[C,V,retrieves[W].querys.article];Y=Y.join("");U.retrieveData({query:Y,eventPrefix:N,filter:X,repeat:{max:3,actual:0}});}},buildUrl:function(Y){var U=this,X,W="",V=["url.",U.get(H)];V=V.join("");X=U.get(R).getAttr(Y);if(X){return U.get(R).walkToRoot(X,W,V);}else{}return false;},buildUrlbyFilter:function(X,a){var V=this,U,W="",Z=a.length,Y,b;for(Y=0;Y<Z;Y++){b=a[Y];U=V.get(R).getAttr("attr",b);if(U){if(V[U]){if(U!="category"){W+=V[b.attr](b.value);}}else{}}else{}}return W;},category:function(W,X){var U=this,V="";U.set(O,false);U.set(M,0);V=U.buildUrl(W);if(V){V+=U.get(S).url.category+U.buildUrlbyFilter(V,X);}U.set(T,V);U.getCategory(V,X);},min:function(U,V){return"";},max:function(U,V){return"";},count:function(V,U){this.set("count",V);return"";},article:function(V,U){this.getArticle(U);},more:function(W){var U=this,V=U.get(T),Y=U.get(P),Z=U.get(M),a="",X=U.get("actualFilter");if(V!==""){Y=5;if(Z<Y){Z++;a=U.nextUrl(Z,V,X);U.set(O,true);U.getCategory(a,X);}else{U.fire(F,{data:{error:{code:2,msg:""}}});}}U.set(M,Z);},defaultFilter:function(a){var V=this,X=V.buildUrl("1")+V.get(S).url.defaultSearch,U,W,Z=a.length,Y,b;for(Y=0;Y<Z;Y++){b=a[Y];U=V.get(R).getAttr("attr",b);if(U){if(V[U]){if(U!="category"){W=V[b.attr](b.value);if(W){X+=W;}else{return false;}}}else{}}else{}}V.set(T,X);V.getCategory(X,a);return X;}},{ATTRS:{actualPage:{value:0},name:{value:""},urlBase:{value:""},count:{value:100},actualUrl:{value:""},totalPages:{value:5},more:{value:false},url:{value:{}},date:{value:{"Septiembre":"September","Octubre":"October","Noviembre":"November","Diciembre":"December","Enero":"January","Febrero":"February","Marzo":"March","Abril":"April","Mayo":"May","Junio":"June","Julio":"July","Agosto":"August"}},activeRequest:{value:[]},globalConfig:{value:{}}}});D.AquiNaMa.UrlRetrieve=E;var J=D.DataSchema.JSON,I=D.Lang,A=I.isFunction,K=I.isArray,L=D.DataSchema.Base;J._parseResults=function(Z,U,Y){var V=J.getPath,W=J.getLocationValue,a=V(Z.resultListLocator),X=a?(W(a,U)||U[Z.resultListLocator]):U;if(K(X)){if(K(Z.resultFields)){Y=J._getFieldValues.call(this,Z.resultFields,X,Y,Z);}else{Y.results=X;}}else{if(Z.resultListLocator){Y.results=[];Y.error=new Error("JSON results retrieval failure");}}return Y;};J._getFieldValues=function(f,b,Z,e){var h=[],m=f.length,l,k,U,o,Y,d,X,p,g=[],n=[],a=[],c,W;for(l=0;l<m;l++){U=f[l];o=U.key||U;Y=U.locator||o;d=J.getPath(Y);if(d){if(d.length===1){g.push({key:o,path:d[0]});}else{n.push({key:o,path:d,locator:Y});}}else{}X=(A(U.parser))?U.parser:D.Parsers[U.parser+""];if(X){a.push({key:o,parser:X});}}for(l=b.length-1;l>=0;--l){W={};c=b[l];if(c){for(k=n.length-1;k>=0;--k){d=n[k];p=J.getLocationValue(d.path,c);if(p===undefined){p=J.getLocationValue([d.locator],c);if(p!==undefined){g.push({key:d.key,path:d.locator});n.splice(l,1);continue;}}W[d.key]=L.parse.call(this,(J.getLocationValue(d.path,c)),d);}for(k=g.length-1;k>=0;--k){d=g[k];W[d.key]=L.parse.call(this,((c[d.path]===undefined)?c[k]:c[d.path]),d);}for(k=a.length-1;k>=0;--k){o=a[k].key;W[o]=a[k].parser.call(this,W[o]);if(W[o]===undefined){W[o]=null;}}if(e.hasOwnProperty("filterRecord")&&A(e.filterRecord)){var V=this;if(e.context){V=e.context;}W=e.filterRecord.call(V,W,e);}h[l]=W;}}Z.results=h;if(e.hasOwnProperty("container")){Z.container=e.container;}return Z;};D.DataSchema.JSON=J;},"@VERSION@",{skinnable:false,requires:["base","yql","model-list","aquinama-articlemodel","datatype-date","aquinama-retrieve","dataschema-json"]});