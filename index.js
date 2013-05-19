/**
 * @author zhixin wen <wenzhixin2010@gmail.com>
 */
	
(function() {
	
	var LIST_GROUP = '/aj/f/group/list',
		ADD_GROUP = '/aj/f/group/add',
		UPDATE_GROUP = '/aj/f/group/update',
		ORDER_GROUP = '/aj/f/group/order',
		LIST_USERS = '/aj/relation/followbyother?t=1&ftype=1&page=',
		
		ATTENTION_NAME = '相互关注',
		
		gid = 0; //相互关注的 ID

	function main() {
		checkGroup();
	}
	
	//检查是否已经有相互关注分组
	function checkGroup() {
		$.get(LIST_GROUP, function(result) {
			if (!result || !result.data) {
				return;
			}
			gid = getGid(result.data);
			if (!gid) {
				addGroup();
			} else {
				orderGroup(result.data);
				listUsers();
			}
		});
	}

	//添加相互关注分组
	function addGroup() {
		$.post(ADD_GROUP, {
			mode: 'private',
			name: ATTENTION_NAME
		}, function(data) {
			gid = getGid(result.data);
			orderGroup(result.data);
			listUsers();
		});
	}
	
	function orderGroup(data) {
		var gids = $.map(data, function(item) {
			return item.gid;
		});
		gids.unshift(gids.pop());
		$.post(ORDER_GROUP, {
			gids: gids.join(',')
		}, function(data) {
			
		});
	}
	
	//列表相互关注用户信息
	function listUsers(page) {
		page = page || 1;
		$.get(LIST_USERS + page, function(result) {
			if (!result || !result.data) {
				return;
			}
			var $data = $(result.data),
				$list = $(result.data).find('.myfollow_list'),
				total = 0,
				users = [];
			$data.find('.W_pages_minibtn a').each(function() {
				if (!$(this).hasClass('W_btn_c')) {
					total++;
				}
			});
			$list.each(function() {
				var data = $(this).attr('action-data'),
					query = getQuery(data);
				users.push(query.uid);
			});
			updateAttention(users);
			if (page < total) {
				listUsers(page + 1);
			} 
		})
	}
	
	function updateAttention(users) {
		$.post(UPDATE_GROUP, {
			refer_sort: 'relationManage',
			location: 'myfollow',
			refer_flag: 'add_all',
			type: 'm',
			_t: '0',
			user: '[' + users.join(',') + ']',
			gid: '[' + gid + ']'
		}, function(data) {
			
		});
	}
	
	function getGid(data) {
		var id = 0;
		$.each(data, function(i, item) {
			if (item.gname === ATTENTION_NAME) {
				id = item.gid;
				return;
			}
		});
		return id;
	}
	
	function getQuery(data) {
		var query = {},
			arr = data.split('&');
		$.each(arr, function(i, item) {
			var items = item.split('=');
			query[items[0]] = items[1];
		});
		return query;
	}
	
	main();
})();
