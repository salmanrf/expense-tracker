import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MutationEntity } from './entities/mutations.entity';
import { Repository } from 'typeorm';
import * as dfns from 'date-fns';
import { CreateMutationDto } from './dtos/create-mutation.dto';
import {
  getPaginationParams,
  getPaginatedData,
} from 'src/utils/pagination.utils';
import { FindManyMutationsDto } from './dtos/find-mutations.dto';
import { FindMutationsReportDto } from './dtos/find-mutations-report.dto';
import {
  MutationReport,
  MutationReportResults,
} from 'src/types/mutation-report';
import { MutationCommand } from 'src/constants/command';
import { CategoriesService } from 'src/categories/categories.service';
import { CategoryEntity } from 'src/categories/entities/categories.entity';

@Injectable()
export class MutationsService {
  constructor(
    @InjectRepository(MutationEntity)
    private readonly mutationRepo: Repository<MutationEntity>,
    private readonly categoriesService: CategoriesService,
  ) {}

  async createMutation(dto: CreateMutationDto | MutationCommand) {
    try {
      const { ...createDto } = dto;
      let category: CategoryEntity;

      if (dto instanceof MutationCommand) {
        const { category: catName } = dto;

        if (catName) {
          category = await this.categoriesService.getOrCreateCategory({
            name: dto.category,
          });

          createDto.category_id = category.category_id;
        }
      }

      delete createDto['category'];

      const newMutation = await this.mutationRepo.save(
        createDto as CreateMutationDto,
      );

      return newMutation;
    } catch (error) {
      throw error;
    }
  }

  async findOneMutation(mutation_id: string) {
    try {
      const mutation = await this.mutationRepo.findOne({
        where: { mutation_id },
      });

      return mutation;
    } catch (error) {
      throw error;
    }
  }

  async findManyMutations(dto: FindManyMutationsDto) {
    const {
      amount_start,
      amount_end,
      category_id,
      user_id,
      created_at_start,
      created_at_end,
      ...pagination
    } = dto;

    const { limit, offset } = getPaginationParams(pagination);

    const mutationQb = this.mutationRepo.createQueryBuilder('m');

    if (category_id) {
      mutationQb.andWhere({ category_id });
    }

    if (user_id) {
      mutationQb.andWhere({ user_id });
    }

    if (amount_start != null) {
      mutationQb.andWhere('amount >= :amount_start', { amount_start });
    }

    if (amount_end != null) {
      mutationQb.andWhere('amount <= :amount_end', { amount_end });
    }

    if (created_at_start != null) {
      mutationQb.andWhere('created_at >= :created_at_start', {
        created_at_start,
      });
    }

    if (created_at_end != null) {
      mutationQb.andWhere('created_at <= :created_at_end', { created_at_end });
    }

    mutationQb.leftJoinAndSelect('m.user', 'u');

    let { sort_field, sort_order } = pagination;

    if (!sort_field) {
      sort_field = 'm.created_at';
    } else {
      sort_field = 'm.' + sort_field;
    }

    if (!['DESC', 'ASC'].includes(sort_order)) {
      sort_order = 'DESC';
    }

    mutationQb.take(limit);
    mutationQb.skip(offset);
    mutationQb.orderBy(sort_field, sort_order);

    const results = await mutationQb.getManyAndCount();
    const data = getPaginatedData(results, {
      ...pagination,
      sort_field,
      sort_order,
    });

    return data;
  }

  async deleteOneCategory(mutation_id: string) {
    try {
      const mutation = await this.mutationRepo.findOne({
        where: { mutation_id },
      });

      if (mutation) {
        await this.mutationRepo.delete({ mutation_id });
      }

      return mutation;
    } catch (error) {
      throw error;
    }
  }

  async findMutationsReport(user_id: string, dto: FindMutationsReportDto) {
    try {
      const mutationQb = this.mutationRepo.createQueryBuilder('m');

      const { period_type, category } = dto;

      mutationQb.andWhere({ user_id });

      mutationQb.leftJoin('m.category', 'c');

      mutationQb.groupBy('c.category_id');
      mutationQb.addGroupBy('m.type');

      mutationQb.select([
        'c.name category',
        'm.type type',
        'SUM(m.amount)::NUMERIC amount',
      ]);

      let trx_date_start: Date;
      let trx_date_end: Date;

      if (period_type === 'day') {
        trx_date_start = dfns.startOfDay(new Date());
        trx_date_end = dfns.endOfDay(trx_date_start);

        mutationQb.andWhere(
          "DATE_TRUNC('DAY', NOW()) = DATE_TRUNC('DAY', m.created_at) ",
        );
      }

      if (period_type === 'week') {
        trx_date_start = dfns.startOfWeek(new Date());
        trx_date_end = dfns.endOfWeek(trx_date_start);

        mutationQb.andWhere(
          "DATE_TRUNC('WEEK', NOW()) = DATE_TRUNC('WEEK', m.created_at) ",
        );
      }

      if (period_type === 'month') {
        trx_date_start = dfns.startOfMonth(new Date());
        trx_date_end = dfns.endOfMonth(trx_date_start);

        mutationQb.andWhere(
          "DATE_TRUNC('MONTH', NOW()) = DATE_TRUNC('MONTH', m.created_at) ",
        );
      }

      if (period_type === 'year') {
        trx_date_start = dfns.startOfYear(new Date());
        trx_date_end = dfns.endOfYear(trx_date_start);

        mutationQb.andWhere(
          "DATE_TRUNC('YEAR', NOW()) = DATE_TRUNC('YEAR', m.created_at) ",
        );
      }

      if (category) {
        mutationQb.andWhere('"c"."name" = :category', { category });
      }

      const results: MutationReport[] = await mutationQb.getRawMany();

      const data: MutationReportResults = {
        items: results.map((r) => ({ ...r, amount: +r.amount })),
        period_type,
        trx_date_start: dfns.format(trx_date_start, 'eeee, dd MMMM yyyy'),
        trx_date_end: dfns.format(trx_date_end, 'eeee, dd MMMM yyyy'),
      };

      console.dir(data, { depth: null, colors: true });

      return data;
    } catch (error) {
      throw error;
    }
  }
}
