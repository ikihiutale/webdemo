$(function() {
	 $('#post-comment').hide();
	 $('#btn-comment').on('click', function(event) {
		 event.preventDefault();
		 $('#post-comment').toggle();    
     }); 
	 
	 $('#btn-like').on('click', function(event) {    
		 event.preventDefault();
		 var imgId = $(this).data('id');
		 // A jQuery AJAX post to the /images/:image_id/like route
		 // Once that AJAX call is done, another anonymous callback 
		 // function will be executed that will change the text of 
		 // the HTML element with a likes-count class and replace it 
		 // with the data that was returned from the AJAX call
		 $.post('/images/' + imgId + '/like').done(function(data) {        
			 $('.likes-count').text(data.likes);    
		 });
	 });
	 $('#btn-delete').on('click', function(event) { 
		 event.preventDefault(); 
		 var $this = $(this);
		 var remove = confirm('Are you sure you want to delete this image?'); 
		 if (remove) { 
			 var imgId = $(this).data('id'); 
			 $.ajax({ url: '/images/' + imgId, type: 'DELETE' }).done(function(result) { 
				 if (result) { 
					 $this.removeClass('btn-danger').addClass('btn-success');
					 $this.find('i').removeClass('fa-times').addClass('fa-check');
					 $this.append('<span> Deleted!</span>');
				 }
			 });    
		 }
	});

});
