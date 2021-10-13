import './App.css';

function App() {
  return (
    <div className="w-screen h-screen bg-gray-100 flex justify-center items-center">
      <div className="w-full h-full lg:w-3/4 lg:h-3/4 xl:w-1/2 p-10 rounded-lg bg-white flex items-center flex-col">
        <h1 className="text-3xl font-bold mb-8">Lista podręczników</h1>
        <button className="p-5 mb-12 border-4 border-blue-300 border-dashed rounded text-lg text-blue-300 hover:text-blue-100 font-semibold">
          Dodaj podręcznik
        </button>
        <form className="w-full max-w-lg">
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="book-name">
                Book name
              </label>
              <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="book-name" type="text" placeholder="e.g. High Note 4" />
              <p className="text-gray-600 text-xs italic">Here's the name of the book that you'll use on your classes</p>
            </div>
          </div>
          <div className="flex flex-wrap -mx-3 mb-2">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="book-subject">
                Subject
              </label>
              <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="book-subject" type="text" placeholder="e.g. English" />
            </div>
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="book-grade">
                Grade
              </label>
              <div className="relative">
                <select className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="book-grade">
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
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="book-className">
                Class
              </label>
              <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="book-className" type="text" placeholder="e.g. 3_PC" />
              <p className="text-red-500 text-xs italic">Please fill out this field.</p>
            </div>
            <div className="w-full md:w-1/2 px-3">
              <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="book-group">
                Group
              </label>
              <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="book-group" type="text" placeholder="e.g. 1/2" />
            </div>
          </div>
          <div className="float-right">
            <button className="flex-shrink-0 border-transparent border-4 text-blue-700 hover:text-blue-400 text-sm py-2 px-4 rounded" type="button">
              Cancel
            </button>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
              Add a book
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
