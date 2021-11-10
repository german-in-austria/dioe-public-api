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

interface aufgabenDto {
  ids: number[];
}

@Route("aufgaben")
export class AufgabenController extends Controller {
  @Post("/sets")
  public async getAufgabenSets(
    @Body() aufgabenDto: aufgabenDto
  ): Promise<ISelectAufgabenSetResult[]> {
    return aufgabenService.getAufgabenSetPhaen(aufgabenDto.ids);
  }
  @Post()
  public async getAufgabenPhaen(
    @Body() aufgabenDto: aufgabenDto
  ): Promise<ISelectAufgabenResult[]> {
    return aufgabenService.getAufgabenPhaen(aufgabenDto.ids);
  }

  @Post("/setaufgabe")
  public async getTagOrte(
    @Body() aufgabenDto: aufgabenDto
  ): Promise<ISelectAufgabenFromSetResult[]> {
    return aufgabenService.getAufgabenWithSet(aufgabenDto.ids);
  }
}
