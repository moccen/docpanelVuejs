define("myVueComponent", ["vue", "jquery", "underscore"], function(Vue, $, _) {
	var module = {};
	var _contentData = {};
	module.init = function(contentData) {
<<<<<<< HEAD
		this._contentData = contentData;
		Vue.config.debug = true;
=======
		this._contentData = contentData[0].nodes;

>>>>>>> 3f26ecb7417c21a999a0dbfd0b84a47cae5b814d
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
				notifyBreadcrumb: function(node) {
					var nodeId = node.id;
					this.$dispatch('change-path', nodeId);
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

<<<<<<< HEAD
		var rootComp = Vue.extend({
			components: {
				'thumb-item': thumbComp,
				'accord-item': ctntComp,
=======
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
>>>>>>> 3f26ecb7417c21a999a0dbfd0b84a47cae5b814d
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
				'change-path': function(nodeId) {
					this.$broadcast('update-bread', nodeId);
					//					this.$refs.breadcrumb.updateData(nodeId);
				}
			},
			components: {
				'thumb-item': thumbComp,
				'accord-item': accordComp,
				'breadcrumb-item': breadcrumbComp
			},
			methods: {
				testDispatch: function(node) {
					var nodeId = node.id;
					this.$broadcast('update-bread', nodeId);
				}
			}
		});

	}
	return module;
})