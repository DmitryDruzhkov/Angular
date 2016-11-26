var contactListName = 'systems';
var rolesListName = 'roles';
var myApp = angular.module('myApp', []);
myApp.service('mySharePointService', function ($q, $http) {
    this.getSystems = function ($scope) {
        var deferred = $q.defer();
        var ctx = new SP.ClientContext.get_current();
        var web = ctx.get_web();
        var list = web.get_lists().getByTitle(contactListName);
        var camlQuery = new SP.CamlQuery();
        camlQuery.set_viewXml('<View><ViewFields><FieldRef Name=\'Title\'/><FieldRef Name=\'ID\'/></ViewFields></View>');
        var systems = list.getItems(camlQuery);
        ctx.load(systems);
        ctx.executeQueryAsync(function () {
            deferred.resolve(systems);
        }, function (sender, args) {
            deferred.reject('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
        });
        return deferred.promise;
    };
    this.getSystemRoles = function (id) {
        var deferred = $q.defer();
        var ctx = new SP.ClientContext.get_current();
        var web = ctx.get_web();
        var list = web.get_lists().getByTitle(rolesListName);
        var camlQuery = new SP.CamlQuery();
        camlQuery.set_viewXml("<View><Query><Where><Eq><FieldRef Name='SystemTitle' LookupId='TRUE'/><Value Type='Lookup'>" + id + "</Value></Eq></Where></Query></View>");
        var roles = list.getItems(camlQuery);
        ctx.load(roles);
        ctx.executeQueryAsync(function () {
            deferred.resolve(roles);
        }, function (sender, args) {
            deferred.reject('Request failed. ' + args.get_message() + '\n' + args.get_stackTrace());
        });
        return deferred.promise;
    };
});

class MyController{
    constructor(mySharePointService) {
        this.mySharePointService = mySharePointService;
        alert('aaa');
    }

    createContact($event) {
        sadfsa
    }
}

myApp.controller('myCtrl2', new MyController());

myApp.controller('MyCtl', function ($scope, mySharePointService) {
    $scope.request = { title: "", system: "", systemrole: "" };
    $scope.createContact = function ($event) {
        var c = $scope.request;
        $event.preventDefault();
        var clientContext = new SP.ClientContext.get_current();
        var web = clientContext.get_web();
        var list = web.get_lists().getByTitle('requests');
        var requestListItemInfo = new SP.ListItemCreationInformation();
        var listItem = list.addItem(requestListItemInfo);
        listItem.set_item('Title', c.title);
        listItem.set_item('SystemTitle', c.system);
        listItem.set_item('SystemRole', c.systemrole);
        listItem.update();
        clientContext.executeQueryAsync(Function.createDelegate(this, onQuerySucceeded), Function.createDelegate(this, onQueryFailed));
    };
    onQuerySucceeded = function () {
        alert('Successfully created new request');
        location.reload();
    };
    onQueryFailed = function (sender, args) {
        alert('Failed: ' + args.get_stackTrace());
    };
    $scope.getSystems = function ($scope, mySharePointService) {
        var promiseSystems = mySharePointService.getSystems($scope);
        promiseSystems.then(function (systems) {
            $scope.systems = [];
            var contactEnumerator = systems.getEnumerator();
            while (contactEnumerator.moveNext()) {
                var system = contactEnumerator.get_current();
                $scope.systems.push({
                    title: system.get_item('Title'),
                    id: system.get_item('ID')
                });
            }
        }, function (errorMsg) {
            console.log("Error: " + errorMsg);
        });
    };
    $scope.getSystemRoles = function (id) {
        var promiseSystemRoles = mySharePointService.getSystemRoles(id);
        promiseSystemRoles.then(function (roles) {
            $scope.roles = [];
            var contactEnumerator = roles.getEnumerator();
            while (contactEnumerator.moveNext()) {
                var role = contactEnumerator.get_current();
                $scope.roles.push({
                    title: role.get_item('Title'),
                    id: role.get_item('ID')
                });
            }
        }, function (errorMsg) {
            console.log("Error: " + errorMsg);
        });
    };

    SP.SOD.executeOrDelayUntilScriptLoaded(GTSystems, "SP.js");
    
    function GTSystems(){
        $scope.getSystems($scope, mySharePointService);
    }
});

angular.element(document).ready(function () {
    angular.bootstrap(document, ['myApp']);
});
