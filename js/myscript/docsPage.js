/**
 *
 */
(function(func) {
	if (typeof define === "function" && define.amd) {
		define("docPager", ["jquery", "underscore", "fuzzyPinyin", "accordion", "bootstrap"], function($, _, fuzzyPinyin, Accordion) {
			window["docPager"] = func($, _, fuzzyPinyin, Accordion)
			return window.docPager;
		})
	} else {
		window["docPager"] = func(jQuery);
	}

})(function($, _, fuzzyPinyin, Accordion) {
	var $ = $ || window.$,
		_ = _ || window._,
		fuzzyPinyin = fuzzyPinyin || window.fuzzyPinyin,
		Accordion = Accordion || window.Accordion;

	var gVals = {};
	gVals.gValDict = {};
	gVals.gValId;
	var $parent = $(window.parent.document);
	var $imgGallery = $parent.find("#imgallery");
	var module = {};
	module.init = function(treeData) {
		gVals.Datas = treeData;
		gVals.gValDict = {};


		$("#backBtn").click(
			function() {
				var backNodeId = $("#breadcrumb").children()
					.children("a:last").attr("nodeId");
				if (backNodeId)
					docPager.updateData(backNodeId);
			});

		buildAccordion2();
		var accordion = new Accordion($('#leftNavigation'), false);

	};

	function buildAccordion2() {
		$("#leftNavigation").empty();
		var accordionStr = "<li>";
		_.each(gVals.Datas, function(val, key, list) {
			accordionStr += buildSubMenu(val);
		});
		$("#leftNavigation").append(accordionStr);
	}

	function buildAccordion() {
		$("#accordion").empty();
		var accordionStr = "";
		_.each(gVals.Datas, function(val, key, list) {
			accordionStr += buildPanel(val);
		});
		$("#accordion").append(accordionStr);
	};

	function buildPanel(panel) {
		var panelId = panel.text;
		var panelStr = "<div class='panel panel-default'>";
		panelStr += "<div class='panel-heading'>";
		panelStr += '<p class="panel-title">';
		panelStr += '<a class="accordion-toggle" data-toggle="collapse" data-parent="#accordion" href="#' + panelId + '">' + panelId + '</a></p></div>';
		panelStr += '<div id="' + panelId + '" class="panel-collapse collapse"><div class="panel-body">';
		if (panel.nodes) {
			_.each(
				panel.nodes,
				function(val, key, list) {
					var txtItem = val.text;
					panelStr += '<a href="#" class="list-group-item" onclick="docPager.updateData(' + val.id + ');docPager.addActive(this)">' + txtItem + "</a>";
				});
		}
		panelStr += "</div></div></div>";

		return panelStr;
	}

	function buildSubMenu(panel) {
		var panelId = panel.text;

		var panelStr = '<div class="link">' + panelId + '<i class="glyphicon glyphicon-chevron-down"></i></div>';
		panelStr += '<ul class="submenu">';
		if (panel.nodes) {
			_.each(panel.nodes, function(val, key, list) {
				var txtItem = val.text;
				panelStr += '<li><a href="#" onclick="docPager.updateData(' + val.id + ');docPager.addActive(this)">' + txtItem + "</a></li>";
			});
		}
		panelStr += "</ul></li>";
		return panelStr;
	}

	module.addActive = function(e) {
		removeActive(e);
		$(e).addClass("activeSubMenu");
		$(e).css("color", "#FFFFFF");
	};

	function removeActive(e) {
		$(".submenu a").removeClass("activeSubMenu");
		$(".submenu a").css("color", "");
	}

	module.updateData = function(nodeId) {

		updateContent(nodeId);
		updateBreadCrumb(nodeId);
		gVals.gValId = nodeId;
	};

	function updateContent(nodeId) {

		if (!gVals.gValDict[nodeId]) {
			findNode(nodeId, gVals.Datas);
		}
		var nodeclicked = gVals.gValDict[nodeId];
		if (nodeclicked) {
			var nodes = nodeclicked.nodes;
			buildContent(nodeclicked.nodes, nodeclicked.href);
			
		} else {
			alert("��Ŀ¼��û���ļ���");
		}
	}

	function buildContent(nodes, flderHref) {
		if (!nodes) {
			$("#content").empty();
			return;
		}
		$("#content").empty();
		var thumbStr = "";
		var counter = 0;
		_.each(_.sortBy(nodes, function(val) {
			return val.fileType
		}), function(val, key, list) {
			if (key % 6 == 0) {
				thumbStr += "<div class='row'>";
				counter++;
			}
			thumbStr += buildThumbnail(val, flderHref);
			if (key + 1 == 6 * counter) {
				thumbStr += "</div>";
			}
		});
		$("#content").append(thumbStr);
	}

	function buildThumbnail(nail, flderHref) {
		if (!nail.href && flderHref)
			nail.href = flderHref + "\\" + nail.text;
		if (!nail.href && !flderHref) {
			var parent = getNode(nail.parentId);
			nail.href = parent.href + "\\" + nail.text;
		}
		var nailStr = '<div class="col-sm-6 col-md-2"><div style="padding:0px;cursor:pointer;width:80px;height:65px;margin-left:auto;margin-right:auto;text-align:center;box-shadow:3px 4px 3px" class="thumbnail" onclick="docPager.contentClickHandler(' + nail.id + ')"' + getModalStr(nail.fileType) + '>';
		nailStr += '<img style="width:80px;height:65px" src="' + getThumbImg(nail.fileType, nail.href) + '" alt="' + nail.text + '"></div>';
		nailStr += '<div class="caption" style="text-align:center;font-size:14px"><p style="cursor:pointer" onclick="docPager.contentClickHandler(' + nail.id + ')">' + nail.text + '</p></div></div>';

		return nailStr;
	}

	function getModalStr(fileType) {
		if (fileType == "img" || fileType == "video") {
			return 'data-toggle="modal" data-target="#imgModal"';
		} else {
			return "";
		}
	}

	function getThumbImg(fileType, src) {
		switch (fileType) {
			case "text":
			case "unknown":
				return "./img/file.png";
				break;
			case "img":
				return "/XZQHWebServer/readFile?filePath=" + encodeURI(encodeURI(src)) + "*thumbnail";
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
	}

	function getNode(nodeId) {
		if (!gVals.gValDict[nodeId]) {
			findNode(nodeId, gVals.Datas);
		}
		return gVals.gValDict[nodeId];
	}

	function findNode(nodeId, datas) {
		if (datas.nodes) {
			if (datas.id && datas.id == nodeId) {
				gVals.gValDict[nodeId] = datas;
			} else {
				_.each(datas.nodes, function(val, key, list) {
					if (val.id && val.id == nodeId) {
						gVals.gValDict[nodeId] = val;
					} else if (val.nodes && val.nodes.length > 0) {
						findNode(nodeId, val.nodes);
					}
				});
			}
		} else {
			_.each(datas, function(val, key, list) {
				if (val.id && val.id == nodeId) {
					gVals.gValDict[nodeId] = val;
				} else if (val.nodes && val.nodes.length > 0) {
					findNode(nodeId, val.nodes);
				}
			});
		}
	}

	function updateBreadCrumb(lastNodeId) {
		var $breadcrumb = $("#breadcrumb").empty();
		var stack = [];
		var lastNode = getNode(lastNodeId);
		stack.push(lastNode);
		setParentStack(lastNode, stack);
		var crumbStr = "";
		var nodeItem = stack.pop();
		while (nodeItem) {
			crumbStr += '<li><a href="#" nodeId="' + nodeItem.id + '" onclick="docPager.updateData(' + nodeItem.id + ')" style="color:#3878D1">' + nodeItem.text + '</a></li>';
			nodeItem = stack.pop();
		}
		$breadcrumb.append(crumbStr);

		var lastA = $breadcrumb.children("li:last")
			.addClass("active").children("a");
		var lastTxt = lastA.text();
		var lastNodeId = lastA.attr("nodeId");
		$breadcrumb.children("li:last").text(lastTxt).attr("nodeId", lastNodeId);
	}

	function setParentStack(lastNode, stack) {
		if (lastNode.parentId) {
			var parentNode = getNode(lastNode.parentId);
			if (parentNode) {
				stack.push(parentNode);
				setParentStack(parentNode, stack);
			}
		}
	}

	module.contentClickHandler = function(nodeId) {
		var nodeClicked = getNode(nodeId);
		if (!nodeClicked) return;
		if (nodeClicked.isFlder) {
			docPager.updateData(nodeId);
		} else {
			if (nodeClicked.fileType == "img") {
				var parentNode = getNode(nodeClicked.parentId);
				$(window.parent.$("#imgModal")).modal();
				openUniteGallery(parentNode);
			} else if (nodeClicked.fileType == "video") {
				$(window.parent.$("#imgModal")).modal();
				openVideo2(nodeClicked);
			} else if (nodeClicked.fileType == "pdf") {
				window.pdfURL = "/XZQHWebServer/getpdfile?filePath=" + encodeURI(encodeURI(nodeClicked.href));
				window.open("/XZQHWebServer/js/lib/pdfjs/web/viewer.html", "�ļ�Ԥ��");
			} else if (nodeClicked.href.match(/[.](txt)$/)) {
				var encodedURL = "/XZQHWebServer/readFile?filePath=" + encodeURI(encodeURI(nodeClicked.href));
				window.open(encodedURL, "Ԥ��");
			} else {
				comfirmDownload(encodeURI(encodeURI(nodeClicked.href)));
			}

		}
	};

	function comfirmDownload(encodedURL) {
		encodedURL = "/XZQHWebServer/downloadFile?filePath=" + encodedURL;
		var r = confirm("��ȷ��Ҫ������ѡ�ļ���");
		if (r == true) {
			window.open(encodedURL, "����");
		}
	}

	function openVideo(node) {
		$imgGallery.empty();
		var vedioStr = "/XZQHWebServer/getMP4File?filePath=" + node.href;
		var galleryStr = "<img alt='Html5 Video' data-type='html5video' src='../img/clapperboard.png' data-image='../img/clapperboard.png' data-description='" + node.text + "' data-videomp4='" + vedioStr + "'>";
		$imgGallery.append(galleryStr);
		$imgGallery.unitegallery();
	}

	function openVideo2(node) {
		$imgGallery.empty();
		$imgGallery.removeClass("ug-gallery-wrapper").removeClass("ug-under-960").removeClass("ug-theme-default");
		var lsplit = node.href.lastIndexOf("\\");
		var flderPath = node.href.substring(0, lsplit);
		var fileName = node.href.substring(lsplit + 1);
		var mp4Str = "/XZQHWebServer/getMP4File?filePath=" + encodeURI(encodeURI(node.href.replace(/mov|mp4|psd|wav|flv|mp3|swf|avi|wma|wmv|html|rm|webm/, "mp4")));
		var oggStr = "/XZQHWebServer/getMP4File?filePath=" + encodeURI(encodeURI(node.href.replace(/mov|mp4|psd|wav|flv|mp3|swf|avi|wma|wmv|html|rm|webm/, "ogv")));
		var webmStr = "/XZQHWebServer/getMP4File?filePath=" + encodeURI(encodeURI(node.href.replace(/mov|mp4|psd|wav|flv|mp3|swf|avi|wma|wmv|html|rm|webm/, "webm")));
		var galleryStr = '<video id="videoPlayer" class="video-js vjs-default-skin" controls preload="auto" style="position: relative;z-index:9999;width:800px;height:640px;text-align:center;margin-left:auto;margin-right:auto;" width="640" height="400" poster="img/videothumb.png" data-setup="{\'language\':\'zh\'}">';
		galleryStr += "<source src='" + mp4Str + "' type='video/mp4'/>";
		galleryStr += "<source src='" + oggStr + "' type='video/ogg'/>";
		galleryStr += "<source src='" + webmStr + "' type='video/webm'/>";
		galleryStr += '<p class="vjs-no-js">������JavaScript�Բ鿴��Ƶ��<a href="http://videojs.com/html5-video-support/" target="_blank">��ʹ��֧��HTML5���������</a></p></video>';
		$imgGallery.append(galleryStr).show();
	}

	function openUniteGallery(parentNode) {
		var imgNodes = _.where(parentNode.nodes, {
			fileType: "img"
		});
		var galleryStr = "";
		if (imgNodes) {
			$imgGallery.empty();
			_.each(imgNodes, function(val, key, list) {
				var srcStr = "/XZQHWebServer/readFile?filePath=" + encodeURI(encodeURI(val.href));
				galleryStr += "<img alt='' style='width: 80px;' src='" + srcStr + "' data-image='" + srcStr + "' data-description='" + val.text + "'>";
			});

			$imgGallery.append(galleryStr);
			parent.window.uniteGallery();
		}
	}

	var kWordFlag = "";
	module.search = function(kword) {
		if (kword === kWordFlag) return;
		searchResult = [];
		kWordFlag = kword;
		if (kword === "") {
			return; //do nothing
		} else {
			findNodes(gVals.Datas, kword, 'gi');
			var noFolder = _.filter(searchResult, function(val) {
				return !val.isFlder
			});
			buildContent(_.sortBy(noFolder, function(val) {
				return val.fileType
			}));
		}
	}


	var searchResult = []; 
	function findNodes(datas, pattern, modifier, attri) {
		modifier = modifier || "gi";
		attri = attri || "text";
		_.each(datas, function(val) {
			var nodeVal = docPager.getNodeVal(val, attri);
			if (typeof nodeVal === "string") {
				if (fuzzyPinyin.isMatch(nodeVal, pattern, modifier)) {
					searchResult.push(val);
				}
			}
			if (val.nodes) {
				findNodes(val.nodes, pattern, modifier, attri);
			}
		});
	}

	module.getNodeVal = function(obj, attr) {
		var index = attr.indexOf('.');
		if (index > 0) {
			var _obj = obj[attr.substring(0, index)];
			var _attr = attr.substring(index + 1, attr.length);
			return this.getNodeValue(_obj, _attr);
		} else {
			if (obj.hasOwnProperty(attr)) {
				return obj[attr].toString();
			} else {
				return undefined;
			}
		}
	}

	function getCurHref() {
		var flderId = $("#breadcrumb li.active").attr("nodeid");
		var node = getNode(flderId);
		var href = node ? node.href || undefined : undefined;
		return {
			href: href,
			flderId: flderId
		};
	}

	module.uploadFile = function(e, btn) {
		var breadInfo = getCurHref();
		var path = breadInfo.href;
		$('#progress .progress-bar').css('width', 0);
		$("#fileupload").unbind("click");
		if (path) {
			var url = "/XZQHWebServer/upload?filePath=" + encodeURI(encodeURI(path.replace(/\\/g, "\\\\")));
			$(btn).fileupload({
				url: url,
				secureuri: false,
				dataType: 'json',
				maxFileSize: 5242880,
				done: function(e, data) {
					var flderId = breadInfo.flderId;
					docPager.updateAccord(flderId);
				},
				progressall: function(e, data) {
					var progress = parseInt(data.loaded / data.total * 100, 10);
					$('#progress .progress-bar').css(
						'width',
						progress + '%'
					);
				}
			}).prop('disabled', !$.support.fileInput).parent().addClass($.support.fileInput ? undefined : 'disabled');
		} else {
			e.preventDefault();
			alert("��ָ���ϴ��ļ�Ŀ¼��");
		}
	}

	module.updateAccord = function(nodeId) {
		$.ajax({
			url: "/XZQHWebServer/getDocs",
			dataType: 'json',
			type: 'post',
			success: function(data) {
				gVals.Datas = data[0].nodes;
				gVals.gValDict = {};
				$('#progress .progress-bar').css('width', 0);

				buildAccordion2();
				var accordion = new Accordion($('#leftNavigation'), false);
				if (nodeId) {
					docPager.updateData(nodeId);
				}
			},
			error: function() {
				console.log("getDocs��ѯ���?");
			}
		});
	}

	return module;
});