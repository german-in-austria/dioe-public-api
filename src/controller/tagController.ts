import {
  ISelectOrtTagsResult,
  ISelectTagsLayersResult,
  ISelectSingleGenResult,
  ISelectTagsResult,
  ISelectTagByIdResult,
  IGetTagsByPresetResult,
  IGetPresetTagsResult,
  IGetPresetOrtTagResult,
} from "../dao/tag.queries";

import { Body, Controller, Get, Path, Post, Query, Route } from "tsoa";

import tagService, { TagTree } from "../service/tag";
import validator from "../service/validate";

export interface tagDto {
  ids: number[];
  erhArt?: number[];
  ausbildung?: string;
  beruf_id?: number;
  weiblich?: boolean;
  project?: number;
}

@Route("tags")
export class TagController extends Controller {
  @Get()
  public async getTags(): Promise<TagTree[]> {
    return tagService.getTagTree();
  }

  @Get("/id/{tagId}")
  public async getTagById(
    @Path() tagId: number
  ): Promise<ISelectTagByIdResult[]> {
    return tagService.getTagById(tagId);
  }

  @Get("/gen")
  public async getTagGen(
    @Query("gen") gen: number
  ): Promise<ISelectSingleGenResult[]> {
    return tagService.getTagGen(gen);
  }

  @Get("/layers")
  public async getTagLayers(): Promise<ISelectTagsLayersResult[]> {
    return tagService.getTagLayers();
  }

  @Get("/preset")
  public async getPresetTags(): Promise<IGetPresetTagsResult[]> {
    return tagService.getPresetTags();
  }

  @Get("/ort/{tagId}")
  public async getTagOrte(
    @Path() tagId: number
  ): Promise<ISelectOrtTagsResult[]> {
    return tagService.getTagOrte(
      validator.validateTagDto({
        ids: [tagId],
        erhArt: [-1],
        ausbildung: "",
        beruf_id: undefined,
        weiblich: undefined,
      })
    );
  }

  @Post("/ort")
  public async getTagOrteMultiple(
    @Body() tagDto: tagDto
  ): Promise<ISelectOrtTagsResult[]> {
    return tagService.getTagOrte(validator.validateTagDto(tagDto));
  }

  @Post("/preset")
  public async getTagsFromPreset(
    @Body() tagDto: tagDto
  ): Promise<ISelectOrtTagsResult[]> {
    return tagService.getTagsFromPreset(validator.validateTagDto(tagDto));
  }

  @Get("/preset/ort/{tagId}")
  public async getPresetOrte(
    @Path() tagId: number
  ): Promise<IGetPresetOrtTagResult[]> {
    return tagService.getPresetOrtTags([tagId]);
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
