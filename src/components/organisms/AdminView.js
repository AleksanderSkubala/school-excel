import { useState, useContext, useEffect, useRef } from "react";
import { ServiceContext } from "../../providers/ServiceProvider";
import Button from '../atoms/Button';
import TextInput from "../atoms/TextInput";
import { collection, doc, onSnapshot, query, where, getDocs } from "@firebase/firestore";
import { db } from "../../initFirebase";
import { useForm } from "react-hook-form";
import TextInputRef from "../atoms/TextInputRef";

function AdminView() {
  const { register, handleSubmit, setValue } = useForm();
  const { service } = useContext(ServiceContext);
  const [errors, setErrors] = useState({});
  const [bookData, setBookData] = useState([]);
  const [curriculumExists, setCurriculumExists] = useState(false);
  const [classList, setClassList] = useState([]);
  const bookClassNameInput = useRef(null);
  const bookGroupInput = useRef(null);

  useEffect(() => {
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

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "curriculums", service.auth), (doc) => {
      if(doc.data()) {
        setCurriculumExists(true);
        setValue("firstName", doc.data().firstName);
        setValue("secondName", doc.data().secondName);
        setValue("curriculumSubject", doc.data().curriculumSubject);
        setValue("curriculumName", doc.data().curriculumName);
      }
    });

    return () => unsubscribe()
  }, []);

  const submitCurriculum = async ({ firstName, secondName, curriculumSubject, curriculumName }) => {
    setErrors({
      ...errors,
      firstName: !firstName ? "Proszę wypełnić to pole" : "",
      secondName: !secondName ? "Proszę wypełnić to pole" : "",
      curriculumSubject: !curriculumSubject ? "Proszę wypełnić to pole" : "",
      curriculumName: !curriculumName ? "Proszę wypełnić to pole" : "",
    });

    const curriculumObject = {
      firstName,
      secondName,
      curriculumSubject,
      curriculumName,
    };

    if(firstName && secondName && curriculumSubject && curriculumName) {
      service.setCurriculum(curriculumObject)
        .then(() => {
          alert("Poprawnie ustawiono program nauczania")
        });
    }

  }

  const submitData = async ({ bookName, bookGrade, bookSubject }) => {
    setErrors({
      ...errors,
      bookName: !bookName ? "Proszę wypełnić to pole" : "",
      bookGrade: !bookGrade ? "Proszę wypełnić to pole" : "",
      bookSubject: !bookSubject ? "Proszę wypełnić to pole" : "",
    });

    const bookObject = {
      book: bookName,
      grade: bookGrade,
      subject: bookSubject,
      classes: classList,
      author: service.auth,
    };

    service.newBook(bookObject);
  }

  const addClassObject = (e) => {
    e.preventDefault();
    const className = bookClassNameInput.current.value;
    setErrors({
      ...errors,
      className: !className ? "Proszę wypełnić to pole" : "",
    });

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

  const downloadCurriculumFile = async () => {
    const customQuery = query(collection(db, "curriculums"));
    const querySnapshot = await getDocs(customQuery);

    const curriculums = [];
    querySnapshot.forEach(doc => curriculums.push({
      ...doc.data(),
      id: doc.id,
    }));

    service.generateCurriculumFile(curriculums);
  }

  const downloadFile = async () => {
    const customQuery = query(collection(db, "books"));
    const querySnapshot = await getDocs(customQuery);
    const downloadBooksData = [];
    const downloadParsedData = [];

    querySnapshot.forEach(doc => downloadBooksData.push({
      ...doc.data(),
      id: doc.id,
    }));

    downloadBooksData.forEach(doc => {
      const object = doc;
      object.classes = JSON.parse(object.classes);
      downloadParsedData.push(object);
    });

    service.transferDataFromDB(downloadBooksData);
    service.generateFile();
  }

  return (
    <div className="w-screen min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="w-full min-h-full lg:w-3/4 lg:min-h-3/4 xl:w-1/2 p-10 rounded-lg bg-white flex items-center flex-col">
        <h1 className="text-3xl font-bold mb-8">Program nauczania</h1>
        <form onSubmit={handleSubmit(submitCurriculum)}>
          <div className="w-full max-w-lg flex flex-wrap mb-6">
            <TextInput register={register} error={errors.firstName} w="md:w-1/2" name="firstName" label="Twoje Imię" placeholder="np. Michał"/>
            <TextInput register={register} error={errors.secondName} w="md:w-1/2" name="secondName" label="Twoje Nazwisko" placeholder="np. Kowalski"/>
          </div>
          <div className="mb-6">
            <TextInput register={register} error={errors.curriculumSubject} name="curriculumSubject" label="Przedmiot" placeholder="n.p. Język angielski" />
          </div>
          <div className="mb-6">
            <TextInput register={register} error={errors.curriculumName} name="curriculumName" label="Nazwa programu - autor" placeholder="np. ABC - Jan Kowalski"/>
          </div>
          <div className="float-right mb-6">
            <Button secondary="true" type="reset">
              Anuluj
            </Button>
            <Button primary="true" type="submit">
              { curriculumExists ? 'Zmień podstawę' : 'Przypisz podstawę' }
            </Button>
          </div>
        </form>
        <button onClick={downloadCurriculumFile} className="p-3 mb-14 border-4 border-blue-300 border-dashed rounded text-lg text-blue-300 hover:text-blue-100 font-semibold">
          Pobierz listę programów
        </button>
        <h1 className="text-3xl font-bold mb-8">Lista podręczników</h1>
        <button onClick={downloadFile} className="p-3 mb-12 border-4 border-blue-300 border-dashed rounded text-lg text-blue-300 hover:text-blue-100 font-semibold">
          Pobierz listę podręczników
        </button>
        <form onSubmit={handleSubmit(submitData)} className="w-full max-w-lg">
          <div className="flex flex-wrap -mx-3 mb-6">
            <TextInput register={register} error={errors.bookName} label="Tytuł książki" name="bookName" placeholder="n.p. High Note 4" />
          </div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <TextInput register={register} error={errors.bookSubject} w="md:w-1/2 " name="bookSubject" label="Przedmiot" placeholder="n.p. Język angielski" />
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label htmlFor="bookGrade" className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                Klasa
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
            <TextInputRef w="md:w-2/5" refProp={bookClassNameInput} error={errors.className} name="bookClassName" label="Identyfikator oddziału" placeholder="n.p. 3_PC" />
            <TextInputRef w="md:w-2/5" refProp={bookGroupInput} name="bookGroup" label="Grupa" placeholder="n.p. 1/2" />
            <div className="w-full md:w-1/5 flex flex-col justify-center">
              <Button onClick={addClassObject} primary="true">
                Dodaj oddział
              </Button>
            </div>
          </div>
          {classList.length > 0 ? (
            <div>
              <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                Lista oddziałów:
              </p>
              <ol className="mt-4">
                {classList.map((classObject, id) => (
                  <li key={id} className="mb-2">
                    {classObject[0]}
                    {classObject[1] ? ' - ' + classObject[1].map(group => group) : null}
                    <Button onClick={(e) => removeClassObject(e, id)}>Usuń</Button>
                  </li>
                ))}
              </ol>
            </div>
          ) : null}
          <div className="float-right mt-8">
            <Button secondary="true" type="reset">
              Anuluj
            </Button>
            <Button primary="true" type="submit">
              Dodaj podręcznik
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
              <Button onClick={(e) => removeBookObject(e, id)}>Usuń</Button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default AdminView;
