import { MutationEntity } from 'src/mutations/entities/mutations.entity';
import { UserEntity } from 'src/users/entities/users.entity';

import * as dfns from 'date-fns';

const REPORT_PDF_DEF: Record<string, any> = {
  pageSize: 'A4',
  pageOrientation: 'portrait',
  pageMargin: [60, 160, 60, 120],
  content: [],
  header: function (currentPage) {
    return {
      margin: [0, 20, 0, 0],
      columns: [
        { widht: '80%', text: '' },
        {
          width: '20%',
          alignment: '',
          layout: 'noBorders',
          table: {
            widths: ['100%'],
            body: [
              [
                {
                  margin: [10, 0, 0, 0],
                  alignment: 'left',
                  text: currentPage,
                  color: 'white',
                  fillColor: '#44bbb2',
                },
              ],
            ],
          },
        },
      ],
      fontSize: 11,
    };
  },
  styles: {
    paragraphHeader: {
      fontSize: 14,
      margin: [16, 0, 0, 0],
      bold: true,
      italics: true,
      color: '#003496',
    },
    paragraph: {
      fontSize: 12,
      margin: [0, 20, 0, 20],
      color: 'black',
    },
    infoTableKeyCells: {
      fontSize: 10,
      color: 'white',
      bold: true,
    },
    infoTableValueCells: {
      fontSize: 10,
      color: 'black',
    },
  },
};

export type REPORT_PDF_PROPS = {
  user: UserEntity;
  mutations: MutationEntity[];
  start_date: string;
  end_date: string;
};

export default function formatReportPdf(
  props: REPORT_PDF_PROPS,
): Record<string, any> {
  const dd = { ...REPORT_PDF_DEF };

  const { user, mutations, start_date, end_date } = props;

  const infoTableLayout = {
    fillColor: function (_, __, colIndex: number) {
      if (colIndex === 0) {
        return '#44bbb2';
      }

      return '#e7f6f6';
    },
    hLineWidth: () => 0,
    vLineWidth: () => 0,
    paddingTop: () => 5,
    paddingBottom: () => 5,
    paddingLeft: () => 10,
    paddingRight: () => 5,
  };

  dd.content.push({
    margin: [0, 60, 0, 0],
    columns: [
      {
        width: '55%',
        layout: infoTableLayout,
        table: {
          headerRows: 0,
          widths: ['30%', '70%'],
          body: [
            [
              {
                text: 'User Id',
                style: 'infoTableKeyCells',
              },
              {
                text: user.user_id,
                style: 'infoTableValueCells',
              },
            ],
            [
              {
                text: 'Phone Number',
                style: 'infoTableKeyCells',
              },
              {
                text: user.phone_id,
                style: 'infoTableValueCells',
              },
            ],
          ],
        },
      },
      {
        width: '5%',
        text: ' ',
      },
      {
        width: '40%',
        layout: infoTableLayout,
        table: {
          headerRows: 0,
          widths: ['30%', '70%'],
          body: [
            [
              {
                text: 'Start period',
                style: 'infoTableKeyCells',
              },
              {
                text: dfns.format(new Date(start_date), 'eeee, dd MMMM yyyy'),
                style: 'infoTableValueCells',
              },
            ],
            [
              {
                text: 'End period',
                style: 'infoTableKeyCells',
              },
              {
                text: dfns.format(new Date(end_date), 'eeee, dd MMMM yyyy'),
                style: 'infoTableValueCells',
              },
            ],
          ],
        },
      },
    ],
  });

  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const formattedMutations = mutations.map((m) => {
    const mutationRow = [
      {
        text: dfns.format(new Date(m.created_at), 'eeee, dd MMMM yyyy'),
      },
      { text: m.category ? m.category.name : 'Others' },
      {
        text: formatter.format(m.amount),
        color: m.type === 'IN' ? '#44bbb2' : '#af1d24',
      },
      { text: m.description },
    ];

    return mutationRow;
  });

  dd.content.push({
    width: '100%',
    margin: [0, 20],
    fontSize: 10,
    table: {
      widths: ['25%', '25%', '25%', '25%'],
      headerRows: 1,
      body: [
        [
          { text: 'Date & Time', color: 'white', bold: true },
          { text: 'Category', color: 'white', bold: true },
          { text: 'Amount', color: 'white', bold: true },
          { text: 'Desciption', color: 'white', bold: true },
        ],
        ...formattedMutations,
      ],
    },
    layout: {
      fillColor: function (i: number) {
        if (i === 0) {
          return '#44bbb2';
        }

        if (i % 2 === 0) {
          return 'white';
        }

        return '#e7f6f6';
      },
      hLineWidth: () => 0,
      vLineWidth: () => 0,
      paddingTop: () => 5,
      paddingBottom: () => 5,
      paddingLeft: () => 10,
      paddingRight: () => 5,
    },
  });

  return dd;
}
