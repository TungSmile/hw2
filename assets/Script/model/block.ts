import { _decorator, CCInteger, Component, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('block')
export class block extends Component {
    @property
    typeColor: number = 0;
    @property
    typeShade: number = 0;

    start() {
        this.setScale()
    }


    setScale() {
        this.node.children[0].setScale(new Vec3(3.8, 3.8, 3))
    }
    update(deltaTime: number) {

    }
}

