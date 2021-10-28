import {
  ISelectPhaenBerResult,
  ISelectPhaenResult,
} from "src/dao/phaen.queries";

import { Body, Controller, Get, Path, Post, Query, Route } from "tsoa";

import phaenService from "../service/phaen";

@Route("phaen")
export class PhaenController extends Controller {
  @Get("/ber")
  public async getPhaenBer(): Promise<ISelectPhaenBerResult[]> {
    return phaenService.getPhaenBer();
  }

  @Get()
  public async getPhaen(): Promise<ISelectPhaenResult[]> {
    return phaenService.getPhaenResult();
  }
}
