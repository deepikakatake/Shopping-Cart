
function cartController($rootScope,$scope,cartService){
	$scope.fullCart = {cart:cartService.cart,totalPrice:cartService.totalPrice,totalItems:cartService.totalItems};
	$rootScope.$on('cartChanged',function(){
		$scope.fullCart = {cart:cartService.cart,totalPrice:cartService.totalPrice,totalItems:cartService.totalItems};
	});
	console.log(cartService)
}

app.controller('cartController',['$rootScope','$scope','cartService',cartController]);