import { Request, Response, NextFunction } from "express";
import { LinkService } from "./Link.service";

const service = new LinkService();

export class LinkController {
  async getPendingLinks(req: Request, res: Response, next: NextFunction) {
    try {
      const links = await service.getPendingLinks(req.user!.userId);
      res.json(links);
    } catch (error) {
      next(error);
    }
  }

  async approve(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const link = await service.approve(req.params.id, req.user!.userId);
      res.json(link);
    } catch (error) {
      next(error);
    }
  }

  async reject(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const link = await service.reject(req.params.id, req.user!.userId);
      res.json(link);
    } catch (error) {
      next(error);
    }
  }

  async requestLink(req: Request, res: Response, next: NextFunction) {
    try {
      const link = await service.requestLink(
        req.user!.userId,
        req.body.personalId,
      );
      res.status(201).json(link);
    } catch (error) {
      next(error);
    }
  }

  async getPendingLinksByPersonal(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const links = await service.getPendingLinksByPersonal(req.user!.userId);
      res.json(links);
    } catch (error) {
      next(error);
    }
  }

  async approveByPersonal(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const link = await service.approveByPersonal(
        req.params.id,
        req.user!.userId,
      );
      res.json(link);
    } catch (error) {
      next(error);
    }
  }

  async rejectByPersonal(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const link = await service.rejectByPersonal(
        req.params.id,
        req.user!.userId,
      );
      res.json(link);
    } catch (error) {
      next(error);
    }
  }

  async getApprovedLink(req: Request, res: Response, next: NextFunction) {
    try {
      const link = await service.getApprovedLink(req.user!.userId);
      res.json(link);
    } catch (error) {
      next(error);
    }
  }
}
