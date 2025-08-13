import { _decorator, Camera, Component, geometry, log, Node, PhysicsSystem, RigidBody, tween, Vec2, Vec3, view } from 'cc';
import { tableScr } from '../model/table';
import { DataManager } from '../data/DataManager';
import { block } from '../model/block';
const { ccclass, property } = _decorator;

@ccclass('ControlGame')
export class ControlGame extends Component {

    @property({ type: Camera })
    CamMain: Camera = null;
    @property({ type: Node })
    screne2d: Node = null;
    @property({ type: Node })
    table: Node = null;
    @property({ type: Node })
    blocks: Node = null;
    block: Node = null;
    eventBlock: boolean = false;
    posCorrect: Vec3 = null;


    start() {
        let t = this;
        t.registerEventOfCam()
        view.on("canvas-resize", () => {
            t.resize();
        });
        t.resize();
    }

    resize() {
    }

    registerEventOfCam() {
        let t = this;
        t.screne2d.on(Node.EventType.TOUCH_START, t.onTouchStart, t, true);
        t.screne2d.on(Node.EventType.TOUCH_MOVE, t.onTouchMove, t, true);
        t.screne2d.on(Node.EventType.TOUCH_END, t.onTouchEnd, t, true);
        t.screne2d.on(Node.EventType.TOUCH_CANCEL, t.onTouchCancel, t, true);
    }


    onTouchStart(event) {
        let t = this;
        const touches = event.getAllTouches();
        const camera = t.CamMain.getComponent(Camera);
        let ray = new geometry.Ray();
        camera.screenPointToRay(event.getLocationX(), event.getLocationY(), ray);
        const mask = 0xffffffff;
        const maxDistance = 10000000;
        const queryTrigger = true;
        const bResult = PhysicsSystem.instance.raycastClosest(ray, mask, maxDistance, queryTrigger);
        if (bResult) {
            const raycastClosestResult = PhysicsSystem.instance.raycastClosestResult;
            const hitPoint = raycastClosestResult.hitPoint
            const collider = raycastClosestResult.collider;
            if (collider.node) {
                t.eventBlock = true;
                t.block = collider.node;
                t.ADDBBT(true);
                t.posCorrect = t.block.getPosition(new Vec3);
            } else {
                return
            }
            t.lastPos = new Vec3(hitPoint.x, 0, hitPoint.z);
        } else {
            t.lastPos = null;
            return
        }
    }

    lastPos = null;
    onTouchMove(event) {
        let t = this;
        if (t.block == null && !t.eventBlock) {
            return;
        }
        const camera = t.CamMain.getComponent(Camera);
        let ray = new geometry.Ray();
        camera.screenPointToRay(event.getLocationX(), event.getLocationY(), ray);
        const mask = 0xffffffff;
        const maxDistance = 10000000;
        const queryTrigger = true;

        const bResult = PhysicsSystem.instance.raycast(ray, mask, maxDistance, queryTrigger);
        if (bResult) {
            const results = PhysicsSystem.instance.raycastResults;
            const hitPoint = results[0].hitPoint;
            let delta = new Vec3(hitPoint.x - t.lastPos.x, 0, hitPoint.z - t.lastPos.z);
            t.lastPos = new Vec3(hitPoint.x, 0, hitPoint.z);




            let posNew = t.block.getPosition(new Vec3).add(delta);
            let tempTable = t.table.getComponent(tableScr);
            let xz = tempTable.getRawXYbyPosition(posNew);

            t.CPOBWM(xz.row, xz.col);



            let xCor: number = t.checkCol(xz.col);
            let zCor: number = t.checkRow(xz.row);
            t.posCorrect = tempTable.getPositionbyXY(zCor, xCor)
            t.block.setPosition(posNew)

            // if (t.CCBIM(xCor, zCor)) {
            //     t.posCorrect = tempTable.getPositionbyXY(zCor, xCor);
            //     t.block.setPosition(posNew);
            // } else {
            //     t.block.setPosition(t.posCorrect);
            //     t.ADDBBT(false);
            // }



            // let pos = t.CPBWM(t.block.getPosition(new Vec3).add(delta));
            // t.block.setPosition(pos);

            // let pos = t.block.getWorldPosition(new Vec3).add(delta);
            // t.CPBWM(pos);
            // t.block.setWorldPosition(t.block.getWorldPosition(new Vec3).add(delta));

        }
    }

    onTouchEnd(event) {
        let t = this;

        if (t.block != null && !t.eventBlock) {
            t.ADDBBT(false);
            // t.scheduleOnce(() => {
            //     t.block = null;
            // }, 0.3);
        }
    }

    onTouchCancel(event) {
        let t = this;

        if (t.block != null && !t.eventBlock) {
            t.ADDBBT(false);
            // t.scheduleOnce(() => {
            //     t.block = null;
            // }, 0.2);

        }
    }


