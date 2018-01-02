angular
.module("TheGiveawayBoxApp")
.controller("PurchasedListingsCtrl", 
function(
    $scope, 
    $timeout,
    $routeParams, 
    ListingsFactory
) {

        // function to control the 'new' label
        $scope.daysElapsed = (item) =>  moment().diff(moment(item.requestedDate), "days")
        
        $scope.purchasedListings = []
        
        $scope.updatePurchasedListings = () => {
            $scope.purchasedListings = ListingsFactory.listings.filter(l=> {
                return l.buyer === $routeParams.userId && l.requestedDate > 0 && l.purchaseCompletedOn === 0
            })
        }
        
        $scope.init = () => {
            $scope.updatePurchasedListings();
        }
        // calling for initial listings
        $scope.init()

        $scope.closeListing = (e) => {    
                const id = e.target.dataset.id
                ListingsFactory.closeListing(id).then(r=>{
                    $scope.updatePurchasedListings()
                })
        }


        //utility function for filtering
        //utility function for filtering
        $scope.greaterThan = function(prop, val){
        return function(item){
          return item[prop] > val;
        }
    }
    

    })
    