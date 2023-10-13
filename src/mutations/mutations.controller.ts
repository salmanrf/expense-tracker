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
import { MutationsService } from './mutations.service';
import { CreateMutationDto } from './dtos/create-mutation.dto';
import { BaseAPIResponse } from 'src/dtos/api';
import { FindManyMutationsDto } from './dtos/find-mutations.dto';
import { UsersService } from 'src/users/users.service';
import { FindMutationsReportDto } from './dtos/find-mutations-report.dto';

@Controller('api/mutations')
export class MutationsController {
  constructor(
    private readonly mutationsService: MutationsService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  async createMutation(@Body() createDto: CreateMutationDto) {
    const data = await this.mutationsService.createMutation(createDto);

    const res: BaseAPIResponse<any> = {
      data,
      errors: null,
      message: 'success',
    };

    return res;
  }

  @Get('/report')
  async findMutationsReport(@Query() findDto: FindMutationsReportDto) {
    const data = await this.mutationsService.findMutationsReport(
      '0b816421-4263-4b29-a29f-cf87d932c839',
      findDto,
    );

    const res: BaseAPIResponse<any> = {
      data,
      errors: null,
      message: 'success',
    };

    return res;
  }

  @Get(':mutation_id')
  async findOneMutation(@Param('mutation_id') mutation_id: string) {
    const data = await this.mutationsService.findOneMutation(mutation_id);

    if (!data) {
      throw new NotFoundException(`Can't find category with id ${mutation_id}`);
    }

    const res: BaseAPIResponse<any> = {
      data,
      errors: null,
      message: 'success',
    };

    return res;
  }

  @Get()
  async findManyMutation(@Query() findDto: FindManyMutationsDto) {
    const data = await this.mutationsService.findManyMutations(findDto);

    const res: BaseAPIResponse<any> = {
      data,
      errors: null,
      message: 'success',
    };

    return res;
  }

  @Delete(':mutation_id')
  async deleteOneMutation(@Param('mutation_id') mutation_id: string) {
    const data = await this.mutationsService.deleteOneCategory(mutation_id);

    const res: BaseAPIResponse<any> = {
      data,
      errors: null,
      message: 'success',
    };

    return res;
  }
}
