/**
 * SnakeSir
 * @type {{obj: string, init: SnakeSir.init, clientSize: SnakeSir.clientSize}}
 */
var SnakeSir = {

    // jquery object
    canvas: null,
    // dom object
    context: null,
    // 屏幕文档高宽对象
    clientSize: null,

    /**
    * 初始化
    * @param objName 对象ID名
    */
    init: function(objName) {

        this.canvas = $('#' + objName);

        // 获取屏幕高宽
        this.getClientSize();
        // 设置画布大小
        this.canvas.attr('width', this.clientSize.clientWidth - 20);
        this.canvas.attr('height', this.clientSize.clientHeight - 20);

        // 画图
        this.context = this.canvas[0].getContext('2d');
        this.context.fillStyle = '#ff0000';
        this.context.fillRect(100, 100, 100, 100);
    },

    /**
     * 屏幕/文档/滚动宽高
     */
    getClientSize: function() {

        var result = {};
        result['scrollTop'] = window.self.document.documentElement.scrollTop ?
            window.self.document.documentElement.scrollTop: window.self.document.body.scrollTop;
        result['scrollHeight'] = window.self.document.documentElement.scrollHeight ?
            window.self.document.documentElement.scrollHeight: window.self.document.body.scrollHeight;
        result['clientHeight'] = window.self.document.documentElement.clientHeight ?
            window.self.document.documentElement.clientHeight: window.self.document.body.clientHeight;
        result['clientWidth'] = window.self.document.documentElement.clientWidth ?
            window.self.document.documentElement.clientWidth: window.self.document.body.clientWidth;

        this.clientSize = result;
    }
};