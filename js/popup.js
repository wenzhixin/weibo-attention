/**
 * @author zhixin wen <wenzhixin2010@gmail.com>
 */

$(function() {
	var SITE_URL = 'http://www.weibo.com',
		LIST_GROUP = '/aj/f/group/list',
		LIST_URL = '/aj/mblog/fsearch?',
		COMMENT_URL = '/aj/comment/small?',
		
		ATTENTION_NAME = '相互关注',
		
		DOM_ITEM = 'div[action-type="feed_list_item"]',
		DOM_LOADING = 'div.W_loading',
		DOM_ITEM_TIPS = 'div.W_tips',
		DOM_ITEM_PAGES = 'div.W_pages',
		DOM_IMAGE = '[action-type="feed_list_media_img"]',
		DOM_PICS = '[action-type="fl_pics"]',
		DOM_VIDEO = '[action-type="feed_list_media_video"]',
		DOM_THIRD_REND = '[action-type="feed_list_third_rend"]',
		DOM_COMMENT = '[action-type="feed_list_comment"]',
		
		$content = $('#content'),
		uid = 0,
		gid = 0,
		store = new Store(),
		page = 0,
		mid;
	
	function main() {
		getUid();
		$(document).on('click', DOM_IMAGE + ',' + DOM_PICS, imageZoomout);
		$(document).on('click', 'div.smallcursor', imageZoomin);
		$(document).on('click', DOM_VIDEO + ',' + DOM_THIRD_REND, linkClick);
		$(document).on('click', DOM_COMMENT, commentClick);
		$(window).scroll(function() {
			$(document).scrollTop() + $(window).height() === $(document).height() && getContent();
		});
	}
	
	function getUid() {
		$.get(SITE_URL, function(data) {
			var m = data.match(/CONFIG\[['"]uid['"]\]\s?=\s?['"](\d*)['"]/);
			uid = m ? m[1] : '';
			if (!uid) {
				showLogin();
				return;
			}
			getGid();
		})
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
			Util.handleInlineEvent($data.find('a'));
			$content.find(DOM_LOADING).remove();
			$content.append($data);
			if (page === 0) {//first open
				store.setTime(+$content.find('.WB_feed_type:eq(0) [node-type="feed_list_item_date"]').attr('date'));
				chrome.browserAction.setBadgeText({text: ''});
			}
			$content.find(DOM_ITEM_TIPS + ',' + DOM_ITEM_PAGES).remove();
			$('[action-type="feed_list_like"], [action-type="feed_list_forward"], [action-type="feed_list_favorite"]')
				.attr('href', $content.find('a[node-type="feed_list_item_date"]').attr('href'));
			mid = $content.find(DOM_ITEM + ':last').attr('mid');
			page++;
		});
	}
	
	function showLogin() {
		$content.find(DOM_LOADING).html('请先<a href="' + SITE_URL + '" target="_blank">登录</a>新浪微博！');
	}
	
	function imageZoomout() {
		var src = $(this).parent().find('img').attr('src');
		src = src.replace('thumbnail', 'bmiddle');
		src = src.replace('square', 'bmiddle');
		$(this).parents('[node-type="feed_list_media_prev"]').hide()
			.next().html('<div class="smallcursor"><img src="' + src + '" /></div>').show();
	}
	
	function imageZoomin() {
		var top = $(this).parents(DOM_ITEM).offset().top;
		$(this).parents('[node-type="feed_list_media_disp"]').hide().prev().show();
		$(document).scrollTop() > top && $(document).scrollTop(top);
	}
	
	function linkClick() {
		window.open(Util.getQuery($(this).attr('action-data')).short_url);
	}
	
	function commentClick() {
		var $this = $(this),
			$comment = $this.parents(DOM_ITEM).find('div.WB_media_expand[node-type="feed_list_repeat"]'),
			mid = $this.parents(DOM_ITEM).attr('mid'),
			query = Util.getQuery($this.attr('action-data')),
			params = {
				act: 'list',
				mid: mid,
				uid: uid,
				isMain: true,
				ouid: query.ouid,
				location: query.location,
				group_source: 'group_all'
			},
			href = $this.parents('div[node-type="feed_list_funcLink"]')
				.find('a[node-type="feed_list_item_date"]').attr('href');
		if ($comment.is(':visible')) {
			$comment.hide();
			return;
		}
		$.get(SITE_URL + COMMENT_URL + $.param(params), function(result) {
			var html = [],
				$detial = $('<p class="more S_line1">' +
				'更多信息及操作请 <a href="' + href + '" target="_blank">' +
				'查看原微博<span class="CH">&gt;&gt;</span></a></p>');
			try {
				html.push(result.data.html);
			} catch(e) {
				html.push('获取评论失败！');
			}
			$comment.html(html.join('')).show().find(DOM_ITEM_TIPS).remove().end();
			$comment.find('div.WB_arrow').after($detial);
			$comment.find('[action-type="commentDialogue"]').next().remove().end().remove();
			$comment.find('[node-type="commentList"]').remove();
			$comment.find('.tab_b S_txt3 S_line1').remove();
			Util.handleInlineEvent($comment.find('a'));
			$comment.find('[action-type="delete"], [action-type="reply"]').attr('href', href);
		});
	}
	
	main();
});

(function(window) {
	window.Util = {
		getQuery: function(data) {
			var query = {};
			$.each(data.split('&'), function(i, item) {
				var arr = item.split('=');
				query[arr[0]] = arr[1];
			});
			return query;
		},
		
		handleInlineEvent: function($el) {
			$el.each(function() {
				var href = $(this).attr('href');
				if (href.substring(0, 1) === '/') {
					$(this).attr('href', 'http://weibo.com' + href);
				}
				
				var script = $(this).attr('onclick') || '',
					m = script.match(/^javascript:window.open\('(.*)'\);$/);
					args = m && m[1];
				if (!args) return;
				args = args.split('\', \'');
				$(this).attr('data-args', args.join('|')).removeAttr('onclick');
				$(this).click(function() {
					window.open.apply(window, $(this).attr('data-args').split('|'));
				});
			}).attr('target', '_blank');
		}
	};
})(window);
