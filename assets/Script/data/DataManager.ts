import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('DataManager')
export class DataManager extends Component {
    private static _instance: any = null;
    static getInstance<T>(): T {
        if (this._instance === null) {
            this._instance = new this()
        }
        return this._instance
    }

    static get instance() {
        return this.getInstance<DataManager>()
    }

    countDone = 0;

    mapGame = null;
    squader1 = [[1, 1], [1, 1]];
    shadesL = [[1, 1, 1, 1], [1, 1, 1, 1], [1, 1, 0, 0], [1, 1, 0, 0]];
    shadesCross = [[0, 0, 1, 1, 0, 0], [0, 0, 1, 1, 0, 0], [1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1], [0, 0, 1, 1, 0, 0], [0, 0, 1, 1, 0, 0]]
    shadesT = [[0, 0, 1, 1], [0, 0, 1, 1], [1, 1, 1, 1], [1, 1, 1, 1], [0, 0, 1, 1], [0, 0, 1, 1]];
    squader2 = [[1, 1], [1, 1], [1, 1], [1, 1]];
    squader3 = [[1, 1, 1, 1], [1, 1, 1, 1]];
    //r 12 c 8
    shades = [this.squader1, this.squader2, this.squader3];

    codeColor = ["blue", "green", "orange", "pink", "red", "yellow"]

    // smell code
    xzSpecial = [
        [{ col: 11, row: 7 }, { col: 9, row: 7 }],//blue
        [{ col: 5, row: 7 }, { col: 5, row: 5 }],//gree
        [{ col: 1, row: 7 }, { col: 1, row: 7 }],//ora
        [{ col: 1, row: 1 }, { col: 1, row: 1 }],//pi
        [{ col: 11, row: 1 }, { col: 9, row: 1 }], //re
        [{ col: 5, row: 1 }, { col: 5, row: 1 }],//ye
    ]
    posSpecial = [
        [{ col: 12, row: 7 }, { col: 10, row: 7 }],//blue
        [{ col: 5, row: 8 }, { col: 5, row: 6 }],//gree
        [{ col: 0, row: 7 }, { col: 0, row: 7 }],//ora
        [{ col: 0, row: 1 }, { col: 0, row: 1 }],//pi
        [{ col: 12, row: 1 }, { col: 10, row: 1 }], //re
        [{ col: 5, row: 0 }, { col: 5, row: 0 }],//ye
    ]
}

