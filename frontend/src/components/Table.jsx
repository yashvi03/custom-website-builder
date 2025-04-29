
const Table = ({cols, data }) => {
  return (
    <div>
      <table className="min-w-full divide-y-2 divide-gray-200  text-sm ">
        <thead className="ltr:text-left rtl:text-right">
          <tr>
            {cols.map((headerItem, index) => (
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900" key={index}>{headerItem.title}</th>
            ))}
          </tr>
        
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((item, index) => (
            <tr key={index}>
              {cols.map((col, key) => (
                <td className="whitespace-nowrap px-4 py-2 text-gray-700" key={key}>{col.render(item)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;


