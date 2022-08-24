import {
  ISelectPhaenBerResult,
  ISelectPhaenResult,
  ISelectSinglePhaenResult,
  ISelectTagByPhaenResult,
} from '../dao/phaen.queries';

import { Body, Controller, Get, Path, Post, Query, Route } from 'tsoa';

import phaenService from '../service/phaen';

export interface phaenDto {
  ids: number[];
}

@Route('phaen')
export class PhaenController extends Controller {
  @Get('/ber')
  public async getPhaenBer(): Promise<ISelectPhaenBerResult[]> {
    return phaenService.getPhaenBer();
  }

  @Get()
  public async getPhaen(): Promise<ISelectPhaenResult[]> {
    return phaenService.getPhaenResult();
  }

  @Get('/{berId}')
  public async getSinglePhaen(
    @Path() berId: number
  ): Promise<ISelectSinglePhaenResult[]> {
    return phaenService.getSinglePhaen(berId);
  }

  @Post('/tags')
  public async getTagsByPhaen(
    @Body() phaenDto: phaenDto
  ): Promise<ISelectTagByPhaenResult[]> {
    return phaenService.getTagByPhaen(phaenDto.ids);
  }
}
