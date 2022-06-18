import { addDoc, deleteDoc, setDoc, doc, collection } from '@firebase/firestore';
import writeXlsxFile from 'write-excel-file';
import { db } from '../initFirebase';

export default class Service {
  constructor() {
    this.usersBooks = [];
    this.excelData = [];
    this.auth = null;
  }

  setEmail(email) {
    return new Promise((resolve) => {
      this.auth = email;
      resolve();
    });
  }

  transferDataFromDB(dbData) {
    this.usersBooks = [];
    dbData.forEach(bookObject => {
      this.usersBooks.push(bookObject);
    });
    this.convertArrays();
  }

  setCurriculum(curriculumObject) {
    return new Promise((resolve, reject) => {
      const curriculumRef = doc(db, "curriculums", this.auth);

      setDoc(curriculumRef, curriculumObject, { merge: true })
        .then(() => resolve())
        .catch(() => reject());
    });
  }

  newBook(bookObject) {
    return new Promise((resolve, reject) => {
      const convertedObject = bookObject;
      if (typeof bookObject.classes !== 'string') {
        convertedObject.classes = JSON.stringify(convertedObject.classes);
      }

      addDoc(collection(db, "books"), convertedObject)
        .then(() => resolve())
        .catch(() => reject());
    });
  }

  removeBook(removedObject) {
    return new Promise((resolve, reject) => {
      deleteDoc(doc(db, "books", removedObject.id))
        .then(() => resolve())
        .catch(err => reject(err));
    });
  }

  convertArrays() {
    const convertedArray = [];

    this.usersBooks.forEach(book => {
      if (!convertedArray[book.grade]) convertedArray[book.grade] = [];

      convertedArray[book.grade].push(book);
    });

    const convertedJSON = [];

    for (const grade of convertedArray) {
      if (grade) {
        for (const book of grade) {
          for (const classObject of book.classes) {
            if (!convertedJSON[book.grade]) {
              convertedJSON[book.grade] = [];
            }

            const existingIndex = convertedJSON[book.grade].findIndex(element => (
              element.className === classObject[0] && element.subject === book.subject
            ));

            if (existingIndex !== -1) {
              if (classObject[1]) {
                classObject[1].forEach(group =>
                  convertedJSON[book.grade][existingIndex].book.push([group, book.book])
                );
              } else {
                convertedJSON[book.grade][existingIndex].book.push([null, book.book]);
              }
            }
            else {
              if (classObject[1]) {
                convertedJSON[book.grade].push({
                  className: classObject[0],
                  subject: book.subject,
                  book: classObject[1].map(group => [group, book.book]),
                });
              } else {
                convertedJSON[book.grade].push({
                  className: classObject[0],
                  subject: book.subject,
                  book: [[null, book.book]],
                });
              }
            }
          }

          convertedJSON[book.grade].sort((a, b) => {
            if (a.subject < b.subject) return -1;
            if (a.subject > b.subject) return 1;
            return 0;
          });

          convertedJSON[book.grade].sort((a, b) => {
            if (a.className < b.className) return -1;
            if (a.className > b.className) return 1;
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
    console.log(convertedJSON);
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
            if (group[0]) generatedString = generatedString.concat(group[0], ' - ', group[1], '\n');
            else generatedString = generatedString.concat(group[1], '\n');
          });
          return generatedString;
        },
      }
    ];

    const authorsSchema = [
      {
        column: 'Email',
        type: String,
        width: 50,
        borderStyle: 'thin',
        fontWeight: 'bold',
        value: (author) => author,
      },
    ];


    const gradesToGenerate = [];
    const sheetsToGenerate = [];
    const schemasToGenerate = [];
    this.excelData.forEach((gradeContent, gradeIndex) => {
      if (gradeContent) {
        gradesToGenerate.push(gradeContent);
        sheetsToGenerate.push(`Klasy ${gradeIndex}`);
        schemasToGenerate.push(schema);
      }
    });

    const authors = [];
    this.usersBooks.forEach(({ author }) => {
      if(authors.indexOf(author) === -1)
        authors.push(author);
    });

    sheetsToGenerate.push("Autorzy");
    gradesToGenerate.push(authors);
    schemasToGenerate.push(authorsSchema);

    await writeXlsxFile(gradesToGenerate, {
      schema: schemasToGenerate,
      sheets: sheetsToGenerate,
      headerStyle: {
        fontWeight: 'bold',
        align: 'center',
        borderStyle: 'thin',
      },
      fileName: 'podreczniki.xlsx'
    });
  }

  async generateCurriculumFile(curriculums) {
    const schema = [
      {
        column: 'Email',
        type: String,
        width: 50,
        borderStyle: 'thin',
        fontWeight: 'bold',
        value: ({ id }) => id,
      },
      {
        column: 'Nazwa programu - autor',
        type: String,
        width: 80,
        borderStyle: 'thin',
        value: ({ curriculumName }) => curriculumName,
      }
    ];

    await writeXlsxFile(curriculums, {
      schema: schema,
      fileName: 'programy.xlsx'
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
