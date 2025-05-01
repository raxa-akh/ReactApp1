import cls from "./Button.module.css"

interface Props {
    text : string,
    onClick? : () => void,
    special?: boolean,
}

export default function Button({text, onClick, special} : Props){
    return <button className={`${cls.mainBtn} ${special ? cls.spec : ""}`} onClick={() => onClick()}>{text}</button>
}