angular.module("bookStore",["ui.router"])
.config(["$stateProvider", "$urlRouterProvider",function($stateProvider, $urlRouterProvider)
{
	$urlRouterProvider.otherwise("/categories");
	$stateProvider
		.state("home",
		{
			url: '/categories',
			templateUrl: 'templates/showCats.html',
        	controller: "categoryCTRL"
			
		})
		.state("books",
	    {
			url: '/categories/{bookcat}',
            templateUrl: 'templates/showBooks.html',
            controller: "bookCTRL"
		})
		.state("books.product",
		{
			url: '/{prodnum}',
			templateUrl: 'templates/showDetails.html',
			controller: "detailsCTRL"
		});
	   }])

.factory('fetchData',function($http)
 {
	return{
		getData: function() 
		{
			return $http.get("data.json");
		}
	}
 })

.controller("categoryCTRL",['$scope', 'fetchData', function($scope, fetchData)
{
		fetchData.getData()
		.then(
		 function(response)
		 {
			$scope.categoryList=response.data.categories;
		 },
		 function(err)
		 {
		 	console.log("Error:" + err);
		 	//Graceful error handling!
		 });
	console.log("cats");
}])
							

	
.controller("bookCTRL",['$scope', '$stateParams', 'fetchData', function($scope,$stateParams, fetchData)
{
	
	var leftcol=document.querySelector("#sliceleftsmall"); //Just in case there's a small div.
	if (leftcol!=null)
	{
		leftcol.setAttribute("id", "sliceleftbig");
	}
	$scope.bookcat=$stateParams.bookcat;
	var bookListMain;
	fetchData.getData()
	.then(
		 function(response)
		 {
			 bookListMain=response.data.books;
			 console.log(bookListMain);
			 $scope.bookList = [];
			 for (i=0;i<bookListMain.length;i++)
			 {
				 if (bookListMain[i].cat_id==$scope.bookcat)
				 {
					$scope.bookList.push(bookListMain[i]);
				 }
			 }
		 },
		 function(err)
		 {
		 	console.log("Error in getting books:" + err);
		 	//Graceful error handling!
		 });
}])

.controller("detailsCTRL", function($scope, $stateParams, fetchData)
{
	fetchData.getData()
	.then(
		 function(response)
		 {

			 bookListMain=response.data.books;
			 $scope.bookList = [];
			 for (i=0;i<bookListMain.length;i++)
			 {
				 if (bookListMain[i]._id==$stateParams.prodnum) //Find book.
				 {
					$scope.theBook=(bookListMain[i]);
				 }
			 }

		var leftcol=document.querySelector("#sliceleftbig");
		leftcol.setAttribute("id", "sliceleftsmall");
		$scope.stars="";
		for (i=0;i<5;i++)
		{
			if (i<$scope.theBook.rating)
			{
				$scope.stars+="*";
			}
		}
			 
	},
	 function(err)
	 {
		console.log("Error in getting books:" + err);
		//Graceful error handling!
	 });
	
});