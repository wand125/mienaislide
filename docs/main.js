// phina.jsをグローバル領域に展開
phina.globalize();

//const SCREEN_WIDTH = 960;
//const SCREEN_HEIGHT = 600;

const MYSCENES = [
    {
        className: 'Title',
        label: 'title',
        nextLabel: 'game'
    },
    {
        className: 'Game',
        label: 'game',
        nextLabel: 'title'
    },
];

const FONT_FAMILY = "'Monaco', 'MS ゴシック' ";

const PIECE_SIZE = 128;

const MAX_TIME = 999000;
const MAX_MOVE = 9999;
const MAX_CHEAT = 9999;


//-------------
// Title scene
//-------------
phina.define('Title',{
    superClass: 'DisplayScene',
    init: function(){
        this.superInit({
            //width: SCREEN_WIDTH,
            //height: SCREEN_HEIGHT
        });
        this.backgroundColor = 'yellowgreen'
        let self = this;
        // タイトル
        let titleLabel = Label({
            text: "見えない\nスライドパズル\n魔改造 -Dual-",
            fill: 'white',
            stroke: 'darkslateblue',
            strokeWidth: 12,
            fontSize: 72,
            fontFamily: FONT_FAMILY
        }).addChildTo(this).setPosition(this.gridX.center(), this.gridY.center(-3));
        titleLabel.tweener
            .moveBy(0, -48, 2000, 'easeInOutCubic')
            .moveBy(0,  48, 2000, 'easeInOutCubic')
            .setLoop(true)
            .play();
        // 遊び方ボタン
        let howToButton = RectangleShape({
            width: (PIECE_SIZE - 16) * 2,
            height: 72,
            fill: 'slateblue',
            stroke: 'darkslateblue',
            strokeWidth: 12,
            cornerRadius: 10
        })// .addChildTo(this);
        howToButton.setInteractive(true);
        howToButton.onpointstart = function() {
            self.app.pushScene(HowToPlay());
        };
        Label({
            text: "遊び方",
            fill: 'white',
            fontSize: 32,
            fontFamily: FONT_FAMILY
        }).addChildTo(howToButton);

        const linkButton = RectangleShape({
            width: (PIECE_SIZE - 16) * 2,
            height: 72,
            fill: 'slateblue',
            stroke: 'darkslateblue',
            strokeWidth: 12,
            cornerRadius: 10
        }).addChildTo(this);
        linkButton.setInteractive(true);
        linkButton.onpointstart = function () {
            window.open('https://tsukatomo.github.io/mienaislide/');
        };
        Label({
            text: "本家リンク",
            fill: 'white',
            fontSize: 32,
            fontFamily: FONT_FAMILY
        }).addChildTo(linkButton);



        // スタートボタン(8)
        let start8Button = RectangleShape({
            width: (PIECE_SIZE - 16) * 2,
            height: 96,
            fill: 'darkorange',
            stroke: 'chocolate',
            strokeWidth: 12,
            cornerRadius: 10
        }).addChildTo(this);
        start8Button.setInteractive(true);
        start8Button.onpointstart = function() {
            self.exit({ puzzleSize: 3 });
        };
        Label({
            text: "８パズル",
            fill: 'white',
            fontSize: 32,
            fontFamily: FONT_FAMILY
        }).addChildTo(start8Button);
        // スタートボタン(15)
        let start15Button = RectangleShape({
            width: (PIECE_SIZE - 16) * 2,
            height: 96,
            fill: 'darkorange',
            stroke: 'chocolate',
            strokeWidth: 12,
            cornerRadius: 10
        }).addChildTo(this);
        start15Button.setInteractive(true);
        start15Button.onpointstart = function() {
            self.exit({ puzzleSize: 4 });
        };
        Label({
            text: "１５パズル",
            fill: 'white',
            fontSize: 32,
            fontFamily: FONT_FAMILY
        }).addChildTo(start15Button);
        //ボタン配置
        start8Button.setPosition(this.gridX.center(-4), this.gridY.center(3));
        start15Button.setPosition(this.gridX.center(4), this.gridY.center(3));
        // howToButton.setPosition(this.gridX.center(0), this.gridY.center(6));
        linkButton.setPosition(this.gridX.center(0), this.gridY.center(6));

        
    },
    update: function(app){
        /*
        var key = app.keyboard;
        if (key.getKeyDown('space')){
            this.exit();
        }
        */
    }
});

