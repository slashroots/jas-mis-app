/**
* Created by Tremaine Buchanan on 06/14/15
* Hash password supplied by user once the user
* exits field. Password field populated with
* hashed password.
* 
**/
$(function(){
	$("#blank").keyup(function(){
		$("#password").val(CryptoJS.MD5($("#blank").val()));
	});
});
