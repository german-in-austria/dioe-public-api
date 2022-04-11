import {
  Body,
  Controller,
  Get,
  Path,
  Post,
  Query,
  Route,
  BodyProp,
} from "tsoa";

import { ISelectAusbildungResult } from "../dao/social.queries";

import socialService from "../service/social";

@Route("social")
export class SocialController extends Controller {
  @Get("/berufe")
  public async getAllAusbildung(): Promise<ISelectAusbildungResult[]> {
    return socialService.getAllAusbildung();
  }
}
