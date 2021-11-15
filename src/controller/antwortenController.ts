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

export interface ISelectAntwortenResult {
  startAntwort: string;
  stopAntwort: string;
  kommentar: string | null;
  dateipfad: string | null;
  audiofile: string | null;
  tagId: number;
}

import antwortenService, { AntwortenTags } from "../service/antworten";

interface antwortenDto {
  ids: number[];
}

@Route("antworten")
export class AntwortenController extends Controller {
  @Post("/tags")
  public async getAntByTags(
    @Body() antwortenDto: antwortenDto
  ): Promise<AntwortenTags[]> {
    return antwortenService.getAntwortenAudio(antwortenDto.ids);
  }
}
