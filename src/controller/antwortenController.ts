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

import {
  ISelectSatzResult,
  ISelectMatchingTokensResult,
  ISelectErhebungsartenResult,
} from "../dao/antworten.queries";

export interface ISelectAntwortenResult {
  startAntwort: string;
  stopAntwort: string;
  kommentar: string | null;
  dateipfad: string | null;
  audiofile: string | null;
  tagId: number;
  osmid: string | null;
  tagName: string | null;
}

import antwortenService, {
  AntwortenFromAufgabe,
  AntwortTokenStamp,
} from "../service/antworten";

import validator from "../service/validate";

export interface antwortenDto {
  ids: number[];
  osmId: number;
  ageLower?: number;
  ageUpper?: number;
  ausbildung?: string;
  beruf_id?: number;
  weiblich?: boolean;
  group?: boolean;
}

@Route("antworten")
export class AntwortenController extends Controller {
  @Get()
  public async getAntbyAufgaben(
    @Query("sid") sid?: number,
    @Query("aid") aid?: number
  ): Promise<AntwortenFromAufgabe[]> {
    // TODO Optimize Request for aufgabe
    return antwortenService.getAntFromAufgabe(sid, aid);
  }

  @Post("/tags")
  public async getAntByTags(
    @Body() antwortenDto: antwortenDto
  ): Promise<AntwortTokenStamp[]> {
    return antwortenService.getAntwortenAudio(
      antwortenDto.ids,
      antwortenDto.osmId,
      validator.validateAntwortenDto(antwortenDto)
    );
  }

  @Get("/saetze")
  public async getSatz(
    @Query("q") query: string
  ): Promise<ISelectSatzResult[]> {
    return antwortenService.getAntSatz(`%${query}%`);
  }

  @Get("/token")
  public async getMatchingTokens(
    @Query("o") ortho?: string,
    @Query("p") phon?: string,
    @Query("l") lemma?: string
  ): Promise<ISelectMatchingTokensResult[]> {
    return antwortenService.getMatchingTokens(ortho, phon, lemma);
  }

  @Get("/arten")
  public async getErhebungsArten(): Promise<ISelectErhebungsartenResult[]> {
    return antwortenService.getErhebungsarten();
  }
}
