import LeftArrow from "@/assets/arrow-left-solid.svg?react"
import RightArrow from "@/assets/arrow-right-solid.svg?react"
import cls from "./Navigation.module.css"
import { useNavigate } from "react-router-dom"

export default function Navigation(){
    const navigate = useNavigate();
    return(
        <div className={cls.arrows}>
                <button onClick={() => navigate(-1)} className={cls.arrowBtn}><LeftArrow width={15}/></button>
                <button onClick={() => navigate(1)} className={cls.arrowBtn}><RightArrow width={15}/></button>
            </div>
    )
}