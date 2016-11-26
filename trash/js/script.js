var app = angular.module('test', []);
app.controller('MyCtl', function ($scope, $http) {
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
    $http({ headers: { "Accept": "application/json; odata=verbose" }, method: 'GET', url: _spPageContextInfo.webAbsoluteUrl + "/_api/Web/Lists/GetByTitle('systems')/items?$select=Title,ID" })
        .success(function (data) {
        $scope.systems = data.d.results;
    });
    $scope.getSystemRole = function (id) {
        $urlRequest = _spPageContextInfo.webAbsoluteUrl + "/_api/Web/Lists/GetByTitle('roles')/items?$select=ID,Title,SystemTitle/ID&$expand=SystemTitle/ID&$filter=SystemTitle/ID eq " + id;
        $http({ headers: { "Accept": "application/json; odata=verbose" }, method: 'GET', url: $urlRequest })
            .success(function (data) {
            $scope.roles = data.d.results;
        });
    };
});
angular.element(document).ready(function () {
    angular.bootstrap(document, ['test']);
});
