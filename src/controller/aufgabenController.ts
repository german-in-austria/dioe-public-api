import {
  ISelectAufgabenFromSetResult,
  ISelectAufgabenResult,
  ISelectAufgabenSetResult,
} from "src/dao/aufgaben.queries";

import { Body, Controller, Get, Path, Post, Query, Route } from "tsoa";

import aufgabenService from "../service/aufgaben";

@Route("aufgaben")
export class AufgabenController extends Controller {
  @Get("/sets/{phaenID}")
  public async getAufgabenSets(
    @Path() phaenID: number
  ): Promise<ISelectAufgabenSetResult[]> {
    return aufgabenService.getAufgabenSetPhaen(phaenID);
  }
  @Get("/{phaenID}")
  public async getAufgabenPhaen(
    @Path() phaenID: number
  ): Promise<ISelectAufgabenResult[]> {
    return aufgabenService.getAufgabenPhaen(phaenID);
  }

  @Get("/sets")
  public async getTagOrte(
    @Query() setID: number
  ): Promise<ISelectAufgabenFromSetResult[]> {
    return aufgabenService.getAufgabenWithSet(setID);
  }
}
