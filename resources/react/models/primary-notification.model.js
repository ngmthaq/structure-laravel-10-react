export class PrimaryNotificationModel {
    uid;
    variant;
    message;
    isOpen;

    constructor(uid, variant, notification) {
        this.uid = uid;
        this.variant = variant;
        this.notification = notification;
        this.isOpen = true;
    }

    hide() {
        this.isOpen = false;
    }
}
    