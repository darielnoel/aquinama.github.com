YUI.add("aquinama-searchmodel",function(B){B.namespace("AquiNaMa");var A=B.Base.create("aquinama-searchmodel",B.Model,[],{initializer:function(){var C=this;C._bind();},_bind:function(){var C=this;},sync:function(E,D,F){var C=this;},createSearchText:function(E){var D=this,C="",G="",F="";B.each(E,function(H){if(H.attr==="text"){G=H.value;}if(H.attr==="category"){F=H.value;}});if(G!==""){C=G+" en ";if(F!==""){C+=F+".";}else{C+="todo el sitio.";}}else{if(F!==""){C=F;}}return C;},toJSON:function(){var C=this,D=C.getAttrs();delete D.clientId;delete D.destroyed;delete D.initialized;if(this.idAttribute!=="id"){delete D.id;}D.retrieve=D.retrieve.name;return D;}},{ATTRS:{retrieve:{value:{}}}});B.AquiNaMa.SearchModel=A;},"@VERSION@",{skinnable:false,requires:["model"]});