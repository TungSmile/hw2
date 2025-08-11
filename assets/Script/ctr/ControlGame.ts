import { _decorator, Camera, Component, geometry, log, Node, PhysicsSystem, RigidBody, tween, Vec2, Vec3, view } from 'cc';
import { tableScr } from '../model/table';
import { DataManager } from '../data/DataManager';
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
            let pos = t.CPBWM(t.block.getWorldPosition(new Vec3).add(delta));
            t.block.setWorldPosition(pos);

        }
    }

    onTouchEnd(event) {
        let t = this;
        if (t.block != null) {
            t.block.setWorldPosition(t.posCorrect);
            t.ADDBBT(false);
            t.block = null;
        }
    }

    onTouchCancel(event) {
        let t = this;
        if (t.block != null) {
            t.block.setWorldPosition(t.posCorrect);
            t.ADDBBT(false);
            t.block = null;
        }
    }


    // anim drop drae block by touch
    ADDBBT(isDrop: boolean) {
        let t = this;
        tween(t.block)
            .by(0.2, { position: new Vec3(0, isDrop ? 1 : -1, 0) })
            .call(() => {
                t.eventBlock = false;
            })
            .start();
    }

    // check pos block when moving
    CPBWM(position: Vec3) {
        let t = this;
        let xz = t.table.getComponent(tableScr).getRawXYbyPosition(position);
        let xCor: number = t.checkCol(xz.col);

        
        let zCor: number = t.checkRow(xz.row);
        let stop: boolean = false;
        // z=row x=col
        // xCor = Number(xCor.toFixed(0));
        // zCor = Number(zCor.toFixed(0));
        log("xz", xCor, zCor, "CPBWM");
        t.posCorrect = t.table.getComponent(tableScr).getPositionbyXY(zCor, xCor);
        return position;
        // if (xCor % 1 > 0.8) {
        //     xCor = Math.ceil(xCor);
        // }
        // if (xCor % 1 < 0.2) {
        //     xCor = Math.floor(xCor);
        // }

        // if (zCor % 1 > 0.8) {
        //     zCor = Math.ceil(zCor);
        // }
        // if (zCor % 1 < 0.2) {
        //     zCor = Math.floor(zCor);
        // }

        // if (xCor < 0) {
        //     stop = true;
        //     xCor = 0;
        // }
        // if (zCor < 0) {
        //     stop = true;
        //     zCor = 0;
        // }
        // if (xCor > t.table.getComponent(tableScr).numberCol - 1) {
        //     stop = true;
        //     xCor = t.table.getComponent(tableScr).numberCol - 1;
        // }
        // if (zCor > t.table.getComponent(tableScr).numberRow - 1) {
        //     stop = true;
        //     zCor = t.table.getComponent(tableScr).numberRow - 1;
        // }

        // if (DataManager.instance.mapGame[xCor][zCor] && DataManager.instance.mapGame[xCor][zCor] != 0) {
        //     stop = true;
        // }

        if (stop) {
            // let rs= t.table.getComponent(tableScr).getPositionbyXY(xCor, zCor);
            xCor = Number(xCor.toFixed(0));
            zCor = Number(zCor.toFixed(0));
            t.posCorrect = t.table.getComponent(tableScr).getPositionbyXY(zCor, xCor);
            log("posCorrect", t.posCorrect);
            return t.table.getComponent(tableScr).getPositionbyXY(zCor, xCor);
        } else {
            return position;
        }

    }


    checkCol(x: number) {
        let t = this;
        let rs: number = 0;
        if (x < 0) {
            rs = 0;
        } else if (x > t.table.getComponent(tableScr).numberCol - 1) {
            rs = t.table.getComponent(tableScr).numberCol - 1;
        } else if (x % 1 > 0.8) {
            rs = Math.ceil(x);
        } else if (x % 1 < 0.2) {
            rs = Math.floor(x);
        }
        return Math.round(rs);
    }

    checkRow(z: number) {
        let t = this;
        let rs: number = 0;
        if (z < 0) {
            rs = 0;
            return Math.round(rs)
        } else if (z > t.table.getComponent(tableScr).numberRow - 1) {
            rs = t.table.getComponent(tableScr).numberRow - 1;
            return Math.round(rs)
        } else if (z % 1 > 0.8) {
            rs = Math.ceil(z);
        } else if (z % 1 < 0.2) {
            rs = Math.floor(z);
        }
        return Math.round(rs);
    }

    update(deltaTime: number) {

    }



}

