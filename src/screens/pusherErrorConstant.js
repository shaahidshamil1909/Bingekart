const pusher = new Pusher('app_key');
pusher.connection.bind( 'error', function( err ) {
  if( err.error.data) {
    console.log('error',err.error.data);
  }
});
