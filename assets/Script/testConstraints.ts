import { _decorator, Camera, Component, log, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('testConstraints')
export class testConstraints extends Component {
    @property({ type: Node })
    screne2d: Node = null;

    @property(Camera)
    camera: Camera = null; // Reference to the 3D camera

    @property(Node)
    targetNode: Node = null; // The 3D node to drag

    private isDragging: boolean = false;
    private offset: Vec3 = new Vec3();

    start() {
        // Register touch/mouse events
        this.screne2d.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.screne2d.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.screne2d.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    onTouchStart(event) {
        if (!this.camera || !this.targetNode) return;

        log("run1")
        // Convert screen touch to world position
        const touchPos = event.getLocation();
        const worldPos = this.camera.screenToWorld(new Vec3(touchPos.x, touchPos.y, 0));
        const targetPos = this.targetNode.getWorldPosition();

        // Check if the touch is near the target (simple hit test)
        let temp = Vec3.distance(worldPos, targetPos)

        if (temp < 40) { // Adjust threshold as needed
            this.isDragging = true;
            this.offset = Vec3.subtract(new Vec3(), targetPos, worldPos);
        }
    }

    onTouchMove(event) {
        if (!this.isDragging || !this.camera || !this.targetNode) return;
        log("run2")
        // Convert screen touch to world position
        const touchPos = event.getLocation();
        let worldPos = this.camera.screenToWorld(new Vec3(touchPos.x, touchPos.y, 0));
        log(worldPos)
        // Apply offset
        worldPos = Vec3.add(new Vec3(), worldPos, this.offset);

        // Apply constraints (e.g., restrict to XZ plane, keep Y constant)
        worldPos.y = this.targetNode.getWorldPosition().y; // Lock Y-axis

        // Optional: Additional constraints (e.g., limit within bounds)
        // worldPos.x = math.clamp(worldPos.x, -5, 5); // Restrict X to [-5, 5]
        // worldPos.z = math.clamp(worldPos.z, -5, 5); // Restrict Z to [-5, 5]

        // worldPos.x = worldPos.x * 1.1;
        // worldPos.z = worldPos.z * 1.1


        // Update position
        // this.targetNode.setWorldPosition(worldPos);



    }

    onTouchEnd(event) {
        this.isDragging = false;
        log("run3")
    }

    onDestroy() {
        // Clean up event listeners
        this.screne2d.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.screne2d.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.screne2d.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }
}