//-------------
// HowTo scene
//-------------
phina.define('HowToPlay',{
    superClass: 'DisplayScene',
    init: function(){
        this.superInit({
            //width: SCREEN_WIDTH,
            //height: SCREEN_HEIGHT
        });
        this.backgroundColor = 'rgba(0, 0, 0, 0.9)'
        let self = this;
        // 遊び方
        Label({
            text: "~遊び方~\n\n\n\n\nスライドパズルを完成させましょう。\n\nただし、ピースを動かした瞬間に\n書かれている数字が全て見えなくなります。\n\n最初の配置をよく覚えてから動かしましょう。\n\n数字を確認できるボタンもありますが、\nできるだけ使わずに解いてみましょう。",
            fill: 'white',
            fontSize: 24,
            fontFamily: FONT_FAMILY
        }).addChildTo(this).setPosition(this.gridX.center(0), this.gridY.center(-3));
        // 戻るボタン
        let backButton = RectangleShape({
            width: (PIECE_SIZE - 16) * 2,
            height: 72,
            fill: 'slateblue',
            stroke: 'darkslateblue',
            strokeWidth: 12,
            cornerRadius: 10
        }).addChildTo(this).setPosition(this.gridX.center(0), this.gridY.center(6));
        backButton.setInteractive(true);
        backButton.onpointstart = function() {
            self.exit();
        };
        Label({
            text: "戻る",
            fill: 'white',
            fontSize: 32,
            fontFamily: FONT_FAMILY
        }).addChildTo(backButton);
    },
    update: function(app){
        /*
        var key = app.keyboard;
        if (key.getKeyDown('space')){
            this.exit();
        }
        */
    }
});

