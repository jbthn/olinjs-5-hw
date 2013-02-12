$(function () {
	$('.preferences').on('submit', function () {
			$.post('/', $('.preferences').serialize());
			$('body').css({'background-color': $('#bgColor').val(), 'font-family': $('#ff').val(), 'color': $('#fColor').val()});
			$('img').css({'border': '8px solid ' + $('#bColor').val()});
			return false;
	});
});