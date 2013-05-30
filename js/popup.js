/**
 * @author zhixin wen <wenzhixin2010@gmail.com>
 */

$(function() {
	var SITE_URL = 'http://www.weibo.com',
		LIST_GROUP = '/aj/f/group/list',
		LIST_URL = '/aj/mblog/fsearch?',
		
		ATTENTION_NAME = '相互关注',
		
		$content = $('#content'),
		gid = 0,
		store = new Store(),
		page = 0,
		mid;
	
	function main() {
		getGid();
		$(document).on('click', 'div.bigcursor', imageZoomout);
		$(document).on('click', 'div.smallcursor', imageZoomin);
		$(window).scroll(function() {
			$(document).scrollTop() + $(window).height() === $(document).height() && getContent();
		});
	}
	
	function getGid() {
		$.get(SITE_URL + LIST_GROUP, function(result) {
			if (!result || result.code !== '100000') {
				showLogin();
				return;
			}
			$.each(result.data, function(i, item) {
				if (item.gname === ATTENTION_NAME) {
					gid = item.gid;
					return false;
				}
			});
			if (!gid) {
				showLogin();
				return;
			}
			getContent();
		});
	}
	
	function getContent() {
		var p1 = ~~(page / 3) + 1,
			p2 = page % 3,
			params = {
				gid: gid,
				page: p1,
				pre_page: p1 - 1,
				count: 15, 
				filtered_min_id: mid
			};
		if (p2 > 0) {
			params.pre_page = p1;
			params.pagebar = p2 - 1;
		}
		$.get(SITE_URL + LIST_URL + $.param(params), function(result) {
			if (!result || result.code !== '100000') {
				showLogin();
				return;
			}
			$data = $(result.data);
			$data.find('a').each(function() {
				var href = $(this).attr('href');
				if (href.substring(0, 1) === '/') {
					$(this).attr('href', 'http://weibo.com' + href).attr('target', '_blank');
				}
			});
			$content.find('.W_loading').remove();
			$content.append($data);
			$content.find('.W_loading span').append('<img src="images/loading.gif" />');
			$content.find('.W_tips, .W_pages').remove();
			mid = $content.find('div.WB_feed_type:last').attr('mid');
			page++;
		});
	}
	
	function showLogin() {
		$content.find('.W_loading span').html('请先<a href="' + SITE_URL + '" target="_blank">登录</a>新浪微博！');
	}
	
	function imageZoomout() {
		var src = $(this).find('img').attr('src').replace('thumbnail', 'bmiddle');
		$(this).parents('[node-type="feed_list_media_prev"]').hide()
			.next().html('<div class="smallcursor"><img src="' + src + '" /></div>').show();
	}
	
	function imageZoomin() {
		var top = $(this).parents('.WB_feed_type').offset().top;
		$(this).parents('[node-type="feed_list_media_disp"]').hide().prev().show();
		$(document).scrollTop() > top && $(document).scrollTop(top);
	}
	
	main();
});
