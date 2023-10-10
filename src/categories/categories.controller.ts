import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { FindManyCategoriesDto } from './dtos/find-category.dto';
import { BaseAPIResponse } from 'src/dtos/api';
import { CreateCategoryDto } from './dtos/create-category.dto';

@Controller('api/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  async createCategory(@Body() createDto: CreateCategoryDto) {
    const data = await this.categoriesService.createCategory(createDto);

    const response: BaseAPIResponse<any> = {
      data,
      errors: null,
      message: 'success',
    };

    return response;
  }

  @Get(':category_id')
  async findOne(@Param('category_id') category_id: number) {
    const data = await this.categoriesService.findOneCategory(category_id);

    if (!data) {
      throw new NotFoundException(`Can't find category with id ${category_id}`);
    }

    const response: BaseAPIResponse<any> = {
      data,
      errors: null,
      message: 'success',
    };

    return response;
  }

  @Get()
  async findMany(@Query() findDto: FindManyCategoriesDto) {
    const data = await this.categoriesService.findManyCategories(findDto);

    const response: BaseAPIResponse<any> = {
      data,
      errors: null,
      message: 'success',
    };

    return response;
  }

  @Delete(':category_id')
  async deleteOne(@Param('category_id') category_id: number) {
    const _ = await this.categoriesService.deleteOneCategory(category_id);

    const response: BaseAPIResponse<any> = {
      data: null,
      errors: null,
      message: 'success',
    };

    return response;
  }
}
