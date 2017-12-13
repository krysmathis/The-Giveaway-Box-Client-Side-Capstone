    angular.module("TheGiveawayBoxApp")
.controller("UserCtrl", function($scope, $route, $http, $routeParams, $timeout, $location, ListingsFactory, UserFactory, AuthFactory, InviteFactory, GroupsFactory) {
    

    console.log("User Controller is Initiated")

    $scope.user = {
        invitegroups: [],
        joinGroups: [],
        listings: []
    };

    $scope.listingsInit = () => {
        const user = AuthFactory.getUser()
        ListingsFactory.getCurrentUserListings(user).then(r=> {
            $scope.user.listings = r
        })
    }    

    $scope.seedGroups = () => {
        const user = AuthFactory.getUser()
        GroupsFactory.seedUserGroups(user).then(r=> {
            console.log("you've been seeded")
            
        })
    }
    //utility function for filtering
    $scope.greaterThan = function(prop, val){
        return function(item){
          return item[prop] > val;
        }
    }
    
    $scope.deleteListing = (e) => {
        ListingsFactory.deleteListing(e.target.id).then(r=>{
            console.log("record deleted", e.target.id)
            $route.reload()
            // $timeout(function () {
            //     $location.url(`/users/${$scope.listing.userId}`)
            // }, 100);
        })
    }

    $scope.closeListing = (e) => {
        ListingsFactory.closeListing(e.target.id).then(r=>{
            console.log("another successful listing")
        })
    }


    $scope.refresh = () => $scope.groupsInit()

    $scope.groups = []

    // $scope.groupsInit = () => {
    //     GroupsFactory.getUsersGroups(AuthFactory.getUser()).then(r=> {
    //         $scope.groups = []
    //         r.forEach(val => $scope.groups.push(val))
    //         console.log("init groups: ", $scope.groups)
    //     })
    // }

    // /**
    //  * INVITE NEW USERS
    //  */
    // $scope.inviteUser = () =>  {
    //     console.log($scope.groups)
    //     const invite = {
    //         userId: AuthFactory.getUser().uid,
    //         created: Date.now(),
    //         redeemed: false
    //     }
    //     InviteFactory.getInviteCode(invite).then(outcome  => {
    //         $scope.inviteCode = outcome
    //         console.log($scope.inviteCode)
    //         InviteFactory.setGroupInviteCodes($scope.inviteCode, $scope.user.inviteGroups)
    //     })
    // }



    // $scope.checkAll = function() {
    //     $scope.user.roles = angular.copy($scope.roles);
    // };

    // $scope.uncheckAll = function() {
    //     $scope.user.roles = [];
    // };

    // $scope.checkFirst = function() {
    //     $scope.user.roles.splice(0, $scope.user.roles.length); 
    //     $scope.user.roles.push('guest');
    // };

    /** 
     * REDEEM INVITATIONS
     */
    $scope.inviteCode = ""
    //$scope.showJoinButton = () => $scope.availableGroups.length = 0
    $scope.availableGroups = null
    // Redeem Invites
    $scope.redeemInvite = () => GroupsFactory.getGroupsFromInvite($scope.inviteCode).then(g=>{
        console.log(g)
        $scope.availableGroups = g
    })

    $scope.joinGroups = () => {
        console.log("groups", $scope.groups)
        GroupsFactory.getUsersGroups(AuthFactory.getUser()).then(r=> {
            const userGroups = r
            // only add groups if they aren't already listed
            const groups = $scope.user.joinGroups.filter(g=> 
                // TODO: add the ! back in 
               !userGroups.some(i=> 
                    i.groupId === g.groupId))

            if (!groups || groups.length === 0) {
                console.log("No new groups")
                return
            }

            const user = AuthFactory.getUser()
            groups.forEach(g => {
                const userGroup = {
                    groupId: g.groupId,
                    groupName: g.groupName,
                    inviteCode: g.inviteCode,
                    dateAdded: Date.now()
                }
                GroupsFactory.joinGroup(user,userGroup).then(r=> {
                    GroupsFactory.getUsersGroups(AuthFactory.getUser()).then(r=> {
                        $scope.groups = r
                        console.log("init groups: ", $scope.groups)
                        $route.reload()
                    })
                })
            })
        })
    }

    


})