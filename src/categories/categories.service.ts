import { Injectable } from '@nestjs/common';
import { DataSource, ILike, Repository } from 'typeorm';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { CategoryEntity } from './entities/categories.entity';
import { FindManyCategoriesDto } from './dtos/find-category.dto';
import {
  getPaginatedData,
  getPaginationParams,
} from 'src/utils/pagination.utils';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(CategoryEntity)
    private readonly categoryRepo: Repository<CategoryEntity>,
  ) {}

  async createCategory(dto: CreateCategoryDto) {
    try {
      const newCategory = await this.dataSource.manager.save(
        CategoryEntity,
        dto,
      );

      return newCategory;
    } catch (error) {
      throw error;
    }
  }

  async findOneCategory(category_id: number) {
    try {
      const category = await this.categoryRepo.findOne({
        where: { category_id },
      });

      return category;
    } catch (error) {
      throw error;
    }
  }

  async findManyCategories(dto: FindManyCategoriesDto) {
    const { name, ...pagination } = dto;

    const { limit, offset } = getPaginationParams(pagination);

    const categoryQb = this.dataSource.createQueryBuilder(CategoryEntity, 'c');

    if (name) {
      categoryQb.andWhere({ name: ILike(`%${name}%`) });
    }

    let { sort_field, sort_order } = pagination;

    if (!sort_field) {
      sort_field = 'c.created_at';
    } else {
      sort_field = 'c.' + sort_field;
    }

    if (!['DESC', 'ASC'].includes(sort_order)) {
      sort_order = 'DESC';
    }

    categoryQb.take(limit);
    categoryQb.skip(offset);
    categoryQb.orderBy(sort_field, sort_order);

    const results = await categoryQb.getManyAndCount();
    const data = getPaginatedData(results, {
      ...pagination,
      sort_field,
      sort_order,
    });

    return data;
  }

  async deleteOneCategory(category_id: number) {
    try {
      const category = await this.categoryRepo.findOne({
        where: { category_id },
      });

      if (category) {
        await this.categoryRepo.delete({ category_id });
      }

      return category;
    } catch (error) {
      throw error;
    }
  }
}
