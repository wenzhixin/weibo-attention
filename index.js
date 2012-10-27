/**
 * @author zhixin wen <wenzhixin2010@gmail.com>
 * @date 2012-10-27
 */

var checkTimes = 3;//检查次数

function getGroupListEl() {
	return $('div[node-type="group_show_list"]');
}

function checkGroupList() {
	if (checkTimes > 0) {
		setTimeout(function() {
			if (getGroupListEl().length) {
				addAttention();
			} else {
				checkTimes--;
				checkGroupList();
			}
		}, 1000);
	}
}

function addAttention() {
	var url = $('div[node-type="home"]>a').attr("href");
	url += url.indexOf("?") != -1 ? "&attention=1" : "?attention=1";
	var html = '<div class="lev">' +
			'<a href="' + url + '" class="S_txt1" node-type="item">' + 
				'<i class="W_ico20 ico_closefriend"></i>相互关注' +
			'</a>' +
		'</div>';
	getGroupListEl().before(html);
}

checkGroupList();