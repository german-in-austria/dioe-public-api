import {
  Body,
  Controller,
  Get,
  Path,
  Post,
  Query,
  Route,
} from 'tsoa'

import tagService, { TagTree } from '../service/tag'

@Route('tags')
export class TagController extends Controller {
  @Get()
  public async getTags(): Promise<TagTree[]> {
    return tagService.getTagTree()
  }
}

// demonstration of TSOA API
@Route('test')
export class TestController extends Controller {
  @Post('/{something}')
  public async getControllerDemo(
    @Body() body: any,
    @Query('query_param') query: string,
    @Path('something') param?: string
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
