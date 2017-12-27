angular
.module("TheGiveawayBoxApp")
.controller("InviteCtrl", 
function(
    $scope, 
    $routeParams, 
    ListingsFactory,
    InviteFactory,
    AuthFactory,
    GroupsFactory,
    $uibModal
) {


    /** 
     * INVITE NEW USERS
     */

    $scope.groups = GroupsFactory.userGroups

    if (GroupsFactory.userGroups.length === 0) {
        const user = {
                uid: $routeParams.userId
        }

        GroupsFactory.getUsersGroups(user).then(r=>{
            $scope.groups = r
        })
    }

    $scope.inviteGroups = []
    console.log("invite_groups", $scope.groups)
    
    $scope.inviteCode = ""

    $scope.inviteUser = () =>  {
        // clear the user code
        document.querySelector(".user__invite-code").value = ""
        

        if ($scope.inviteGroups.length === 0) {
            return
        }

        const invite = {
            userId: AuthFactory.getUser().uid,
            created: Date.now(),
            redeemed: false
        }

        InviteFactory.getInviteCode(invite).then(outcome  => {
            $scope.$apply(() => $scope.inviteCode = outcome)
            console.log($scope.inviteCode)
            InviteFactory.setGroupInviteCodes($scope.inviteCode, $scope.inviteGroups)
        })
    }

   
})
