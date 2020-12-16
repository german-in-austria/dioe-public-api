import { ISelectTagsResult } from 'src/dao/tag.queries'
import {
  Body,
  Controller,
  Get,
  Path,
  Post,
  Query,
  Route,
  SuccessResponse,
} from 'tsoa'

import tagService from '../service/tag'

@Route('tags')
export class TagController extends Controller {
  @Get()
  public async getTags(): Promise<ISelectTagsResult[]> {
    return tagService.getTagTree()
  }
  @Get('{param}')
  public async getControllerDemo(
    @Body() body: any,
    @Query('query_param') query: string,
    @Path('param') param: string
  ): Promise<{test: 'ok', data: any}> {
    return {
      test: 'ok',
      data: {
        body,
        query,
        param,
        ...this.getHeaders()
      }
    }
  }
}
