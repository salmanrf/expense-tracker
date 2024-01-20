import { join } from 'path';

const PdfFonts = {
  Roboto: {
    normal: join(__dirname, 'Roboto', 'Roboto-Regular.ttf'),
    bold: join(__dirname, 'Roboto', 'Roboto-Medium.ttf'),
    italics: join(__dirname, 'Roboto', 'Roboto-Italic.ttf'),
    bolditalics: join(__dirname, 'Roboto', 'Roboto-Italic.ttf'),
  },
};

export default PdfFonts;
