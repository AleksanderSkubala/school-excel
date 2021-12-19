export default function TextInputRef({ w, name, label, refProp, placeholder, error, description, registerOpt, ...rest }) {
  return (
    <div className={`${w} w-full px-3 mb-6 md:mb-0`}>
      <label htmlFor={name} className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
        {label}
      </label>
      <input name={name} ref={refProp} type="text" placeholder={placeholder} className={`${error ? "border-red-500 mb-3" : "border-gray-200"}  appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500`} {...rest} />
      {error ? <p className="text-red-500 text-xs italic">{error}</p> : null}
      {description ? <p className="text-gray-600 mt-3 text-xs italic">{description}</p> : null}
    </div>
  );
}