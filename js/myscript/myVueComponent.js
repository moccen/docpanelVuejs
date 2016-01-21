define("myVueComponent", ["vue", "jquery", "underscore"], function(Vue, $, _) {
	var module = {};
	var _contentData = {};
	module.init = function(contentData) {

		this._contentData = contentData[0].nodes;

		var thumbComp = Vue.extend({
			template: '#thumb-template',
			props: ['files'],
			methods: {
				getSrc: function(fileType, src) {
					switch (fileType) {
						case "text":
						case "unknown":
							return "./img/file.png";
							break;
						case "dwg":
							return "./img/cad.png";
							break;
						case "video":
							return "./img/video.png";
							break;
						case "pdf":
							return "./img/pdf.png";
							break;
						default:
							return "./img/folder.png";
					}
				},
				contentClickHandler: function(item) {
					var nodeId = item.id;
					var isflder = item.isFlder;
					var paths = this.$parent.paths;
					this.constructPath(nodeId);
					alert("the node ID is " + nodeId + " node is folder:" + paths.length);
				},
				constructPath: function(nodeId) {
					this.$parent.paths.push(nodeId);
				},
				updateBread:function(nodeId){
					this.$dispatch('update-fromThumb',nodeId);
				}
			},
			
		});

		var accordComp = Vue.extend({
			template: '#accord-template',
			props: ['files'],
			events: {
				'update-bread': function(nodeId) {
					alert('change-path fired from accordComp! the node id is ' + nodeId);
				}
			}
		});


		var breadcrumbComp = Vue.extend({
			template: '#breadcrumb-template',
			props: ['paths'],
			methods: {
				updateData: function(nodeId) {
					alert("the breadcrumb id is " + nodeId);
				}
			},
			events: {
				'update-bread': function(nodeId) {
					alert('change-path fired from breadcrumbComp! the node id is ' + nodeId);
					//					this.$parent.paths.push(nodeId);
					this.paths.push(nodeId);
				}
			}
		});

		new Vue({
			el: '#contentWrapper',
			data: {
				files: this._contentData,
				paths: [1, 2]
			},
			ready: function() {
				var accordion = new Accordion($('#leftNavigation'), false);
			},
			events: {
				'update-fromThumb': function(nodeId) {
					alert('change-paths from parent!');
					this.handleIt(nodeId);
					//this.$broadcast('update-bread', nodeId);
					//					this.$refs.breadcrumb.updateData(nodeId);
				}
			},
			components: {
				'thumb-item': thumbComp,
				'accord-item': accordComp,
				'breadcrumb-item': breadcrumbComp
			},
			methods: {
				handleIt: function(node) {
					alert('testDispatch is fired!');
					//var nodeId = node.id;
					this.$broadcast('update-bread', node);
				}
			}
		});
	}
	return module;
})