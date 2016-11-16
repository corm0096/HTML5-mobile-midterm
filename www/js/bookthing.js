angular.module("bookStore",['ionic'])
.run(function($ionicPlatform)
 {
  $ionicPlatform.ready(function()
   {
	  
//     Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
//     for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar)
	{
      StatusBar.styleDefault();
    }
	  
  });
})



.config(function($stateProvider, $urlRouterProvider)
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
		})
	.state('tab.1',
	   {
      url: '/categories/1',
		templateUrl: 'templates/showBooks.html',
            controller: "bookCTRL"
        })
	.state('tab.2',
		   {
      url: '/categories/2',
		 views: {
        'tab-cat2': {
         templateUrl: 'templates/showBooks.html',
            controller: "bookCTRL"
        }}
		
        })
	.state('tab.3',
		   {
      url: '/categories/3',
		templateUrl: 'templates/showBooks.html',
            controller: "bookCTRL"
        })
	.state('tab.4',
		   {
      url: '/categories/4',
		templateUrl: 'templates/showBooks.html',
            controller: "bookCTRL"
        });
   })

.factory('userReviews',['$rootScope',function($rootScope)
{
	return{
		init: function()
		{
			$rootScope.reviewList=JSON.parse(localStorage.getItem("midterm-userReviews"));
			if ($rootScope.reviewList==undefined)
			{
				$rootScope.reviewList=[]
			}
			return;
		},
		findReview: function(id)
		{
			if ($rootScope.reviewList.length!=0)
			{
				for (i=0;i<$rootScope.reviewList.length;i++)
				{
					if($rootScope.reviewList[i].prodcode==id)
					{return i;}
				}
		 	}
		 	$rootScope.reviewList.push({"prodcode":id,"value":0});
			return $rootScope.reviewList.length-1;
		},
		writeData: function()
		{
			localStorage.setItem("midterm-userReviews",JSON.stringify($rootScope.reviewList));
		}
	}
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

.controller("categoryCTRL",['$scope', 'fetchData', 'userReviews', function($scope, fetchData, userReviews)
{
		userReviews.init();
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

.controller("detailsCTRL", function($scope, $stateParams, fetchData, userReviews, $rootScope)
{
	
	fetchData.getData()
	.then(
		 function(response)
		 {
			 bookListMain=response.data.books;
			 for (i=0;i<bookListMain.length;i++)
			 {
				 if (bookListMain[i]._id==$stateParams.prodnum) //Find book.
				 {
					$scope.theBook=(bookListMain[i]);
				 }
			 }
			 
			 $scope.reviewIndex=userReviews.findReview($stateParams.prodnum);
			$scope.yourReview=$rootScope.reviewList[$scope.reviewIndex];	 
			 
			var leftcol=document.querySelector("#sliceleftbig");
			if (leftcol!=null)
			{
				leftcol.removeAttribute("id");
				leftcol.setAttribute("id", "sliceleftsmall");
			}
			 
			$scope.stars="";
			for (i=0;i<5;i++)
			{
				if (i<$scope.theBook.rating)
				{
					$scope.stars+="★";
				}
				else
				{
					$scope.stars+="☆";
				}
			}
			 
		},
		 function(err)
		 {
			console.log("Error in getting books:" + err);
			//Graceful error handling!
		 });

	$scope.pickStar=function(stars)
	{
		$scope.yourReview.value=stars;
		$rootScope.reviewList[$scope.reviewIndex].value=stars;
		userReviews.writeData();
		
	};
	
});