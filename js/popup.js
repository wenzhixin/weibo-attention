/**
 * @author zhixin wen <wenzhixin2010@gmail.com>
 */

$(function() {
	var URL = 'http://www.weibo.com/aj/mblog/fsearch?',
		$content = $('#content'),
		page = 0,
		mid;
	
	function main() {
		getContent();
		$(window).scroll(function() {
			$(document).scrollTop() + $(window).height() === $(document).height() && getContent();
		});
	}
	
	function getContent() {
		var p1 = ~~(page / 3) + 1,
			p2 = page % 3,
			params = {
				gid: '3582362577621528',
				page: p1,
				pre_page: p1 - 1,
				count: 15, 
				filtered_min_id: mid
			};
		if (p2 > 0) {
			params.pre_page = p1;
			params.pagebar = p2 - 1;
		}
		$.get(URL + $.param(params), function(result) {
			if (!result || result.code !== '100000') {
				$content.html('请先登录！');
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
			$content.find('.W_tips, .W_pages').remove();
			mid = $content.find('div.WB_feed_type:last').attr('mid');
			page++;
		});
	}
	
	main();
});
