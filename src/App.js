import Service from "./service";
import { useState } from "react";

function App() {
  const service = new Service();
  const [bookData, setBookData] = useState([]);

  const submitData = (e) => {
    e.preventDefault();
    const formEl = e.target;

    const formData = new FormData(formEl);

    const classes = [
      [ formData.get('bookClassName'), formData.get('bookGroup') !== '' ? [ formData.get('bookGroup') ] : null ]
    ];

    const bookObject = {
      book: formData.get('bookName'),
      grade: formData.get('bookGrade'),
      subject: formData.get('bookSubject'),
      classes,
      author: 'dSc. Aleksander Skubała'
    };

    const currentData = bookData.slice();
    currentData.push(bookObject);
    setBookData(currentData);
    console.log(currentData);
  }

  const downloadFile = () => {
    bookData.forEach(bookObject => service.newBook(bookObject));
    service.generateFile();
  }

  return (
    <div className="w-screen min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="w-full min-h-full lg:w-3/4 lg:min-h-3/4 xl:w-1/2 p-10 rounded-lg bg-white flex items-center flex-col">
        <h1 className="text-3xl font-bold mb-8">Lista podręczników</h1>
        <button onClick={downloadFile} className="p-5 mb-12 border-4 border-blue-300 border-dashed rounded text-lg text-blue-300 hover:text-blue-100 font-semibold">
          Pobierz plik
        </button>
        <form onSubmit={submitData} className="w-full max-w-lg">
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label htmlFor="bookName" className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                Book name
              </label>
              <input name="bookName" type="text" placeholder="e.g. High Note 4" className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" />
              <p className="text-gray-600 text-xs italic">Here's the name of the book that you'll use on your classes</p>
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-2">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label htmlFor="bookSubject" className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                Subject
              </label>
              <input name="bookSubject" type="text" placeholder="e.g. English" className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" />
            </div>
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label htmlFor="bookGrade" className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                Grade
              </label>
              <div className="relative">
                <select name="bookGrade" className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label htmlFor="bookClassName" className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                Class
              </label>
              <input name="bookClassName" type="text" placeholder="e.g. 3_PC" className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" />
              <p className="text-red-500 text-xs italic">Please fill out this field.</p>
            </div>
            <div className="w-full md:w-1/2 px-3">
              <label htmlFor="bookGroup" className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                Group
              </label>
              <input name="bookGroup" type="text" placeholder="e.g. 1/2" className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" />
            </div>
          </div>
          <div className="float-right">
            <button className="flex-shrink-0 border-transparent border-4 text-blue-700 hover:text-blue-400 text-sm py-2 px-4 rounded" type="reset">
              Cancel
            </button>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
              Add a book
            </button>
          </div>
        </form>

        <div className="w-full mt-20 grid grid-cols-3 gap-5">
          {bookData.map((bookObject, id) => (
            <div className="w-full rounded shadow-md" key={id}>
              <div className="p-5 pb-3">
                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 mr-2 text-sm font-semibold text-gray-700">{ bookObject.subject }</span>
                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 mr-2 text-sm font-semibold text-gray-700">Klasa { bookObject.grade }</span>
              </div>
              <div className="px-6 pb-6">
                <div className="font-bold text-xl mb-1">{ bookObject.book }</div>
                <p className="text-gray-700 text-base">
                  {bookObject.classes.map(classObject =>
                    classObject[1] ? classObject[0] + " - " + classObject[1] : classObject[0]
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
