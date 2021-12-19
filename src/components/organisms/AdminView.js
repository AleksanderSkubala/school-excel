import { useState, useContext, useEffect, useRef } from "react";
import { ServiceContext } from "../../providers/ServiceProvider";
import Button from '../atoms/Button';
import TextInput from "../atoms/TextInput";
import { collection, onSnapshot, query, where } from "@firebase/firestore";
import { db } from "../../initFirebase";
import { useForm } from "react-hook-form";
import TextInputRef from "../atoms/TextInputRef";

function AdminView() {
  const { register, handleSubmit } = useForm();
  const { service } = useContext(ServiceContext);
  const [bookData, setBookData] = useState([]);
  const [classList, setClassList] = useState([]);
  const bookClassNameInput = useRef(null);
  const bookGroupInput = useRef(null);

  useEffect(() => {
    console.log(service.auth);
    const customQuery = query(collection(db, "books"), where("author", "==", service.auth));
    const unsubscribe = onSnapshot(customQuery, (querySnapshot) => {
      const booksData = [];
      const parsedData = [];

      querySnapshot.forEach(doc => booksData.push({
        ...doc.data(),
        id: doc.id,
      }));

      booksData.forEach(doc => {
        const object = doc;
        object.classes = JSON.parse(object.classes);
        parsedData.push(object);
      });
      setBookData(parsedData);
    });

    return () => unsubscribe()
  }, []);

  const submitData = async ({ bookName, bookGrade, bookSubject }) => {
    const bookObject = {
      book: bookName,
      grade: bookGrade,
      subject: bookSubject,
      classes: classList,
      author: service.auth,
      // author: 'dSc. Aleksander Skubała',
    };

    service.newBook(bookObject);
  }

  const addClassObject = (e) => {
    e.preventDefault();
    const className = bookClassNameInput.current.value;
    const groups = bookGroupInput.current.value;
    const groupList = groups.split(',');

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
    service.removeBook(bookData[id]);
  };

  const downloadFile = () => {
    service.transferDataFromDB(bookData)
    service.generateFile();
  }

  return (
    <div className="w-screen min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="w-full min-h-full lg:w-3/4 lg:min-h-3/4 xl:w-1/2 p-10 rounded-lg bg-white flex items-center flex-col">
        <h1 className="text-3xl font-bold mb-8">Lista podręczników</h1>
        <button onClick={downloadFile} className="p-5 mb-12 border-4 border-blue-300 border-dashed rounded text-lg text-blue-300 hover:text-blue-100 font-semibold">
          Pobierz plik
        </button>
        <form onSubmit={handleSubmit(submitData)} className="w-full max-w-lg">
          <div className="flex flex-wrap -mx-3 mb-6">
            <TextInput register={register} label="Book name" name="bookName" placeholder="e.g. High Note 4" description="Please fill out this field." />
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <TextInput register={register} w="md:w-1/2 " name="bookSubject" label="Subject" placeholder="e.g. English" />
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label htmlFor="bookGrade" className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                Grade
              </label>
              <div className="relative">
                <select name="bookGrade" {...register("bookGrade", {required: true})} className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
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
            <TextInputRef w="md:w-2/5" refProp={bookClassNameInput} name="bookClassName" label="Class Name" placeholder="e.g. 3_PC" />
            <TextInputRef w="md:w-2/5" refProp={bookGroupInput} name="bookGroup" label="Group" placeholder="e.g. 1/2" />
            <div className="w-full md:w-1/5 flex flex-col justify-center">
              <Button onClick={addClassObject} primary="true">
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
            <Button secondary="true" type="reset">
              Cancel
            </Button>
            <Button primary="true" type="submit">
              Add a book
            </Button>
          </div>
        </form>

        <div className="w-full mt-20 grid grid-cols-1 md:grid-cols-3 gap-5">
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

export default AdminView;