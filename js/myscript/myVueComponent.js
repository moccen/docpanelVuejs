define("myVueComponent", ["vue", "jquery"], function(Vue, $) {
	var module = {};
	var _contentData = {};
	module.init = function(contentData) {
		this._contentData = contentData;
		Vue.config.debug = true;
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
				contentClickHandler: function(nodeId) {
					alert("the node ID is " + nodeId);
				}
			},
			ready: function() {
				var accordion = new Accordion($('#leftNavigation'), false);
			}
		});

		var ctntComp = Vue.extend({
			template: '#accord-template',
			props: {
				files: Array
			},
		});

		var rootComp = Vue.extend({
			components: {
				'thumb-item': thumbComp,
				'accord-item': ctntComp,
			}
		});

		Vue.component('root-item', rootComp);

		new Vue({
			el: '#contentWrapper'
		});

		//		var ctnt = new Vue({
		//			el: ".panel-body",
		//			data: {
		//				files: this._contentData
		//			}
		//		});
		//
		//		var vmAccordion = new Vue({
		//			el: "#contentLeft",
		//			data: {
		//				files: contentData,
		//			},
		//			ready: function() {
		//				var accordion = new Accordion($('#leftNavigation'), false);
		//			}
		//		});

	}
	return module;
})