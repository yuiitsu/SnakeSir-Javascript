/**
 * SnakeSir
 * @type {{canvas: null, context: null, clientSize: null, snakeLength: number, snakeBodyWidth: number, init: SnakeSir.init, initSnake: SnakeSir.initSnake, drawSnakeBody: SnakeSir.drawSnakeBody, getClientSize: SnakeSir.getClientSize}}
 */
var SnakeSir = {

    // jquery object
    canvas: null,
    // dom object
    context: null,
    // 屏幕文档高宽对象
    clientSize: null,
    // 起始蛇身长度
    snakeLength: 5,
    // 默认蛇身高宽
    snakeBodyWidth: 20,
    // 蛇身栈对象
    snake: [],
    // 食物坐标
    foodPosition: {},
    // 蛇移动方向
    direction: 'r',
    // 默认速度
    defaultSpeed: 5,
    // 默认颜色
    defaultColor: '#000',
    // 游戏中
    gaming: false,
    // 吃到食物
    getFood: false,

    /**
    * 初始化
    * @param objName 对象ID名
    */
    init: function(objName) {

        this.canvas = $('#' + objName);

        // 获取屏幕高宽
        this.getClientSize();
        // 设置画布大小
        this.canvas.attr('width', this.clientSize.clientWidth);
        this.canvas.attr('height', this.clientSize.clientHeight - 300);
        // 获取绘图对象
        this.context = this.canvas[0].getContext('2d');

        // 初始化蛇
        this.initSnake();
        // 显示开始
        this.showStart();
        // 监听控制
        this.control();
    },

    /**
     * 显示开始界面
     */
    showStart: function() {

    },

    /**
     * 初始化蛇
     */
    initSnake: function() {

        this.snake = [];
        this.foodPosition = {};
        this.direction = 'r';
        this.gaming = false;
        this.getFood = false;

        var startPosition = {
            'x': 100,
            'y': 100
        };
        for (var i = this.snakeLength - 1; i >= 0; i--) {
            var xPosition = startPosition.x - i * this.snakeBodyWidth;
            var yPosition = startPosition.y;
            // 蛇身入栈
            this.snake.push({
                'x': xPosition,
                'y': yPosition
            });
        }

        this.drawScreen();
    },

    /**
     * 绘制一个蛇身
     * @param x x轴坐标
     * @param y y轴坐标
     * @param color 颜色
     */
    drawSnakeBody: function(x, y, color) {

        this.context.fillStyle = color ? color : this.defaultColor;
        this.context.fillRect(x, y, this.snakeBodyWidth, this.snakeBodyWidth);
    },

    /**
     * 清除一个蛇身
     * @param x x坐标
     * @param y y坐标
     */
    removeSnakeBody: function(x, y) {

        // 遍历蛇身,仅在此坐标为蛇尾时清除它
        var clearStatus = true;
        // 当前蛇身长度
        var snakeLen = this.snake.length;
        for (var i = 0; i < snakeLen; i++) {
            if (x == this.snake[i].x && y == this.snake[i].y) {
                clearStatus = false;
            }
        }

        if (clearStatus) {
            this.context.clearRect(x, y, this.snakeBodyWidth, this.snakeBodyWidth);
        }
    },

    /**
     * 绘制屏幕
     */
    drawScreen: function() {
        // 清屏
        this.context.clearRect(0, 0, this.clientSize.clientWidth, this.clientSize.clientHeight);
        // 绘制蛇
        for (var i in this.snake) {

            var xPosition = this.snake[i].x;
            var yPosition = this.snake[i].y;
            this.drawSnakeBody(xPosition, yPosition);
        }
    },

    /**
     * 倒计时
     */
    countDown: function() {

        var _this = this;
        var count = 1;
        var o = $('#count_down');

        o.text(count).show();
        var timer = setInterval(function() {
            if (count > 0) {
                count--;
                count = count == 0 ? 'GO!': count;
                o.text(count);
            } else {
                clearInterval(timer);
                o.hide();
                _this.gaming = true;
                _this.showFood();
                _this.move();
            }
        }, 1000);
    },

    /**
     * 显示食物
     */
    showFood: function() {

        var _this = this;
        var create = function() {
            // 横向点数
            var xNum = Math.floor(_this.clientSize.clientWidth / _this.snakeBodyWidth);
            // 纵向点数
            var yNum = Math.floor((_this.clientSize.clientHeight - 300) / _this.snakeBodyWidth);
            // 随机横坐标
            var _x = Math.floor(Math.random() * (xNum - 2)) * _this.snakeBodyWidth;
            // 随机纵坐标
            var _y = Math.floor(Math.random() * (yNum - 2)) * _this.snakeBodyWidth;

            // 检查坐标是否在蛇身上,如果是,重新生成
            var status = true;
            for (var i in _this.snake) {
                if (_x == _this.snake[i].x && _y == _this.snake[i].y) {
                    status = false;
                    break;
                }
            }

            if (!status) {
                create();
            } else {
                _this.foodPosition = {
                    'x': _x,
                    'y': _y
                };
                // 绘制图型
                _this.drawSnakeBody(_x, _y, '#ff0000');
            }
        };

        create();
    },

    /**
     * 检查是否吃到食物
     * @param snakeHeadPosition 蛇头坐标
     */
    eat: function(snakeHeadPosition) {

        if (snakeHeadPosition.x == this.foodPosition.x && snakeHeadPosition.y == this.foodPosition.y) {
            // 吃到
            this.getFood = true;
            // 重新生成食物
            this.showFood();
        }
    },

    /**
     * 移动
     */
    move: function() {

        var _this = this;
        var speed = this.defaultSpeed;
        var gameOverStatus = false;
        var run = function() {

            if (speed <= 0) {
                speed = _this.defaultSpeed;
            } else {

                if (speed == _this.defaultSpeed) {
                    // 下一点位置
                    var nextPosition = _this.getNextPosition();
                    // 检测game over
                    gameOverStatus = _this.checkGameOver(nextPosition);
                    if (!gameOverStatus) {
                        // 在蛇头前增加一个蛇身
                        _this.snake.push(nextPosition);
                        // 蛇头添加新蛇头
                        _this.drawSnakeBody(nextPosition.x, nextPosition.y);
                        // 检查是否吃到食物
                        _this.eat(nextPosition);
                        // 清除蛇尾
                        if (!_this.getFood) {
                            // 从身蛇栈尾移除一个蛇身
                            var snakeLastBody = _this.snake.shift();
                            _this.removeSnakeBody(snakeLastBody.x, snakeLastBody.y);
                        } else {
                            _this.getFood = false;
                        }
                    }

                }
                speed--;
            }

            if (!gameOverStatus) {
                requestAnimationFrame(run);
            }
        };

        requestAnimationFrame(run);
    },

    /**
     * 获取下一点位置
     */
    getNextPosition: function() {

        var nextPosition = {
            'x': 0,
            'y': 0
        };
        var snakeHeadBody = this.snake[this.snake.length - 1];
        switch (this.direction) {
            case "u":
                // 上
                nextPosition.x = snakeHeadBody.x;
                nextPosition.y = snakeHeadBody.y - this.snakeBodyWidth;
                break;
            case "r":
                // 右
                nextPosition.x = snakeHeadBody.x + this.snakeBodyWidth;
                nextPosition.y = snakeHeadBody.y;
                break;
            case "d":
                // 下
                nextPosition.x = snakeHeadBody.x;
                nextPosition.y = snakeHeadBody.y + this.snakeBodyWidth;
                break;
            case "l":
                // 左
                nextPosition.x = snakeHeadBody.x - this.snakeBodyWidth;
                nextPosition.y = snakeHeadBody.y;
        }

        return nextPosition;
    },

    /**
     * 监听控制
     */
    control: function() {

        var _this = this;

        // 监听开始
        $('#start').click(function() {
            $('#map').show();
            $('#start_box').removeClass("start_box_show").addClass('start_box_hidden');
            _this.countDown();
        });

        var action = function(direction) {
            if (_this.gaming) {
                _this.direction = direction;
            }
        };

        // 监听方向控制
        $('.control').each(function() {
            var direction = $(this).attr('data-direction');
            $(this)[0].addEventListener("touchstart", function(event) {
                event.preventDefault();
                action(direction);
            });

            $(this)[0].addEventListener("mousedown", function(event) {
                event.preventDefault();
                action(direction);
            });
        });
    },

    /**
     * 检测game over
     * @param snakeHeadPosition 位置
     */
    checkGameOver: function(snakeHeadPosition) {

        var status = false;
        for (var i in this.snake) {
            if (snakeHeadPosition.x == this.snake[i].x && snakeHeadPosition.y == this.snake[i].y) {
                // game over
                status = true;
                // 显示失败界面
                this.gameOver();
                break;
            }
        }

        return status;
    },

    /**
     * 游戏结束
     */
    gameOver: function() {

        $('#logo').text('Game Over');
        $('#start_box').removeClass('start_box_hidden').addClass('start_box_show');
        //this.
        this.initSnake();
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