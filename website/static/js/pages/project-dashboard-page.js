/** Initialization code for the project dashboard. */

var $ = require('jquery');
var Rubeus = require('rubeus');

var LogFeed = require('../logFeed.js');
var pointers = require('../pointers.js');

var Comment = require('../comment.js');

// Since we don't have an Buttons/Status column, we append status messages to the
// name column
Rubeus.Col.DashboardName = $.extend({}, Rubeus.Col.Name);
Rubeus.Col.DashboardName.itemView = function(item) {
    return Rubeus.Col.Name.itemView(item) + '&nbsp;<span data-status></span>';
};

var nodeApiUrl = window.contextVars.node.urls.api;

var rubeusOpts = {
    data: nodeApiUrl + 'files/grid/',
    columns: [Rubeus.Col.DashboardName],
    width: '100%',
    uploads: true,
    height: 600,
    progBar: '#filetreeProgressBar',
    searchInput: '#fileSearch'
};
new Rubeus('#myGrid', rubeusOpts);

// Initialize controller for "Add Links" modal
new pointers.PointerManager('#addPointer', window.contextVars.node.title);

// Listen for the nodeLoad event (prevents multiple requests for data)
$('body').on('nodeLoad', function() {
    new LogFeed('#logScope', nodeApiUrl + 'log/');
});


// Initialize comment pane w/ it's viewmodel
var $comments = $('#comments');
if ($comments.length) {
    var userName = window.contextVars.currentUser.name;
    var canComment = window.contextVars.currentUser.canComment;
    var hasChildren = window.contextVars.node.hasChildren;
    Comment.init('#commentPane', userName, canComment, hasChildren);
}