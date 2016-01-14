define("myVue", ["vue", "jquery"], function(Vue, $) {
	var module = {};
	var _contentData = {};
	module.init = function(contentData) {
		this._contentData = contentData;
		
		var vmContent = new Vue({
			el: "#content",
			data: {
				files: contentData
			},
			computed: {
				nailSrc: function(fileType, src) {
					return this.getSrc(fileType, src);
				}
			},
			//						case "img":
			//							return "/XZQHWebServer/readFile?filePath=" + encodeURI(encodeURI(src)) + "*thumbnail";
			//							break;
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
				contentClickHandler:function(nodeId){
					alert("the node ID is "+nodeId);
				}
			}
		});
		 

		var vmAccordion = new Vue({
			el: "#leftNavigation",
			data: {
				files: contentData,
				items: contentData.nodes
			},
		});
		Vue.nextTick(function() {
			var accordion = new Accordion($('#leftNavigation'), false);

		})
	}

	return module;
})