//-------------
// Game scene
//-------------
phina.define('Game',{
    superClass: 'DisplayScene',
    init: function(param){
        this.superInit({
            //width: SCREEN_WIDTH,
            //height: SCREEN_HEIGHT
        });
        this.backgroundColor = 'yellowgreen';
        // this退避
        let self = this;
        // パズルサイズを前シーンから受け取る
        let puzzleSize = param.puzzleSize;
        // ピース配置の配列
        // 変数
        let time = 0;  // 経過時間
        let memoryTime = 0;  // 記憶時間
        let cheating = 0; // カンニング回数
        let isTimeCounting = false; // タイム計測中か否か
        let isCheating = true; // カンニング中か否か

        class Board {
            constructor(index) {
                this.index = index;
                this.piecePos = Array(puzzleSize * puzzleSize);
                this.piece = Array(puzzleSize * puzzleSize - 1);
                this.numLabel = Array(puzzleSize * puzzleSize - 1);
                this.moves = 0;
                this.clear = false;
            }
            hideNum() {
                for (let i = 0; i < this.numLabel.length; i++) {
                    this.numLabel[i].text = "?";
                }
                return;
            }
            showNum() {
                for (let i = 0; i < this.numLabel.length; i++) {
                    this.numLabel[i].text = i + 1;
                }
            }
            initPiece() {
                for (let i = 0; i < this.piecePos.length; i++) {
                    this.piecePos[i] = i;
                }
            }
            shufflePiece() {
                for (let i = 0; i < this.piecePos.length - 1; i++) {
                    let j = Random.randint(i, this.piecePos.length - 2);
                    [this.piecePos[i], this.piecePos[j]] = [this.piecePos[j], this.piecePos[i]];
                }
            }
            parityCheckAndModify(puzzleSize) {
                let numSwap = 0;
                // ピース配置をコピー
                const copy = this.piecePos.concat();
                // ソートを行い，入れ替え回数を計算する … numSwap
                for (let i = 0; i < copy.length; i++) {
                    if (copy[i] != i) {
                        let j = copy.indexOf(i);
                        [copy[i], copy[j]] = [copy[j], copy[i]];
                        numSwap++;
                    }
                }
                //console.log("numSwap = ", numSwap);
                // 空白マス（ピース配置配列の中で値が最大の要素）が右下から何マス離れているかを数える … distBlank
                const distX = (puzzleSize - 1) - this.piecePos.indexOf(puzzleSize * puzzleSize - 1) % puzzleSize;
                const distY = (puzzleSize - 1) - Math.floor(this.piecePos.indexOf(puzzleSize * puzzleSize - 1) / puzzleSize);
                const distBlank = distX + distY;
                //console.log("distBlank = ", distBlank);
                // numSwap と distBlank の偶奇が一致するなら解答可能．修正せずに終了
                if ((numSwap + distBlank) % 2 === 0) return;
                // 解答不可能なら"1"と"2"の位置を交換
                const index1 = this.piecePos.indexOf(1);
                const index2 = this.piecePos.indexOf(2);
                [this.piecePos[index1], this.piecePos[index2]] = [this.piecePos[index2], this.piecePos[index1]];
            }
            slide(puzzleSize, index) {
                if (this.clear) { return false; }
                const num = this.piecePos[index];
                console.log(this.index, index, num);
                const blankIndex = this.piecePos.indexOf(puzzleSize * puzzleSize - 1);
                const pieceIndex = this.piecePos.indexOf(num);
                //console.log(blankIndex, pieceIndex);
                // 横移動
                if (Math.floor(blankIndex / puzzleSize) === Math.floor(pieceIndex / puzzleSize)) {
                    // 左へ
                    if (blankIndex < pieceIndex) {
                        for (let i = blankIndex; i < pieceIndex; i++) {
                            [this.piecePos[i], this.piecePos[i + 1]] = [this.piecePos[i + 1], this.piecePos[i]];
                            if (this.moves < MAX_MOVE) { this.moves++; }
                        }
                    }
                    // 右へ
                    else {
                        for (let i = blankIndex; i > pieceIndex; i--) {
                            [this.piecePos[i], this.piecePos[i - 1]] = [this.piecePos[i - 1], this.piecePos[i]];
                            if (this.moves < MAX_MOVE) { this.moves++; }
                        }
                    }
                    return true;
                }
                // 縦移動
                else if ((blankIndex % puzzleSize) === (pieceIndex % puzzleSize)) {
                    // 上へ
                    if (blankIndex < pieceIndex) {
                        for (let i = blankIndex; i < pieceIndex; i += puzzleSize) {
                            [this.piecePos[i], this.piecePos[i + puzzleSize]] = [this.piecePos[i + puzzleSize], this.piecePos[i]];
                            if (this.moves < MAX_MOVE) { this.moves++; }
                        }
                    }
                    // 下へ
                    else {
                        for (let i = blankIndex; i > pieceIndex; i -= puzzleSize) {
                            [this.piecePos[i], this.piecePos[i - puzzleSize]] = [this.piecePos[i - puzzleSize], this.piecePos[i]];
                            if (this.moves < MAX_MOVE) { this.moves++; }
                        }
                    }
                    return true;
                }
                return false;
            }
            createPiece(parent) {
                for (let i = 0; i < this.piece.length; i++) {
                    this.piece[i] = RectangleShape({
                        width: PIECE_SIZE * 0.5 - 16,
                        height: PIECE_SIZE * 0.5 - 16,
                        fill: 'slateblue',
                        stroke: 'darkslateblue',
                        strokeWidth: 12,
                        //cornerRadius: 10
                    }).addChildTo(parent).setPosition(0, 0);
                    this.piece[i].x = this.getPositionByNumber(puzzleSize, this.piecePos.indexOf(i)).x;
                    this.piece[i].y = this.getPositionByNumber(puzzleSize, this.piecePos.indexOf(i)).y;
                    this.numLabel[i] = Label({
                        text: i + 1,
                        fill: 'white',
                        fontSize: 36,
                        fontFamily: FONT_FAMILY
                    }).addChildTo(this.piece[i]);
                }
            }
            movePiece(puzzleSize) {
                // ピースの位置を更新
                for (let j = 0; j < this.piece.length; j++) {
                    const moveToX = this.getPositionByNumber(puzzleSize, this.piecePos.indexOf(j)).x;
                    const moveToY = this.getPositionByNumber(puzzleSize, this.piecePos.indexOf(j)).y;
                    console.log(this.index, moveToX, moveToY);
                    this.piece[j].tweener
                        .moveTo(moveToX, moveToY, 100, 'easeInOutCubic') // 移動アニメーション
                        .play();
                }

            }
            get pieceSize() {
                return PIECE_SIZE * 0.5;
            }
            getPositionByNumber(puzzleSize, num) {
                // ピース配置グリッド
                const pieceGridX = Grid({
                    width: puzzleSize * this.pieceSize,
                    columns: puzzleSize,
                    offset: self.gridX.center() * (0.5+this.index) - (puzzleSize * this.pieceSize) / 2 + (this.pieceSize) / 2
                });
                const pieceGridY = Grid({
                    width: puzzleSize * this.pieceSize,
                    columns: puzzleSize,
                    offset: self.gridY.center() * 0.6 - (puzzleSize * this.pieceSize) / 2 + (this.pieceSize) / 2
                });
                // ピース位置を示す数値からピーズの座標を求める
                return {
                    x: pieceGridX.span(num % puzzleSize),
                    y: pieceGridY.span(Math.floor(num / puzzleSize)),
                };
            }
        }

        const game = {
            boards: [],
            manipulator: {
                piece: Array(puzzleSize * puzzleSize - 1),
                get pieceSize() {
                    return PIECE_SIZE;
                },
                getPositionByNumber(puzzleSize, num) {
                    // ピース配置グリッド
                    let pieceGridX = Grid({
                        width: puzzleSize * this.pieceSize,
                        columns: puzzleSize,
                        offset: self.gridX.center() - (puzzleSize * this.pieceSize) / 2 + (this.pieceSize) / 2
                    });
                    let pieceGridY = Grid({
                        width: puzzleSize * this.pieceSize,
                        columns: puzzleSize,
                        offset: self.gridY.center() * 1.4 - (puzzleSize * this.pieceSize) / 2 + (this.pieceSize) / 2
                    });
                    // ピース位置を示す数値からピーズの座標を求める
                    return {
                        x: pieceGridX.span(num % puzzleSize),
                        y: pieceGridY.span(Math.floor(num / puzzleSize)),
                    };
                },
                setPieceInteractive(bool) {
                    for (let i = 0; i < this.piece.length; i++) {
                        this.piece[i].setInteractive(bool);
                    }
                    return;
                }
            }
        }
        game.boards.push(new Board(0));
        game.boards.push(new Board(1));
        const board = new Board();

        // sprites
        let cheatingButton;
        let quitButton;

        // -------------------------------- function --------------------------------------//
        // ピース位置をシャッフルする
        // パリティチェックを行い，解答不能なら修正する


        // ピースをスライドする
        // ピースが揃っているかどうかチェック
        let clearCheck = function () {
            if (!game.boards.map((board)=>{
                if (board.clear) { return true; }
                for (let i = 0; i < board.piecePos.length - 1; i++) {
                    if (board.piecePos[i] != i) {return false;}
                }
                board=>board.showNum();
                for (let i = 0; i < game.manipulator.piece.length; i++) {
                    board.piece[i].fill = "darkorange";
                    board.piece[i].stroke = "chocolate";
                }
                board.clear = true;
                return true;
            }).every(e=>e)) {
                return false;
            }
            // 数字を表示
            game.boards.forEach(board=>board.showNum());
            // ピースを移動不能にして，色を変更
            game.manipulator.setPieceInteractive(false);
            for (let i = 0; i < game.manipulator.piece.length; i++) {
                game.manipulator.piece[i].fill = "darkorange";
                game.manipulator.piece[i].stroke = "chocolate";
            }
            // カンニングボタンを使用不能にし，下げる
            cheatingButton.setInteractive(false);
            cheatingButton.tweener
                .moveBy(0, 999, 400)
                .play();
            // 時間計測を停止
            isTimeCounting = false;
            // おめでとうラベル
            let cong = Label({
                text: "Congratulations!!",
                fill: 'white',
                stroke: 'darkslateblue',
                fontSize: 48,
                strokeWidth: 12,
                fontFamily: FONT_FAMILY,
            }).addChildTo(self).setPosition(self.gridX.center(), self.gridY.center());
            // 見た回数が０なら特別な表示に変更
            if (cheating === 0) {
                cong.text = "PERFECT!!!";
                cong.stroke = 'darkred';
            }
            cong.tweener
                .set({ alpha: 0.0 })
                .wait(500)
                .set({ alpha: 1.0 })
                .wait(50)
                .set({ alpha: 0.0 })
                .wait(50)
                .set({ alpha: 1.0 })
                .wait(300)
                .moveTo(self.gridX.center(), self.gridY.center(-4), 600, 'easeOutCubic')
                .play();
            // ツイートボタンとタイトルに戻るボタンを表示
            tweetButton.tweener
                .wait(1000)
                .moveTo(self.gridX.center(-4), self.gridY.center(6), 1000, 'easeOutCubic')
                .call(() => { tweetButton.setInteractive(true); })
                .play();
            titleButton.tweener
                .wait(1000)
                .moveTo(self.gridX.center(4), self.gridY.center(6), 1000, 'easeOutCubic')
                .call(() => { titleButton.setInteractive(true); })
                .play();
            return true;
        };
        // ピースのクリックイベントのオンオフを切り替え
        // ツイート文を生成＆ツイート
        let tweet = function () {
            let text = (cheating === 0) ? "一度も数字を見ずに" : cheating + "回数字を見て";
            text += (puzzleSize === 3) ? "8" : "15";
            text += "パズルをクリア！\n"
            text += "クリアタイム：" + (Math.floor(time / 10) / 100).toFixed(2) + "秒\n";
            text += "手数：" + board.moves;
            let url = phina.social.Twitter.createURL({
                text: text,
                hashtags: '見えないスライドパズル'
            });
            window.open(url, 'share window', 'width=480, height=320');
        };
        // ------------------------------------------------------------------------------------//

        game.boards.forEach(board => {
            // ピース配置の配列を初期化
            board.initPiece();
            // シャッフル
            board.shufflePiece();
            //console.log(piecePos);
            // パリティチェック
            board.parityCheckAndModify(puzzleSize);

            board.createPiece(this);
        });
        board.initPiece();

        //console.log(piecePos);
        // スプライトの設定
        for (let i = 0; i < game.manipulator.piece.length; i++) {
            game.manipulator.piece[i] = RectangleShape({
                width: PIECE_SIZE - 16,
                height: PIECE_SIZE - 16,
                fill: 'slateblue',
                stroke: 'darkslateblue',
                strokeWidth: 12,
                //cornerRadius: 10
            }).addChildTo(this).setPosition(0, 0);
            game.manipulator.piece[i].x = game.manipulator.getPositionByNumber(puzzleSize, board.piecePos.indexOf(i)).x;
            game.manipulator.piece[i].y = game.manipulator.getPositionByNumber(puzzleSize, board.piecePos.indexOf(i)).y;
            game.manipulator.piece[i].setInteractive(true);
            // クリックイベント
            game.manipulator.piece[i].onpointstart = function () {
                const index = board.piecePos.indexOf(i)
                board.slide(puzzleSize, index);
                // ピースをスライド（スライド失敗ならreturn）
                if (game.boards.map(board => {
                    if (board.slide(puzzleSize, index)) {
                        board.movePiece(puzzleSize);
                        return true;
                    }
                    return false;
                }).every(e=>!e)) {
                    return;
                }
                //console.log(piecePos);
                //　数字を隠す
                game.boards.forEach(board => board.hideNum());
                isCheating = false;
                cheatingLabel.fill = 'white';
                // 時間計測開始
                isTimeCounting = true;
                // ピースの位置を更新
                for (let j = 0; j < game.manipulator.piece.length; j++) {
                    const moveToX = game.manipulator.getPositionByNumber(puzzleSize, board.piecePos.indexOf(j)).x;
                    const moveToY = game.manipulator.getPositionByNumber(puzzleSize, board.piecePos.indexOf(j)).y;
                    game.manipulator.piece[j].tweener
                        .call(() => {
                            // クリック不可に
                            game.manipulator.setPieceInteractive(false);
                            cheatingButton.setInteractive(false);
                        })
                        .moveTo(moveToX, moveToY, 100, 'easeInOutCubic') // 移動アニメーション
                        .call(() => {
                            // 再びクリック可能に
                            game.manipulator.setPieceInteractive(true);
                            cheatingButton.setInteractive(true);
                        })
                        .call(() => { clearCheck(); }) // 成功判定
                        .play();
                }
            }

        }
        // カンニングボタン
        cheatingButton = RectangleShape({
            width: (PIECE_SIZE - 16) * 4,
            height: PIECE_SIZE - 16,
            fill: 'brown',
            stroke: 'darkred',
            strokeWidth: 12,
            cornerRadius: 10
        });
        // .addChildTo(this).setPosition(this.gridX.center(), this.gridY.center(6));

        let cheatingLabel = Label({
            text: "数字を見る",
            fill: 'white',
            fontSize: 36,
            fontFamily: FONT_FAMILY
        }).addChildTo(cheatingButton);
        cheatingButton.setInteractive(false);
        cheatingButton.onpointstart = function () {
            if (isCheating) {
                game.boards.forEach(board=>board.hideNum());
                isCheating = false;
            }
            else {
                if (cheating < MAX_CHEAT) cheating++;
                game.boards.forEach(board=>board.showNum());
                isCheating = true;
            }
            cheatingButton.tweener
                .scaleTo(0.90, 50)
                .scaleTo(1.00, 50)
                .play();
        }
        // 中断してタイトルに戻るボタン
        quitButton = RectangleShape({
            width: 48,
            height: 48,
            fill: 'brown',
            stroke: 'darkred',
            strokeWidth: 12,
        }).addChildTo(this).setPosition(48, 48);
        quitButton.setInteractive(true);
        quitButton.onpointstart = function () {
            self.exit();
        }
        Label({
            text: "←",
            fill: 'white',
            fontSize: 24,
            fontFamily: FONT_FAMILY
        }).addChildTo(quitButton);
        // 経過時間表示ラベル
        let timeLabel = Label({
            text: "時間\n" + (Math.floor(time / 10) / 100).toFixed(2) + "s",
            fill: 'darkslateblue',
            fontSize: 36,
            fontFamily: FONT_FAMILY
        }).addChildTo(this).setPosition(this.gridX.center(-3), this.gridY.center(-7.0));
        // 記憶時間表示タイム
        let memoryTimeLabel = Label({
            text: "記憶時間\n" + (Math.floor(memoryTime / 10) / 100).toFixed(2) + "s",
            fill: 'darkslategray',
            fontSize: 36,
            fontFamily: FONT_FAMILY
        }).addChildTo(this).setPosition(this.gridX.center(1), this.gridY.center(-7.0));
        // 手数表示ラベル
        let movesLabel = Label({
            text: "手数\n" + board.moves,
            fill: 'darkslateblue',
            fontSize: 36,
            fontFamily: FONT_FAMILY
        }).addChildTo(this).setPosition(this.gridX.center(5), this.gridY.center(-7.0));
        // カンニング数表示ラベル
        let cheatNumLabel = Label({
            text: "見た回数\n" + cheating,
            fill: 'darkred',
            fontSize: 36,
            fontFamily: FONT_FAMILY
        })
        // .addChildTo(this).setPosition(this.gridX.center(5), this.gridY.center(-5.5));
        // ツイートボタン
        let tweetButton = RectangleShape({
            width: (PIECE_SIZE - 16) * 2,
            height: PIECE_SIZE - 16,
            fill: '#00acee',
            stroke: 'white',
            strokeWidth: 12,
            cornerRadius: 10
        }).addChildTo(this).setPosition(this.gridX.center(-4), 1200);
        tweetButton.setInteractive(false);
        tweetButton.onpointstart = function () {
            tweet();
        };
        Label({
            text: "ツイート",
            fill: 'white',
            fontSize: 24,
            fontFamily: FONT_FAMILY
        }).addChildTo(tweetButton);
        // タイトルへ戻るボタン
        let titleButton = RectangleShape({
            width: (PIECE_SIZE - 16) * 2,
            height: PIECE_SIZE - 16,
            fill: 'slateblue',
            stroke: 'darkslateblue',
            strokeWidth: 12,
            cornerRadius: 10
        }).addChildTo(this).setPosition(this.gridX.center(4), 1200);
        titleButton.setInteractive(false);
        titleButton.onpointstart = function () {
            self.exit();
        };
        Label({
            text: "タイトルへ戻る",
            fill: 'white',
            fontSize: 24,
            fontFamily: FONT_FAMILY
        }).addChildTo(titleButton);


        // 毎フレーム更新
        this.update = function (app) {
            // 経過時間表示
            if (isTimeCounting) {
                time += app.deltaTime;
                if (time > MAX_TIME) time = MAX_TIME;
            }
            if (isCheating) {
                memoryTime += app.deltaTime;
                if (memoryTime > MAX_TIME) memoryTime = MAX_TIME;
                cheatingButton.fill = "darkorange";
                cheatingButton.stroke = "chocolate";
            }
            else {
                cheatingButton.fill = "brown";
                cheatingButton.stroke = "darkred";
            }
            timeLabel.text = "時間\n" + (Math.floor(time / 10) / 100).toFixed(2) + "s";
            memoryTimeLabel.text = "記憶時間\n" + (Math.floor(memoryTime / 10) / 100).toFixed(2) + "s";
            movesLabel.text = "手数\n" + board.moves;
            cheatNumLabel.text = "見た回数\n" + cheating;
            // キーボード
            /*
            var key = app.keyboard;
            if (key.getKeyDown('space')){
                this.exit();
            }
            */
        }
    }
});


//-------------------------
// M A I N
//-------------------------
phina.main(function () {
    var app = GameApp({
        startLabel: 'title',
        //assets: ASSETS,
        //width: SCREEN_WIDTH,
        //height: SCREEN_HEIGHT,
        fit: true,
        scenes: MYSCENES,
        fps: 30
    });
    //app.enableStats();
    app.run();
})
