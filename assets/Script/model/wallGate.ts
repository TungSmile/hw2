import { _decorator, Component, instantiate, log, Material, MeshRenderer, Node, Prefab, RigidBody, tween, Vec3 } from 'cc';
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

    }

    update(deltaTime: number) {

    }
}

