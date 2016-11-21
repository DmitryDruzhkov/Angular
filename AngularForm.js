<link data-require="bootstrap-css@*" data-semver="3.0.0" rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.0.0/css/bootstrap.min.css" /> 
<h2>Add a new request for access:</h2>  
<br />  
<div>  
    <div ng-controller="MyCtl" class="col-xs-5 selectContainer form-group">  
        Request title   
        <input type="text" ng-model="request.title" class="form-control"/>  
        <br />  
        Select system
        <select ng-change="getSystemRole(request.system)" name="repeatSelect" id="repeatSelectsystem" ng-model="request.system" class="form-control">
          <option ng-repeat="system in systems" value='{{system.ID}}'>{{system.Title}}</option>
        </select>        
        <br />  
        Select system role
        <select name="repeatSelect" id="repeatSelectsystem2" ng-model="request.systemrole" class="form-control">
          <option ng-repeat="role in roles" value='{{role.ID}}'>{{role.Title}}</option>
        </select>        
        <br />  
        <input type="submit" value="Save" ng-click="createContact($event)" class="btn btn-primary btn-lg active" />  
    </div>  
</div>
  
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
<script data-require="angular.js" data-semver="1.2.0-rc2" src="http://code.angularjs.org/1.2.0-rc.2/angular.js"></script>

<script type="text/javascript">
    var app = angular.module('test', []);
    
    app.controller('MyCtl', function($scope, $http) 
    {
        $scope.request = { title: "", system: "", systemrole: "" };  
        
        $scope.createContact = function ($event) 
        {  
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
            
            clientContext.executeQueryAsync(  
                Function.createDelegate(this, onQuerySucceeded),  
                Function.createDelegate(this, onQueryFailed)  
            );  

        };  

        onQuerySucceeded = function () 
        {  
            alert('Successfully created new request');  
            location.reload();
        }  

        onQueryFailed = function (sender, args) 
        {  
            alert('Failed: ' + args.get_stackTrace());  
        }

        $http({headers: { "Accept": "application/json; odata=verbose" }, method: 'GET', url: _spPageContextInfo.webAbsoluteUrl + "/_api/Web/Lists/GetByTitle('systems')/items?$select=Title,ID"}) 
            .success(function(data) {
                    $scope.systems = data.d.results;
                    });

        $scope.getSystemRole = function(id){
            $urlRequest = _spPageContextInfo.webAbsoluteUrl + "/_api/Web/Lists/GetByTitle('roles')/items?$select=ID,Title,SystemTitle/ID&$expand=SystemTitle/ID&$filter=SystemTitle/ID eq " + id;
            $http({headers: { "Accept": "application/json; odata=verbose" }, method: 'GET', url: $urlRequest}) 
                .success(function(data) {
                        $scope.roles = data.d.results;
                        });
        };
    });
    
    angular.element(document).ready(function() {
    angular.bootstrap(document, ['test']);
    });     
</script>