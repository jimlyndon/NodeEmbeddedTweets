$(function() {
	var Tweet = Backbone.Model.extend();
	var OEmbedTweet = Backbone.Model.extend();

	var Tweets = Backbone.Collection.extend({
		model: Tweet,
		url: 'http://search.twitter.com/search.json?q=Node.js&rpp=8&callback=?',
		parse: function(response) {
			//console.log('parsing tweets...')
			console.log(response.results);
			return response.results;
		}
	});
	
	var OEmbedTweets = Backbone.Collection.extend({
		model: OEmbedTweet,
		parse: function(response) {
			//console.log('parsing user ...');
			return response;
		}
	}); 

	var PageView = Backbone.View.extend({
		el: $('body'),
		events: {
			'click button#add': 'doSearch'
		},
		initialize: function() {
			_.bindAll(this, 'render', 'embedItem');
			this.tweets = new Tweets();
			_this = this;

			this.tweets.bind('reset', function(collection) {
				_this.$('#tweets').empty();
				collection.each(function(tweet) {
					console.log(tweet);
					_this.embedItem(tweet.get('id_str'));
				});
				$('#spinner').hide();
			});
			this.render();
		},
		doSearch: function() {
			$('#spinner').show();
			var subject = $('#search').val() || 'Node.js';
			this.tweets.url = 'http://search.twitter.com/search.json?q=' + subject + '&rpp=8&callback=?';
			this.tweets.fetch();
		},
		render: function() {
			$('#spinner').hide();
			return this;
		},
		embedItem: function(id) {
			_this = this;
			var oembed_id = id;
			this.otweets = new OEmbedTweets();
			this.otweets.url = 'https://api.twitter.com/1/statuses/oembed.json?id=' + oembed_id + '&align=center&callback=?'
			this.otweets.fetch();
			
			this.otweets.bind('reset',function(collection){
				collection.each(function(value) {
					$('ul', this.el).append("<li>" + value.get('html') + "</li>");
				});
			})
		}
	});
	var pageView = new PageView();
});