    // anim drop drae block by touch
    ADDBBT(isDrop: boolean) {
        let t = this;
        tween(t.block)
            .by(0.1, { worldPosition: new Vec3(0, isDrop ? 1.5 : -1.5, 0) })
            // .to(0, { position: t.posCorrect })
            .call(() => {
                if (!isDrop) {
                    // log(t.block, "check")
                    t.block.setPosition(t.posCorrect);
                    // t.block = null;
                }
                t.eventBlock = false;

            })
            .delay(0.1)
            .call(() => {
                // if (!isDrop) { t.block = null; }
            })
            .start();
    }

    // check pos block when moving
    CPBWM(position: Vec3) {
        let t = this;
        let tempTable = t.table.getComponent(tableScr);
        let xz = tempTable.getRawXYbyPosition(position);
        let xCor: number = t.checkCol(xz.col);
        let zCor: number = t.checkRow(xz.row);
        // z=row x=col

        // t.posCorrect = tempTable.getPositionbyXY(zCor, xCor);

        // if (t.CCBIM(xCor, zCor)) {
        //     t.posCorrect = tempTable.getPositionbyXY(zCor, xCor);
        //     return position;
        // } else {
        //     return t.posCorrect;

        // }


        // while (!t.CCBIM(xCor, zCor)) {
        //     let tempXY = tempTable.goHeadCell(xCor, zCor);
        //     if (tempXY == null) {
        //         log("No more space to move block");
        //         t.posCorrect = tempTable.getPositionbyXY(zCor, xCor);

        //         return t.posCorrect;
        //     }
        //     xCor = tempXY.col;
        //     zCor = tempXY.row;
        //     t.posCorrect = tempTable.getPositionbyXY(zCor, xCor);
        // }


        // return position;



    }


    checkCol(x: number) {
        let t = this;
        let rs: number = x;
        if (x < 0) {
            rs = 0;
            return 0
        } else if (rs > t.table.getComponent(tableScr).numberCol - 1) {
            rs = t.table.getComponent(tableScr).numberCol - 1;
            return rs;
        }
        //  else if (rs % 1 > 0.8) {
        //     rs = Math.ceil(x);
        // } else if (rs % 1 < 0.2) {
        //     rs = Math.floor(x);
        // }
        return Math.round(rs);
    }

    checkRow(z: number) {
        let t = this;
        let rs: number = z;
        if (z < 0) {
            rs = 0;
            return 0
        } else if (rs > t.table.getComponent(tableScr).numberRow - 1) {
            rs = t.table.getComponent(tableScr).numberRow - 1;
            return rs;
        }
        //  else if (rs % 1 > 0.8) {
        //     rs = Math.ceil(z);
        // } else if (rs % 1 < 0.2) {
        //     rs = Math.floor(z);
        // }
        return Math.round(rs);
    }

    //Check Case Block In Map
    CCBIM(x, z) {
        let t = this;
        let tempMap = DataManager.instance.mapGame;
        let typeBlock = DataManager.instance.shades[t.block.getComponent(block).typeShade];
        let typeColor = t.block.getComponent(block).typeColor;
        // log("CCBIM", x, z, typeBlock);
        for (let i = 0; i < typeBlock.length; i++) {
            for (let j = 0; j < typeBlock[i].length; j++) {
                if (typeBlock[i][j] == 1) {
                    let row = z + i;
                    let col = x + j;
                    if (row > t.table.getComponent(tableScr).numberRow
                        || col > t.table.getComponent(tableScr).numberCol) {
                        return false;
                    }
                    log("check", row, col, DataManager.instance.mapGame[row][col], typeColor)
                    if (DataManager.instance.mapGame[row][col] < 0) {
                        return false;
                    }
                    tempMap[row][col] = typeColor
                }
            }
        }
        DataManager.instance.mapGame = tempMap;
        return true;
    }

    // caculation position of block when moving
    CPOBWM(row: number, col: number) {
        let t = this
        let typeBlock = DataManager.instance.shades[t.block.getComponent(block).typeShade];
        for (let i = 0; i < typeBlock.length; i++) {
            for (let j = 0; j < typeBlock[i].length; j++) {
                if (typeBlock[i][j] == 1) {
                    let r = row + i;
                    let c = col + j;
                    if (r >= t.table.getComponent(tableScr).numberRow
                        || c >= t.table.getComponent(tableScr).numberCol
                        || r < 0
                        || c < 0) {
                        // t.block.setPosition(t.posCorrect);
                        log("Out of map", r, c);
                        return;
                    }
                }
            }
        }
        log("in of map");
        // t.posCorrect = t.table.getComponent(tableScr).getPositionbyXY(row, col);
        // t.block.setPosition(t.posCorrect)
    }




    update(deltaTime: number) {

    }



}

