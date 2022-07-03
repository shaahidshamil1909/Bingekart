const pusher = new Pusher(APP_KEY, {
  cluster: APP_CLUSTER,
  authEndpoint: 'http://example.com/pusher/auth'
});
