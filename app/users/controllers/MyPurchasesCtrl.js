angular
.module("TheGiveawayBoxApp")
.controller("MyPurchasesCtrl", 
function(
    $scope, 
    $routeParams, 
    ListingsFactory
) {

        $scope.myPurchases = ListingsFactory.listings.filter(l=> {
            console.log("purchased:", l)
            return l.buyer === $routeParams.userId
        })

    })
    