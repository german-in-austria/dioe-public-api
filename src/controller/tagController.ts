import {
  ISelectOrtTagsResult,
  ISelectTagsLayersResult,
} from "src/dao/tag.queries";

import { Body, Controller, Get, Path, Post, Query, Route } from "tsoa";

import tagService, { TagTree } from "../service/tag";

interface tagDto {
  ids: number[];
}

@Route("tags")
export class TagController extends Controller {
  @Get()
  public async getTags(): Promise<TagTree[]> {
    return tagService.getTagTree();
  }
  @Get("/layers")
  public async getTagLayers(): Promise<ISelectTagsLayersResult[]> {
    return tagService.getTagLayers();
  }

  @Get("/ort/{tagId}")
  public async getTagOrte(
    @Path() tagId: number
  ): Promise<ISelectOrtTagsResult[]> {
    return tagService.getTagOrte([tagId]);
  }

  @Post("/ort")
  public async getTagOrteMultiple(
    @Body() tagDto: tagDto
  ): Promise<ISelectOrtTagsResult[]> {
    return tagService.getTagOrte(tagDto.ids);
  }
}

// demonstration of TSOA API
@Route("test")
export class TestController extends Controller {
  @Post("/{something}")
  public async getControllerDemo(
    @Body() body: any,
    @Query("query_param") query: string,
    @Path("something") param?: string
  ): Promise<{ test: "ok"; data: any }> {
    return {
      test: "ok",
      data: {
        body,
        query,
        param,
        ...this.getHeaders(),
      },
    };
  }
}
