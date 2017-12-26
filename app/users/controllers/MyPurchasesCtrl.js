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

        $scope.deleteListing = (e) => {
            ListingsFactory.deleteListing(e.target.id).then(r=>{
                $scope.$apply(()=>{
                    $scope.myPurchases = ListingsFactory.listings.filter(l=> {
                        return l.buyer === $routeParams.userId
                    })
                })
            })
        }
    

    })
    