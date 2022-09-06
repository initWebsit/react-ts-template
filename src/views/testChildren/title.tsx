import {useNavigate} from "react-router-dom";

const Title = () => {
    const navigate = useNavigate();
    return (
        <p onClick={() => {navigate('/container/icon');}}>这是子组件1-Title</p>
    );
}
export default Title;