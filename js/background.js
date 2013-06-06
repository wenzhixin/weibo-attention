/**
 * @author zhixin wen <wenzhixin2010@gmail.com>
 */

(function(window) {
	var SITE_URL = 'http://www.weibo.com',
		LIST_GROUP = '/aj/f/group/list',
		LIST_URL = '/aj/mblog/fsearch?',
		
		ATTENTION_NAME = '相互关注',
		
		store = new Store(),
		gid = 0;
		
	function getGid() {
		$.get(SITE_URL + LIST_GROUP, function(result) {
			if (!result || result.code !== '100000') {
				chrome.browserAction.setBadgeText({text: 'x'});
				return;
			}
			$.each(result.data, function(i, item) {
				if (item.gname === ATTENTION_NAME) {
					gid = item.gid;
					return false;
				}
			});
			checkList();
		});
	}	
	
	function checkList() {
		if (!gid) {
			getGid();
		} else {
			var time = store.getTime();
			$.get(SITE_URL + LIST_URL + $.param({
				gid: gid,
				page: 1, 
				pre_page: 0,
				count: 15
			}), function(result) {
				if (!result || result.code !== '100000') {
					chrome.browserAction.setBadgeText({text: 'x'});
					return;
				}
				var unreadCount = 0;
				$('<div>' + result.data + '</div>').find('.WB_feed_type').each(function() {
					var date = +$(this).find('[node-type="feed_list_item_date"]').attr('date');
					if (date && date > time) {
						unreadCount++;
					}
				});
				chrome.browserAction.setBadgeText({text: unreadCount > 0 ? (unreadCount >= 15 ? '15+' : unreadCount + '') : ''});
			});
		}
		setTimeout(checkList, 5 * 60 * 1000); //5分钟检查一次
	}
	
	checkList();
	
	window.checkList = checkList;
})(window);
