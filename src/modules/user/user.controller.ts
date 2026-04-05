import { Request, Response } from 'express';

export class UserController {
  me(req: Request, res: Response) {
    return res.json({
      message: 'Protected route accessed',
      user: req.user,
    });
  }

  personalOnly(req: Request, res: Response) {
    return res.json({
      message: 'Only Personal can access this route',
      user: req.user,
    });
  }
}
