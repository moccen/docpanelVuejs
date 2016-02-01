define("myVue", ["vue", "jquery"], function(Vue, $) {
	var module = {};
	var _contentData = {};
	module.init = function(contentData) {
		this._contentData = contentData;

		//		var DocThumbComponent = Vue.extend({
		//			template: '<img style="width:80px;height:65px" v-bind:src="getSrc(file.fileType,file.href)" v-on:click="contentClickHandler(file.id)"/>'
		//		});
		//
		//		Vue.component('thumb-component', DocThumbComponent);
		//
		//		new Vue({
		//			el: '#content'
		//		});

		Vue.component('thumb-item',{
			template:'#thumb-template',
			props:{
				files:Array
			},
			methods: {
				getSrc: function(fileType, src) {
					switch (fileType) {
						case "text":
						case "unknown":
							return "./img/file.png";
						case "dwg":
							return "./img/cad.png";
						case "video":
							return "./img/video.png";
						case "pdf":
							return "./img/pdf.png";
						default:
							return "./img/folder.png";
					}
				},
				contentClickHandler: function(nodeId) {
					alert("the node ID is " + nodeId);
				}
			},
		});

		var ctnt = new Vue({
			el:".panel-body",
			data:{
				files:this._contentData
			}
		});



//		var vmContent = new Vue({
//			el: "#content",
//			data: {
//				files: contentData
//			},
//			computed: {
//				nailSrc: function(fileType, src) {
//					return this.getSrc(fileType, src);
//				}
//			},
//			//						case "img":
//			//							return "/XZQHWebServer/readFile?filePath=" + encodeURI(encodeURI(src)) + "*thumbnail";
//			//							break;
//			methods: {
//				getSrc: function(fileType, src) {
//					switch (fileType) {
//						case "text":
//						case "unknown":
//							return "./img/file.png";
//							break;
//
//						case "dwg":
//							return "./img/cad.png";
//							break;
//						case "video":
//							return "./img/video.png";
//							break;
//						case "pdf":
//							return "./img/pdf.png";
//							break;
//						default:
//							return "./img/folder.png";
//					}
//				},
//				contentClickHandler: function(nodeId) {
//					alert("the node ID is " + nodeId);
//				}
//			},
//			template: '<img style="width:80px;height:65px" v-bind:src="getSrc(file.fileType,file.href)" v-on:click="contentClickHandler(file.id)"/>'
//
//		});

		var vmAccordion = new Vue({
			el: "#leftNavigation",
			data: {
				files: contentData,
				items: contentData.nodes
			},
			ready: function() {
				var accordion = new Accordion($('#leftNavigation'), false);
			}
		});

//		Vue.nextTick(function() {
//			var accordion = new Accordion($('#leftNavigation'), false);
//		});

	};

	return module;
});
