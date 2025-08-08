import { _decorator, Component, log, Node, Vec3 } from 'cc';
import { DataManager } from '../data/DataManager';
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
        t.numberRow = ((t.row[1] - t.row[0]) / 4.1) + 1;
        t.numberCol = ((t.col[1] - t.col[0]) / 4.1) + 1;
        tempMap = Array.from({ length: t.numberRow }, () => Array(t.numberCol).fill(-1));
        t.node.children.forEach(e => {
            let pos = e.getWorldPosition(new Vec3());
            let r = Math.round((pos.z - t.row[0]) / 4.1);
            let c = Math.round((pos.x - t.col[0]) / 4.1);
            tempMap[r][c] = 0;
        })
        log(tempMap);
        DataManager.instance.mapGame = tempMap;
    }

    checkIndexTable(pos: Vec3) {
        let t = this;
        let r = Number(((pos.z - t.row[0]) / 4.1).toFixed(0))
            + (((pos.z - t.row[0]) % 4.1 > 0.8) ? -1 : 0)
            + (((pos.z - t.row[0]) % 4.1 > 0.2) ? 1 : 0);
        let c = Number(((pos.x - t.col[0]) / 4.1).toFixed(0))
            + (((pos.x - t.col[0]) % 4.1 > 0.8) ? -1 : 0)
            + (((pos.x - t.col[0]) % 4.1 > 0.2) ? 1 : 0);
        return { row: r, col: c };
    }

}

