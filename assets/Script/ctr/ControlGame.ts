import { _decorator, Camera, Component, geometry, log, Node, PhysicsSystem, RigidBody, Vec2, Vec3, view } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ControlGame')
export class ControlGame extends Component {

    @property({ type: Camera })
    CamMain: Camera = null;
    @property({ type: Node })
    screne2d: Node = null;
    block: Node = null;
    posOffSet: Vec2 = new Vec2();
    @property({ type: Node })
    testPointA: Node = null;
    @property({ type: Node })
    testPointB: Node = null;

    @property({ type: Node })
    itemTest: Node = null;


    @property({ type: Node })
    camtets: Node = null;
    rateCam: number = 0;

    start() {
        let t = this;
        t.registerEventOfCam()
        t.rateCam = t.camtets.getPosition(new Vec3).y
        view.on("canvas-resize", () => {
            t.resize();
        });
        t.resize();
    }

    resize() {
        console.log(this.camtets.getPosition(new Vec3).y);
    }

    registerEventOfCam() {
        let t = this;
        let tempTouch = t.screne2d.getChildByName("areaEventTouch");

        // tempTouch.on(Node.EventType.TOUCH_START, t.onTouchStart, t, true);
        // tempTouch.on(Node.EventType.TOUCH_MOVE, t.onTouchMove, t, true);
        // tempTouch.on(Node.EventType.TOUCH_END, t.onTouchEnd, t, true);
        // tempTouch.on(Node.EventType.TOUCH_CANCEL, t.onTouchCancel, t, true);


        tempTouch.on(Node.EventType.TOUCH_START, t.onTouchStart, t, true);
        tempTouch.on(Node.EventType.TOUCH_MOVE, t.onTouchMove, t, true);
        tempTouch.on(Node.EventType.TOUCH_END, t.testTouchEnd, t, true);
        tempTouch.on(Node.EventType.TOUCH_CANCEL, t.testTouchEnd, t, true);
    }



    testCons(e) {
        let t = this;
        let rigiTemp = t.testPointB.getComponent(RigidBody);
        rigiTemp.applyForce(Vec3.UP, new Vec3(0, 0, 500))
        log("run")

    }




    onTouchStart(event) {
        let t = this;
        t.actTest = true;
        const touches = event.getAllTouches();
        const camera = t.CamMain.getComponent(Camera);
        // // log(DataManager.instance.getLogCount())
        // // turn off hint zoom when play frist time after hint
        // if (DataManager.instance.countDone == 3) {
        //     // t.endHintZoom();
        // }
        // if (DataManager.instance.endGame || DataManager.instance.timeEvent) {
        //     return
        // }
        // // event zoom camera
        // if (touches.length >= 2) {
        //     const touch1 = touches[0].getLocation();
        //     const touch2 = touches[1].getLocation();
        //     t.initialDistance = Vec2.distance(touch1, touch2);
        //     t.isZoom = true;
        //     t.initialScale = t.CamMain.node.position.z
        //     return;
        // }

        // event raycast check obj
        let ray = new geometry.Ray();
        camera.screenPointToRay(event.getLocationX(), event.getLocationY(), ray);
        const mask = 0xffffffff;
        const maxDistance = 10000000;
        const queryTrigger = true;
        const bResult = PhysicsSystem.instance.raycastClosest(ray, mask, maxDistance, queryTrigger);
        if (bResult) {
            // const results = PhysicsSystem.instance.raycastResults;
            const raycastClosestResult = PhysicsSystem.instance.raycastClosestResult;
            const hitPoint = raycastClosestResult.hitPoint
            const collider = raycastClosestResult.collider;
            t.block = collider.node ? collider.node : null;

            t.lastPos = new Vec3(hitPoint.x, 0, hitPoint.z);
            // let temp = t.lastPos.subtract(new Vec3(-hitPoint.x, 0, -hitPoint.z));
            t.itemTest.setWorldPosition(new Vec3(hitPoint.x, 0, hitPoint.z))
            // log(hitPoint)
            // t.itemTest.setWorldPosition(hitPoint)
            // if (collider.node) {
            //     // if (t.checkCollider(collider.node)) {
            //     //     return;
            //     // }
            //     t.block = collider.node
            // }
        } else {
            t.lastPos = null;
            return
        }
    }


