import { Router } from 'express';
import { CasualPaymentHTTPController } from '../CasualPaymentHTTPController.js';

export class CasualPaymentMethodRouter {
  public router: Router;
  public endpoint: string = '/casual';

  constructor(private casualPaymentHTTPController: CasualPaymentHTTPController) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.endpoint}/create`, (req, res) => this.casualPaymentHTTPController.create(req, res));
  }
}