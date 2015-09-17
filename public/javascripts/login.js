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

	$("#blank_confirm").keyup(function(){
		$("#confirm").val(CryptoJS.MD5($("#blank_confirm").val()));
	});
	/**
	 * Handles form validation and submission
	 * @param  {Element} '#register_user'
	 */
	$('#register_user').click(function(){
		 var user = {}, empty_fields = {};
		 var form_data = ($('#register').serializeArray());
		 for (var i = 0; i < form_data.length; i++)
		 {
			 if(form_data[i].value === "")
			 {
			 		empty_fields.name = form_data[i].name;
			 }else{
				 	user[form_data[i].name] = form_data[i].value;
			 }
		 }
		 if(isEmpty(empty_fields) || !isPasswordMatched()){
			 	displayMessage('empty_field');
		 }else{
			 submitForm(user);
		 }
	});
	/**
	 * Determines if a object is empty.
	 * @param  {Object}  obj
	 */
	function isEmpty(obj){
		for(var i in obj){
			return true;
		}
		return false;
	};
 /**
  * Determines if password entered match.
  * @return {Boolean} [description]
  */
	function isPasswordMatched(){
			if($('#password').val() != $('#confirm').val()){
				return false;
			}else{
				return true;
			}
	};
	/**
	 * Displays appropriate error messages
	 * TODO - Refractor function to display better error messages
	 * @param  {[type]} type Type of error to be displayed
	 */
	function displayMessage(type){
			switch(type){
				case 'empty_field': message = 'Please review form and complete blank fields';
						break;
				case 'success': message = 'Your account has been succesfully created. Please await further instructions from your system administrator.'
					break;
				case 'fail': message = 'A system error has occurred';
					break;
				case 'password_mismatch': message = 'Password Mismatch';
					break;
				default: message = 'A system error has occurred';
					break;
			}
			$('#message').show().html(message);
	};
	/**
	 * Submits form upon succesful validation.
	 * @param  {Object} user New user details
	 */
	function submitForm(user){
		var request = $.ajax({
				 method: 'POST',
				 url: '/register',
				 data: user
		});
		var email_request = $.ajax({
				 method: 'POST',
				 url: '/email/new_user',
				 data: {to: user.us_email_address}
		});
		request.done(function(response){
			 displayMessage('success');
			 $('#register').trigger('reset');
		});
		request.fail(function(jqXHR, textStatus){
			displayMessage('fail');
		});
	}
});
