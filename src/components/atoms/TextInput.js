export default function TextInput(props) {
  return (
    <div className={`${props.w} w-full px-3 mb-6 md:mb-0`}>
      <label htmlFor={props.name} className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
        {props.label}
      </label>
      <input ref={props.refProp} name={props.name} type="text" placeholder={props.placeholder} className={`${props.error ? "border-red-500 mb-3" : "border-gray-200"}  appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500`} />
      {props.error ? <p className="text-red-500 text-xs italic">{props.error}</p> : null}
      {props.description ? <p className="text-gray-600 mt-3 text-xs italic">{props.description}</p> : null}
    </div>
  );
}