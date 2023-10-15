import { MUTATION_TYPES, PERIOD_TYPES } from './mutation';

export const AvailableCommandMessage = `- /mutation
- /report

To see manual for each command, specify the command name without any parameter,
Examples:
- /mutation
- /report`;

export const MutationCommandFormatMessage = `Mutation Command Manual
COMMAND
/mutation

DESCRIPTION
Create a new mutation item

PARAMETERS
- <type>:
  Whether it is an income or an expense, One of ${MUTATION_TYPES.join(', ')}

- <transaction_date>?:
  The date of the transaction in the format: YYYY-MM-DD, defaults to today

- <amount>:
  The amount of transaction, numbers only
  
- <category>?:
  Label the mutation with a category name

Examples:
- /mutation OUT 250000
- /mutation OUT 50000 food
- /mutation IN 2023-12-10 100000
- /mutation IN 2023-10-01 150000000 salary
`;

export const ReportCommandFormatMessage = `Report Command Manual
COMMAND
/report

DESCRIPTION
Get mutation report in a specific period of time grouped by categories and type

PARAMETERS
- <period_type>:
  One of ${PERIOD_TYPES.join(', ')}

- <category>?:
Optional, filter by category name

Examples:
- /report day education
- /report week
- /report month food
`;
