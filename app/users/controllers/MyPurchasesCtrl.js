angular
.module("TheGiveawayBoxApp")
.controller("MyPurchasesCtrl", 
function(
    $scope, 
    $routeParams, 
    ListingsFactory
) {

        $scope.myPurchases = ListingsFactory.listings.filter(l=> {
            return l.buyer === $routeParams.userId
        })

    })
    