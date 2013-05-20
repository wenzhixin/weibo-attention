/**
 * @author zhixin wen <wenzhixin2010@gmail.com>
 */

(function(window) {
	var ATTENTION_UIDS = 'weibo-attention-uids',
		UPDATE_TIME = 'weibo-update-time';
	
	function Store() {
		
	}
	
	Store.prototype = {
		constructor: Store,
		
		getUids: function() {
			if (!localStorage[ATTENTION_UIDS]) {
				return [];
			}
			return JSON.parse(localStorage[ATTENTION_UIDS]);
		},
		
		setUids: function(uids) {
			localStorage[ATTENTION_UIDS] = JSON.stringify(uids);
		},
		
		clearUids: function() {
			delete localStorage[ATTENTION_UIDS];
		},
		
		getUpdateTime: function() {
			if (!localStorage[UPDATE_TIME]) {
				return null;
			}
			return new Date(JSON.parse(localStorage[UPDATE_TIME]));
		},
		
		setUpdateTime: function(date) {
			localStorage[UPDATE_TIME] = JSON.stringify(date);
		}
	};
	
	window.Store = Store;
})(window);