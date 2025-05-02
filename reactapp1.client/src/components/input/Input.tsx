import { ChangeEvent } from "react";
import cls from "./Input.module.css"

interface Props{
    placeholder?: string,
    value?: string | number,
    onChange?: (e : ChangeEvent<HTMLInputElement>) => void,
    type?: "text" | "email" | "password"| "number",
    width? : string,
    min?: string | number
}

export default function Input({placeholder, value, onChange, type, width, min} : Props){
    if(!onChange) onChange = () =>{};
    return(
        <input min={`${min}`} style={{maxWidth: width}} className={cls.input} placeholder={placeholder} type={type} value={value} onChange={(e) => onChange(e)}/>
    )
}