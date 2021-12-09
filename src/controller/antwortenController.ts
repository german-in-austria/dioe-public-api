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

interface antwortenDto {
  ids: number[];
  osmId: number;
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
      antwortenDto.osmId
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
}
