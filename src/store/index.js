import { defineStore } from 'pinia';

export const useCommonStore = defineStore('common', {
    actions: {
        setAlertMessage(err, type, message) {
            if (err) {
                console.error(err);
            }
            this.alertVisible = true;
            this.alertType = type;
            this.alertMessage = message;
            setTimeout(() => {
                this.alertVisible = false;
            }, 3000);
        },
    },
    state: () => {
        return {
            alertVisible: false,
            alertType: 'success',
            alertMessage: null,
        };
    },
});
