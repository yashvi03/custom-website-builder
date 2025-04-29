const Button = ({children, onClick, type}) =>
{
    return(
        
        <button  className="inline-block rounded bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700"  onClick={onClick} type={type}>
            {children}
        </button>
    )
}

export default Button;