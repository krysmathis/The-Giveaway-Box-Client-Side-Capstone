angular
.module("TheGiveawayBoxApp")
.controller("PurchasedListingsCtrl", 
function(
    $scope, 
    $timeout,
    $routeParams, 
    ListingsFactory,
    MasterDataFactory
) {

        $scope.user = {
            invitegroups: [],
            joinGroups: [],
            listings: []
        };
        
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
                ListingsFactory.closeListing(e.target.id).then(r=>{
                    //ListingsFactory.getListings(MasterDataFactory.database).then(r=> $scope.updatePurchasedListings())
                    $scope.updatePurchasedListings()
                })
        }


        //utility function for filtering
        $scope.greaterThan = function(prop, val){
        return function(item){
          return item[prop] > val;
        }
    }
    

    })
    