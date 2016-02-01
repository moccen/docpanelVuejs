define("myVueComponent", ["vue", "jquery", "underscore"], function(Vue, $, _) {
  var module = {};
  var _contentData = {};
  module.init = function(contentData) {

    this._contentData = contentData[0].nodes;

    //文件面板控件
    var thumbCompnt = Vue.extend({
      template: '#thumb-template',
      props: ['files', 'clickPath'],
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
        contentClickHandler: function(item) {
          var nodeId = item.id;
          var isflder = item.isFlder;
          var paths = this.$parent.paths;
          this.constructPath(nodeId);
          // alert("the node ID is " + nodeId + " node is folder:" + paths.length);
        },
        constructPath: function(nodeId) {
          this.$parent.paths.push(nodeId);
        },
        //点击某个图标后触发更新事件
        updateBread: function(node) {
          if (node.isFlder) {
            this.files = node.nodes;
            this.clickPath.push(node);
            this.$dispatch('update-fromThumb', node);
          }
        }
      },
      events: {
        backParentLevel: function() {

        }
      }
    });

    //手风琴控件
    var accordCompnt = Vue.extend({
      template: '#accord-template',
      props: ['files', 'paths'],
      events: {
        'update-bread': function(node) {
          if (node) {
            this.paths.push(node.text || node.id);
          }
          //alert('change-path fired from accordCompnt! the node id is ' + nodeId);
        }
      }
    });

    //路径导航控件
    var breadcrumbCompnt = Vue.extend({
      template: '#breadcrumb-template',
      props: ['paths'],
      methods: {
        updateData: function(nodeId) {
          alert("the breadcrumb id is " + nodeId);
        }
      },
      events: {
        'update-bread': function(node) {
          //alert('change-path fired from breadcrumbCompnt! the node id is ' + nodeId);
          //this.$parent.paths.push(nodeId);
          if (node.isFlder) {
            var nodeTxt = node.text || node.id;
            this.paths.push(nodeTxt);
          }
        },
        'backParentLevel': function() {
          this.paths.pop();
        }
      }
    });

    new Vue({
      el: '#contentWrapper',
      data: {
        files: this._contentData,
        paths: [],
        clickPath: {}//todo:clickPath算法
      },
      ready: function() {
        var accordion = new Accordion($('#leftNavigation'), false);
      },
      events: {
        'update-fromThumb': function(nodeId) {
          //alert('change-paths from parent!');
          this.handleIt(nodeId);
          //this.$broadcast('update-bread', nodeId);
          //					this.$refs.breadcrumb.updateData(nodeId);
        }
      },
      components: {
        'thumb-item': thumbCompnt,
        'accord-item': accordCompnt,
        'breadcrumb-item': breadcrumbCompnt
      },
      methods: {
        handleIt: function(node) {
          //alert('testDispatch is fired!');
          //var nodeId = node.id;
          this.$broadcast('update-bread', node);
        },
        backBtnHandler: function() {
          this.$broadcast('backParentLevel');
        }
      }
    });
  };
  return module;
});
