import { _decorator, BoxCollider, Component, instantiate, ITriggerEvent, log, Material, MeshRenderer, Node, Prefab, RigidBody, tween, Vec3 } from 'cc';
import { block } from './block';
import { DataManager } from '../data/DataManager';
const { ccclass, property } = _decorator;

@ccclass('wallGate')
export class wallGate extends Component {

    @property({ type: Node })
    Gates = [];
    // index+2
    @property({ type: Material })
    mat = [];

    @property({ type: Prefab })
    dropBlock: Node = null;

    gateHasEvent = -1;


    activeGate(idGate: number, timeAnim: number = 0, numBlock: number = 4) {
        let t = this;
        let gate: Node = t.Gates[idGate];
        let matGate = t.mat[idGate];
        let timeStep = timeAnim / (numBlock * 3);
        for (let i = 0; i < numBlock * 3; i++) {
            let bl = instantiate(t.dropBlock);
            bl.getChildByName("mesh").getComponent(MeshRenderer).setMaterial(matGate, 0);
            let f = gate.forward.multiplyScalar(-(3000 + Math.random() * 17000));
            let randomX = (Math.random() - 0.5) * 0.5;
            f.x += randomX * Math.abs(f.z)
            let to = new Vec3((Math.random() - 0.5) * 15, (Math.random() - 0.5) * 15, (Math.random() - 0.5) * 15)
            tween(bl)
                .delay(timeStep * (i / 3))
                .call(() => {
                    gate.addChild(bl);
                    bl.setPosition(new Vec3((Math.random() - 0.5), 0, 0))
                    bl.getComponent(RigidBody).applyForce(f)
                    bl.getComponent(RigidBody).applyTorque(to)
                })
                .delay(2)
                .call(() => {
                    bl.destroy()
                })
                .start()

        }
    }

    getForwarOfGateById(idGate: number) {
        let t = this;
        if (idGate >= t.Gates.length) {
            return null;
        }
        return t.Gates[idGate].forward
    }

    getGateById(idGate: number) {
        let t = this;
        return t.Gates[idGate]
    }
    start() {
        // let t = this;
        // t.Gates.forEach(gate => {
        //     let check = gate?.getChildByName("check");
        //     if (check) {
        //         check.getComponent(BoxCollider).on('onTriggerEnter', this.var, this); 
        //         log("2")
        //     }
        // });
    }


    var(event: ITriggerEvent) {
        let other = event.otherCollider.node;
        if (other && other?.getComponent(block)) {
            if (DataManager.instance.codeColor[other.getComponent(block).typeColor - 2] == event.selfCollider.node.name) {
                this.gateHasEvent = other.getComponent(block).typeColor - 2;
            }
        }
    }





    update(deltaTime: number) {

    }
}

