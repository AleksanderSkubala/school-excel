import Service from "./service";
import { useState, useRef } from "react";
import Button from './components/atoms/Button';
import TextInput from "./components/atoms/TextInput";

function App() {
  const service = new Service();
  const [bookData, setBookData] = useState([]);
  const [classList, setClassList] = useState([]);
  const classInput = useRef();
  const groupInput = useRef();

  const submitData = (e) => {
    e.preventDefault();
    const formEl = e.target;

    const formData = new FormData(formEl);

    // const classes = [
    //   [ formData.get('bookClassName'), formData.get('bookGroup') !== '' ? [ formData.get('bookGroup') ] : null ]
    // ];

    const bookObject = {
      book: formData.get('bookName'),
      grade: formData.get('bookGrade'),
      subject: formData.get('bookSubject'),
      classes: classList,
      author: 'dSc. Aleksander Skubała'
    };

    const currentData = bookData.slice();
    currentData.push(bookObject);
    setBookData(currentData);
    // setClassList([]);
    console.log(currentData);
  }

  const addClassObject = (e) => {
    e.preventDefault();
    const className = classInput.current.value;
    const groups = groupInput.current.value;
    const groupList = groups.split(',');
    console.log(groupList);

    const currentClasses = classList.slice();
    currentClasses.push([
      className,
      groupList ? groupList : null,
    ]);

    setClassList(currentClasses);
  };

  const removeClassObject = (e, id) => {
    e.preventDefault();
    const newClasses = classList.slice();
    newClasses.splice(id, 1);
    setClassList(newClasses);
  }

  const removeBookObject = (e, id) => {
    e.preventDefault();
    const newBookData = bookData.slice();
    newBookData.splice(id, 1);
    setBookData(newBookData);
  };

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
            <TextInput label="Book name" name="bookName" placeholder="e.g. High Note 4" description="Please fill out this field." />
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <TextInput w="md:w-1/2 " name="bookSubject" label="Subject" placeholder="e.g. English" />
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
            <TextInput w="md:w-2/5" refProp={classInput} name="bookClassName" label="Class Name" placeholder="e.g. 3_PC" />
            <TextInput w="md:w-2/5" refProp={groupInput} name="bookGroup" label="Group" placeholder="e.g. 1/2" />
            <div className="w-full md:w-1/5 flex flex-col justify-center">
              <Button onClick={addClassObject} primary>
                Add a class
              </Button>
            </div>
          </div>
          {classList.length > 0 ? (
            <div>
              <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                Class List:
              </p>
              <ol className="mt-4">
                {classList.map((classObject, id) => (
                  <li key={id} className="mb-2">
                    {classObject[0]}
                    {classObject[1] ? ' - ' + classObject[1].map(group => group) : null}
                    <Button onClick={(e) => removeClassObject(e, id)}>Delete</Button>
                  </li>
                ))}
              </ol>
            </div>
          ) : null}
          <div className="float-right">
            <Button secondary type="reset">
              Cancel
            </Button>
            <Button primary type="submit">
              Add a book
            </Button>
          </div>
        </form>

        <div className="w-full mt-20 grid grid-cols-3 gap-5">
          {bookData.map((bookObject, id) => (
            <div className="w-full rounded shadow-md pb-5" key={id}>
              <div className="p-5 pb-3">
                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 mr-2 text-sm font-semibold text-gray-700">{ bookObject.subject }</span>
                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 mr-2 text-sm font-semibold text-gray-700">Klasa { bookObject.grade }</span>
              </div>
              <div className="px-6 pb-6">
                <div className="font-bold text-xl mb-1">{ bookObject.book }</div>
                <ol className="text-gray-700 text-base">
                  {bookObject.classes.map((classObject, id) =>
                    classObject[1] ? (
                      <li key={id}>{ classObject[0] + " - " + classObject[1] }</li>
                    ) : classObject[0]
                  )}
                </ol>
              </div>
              <Button onClick={(e) => removeBookObject(e, id)}>Delete</Button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default App;
