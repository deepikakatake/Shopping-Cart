
var app=angular.module('bagitApp',['ngRoute','angularModalService']);

app.config(function($routeProvider,$locationProvider){
	$routeProvider
	.when('/home',{
		templateUrl:'partials/Products Panel.html',
		controller:'productsController'
	})
	.when('/cart',{
		templateUrl:'partials/Cart.html',
		controller:'cartController'
	})
	.otherwise({
		redirectTo:'/home'
	});
	$locationProvider.html5Mode({enabled:true,requireBase:false});

});

app.factory('cartService',function($rootScope){
	return {
		cart:[],
		totalItems:0,
		totalPrice:0,
		addItem:function(item,quantity,index){
			$rootScope.state.opts[index]=true
			this.cart.push({item,quantity:parseInt(quantity)});
			this.totalItems += parseInt(quantity); 
			this.totalPrice += parseInt(quantity) * item.price;
			$rootScope.$broadcast('cartChanged');

		},
		removeItem:function(itemId,index){
			//console.log(itemId)
			var removedItem=null;
			this.cart=this.cart.filter(item =>{
				if(item.item.id==itemId)
					removedItem = item;
				else
					return item;
			});
			this.totalItems -= parseInt(removedItem.quantity); 
			this.totalPrice -= parseInt(removedItem.quantity) * removedItem.item.price;		
			$rootScope.state.opts[index]=false;
			$rootScope.$broadcast('cartChanged');
		}

	};
});

app.factory('ProductsService', function($http,$q,$timeout){
	return {
		getList:function(){
			var d=$q.defer();

			$timeout(function(){
				$http.get("products.json").success(function(data){
					d.resolve(data);
				}).error(function(err){
					d.reject(err);
				})
			});

			return d.promise;
		}
	};
})

function headerController($rootScope,$scope,cartService){
	$rootScope.state={opts:[],selectedQuan:[]};
	$rootScope.$on('cartChanged',function(){
		$scope.fullCart = {totalItems: cartService.totalItems ,totalPrice:cartService.totalPrice};
	});
	
}

function productsController($rootScope,$scope,cartService,ProductsService,ModalService){
	$scope.show = function(index) {
	 	$rootScope.modalItemIndex = index;
        ModalService.showModal({
            templateUrl: 'modal.html',
            controller: 'ModalController',
            backdrop: 'static'
        }).then(function(modal) {
        	foo();
            modal.element.modal();
            modal.close.then(function(result) {
            });
            
        });
    };
	ProductsService.getList().then(function(data){
		$rootScope.products=data;
	},function(err){
		alert("data could not be loaded...");
	}).finally(function(){
		$scope.loading=false;
	});

	$scope.addToCart=function(item,index){
		if(!$rootScope.state.selectedQuan[index] || $rootScope.state.selectedQuan[index]==0){
			return ;
		}
		console.log($scope)
		cartService.addItem(item,$rootScope.state.selectedQuan[index],index);	
	}

	$scope.removeFromCart=function(itemId,index){
		cartService.removeItem(itemId,index);
	}
}
app.controller('ModalController', function($scope,$rootScope, close,cartService) {

  	
	$scope.close = function(result) {
		close(result, 500); // close, but give 500ms for bootstrap to animate
	};
	$scope.addToCart=function(item,index){
		if(!$rootScope.state.selectedQuan[index] || $rootScope.state.selectedQuan[index]==0){
			return ;
		}
		cartService.addItem(item,$rootScope.state.selectedQuan[index],index);	
	}

	$scope.removeFromCart=function(itemId,index){
		cartService.removeItem(itemId,index);
	}

});

app.controller('productsController',['$rootScope','$scope','cartService','ProductsService','ModalService',productsController])
app.controller('headerController',['$rootScope','$scope','cartService',headerController])

// this function facilitates the zoom service on the image.
// TODO : Only one image zoomed and only for once. Later no image is zoomed
function foo(){
    	console.log(" inside foo");
    	

       // Create variables (in this scope) to hold the API and image size
    var jcrop_api=null,
        boundx,
        boundy,

        // Grab some information about the preview pane
        $preview = $('#preview-pane'),
        $pcnt = $('#preview-pane .preview-container'),
        $pimg = $('#preview-pane .preview-container img'),

        xsize = $pcnt.width(),
        ysize = $pcnt.height();
        console.log(jcrop_api)
       $('#target').Jcrop({
			trackDocument: true, 
			onChange: updatePreview,
			onSelect: updatePreview,
			aspectRatio: xsize / ysize,
			boxWidth: 500, boxHeight: 500
	    },function(){
	      // Use the API to get the real image size
	      var bounds = this.getBounds();
	      boundx = bounds[0];
	      boundy = bounds[1];
	      // Store the API in the jcrop_api variable
	      jcrop_api = this;
	      console.log(jcrop_api);
	      // Move the preview into the jcrop container for css positioning
	      console.log(jcrop_api.ui.holder)
	      $preview.appendTo(jcrop_api.ui.holder);
	    });

	function updatePreview(c)
	{
      if (parseInt(c.w) > 0)
      {
        var rx = xsize / c.w;
        var ry = ysize / c.h;

        $pimg.css({
          width: Math.round(rx * boundx) + 'px',
          height: Math.round(ry * boundy) + 'px',
          marginLeft: '-' + Math.round(rx * c.x) + 'px',
          marginTop: '-' + Math.round(ry * c.y) + 'px'
        });
      }
    };

  }