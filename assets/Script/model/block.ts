import { _decorator, CCInteger, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('block')
export class block extends Component {
    @property
    typeColor: number = 0;
    @property
    typeShade: number = 0;

    start() {

    }

    update(deltaTime: number) {

    }
}

