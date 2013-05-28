/**
 * @author zhixin wen <wenzhixin2010@gmail.com>
 */
	
(function() {
	
	var LIST_GROUP = '/aj/f/group/list',
		ADD_GROUP = '/aj/f/group/add',
		UPDATE_GROUP = '/aj/f/group/update',
		ORDER_GROUP = '/aj/f/group/order',
		REMOVE_GROUP = '/aj/f/group/remove',
		LIST_USERS = '/aj/relation/followbyother?t=1&ftype=1&page=',
		
		INTERVAL_HOUR = 1, //一个小时检查一次，假如好友太多的话，会产生很多请求
		ATTENTION_NAME = '相互关注',
		
		store = new Store(),
		gid = 0, //相互关注的 ID
		uids = []; //相互关注的人的ID
	
	//检查是否已经有相互关注分组
	function checkGroup() {
		$.get(LIST_GROUP, function(result) {
			if (!result || result.code !== '100000') {
				//退出登录清空 localStorage，防止不同用户冲突
				delete store.clearUids();
				return;
			}
			if (!checkUpdateTime()) {
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
	
	//检查更新间隔
	function checkUpdateTime() {
		var updateTime = store.getUpdateTime(),
			date = new Date();
		date.setHours(date.getHours() - INTERVAL_HOUR);
		if (!updateTime || date > updateTime) {
			store.setUpdateTime(new Date());
			return true;
		}
		return false;
	}

	//添加相互关注分组
	function addGroup() {
		$.post(ADD_GROUP, {
			mode: 'private',
			name: ATTENTION_NAME
		}, function(result) {
			if (!result || result.code !== '100000') {
				return;
			}
			gid = getGid(result.data);
			orderGroup(result.data);
			listUsers();
		});
	}
	
	//将相互关注排序到第一位，其他不变
	function orderGroup(data) {
		var gids = [gid];
		$.each(data, function(i, item) {
			if (item.gid === gid) {
				return i !== 0;
			}
			gids.push(item.gid);
		});
		if (gids.length === 1) {
			return;
		}
		$.post(ORDER_GROUP, {
			gids: gids.join(',')
		}, function(data) {
			
		});
	}
	
	//列表相互关注用户信息
	function listUsers(page) {
		page = page || 1;
		$.get(LIST_USERS + page, function(result) {
			if (!result || result.code !== '100000') {
				return;
			}
			var $data = $(result.data),
				$list = $(result.data).find('.myfollow_list'),
				total = 0;
			$data.find('.W_pages_minibtn a').each(function() {
				if (!$(this).hasClass('W_btn_c')) {
					total++;
				}
			});
			$list.each(function() {
				var data = $(this).attr('action-data'),
					query = getQuery(data);
				uids.push(query.uid);
			});
			if (page < total) {
				listUsers(page + 1);
			}
			if ((total === 0 || page === total) && checkUidsUpdate()) {
				updateGroup();
				removeGroup();
			}
		})
	}
	
	//检查相互关注的列表是否改变
	function checkUidsUpdate() {
		var _uids = store.getUids();
		return _uids.toString() !== uids.toString();
	}
	
	//更新相互关注的用户
	function updateGroup() {
		$.post(UPDATE_GROUP, {
			refer_sort: 'relationManage',
			location: 'myfollow',
			refer_flag: 'add_all',
			type: 'm',
			_t: '0',
			user: '[' + uids.join(',') + ']',
			gid: '[' + gid + ']'
		}, function(result) {
			if (!result || result.code !== '100000') {
				return;
			}
			//将相互关注的用户保存到 localStorage 中
			store.setUids(uids);
		});
	}
	
	//删除非相互关注的用户
	function removeGroup() {
		var _uids = store.getUids(),
			removeIds = [];
		$.each(_uids, function(i, id) {
			if (uids.indexOf(id) === -1) {
				removeIds.push(id);
			}
		});
		if (removeIds.length === 0) {
			return;
		}
		$.post(REMOVE_GROUP, {
			refer_sort: 'relationManage',
			location: 'group',
			refer_flag: 'remove',
			_t: '0',
			gid: gid,
			uids: removeIds.join(',')
		}, function(result) {
			
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
	
	checkGroup();
})();
