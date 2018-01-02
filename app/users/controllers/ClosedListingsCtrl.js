angular
.module("TheGiveawayBoxApp")
.controller("ClosedListingsCtrl", 
function(
    $scope, 
    $timeout,
    $routeParams, 
    ListingsFactory
) {

        $scope.user = {
            invitegroups: [],
            joinGroups: [],
            listings: []
        };

        $scope.isNew = (item) => moment().diff(moment(item.purchaseCompletedOn), "days") < 6
        
        $scope.closedListings = []
        
        $scope.updateClosedListings = () => {
            $scope.closedListings = ListingsFactory.listings.filter(l=> {
                return l.userId === $routeParams.userId && l.purchaseCompletedOn > 0
            })
        }
        
        $scope.init = () => {
            $scope.updateClosedListings();
        }
        // calling for initial listings
        $scope.init()

        $scope.closeListing = (e) => {    
            console.log($scope.closedListings)    
            // ListingsFactory.closeListing(e.target.id).then(r=>{
                //     $scope.updateClosedListings()
                // })
        }


        //utility function for filtering
        //utility function for filtering
        $scope.greaterThan = function(prop, val){
        return function(item){
          return item[prop] > val;
        }
    }
    

    })
    