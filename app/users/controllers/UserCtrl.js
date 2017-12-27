    angular.module("TheGiveawayBoxApp")
.controller("UserCtrl", function($scope, $route, $http, $routeParams, $timeout, $location, ListingsFactory, UserFactory, AuthFactory, InviteFactory, GroupsFactory) {
    
    $scope.oneAtATime = true;

    console.log("User Controller is Initiated")

    $scope.user = {
        invitegroups: [],
        joinGroups: [],
        listings: []
    };



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

    $scope.refresh = () => $scope.groupsInit()

    $scope.groups = []

    
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