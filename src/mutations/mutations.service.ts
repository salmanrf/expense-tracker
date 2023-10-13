import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MutationEntity } from './entities/mutations.entity';
import { Repository } from 'typeorm';
import { CreateMutationDto } from './dtos/create-mutation.dto';
import {
  getPaginationParams,
  getPaginatedData,
} from 'src/utils/pagination.utils';
import { FindManyMutationsDto } from './dtos/find-mutations.dto';
import { FindMutationsReportDto } from './dtos/find-mutations-report.dto';

@Injectable()
export class MutationsService {
  constructor(
    @InjectRepository(MutationEntity)
    private readonly mutationRepo: Repository<MutationEntity>,
  ) {}

  async createMutation(dto: CreateMutationDto) {
    try {
      const newMutation = await this.mutationRepo.save(dto);

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

      const { period_type } = dto;

      mutationQb.andWhere({ user_id });

      if (period_type === 'day') {
        mutationQb.andWhere(
          "DATE_TRUNC('DAY', NOW()) = DATE_TRUNC('DAY', m.created_at) ",
        );
      }

      if (period_type === 'week') {
        mutationQb.andWhere(
          "DATE_TRUNC('WEEK', NOW()) = DATE_TRUNC('WEEK', m.created_at) ",
        );
      }

      if (period_type === 'month') {
        mutationQb.andWhere(
          "DATE_TRUNC('MONTH', NOW()) = DATE_TRUNC('MONTH', m.created_at) ",
        );
      }

      if (period_type === 'year') {
        mutationQb.andWhere(
          "DATE_TRUNC('YEAR', NOW()) = DATE_TRUNC('YEAR', m.created_at) ",
        );
      }

      mutationQb.leftJoin('m.category', 'c');

      mutationQb.groupBy('c.category_id');
      mutationQb.addGroupBy('m.type');
      mutationQb.addGroupBy('m.created_at');

      mutationQb.select([
        'c.name category',
        'm.type type',
        'm.created_at created_at',
        'SUM(m.amount)::NUMERIC amount',
      ]);

      const results = await mutationQb.getRawMany();

      return results.map((r) => ({ ...r, ['amount']: +r['amount'] }));
    } catch (error) {
      throw error;
    }
  }
}
