export default function Button(props) {
  return (
    props.primary ? <button {...props} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded focus:outline-none focus:shadow-outline">{props.children}</button> :
    props.secondary ? <button {...props} className="flex-shrink-0 border-transparent border-4 text-blue-700 hover:text-blue-400 text-sm py-2 px-4 rounded">{props.children}</button> :
    <button {...props} className="rounded-full mx-5 bg-red-300 uppercase px-3 py-1 text-xs font-bold">{props.children}</button>
  );
};