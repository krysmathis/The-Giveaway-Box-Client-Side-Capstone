angular
.module("TheGiveawayBoxApp")
.controller("UserListingsCtrl", 
function(
    $scope, 
    $timeout,
    $routeParams, 
    ListingsFactory,
    AuthFactory
) {
        // variable to toggle the large item view off and on
       $scope.display = false

       $scope.listings = []
        
        $scope.user = {
            invitegroups: [],
            joinGroups: [],
            listings: []
        };

        // function to control the 'new' label
        $scope.isNew = (item) => moment().diff(moment(item.timestamp), "days") < 2
    
        $scope.init = () => {
            const user = AuthFactory.getUser()
            $scope.listings = ListingsFactory.listings.filter(l=> l.userId === user.uid)
        }  
        // calling for initial listings
        $scope.init()

        $scope.deleteListing = (e) => {
            debugger
            ListingsFactory.deleteListing(e.target.id).then(r=>{
                console.log("record deleted", e.target.id)
                //$route.reload()
               
            })
        }

        //utility function for filtering
        $scope.greaterThan = function(prop, val){
        return function(item){
          return item[prop] > val;
        }
    }
    

    })
    