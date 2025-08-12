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
    mapGame = null;
    squader1 = [[1, 1], [1, 1]];
    shadesL = [[1, 1, 1, 1], [1, 1, 1, 1], [0, 0, 1, 1], [0, 0, 1, 1]];
    shadesCross = [[0, 0, 1, 1, 0, 0], [0, 0, 1, 1, 0, 0], [1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1], [0, 0, 1, 1, 0, 0], [0, 0, 1, 1, 0, 0]]
    shadesT = [[0, 0, 1, 1], [0, 0, 1, 1], [1, 1, 1, 1], [1, 1, 1, 1], [0, 0, 1, 1], [0, 0, 1, 1]];
    shades = [this.squader1, this.shadesL, this.shadesCross, this.shadesT];
}