    // onTouchMove(event) {
    //     let t = this;
    //     const currentPos = event.getLocation();
    //     let touchs = event.getAllTouches();
    //     let touch1 = touchs[0];
    //     let del = touch1.getDelta();
    //     log(del, "move")
    //     // if (t.block == null) {
    //     //     log("stop");
    //     //     return;
    //     // }
    //     t.posOffSet.x = del.x / 100;
    //     t.posOffSet.y = del.y / 100;
    //     // let cam_pos = this.camera_base.getPosition();
    //     // cam_pos.x = cam_pos.x + t.posOffSet.x;
    //     // cam_pos.z = cam_pos.z + t.posOffSet.y;
    //     // this.camera_base.setPosition(cam_pos)

    //     let itemPos = t.testPointA.getPosition();
    //     //  t.block.getPosition();
    //     itemPos.x = itemPos.x + t.posOffSet.x;
    //     itemPos.z = itemPos.x + t.posOffSet.x;
    //     // t.block.setPosition(itemPos);
    //     t.testPointA.setPosition(itemPos);
    // }


    lastPos = null;
    onTouchMove(event) {
        let t = this;
        if (t.lastPos == null) {
            return;
        }
        // const currentPos = event.getLocation();
        // if (t.block == null) {
        //     return;
        // }
        // const deltaX = currentPos.x - t.lastPos.x;
        // const deltaY = currentPos.y - t.lastPos.y;
        // const worldPos = t.block.getWorldPosition();
        // const worldDelta = t.CamMain.screenToWorld(new Vec3(deltaX, 0, deltaY));
        // log(worldPos.x + worldDelta.x, worldPos.y, worldPos.z + worldDelta.y)
        // // t.block.setWorldPosition(worldPos.x + worldDelta.x, worldPos.y + worldDelta.y, worldPos.z);
        // t.lastPos = currentPos;

        const camera = t.CamMain.getComponent(Camera);
        let ray = new geometry.Ray();
        camera.screenPointToRay(event.getLocationX(), event.getLocationY(), ray);
        const mask = 0xffffffff;
        const maxDistance = 10000000;
        const queryTrigger = true;
        const bResult = PhysicsSystem.instance.raycastClosest(ray, mask, maxDistance, queryTrigger);
        if (bResult) {
            // const results = PhysicsSystem.instance.raycastResults;
            const raycastClosestResult = PhysicsSystem.instance.raycastClosestResult;
            const hitPoint = raycastClosestResult.hitPoint
            const collider = raycastClosestResult.collider;
            t.block = collider.node ? collider.node : null;
            let delta = new Vec3(hitPoint.x - t.lastPos.x, 0, hitPoint.z - t.lastPos.z);
            t.lastPos = new Vec3(hitPoint.x, 0, hitPoint.z);
            t.itemTest.setWorldPosition(t.itemTest.getWorldPosition(new Vec3).add(delta))


            // t.itemTest.setWorldPosition(hitPoint.x, 0, hitPoint.z);
            // if (collider.node) {
            //     // if (t.checkCollider(collider.node)) {
            //     //     return;
            //     // }
            //     t.block = collider.node
            // }
        }


    }





    onTouchEnd(event) {
        let t = this;
        log(event.getLocation(), "end")
        t.block = null;
    }

    onTouchCancel(event) {
        let t = this;
        log(event.getLocation(), "end")
        t.block = null;
    }


    actTest: boolean = false;
    posTest: Vec2 = new Vec2();
    testTouchStart(e) {
        let t = this;
        t.actTest = true;
    }



    testTouchMoving(e) {
        let t = this;
        if (!t.actTest) {
            return;
        }


        let touches = e.getAllTouches();
        let touch1 = touches[0];
        let deltal1 = touch1.getDelta();
        t.posTest.x = deltal1.x;
        t.posTest.y = deltal1.y;
        let itemPos = t.itemTest.getPosition();

        // xử lý lỗi moving theo hình tròn


        itemPos.x = itemPos.x + (t.posTest.x / 30);
        itemPos.z = itemPos.z - (t.posTest.y / 30);
        t.itemTest.setPosition(itemPos)
    }



    testTouchEnd(e) {
        let t = this;
        t.actTest = false;
        t.lastPos = null;
    }



    update(deltaTime: number) {

    }



}

