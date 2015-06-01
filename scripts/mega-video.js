var megaVideo = angular.module('megaVideoDemo', []);

megaVideo.directive('megaVideo', function($sce) {
	return {
		restrict: 'E',
		templateUrl: 'templates/mega-video.html',
		scope: true,
		transclude: true,
		controller: function($scope, $element, $attrs) {

			var videoPlayer = $element.find('video')[0];
			var volumeControl = this;
			this.setVolume = function(level) {
				videoPlayer.volume = level;
			};

			
			$scope.video = {
				play: function() {
					videoPlayer.play();
					$scope.video.status = 'play';
				},
				pause: function() {
					videoPlayer.pause();
					$scope.video.status = 'pause';
				},
				stop: function() {
					videoPlayer.pause();
					videoPlayer.currentTime = 0;
					$scope.video.status = 'stop';
				},
				togglePlay: function() {
					$scope.video.status == 'play' ? this.pause() : this.play();
				},
				width: $attrs.width,
				height: $attrs.height
			};
		},
		link: function(scope, element, attrs) {

			scope.sources = [];
			processSources();

			function processSources() {
				// Whitelist of accepted video formats
				var sourceTypes = {
					webm: {type: 'video/webm'},
					mp4: {type: 'video/mp4'},
					ogg: {type: 'video/ogg'}
				};

				for (source in sourceTypes) {
					if (attrs.hasOwnProperty(source)) {
						scope.sources.push({
							type: sourceTypes[source].type,
							src: $sce.trustAsResourceUrl(attrs[source])
						});
					}
				}
			}
		}
	}
});

megaVideo.directive('volumeSlider', function() {
	return {
		require: '?^megaVideo',
		restrict: 'A',
		link: function(scope, element, attrs, megaVideoController) {

			var initialVolume = parseFloat(attrs.initialVolume);
			megaVideoController.setVolume(initialVolume);

			angular.element(element.slider({
				min: 0,
				max: 1,
				step: 0.01,
				value: initialVolume,
				orientation: "horizontal",
				slide: function(event, ui) {
				   scope.$apply(function(){
				       megaVideoController.setVolume(ui.value);
				   })
				},
				change: function(event, ui) {
				   scope.$apply(function(){
				       megaVideoController.setVolume(ui.value);
				   })
				}
			}));

		}
	}
});