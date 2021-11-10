import {
  ISelectAufgabenFromSetResult,
  ISelectAufgabenResult,
  ISelectAufgabenSetResult,
} from "src/dao/aufgaben.queries";

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

import aufgabenService from "../service/aufgaben";

@Route("aufgaben")
export class AufgabenController extends Controller {
  @Post("/sets")
  public async getAufgabenSets(
    @BodyProp("phaen") phaenID: number[]
  ): Promise<ISelectAufgabenSetResult[]> {
    return aufgabenService.getAufgabenSetPhaen(phaenID);
  }
  @Post()
  public async getAufgabenPhaen(
    @BodyProp("phaen") phaenID: number[]
  ): Promise<ISelectAufgabenResult[]> {
    return aufgabenService.getAufgabenPhaen(phaenID);
  }

  @Post("/setaufgabe")
  public async getTagOrte(
    @BodyProp("set") setID: number[]
  ): Promise<ISelectAufgabenFromSetResult[]> {
    return aufgabenService.getAufgabenWithSet(setID);
  }
}
