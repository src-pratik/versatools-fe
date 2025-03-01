import { LoadingController, ToastController } from "@ionic/angular";

export abstract class AbstractUIFeedbackService {

    constructor(protected loadingController: LoadingController, protected toastController: ToastController) { }

    public async loader(message: string): Promise<HTMLIonLoadingElement> {
        return this.createLoader(message);
    }

    public async loaderLoadingData(): Promise<HTMLIonLoadingElement> {
        return this.createLoader("Loading data ...");
    }
    public async loaderProcessing(): Promise<HTMLIonLoadingElement> {
        return this.createLoader("Processing ...");
    }

    public async toastError(message: string) {
        this.showToast(message);
    }
    public async toastSuccess(message: string) {
        this.showToast(message, 'success');
    }

    private async createLoader(message: string): Promise<HTMLIonLoadingElement> {
        return await this.loadingController.create({
            message: message
        });
    }

    private async showToast(message: string, color: string = "danger") {
        const toast = await this.toastController.create({
            message: message,
            duration: 5000,
            color: color,
        });
        toast.present();
    }
}