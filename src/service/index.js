const writeXlsxFile = require('write-excel-file/node');

export default class Service {
  constructor() {
    this.usersBooks = [];
    this.excelData = [];
  }

  newBook(bookObject) {
    return new Promise((resolve) => {
      this.usersBooks.push(bookObject);
      this.convertArrays();
      resolve();
    });
  }

  convertArrays() {
    const convertedArray = [];

    this.usersBooks.map(book => {
      if(!convertedArray[book.grade]) convertedArray[book.grade] = [];

      convertedArray[book.grade].push(book);
    });

    const convertedJSON = [];

    for(const grade of convertedArray) {
      if (grade) {
        for(const book of grade) {
          for(const classObject of book.classes) {
            if(!convertedJSON[book.grade]) {
              convertedJSON[book.grade] = [];
            }

            const existingIndex = convertedJSON[book.grade].findIndex(element => (
              element.className == classObject[0] && element.subject == book.subject
            ));

            if(existingIndex != -1) {
              if (classObject[1]) {
                classObject[1].forEach(group =>
                  convertedJSON[book.grade][existingIndex].book.push([ group, book.book ])
                );
              } else {
                convertedJSON[book.grade][existingIndex].book.push([ null, book.book ]);
              }
            }
            else {
              if (classObject[1]) {
                convertedJSON[book.grade].push({
                  className: classObject[0],
                  subject: book.subject,
                  book: classObject[1].map(group => [ group, book.book ]),
                });
              } else {
                convertedJSON[book.grade].push({
                  className: classObject[0],
                  subject: book.subject,
                  book: [ [ null, book.book ] ],
                });
              }
            }
          }

          convertedJSON[book.grade].sort((a, b) => {
            if(a.subject < b.subject) return -1;
            if(a.subject > b.subject) return 1;
            return 0;
          });

          convertedJSON[book.grade].sort((a, b) => {
            if(a.className < b.className) return -1;
            if(a.className > b.className) return 1;
            return 0;
          });

          // for(const key of Object.keys(book.classes)) {
          //   if(!convertedJSON[book.grade]) {
          //     convertedJSON[book.grade] = [];
          //   }

          //   const classObject = book.classes[key];

          //   const existingIndex = convertedJSON[book.grade].findIndex(element => (
          //     element.className == key && element.subject == book.subject
          //   ));

          //   if(existingIndex != -1) {
          //     classObject.forEach(group =>
          //       convertedJSON[book.grade][existingIndex].book.push([ group, book.book ])
          //     );
          //   }
          //   else {
          //     convertedJSON[book.grade].push({
          //       className: key,
          //       subject: book.subject,
          //       book: classObject.map(group => [ group, book.book ]),
          //     });
          //   }
          // }
        }
      }
    }
    this.excelData = convertedJSON;
  }

  async generateFile() {
    const schema = [
      {
        column: 'Oddział',
        type: String,
        width: 10,
        borderStyle: 'thin',
        fontWeight: 'bold',
        value: ({ className }) => className,
      },
      {
        column: 'Przedmiot',
        type: String,
        width: 25,
        borderStyle: 'thin',
        value: ({ subject }) => subject,
      },
      {
        column: 'Podręcznik',
        type: String,
        width: 50,
        borderStyle: 'thin',
        wrap: true,
        value: ({ book }) => {
          let generatedString = '';
          book.forEach(group => {
            console.log(group);
            if(group[0]) generatedString = generatedString.concat(group[0], ' - ', group[1], '\n');
            else generatedString = generatedString.concat(group[1], '\n');
          });
          return generatedString;
        },
      }
    ];


    const gradesToGenerate = [];
    const sheetsToGenerate = [];
    const schemasToGenerate = [];
    this.excelData.forEach((gradeContent, gradeIndex) => {
      if(gradeContent) {
        gradesToGenerate.push(gradeContent);
        sheetsToGenerate.push(`Klasy ${gradeIndex}`);
        schemasToGenerate.push(schema);
      }
    });

    await writeXlsxFile(gradesToGenerate, {
      schema: schemasToGenerate,
      sheets: sheetsToGenerate,
      headerStyle: {
        fontWeight: 'bold',
        align: 'center',
        borderStyle: 'thin',
      },
      filePath: './podreczniki.xlsx'
    });
  }
}

/* const logic = new Service();

const exampleBook = {
  book: 'Hight Note 4',
  grade: 3,
  classes: [
    [ '3_PC', [ '1/2' ] ],
    [ '3_A', [ '3TK17' ] ],
  ],
  subject: 'Język angielski',
  author: 'Joanna Obstalecka',
};

const exampleBook2 = {
  book: 'Hight Note 5',
  grade: 3,
  classes: [
    [ '3_PC', [ '2/2' ] ],
  ],
  subject: 'Język angielski',
  author: 'Sandra Lasota',
};

const exampleBook3 = {
  book: 'Hight Note 1',
  grade: 1,
  classes: [
    [ '1_PC', [ '1/2' ] ],
  ],
  subject: 'Język angielski',
  author: 'Sandra Lasota',
};

const exampleBook4 = {
  book: 'Poznać przeszłość 4',
  grade: 3,
  classes: [
    [ '3_PC' ],
    [ '3_PB' ],
  ],
  subject: 'Historia',
  author: 'Sławomir Wartacz',
};

logic.newBook(exampleBook);
logic.newBook(exampleBook2);
logic.newBook(exampleBook3);
logic.newBook(exampleBook4);

logic.generateFile(); */
