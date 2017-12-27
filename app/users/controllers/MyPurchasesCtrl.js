angular
.module("TheGiveawayBoxApp")
.controller("MyPurchasesCtrl", 
function(
    $scope, 
    $routeParams, 
    ListingsFactory
) {

        $scope.isNew = (item) => moment().diff(moment(item.purchaseCompletedOn), "days") < 6
        
        $scope.myPurchases = ListingsFactory.listings.filter(l=> {
            return l.buyer === $routeParams.userId && l.purchaseCompletedOn > 0
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
    