import cls from "./Button.module.css"

interface Props {
    text : string,
    onClick? : () => void,
    error?: boolean,
    success?: boolean,
}

export default function Button({text, onClick, error, success} : Props){
    if(!onClick) onClick = () =>{};
    return <button className={`${cls.mainBtn} ${error ? cls.error : ""} ${success ? cls.success : ""}`} onClick={() => onClick()}>{text}</button>
}