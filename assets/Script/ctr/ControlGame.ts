import { _decorator, Camera, Component, geometry, log, Node, PhysicsSystem, RigidBody, tween, Vec2, Vec3, view } from 'cc';
import { tableScr } from '../model/table';
import { DataManager } from '../data/DataManager';
import { block } from '../model/block';
import { wallGate } from '../model/wallGate';
import super_html_playable from '../plugin/super_html_playable';
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
    @property({ type: Node })
    wall: Node = null;
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
        t.loadPosBlock()
    }

    loadPosBlock() {
        let t = this
        t.blocks.children.forEach(e => {
            t.block = e;
            t.posCorrect = t.block.getPosition(new Vec3);
            t.addMoreDataInMAp()
        })
    }



    onTouchStart(event) {
        let t = this;
        if (t.eventBlock) {
            return;
        }
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
                t.addMoreDataInMAp(false)

            } else {
                return
            }
            t.lastPos = new Vec3(hitPoint.x, 0, hitPoint.z);
        } else {
            t.block = null;
            return
        }
    }

    lastPos = null;

    onTouchMove(event) {
        let t = this;
        if (t.block == null || t.eventBlock) {
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

            let xCor: number = t.checkCol(xz.col);
            let zCor: number = t.checkRow(xz.row);
            if (t.CPOBWM(xCor, zCor)) {
                if (xCor % 2 != 0 && zCor % 2 != 0) {
                    log(xCor, zCor)
                    t.posCorrect = tempTable.getPositionbyXY(zCor, xCor)
                }
                t.block.setPosition(posNew)
            }
        }
    }

    onTouchEnd(event) {
        let t = this;
        if (t.block != null && !t.eventBlock) {
            t.addMoreDataInMAp()
            t.ADDBBT(false);
        }
    }

    onTouchCancel(event) {
        let t = this;
        if (t.block != null && !t.eventBlock) {
            t.addMoreDataInMAp()
            t.ADDBBT(false);
        }
    }


    // anim drop drae block by touch
    ADDBBT(isDrop: boolean) {
        let t = this;
        tween(t.block)
            .by(0.05, { worldPosition: new Vec3(0, isDrop ? 3 : -3, 0) })
            .call(() => {
                if (!isDrop) {
                    t.block.setPosition(t.posCorrect);
                }
                t.block.getChildByName("around").active = isDrop;
                t.eventBlock = false;
            })
            .delay(0.1)
            .call(() => {
            })
            .start();
    }


    checkCol(x: number) {

        if (x % 1 < 0.2) {
            return Math.floor(x);
        } else if (x % 1 > 0.8) {
            return Math.ceil(x);
        }
        return Math.round(x);
    }

    checkRow(z: number) {
        if (z % 1 < 0.2) {
            return Math.floor(z);
        } else if (z % 1 > 0.8) {
            return Math.ceil(z);
        }
        return Math.round(z);
    }

    // caculation position of block when moving
    CPOBWM(row: number, col: number) {
        let t = this;
        let typeBlock = DataManager.instance.shades[t.block.getComponent(block).typeShade];
        let checkTwo = 0;
        for (let i = 0; i < typeBlock.length; i++) {
            for (let j = 0; j < typeBlock[i].length; j++) {
                if (typeBlock[i][j] == 1) {
                    let r = row + j;
                    let c = col + i;
                    if (r >= t.table.getComponent(tableScr).numberCol
                        || c >= t.table.getComponent(tableScr).numberRow
                        || r < 0
                        || c < 0) {
                        return false;
                    }
                    if (DataManager.instance.mapGame[c][r] == t.block.getComponent(block).typeColor) {
                        checkTwo++
                    }
                    if (checkTwo == 2) {
                        t.eventDoneGate(t.block.getComponent(block).typeColor);
                        t.wall.getComponent(wallGate).activeGate(DataManager.instance.mapGame[c][r] - 2, 0.5, (typeBlock.length * typeBlock[i].length))
                        return false;
                    }
                    if (DataManager.instance.mapGame[c][r] != 0 && checkTwo == 0) {
                        return false;
                    }
                }
            }
        }
        return true
    }

    addMoreDataInMAp(isAdd: boolean = true) {
        let t = this;
        let typeBlock = DataManager.instance.shades[t.block.getComponent(block).typeShade];
        let xz = t.table.getComponent(tableScr).getRawXYbyPosition(t.posCorrect)
        for (let i = 0; i < typeBlock.length; i++) {
            for (let j = 0; j < typeBlock[i].length; j++) {
                if (typeBlock[i][j] == 1) {
                    let r = Math.round(xz.col) + j;
                    let c = Math.round(xz.row) + i;
                    DataManager.instance.mapGame[c][r] = isAdd ? 1 : 0;
                }
            }
        }
    }

    eventDoneGate(n: number, countCell: number = 4) {
        let t = this;
        let startPos = t.block.getWorldPosition(new Vec3());
        let forward = t.wall.getComponent(wallGate).getForwarOfGateById(n - 2);
        let targetPos = startPos.add(forward.multiplyScalar(-2));
        t.eventBlock = true;
        tween(t.block)
            .to(0.25, { worldPosition: new Vec3(targetPos.x, -8.5, targetPos.z) })
            .call(() => {
                t.block.destroy();
                t.block = null;
                DataManager.instance.countDone++;
                if (DataManager.instance.countDone == 3) {
                    t.enventEndGame()
                } else {
                    t.eventBlock = false;
                }
            })
            .start();


    }
    enventEndGame() {
        let t = this;
        super_html_playable.game_end();
        super_html_playable.download()
    }





    update(deltaTime: number) {

    }



}

