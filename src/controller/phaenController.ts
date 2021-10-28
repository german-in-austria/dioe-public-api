import {
  ISelectPhaenBerResult,
  ISelectPhaenResult,
  ISelectSinglePhaenResult,
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
  @Get("/{berId}")
  public async getSinglePhaen(
    @Path() berId: number
  ): Promise<ISelectSinglePhaenResult[]> {
    return phaenService.getSinglePhaen(berId);
  }
  /*
  @Get("/ort/{tagId}")
  public async getTagOrte(
    @Path() tagId: number
  ): Promise<ISelectOrtTagsResult[]> {
    return tagService.getTagOrte(tagId);
  }
  */
}
