import { Router } from 'express';
import { InviteCodeHTTPController } from '../InviteCodeHTTPController.js';

export class InviteCodeRouter {
  public router: Router;
  public endpoint: string = '/invite';

  constructor(private inviteCodeHTTPController: InviteCodeHTTPController) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.endpoint}/:code`, (req, res) => this.inviteCodeHTTPController.activateCode(req, res));
  }
}