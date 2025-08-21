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

}

