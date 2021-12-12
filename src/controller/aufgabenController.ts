import {
  ISelectAufgabenFromSetResult,
  ISelectAufgabenResult,
  ISelectAufgabenSetResult,
  ISelectAllAufgabenResult,
  ISelectOrtAufgabeResult,
  ISelectAllTeamsResult,
  ISelectAufgabeAudioByOrtResult,
} from "../dao/aufgaben.queries";

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

import aufgabenService, { AufgabeStamp } from "../service/aufgaben";

import { antwortenDto } from "../controller/antwortenController";

interface aufgabenDto {
  ids: number[];
}

@Route("aufgaben")
export class AufgabenController extends Controller {
  @Get()
  public async getAllAufgaben(): Promise<ISelectAllAufgabenResult[]> {
    return aufgabenService.getAllAufgaben();
  }

  @Get("/teams")
  public async getAllTeams(): Promise<ISelectAllTeamsResult[]> {
    return aufgabenService.getAllTeams();
  }

  @Post("/orte")
  public async getAufgabenOrte(
    @Body() aufgabenDto: aufgabenDto
  ): Promise<ISelectOrtAufgabeResult[]> {
    return aufgabenService.getOrtAufgabe(aufgabenDto.ids);
  }

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

  @Post("/audio")
  public async getAntAudioByOrt(
    @Body() antwortenDto: antwortenDto
  ): Promise<AufgabeStamp[]> {
    return aufgabenService.getAufgabeAudioByOrt(
      antwortenDto.ids,
      antwortenDto.osmId
    );
  }
}
