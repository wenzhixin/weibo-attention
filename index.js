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
				main();
			} else {
				checkTimes--;
				checkGroupList();
			}
		}, 2000);
	}
}

function addAttention() {
	var html = '<div class="lev">' +
			'<a href="/u/2292826740?attention=1" class="S_txt1" node-type="item">' + 
				'<i class="W_ico20 ico_closefriend"></i>相互关注' +
			'</a>' +
		'</div>';
	getGroupListEl().before(html);
}

checkGroupList();