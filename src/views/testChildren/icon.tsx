import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";

const Icon = () => {
    const [params, setParams] = useState(0);
    const navigate = useNavigate();
    useEffect(() => {
        setTimeout(() => {
            setParams(2);
        }, 3000);
    }, [])
    return (
        <p onClick={() => {navigate('/container/title');}}>这是子组件2-Icon----{params}</p>
    );
}
export default Icon;