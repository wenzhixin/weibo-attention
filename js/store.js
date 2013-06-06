/**
 * @author zhixin wen <wenzhixin2010@gmail.com>
 */

(function(window) {
	var ATTENTION_TIME = 'weibo-attention-time',
		ATTENTION_UIDS = 'weibo-attention-uids',
		UPDATE_TIME = 'weibo-update-time';
	
	function Store() {
		
	}
	
	Store.prototype = {
		constructor: Store,
		
		getTime: function() {
			if (!localStorage[ATTENTION_TIME]) {
				return 0;
			}
			return JSON.parse(localStorage[ATTENTION_TIME]);
		},
		
		setTime: function(time) {
			localStorage[ATTENTION_TIME] = JSON.stringify(time);
		},
		
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
		},
		
		clearUpdateTime: function() {
			delete localStorage[UPDATE_TIME];
		}
	};
	
	window.Store = Store;
})(window);