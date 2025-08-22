import { _decorator, Component, log, Node, Vec3 } from 'cc';
import { DataManager } from '../data/DataManager';
import { ForTable } from '../data/Conf';
const { ccclass, property } = _decorator;

@ccclass('tableScr')
export class tableScr extends Component {
    row = [0, 0]
    col = [0, 0]
    numberRow: number = 0;
    numberCol: number = 0;


    start() {
        let t = this;
        t.getDataMap();
    }

    update(deltaTime: number) {

    }


    getDataMap() {
        let t = this;
        let tempMap: number[][] = [];
        t.node.children.forEach(e => {
            let pos = e.getWorldPosition(new Vec3());
            if (pos.z < t.row[0]) t.row[0] = pos.z;
            if (pos.z > t.row[1]) t.row[1] = pos.z;
            if (pos.x < t.col[0]) t.col[0] = pos.x;
            if (pos.x > t.col[1]) t.col[1] = pos.x;
        })
        t.numberRow = Number(((t.row[1] - t.row[0]) / 4.1).toFixed(0)) + 1;
        t.numberCol = Number(((t.col[1] - t.col[0]) / 4.1).toFixed(0)) + 1;

        tempMap = Array.from({ length: t.numberRow }, () => Array(t.numberCol).fill(-1));
        t.node.children.forEach(e => {
            let pos = e.getWorldPosition(new Vec3());
            let r = Math.round((pos.z - t.row[0]) / 4.1);
            let c = Math.round((pos.x - t.col[0]) / 4.1);
            switch (e.name) {
                case "box":
                    tempMap[r][c] = 0;
                    break;
                case "wall":
                    tempMap[r][c] = -1;
                    break;
                case "blue":
                    tempMap[r][c] = 2;
                    break;
                case "green":
                    tempMap[r][c] = 3;
                    break;
                case "orange":
                    tempMap[r][c] = 4;
                    break;
                case "pink":
                    tempMap[r][c] = 5;
                    break;
                case "red":
                    tempMap[r][c] = 6;
                    break;
                case "yellow":
                    tempMap[r][c] = 7;
                    break;
                default:
                    break;
            }





        })
        // log("Row:" + t.numberRow, "Col:" + t.numberCol, tempMap);
        DataManager.instance.mapGame = tempMap;
        log(tempMap)
    }






    getRawXYbyPosition(pos: Vec3) {
        let t = this;
        let r = (pos.z - t.row[0]) / 4.1;
        let c = (pos.x - t.col[0]) / 4.1;
        return { row: r, col: c };
    }

    getPositionbyXY(row: number, col: number) {
        let t = this;
        let pos = new Vec3();
        pos.z = ((t.row[0] * ForTable.rate) + (row * 41)) / ForTable.rate;
        pos.x = ((t.col[0] * ForTable.rate) + (col * 41)) / ForTable.rate;
        pos.y = 1.5;
        // log("checkz", pos.z, row, t.row[0]);
        return pos;
    }



}

